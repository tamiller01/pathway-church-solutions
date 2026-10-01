"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRoleAccess } from "@/components/RoleAccessProvider";

/* ---------------------------------------------
   SUPPORT DOCUMENTATION COMPONENT
---------------------------------------------- */
function SupportDocumentation() {
  return (
    <details className="group bg-white rounded-xl shadow [&_summary::-webkit-details-marker]:hidden">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-6 rounded-xl bg-yellow-50 border border-yellow-300">
        <div>
          <h2 className="text-lg font-bold text-navy-900">How Pathway Ensures Biblical Faithfulness</h2>
          <p className="text-sm text-slate-600 mt-1">
            Doctrinal guardrails, accurate Scripture, and trusted commentary keep every worship plan Christ-centered. Click to see the full details.
          </p>
        </div>
        <span className="text-navy-900 font-bold shrink-0 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="p-8 pt-6 space-y-8">

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Doctrinal Guardrails</h3>
        <p className="text-slate-700">
          Every worship plan generated through Pathway Church Solutions is built on historic Christian
          orthodoxy and aligned with the authority of Scripture. Our system rejects content that promotes:
        </p>
        <ul className="list-disc pl-6 text-slate-700">
          <li>Works-based salvation</li>
          <li>Universalism</li>
          <li>Prosperity gospel</li>
          <li>Mystical or occult practices</li>
          <li>Speculative prophecy or date-setting</li>
          <li>Redefinition of marriage or gender</li>
          <li>Denial of biblical sexual ethics</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Scripture Support</h3>
        <p className="text-slate-700">
          Every worship plan includes Scripture references quoted accurately (ESV or NASB), along with
          contextual notes explaining how each passage reinforces the service theme.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Trusted Commentary Sources</h3>
        <p className="text-slate-700">
          Worship plans may include short excerpts or song selections rooted in historically trusted
          Christian voices and hymnody, such as:
        </p>
        <ul className="list-disc pl-6 text-slate-700">
          <li>Charles Spurgeon</li>
          <li>John Stott</li>
          <li>J.I. Packer</li>
          <li>A.W. Tozer</li>
          <li>Matthew Henry</li>
          <li>R.C. Sproul</li>
          <li>D. Martyn Lloyd-Jones</li>
          <li>Oswald Chambers</li>
          <li>C.S. Lewis</li>
          <li>John Calvin</li>
          <li>Augustine</li>
        </ul>
        <p className="text-slate-700">
          We never quote or reference leaders with substantiated ethical, moral, or legal controversy.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Local Church Priority</h3>
        <p className="text-slate-700">
          Pathway Church Solutions exists to support pastors—not replace them. Every worship plan
          encourages reliance on Scripture, prayer, pastoral leadership, and the local church community.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Why This Matters</h3>
        <p className="text-slate-700">
          Small churches deserve doctrinal safety, trusted theological support, and biblically faithful content.
          These guardrails ensure every worship plan is Christ-centered, pastorally warm, and rooted in Scripture.
        </p>
      </section>

      </div>
    </details>
  );
}

export default function WorshipPage() {
  const { canCreate } = useRoleAccess();
  const searchParams = useSearchParams();
  const requestedServiceDate = searchParams.get("serviceDate") || "";
  const [loading, setLoading] = useState(false);

  // NEW: plan is now JSON, not a string
  const [plan, setPlan] = useState<any | null>(null);

  // NEW: assignments stored separately
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");

  const [formData, setFormData] = useState({
    serviceDate: "",
    theme: "",
    scripture: "",
    style: "",
    notes: ""
  });

  useEffect(() => {
    if (requestedServiceDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((previous) => ({ ...previous, serviceDate: requestedServiceDate }));
    }
  }, [requestedServiceDate]);

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
      // Pre-fill from the AI-generated title; still editable before saving
      setTitle(data.plan.title || "");

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

  if (!canCreate) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-navy-900">Worship plan review access</h1>
        <p className="mt-3 text-slate-600">Your Reviewer role can view saved worship plans. Creating plans is limited to Pastors and Admins.</p>
        <Link href="/worship-plans" className="mt-5 inline-block font-medium text-blue-700 underline">View saved worship plans</Link>
      </main>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy-900">Worship Planning</h1>
          <p className="text-lg text-slate-600">
            Generate a complete worship plan using AI.
          </p>
        </div>
        <Link
          href="/worship-plans"
          className="px-3 py-2 border rounded text-sm text-navy-900 whitespace-nowrap"
        >
          Saved Worship Plans
        </Link>
      </div>
      <Link href="/worship-plans/schedule" className="inline-block text-sm font-medium text-brand-slate-blue-700 hover:underline">
        View Sunday Schedule
      </Link>

      {/* SUPPORT DOCUMENTATION */}
      <SupportDocumentation />

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow"
      >
        <div className="space-y-2">
          <label className="font-medium text-navy-900" htmlFor="service-date">Service Date</label>
          <p className="text-sm text-slate-600">
            This date places the plan on the Sunday Schedule after you generate and save it.
          </p>
          <input
            id="service-date"
            type="date"
            className="border p-3 rounded w-full"
            value={formData.serviceDate}
            onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
          />
        </div>

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
              <div className="relative">
                <input
                  className="text-3xl font-bold text-navy-900 w-full border border-dashed border-slate-300 rounded px-1 py-0.5 -mx-1 pr-8 hover:border-slate-400 focus:border-yellow-500 focus:border-solid focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Worship Plan"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  ✎
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1">Click the title to rename it</p>
              <p className="text-slate-600 text-lg mt-2">
                Prepared for Worship • {new Date().toLocaleDateString()}
              </p>
            </header>

            {/* FLOW ITEMS */}
            {plan.flow.map((item: any) => (
              <div key={item.id} className="space-y-4 border-b pb-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold text-navy-900">
                    {item.label}
                  </h3>

                  {/* ASSIGNMENT FIELD — inline & unobtrusive so it doesn't break the plan's flow */}
                  <input
                    className="border-b border-dashed border-slate-300 bg-transparent text-sm text-slate-500 text-right w-32 focus:w-48 focus:border-yellow-500 focus:outline-none transition-all placeholder:text-slate-400"
                    placeholder="Assign person"
                    value={assignments[item.id] || ""}
                    onChange={(e) => updateAssignment(item.id, e.target.value)}
                  />
                </div>

                <div dangerouslySetInnerHTML={{ __html: item.html }} />
              </div>
            ))}

            {/* FOOTER */}
            <footer className="border-t pt-6 mt-10 text-sm text-slate-500">
              <p>Pathway Church Solutions • pathwaychurchsolutions.com</p>
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
          </div>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-4">

            {/* SAVE BUTTON */}
            <button
              onClick={async () => {
                const res = await fetch("/api/worship-plans", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: title || "Untitled Worship Plan",
                    theme: formData.theme,
                    scripture: formData.scripture,
                    style: formData.style,
                    notes: formData.notes,
                    plan,
                    assignments
                  })
                });

                const data = await res.json();
                if (data.error) alert("Failed to save worship plan.");
                else alert("Worship plan saved!");
              }}
              className="bg-slate-200 px-4 py-2 rounded"
            >
              Save Plan
            </button>

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
