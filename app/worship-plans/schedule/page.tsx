import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/getProfile";
import { canCreateContent, canAccessModules } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";
import SundayScheduleBoard from "./SundayScheduleBoard";

function getUpcomingSundays(count: number) {
  const today = new Date();
  const firstSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  firstSunday.setDate(firstSunday.getDate() + ((7 - firstSunday.getDay()) % 7));

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(firstSunday);
    date.setDate(firstSunday.getDate() + index * 7);
    const value = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    return {
      value,
      label: date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    };
  });
}

export default async function WorshipSchedulePage() {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/login");
  if (!canAccessModules(profile.role)) redirect("/dashboard");

  const sundays = getUpcomingSundays(8);
  let worshipQuery = supabaseAdmin
    .from("worship_plans")
    .select("id, title, theme, scripture, review_status, user_id")
    .eq("organization_id", profile.organizationId)
    .eq("review_status", "approved")
    .order("title", { ascending: true })
    .limit(200);
  let sermonQuery = supabaseAdmin
    .from("sermons")
    .select("id, title, passage, review_status, user_id")
    .eq("organization_id", profile.organizationId)
    .eq("review_status", "approved")
    .order("title", { ascending: true })
    .limit(200);

  if (profile.role === "pastor" || profile.role === "discipleship_leader") {
    worshipQuery = worshipQuery.eq("user_id", profile.user.id);
    sermonQuery = sermonQuery.eq("user_id", profile.user.id);
  }

  const [worshipResult, sermonResult, scheduleResult] = await Promise.all([
    worshipQuery,
    sermonQuery,
    supabaseAdmin
      .from("sunday_schedules")
      .select("id, service_date, worship_plan_id, sermon_id")
      .eq("user_id", profile.user.id)
      .eq("organization_id", profile.organizationId)
      .gte("service_date", sundays[0].value)
      .order("service_date", { ascending: true })
  ]);
  if (worshipResult.error) console.error("Failed to load approved worship plans:", worshipResult.error);
  if (sermonResult.error) console.error("Failed to load approved sermons:", sermonResult.error);
  if (scheduleResult.error) console.error("Failed to load Sunday schedules:", scheduleResult.error);

  const canCreate = canCreateContent(profile.role);

  return (
    <main className="min-h-screen bg-neutral-warm-light px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-7">
        <header>
          <div>
            <p className="text-sm font-semibold uppercase text-brand-slate-blue-700">Worship Planning</p>
            <h1 className="mt-1 text-3xl font-bold text-brand-navy">Sunday Schedule</h1>
            <p className="mt-2 max-w-2xl text-text-secondary">
              Each Sunday is a saved service schedule. Choose an approved Worship Plan and Sermon for that date, then save the Sunday.
            </p>
          </div>
        </header>

        <SundayScheduleBoard
          sundays={sundays}
          worshipPlans={worshipResult.data || []}
          sermons={sermonResult.data || []}
          schedules={scheduleResult.data || []}
          canSchedule={canCreate}
        />
      </div>
    </main>
  );
}