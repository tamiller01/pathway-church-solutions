import { NextResponse } from "next/server";

import { getOrCreateProfile } from "@/lib/getProfile";
import { canManageUsers } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const profile = await getOrCreateProfile();

  if (!profile || !canManageUsers(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

    let query = supabaseAdmin
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });
    if (profile.role !== "super_admin") query = query.eq("organization_id", profile.organizationId);

    const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}
