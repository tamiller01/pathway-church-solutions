"use client";

import { useState } from "react";

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
    { id: "foundation", label: "Step 1: Foundation" },
    { id: "growth", label: "Step 2: Growth" },
    { id: "service", label: "Step 3: Service" },
    { id: "leadership", label: "Step 4: Leadership" }
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
            Click to include this step in the discipleship pathway.
          </p>
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------
   MAIN DISCIPLESHIP TOOLS PAGE
---------------------------------------------- */
export default function DiscipleshipToolsPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const [groupData, setGroupData] = useState({
    name: "",
    audience: "",
    frequency: "",
    goals: ""
  });

  const [studyData, setStudyData] = useState({
    passage: "",
    questions: "",
    takeaways: "",
    prayerPoints: ""
  });

  // ⭐ FIXED EVENT TYPE HERE
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/discipleship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group: groupData,
          study: studyData,
          pathwayStep: selectedStep
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

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-navy-900">Discipleship Tools</h1>
        <p className="text-lg text-slate-600">
          Build studies, groups, and growth pathways using AI.
        </p>
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

      {/* STUDY BUILDER */}
      <div className="space-y-4 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-navy-900">Study Builder</h2>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Passage</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., James 1:2–4"
            value={studyData.passage}
            onChange={(e) =>
              setStudyData({ ...studyData, passage: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Questions</label>
          <textarea
            className="border p-3 rounded w-full min-h-[120px]"
            placeholder="List discussion questions..."
            value={studyData.questions}
            onChange={(e) =>
              setStudyData({ ...studyData, questions: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Key Takeaways</label>
          <textarea
            className="border p-3 rounded w-full min-h-[120px]"
            placeholder="What should participants learn?"
            value={studyData.takeaways}
            onChange={(e) =>
              setStudyData({ ...studyData, takeaways: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Prayer Points</label>
          <textarea
            className="border p-3 rounded w-full min-h-[120px]"
            placeholder="Prayer focus for the group..."
            value={studyData.prayerPoints}
            onChange={(e) =>
              setStudyData({ ...studyData, prayerPoints: e.target.value })
            }
          />
        </div>
      </div>

      {/* PATHWAY BUILDER */}
      <div className="space-y-4 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-navy-900">Pathway Builder</h2>
        <PathwayBuilder selected={selectedStep} onSelect={setSelectedStep} />
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
            className="prose prose-slate max-w-none bg-white p-10 rounded-xl shadow"
          >
            {/* HEADER */}
            <header className="border-b pb-6 mb-8">
              <h1 className="text-3xl font-bold text-navy-900">
                PATHWAY CHURCH SOLUTIONS — DISCIPLESHIP PLAN
              </h1>
              <p className="text-slate-600 text-lg mt-2">
                Prepared for Discipleship • {new Date().toLocaleDateString()}
              </p>
            </header>

            {/* CONTENT */}
            <div dangerouslySetInnerHTML={{ __html: plan }} />

            {/* FOOTER */}
            <footer className="border-t pt-6 mt-10 text-sm text-slate-500">
              <p>Pathway Church Solutions • pathwaychurchsolutions.com</p>
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
          </div>

          {/* COPY + PRINT BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                const el = document.getElementById("discipleship-output");
                const text = el?.innerText || "";
                navigator.clipboard.writeText(text);
                alert("Copied formatted discipleship plan!");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Copy
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
