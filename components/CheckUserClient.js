"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CheckUserClient() {
  const router = useRouter();

  useEffect(() => {
    async function checkUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        router.push("/add_information");
      }
    }

    checkUserProfile();
  }, [router]);

  return null;
}
