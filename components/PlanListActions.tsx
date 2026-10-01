"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlanListActions({ resource, id, canManage }: { resource: "sermons" | "worship-plans" | "plans"; id: string; canManage: boolean }) {
  const router = useRouter();
  const [working, setWorking] = useState(false);

  async function run(method: "POST" | "DELETE", message: string) {
    setWorking(true);
    try {
      const response = await fetch(`/api/${resource}/${id}`, { method });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || message);
      if (method === "POST") router.push(`/${resource === "plans" ? "discipleship-plans" : resource}/${result.id}`);
      else router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : message);
    } finally {
      setWorking(false);
    }
  }

  if (!canManage) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" disabled={working} onClick={() => void run("POST", "Could not duplicate this plan.")} className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
        {working ? "Working..." : "Duplicate"}
      </button>
      <button type="button" disabled={working} onClick={() => { if (window.confirm("Delete this saved plan? This cannot be undone.")) void run("DELETE", "Could not delete this plan."); }} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
        Delete
      </button>
    </div>
  );
}
