"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      alert("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    alert(
      "Registration successful! Please check your email to confirm your account."
    );
    window.location.href = "/auth/login";
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
          Create your account
        </div>
        <div style={{ color: "#666", fontSize: 16 }}>
          Start your athletic journey
        </div>
      </div>
      <form
        onSubmit={handleRegister}
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
        <div style={{ marginBottom: 18 }}>
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
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            style={inputStyle}
            required
          />
        </div>
        <button type="submit" style={btnSignUp} disabled={loading}>
          {loading ? "Registering..." : "Sign Up →"}
        </button>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 15 }}>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{ color: "#2563eb", fontWeight: 500 }}
          >
            Sign in
          </Link>
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

const btnSignUp = {
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
