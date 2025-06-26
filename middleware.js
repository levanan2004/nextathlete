// middleware.js
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession(); // Đảm bảo session được attach
  return res;
}

export const config = {
  matcher: ["/api/(.*)", "/dashboard", "/profile", "/community"],
};
