"use client";

import Link from "next/link";
import { useState } from "react";
import { useRoleAccess } from "@/components/RoleAccessProvider";

/* ---------------------------------------------
   PATHWAY BUILDER COMPONENT
---------------------------------------------- */
function PathwayBuilder({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const steps = [
    {
      id: "foundation",
      label: "Step 1: Foundation",
      description: "Choose this for new believers who need core doctrine and daily spiritual habits."
    },
    {
      id: "growth",
      label: "Step 2: Growth",
      description: "Choose this to deepen Scripture knowledge and build consistent prayer and study rhythms."
    },
    {
      id: "service",
      label: "Step 3: Service",
      description: "Choose this to help believers discover their gifts and start serving the local church."
    },
    {
      id: "leadership",
      label: "Step 4: Leadership",
      description: "Choose this to equip mature believers to lead, disciple others, and multiply ministry."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {steps.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`border p-4 rounded-xl text-left shadow-sm transition
            ${selected === s.id ? "border-yellow-500 shadow-lg" : "border-gray-300"}
          `}
        >
          <h3 className="text-lg font-semibold text-navy-900">{s.label}</h3>
          <p className="text-slate-600 text-sm mt-1">
            {s.description}
          </p>
        </button>
      ))}
    </div>
  );
}

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
            Doctrinal guardrails, accurate Scripture, and trusted commentary keep every plan Christ-centered. Click to see the full details.
          </p>
        </div>
        <span className="text-navy-900 font-bold shrink-0 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="p-8 pt-6 space-y-8">

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Doctrinal Guardrails</h3>
        <p className="text-slate-700">
          Every discipleship plan generated through Pathway Church Solutions is built on historic Christian
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
          Every discipleship plan includes multiple Scripture references quoted accurately (ESV or NASB),
          along with contextual notes explaining how each passage reinforces the discipleship theme.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Trusted Commentary Sources</h3>
        <p className="text-slate-700">
          Plans may include short excerpts from historically trusted Christian voices such as:
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
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Local Church Priority</h3>
        <p className="text-slate-700">
          Pathway Church Solutions exists to support pastors—not replace them. Every discipleship plan
          encourages reliance on Scripture, prayer, pastoral leadership, and the local church community.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Why This Matters</h3>
        <p className="text-slate-700">
          Small churches deserve doctrinal safety, trusted theological support, and biblically faithful content.
          These guardrails ensure every discipleship plan is Christ-centered, pastorally warm, and rooted in Scripture.
        </p>
      </section>

      </div>
    </details>
  );
}

