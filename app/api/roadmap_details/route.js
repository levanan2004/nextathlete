import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies: cookies() });
  const { searchParams } = new URL(request.url);
  let roadmapLevelId = searchParams.get("roadmap_level_id");

  if (roadmapLevelId && roadmapLevelId.startsWith("eq.")) {
    roadmapLevelId = roadmapLevelId.replace(/^eq\./, "");
  }

  if (!roadmapLevelId) {
    return Response.json(
      { error: "Missing roadmap_level_id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("roadmap_details")
    .select("*")
    .eq("roadmap_level_id", roadmapLevelId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
