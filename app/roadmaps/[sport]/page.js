"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import RoadmapDetailCard from "@/components/RoadmapDetailCard";
import { supabase } from "@/lib/supabaseClient";

const RoadmapDetail = ({ params }) => {
  const { sport } = React.use(params);
  const decodedSport = decodeURIComponent(sport);
  console.log("sport param:", decodedSport);
  const [roadmap, setRoadmap] = useState(null);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [details, setDetails] = useState([]);
  const [tasksByDetail, setTasksByDetail] = useState({});

  // Lấy roadmap theo sport
  useEffect(() => {
    if (!sport) return;
    const fetchRoadmap = async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("sport", decodedSport);
      if (data && data.length > 0) setRoadmap(data[0]);
      else setRoadmap(null);
    };
    fetchRoadmap();
  }, [sport]);

  // Lấy roadmap_levels theo roadmap.id
  useEffect(() => {
    if (!roadmap?.id) return;
    const fetchLevels = async () => {
      const { data, error } = await supabase
        .from("roadmap_levels")
        .select("*")
        .eq("roadmap_id", roadmap.id);
      setLevels(Array.isArray(data) ? data : []);
      if (data && data.length > 0) setSelectedLevel(data[0].id);
    };
    fetchLevels();
  }, [roadmap]);

  // Lấy chi tiết bài tập theo roadmap_level_id
  useEffect(() => {
    if (!selectedLevel) return;
    const fetchDetails = async () => {
      const { data, error } = await supabase
        .from("roadmap_details")
        .select("*")
        .eq("roadmap_level_id", selectedLevel);
      setDetails(Array.isArray(data) ? data : []);
    };
    fetchDetails();
  }, [selectedLevel]);

  // Lấy tasks cho từng roadmap_detail
  useEffect(() => {
    if (!details.length) return;
    const fetchTasksForDetails = async () => {
      const tasksObj = {};
      await Promise.all(
        details.map(async (detail) => {
          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("roadmap_detail_id", detail.id);
          tasksObj[detail.id] = Array.isArray(data) ? data : [];
          console.log(`Tasks for detail ${detail.id}:`, tasksObj[detail.id]);
        })
      );
      setTasksByDetail(tasksObj);
    };
    fetchTasksForDetails();
  }, [details]);

  return (
    <div className="container mx-auto p-4 flex">
      <Head>
        <title>{roadmap ? roadmap.sport : sport} Roadmap</title>
      </Head>
      {/* Sidebar Levels */}
      <aside className="w-1/4 p-4 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Training Levels</h2>
        <ul>
          {levels.map((level) => (
            <li
              key={level.id}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedLevel === level.id ? "bg-blue-100" : "bg-white"
              } hover:bg-blue-50`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <span className="font-semibold">{level.level}</span>
              <br />
              <span className="text-gray-500 text-sm">
                {level.description} months
              </span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="w-3/4 p-4">
        <Link href="/roadmaps" className="text-blue-500 flex items-center mb-4">
          ← Back to Sports
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          {roadmap ? roadmap.sport : sport} Roadmap
        </h1>
        <p className="text-gray-600 mb-6">
          {roadmap?.overview ||
            "Master your skills with a comprehensive training program."}
        </p>
        {details.length > 0 ? (
          details.map((detail) => (
            <RoadmapDetailCard
              key={detail.id}
              detail={detail}
              tasks={tasksByDetail[detail.id] || []}
            />
          ))
        ) : (
          <p className="text-gray-500">Select a level to view details.</p>
        )}
      </main>
    </div>
  );
};

export default RoadmapDetail;
