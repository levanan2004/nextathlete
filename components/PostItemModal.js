"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function PostItemModal({
  isOpen,
  onClose,
  roadmaps,
  onItemPosted,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    condition: "",
    brand: "",
    price: "",
    location: "",
    description: "",
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

  const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop();
    return `${timestamp}_${randomString}.${extension}`;
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const isValidType = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ].includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

    if (!isValidType || !isValidSize) {
      alert("Please select a valid image file (JPG, PNG, WEBP, max 5MB)");
      return;
    }

    setLoading(true);

    try {
      const uniqueFileName = generateUniqueFileName(file.name);

      const { data, error } = await supabase.storage
        .from("images")
        .upload(`gear/${uniqueFileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        alert("Error uploading image. Please try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(data.path);

      setUploadedImage(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.sport ||
      !formData.condition ||
      !formData.price ||
      !formData.location ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Find roadmap_id based on selected sport
      const selectedRoadmap = roadmaps.find((r) => r.sport === formData.sport);

      const gearData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        image_url: uploadedImage,
        condition: formData.condition,
        location: formData.location,
        brand: formData.brand, // Thêm brand field
        roadmap_id: selectedRoadmap?.id || null,
        student_id: user.id,
      };

      const { data, error } = await supabase
        .from("gear_listings")
        .insert([gearData])
        .select();

      if (error) throw error;

      alert("Item posted successfully!");
      onItemPosted && onItemPosted();
      onClose();

      // Reset form
      setFormData({
        title: "",
        sport: "",
        condition: "",
        brand: "",
        price: "",
        location: "",
        description: "",
        contact_email: "",
        contact_phone: "",
      });
      setUploadedImage(null);
    } catch (error) {
      console.error("Error posting item:", error);
      alert("Error posting item. Please try again.");
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
          <h2 className="text-xl font-bold text-white">Post Your Item</h2>
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
          {/* Item Title */}
          <div>
            <label className="block text-white font-medium mb-2">
              Item Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Wilson Tennis Racket"
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Sport and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Sport <span className="text-red-500">*</span>
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
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
              </select>
            </div>
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Brand Name
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g., Nike, Adidas, Wilson"
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Price (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 150,000"
                className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
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
              placeholder="Describe your item, its condition, and any important details..."
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              required
            />
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-white font-medium mb-2">
              Upload Photo
            </label>

            {!uploadedImage ? (
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-4xl mb-2">📷</div>
                <p className="text-blue-400 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={uploadedImage}
                  alt="Uploaded preview"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-white font-medium mb-4">
              Contact Information <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="Email"
                className="bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                placeholder="Phone/Zalo"
                className="bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
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
              {loading ? "Posting..." : "Post Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
