"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BrowseVideosTab from "@/components/showcase/BrowseVideosTab";
import UploadVideoTab from "@/components/showcase/UploadVideoTab";
import MyVideosTab from "@/components/showcase/MyVideosTab";

const ShowcasePage = () => {
  const [tab, setTab] = useState("browse");
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStudent = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsStudent(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("students")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      setIsStudent(!!data);
      setLoading(false);
    };
    checkStudent();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
        Video Showcase
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Share your training videos and discover talent from athletes worldwide
      </p>
      <div className="flex gap-2 border-b mb-8">
        <button
          className={`pb-3 px-4 font-semibold transition ${
            tab === "browse"
              ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setTab("browse")}
        >
          Browse Videos
        </button>
        {isStudent && (
          <button
            className={`pb-3 px-4 font-semibold transition ${
              tab === "upload"
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setTab("upload")}
          >
            Upload Video
          </button>
        )}
        <button
          className={`pb-3 px-4 font-semibold transition ${
            tab === "my"
              ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setTab("my")}
        >
          My Videos
        </button>
      </div>
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
        ) : (
          <>
            {tab === "browse" && <BrowseVideosTab />}
            {tab === "upload" && isStudent && <UploadVideoTab />}
            {tab === "my" && <MyVideosTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowcasePage;
