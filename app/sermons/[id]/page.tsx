"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlanWorkflow from "@/components/PlanWorkflow";
import { useRoleAccess } from "@/components/RoleAccessProvider";
import { canEditPlan } from "@/lib/roles";

export default function SermonDetailPage() {
  const { role, userId } = useRoleAccess();
  const params = useParams();
  const id = params.id;

  const [sermon, setSermon] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const res = await fetch(`/api/sermons/${id}`);
      const data = await res.json();
      setSermon(data.sermon || null);
    }

    load();
  }, [id]);

  if (!sermon) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <p className="text-slate-600">Loading sermon...</p>
      </div>
    );
  }

  const canEdit = role
    ? canEditPlan(role, sermon.review_status, userId === sermon.user_id)
    : false;

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">
        {sermon.title || "Untitled Sermon"}
      </h1>

      <p className="text-sm text-slate-600">
        {sermon.passage} • {sermon.topic} • {sermon.audience}
      </p>

      <PlanWorkflow
        type="sermons"
        plan={{
          id: sermon.id,
          user_id: sermon.user_id,
          review_status: sermon.review_status,
          risk_level: sermon.risk_level,
          review_note: sermon.review_note,
          title: sermon.title || "Untitled Sermon",
          content: sermon.sermon_html || ""
        }}
      />

      {!canEdit && <div
        className="prose prose-slate prose-sm max-w-none bg-white p-8 rounded-xl shadow
          prose-headings:text-navy-900 prose-headings:font-semibold
          prose-h1:text-xl prose-h1:mb-2
          prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2
          prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
          prose-p:my-2 prose-p:leading-relaxed
          prose-ul:my-2 prose-li:my-1
          prose-hr:my-6"
        dangerouslySetInnerHTML={{ __html: sermon.sermon_html }}
      />}
    </div>
  );
}
