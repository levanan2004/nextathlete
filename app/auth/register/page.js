"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "username") {
      setUsernameError("");
    }
  }

  async function checkUsernameAvailable(username) {
    if (!username || username.length < 3) return false;

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", username.toLowerCase())
      .single();

    return !data;
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (form.username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const isUsernameAvailable = await checkUsernameAvailable(form.username);
    if (!isUsernameAvailable) {
      setUsernameError("Username is already taken");
      setLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setLoading(false);
      alert(authError.message);
      return;
    }

    if (authData.user) {
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: form.email,
          username: form.username.toLowerCase(),
          full_name: "",
          role: "",
          created_at: new Date().toISOString(),
        },
      ]);

      if (userError) {
        console.error("Error creating user record:", userError);
      }
    }

    setLoading(false);
    alert(
      "Registration successful! Please check your email to confirm your account."
    );
    window.location.href = "/auth/login";
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
        <h1 className="text-4xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400 text-lg">Start your athletic journey</p>
      </div>

      {/* Register Form */}
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700">
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                usernameError ? "border-red-500" : "border-gray-600"
              }`}
              required
            />
            {usernameError && (
              <div className="text-red-400 text-xs mt-1">{usernameError}</div>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Sign in link */}
          <div className="text-center mt-6">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              href="/auth/login"
              className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
