"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const TABS = {
  INFO: "info",
  TOURNAMENTS: "tournaments",
  CHILDREN: "children",
};

function MyTournamentCard({ t }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-3 border">
      <div>
        <div className="font-semibold text-base">
          {t.tournaments.name || t.tournaments.title}
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {t.tournaments.sport} | {t.tournaments.location} |{" "}
          {t.tournaments.date
            ? new Date(t.tournaments.date).toLocaleDateString()
            : ""}
        </div>
        <div className="text-xs text-gray-500">
          Tham gia: {t.joined_at ? new Date(t.joined_at).toLocaleString() : ""}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${
            t.status === "active"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {t.status === "active"
            ? "Đang tham gia"
            : t.status === "completed"
            ? "Đã hoàn thành"
            : t.status}
        </span>
        <a
          href={`/tournaments/${t.tournaments.id}`}
          className="text-blue-600 hover:underline text-xs mt-2"
        >
          Xem chi tiết
        </a>
      </div>
    </div>
  );
}

export default function InformationPage() {
  const [tab, setTab] = useState(TABS.INFO);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  
  // For parent-child functionality
  const [parentData, setParentData] = useState(null);
  const [childData, setChildData] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [submittingStudentId, setSubmittingStudentId] = useState(false);
  const [studentIdError, setStudentIdError] = useState("");

  // Lấy user hiện tại và profile
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setLoading(false);
        return;
      }
      setUser(authData.user);

      // Lấy profile từ bảng users
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      setProfile(userData);
      setEditProfile(userData);
      setRole(userData?.role || "");
      setAvatarUrl(userData?.profile_picture_url || "");
      setLoading(false);

      // Nếu là student thì lấy tournaments
      if (userData?.role === "student") {
        fetchTournaments(authData.user.id);
      }
      
      // Nếu là parent thì lấy thông tin parent và con
      if (userData?.role === "parent") {
        fetchParentData(authData.user.id);
      }
    };
    fetchUser();
  }, []);

  // Lấy tournaments đã/đang tham gia
  const fetchTournaments = async (userId) => {
    const { data } = await supabase
      .from("tournament_participants")
      .select("status, joined_at, tournaments(*)")
      .eq("user_id", userId)
      .order("joined_at", { ascending: false });

    setTournaments(Array.isArray(data) ? data : []);
  };

  // Lấy thông tin parent và con (nếu có)
  const fetchParentData = async (userId) => {
    // Lấy thông tin parent từ bảng parents
    const { data: parentData } = await supabase
      .from("parents")
      .select("*")
      .eq("user_id", userId)
      .single();

    setParentData(parentData);

    // Nếu parent có id_students, lấy thông tin student
    if (parentData?.id_students) {
      const { data: studentData } = await supabase
        .from("users")
        .select("*")
        .eq("id", parentData.id_students)
        .single();
      
      setChildData(studentData);
    }
  };

  // Xử lý submit student ID
  const handleSubmitStudentId = async (e) => {
    e.preventDefault();
    setSubmittingStudentId(true);
    setStudentIdError("");

    try {
      // Trước tiên kiểm tra ID có tồn tại không
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", studentId)
        .single();

      if (userError || !userData) {
        setStudentIdError("Không tìm thấy người dùng với ID này.");
        setSubmittingStudentId(false);
        return;
      }

      // Kiểm tra role có phải student không
      if (userData.role !== "student") {
        setStudentIdError("ID nhập không hợp lệ.");
        setSubmittingStudentId(false);
        return;
      }

      const studentData = userData;

      // Cập nhật hoặc tạo mới record trong bảng parents
      if (parentData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("parents")
          .update({ 
            id_students: studentId,
            child_name: studentData.full_name 
          })
          .eq("user_id", user.id);

        if (updateError) {
          setStudentIdError("Có lỗi xảy ra khi cập nhật thông tin.");
          setSubmittingStudentId(false);
          return;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("parents")
          .insert({
            user_id: user.id,
            id_students: studentId,
            child_name: studentData.full_name
          });

        if (insertError) {
          setStudentIdError("Có lỗi xảy ra khi lưu thông tin.");
          setSubmittingStudentId(false);
          return;
        }
      }

      // Refresh parent data
      await fetchParentData(user.id);
      setStudentId("");
      alert("Đã liên kết thành công với học sinh!");
      
    } catch (error) {
      setStudentIdError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
    
    setSubmittingStudentId(false);
  };

  // Xử lý lưu thông tin
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update(editProfile)
      .eq("id", user.id);
    if (!error) {
      setProfile(editProfile);
      alert("Cập nhật thành công!");
    } else {
      alert("Có lỗi xảy ra: " + error.message);
    }
    setSaving(false);
  };

  // Xử lý upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    // Lấy phần mở rộng file
    const ext = file.name.split(".").pop();
    // Tạo tên file mới, tránh trùng
    const fileName = `${user.id}-${uuidv4()}.${ext}`;
    const filePath = `${fileName}`;

    // Kiểm tra file đã tồn tại chưa
    const { data: exist } = await supabase.storage
      .from("images")
      .list("", { search: fileName });
    if (exist && exist.some((f) => f.name === fileName)) {
      // Nếu trùng, đổi tên khác
      const fileName2 = `${user.id}-${uuidv4()}.${ext}`;
      await uploadAndSetAvatar(file, fileName2);
    } else {
      await uploadAndSetAvatar(file, fileName);
    }
    setUploading(false);
  };

  const uploadAndSetAvatar = async (file, fileName) => {
    // Upload file lên bucket images
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, { upsert: false });
    if (uploadError) {
      alert("Lỗi upload ảnh: " + uploadError.message);
      return;
    }
    // Lấy public URL
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData?.publicUrl;
    setAvatarUrl(publicUrl);

    // Update vào bảng users
    const { error } = await supabase
      .from("users")
      .update({ profile_picture_url: publicUrl })
      .eq("id", user.id);
    if (!error) {
      setProfile((p) => ({ ...p, profile_picture_url: publicUrl }));
      setEditProfile((p) => ({ ...p, profile_picture_url: publicUrl }));
      alert("Cập nhật ảnh thành công!");
    } else {
      alert("Lỗi cập nhật ảnh: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-500">
        Bạn cần đăng nhập để xem thông tin cá nhân.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-5 py-2 rounded-lg font-semibold ${
            tab === TABS.INFO
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab(TABS.INFO)}
        >
          Thông tin cá nhân
        </button>
        {role === "student" && (
          <button
            className={`px-5 py-2 rounded-lg font-semibold ${
              tab === TABS.TOURNAMENTS
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab(TABS.TOURNAMENTS)}
          >
            Giải đấu đã tham gia
          </button>
        )}
        {role === "parent" && (
          <button
            className={`px-5 py-2 rounded-lg font-semibold ${
              tab === TABS.CHILDREN
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab(TABS.CHILDREN)}
          >
            Thông tin con em
          </button>
        )}
      </div>

      {tab === TABS.INFO && (
        <form
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
          onSubmit={handleSave}
        >
          <div className="flex items-center gap-6 mb-2">
            <div className="relative">
              <Image
                width={100}
                height={100}
                src={avatarUrl || "/assets/images/thumbnail_1.webp"}
                alt="avatar"
                quality={90}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Đổi ảnh đại diện"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                </svg>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
            </div>
            <div>
              <div className="font-bold text-lg">{editProfile.full_name}</div>
              <div className="text-gray-500 text-sm">{profile.email}</div>
            </div>
          </div>
          <div>
            <div>
              <label className="block font-semibold mb-1">Id</label>
              <input
                className="border px-3 py-2 rounded w-full bg-gray-100"
                value={profile.id || ""}
                disabled
              />
            </div>
            <label className="block font-semibold mb-1">Họ tên</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={editProfile.full_name || ""}
              onChange={(e) =>
                setEditProfile((p) => ({ ...p, full_name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="border px-3 py-2 rounded w-full bg-gray-100"
              value={profile.email || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={editProfile.phone || ""}
              onChange={(e) =>
                setEditProfile((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Địa chỉ</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={editProfile.address || ""}
              onChange={(e) =>
                setEditProfile((p) => ({ ...p, address: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Vai trò</label>
            <input
              className="border px-3 py-2 rounded w-full bg-gray-100"
              value={profile.role || ""}
              disabled
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mt-2"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </form>
      )}

      {tab === TABS.TOURNAMENTS && role === "student" && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Các giải đấu đã/đang tham gia
          </h2>
          {tournaments.length === 0 ? (
            <div className="text-gray-500">Chưa có giải đấu nào.</div>
          ) : (
            <div>
              {tournaments.map((t) => (
                <MyTournamentCard key={t.tournaments.id + t.joined_at} t={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === TABS.CHILDREN && role === "parent" && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">Thông tin con em</h2>
          
          {!parentData?.id_students ? (
            <div>
              <p className="text-gray-600 mb-4">
                Vui lòng nhập ID của học sinh để liên kết với tài khoản của bạn:
              </p>
              <form onSubmit={handleSubmitStudentId} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">ID Học sinh</label>
                  <input
                    type="text"
                    className="border px-3 py-2 rounded w-full"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Nhập ID học sinh"
                    required
                  />
                  {studentIdError && (
                    <p className="text-red-500 text-sm mt-1">{studentIdError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  disabled={submittingStudentId || !studentId.trim()}
                >
                  {submittingStudentId ? "Đang kiểm tra..." : "Liên kết"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              {childData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      width={80}
                      height={80}
                      src={childData.profile_picture_url || "/assets/images/thumbnail_1.webp"}
                      alt="Child avatar"
                      quality={90}
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{childData.full_name}</h3>
                      <p className="text-gray-500">{childData.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">ID</label>
                      <div className="border px-3 py-2 rounded bg-gray-50">
                        {childData.id}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Họ tên</label>
                      <div className="border px-3 py-2 rounded bg-gray-50">
                        {childData.full_name}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Email</label>
                      <div className="border px-3 py-2 rounded bg-gray-50">
                        {childData.email}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Số điện thoại</label>
                      <div className="border px-3 py-2 rounded bg-gray-50">
                        {childData.phone || "Chưa cập nhật"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-1">Địa chỉ</label>
                      <div className="border px-3 py-2 rounded bg-gray-50">
                        {childData.address || "Chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Ngày tạo tài khoản</label>
                      <div className="border px-3 py-2 rounded bg-gray-50">
                        {childData.created_at ? new Date(childData.created_at).toLocaleDateString() : "Không có thông tin"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Lưu ý:</strong> Thông tin này chỉ để xem. Để thay đổi thông tin của con em, 
                      vui lòng yêu cầu con em đăng nhập vào tài khoản của mình và cập nhật.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Đang tải thông tin học sinh...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
