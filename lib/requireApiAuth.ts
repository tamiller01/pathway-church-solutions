import "server-only";

import { NextResponse } from "next/server";

import { getOrCreateProfile } from "@/lib/getProfile";
import { canAccessModules, canCreateContent, canCreateDiscipleship } from "@/lib/roles";

// Shared guard for content API routes: ensures the caller is signed in and holds a
// role permitted to use the ministry modules, independent of any UI-level gating.
export async function requireModuleAccess() {
  const profile = await getOrCreateProfile();

  if (!profile) {
    return { profile: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (!canAccessModules(profile.role)) {
    return { profile: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  if (!profile.organizationId) {
    return { profile: null, response: NextResponse.json({ error: "Your account is not assigned to an organization" }, { status: 403 }) };
  }

  return { profile, response: null };
}

export async function requireContentCreation() {
  const access = await requireModuleAccess();
  if (access.response) return access;

  if (!canCreateContent(access.profile.role)) {
    return {
      profile: null,
      response: NextResponse.json({ error: "Your role cannot create content" }, { status: 403 })
    };
  }

  return access;
}

export async function requireDiscipleshipCreation() {
  const access = await requireModuleAccess();
  if (access.response) return access;

  if (!canCreateDiscipleship(access.profile.role)) {
    return {
      profile: null,
      response: NextResponse.json({ error: "Your role cannot create discipleship plans" }, { status: 403 })
    };
  }

  return access;
}
