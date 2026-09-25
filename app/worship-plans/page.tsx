"use client";

import { useEffect, useState } from "react";

export default function WorshipPlansPage() {
  const [worshipPlans, setWorshipPlans] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/worship-plans/list");
      const data = await res.json();
      setWorshipPlans(data.worshipPlans || []);
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy-900">Saved Worship Plans</h1>
      <ul className="space-y-3">
        {worshipPlans.map((w) => (
          <li key={w.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-navy-900">{w.title || "Untitled Worship Plan"}</p>
              <p className="text-slate-600 text-sm">
                {w.theme} • {w.scripture} • {w.style}
              </p>
            </div>
            <a
              href={`/worship-plans/${w.id}`}
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
