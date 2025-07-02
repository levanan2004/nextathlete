"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import AddRoadmapForm from "../../components/admin/AddRoadmapForm";
import AddRoadmapLevelForm from "../../components/admin/AddRoadmapLevelForm";
import AddRoadmapDetailForm from "../../components/admin/AddRoadmapDetailForm";
import AddTaskForm from "../../components/admin/AddTaskForm";

const tabs = [
  { key: "roadmap", label: "Roadmaps" },
  { key: "level", label: "Roadmap Levels" },
  { key: "detail", label: "Roadmap Details" },
  { key: "task", label: "Tasks" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [refresh, setRefresh] = useState(0); // for triggering refresh after add
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/");
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error || !data || data.role !== "admin") {
        router.replace("/");
        return;
      }
      setChecking(false);
    }
    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">Checking permission...</div>
      </div>
    );
  }

  const handleSuccess = () => setRefresh((r) => r + 1);

  return (
    <div className="min-h-screen bg-black text-white px-0 md:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-white via-purple-500 to-purple-900 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-300 mb-8">
          Manage Roadmaps, Levels, Details, and Tasks for the platform.
        </p>
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-t-lg font-bold text-lg border-b-4 transition-all duration-200 focus:outline-none
                ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-700 to-purple-900 text-white border-purple-500 shadow-lg"
                    : "bg-gray-900 text-purple-300 border-transparent hover:bg-purple-900 hover:text-white"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="bg-[#15192c] rounded-2xl shadow-lg p-8 border border-gray-800 min-h-[400px]">
          {activeTab === "roadmap" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">
                Add Roadmap
              </h2>
              <AddRoadmapForm onSuccess={handleSuccess} />
            </div>
          )}
          {activeTab === "level" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">
                Add Roadmap Level
              </h2>
              <AddRoadmapLevelForm onSuccess={handleSuccess} />
            </div>
          )}
          {activeTab === "detail" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">
                Add Roadmap Detail
              </h2>
              <AddRoadmapDetailForm onSuccess={handleSuccess} />
            </div>
          )}
          {activeTab === "task" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Add Task</h2>
              <AddTaskForm onSuccess={handleSuccess} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
