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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;
  const { id } = await params;
  let query = supabaseAdmin.from("worship_plans").delete().eq("id", id).eq("organization_id", profile.organizationId);
  if (profile.role === "pastor" || profile.role === "discipleship_leader") query = query.eq("user_id", profile.user.id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: "Could not delete worship plan" }, { status: 500 });
  return NextResponse.json({ deleted: true });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;
  const { id } = await params;
  let sourceQuery = supabaseAdmin.from("worship_plans").select("title, theme, scripture, style, notes, plan_json, plan_html, assignments, user_id, organization_id").eq("id", id).eq("organization_id", profile.organizationId);
  if (profile.role === "pastor" || profile.role === "discipleship_leader") sourceQuery = sourceQuery.eq("user_id", profile.user.id);
  const { data: source, error: sourceError } = await sourceQuery.single();
  if (sourceError || !source) return NextResponse.json({ error: "Worship plan not found" }, { status: 404 });
  const { data, error } = await supabaseAdmin.from("worship_plans").insert({ ...source, title: `${source.title || "Untitled Worship Plan"} (Copy)`, user_id: profile.user.id, service_date: null, review_status: "draft", risk_level: "normal" }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not duplicate worship plan" }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
