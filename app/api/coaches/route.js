import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies: cookies() });
  const { data, error } = await supabase.from("coaches").select("*");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from("coaches")
    .insert([body])
    .select();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data[0]);
}
