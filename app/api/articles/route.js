import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies: cookies() });
  const { data, error } = await supabase
    .from("articles")
    .select("*, users(full_name, profile_picture_url, role, location)")
    .order("published_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
