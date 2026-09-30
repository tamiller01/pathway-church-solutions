import { NextResponse } from "next/server";
import { requireModuleAccess } from "@/lib/requireApiAuth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;

  const { id } = await params;

  let query = supabaseAdmin
    .from("worship_plans")
    .select("*")
    .eq("id", id)
    .eq("organization_id", profile.organizationId);
  if (profile.role === "pastor" || profile.role === "discipleship_leader") query = query.eq("user_id", profile.user.id);

  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Worship plan not found" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to load worship plan" }, { status: 500 });
  }

  return NextResponse.json({ worshipPlan: data });
}
