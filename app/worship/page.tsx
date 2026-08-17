"use client";

import { useState } from "react";
import { savePlan } from "@/lib/savePlan";

export default function WorshipPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const [formData, setFormData] = useState({
    theme: "",
    scripture: "",
    style: "",
    notes: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/worship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error("Error generating worship plan:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-navy-900">Worship Planning</h1>
        <p className="text-lg text-slate-600">
          Generate a complete worship plan using AI.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow"
      >
        <div className="space-y-2">
          <label className="font-medium text-navy-900">Service Theme</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Hope in Christ"
            value={formData.theme}
            onChange={(e) =>
              setFormData({ ...formData, theme: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Scripture Passage</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Romans 15:13"
            value={formData.scripture}
            onChange={(e) =>
              setFormData({ ...formData, scripture: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Worship Style</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Contemporary"
            value={formData.style}
            onChange={(e) =>
              setFormData({ ...formData, style: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Notes / Transitions</label>
          <textarea
            className="border p-3 rounded w-full min-h-[120px]"
            placeholder="Any transitions, prayer notes, or special elements..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-navy-900 px-6 py-3 rounded font-semibold"
        >
          {loading ? "Generating..." : "Generate Worship Plan"}
        </button>
      </form>

      {/* OUTPUT + SAVE + EXPORT */}
      {plan && (
        <div className="bg-white p-8 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-bold text-navy-900">
            Generated Worship Plan
          </h2>

          <pre className="whitespace-pre-wrap text-slate-700">{plan}</pre>

          {/* SAVE BUTTON */}
          <button
            onClick={async () => {
              const result = await savePlan("worship", formData, plan);
              if (result.error) alert(result.error);
              else alert("Worship plan saved!");
            }}
            className="bg-navy-900 text-white px-6 py-3 rounded"
          >
            Save Plan
          </button>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={() => navigator.clipboard.writeText(plan)}
              className="bg-slate-200 px-4 py-2 rounded"
            >
              Copy
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-200 px-4 py-2 rounded"
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
