"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlanDetailPage() {
  const params = useParams();
  const id = params.id; // dynamic route param

  const [plan, setPlan] = useState(null);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const res = await fetch(`/api/plans/${id}`);
      const data = await res.json();
      setPlan(data.plan || null);
    }

    load();
  }, [id]);

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <p className="text-slate-600">Loading plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-navy-900">
        {plan.title || "Untitled Plan"}
      </h1>

      {/* Metadata */}
      <p className="text-sm text-slate-600">
        {plan.pathway_step} • {plan.weeks} weeks •{" "}
        {plan.book_range || plan.scripture || plan.topic}
      </p>

      {/* HTML Content */}
      <div
        className="prose prose-slate prose-sm max-w-none bg-white p-8 rounded-xl shadow
          prose-headings:text-navy-900 prose-headings:font-semibold
          prose-h1:text-xl prose-h1:mb-2
          prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2
          prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
          prose-p:my-2 prose-p:leading-relaxed
          prose-ul:my-2 prose-li:my-1
          prose-hr:my-6"
        dangerouslySetInnerHTML={{ __html: plan.plan_html }}
      />
    </div>
  );
}
