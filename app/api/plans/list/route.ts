import { NextResponse } from "next/server";
import { requireModuleAccess } from "@/lib/requireApiAuth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;

  let query = supabaseAdmin
    .from("plans")
    .select("*")
    .eq("organization_id", profile.organizationId)
    .order("created_at", { ascending: false });
  if (profile.role === "pastor" || profile.role === "discipleship_leader") query = query.eq("user_id", profile.user.id);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }

  return NextResponse.json({ plans: data });
}
