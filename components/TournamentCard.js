"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function TournamentCard({ t }) {
  const percent = Math.round((t.participants / t.maxParticipants) * 100);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        // Lấy role từ bảng users
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();
        setRole(userData?.role || "");
        // Kiểm tra đã đăng ký chưa
        const { data: joined } = await supabase
          .from("tournament_participants")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("tournament_id", t.id)
          .maybeSingle();
        setRegistered(!!joined);
      }
    };
    fetchUser();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (role !== "student") {
      alert("Chỉ học sinh mới được đăng ký giải đấu này!");
      return;
    }
    setRegistering(true);
    const { error } = await supabase
      .from("tournament_participants")
      .insert([{ user_id: user.id, tournament_id: t.id, status: "active" }]);
    setRegistering(false);
    if (!error) {
      setRegistered(true);
      alert("Đăng ký thành công!");
    } else {
      alert("Đăng ký thất bại: " + error.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="relative">
        <Image
          width={20}
          height={20}
          src={`/assets/images/${t.thumbnail_url}`}
          alt={t.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 left-3">
          {t.verified && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
              <span className="text-base">★</span> Verified
            </span>
          )}
        </div>
        <button className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="#888"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 21l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
          </svg>
        </button>
        <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
          {t.sport}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="font-bold text-xl mb-1">{t.title}</div>
        <div className="text-gray-500 text-sm mb-2">by {t.org}</div>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-lg">★</span>
          <span className="font-semibold">{t.rating}</span>
          <span className="text-gray-400 text-sm">({t.reviews})</span>
        </div>
        <div className="text-gray-700 text-[15px] mb-3">{t.description}</div>
        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-3">
          <span className="flex items-center gap-1">
            <span>📍</span>
            {t.location}
          </span>
          <span className="flex items-center gap-1">
            <span>📅</span>
            {new Date(t.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <span>💲</span>${t.price}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-3">
          <span className="flex items-center gap-1">
            <span>👥</span>Ages {t.age}
          </span>
        </div>
        <div className="mb-2 font-semibold text-sm">Participants</div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-orange-400 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {t.participants}/{t.maxParticipants}
          </span>
        </div>
        <div className="mb-2 font-semibold text-sm">Prizes & Benefits:</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {(t.prizes ? t.prizes.split(",").map((p) => p.trim()) : []).map(
            (p, i) => (
              <span
                key={i}
                className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-semibold"
              >
                {p}
              </span>
            )
          )}
        </div>
        <div className="mt-auto flex gap-2">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-bold flex items-center justify-center gap-2 transition"
            onClick={handleRegister}
            disabled={registering || registered}
          >
            <span>🏆</span>
            {registered
              ? "Đã đăng ký"
              : registering
              ? "Đang đăng ký..."
              : "Register Interest"}
          </button>
          <a
            href="#"
            className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center hover:bg-gray-50"
            title="Open details"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
              <polyline points="15 19 19 19 19 15" />
              <line x1="19" y1="19" x2="12" y2="12" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
