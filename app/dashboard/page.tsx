import Link from "next/link";
import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/getProfile";
import { canAccessModules, canCreateContent, canCreateDiscipleship, ROLE_LABELS } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

const modules = [
  {
    listHref: "/worship-plans",
    newHref: "/worship-plans/new",
    scheduleHref: "/worship-plans/schedule",
    title: "Worship Planning",
    description: "Build flows, transitions, and service outlines."
  },
  {
    listHref: "/sermons",
    newHref: "/sermons/new",
    title: "Sermon Builder",
    description: "Shape biblical messages with structure and clarity."
  },
  {
    listHref: "/discipleship-plans",
    newHref: "/discipleship-plans/new",
    title: "Discipleship Tools",
    description: "Create study pathways, group plans, and growth rhythms."
  }
];

export default async function DashboardPage() {
  const profile = await getOrCreateProfile();

  if (!profile) {
    redirect("/login");
  }

  const { role } = profile;
  const hasModuleAccess = canAccessModules(role);
  const canCreate = canCreateContent(role);
  const canCreateDiscipleshipPlans = canCreateDiscipleship(role);
  const ownerId = role === "pastor" || role === "discipleship_leader" ? profile.user.id : null;

  let sermonsQuery = supabaseAdmin
    .from("sermons")
    .select("id, title, passage, topic, review_status, created_at, user_id")
    .eq("organization_id", profile.organizationId)
    .order("created_at", { ascending: false })
    .limit(3);
  let worshipQuery = supabaseAdmin
    .from("worship_plans")
    .select("id, title, theme, scripture, review_status, created_at, service_date, user_id")
    .eq("organization_id", profile.organizationId)
    .order("created_at", { ascending: false })
    .limit(3);
  let discipleshipQuery = supabaseAdmin
    .from("plans")
    .select("id, title, group_name, topic, review_status, created_at, user_id")
    .eq("organization_id", profile.organizationId)
    .order("created_at", { ascending: false })
    .limit(3);
  if (ownerId) {
    sermonsQuery = sermonsQuery.eq("user_id", ownerId);
    worshipQuery = worshipQuery.eq("user_id", ownerId);
    discipleshipQuery = discipleshipQuery.eq("user_id", ownerId);
  }

  const [sermonsResult, worshipResult, discipleshipResult] = await Promise.all([
    sermonsQuery,
    worshipQuery,
    discipleshipQuery
  ]);

  if (sermonsResult.error) console.error("Failed to load recent sermons:", sermonsResult.error);
  if (worshipResult.error) console.error("Failed to load recent worship plans:", worshipResult.error);
  if (discipleshipResult.error) console.error("Failed to load recent discipleship plans:", discipleshipResult.error);

  const recentGroups = [
    {
      title: "Recent Sermons",
      allHref: "/sermons",
      items: (sermonsResult.data || []).map((item) => ({
        id: item.id,
        title: item.title || "Untitled Sermon",
        meta: [item.passage, item.topic].filter(Boolean).join(" · "),
        status: item.review_status,
        href: `/sermons/${item.id}`
      }))
    },
    {
      title: "Recent Worship Plans",
      allHref: "/worship-plans",
      items: (worshipResult.data || []).map((item) => ({
        id: item.id,
        title: item.title || "Untitled Worship Plan",
        meta: [item.service_date, item.theme, item.scripture].filter(Boolean).join(" · "),
        status: item.review_status,
        href: `/worship-plans/${item.id}`
      }))
    },
    {
      title: "Recent Discipleship Plans",
      allHref: "/discipleship-plans",
      items: (discipleshipResult.data || []).map((item) => ({
        id: item.id,
        title: item.title || "Untitled Discipleship Plan",
        meta: [item.group_name, item.topic].filter(Boolean).join(" · "),
        status: item.review_status,
        href: `/discipleship-plans/${item.id}`
      }))
    }
  ];
  return (
    <main className="min-h-screen bg-neutral-warm-light px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Signed in as <span className="font-medium text-brand-navy">{ROLE_LABELS[role]}</span>
          </p>
        </div>

        {hasModuleAccess ? (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {modules.map((m) => (
                <div
                  key={m.listHref}
                  className="flex flex-col justify-between rounded-2xl border border-neutral-gray-light bg-white p-6 shadow-medium"
                >
                  <div>
                    <h2 className="text-lg font-bold text-brand-navy">{m.title}</h2>
                    <p className="mt-2 text-sm text-text-secondary">{m.description}</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    {(m.listHref !== "/discipleship-plans" ? canCreate : canCreateDiscipleshipPlans) && (
                      <Link
                        href={m.newHref}
                        className="block rounded-lg bg-brand-gold px-4 py-2 text-center text-sm font-semibold text-brand-navy transition hover:opacity-90"
                      >
                        + New
                      </Link>
                    )}
                    <Link
                      href={m.listHref}
                      className="block rounded-lg border border-neutral-gray-light px-4 py-2 text-center text-sm font-medium text-brand-navy transition hover:bg-neutral-warm-light"
                    >
                      View All
                    </Link>
                    {m.scheduleHref && (
                      <Link
                        href={m.scheduleHref}
                        className="block px-2 py-1 text-center text-sm font-medium text-brand-slate-blue-700 hover:underline"
                      >
                        Open Sunday Schedule
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <section className="space-y-5 border-t border-neutral-gray-light pt-8">
              <h2 className="text-2xl font-bold text-brand-navy">Recent Plans</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {recentGroups.map((group) => (
                  <section key={group.title} className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-brand-navy">{group.title}</h3>
                      <Link href={group.allHref} className="text-sm font-medium text-brand-slate-blue-700 hover:underline">
                        All
                      </Link>
                    </div>
                    {group.items.length ? (
                      <ul className="divide-y divide-neutral-gray-light border-y border-neutral-gray-light">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <Link href={item.href} className="block py-3 hover:bg-white">
                              <p className="font-medium text-brand-navy">{item.title}</p>
                              {item.meta && <p className="mt-1 text-xs text-text-secondary">{item.meta}</p>}
                              <p className="mt-1 text-xs capitalize text-brand-slate-blue-700">
                                {(item.status || "draft").replaceAll("_", " ")}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="border-y border-neutral-gray-light py-3 text-sm text-text-secondary">No saved plans yet.</p>
                    )}
                  </section>
                ))}
              </div>
            </section>

          </>
        ) : (
          <p className="text-text-secondary">
            Your account role does not currently have access to the ministry modules.
          </p>
        )}
      </div>
    </main>
  );
}
