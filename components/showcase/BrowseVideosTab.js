"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

// Modal hiển thị thông tin user
function UserModal({ user, open, onClose }) {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <div className="font-bold text-xl mb-1">
            <Image
              width={20}
              height={20}
              src={
                user.profile_picture_url || "/assets/images/thumbnail_1.webp"
              }
              alt={user.full_name || "User"}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mb-3"
            />
          </div>
          <div className="font-bold text-xl mb-1">{user.full_name}</div>
          <div className="text-sm text-gray-500 mb-1">{user.role}</div>
          <div className="text-xs text-gray-400 mb-2">{user.location}</div>
          <div className="mb-2">
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-blue-700">{user.email}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Phone:</span>{" "}
            <span>{user.phone || "N/A"}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Address:</span>{" "}
            <span>{user.address || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const BrowseVideosTab = () => {
  const [videos, setVideos] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [search, setSearch] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchVideosAndSports = async () => {
      // Lấy video và join sang users để lấy avatar, tên, v.v.
      const { data: videosData } = await supabase
        .from("videos")
        .select(
          `
          *,
          users (
            id,
            full_name,
            profile_picture_url,
            location,
            email,
            phone,
            address,
            role
          )
        `
        )
        .order("uploaded_at", { ascending: false });

      setVideos(videosData || []);

      // Lấy danh sách sport duy nhất từ video
      const uniqueSports = [
        ...new Set((videosData || []).map((v) => v.sport).filter(Boolean)),
      ];
      setSports(uniqueSports);
    };
    fetchVideosAndSports();
  }, []);

  // Lọc video theo sport và search
  const filteredVideos = videos.filter((video) => {
    const matchSport = selectedSport ? video.sport === selectedSport : true;
    const matchSearch = search
      ? (video.title + " " + video.description + " " + (video.sport || ""))
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;
    return matchSport && matchSearch;
  });

  // Coach Picks: video có trường coach_pick === true
  const coachPicks = videos.filter((v) => v.coach_pick);

  // Trending This Week: video có views cao nhất trong 7 ngày gần nhất
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const trendingThisWeek = videos
    .filter((v) => v.uploaded_at && new Date(v.uploaded_at) >= oneWeekAgo)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Xử lý khi click vào avatar
  const handleAvatarClick = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
    setSelectedUser(null);
  };

  // Hàm render avatar và tên người đăng
  const renderUploader = (video) => (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => handleAvatarClick(video.users)}
      title={video.users?.full_name}
    >
      <Image
        width={20}
        height={20}
        src={
          video.users?.profile_picture_url || "/assets/images/thumbnail_1.webp"
        }
        alt={video.users?.full_name || "User"}
        className="w-8 h-8 rounded-full object-cover border"
      />
      <span className="text-xs text-gray-700 font-semibold">
        {video.users?.full_name || "Unknown"}
      </span>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search videos, athletes, or skills..."
            className="border px-4 py-2 rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="border px-4 py-2 rounded-lg"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">All Sports</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coach Picks */}
      {coachPicks.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2 mt-6">
            <span className="text-xl font-bold">🏅 Coach Picks</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
              Recommended
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {coachPicks.slice(0, 3).map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-0 overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <video
                    src={video.video_url}
                    controls
                    className="w-full h-48 object-cover"
                    preload="metadata"
                    style={{ background: "#000" }}
                  />
                  <span className="absolute top-2 left-2 bg-yellow-400 text-xs text-white px-2 py-1 rounded font-semibold shadow">
                    ★ Coach Pick
                  </span>
                  <div className="absolute bottom-2 left-2">
                    {renderUploader(video)}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
                    <span className="flex items-center gap-1">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M12 21c-4.97 0-9-3.582-9-8 0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.418-4.03 8-9 8z"
                        />
                        <circle cx="12" cy="13" r="4" fill="currentColor" />
                      </svg>
                      {video.views?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                      {video.sport}
                    </span>
                    <span className="text-xs text-gray-400">
                      {video.uploaded_at
                        ? new Date(video.uploaded_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trending This Week */}
      {trendingThisWeek.length > 0 && (
        <>
          <div className="text-xl font-bold mb-2 mt-8">
            🔥 Trending This Week
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {trendingThisWeek.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-0 overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <video
                    src={video.video_url}
                    controls
                    className="w-full h-36 object-cover"
                    preload="metadata"
                    style={{ background: "#000" }}
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  {renderUploader(video)}
                  <h3 className="font-bold text-base mb-1">{video.title}</h3>
                  <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
                    <span className="flex items-center gap-1">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M12 21c-4.97 0-9-3.582-9-8 0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.418-4.03 8-9 8z"
                        />
                        <circle cx="12" cy="13" r="4" fill="currentColor" />
                      </svg>
                      {video.views?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                      {video.sport}
                    </span>
                    <span className="text-xs text-gray-400">
                      {video.uploaded_at
                        ? new Date(video.uploaded_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All Videos */}
      <h2 className="font-bold text-xl mb-4">
        All Videos{" "}
        <span className="text-base font-normal text-gray-500">
          ({filteredVideos.length})
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-0 overflow-hidden flex flex-col"
          >
            <div className="relative">
              <video
                src={video.video_url}
                controls
                className="w-full h-48 object-cover"
                preload="metadata"
                style={{ background: "#000" }}
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              {renderUploader(video)}
              <h3 className="font-bold text-lg mb-1">{video.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M12 21c-4.97 0-9-3.582-9-8 0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.418-4.03 8-9 8z"
                    />
                    <circle cx="12" cy="13" r="4" fill="currentColor" />
                  </svg>
                  {video.views?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {video.sport}
                </span>
                <span className="text-xs text-gray-400">
                  {video.uploaded_at
                    ? new Date(video.uploaded_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredVideos.length === 0 && (
        <div className="text-center text-gray-400 mt-10">No videos found.</div>
      )}
      <UserModal
        user={selectedUser}
        open={userModalOpen}
        onClose={handleCloseUserModal}
      />
    </div>
  );
};

export default BrowseVideosTab;
