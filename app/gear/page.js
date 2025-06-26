"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import PostItemModal from "@/components/PostItemModal";

export default function GearListPage() {
  const { user } = useAuth();
  const [gear, setGear] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  // Fix hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchData() {
      try {
        // Check if user is a student
        if (user) {
          const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("user_id")
            .eq("user_id", user.id)
            .single();

          if (!studentError && studentData) {
            setIsStudent(true);
          }
        }

        // Fetch roadmaps (categories)
        const { data: roadmapsData, error: roadmapsError } = await supabase
          .from("roadmaps")
          .select("id, sport, title, athlete_count");

        if (roadmapsError) throw roadmapsError;

        // Fetch gear with roadmap info AND brand
        const { data: gearData, error: gearError } = await supabase
          .from("gear_listings")
          .select(
            `
            id,
            title,
            description,
            price,
            image_url,
            condition,
            location,
            brand,
            created_at,
            roadmap_id,
            roadmaps (
              sport,
              title
            )
          `
          )
          .order("created_at", { ascending: false });

        if (gearError) throw gearError;

        setRoadmaps(roadmapsData || []);
        setGear(gearData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGear([]);
        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mounted, user]);

  const handleItemPosted = () => {
    // Refresh gear list after posting
    const fetchGear = async () => {
      const { data: gearData, error } = await supabase
        .from("gear_listings")
        .select(
          `
          id,
          title,
          description,
          price,
          image_url,
          condition,
          location,
          brand,
          created_at,
          roadmap_id,
          roadmaps (
            sport,
            title
          )
        `
        )
        .order("created_at", { ascending: false });

      if (!error) {
        setGear(gearData || []);
      }
    };

    fetchGear();
  };

  // Filter gear
  const filteredGear = gear.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (item.roadmaps && item.roadmaps.sport === selectedCategory);
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.brand &&
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get condition color/style
  const getConditionStyle = (condition) => {
    switch (condition) {
      case "New":
        return "bg-purple-600 text-white";
      case "Like New":
        return "bg-blue-600 text-white";
      case "Good":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Loading skeleton
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-800 rounded mb-4 max-w-md animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded mb-8 max-w-lg animate-pulse"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-800"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-6 bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Sports Marketplace</h1>
          <p className="text-gray-400">
            Find affordable sports equipment or sell your unused gear to help
            other athletes get started
          </p>
        </div>

        {/* Verified Stores Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Verified Stores</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {roadmaps.slice(0, 4).map((roadmap, index) => {
              const ratings = [4.8, 4.9, 4.7, 4.6];
              const isOnline = [true, false, true, true];

              return (
                <div
                  key={roadmap.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-medium">
                        {ratings[index]}
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOnline[index] ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></div>
                  </div>

                  <h3 className="font-bold mb-1">
                    {roadmap.sport}{" "}
                    {index === 0
                      ? "Vietnam"
                      : index === 1
                      ? "Pro Shop"
                      : index === 2
                      ? "World"
                      : "Hub"}
                  </h3>
                  <p className="text-purple-400 text-sm mb-1">
                    {roadmap.sport}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {index === 0
                      ? "Quality sports equipment for all levels"
                      : index === 1
                      ? "Specialized equipment and accessories"
                      : index === 2
                      ? "Professional gear and cleats"
                      : "Complete equipment store"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for sports equipment or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <svg
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 min-w-[120px]"
          >
            <option value="All">All</option>
            {roadmaps.map((roadmap) => (
              <option key={roadmap.id} value={roadmap.sport}>
                {roadmap.sport}
              </option>
            ))}
          </select>

          {/* Show Post Item button only for students */}
          {isStudent && (
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Post Item
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredGear.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGear.map((item, index) => {
              // Mock ratings for demo
              const ratings = [4.5, 4.8, 4.3, 4.7, 4.2, 4.9];
              const mockLocations = ["Ho Chi Minh City", "Hanoi", "Da Nang"];

              return (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-gray-600"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg
                          className="w-16 h-16 text-white/50"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Condition Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getConditionStyle(
                          item.condition
                        )}`}
                      >
                        {item.condition || "Good"}
                      </span>
                    </div>

                    {/* Category Badge */}
                    {item.roadmaps && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {item.roadmaps.sport}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Brand name (nếu có) */}
                    {item.brand && (
                      <p className="text-purple-400 text-sm font-medium mb-1">
                        {item.brand}
                      </p>
                    )}

                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-white">
                        {item.price?.toLocaleString()} VND
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-gray-300">
                          {ratings[index % ratings.length]}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-4">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400 text-sm">
                        {item.location ||
                          mockLocations[index % mockLocations.length]}
                      </span>
                    </div>

                    {/* Contact Button */}
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Post Item Modal */}
        <PostItemModal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          roadmaps={roadmaps}
          onItemPosted={handleItemPosted}
        />
      </div>
    </div>
  );
}
