"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const TABS = {
  INFO: "info",
  TOURNAMENTS: "tournaments",
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
    };
    fetchUser();
    // eslint-disable-next-line
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
      </div>

      {tab === TABS.INFO && (
        <form
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
          onSubmit={handleSave}
        >
          <div className="flex items-center gap-6 mb-2">
            <div className="relative">
              <img
                src={avatarUrl || "/assets/images/thumbnail_1.webp"}
                alt="avatar"
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
    </div>
  );
}
