"use client";
import { supabase } from "./supabaseClient";

// Đăng ký tài khoản mới
export async function signUp({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  // Đợi Supabase sync session sau sign up
  if (!error) await supabase.auth.getSession();
  return { user: data?.user, error };
}

// Đăng nhập
export async function signIn({ email, password }) {
  // Cho phép truyền vào username hoặc email
  let emailToUse = email;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Nếu là username, tìm email tương ứng
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", email.toLowerCase())
      .single();
    if (data?.email) emailToUse = data.email;
    else return { user: null, error: { message: "Username not found" } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });
  // Đợi Supabase sync session sau sign in
  if (!error) await supabase.auth.getSession();
  return { user: data?.user, error };
}

// Đăng xuất
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  // Đợi Supabase clear session
  await supabase.auth.getSession();
  return { error };
}

// Lấy user hiện tại (luôn lấy session mới nhất)
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
}
