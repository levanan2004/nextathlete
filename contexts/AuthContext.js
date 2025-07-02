"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePathname } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Helper: fetch user and profile
  const fetchUserAndProfile = async (userObj) => {
    setUser(userObj);
    if (userObj && pathname !== "/add_information") {
      await fetchUserProfile(userObj.id);
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      await fetchUserAndProfile(data?.user || null);
    };
    getUser();

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Đảm bảo luôn cập nhật user và profile khi có sự kiện auth
      await fetchUserAndProfile(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [pathname]);

  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("username, profile_picture_url, full_name")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setUserProfile(profile);
    } catch (error) {
      setUserProfile(null);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state sẽ được update tự động qua onAuthStateChange
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    refetchProfile: () => user && fetchUserProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
