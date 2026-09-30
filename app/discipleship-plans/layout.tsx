import { redirect } from "next/navigation";

import AppHeader from "@/components/AppHeader";
import { RoleAccessProvider } from "@/components/RoleAccessProvider";
import { getOrCreateProfile } from "@/lib/getProfile";
import { canAccessModules } from "@/lib/roles";

export default async function DiscipleshipPlansLayout({ children }: { children: React.ReactNode }) {
  const profile = await getOrCreateProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!canAccessModules(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <>
      <AppHeader />
      <RoleAccessProvider role={profile.role} userId={profile.user.id}>{children}</RoleAccessProvider>
    </>
  );
}
