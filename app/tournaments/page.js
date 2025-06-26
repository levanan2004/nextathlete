"use client";
import { useEffect, useState } from "react";
import TournamentList from "../../components/TurnamentList";
import { supabase } from "@/lib/supabaseClient";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      const { data, error } = await supabase.from("tournaments").select("*");
      setTournaments(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchTournaments();
  }, []);

  return (
    <div className="bg-black min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-10 pb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-purple-500 to-purple-900 bg-clip-text text-transparent">
            Discover Tournaments & Opportunities
          </h2>
          <div className="text-gray-300 text-lg mb-6">
            Find competitions, showcases, and events to take your athletic
            career to the next level
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center mb-8">
            <input
              type="text"
              placeholder="Search tournaments, sports, or locations..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white text-base outline-none"
            />
            <button className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-200">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Filters
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-xl text-gray-300">
              {tournaments.length} Tournaments Found
            </div>
            <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-base outline-none">
              <option>Sort by Date</option>
              <option>Sort by Rating</option>
              <option>Sort by Price</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">
            Loading tournaments...
          </div>
        ) : (
          <TournamentList tournaments={tournaments} />
        )}
      </div>
    </div>
  );
}
