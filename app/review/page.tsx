import Link from "next/link";
import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/getProfile";
import { canReviewContent } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

const statusLabel: Record<string, string> = {
  in_review: "In review",
  flagged: "High risk flagged"
};

export default async function ReviewQueuePage() {
  const profile = await getOrCreateProfile();

  if (!profile) redirect("/login");
  if (!canReviewContent(profile.role)) redirect("/dashboard");

  const [sermonsResult, worshipResult, discipleshipResult] = await Promise.all([
    supabaseAdmin
      .from("sermons")
      .select("id, title, review_status, risk_level, submitted_at")
      .eq("organization_id", profile.organizationId)
      .in("review_status", ["in_review", "flagged"]),
    supabaseAdmin
      .from("worship_plans")
      .select("id, title, review_status, risk_level, submitted_at")
      .eq("organization_id", profile.organizationId)
      .in("review_status", ["in_review", "flagged"]),
    supabaseAdmin
      .from("plans")
      .select("id, title, review_status, risk_level, submitted_at")
      .eq("organization_id", profile.organizationId)
      .in("review_status", ["in_review", "flagged"])
  ]);

  const items = [
    ...(sermonsResult.data || []).map((plan) => ({ ...plan, type: "Sermon", href: `/sermons/${plan.id}` })),
    ...(worshipResult.data || []).map((plan) => ({ ...plan, type: "Worship plan", href: `/worship-plans/${plan.id}` })),
    ...(discipleshipResult.data || []).map((plan) => ({ ...plan, type: "Discipleship plan", href: `/discipleship-plans/${plan.id}` }))
  ].sort((left, right) =>
    (right.submitted_at || "").localeCompare(left.submitted_at || "")
  );

  return (
    <main className="min-h-screen bg-neutral-warm-light px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-brand-navy">Review Queue</h1>
          <p className="mt-2 text-text-secondary">Plans waiting for review or flagged as high risk.</p>
        </header>

        {items.length === 0 ? (
          <p className="border-t border-neutral-gray-light py-6 text-text-secondary">There are no plans awaiting review.</p>
        ) : (
          <ul className="divide-y divide-neutral-gray-light border-y border-neutral-gray-light bg-white">
            {items.map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-slate-blue-600">{item.type}</p>
                  <p className="mt-1 font-semibold text-brand-navy">{item.title || "Untitled plan"}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {statusLabel[item.review_status] || item.review_status} · {item.risk_level} risk
                    {item.submitted_at && ` · Submitted ${new Date(item.submitted_at).toLocaleDateString()}`}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="rounded border border-neutral-gray-light px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-neutral-warm-light"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
