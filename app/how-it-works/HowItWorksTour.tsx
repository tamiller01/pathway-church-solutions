"use client";

import { useEffect, useState } from "react";

const scenes = [
  {
    eyebrow: "01 / Dashboard",
    title: "See the whole week at a glance",
    description: "Start with recent plans, role-aware actions, and a clear path into the ministry work that needs attention.",
    visual: "dashboard"
  },
  {
    eyebrow: "02 / Generate",
    title: "Start with the ministry inputs you already have",
    description: "Enter a passage, theme, audience, group, or service direction. Pathway turns those inputs into a structured first draft.",
    visual: "builder"
  },
  {
    eyebrow: "03 / Discipleship",
    title: "Build a pathway your group can follow",
    description: "Set the group, audience, goals, pathway step, and number of weeks. Pathway organizes each week around Scripture, practice, discussion, challenge, and prayer.",
    visual: "discipleship"
  },
  {
    eyebrow: "04 / Shape",
    title: "Make the draft sound like your church",
    description: "Edit the visual document directly. Refine language, emphasis, application, flow, and details without working in raw code.",
    visual: "editor"
  },
  {
    eyebrow: "05 / Review",
    title: "Keep people and guardrails in the process",
    description: "Submit plans for review, use Pathway Validation as a screening aid, and make the final decision with pastoral judgment.",
    visual: "review"
  },
  {
    eyebrow: "06 / Sunday Schedule",
    title: "Bring the pieces together",
    description: "Pair an approved sermon and worship plan on a saved Sunday schedule, then keep the service plan easy to find.",
    visual: "schedule"
  }
] as const;

type Scene = typeof scenes[number]["visual"];

