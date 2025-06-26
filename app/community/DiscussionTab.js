"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ArticleComments from "@/components/ArticleComments";

export default function DiscussionTab() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // eslint-disable-next-line
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*, users(full_name, profile_picture_url, role, location)")
      .order("published_at", { ascending: false });
    setArticles(Array.isArray(data) ? data : []);
  };

  const filtered = articles.filter(
    (a) =>
      (!a.tags || !a.tags.includes("success")) &&
      (!a.tags || !a.tags.includes("mentor")) &&
      (a.title + " " + a.content).toLowerCase().includes(search.toLowerCase())
  );

  const handleNewDiscussion = () => {
    if (!user) {
      router.push("/auth/login");
    } else {
      router.push("/community/new-discussion");
    }
  };

  const toggleComments = (articleId) => {
    setOpenComments((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="border px-4 py-2 rounded-lg flex-1"
          placeholder="Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={handleNewDiscussion}
        >
          + New
        </button>
      </div>
      <div className="space-y-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  a.users?.profile_picture_url ||
                  "/assets/images/thumbnail_1.webp"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
              <div>
                <div className="font-semibold">{a.users?.full_name}</div>
                <div className="text-xs text-gray-500">
                  {a.users?.location || ""} ·{" "}
                  {a.published_at
                    ? new Date(a.published_at).toLocaleString()
                    : ""}
                </div>
              </div>
              <div className="ml-auto flex flex-wrap gap-1">
                {a.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">{a.title}</div>
              <div className="text-gray-700 text-sm line-clamp-2">
                {a.content}
              </div>
            </div>
            <div className="flex gap-6 text-gray-500 text-sm mt-2 items-center">
              <span>👁 {a.views}</span>
              <span>👍 {a.likes}</span>
              <button
                className="flex items-center gap-1 text-blue-600 hover:underline ml-2"
                onClick={() => toggleComments(a.id)}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.38 8.38 0 0112.5 3c4.7 0 8.5 3.8 8.5 8.5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Comment</span>
              </button>
            </div>
            {openComments[a.id] && <ArticleComments articleId={a.id} />}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No discussions found.
          </div>
        )}
      </div>
    </div>
  );
}