/* ---------------------------------------------
   MAIN DISCIPLESHIP TOOLS PAGE
---------------------------------------------- */
export default function DiscipleshipToolsPage() {
  const { canCreate } = useRoleAccess();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<number>(6);

  const [groupData, setGroupData] = useState({
    name: "",
    audience: "",
    frequency: "",
    goals: ""
  });

  const [topic, setTopic] = useState("");
  const [scripture, setScripture] = useState("");
  const [bookRange, setBookRange] = useState("");
  const [studyMode, setStudyMode] = useState("");

  // ⭐ NEW — PLAN TITLE
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/discipleship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title ,
          group: groupData,
          topic,
          scripture,
          bookRange,
          studyMode,
          pathwayStep: selectedStep,
          weeks
        })
      });

      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error("Error generating discipleship plan:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!canCreate) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-navy-900">Discipleship plan review access</h1>
        <p className="mt-3 text-slate-600">Your Reviewer role can view saved discipleship plans. Creating plans is limited to Pastors and Admins.</p>
        <Link href="/discipleship-plans" className="mt-5 inline-block font-medium text-blue-700 underline">View saved discipleship plans</Link>
      </main>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy-900">Discipleship Tools</h1>
          <p className="text-lg text-slate-600">
            Build multi‑week discipleship pathways using AI.
          </p>
        </div>
        <Link
          href="/discipleship-plans"
          className="px-3 py-2 border rounded text-sm text-navy-900 whitespace-nowrap"
        >
          Saved Plans
        </Link>
      </div>

      {/* SUPPORT DOCUMENTATION */}
      <SupportDocumentation />

      {/* ⭐ TITLE FIELD */}
      <div className="space-y-2 bg-white p-8 rounded-xl shadow">
        <label className="text-2xl font-bold text-navy-900">Plan Title</label>
        <input
          className="border p-3 rounded w-full"
          placeholder="e.g., Men's Group – James Study"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* GROUP BUILDER */}
      <div className="space-y-4 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-navy-900">Group Builder</h2>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Group Name</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Men's Bible Study"
            value={groupData.name}
            onChange={(e) =>
              setGroupData({ ...groupData, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Audience</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., College Students"
            value={groupData.audience}
            onChange={(e) =>
              setGroupData({ ...groupData, audience: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Meeting Frequency</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Weekly"
            value={groupData.frequency}
            onChange={(e) =>
              setGroupData({ ...groupData, frequency: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Goals</label>
          <textarea
            className="border p-3 rounded w-full min-h-[120px]"
            placeholder="What is the purpose of this group?"
            value={groupData.goals}
            onChange={(e) =>
              setGroupData({ ...groupData, goals: e.target.value })
            }
          />
        </div>
      </div>

      {/* SERIES INPUTS */}
      <div className="space-y-4 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-navy-900">Series Inputs</h2>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Topic (optional)</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Fellowship, Leadership, Identity in Christ"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Scripture (optional)</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., James 1:2–4"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">
            Entire Book or Chapter Study (optional)
          </label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Revelation, James 1–5, Romans 8, John 13–17"
            value={bookRange}
            onChange={(e) => setBookRange(e.target.value)}
          />
        </div>

        {/* STUDY MODE SELECTOR */}
        {bookRange && (
          <div className="space-y-2">
            <label className="font-medium text-navy-900">
              Study Mode (required when using Book/Chapter/Range)
            </label>
            <select
              className="border p-3 rounded w-full"
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
            >
              <option value="">Select study mode...</option>
              <option value="entire-book">Entire Book Study (Sequential)</option>
              <option value="key-themes">Key Themes Within the Book (Non‑Sequential)</option>
            </select>
          </div>
        )}
      </div>
      {/* PATHWAY BUILDER */}
      <div className="space-y-4 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-navy-900">Discipleship Pathway</h2>
        <PathwayBuilder selected={selectedStep} onSelect={setSelectedStep} />

        {/* Weeks Selector */}
        <div className="space-y-2 pt-4">
          <label className="font-medium text-navy-900">Number of Weeks</label>
          <input
            type="number"
            min={1}
            max={52}
            className="border p-3 rounded w-full"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        className="bg-yellow-500 text-navy-900 px-6 py-3 rounded font-semibold"
      >
        {loading ? "Generating..." : "Generate Discipleship Plan"}
      </button>

      {/* OUTPUT PREVIEW */}
      {plan && (
        <div className="bg-white p-8 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-bold text-navy-900">Generated Plan</h2>

          {/* PROFESSIONAL DOCUMENT WRAPPER */}
          <div
            id="discipleship-output"
            className="prose prose-slate prose-sm max-w-none bg-white p-8 rounded-xl shadow
              prose-headings:text-navy-900 prose-headings:font-semibold
              prose-h1:text-xl prose-h1:mb-2
              prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2
              prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
              prose-p:my-2 prose-p:leading-relaxed
              prose-ul:my-2 prose-li:my-1
              prose-hr:my-6"
          >
            {/* HEADER */}
            <header className="border-b pb-4 mb-6">
              <h1 className="text-xl font-bold text-navy-900">
                {title || "Untitled Plan"}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Prepared for Discipleship • {new Date().toLocaleDateString()}
              </p>
            </header>

            {/* CONTENT */}
            <div dangerouslySetInnerHTML={{ __html: plan }} />

            {/* FOOTER */}
            <footer className="border-t pt-4 mt-8 text-sm text-slate-500">
              <p>Pathway Church Solutions • pathwaychurchsolutions.com</p>
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
          </div>

          {/* COPY + PRINT BUTTONS */}
          <div className="flex gap-4 pt-4">
       {/* ⭐ SAVE PLAN BUTTON — CORRECTED */}
            <button
              onClick={async () => {
                if (!plan) return;

                const res = await fetch("/api/plans", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: title || "Untitled Plan",   // ⭐ CORRECT PLAN TITLE
                    name: groupData.name || "",        // ⭐ GROUP NAME
                    group: groupData,
                    topic,
                    scripture,
                    bookRange,
                    studyMode,
                    pathwayStep: selectedStep,
                    weeks,
                    planHtml: plan
                  })
                });

                const data = await res.json();
                if (data.error) {
                  alert("Failed to save plan.");
                } else {
                  alert("Plan saved!");
                }
              }}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-200"
            >
              Save Plan
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("discipleship-output");
                const text = el?.innerText || "";
                navigator.clipboard.writeText(text);
                alert("Copied formatted discipleship plan!");
              }}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-200"
            >
              Copy
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-200"
            >
              Print
            </button>

            
          </div>
        </div>
      )}
    </div>
  );
}
