"use client";

import { useState } from "react";

/* ---------------------------------------------
   PATHWAY BUILDER COMPONENT
---------------------------------------------- */
function PathwayBuilder({ selected, onSelect }) {
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
  const [plan, setPlan] = useState(null);

  const [selectedStep, setSelectedStep] = useState(null);

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

  async function handleSubmit(e) {
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
        <div className="bg-white p-8 rounded-xl shadow space-y-4">
          <h2 className="text-2xl font-bold text-navy-900">Generated Plan</h2>
          <pre className="whitespace-pre-wrap text-slate-700">
            {plan}
          </pre>
        </div>
      )}
    </div>
  );
}
