import "server-only";

import { createServerClient } from "@/lib/supabase-server-auth";
import type { UserRole } from "@/lib/roles";

export async function getOrCreateProfile() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (profile) {
    return { user, role: profile.role as UserRole, organizationId: profile.organization_id as string | null };
  }

  // Backfill a profile for users created before roles existed.
  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: user.id, email: user.email })
    .select("role, organization_id")
    .single();

  return { user, role: (created?.role ?? "pastor") as UserRole, organizationId: created?.organization_id as string | null };
}
