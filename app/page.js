"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import HeroSection from "@/components/home/HeroSection";
import EverythingYouNeed from "@/components/home/EverythingYouNeed";
import ReadyToStart from "@/components/home/ReadyToStart";
import SuccessStories from "@/components/home/SuccessStories";
import AthleticJourneyComponent from "@/components/home/AthleticJourneyComponent";
import OurMission from "@/components/home/OurMission";

export default function Home() {
  useEffect(() => {
    // Chỉ reload nếu có access_token và chưa có session Supabase
    async function handleOAuthHash() {
      if (
        window.location.hash &&
        window.location.hash.includes("access_token")
      ) {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          window.location.href = window.location.origin;
        }
      }
    }
    handleOAuthHash();
  }, []);

  useEffect(() => {
    async function checkProfile() {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data?.user) return;

      const { data: existingUser, error: queryError } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (queryError || !existingUser) {
        window.location.href = "/add_information";
      }
    }

    checkProfile();
  }, []);

  return (
    <>
      <HeroSection />
      <OurMission />
      <EverythingYouNeed />
      <ReadyToStart />
      <SuccessStories />
      <AthleticJourneyComponent />
    </>
  );
}
