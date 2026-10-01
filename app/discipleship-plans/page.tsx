"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRoleAccess } from "@/components/RoleAccessProvider";
import PlanListActions from "@/components/PlanListActions";

type DiscipleshipPlan = {
  id: string;
  title: string | null;
  review_status: string | null;
  risk_level: string | null;
  group_name: string | null;
  pathway_step: string | null;
  weeks: number | null;
  book_range: string | null;
  scripture: string | null;
  topic: string | null;
};

export default function PlansPage() {
  const { canCreateDiscipleship } = useRoleAccess();
  const [plans, setPlans] = useState<DiscipleshipPlan[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/plans/list");
      const data = await res.json();
      setPlans(data.plans || []);
    }
    load();
  }, []);

  const visiblePlans = plans.filter((plan) => {
    const text = [plan.title, plan.group_name, plan.pathway_step, plan.book_range, plan.scripture, plan.topic].filter(Boolean).join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) && (status === "all" || plan.review_status === status);
  });

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy-900">Saved Discipleship Plans</h1>
        {canCreateDiscipleship && (
          <Link
            href="/discipleship-plans/new"
            className="px-4 py-2 bg-brand-gold text-brand-navy rounded text-sm font-semibold"
          >
            + New Plan
          </Link>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search discipleship plans" className="h-11 rounded border border-neutral-gray-light bg-white px-3 text-sm" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded border border-neutral-gray-light bg-white px-3 text-sm">
          <option value="all">All statuses</option><option value="draft">Draft</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="published">Published</option>
        </select>
      </div>
      <ul className="space-y-3">
        {visiblePlans.map((p) => (
          <li key={p.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-navy-900">{p.title || "Untitled Plan"}</p>
              <p className="text-xs font-medium uppercase text-slate-500">
                {(p.review_status || "draft").replaceAll("_", " ")}
                {p.risk_level === "high" ? " · high risk" : ""}
              </p>
              <p className="text-slate-600 text-sm">{p.group_name}</p>
              <p className="text-slate-600 text-sm">
                {p.pathway_step} • {p.weeks} weeks • {p.book_range || p.scripture || p.topic}
              </p>
              <PlanListActions resource="plans" id={p.id} canManage={canCreateDiscipleship} />
            </div>
            <a
              href={`/discipleship-plans/${p.id}`}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
