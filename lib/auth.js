"use client";
import { supabase } from "./supabaseClient";

// Đăng ký tài khoản mới
export async function signUp({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user, error };
}

// Đăng nhập
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user, error };
}

// Đăng xuất
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Lấy user hiện tại
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
}