export default function HowItWorksTour() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeScene = scenes[activeIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % scenes.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function selectScene(index: number) {
    setActiveIndex(index);
    setIsPlaying(false);
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#152235] shadow-deep">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-sm text-white/70 sm:px-7">
          <span className="font-semibold tracking-wide text-white">Pathway walkthrough</span>
          <div className="flex items-center gap-3">
            <span aria-live="polite">{isPlaying ? "Playing" : "Paused"}</span>
            <button type="button" onClick={() => setIsPlaying((current) => !current)} className="rounded-full border border-white/20 px-4 py-1.5 font-semibold text-white hover:bg-white/10">
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div className="grid min-h-[27rem] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">{activeScene.eyebrow}</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">{activeScene.title}</h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/70">{activeScene.description}</p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <button type="button" aria-label="Previous scene" onClick={() => selectScene((activeIndex - 1 + scenes.length) % scenes.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-white hover:bg-white/10">←</button>
              <button type="button" aria-label="Next scene" onClick={() => selectScene((activeIndex + 1) % scenes.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-white hover:bg-white/10">→</button>
              <span className="ml-2 text-sm text-white/50">{activeIndex + 1} / {scenes.length}</span>
            </div>
          </div>
          <TourVisual scene={activeScene.visual} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-5" role="tablist" aria-label="Walkthrough scenes">
        {scenes.map((scene, index) => (
          <button key={scene.visual} type="button" role="tab" aria-selected={activeIndex === index} onClick={() => selectScene(index)} className={`rounded-lg border p-3 text-left transition ${activeIndex === index ? "border-brand-gold bg-brand-gold/10" : "border-neutral-gray-light bg-white hover:border-brand-gold/60"}`}>
            <span className="text-xs font-bold text-brand-slate-blue-700">{String(index + 1).padStart(2, "0")}</span>
            <span className="mt-1 block text-sm font-semibold text-brand-navy">{scene.eyebrow.split(" / ")[1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TourVisual({ scene }: { scene: Scene }) {
  if (scene === "dashboard") {
    return <div className="flex items-center justify-center bg-[#243650] p-6 sm:p-10"><div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 pb-4"><div><div className="h-2 w-20 rounded bg-slate-200" /><div className="mt-2 h-4 w-36 rounded bg-slate-800" /></div><div className="h-8 w-8 rounded-full bg-brand-gold" /></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{["Recent Sermons", "Worship Plans", "Discipleship"].map((label) => <div key={label} className="rounded-lg bg-slate-50 p-3"><div className="h-2 w-12 rounded bg-slate-300" /><div className="mt-3 h-3 w-full rounded bg-slate-700" /><p className="mt-3 text-[10px] font-semibold text-slate-500">{label}</p></div>)}</div><div className="mt-5 h-16 rounded-lg bg-brand-gold/20 p-3"><div className="h-2 w-24 rounded bg-brand-gold" /><div className="mt-3 h-2 w-40 rounded bg-slate-300" /></div></div></div>;
  }
  if (scene === "builder") {
    return <div className="flex items-center justify-center bg-[#243650] p-6 sm:p-10"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="h-4 w-40 rounded bg-slate-800" /><div className="mt-6 space-y-4">{["Scripture passage", "Audience", "Ministry direction"].map((label) => <div key={label}><div className="mb-2 h-2 w-24 rounded bg-slate-300" /><div className="h-10 rounded border border-slate-200 bg-slate-50 px-3 py-3"><span className="text-[10px] text-slate-400">{label}</span></div></div>)}</div><div className="mt-6 h-10 rounded bg-brand-gold text-center text-xs font-bold leading-10 text-brand-navy">Generate first draft</div></div></div>;
  }
  if (scene === "editor") {
    return <div className="flex items-center justify-center bg-[#243650] p-6 sm:p-10"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex gap-2 border-b border-slate-200 pb-4">{["B", "I", "U", "H2", "↶"].map((item) => <span key={item} className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{item}</span>)}</div><div className="mt-6 space-y-3"><div className="h-5 w-4/5 rounded bg-slate-800" /><div className="h-2 w-full rounded bg-slate-200" /><div className="h-2 w-11/12 rounded bg-slate-200" /><div className="h-2 w-4/5 rounded bg-brand-gold/50" /><div className="mt-5 h-3 w-2/5 rounded bg-slate-700" /><div className="h-2 w-full rounded bg-slate-200" /><div className="h-2 w-10/12 rounded bg-slate-200" /></div></div></div>;
  }
  if (scene === "discipleship") {
    return <div className="flex items-center justify-center bg-[#243650] p-6 sm:p-10"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><div className="h-2 w-24 rounded bg-slate-300" /><div className="mt-2 h-4 w-44 rounded bg-slate-800" /></div><span className="rounded-full bg-brand-gold/20 px-3 py-1 text-[10px] font-bold text-brand-navy">6 weeks</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-slate-50 p-3"><div className="h-2 w-16 rounded bg-slate-300" /><div className="mt-3 h-3 w-28 rounded bg-slate-700" /><p className="mt-2 text-[10px] text-slate-500">Group and audience</p></div><div className="rounded-lg bg-slate-50 p-3"><div className="h-2 w-16 rounded bg-slate-300" /><div className="mt-3 h-3 w-28 rounded bg-slate-700" /><p className="mt-2 text-[10px] text-slate-500">Pathway step</p></div></div><div className="mt-4 rounded-lg bg-brand-gold/10 p-4"><p className="text-xs font-bold text-brand-navy">Weekly Breakdown</p><div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-600"><span>Primary Scripture</span><span>Spiritual Practice</span><span>Discussion Questions</span><span>Prayer Focus</span></div></div></div></div>;
  }
  if (scene === "review") {
    return <div className="flex items-center justify-center bg-[#243650] p-6 sm:p-10"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div className="h-4 w-32 rounded bg-slate-800" /><span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800">In review</span></div><div className="mt-6 space-y-3 rounded-lg bg-slate-50 p-4"><div className="h-2 w-32 rounded bg-slate-300" /><div className="h-2 w-full rounded bg-slate-200" /><div className="h-2 w-11/12 rounded bg-slate-200" /><div className="h-2 w-3/4 rounded bg-amber-300" /></div><div className="mt-5 flex gap-2"><span className="rounded bg-emerald-700 px-3 py-2 text-[10px] font-bold text-white">Approve</span><span className="rounded border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-600">Request changes</span></div></div></div>;
  }
  return <div className="flex items-center justify-center bg-[#243650] p-6 sm:p-10"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 pb-4"><div><div className="h-2 w-24 rounded bg-slate-300" /><div className="mt-2 h-4 w-40 rounded bg-slate-800" /></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">Saved Sunday</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-slate-50 p-4"><div className="h-2 w-20 rounded bg-slate-300" /><div className="mt-3 h-3 w-full rounded bg-slate-700" /><div className="mt-2 h-2 w-3/4 rounded bg-slate-200" /></div><div className="rounded-lg bg-slate-50 p-4"><div className="h-2 w-20 rounded bg-slate-300" /><div className="mt-3 h-3 w-full rounded bg-slate-700" /><div className="mt-2 h-2 w-3/4 rounded bg-slate-200" /></div></div></div></div>;
}
