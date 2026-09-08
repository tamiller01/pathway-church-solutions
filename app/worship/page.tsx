"use client";

import { useState } from "react";
import { savePlan } from "@/lib/savePlan";

export default function WorshipPage() {
  const [loading, setLoading] = useState(false);

  // NEW: plan is now JSON, not a string
  const [plan, setPlan] = useState<any | null>(null);

  // NEW: assignments stored separately
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    theme: "",
    scripture: "",
    style: "",
    notes: ""
  });

  function updateAssignment(id: string, value: string) {
    setAssignments((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

      // Initialize empty assignments
      const initialAssignments: Record<string, string> = {};
      data.plan.flow.forEach((item: any) => {
        initialAssignments[item.id] = "";
      });
      setAssignments(initialAssignments);

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

          {/* PROFESSIONAL DOCUMENT WRAPPER */}
          <div
            id="worship-output"
            className="prose prose-slate max-w-none bg-white p-10 rounded-xl shadow space-y-10"
          >
            {/* HEADER */}
            <header className="border-b pb-6 mb-8">
              <h1 className="text-3xl font-bold text-navy-900">
                PATHWAY CHURCH SOLUTIONS — WORSHIP PLAN
              </h1>
              <p className="text-slate-600 text-lg mt-2">
                Prepared for Worship • {new Date().toLocaleDateString()}
              </p>
            </header>

            {/* FLOW ITEMS */}
            {plan.flow.map((item: any) => (
              <div key={item.id} className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold text-navy-900">
                  {item.label}
                </h3>

                <div dangerouslySetInnerHTML={{ __html: item.html }} />

                {/* ASSIGNMENT FIELD */}
                <div className="pt-2">
                  <label className="font-medium text-navy-900">
                    Assign Person
                  </label>
                  <input
                    className="border p-2 rounded w-full mt-1"
                    placeholder="e.g., John Smith"
                    value={assignments[item.id] || ""}
                    onChange={(e) => updateAssignment(item.id, e.target.value)}
                  />
                </div>
              </div>
            ))}

            {/* FOOTER */}
            <footer className="border-t pt-6 mt-10 text-sm text-slate-500">
              <p>Pathway Church Solutions • pathwaychurchsolutions.com</p>
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={async () => {
              const result = await savePlan("worship", formData, {
                ...plan,
                assignments
              });

              if (result.error) alert(result.error);
              else alert("Worship plan saved!");
            }}
            className="bg-navy-900 text-white px-6 py-3 rounded"
          >
            Save Plan
          </button>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-4">

            {/* COPY FORMATTED TEXT */}
           <button
  onClick={() => {
    if (!plan) return;

    let output = `PATHWAY CHURCH SOLUTIONS — WORSHIP PLAN\n`;
    output += `Prepared for Worship • ${new Date().toLocaleDateString()}\n\n`;

    plan.flow.forEach((item: any) => {
      output += `${item.label}\n`;

      // Convert HTML to plain text
      const temp = document.createElement("div");
      temp.innerHTML = item.html;
      output += temp.innerText.trim() + "\n";

      // Add assignment
      if (assignments[item.id]) {
        output += `Assigned to: ${assignments[item.id]}\n`;
      }

      output += `\n`;
    });

    output += `Pathway Church Solutions • pathwaychurchsolutions.com\n`;
    output += `© ${new Date().getFullYear()} All Rights Reserved\n`;

    navigator.clipboard.writeText(output);
    alert("Copied formatted worship plan!");
  }}
  className="bg-slate-200 px-4 py-2 rounded"
>
  Copy
</button>

            {/* PRINT */}
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
