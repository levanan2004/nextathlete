// middleware.js
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Refresh session if expired
    await supabase.auth.getSession();
  } catch (error) {
    console.error('Middleware auth error:', error);
  }
  
  return res;
}

export const config = {
  matcher: [
    "/api/(.*)", 
    "/dashboard", 
    "/information", 
    "/community",
    "/add_information",
    "/parents",
    "/coaches"
  ],
};
