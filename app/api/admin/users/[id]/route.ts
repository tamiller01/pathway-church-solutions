import { NextResponse } from "next/server";

import { getOrCreateProfile } from "@/lib/getProfile";
import { ALL_ROLES, canManageUsers, canModifyUserWithRole, canAssignRole, type UserRole } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getOrCreateProfile();

  if (!profile || !canManageUsers(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (id === profile.user.id) {
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
  }

  const body = await req.json();
  const newRole = body.role as UserRole;

  if (!ALL_ROLES.includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  let targetQuery = supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", id)
  if (profile.role !== "super_admin") targetQuery = targetQuery.eq("organization_id", profile.organizationId);
  const { data: target, error: targetError } = await targetQuery.single();

  if (targetError || !target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!canModifyUserWithRole(profile.role, target.role as UserRole)) {
    return NextResponse.json({ error: "You cannot modify a Super Admin" }, { status: 403 });
  }

  if (!canAssignRole(profile.role, newRole)) {
    return NextResponse.json({ error: "Only a Super Admin can assign the Super Admin role" }, { status: 403 });
  }

  let updateQuery = supabaseAdmin
    .from("profiles")
    .update({ role: newRole })
    .eq("id", id);
  if (profile.role !== "super_admin") updateQuery = updateQuery.eq("organization_id", profile.organizationId);
  const { data, error } = await updateQuery.select("id, email, role, created_at").single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}
