import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies: cookies() });
  try {
    const { searchParams } = new URL(req.url);
    const article_id = searchParams.get("article_id");

    if (!article_id) {
      return Response.json({ error: "Missing article_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .select("*, users(full_name, profile_picture_url)")
      .eq("article_id", article_id)
      .order("created_at", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data ?? []);
  } catch (err) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const supabase = createRouteHandlerClient({ cookies: cookies() });

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { article_id, content } = body || {};

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError)
      return Response.json({ error: userError.message }, { status: 500 });
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!article_id || !content)
      return Response.json({ error: "Missing fields" }, { status: 400 });

    const { data, error } = await supabase
      .from("comments")
      .insert([{ article_id, user_id: user.id, content }])
      .select("*, users(full_name, profile_picture_url)")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data ?? {});
  } catch (err) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
