"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRoleAccess } from "@/components/RoleAccessProvider";
import PlanListActions from "@/components/PlanListActions";

type WorshipPlanListItem = {
  id: string;
  title: string | null;
  theme: string | null;
  scripture: string | null;
  style: string | null;
  review_status: string | null;
  risk_level: string | null;
};

export default function WorshipPlansPage() {
  const { canCreate } = useRoleAccess();
  const searchParams = useSearchParams();
  const approvedOnly = searchParams.get("status") === "approved";
  const [worshipPlans, setWorshipPlans] = useState<WorshipPlanListItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(approvedOnly ? "approved" : "all");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/worship-plans/list${approvedOnly ? "?status=approved" : ""}`);
      const data = await res.json();
      setWorshipPlans(data.worshipPlans || []);
    }
    load();
  }, [approvedOnly]);

  const visiblePlans = worshipPlans.filter((plan) => {
    const text = [plan.title, plan.theme, plan.scripture, plan.style].filter(Boolean).join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) && (status === "all" || plan.review_status === status);
  });

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-navy-900">{approvedOnly ? "Approved Worship Plans" : "Worship Plans"}</h1>
        <div className="flex items-center gap-3">
          {approvedOnly && <Link href="/worship-plans" className="text-sm font-medium text-brand-slate-blue-700 hover:underline">All plans</Link>}
          {canCreate && <Link href="/worship-plans/new" className="rounded bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy">+ New Worship Plan</Link>}
        </div>
      </header>
      <nav aria-label="Worship plan views" className="flex gap-5 border-b border-neutral-gray-light text-sm font-medium">
        <Link href="/worship-plans" aria-current={!approvedOnly ? "page" : undefined} className={`pb-3 ${!approvedOnly ? "border-b-2 border-brand-gold text-brand-navy" : "text-slate-600 hover:text-brand-navy"}`}>Saved Plans</Link>
        <Link href="/worship-plans/schedule" className="pb-3 text-slate-600 hover:text-brand-navy">Sunday Schedule</Link>
      </nav>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search worship plans" className="h-11 rounded border border-neutral-gray-light bg-white px-3 text-sm" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded border border-neutral-gray-light bg-white px-3 text-sm">
          <option value="all">All statuses</option><option value="draft">Draft</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="published">Published</option>
        </select>
      </div>
      <ul className="space-y-3">
        {visiblePlans.map((w) => (
          <li key={w.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-navy-900">{w.title || "Untitled Worship Plan"}</p>
              <p className="text-xs font-medium uppercase text-slate-500">
                {(w.review_status || "draft").replaceAll("_", " ")}
                {w.risk_level === "high" ? " · high risk" : ""}
              </p>
              <p className="text-slate-600 text-sm">
                {w.theme} • {w.scripture} • {w.style}
              </p>
              <PlanListActions resource="worship-plans" id={w.id} canManage={canCreate} />
            </div>
            <Link
              href={`/worship-plans/${w.id}`}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
