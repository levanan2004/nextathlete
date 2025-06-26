import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies: cookies() });

  const { searchParams } = new URL(request.url);
  let roadmapDetailId = searchParams.get("roadmap_detail_id");

  if (roadmapDetailId && roadmapDetailId.startsWith("eq.")) {
    roadmapDetailId = roadmapDetailId.replace(/^eq\./, "");
  }

  if (!roadmapDetailId) {
    return Response.json(
      { error: "Missing roadmap_detail_id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("roadmap_detail_id", roadmapDetailId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
