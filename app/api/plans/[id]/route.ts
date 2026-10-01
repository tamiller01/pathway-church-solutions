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
    .from("plans")
    .select("*")
    .eq("id", id)
    .eq("organization_id", profile.organizationId);
  if (profile.role === "pastor" || profile.role === "discipleship_leader") query = query.eq("user_id", profile.user.id);

  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
  }

  return NextResponse.json({ plan: data });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;
  const { id } = await params;
  let query = supabaseAdmin.from("plans").delete().eq("id", id).eq("organization_id", profile.organizationId);
  if (profile.role === "pastor" || profile.role === "discipleship_leader") query = query.eq("user_id", profile.user.id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: "Could not delete discipleship plan" }, { status: 500 });
  return NextResponse.json({ deleted: true });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;
  const { id } = await params;
  let sourceQuery = supabaseAdmin.from("plans").select("title, name, group_name, group_audience, group_frequency, group_goals, topic, scripture, book_range, study_mode, pathway_step, weeks, plan_html, user_id, organization_id").eq("id", id).eq("organization_id", profile.organizationId);
  if (profile.role === "pastor" || profile.role === "discipleship_leader") sourceQuery = sourceQuery.eq("user_id", profile.user.id);
  const { data: source, error: sourceError } = await sourceQuery.single();
  if (sourceError || !source) return NextResponse.json({ error: "Discipleship plan not found" }, { status: 404 });
  const { data, error } = await supabaseAdmin.from("plans").insert({ ...source, title: `${source.title || "Untitled Discipleship Plan"} (Copy)`, user_id: profile.user.id, review_status: "draft", risk_level: "normal" }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not duplicate discipleship plan" }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
