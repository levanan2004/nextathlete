"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import AcademyDetailModal from "@/components/AcademyDetailModal";
import SubmitAcademyModal from "@/components/SubmitAcademyModal";

export default function AcademiesPage() {
  const { user } = useAuth();
  const [academies, setAcademies] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [mounted, setMounted] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [checkingCoach, setCheckingCoach] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState(null);

  // Fix hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is a coach (separate effect)
  useEffect(() => {
    if (!mounted || !user) {
      setCheckingCoach(false);
      return;
    }

    async function checkCoachStatus() {
      try {
        const { data: coachData, error: coachError } = await supabase
          .from("coaches")
          .select("user_id")
          .eq("user_id", user.id)
          .single();

        if (!coachError && coachData) {
          setIsCoach(true);
        } else {
          setIsCoach(false);
        }
      } catch (error) {
        console.error("Error checking coach status:", error);
        setIsCoach(false);
      } finally {
        setCheckingCoach(false);
      }
    }

    checkCoachStatus();
  }, [mounted, user]);

  // Fetch data
  useEffect(() => {
    if (!mounted) return;

    async function fetchData() {
      try {
        // Fetch roadmaps for sports filter
        const { data: roadmapsData, error: roadmapsError } = await supabase
          .from("roadmaps")
          .select("id, sport");

        if (roadmapsError) throw roadmapsError;

        // Fetch academies
        const { data: academiesData, error: academiesError } = await supabase
          .from("academies")
          .select(
            `
            id,
            name,
            sport,
            location,
            monthly_fees,
            number_of_coaches,
            description,
            facilities,
            website,
            contact_email,
            contact_phone,
            is_verified,
            created_at
          `
          )
          .eq("is_verified", true)
          .order("created_at", { ascending: false });

        if (academiesError) throw academiesError;

        setRoadmaps(roadmapsData || []);
        setAcademies(academiesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAcademies([]);
        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mounted]);

  const handleAcademySubmitted = () => {
    // Refresh academies list after submission
    const fetchAcademies = async () => {
      const { data: academiesData, error } = await supabase
        .from("academies")
        .select(
          `
          id,
          name,
          sport,
          location,
          monthly_fees,
          number_of_coaches,
          description,
          facilities,
          website,
          contact_email,
          contact_phone,
          is_verified,
          created_at
        `
        )
        .eq("is_verified", true)
        .order("created_at", { ascending: false });

      if (!error) {
        setAcademies(academiesData || []);
      }
    };

    fetchAcademies();
  };

  // Filter academies
  const filteredAcademies = academies.filter((academy) => {
    const matchesSport =
      selectedSport === "All Sports" || academy.sport === selectedSport;
    const matchesLocation =
      selectedLocation === "All Locations" ||
      academy.location.includes(selectedLocation);
    return matchesSport && matchesLocation;
  });

  // Get unique locations
  const uniqueLocations = [
    ...new Set(academies.map((academy) => academy.location)),
  ];

  // Mock ratings for demo
  const getMockRating = (index) => {
    const ratings = [4.8, 4.9, 4.7, 4.6, 4.5, 4.3];
    return ratings[index % ratings.length];
  };

  const getMockReviews = (index) => {
    const reviews = [124, 89, 67, 156, 98, 203];
    return reviews[index % reviews.length];
  };

  const handleLearnMore = (academy) => {
    setSelectedAcademy(academy);
    setShowDetailModal(true);
  };

  // Loading skeleton
  if (!mounted || loading || checkingCoach) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-10 bg-gray-800 rounded mb-4 max-w-md animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded mb-8 max-w-lg animate-pulse"></div>

          <div className="flex gap-4 mb-8">
            <div className="h-12 bg-gray-800 rounded w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-800 rounded w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-800 rounded w-32 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-800 rounded mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-800 rounded w-16"></div>
                  <div className="h-6 bg-gray-800 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-800 rounded"></div>
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
          <h1 className="text-4xl font-bold mb-2">Sports Academies</h1>
          <p className="text-gray-400 text-lg">
            Find professional sports academies and training facilities to
            accelerate your athletic development
          </p>
        </div>

        {/* Filters and Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All Sports">All Sports</option>
            {roadmaps.map((roadmap) => (
              <option key={roadmap.id} value={roadmap.sport}>
                {roadmap.sport}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All Locations">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* Show Submit Academy button ONLY for authenticated coaches */}
          {user && isCoach && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ml-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Submit Academy
            </button>
          )}
        </div>

        {/* Verified Academies Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
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
            <h2 className="text-2xl font-bold">Verified Academies</h2>
          </div>

          {/* Academies Grid */}
          {filteredAcademies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">No academies found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredAcademies.map((academy, index) => (
                <div
                  key={academy.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {academy.sport}
                        </span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {academy.name}
                      </h3>
                      <p className="text-purple-400 text-sm">{academy.sport}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-medium">
                        {getMockRating(index)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({getMockReviews(index)} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
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
                      <span className="text-gray-300">{academy.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-green-400 font-medium">
                        💰 {academy.monthly_fees?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      <span className="text-gray-300">
                        👥 {academy.number_of_coaches} coaches
                      </span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {academy.facilities?.slice(0, 3).map((facility, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                    {academy.facilities?.length > 3 && (
                      <span className="text-purple-400 text-xs">
                        +{academy.facilities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Learn More Button */}
                  <button
                    onClick={() => handleLearnMore(academy)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <AcademyDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          academy={selectedAcademy}
        />

        {isCoach && (
          <SubmitAcademyModal
            isOpen={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
            roadmaps={roadmaps}
            onAcademySubmitted={handleAcademySubmitted}
          />
        )}
      </div>
    </div>
  );
}
