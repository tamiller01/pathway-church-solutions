"use client";

import Link from "next/link";
import { useState } from "react";
import { useRoleAccess } from "@/components/RoleAccessProvider";

/* ---------------------------------------------
   OUTLINE GENERATOR COMPONENT
---------------------------------------------- */
function OutlineGenerator({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const outlines = [
    {
      id: "three_point",
      label: "3-Point Outline",
      description: "Choose this for a clear, memorable structure that's easy for listeners to follow."
    },
    {
      id: "expository",
      label: "Expository Outline",
      description: "Choose this to walk verse-by-verse through a passage with in-depth exposition."
    },
    {
      id: "narrative",
      label: "Narrative Outline",
      description: "Choose this to tell a biblical story arc that draws listeners into the text."
    },
    {
      id: "application_heavy",
      label: "Application-Heavy Outline",
      description: "Choose this to emphasize practical takeaways and real-life application."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {outlines.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={`border p-4 rounded-xl text-left shadow-sm transition
            ${selected === o.id ? "border-yellow-500 shadow-lg" : "border-gray-300"}
          `}
        >
          <h3 className="text-lg font-semibold text-navy-900">{o.label}</h3>
          <p className="text-slate-600 text-sm mt-1">
            {o.description}
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
            Doctrinal guardrails, accurate Scripture, and trusted commentary keep every sermon Christ-centered. Click to see the full details.
          </p>
        </div>
        <span className="text-navy-900 font-bold shrink-0 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="p-8 pt-6 space-y-8">

      {/* Doctrinal Guardrails */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Doctrinal Guardrails</h3>
        <p className="text-slate-700">
          Every sermon generated through Pathway Church Solutions is built on historic Christian orthodoxy
          and aligned with the authority of Scripture. Our system rejects content that promotes:
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
          Every sermon includes multiple Scripture references quoted accurately (ESV or NASB), along with
          contextual notes explaining how each passage reinforces the message. Cross-references are used to
          strengthen doctrinal clarity and biblical consistency.
        </p>
      </section>

      {/* Trusted Commentary Sources */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Trusted Commentary Sources</h3>
        <p className="text-slate-700">
          Sermons may include short excerpts from historically trusted Christian voices such as:
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
          Pathway Church Solutions exists to support pastors—not replace them. Every sermon encourages
          reliance on Scripture, prayer, pastoral leadership, and the local church community.
        </p>
      </section>

      {/* Why This Matters */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-navy-900">Why This Matters</h3>
        <p className="text-slate-700">
          Small churches deserve doctrinal safety, trusted theological support, and biblically faithful content.
          These guardrails ensure every sermon is Christ-centered, pastorally warm, and rooted in Scripture.
        </p>
      </section>

      </div>
    </details>
  );
}

/* ---------------------------------------------
   MAIN SERMON BUILDER PAGE
---------------------------------------------- */
export default function SermonBuilderPage() {
  const { canCreate } = useRoleAccess();
  const [loading, setLoading] = useState(false);
  const [sermon, setSermon] = useState<string | null>(null);

  const [outlineType, setOutlineType] = useState<string | null>(null);

  const [title, setTitle] = useState("");

  const [formData, setFormData] = useState({
    passage: "",
    topic: "",
    audience: "",
    tone: "",
    keyPoints: ""
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sermon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          outlineType
        })
      });

      const data = await res.json();
      setSermon(data.sermon);
    } catch (err) {
      console.error("Error generating sermon:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!canCreate) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-navy-900">Sermon review access</h1>
        <p className="mt-3 text-slate-600">Your Reviewer role can view saved sermons. Creating sermons is limited to Pastors and Admins.</p>
        <Link href="/sermons" className="mt-5 inline-block font-medium text-blue-700 underline">View saved sermons</Link>
      </main>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy-900">Sermon Builder</h1>
          <p className="text-lg text-slate-600">
            Create structured, biblical sermons using AI.
          </p>
        </div>
        <Link
          href="/sermons"
          className="px-3 py-2 border rounded text-sm text-navy-900 whitespace-nowrap"
        >
          Saved Sermons
        </Link>
      </div>

      {/* SUPPORT DOCUMENTATION */}
      <SupportDocumentation />

      {/* TITLE FIELD */}
      <div className="space-y-2 bg-white p-8 rounded-xl shadow">
        <label className="text-2xl font-bold text-navy-900">Sermon Title</label>
        <input
          className="border p-3 rounded w-full"
          placeholder="e.g., Abiding in Christ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* OUTLINE GENERATOR */}
      <div className="space-y-4 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-navy-900">Choose Outline Type</h2>
        <OutlineGenerator selected={outlineType} onSelect={setOutlineType} />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow"
      >
        <div className="space-y-2">
        <label className="text-2xl font-bold text-navy-900">Sermon Focus</label> <br></br><br></br>
          <label className="font-medium text-navy-900">Passage</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., John 15:1–11"
            value={formData.passage}
            onChange={(e) =>
              setFormData({ ...formData, passage: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Topic</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Abiding in Christ"
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Audience</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Sunday Morning Adults"
            value={formData.audience}
            onChange={(e) =>
              setFormData({ ...formData, audience: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Tone</label>
          <input
            className="border p-3 rounded w-full"
            placeholder="e.g., Encouraging, Expository, Challenging"
            value={formData.tone}
            onChange={(e) =>
              setFormData({ ...formData, tone: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-navy-900">Key Points</label>
          <textarea
            className="border p-3 rounded w-full min-h-[120px]"
            placeholder="List any key points or themes you want included..."
            value={formData.keyPoints}
            onChange={(e) =>
              setFormData({ ...formData, keyPoints: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-navy-900 px-6 py-3 rounded font-semibold"
        >
          {loading ? "Generating..." : "Generate Sermon"}
        </button>
      </form>

      {/* OUTPUT + SAVE + EXPORT */}
      {sermon && (
        <div className="bg-white p-8 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-bold text-navy-900">Generated Sermon</h2>

          {/* PROFESSIONAL SERMON DOCUMENT */}
          <div
            id="sermon-output"
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
                {title || "Untitled Sermon"}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Prepared for Sunday Worship • {new Date().toLocaleDateString()}
              </p>
            </header>

            {/* SERMON CONTENT */}
            <div dangerouslySetInnerHTML={{ __html: sermon }} />

            {/* FOOTER */}
            <footer className="border-t pt-4 mt-8 text-sm text-slate-500">
              <p>Pathway Church Solutions • pathwaychurchsolutions.com</p>
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
          </div>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-4">

            {/* SAVE BUTTON */}
            <button
              onClick={async () => {
                const res = await fetch("/api/sermons", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: title || "Untitled Sermon",
                    ...formData,
                    outlineType,
                    sermonHtml: sermon
                  })
                });

                const data = await res.json();
                if (data.error) alert("Failed to save sermon.");
                else alert("Sermon saved!");
              }}
              className="bg-slate-200 px-4 py-2 rounded"
            >
              Save Sermon
            </button>

            {/* COPY FORMATTED TEXT */}
            <button
              onClick={() => {
                const el = document.getElementById("sermon-output");
                const text = el?.innerText || "";
                navigator.clipboard.writeText(text);
                alert("Copied formatted sermon!");
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
