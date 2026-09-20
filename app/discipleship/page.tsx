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
            Click to build a multi‑week discipleship pathway around this step.
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
    <div className="bg-white p-8 rounded-xl shadow space-y-8">
      <h2 className="text-2xl font-bold text-navy-900">How Pathway Ensures Biblical Faithfulness</h2>

      {/* Doctrinal Guardrails */}
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

      {/* Scripture Support */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Scripture Support</h3>
        <p className="text-slate-700">
          Every discipleship plan includes multiple Scripture references quoted accurately (ESV or NASB),
          along with contextual notes explaining how each passage reinforces the discipleship theme.
        </p>
      </section>

      {/* Trusted Commentary Sources */}
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
        <p className="text-slate-700">
          We never quote or reference leaders with substantiated ethical, moral, or legal controversy.
        </p>
      </section>

      {/* Local Church Priority */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Local Church Priority</h3>
        <p className="text-slate-700">
          Pathway Church Solutions exists to support pastors—not replace them. Every discipleship plan
          encourages reliance on Scripture, prayer, pastoral leadership, and the local church community.
        </p>
      </section>

      {/* Why This Matters */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Why This Matters</h3>
        <p className="text-slate-700">
          Small churches deserve doctrinal safety, trusted theological support, and biblically faithful content.
          These guardrails ensure every discipleship plan is Christ-centered, pastorally warm, and rooted in Scripture.
        </p>
      </section>
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
  const [studyMode, setStudyMode] = useState(""); // NEW FIELD

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/discipleship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-navy-900">Discipleship Tools</h1>
        <p className="text-lg text-slate-600">
          Build multi‑week discipleship pathways using AI.
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
        <h2 className="text-2xl font-bold text-navy-900">Pathway Builder</h2>
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

      {/* SUPPORT DOCUMENTATION */}
      <SupportDocumentation />

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
