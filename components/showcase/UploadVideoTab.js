"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

const UploadVideoTab = () => {
  const [sports, setSports] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy danh sách sports từ bảng roadmaps
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase.from("roadmaps").select("sport");
      if (data) {
        // Lọc trùng và loại null/empty
        const uniqueSports = [
          ...new Set(data.map((item) => item.sport).filter(Boolean)),
        ];
        setSports(uniqueSports);
      }
    };
    fetchSports();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!file || !title || !sport || !skillLevel) {
      setMessage("Please fill all required fields.");
      return;
    }
    setUploading(true);

    // Lấy user hiện tại
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("You must be signed in.");
      setUploading(false);
      return;
    }

    // Kiểm tra user có phải student không
    const { data: student } = await supabase
      .from("students")
      .select("user_id, videos_uploaded_count")
      .eq("user_id", user.id)
      .single();
    if (!student) {
      setMessage("Only students can upload videos.");
      setUploading(false);
      return;
    }

    // Upload video lên Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(fileName, file);

    if (uploadError) {
      setMessage("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Lấy public URL video
    const { data: publicUrlData } = supabase.storage
      .from("videos")
      .getPublicUrl(fileName);
    const videoUrl = publicUrlData.publicUrl;

    // Lưu metadata vào bảng videos
    const { error: insertError } = await supabase.from("videos").insert([
      {
        user_id: user.id,
        title,
        description,
        sport,
        video_url: videoUrl,
        skill_level: skillLevel,
        uploaded_at: new Date().toISOString(),
        views: 0,
      },
    ]);

    if (insertError) {
      setMessage("Save metadata failed: " + insertError.message);
      setUploading(false);
      return;
    }

    // Tăng videos_uploaded_count cho students (không dùng supabase.raw)
    const currentCount = student.videos_uploaded_count || 0;
    await supabase
      .from("students")
      .update({ videos_uploaded_count: currentCount + 1 })
      .eq("user_id", user.id);

    setMessage("Upload successful!");
    setTitle("");
    setDescription("");
    setSport("");
    setSkillLevel("");
    setFile(null);
    setUploading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
      <h2 className="font-bold text-xl mb-4">Upload Your Training Video</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center mb-2">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="video-upload"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 16V8M8 12l4-4 4 4"
                stroke="#888"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="#888"
                strokeWidth="2"
              />
            </svg>
            <span className="mt-2 text-gray-700">
              Drop your video here or click to browse
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Maximum file size: 100MB. Supported formats: MP4, MOV, AVI
            </span>
            {file && (
              <span className="mt-2 text-sm text-green-600">{file.name}</span>
            )}
          </label>
        </div>
        <div>
          <label className="font-semibold block mb-1">Video Title</label>
          <input
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Give your video a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Description</label>
          <textarea
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Describe what you're working on, techniques used, or goals for this training session"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="font-semibold block mb-1">Sport</label>
            <select
              className="border rounded-lg px-4 py-2 w-full"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            >
              <option value="">Select sport</option>
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="font-semibold block mb-1">Skill Level</label>
            <select
              className="border rounded-lg px-4 py-2 w-full"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="">Select level</option>
              {skillLevels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex-1"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold flex-1"
            disabled={uploading}
          >
            Save Draft
          </button>
        </div>
        {message && (
          <div className="mt-2 text-sm text-center text-blue-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadVideoTab;
