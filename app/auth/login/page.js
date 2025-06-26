"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Kiểm tra input là email hay username
  function isEmail(input) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }

  // Lấy email từ username
  async function getEmailFromUsername(username) {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", username.toLowerCase())
      .single();

    return data?.email || null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    let emailToUse = form.emailOrUsername;

    // Nếu không phải email, tìm email từ username
    if (!isEmail(form.emailOrUsername)) {
      const email = await getEmailFromUsername(form.emailOrUsername);
      if (!email) {
        setLoading(false);
        alert(
          "Username not found. Please check your username or use your email address."
        );
        return;
      }
      emailToUse = email;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    // Force đồng bộ session vào cookie
    await supabase.auth.getSession();

    // Đồng bộ dữ liệu user (giữ nguyên logic cũ)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        // Logic đồng bộ dữ liệu từ localStorage (giữ nguyên)
        const fullName = localStorage.getItem("fullName") || "";
        const role = localStorage.getItem("role") || "";
        const location = localStorage.getItem("location") || "";
        const profile_picture_url =
          localStorage.getItem("profile_picture_url") || "";

        await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            full_name: fullName,
            role,
            location,
            profile_picture_url,
          },
        ]);

        // Logic cho student, coach, parent (giữ nguyên)
        if (role === "student") {
          const age = localStorage.getItem("age") || "";
          const sport = localStorage.getItem("sport") || "";
          const goals = localStorage.getItem("goal") || "";
          const bio = localStorage.getItem("bio") || "";
          const videos_uploaded_count =
            localStorage.getItem("videos_uploaded_count") || 0;
          const is_public_profile =
            localStorage.getItem("is_public_profile") === "true";

          await supabase.from("students").insert([
            {
              user_id: user.id,
              age: age ? parseInt(age) : null,
              sport_interest: sport ? [sport] : [],
              goals,
              bio,
              videos_uploaded_count: parseInt(videos_uploaded_count),
              is_public_profile,
            },
          ]);
        }

        if (role === "coach") {
          const experience_years =
            localStorage.getItem("experience_years") || "";
          const specialization = localStorage.getItem("specialization") || "";
          const academy_name = localStorage.getItem("academy_name") || "";
          const bio = localStorage.getItem("bio") || "";
          const contact_email = localStorage.getItem("contact_email") || "";

          await supabase.from("coaches").insert([
            {
              user_id: user.id,
              experience_years: experience_years
                ? parseInt(experience_years)
                : null,
              specialization,
              academy_name,
              bio,
              contact_email,
            },
          ]);
        }

        if (role === "parent") {
          const child_name = localStorage.getItem("child_name") || "";
          const child_age = localStorage.getItem("child_age") || "";
          const child_sport = localStorage.getItem("child_sport") || "";
          const goal_support = localStorage.getItem("goal_support") || "";

          await supabase.from("parents").insert([
            {
              user_id: user.id,
              child_name,
              child_age: child_age ? parseInt(child_age) : null,
              child_sport,
              goal_support,
            },
          ]);
        }
      }
    }

    setLoading(false);
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="bg-white text-black px-3 py-1 rounded font-bold text-lg">
            Ignite<span className="text-purple-600">Athlete</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-gray-400 text-lg">
          Sign in to continue your athletic journey
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email/Username Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email address
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                type="text"
                name="emailOrUsername"
                value={form.emailOrUsername}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-sm text-gray-400">Or continue with</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => alert("Google login chưa tích hợp")}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 border"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </button>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <span className="text-gray-400">Don&apos;t have an account? </span>
            <Link
              href="/auth/register"
              className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
