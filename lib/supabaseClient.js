// "use client";

// import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

// export const supabase = createBrowserSupabaseClient();
"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Kiểm tra xem có đủ environment variables không
if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
