"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const DEFAULT_AVATAR = "/assets/images/thumbnail_1.webp";

export default function ArticleComments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    getCurrentUserId();
    // eslint-disable-next-line
  }, [articleId]);

  const getCurrentUserId = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    setUserId(uid);
  };

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, users(full_name, profile_picture_url)")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });
    setComments(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please login to comment!");
    if (!content.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ article_id: articleId, user_id: userId, content }])
      .select("*, users(full_name, profile_picture_url)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data]);
      setContent("");
    } else {
      alert(error?.message || "Failed to post comment");
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!userId}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!userId || !content.trim()}
        >
          Comment
        </button>
      </form>

      <div className="space-y-2">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400 text-sm">No comments yet.</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded p-2 flex gap-2">
              <img
                src={c.users?.profile_picture_url || DEFAULT_AVATAR}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-sm">
                  {c.users?.full_name || "User"}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                </div>
                <div className="text-gray-700">{c.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
