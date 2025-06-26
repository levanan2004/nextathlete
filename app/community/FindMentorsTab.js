"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Modal hiển thị tất cả thông tin user (coach)
function CoachModal({ coach, open, onClose }) {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!coach?.user_id || !open) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", coach.user_id)
        .single();
      setUserDetail(data);
      setLoading(false);
    };
    fetchUserDetail();
  }, [coach, open]);

  if (!open || !coach) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={
                userDetail?.profile_picture_url ||
                "/assets/images/thumbnail_1.webp"
              }
              alt={userDetail?.full_name || "Coach"}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mb-3"
            />
            <div className="font-bold text-xl mb-1">
              {userDetail?.full_name}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              {coach.academy_name}
            </div>
            <div className="text-xs text-gray-400 mb-2">
              {userDetail?.location}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span>{" "}
              <span className="text-blue-700">{userDetail?.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Phone:</span>{" "}
              <span>{userDetail?.phone || "N/A"}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Address:</span>{" "}
              <span>{userDetail?.address || "N/A"}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Role:</span>{" "}
              <span>{userDetail?.role || "N/A"}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Experience:</span>{" "}
              <span className="text-blue-700">
                {coach.experience_years} years
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Specialization:</span>{" "}
              <span>
                {Array.isArray(coach.specialization)
                  ? coach.specialization.join(", ")
                  : coach.specialization || ""}
              </span>
            </div>
            <div className="mb-2 text-gray-700">{coach.bio}</div>
            <div className="mb-2">
              <span className="font-semibold">Contact:</span>{" "}
              <a
                href={`mailto:${coach.contact_email || userDetail?.email}`}
                className="text-blue-600 hover:underline"
              >
                {coach.contact_email || userDetail?.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FindMentorsTab() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data, error } = await supabase
        .from("coaches")
        .select(
          `
          user_id,
          academy_name,
          bio,
          contact_email,
          experience_years,
          specialization,
          users (
            full_name,
            profile_picture_url,
            location,
            email
          )
        `
        )
        .order("experience_years", { ascending: false });

      setCoaches(data || []);
      setLoading(false);
    };
    fetchCoaches();
  }, []);

  const handleOpenModal = (coach) => {
    setSelectedCoach(coach);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCoach(null);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">Find Your Mentor</h2>
      <div className="text-gray-500 mb-6">
        Connect with experienced athletes and coaches who can guide your journey
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coaches.map((coach) => (
            <div
              key={coach.user_id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4 mb-4 w-full">
                <img
                  src={
                    coach.users?.profile_picture_url ||
                    "/assets/images/thumbnail_1.webp"
                  }
                  alt={coach.users?.full_name || "Coach"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">
                    {coach.users?.full_name || coach.academy_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {coach.academy_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {coach.users?.location}
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Experience:</span>{" "}
                <span className="text-blue-700">
                  {coach.experience_years} years
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Specialization:</span>{" "}
                <span>
                  {Array.isArray(coach.specialization)
                    ? coach.specialization.join(", ")
                    : coach.specialization || ""}
                </span>
              </div>
              <div className="mb-2 text-gray-700 line-clamp-3">{coach.bio}</div>
              <div className="mb-2 text-xs text-gray-500">
                <span className="font-semibold">Contact:</span>{" "}
                <a
                  href={`mailto:${coach.contact_email || coach.users?.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {coach.contact_email || coach.users?.email}
                </a>
              </div>
              <div className="flex gap-2 w-full mt-auto pt-2">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-bold transition"
                  onClick={() => handleOpenModal(coach)}
                >
                  Connect
                </button>
                <button
                  className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold hover:bg-gray-50 transition"
                  onClick={() => handleOpenModal(coach)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && coaches.length === 0 && (
        <div className="text-center text-gray-400 py-10">No mentors found.</div>
      )}
      <CoachModal
        coach={selectedCoach}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
