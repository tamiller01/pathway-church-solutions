"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRoleAccess } from "@/components/RoleAccessProvider";

type SermonListItem = {
  id: string;
  title: string | null;
  passage: string | null;
  topic: string | null;
  audience: string | null;
  review_status: string | null;
  risk_level: string | null;
};

export default function SermonsPage() {
  const { canCreate } = useRoleAccess();
  const searchParams = useSearchParams();
  const approvedOnly = searchParams.get("status") === "approved";
  const [sermons, setSermons] = useState<SermonListItem[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/sermons/list${approvedOnly ? "?status=approved" : ""}`);
      const data = await res.json();
      setSermons(data.sermons || []);
    }
    load();
  }, [approvedOnly]);

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy-900">{approvedOnly ? "Approved Sermons" : "Saved Sermons"}</h1>
        <div className="flex items-center gap-3">
          {approvedOnly && <Link href="/sermons" className="text-sm font-medium text-brand-slate-blue-700 hover:underline">All sermons</Link>}
          {canCreate && (
          <Link
            href="/sermons/new"
            className="px-4 py-2 bg-brand-gold text-brand-navy rounded text-sm font-semibold"
          >
            + New Sermon
          </Link>
          )}
        </div>
      </div>
      <ul className="space-y-3">
        {sermons.map((s) => (
          <li key={s.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-navy-900">{s.title || "Untitled Sermon"}</p>
              <p className="text-xs font-medium uppercase text-slate-500">
                {(s.review_status || "draft").replaceAll("_", " ")}
                {s.risk_level === "high" ? " · high risk" : ""}
              </p>
              <p className="text-slate-600 text-sm">
                {s.passage} • {s.topic} • {s.audience}
              </p>
            </div>
            <Link
              href={`/sermons/${s.id}`}
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
