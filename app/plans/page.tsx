"use client";

import { useEffect, useState } from "react";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/plans/list");
      const data = await res.json();
      setPlans(data.plans || []);
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy-900">Saved Discipleship Plans</h1>
      <ul className="space-y-3">
        {plans.map((p) => (
          <li key={p.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-navy-900">{p.title || "Untitled Plan"}</p>
              <p className="text-slate-600 text-sm">{p.group_name}</p>
              <p className="text-slate-600 text-sm">
                {p.pathway_step} • {p.weeks} weeks • {p.book_range || p.scripture || p.topic}
              </p>
            </div>
            <a
              href={`/plans/${p.id}`}
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
