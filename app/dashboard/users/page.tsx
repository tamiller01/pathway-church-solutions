import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/getProfile";
import { canManageUsers } from "@/lib/roles";

import ManageUsersTable from "./ManageUsersTable";

export default async function ManageUsersPage() {
  const profile = await getOrCreateProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!canManageUsers(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-neutral-warm-light px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Manage Users</h1>
          <p className="mt-1 text-text-secondary">
            Assign ministry roles for every Pathway Church Solutions user.
          </p>
        </div>

        <ManageUsersTable actingRole={profile.role} actingUserId={profile.user.id} />
      </div>
    </main>
  );
}
