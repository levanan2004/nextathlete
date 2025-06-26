"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    // ✅ Force đồng bộ session vào cookie
    await supabase.auth.getSession();

    // Sau khi đăng nhập thành công, đồng bộ vào bảng users, students, coaches, parents...
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #2563eb, #f59e42)",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-zap h-6 w-6 text-white"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 22, color: "#222" }}>
            Ignite<span style={{ color: "#2563eb" }}>Athlete</span>
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 4 }}>
          Welcome back
        </div>
        <div style={{ color: "#666", fontSize: 16 }}>
          Continue your athletic journey
        </div>
      </div>
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px #0002",
          padding: 32,
          minWidth: 350,
          maxWidth: 380,
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={inputStyle}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={inputStyle}
            required
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            fontSize: 14,
          }}
        >
          <label>
            <input type="checkbox" style={{ marginRight: 6 }} /> Remember me
          </label>
          <a href="#" style={{ color: "#2563eb", fontWeight: 500 }}>
            Forgot password?
          </a>
        </div>
        <button type="submit" style={btnSignIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In →"}
        </button>
        <div
          style={{
            margin: "18px 0 12px 0",
            textAlign: "center",
            color: "#aaa",
            fontSize: 14,
          }}
        >
          <span style={{ background: "#f3f4f6", padding: "0 12px" }}>
            Or continue with
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            style={btnSocial}
            onClick={() => alert("Google login chưa tích hợp")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={{ width: 20, marginRight: 8 }}
            />
            Google
          </button>
          <button
            type="button"
            style={btnSocial}
            onClick={() => alert("Facebook login chưa tích hợp")}
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              style={{ width: 20, marginRight: 8 }}
            />
            Facebook
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 15 }}>
          Don't have an account?{" "}
          <a
            href="/auth/register"
            style={{ color: "#2563eb", fontWeight: 500 }}
          >
            Sign up for free
          </a>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  border: "1.5px solid #e5e7eb",
  fontSize: 15,
  marginBottom: 0,
  outline: "none",
  boxShadow: "0 2px 8px #0001",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: 500,
  fontSize: 15,
};

const btnSignIn = {
  width: "100%",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  padding: "12px 0",
  border: "none",
  fontWeight: 600,
  fontSize: 18,
  marginTop: 8,
  marginBottom: 8,
  boxShadow: "0 2px 8px #2563eb22",
  cursor: "pointer",
};

const btnSocial = {
  flex: 1,
  background: "#f3f4f6",
  color: "#222",
  borderRadius: 8,
  padding: "10px 0",
  border: "none",
  fontWeight: 500,
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
