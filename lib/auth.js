"use client";
import { supabase } from "./supabaseClient";

// Đăng ký tài khoản mới
export async function signUp({ email, password }) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  return { user, error };
}

// Đăng nhập
export async function signIn({ email, password }) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user, error };
}

// Đăng xuất
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Lấy user hiện tại
export function getCurrentUser() {
  return supabase.auth.getUser();
}
