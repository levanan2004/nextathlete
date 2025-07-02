// "use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase environment variables");
}

// Singleton pattern: chỉ tạo 1 instance duy nhất
let supabase = globalThis.__supabase;
if (!supabase) {
  supabase = createClient(supabaseUrl, supabaseKey);
  globalThis.__supabase = supabase;
}

export { supabase };
