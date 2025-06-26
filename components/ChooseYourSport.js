"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const bgColors = [
  "bg-blue-50",
  "bg-orange-50",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-purple-50",
  "bg-cyan-50",
  "bg-red-50",
  "bg-green-50",
  "bg-indigo-50",
  "bg-teal-50",
];

const ChooseYourSport = () => {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      const { data, error } = await supabase.from("roadmaps").select("*");
      setRoadmaps(Array.isArray(data) ? data : []);
    };
    fetchRoadmaps();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-3">Choose Your Sport</h1>
      <p className="text-gray-600 text-center mb-10">
        Discover personalized roadmaps for your athletic journey. Each sport
        includes step-by-step guidance, training plans, and opportunities
        tailored to your level.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {roadmaps.map((roadmap, idx) => (
          <Link key={roadmap.id} href={`/roadmaps/${roadmap.sport}`}>
            <div
              className={`p-6 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full ${
                bgColors[idx % bgColors.length]
              }`}
            >
              <h2 className="text-lg font-bold mb-1">{roadmap.sport}</h2>
              <p className="text-gray-700 text-sm mb-2">{roadmap.title}</p>
              <span className="text-xs text-gray-500 mb-2">
                {roadmap.athlete_count?.toLocaleString() || "0"} athletes
              </span>
              <div className="mt-auto">
                <span className="text-blue-600 font-medium hover:underline">
                  Explore Roadmap &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-2">
          Don&apos;t see your sport? We&apos;re adding new roadmaps every month!
        </p>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Request a Sport
        </button>
      </div>
    </div>
  );
};

export default ChooseYourSport;
