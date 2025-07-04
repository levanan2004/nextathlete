"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import HeroSection from "@/components/home/HeroSection";
import EverythingYouNeed from "@/components/home/EverythingYouNeed";
import ReadyToStart from "@/components/home/ReadyToStart";
import AthleticJourneyComponent from "@/components/home/AthleticJourneyComponent";
import OurMission from "@/components/home/OurMission";
import SuccessStories from "@/components/home/SuccessStories";

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

  // AuthContext sẽ tự động handle việc redirect đến /add_information nếu cần
  // Không cần logic checkProfile riêng nữa

  return (
    <>
      <HeroSection />
      <OurMission />
      <EverythingYouNeed />
      <ReadyToStart />
      <AthleticJourneyComponent />
    </>
  );
}
