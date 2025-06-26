"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const bgColors = ["bg-gray-300"];

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
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-purple-500 to-purple-900 bg-clip-text text-transparent">
        Choose Your Sport
      </h2>
      <p className="text-gray-300 text-center mb-10">
        Discover personalized roadmaps for your athletic journey. Each sport
        includes step-by-step guidance, training plans, and opportunities
        tailored to your level.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
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
      <div className="text-center w-full rounded-2xl bg-gradient-to-br from-purple-900 via-black to-[#111827] py-20">
        <p className="text-gray-300 mb-2">
          Don&apos;t see your sport? We&apos;re adding new roadmaps every month!
        </p>
        <button className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
          Request a Sport
        </button>
      </div>
    </div>
  );
};

export default ChooseYourSport;
