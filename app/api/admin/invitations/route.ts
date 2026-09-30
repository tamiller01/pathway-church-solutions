import { NextResponse } from "next/server";

import { getOrCreateProfile } from "@/lib/getProfile";
import { ALL_ROLES, canAssignRole, canManageUsers, type UserRole } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const profile = await getOrCreateProfile();
  if (!profile || !canManageUsers(profile.role) || !profile.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null) as { email?: unknown; role?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = body?.role as UserRole;
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!ALL_ROLES.includes(role) || role === "super_admin" || !canAssignRole(profile.role, role)) {
    return NextResponse.json({ error: "That role cannot be assigned from this organization" }, { status: 403 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/dashboard`
  });
  if (inviteError && !inviteError.message.toLowerCase().includes("already registered")) {
    console.error(inviteError);
    return NextResponse.json({ error: "Could not send the invitation" }, { status: 500 });
  }

  let userId = invited.user?.id;
  if (!userId) {
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) return NextResponse.json({ error: "Could not find the invited account" }, { status: 500 });
    userId = users.users.find((user) => user.email?.toLowerCase() === email)?.id;
  }
  if (!userId) return NextResponse.json({ error: "Could not find the invited account" }, { status: 500 });

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, email, role, organization_id: profile.organizationId });
  if (profileError) {
    console.error(profileError);
    return NextResponse.json({ error: "Invitation sent, but organization membership could not be saved" }, { status: 500 });
  }

  return NextResponse.json({ invited: true, email, role });
}
