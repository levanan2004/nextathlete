"use client";
import { useState } from "react";
import DiscussionTab from "./DiscussionTab";
import FindMentorsTab from "./FindMentorsTab";

const TABS = [
  { key: "discussion", label: "Discussion" },
  { key: "findMentors", label: "Find Mentors" },
];

export default function CommunityPage() {
  const [tab, setTab] = useState("discussion");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-1">Community Center</h1>
      <p className="text-gray-600 mb-6">
        Connect, share experiences, and get advice from mentors and athletes.
      </p>
      <div className="flex gap-4 border-b mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`pb-2 px-3 font-semibold transition ${
              tab === t.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "discussion" && <DiscussionTab />}
      {tab === "findMentors" && <FindMentorsTab />}
    </div>
  );
}
