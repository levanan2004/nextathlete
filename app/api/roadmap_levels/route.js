import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies: cookies() });
  const { searchParams } = new URL(request.url);
  let roadmapId = searchParams.get("roadmap_id");

  if (roadmapId && roadmapId.startsWith("eq.")) {
    roadmapId = roadmapId.replace(/^eq\./, "");
  }

  if (!roadmapId) {
    return Response.json({ error: "Missing roadmap_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("roadmap_levels")
    .select("*")
    .eq("roadmap_id", roadmapId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
