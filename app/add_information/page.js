"use client";

import { useState } from "react";
import Step1 from "../../components/add_information/step1";
import Step2 from "../../components/add_information/step2";
import Step3 from "../../components/add_information/step3";
import ProgressBar from "../../components/ProgressBar";
import { supabase } from "../../lib/supabaseClient";

const TOTAL_STEPS = 3;

export default function AddInformationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // chung
    role: "",
    full_name: "",
    location: "",
    profile_picture_url: "",
    // students
    age: "",
    sport_interest: "",
    goals: "",
    bio: "",
    videos_uploaded_count: "",
    // coaches
    experience_years: "",
    specialization: "",
    academy_name: "",
    coach_bio: "",
    contact_email: "",
    // parents
    child_name: "",
    child_age: "",
    child_sport: "",
    goal_support: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function nextStep() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }
  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Bạn chưa đăng nhập!");
      setLoading(false);
      return;
    }

    // Mặc định cho các trường
    let videos_uploaded_count = form.videos_uploaded_count;
    if (
      videos_uploaded_count === "" ||
      videos_uploaded_count === undefined ||
      videos_uploaded_count === null
    ) {
      videos_uploaded_count = 0;
    }

    // Insert users
    const { error: userError } = await supabase.from("users").upsert([
      {
        id: user.id,
        email: user.email,
        full_name: form.full_name,
        role: form.role,
        location: form.location,
        profile_picture_url: form.profile_picture_url,
        created_at: new Date().toISOString(),
      },
    ]);
    if (userError) {
      console.error("Insert users error:", userError);
      alert(userError.message);
      setLoading(false);
      return;
    }

    // Insert bảng phụ
    if (form.role === "student") {
      // Xử lý sport_interest
      let sport_interest = [];
      if (form.sport_interest && form.sport_interest.trim() !== "") {
        sport_interest = [form.sport_interest.trim()];
      }
      // Xử lý videos_uploaded_count
      let videos_uploaded_count = 0;
      if (
        form.videos_uploaded_count !== "" &&
        form.videos_uploaded_count !== undefined &&
        form.videos_uploaded_count !== null
      ) {
        videos_uploaded_count = parseInt(form.videos_uploaded_count);
      }
      const { error } = await supabase.from("students").upsert([
        {
          user_id: user.id,
          age: form.age ? parseInt(form.age) : null,
          sport_interest: sport_interest,
          goals: form.goals,
          bio: form.bio,
          videos_uploaded_count: videos_uploaded_count,
          is_public_profile: true,
        },
      ]);
      if (error) {
        console.error("Insert students error:", error);
        alert(error.message);
        setLoading(false);
        return;
      }
    }
    if (form.role === "coach") {
      const { error } = await supabase.from("coaches").upsert([
        {
          user_id: user.id,
          experience_years:
            form.experience_years && form.experience_years !== ""
              ? parseInt(form.experience_years)
              : null,
          specialization: form.specialization
            ? [form.specialization.trim()]
            : [],
          academy_name: form.academy_name || null,
          bio: form.coach_bio || null,
          contact_email: form.contact_email || null,
        },
      ]);
      if (error) {
        console.error("Insert coaches error:", error);
        alert(error.message);
        setLoading(false);
        return;
      }
    }

    if (form.role === "parent") {
      const { error } = await supabase.from("parents").upsert([
        {
          user_id: user.id,
          child_name: form.child_name || null,
          child_age:
            form.child_age && form.child_age !== ""
              ? parseInt(form.child_age)
              : null,
          child_sport: form.child_sport || null,
          goal_support: form.goal_support || null,
        },
      ]);
      if (error) {
        console.error("Insert parents error:", error);
        alert(error.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    alert("Thông tin đã được lưu!");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="bg-gradient-to-br from-blue-600 to-orange-400 p-2 rounded-lg flex items-center justify-center">
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
              className="h-6 w-6 text-white"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <span className="font-bold text-2xl text-gray-900">
            Ignite<span className="text-blue-600">Athlete</span>
          </span>
        </div>
        <div className="font-bold text-3xl mb-1">Add Information</div>
        <div className="text-gray-500 text-base">
          Complete your profile to continue
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[350px] max-w-[420px] w-full">
        <ProgressBar step={step} totalSteps={TOTAL_STEPS} />
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Step1 form={form} onChange={handleChange} nextStep={nextStep} />
          )}
          {step === 2 && (
            <Step2
              form={form}
              onChange={handleChange}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <Step3
              form={form}
              onChange={handleChange}
              prevStep={prevStep}
              loading={loading}
            />
          )}
        </form>
      </div>
    </div>
  );
}
