"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorshipPlanDetailPage() {
  const params = useParams();
  const id = params.id;

  const [worshipPlan, setWorshipPlan] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const res = await fetch(`/api/worship-plans/${id}`);
      const data = await res.json();
      setWorshipPlan(data.worshipPlan || null);
    }

    load();
  }, [id]);

  if (!worshipPlan) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <p className="text-slate-600">Loading worship plan...</p>
      </div>
    );
  }

  const plan = worshipPlan.plan_json;
  const assignments = worshipPlan.assignments || {};

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">
        {worshipPlan.title || "Untitled Worship Plan"}
      </h1>

      <p className="text-sm text-slate-600">
        {worshipPlan.theme} • {worshipPlan.scripture} • {worshipPlan.style}
      </p>

      <div
        className="prose prose-slate prose-sm max-w-none bg-white p-8 rounded-xl shadow
          prose-headings:text-navy-900 prose-headings:font-semibold
          prose-h1:text-xl prose-h1:mb-2
          prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2
          prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
          prose-p:my-2 prose-p:leading-relaxed
          prose-ul:my-2 prose-li:my-1
          prose-hr:my-6"
      >
        {plan?.flow?.map((item: any) => (
          <div key={item.id} className="space-y-2 border-b pb-4 mb-4">
            <div className="flex items-baseline justify-between gap-4">
              <h3>{item.label}</h3>
              {assignments[item.id] && (
                <span className="text-sm text-slate-500 whitespace-nowrap">
                  Assigned to: {assignments[item.id]}
                </span>
              )}
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.html }} />
          </div>
        ))}
      </div>
    </div>
  );
}
