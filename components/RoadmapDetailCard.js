import React, { useState, useEffect } from "react";

const RoadmapDetailCard = ({ detail, tasks = [] }) => {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    setCompleted([]); // Reset khi detail hoặc tasks thay đổi
  }, [detail, tasks]);

  const handleToggle = (taskId) => {
    setCompleted((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Tính phần trăm progress
  const percent = tasks.length
    ? Math.round((completed.length / tasks.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow p-8 mb-8 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-2xl mb-1">{detail.exercise_name}</h3>
          <p className="text-gray-600 text-base">{detail.description}</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-base hover:bg-blue-700 flex items-center gap-2 mt-1 shadow-sm">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>
          Watch Video
        </button>
      </div>
      <hr className="my-4 text-gray-300" />
      <div>
        <div className="font-semibold mb-3 text-base">Practice Tasks:</div>
        <ul className="space-y-3">
          {tasks.length === 0 ? (
            <li className="text-gray-500">No tasks available.</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="flex items-center">
                <button
                  aria-label="Toggle complete"
                  onClick={() => handleToggle(task.id)}
                  className="mr-3 focus:outline-none"
                >
                  {completed.includes(task.id) ? (
                    // Check icon
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-green-600 bg-white">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  ) : (
                    // Radio icon
                    <span className="inline-block w-6 h-6 rounded-full border-2 border-gray-400 bg-white"></span>
                  )}
                </button>
                <span
                  className={`text-base transition-all duration-200 ${
                    completed.includes(task.id)
                      ? "line-through text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  {task.description}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
      <hr className="my-6 text-gray-300" />
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>Milestone Progress</span>
        <span className="text-blue-600 font-semibold">
          {completed.length} / {tasks.length} completed
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-600"
          style={{ width: `${percent > 50 ? 50 : percent}%` }}
        />
        <div
          className="h-2 bg-orange-500"
          style={{
            width: `${percent > 50 ? percent - 50 : 0}%`,
            marginLeft: percent > 50 ? "50%" : "0",
          }}
        />
      </div>
    </div>
  );
};

export default RoadmapDetailCard;
