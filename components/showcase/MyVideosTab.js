"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const MyVideosTab = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVideos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setVideos([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });
      setVideos(data || []);
      setLoading(false);
    };
    fetchMyVideos();
  }, []);

  return (
    <div>
      <h2 className="font-bold text-xl mb-4">My Uploaded Videos</h2>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : videos.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          You haven&apos;t uploaded any videos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-0 overflow-hidden flex flex-col"
            >
              <video
                src={video.video_url}
                controls
                className="w-full h-48 object-cover"
                preload="metadata"
                style={{ background: "#000" }}
              />
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
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
      )}
    </div>
  );
};

export default MyVideosTab;
