"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CheckUserClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Danh sách trang public không cần auth
  const publicRoutes = [
    '/',
    '/auth/login', 
    '/auth/register',
    '/academy',
    '/tournaments',
    '/roadmaps',
    '/gear',
    '/showcase',
    '/videos'
  ];

  // Danh sách trang chỉ dành cho guest (chưa login)
  const guestOnlyRoutes = ['/auth/login', '/auth/register'];

  useEffect(() => {
    // Đợi auth context load xong
    if (loading) return;

    // Nếu user đã login mà vào trang guest-only → redirect về home
    if (user && guestOnlyRoutes.includes(pathname)) {
      router.push('/');
      return;
    }

    // Nếu user chưa login mà vào trang cần auth → redirect về login  
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/auth/login');
      return;
    }

    // Kiểm tra profile completion cho user đã login
    if (user && !publicRoutes.includes(pathname) && pathname !== '/add_information') {
      checkUserProfile();
    }
  }, [user, loading, pathname]);

  const checkUserProfile = async () => {
    try {
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("id", user.id)
        .single();

      // Nếu chưa có profile hoặc chưa hoàn thành → redirect đến add_information
      if (error || !existingUser || !existingUser.full_name) {
        router.push('/add_information');
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
  };

  return null; // Component này chỉ để logic, không render gì
}
