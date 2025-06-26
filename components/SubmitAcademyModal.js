// filepath: c:\Users\otaku\Freelancer\snipping\nextathlete\components\SubmitAcademyModal.js
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export default function SubmitAcademyModal({
  isOpen,
  onClose,
  roadmaps,
  onAcademySubmitted,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    location: "",
    monthly_fees: "",
    number_of_coaches: "",
    description: "",
    facilities: "",
    website: "",
    contact_email: "",
    contact_phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.sport ||
      !formData.location ||
      !formData.monthly_fees ||
      !formData.description ||
      !formData.contact_email ||
      !formData.contact_phone
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Parse facilities from textarea (one per line)
      const facilitiesArray = formData.facilities
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const academyData = {
        name: formData.name,
        sport: formData.sport,
        location: formData.location,
        monthly_fees: parseInt(formData.monthly_fees),
        number_of_coaches: parseInt(formData.number_of_coaches) || 1,
        description: formData.description,
        facilities: facilitiesArray,
        website: formData.website || null,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        coach_id: user.id,
        is_verified: false, // Will be reviewed by admin
      };

      const { data, error } = await supabase
        .from("academies")
        .insert([academyData])
        .select();

      if (error) throw error;

      alert(
        "Academy submitted successfully! It will be reviewed before appearing on the site."
      );
      onAcademySubmitted && onAcademySubmitted();
      onClose();

      // Reset form
      setFormData({
        name: "",
        sport: "",
        location: "",
        monthly_fees: "",
        number_of_coaches: "",
        description: "",
        facilities: "",
        website: "",
        contact_email: "",
        contact_phone: "",
      });
    } catch (error) {
      console.error("Error submitting academy:", error);
      alert("Error submitting academy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Submit Academy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Academy Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Academy Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Elite Basketball Academy"
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Sport and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Primary Sport <span className="text-red-500">*</span>
              </label>
              <select
                name="sport"
                value={formData.sport}
                onChange={handleInputChange}
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">Select Sport</option>
                {roadmaps.map((roadmap) => (
                  <option key={roadmap.id} value={roadmap.sport}>
                    {roadmap.sport}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Ho Chi Minh City"
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Monthly Fees and Number of Coaches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Monthly Fees <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="monthly_fees"
                value={formData.monthly_fees}
                onChange={handleInputChange}
                placeholder="e.g., 1,000,000 - 3,000,000 VND"
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Number of Coaches <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="number_of_coaches"
                value={formData.number_of_coaches}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-white font-medium mb-2">
              Facilities (one per line) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="facilities"
              value={formData.facilities}
              onChange={handleInputChange}
              rows={6}
              placeholder={`e.g.,
Full-size courts
Fitness center
Locker rooms
Medical facility`}
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your academy's programs, coaching philosophy, and what makes it special..."
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="contact@academy.com"
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                placeholder="+84 xxx xxx xxx"
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-white font-medium mb-2">
              Website (optional)
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://your-academy.com"
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Notice */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">
              <strong>Note:</strong> All academy submissions require
              verification and approval. We review each submission to ensure
              quality standards and legitimacy.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Submitting..." : "Submit Academy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
