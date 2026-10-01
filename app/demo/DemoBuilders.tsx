"use client";

import { createElement, Fragment, useState, type ReactNode } from "react";

type Tool = "sermon" | "worship" | "discipleship";
const toolInfo: Record<Tool, { label: string; title: string; description: string }> = {
  sermon: { label: "Sermon", title: "Build a sermon", description: "Start with a passage and message focus." },
  worship: { label: "Worship", title: "Plan a worship service", description: "Set a theme and create a service flow." },
  discipleship: { label: "Discipleship", title: "Create a discipleship plan", description: "Shape a multi-week pathway for a group." }
};

const allowedHtmlTags = new Set(["h1", "h2", "h3", "h4", "p", "ul", "ol", "li", "strong", "b", "em", "i", "blockquote", "hr", "br"]);

function renderSafeHtmlNode(node: Node, key: string): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  if (["script", "style", "iframe", "object", "svg", "math"].includes(tag)) return null;
  const children = Array.from(element.childNodes).map((child, index) => renderSafeHtmlNode(child, `${key}-${index}`));
  if (!allowedHtmlTags.has(tag)) return createElement(Fragment, { key }, ...children);
  return createElement(tag, { key }, ...children);
}

function SafeDocumentContent({ html }: { html: string }) {
  if (typeof DOMParser === "undefined") return null;
  const parsed = new DOMParser().parseFromString(html, "text/html");
  return <div className="prose prose-slate prose-sm max-w-none prose-headings:font-semibold prose-headings:text-brand-navy prose-h1:mb-2 prose-h1:text-xl prose-h2:mb-2 prose-h2:mt-6 prose-h2:text-lg prose-h3:mb-2 prose-h3:mt-5 prose-h3:text-base prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-li:my-1 prose-hr:my-6">{Array.from(parsed.body.childNodes).map((node, index) => renderSafeHtmlNode(node, `root-${index}`))}</div>;
}

export default function DemoBuilders() {
  const [tool, setTool] = useState<Tool>("sermon");
  const [inputs, setInputs] = useState<Record<Tool, Record<string, string>>>({
    sermon: { title: "", outlineType: "", passage: "", topic: "", audience: "", tone: "", keyPoints: "" },
    worship: { serviceDate: "", theme: "", scripture: "", style: "", notes: "" },
    discipleship: { title: "", groupName: "", audience: "", frequency: "", goals: "", topic: "", scripture: "", bookRange: "", studyMode: "", pathwayStep: "", weeks: "" }
  });
  const [output, setOutput] = useState("");
  const [outputTitle, setOutputTitle] = useState("");
  const [outputInputs, setOutputInputs] = useState<Record<Tool, Record<string, string>> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateInput(name: string, value: string) {
    setInputs((current) => ({ ...current, [tool]: { ...current[tool], [name]: value } }));
  }

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const payload = tool === "discipleship"
        ? { ...inputs.discipleship, group: { name: inputs.discipleship.groupName, audience: inputs.discipleship.audience, frequency: inputs.discipleship.frequency, goals: inputs.discipleship.goals } }
        : inputs[tool];
      const response = await fetch(`/api/demo/${tool}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Generation failed.");
      setOutputInputs((current) => ({
        ...(current || { sermon: {}, worship: {}, discipleship: {} }),
        [tool]: { ...inputs[tool] }
      }));
      setOutput(result.output || "No draft was returned.");
      setOutputTitle(result.title || "Generated Plan");
      setInputs((current) => ({
        ...current,
        [tool]: Object.fromEntries(Object.keys(current[tool]).map((key) => [key, ""]))
      }));
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Could not reach the demo generator.");
    } finally {
      setLoading(false);
    }
  }

  function field(name: string, label: string, placeholder: string, multiline = false) {
    const shared = {
      id: `${tool}-${name}`,
      value: inputs[tool][name] || "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateInput(name, event.target.value),
      placeholder,
      className: "mt-1.5 w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-slate-blue-600 focus:ring-2 focus:ring-brand-slate-blue-100"
    };
    return (
      <label key={name} htmlFor={shared.id} className="block text-sm font-medium text-brand-navy">
        {label}
        {multiline ? <textarea {...shared} rows={3} /> : <input {...shared} />}
      </label>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <section className="space-y-5">
        <div role="tablist" aria-label="Choose a demo builder" className="grid grid-cols-3 border-b border-neutral-gray-light">
          {(Object.keys(toolInfo) as Tool[]).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={tool === item} onClick={() => { setTool(item); setInputs((current) => ({ ...current, [item]: Object.fromEntries(Object.keys(current[item]).map((key) => [key, ""])) })); setOutput(""); setOutputInputs(null); setError(""); }} className={`border-b-2 px-2 py-3 text-sm font-semibold ${tool === item ? "border-brand-gold text-brand-navy" : "border-transparent text-slate-500 hover:text-brand-navy"}`}>
              {toolInfo[item].label}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-navy">{toolInfo[tool].title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{toolInfo[tool].description}</p>
        </div>

        <form onSubmit={generate} className="space-y-4">
          {tool === "sermon" && <>
            {field("title", "Sermon title", "e.g., Abiding in Christ")}
            <label htmlFor="demo-outline" className="block text-sm font-medium text-brand-navy">Outline type<select id="demo-outline" value={inputs.sermon.outlineType} onChange={(event) => updateInput("outlineType", event.target.value)} className="mt-1.5 w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">Choose an outline</option><option value="three_point">3-Point Outline</option><option value="expository">Expository Outline</option><option value="narrative">Narrative Outline</option><option value="application_heavy">Application-Heavy Outline</option></select></label>
            {field("passage", "Scripture passage", "e.g., John 15:1-11")}
            {field("topic", "Message focus", "e.g., Abiding in Christ")}
            {field("audience", "Audience", "e.g., Sunday gathering")}
            {field("tone", "Tone", "e.g., Encouraging and practical")}
            {field("keyPoints", "Key points", "What should the message emphasize?", true)}
          </>}
          {tool === "worship" && <>
            {field("serviceDate", "Service date (optional)", "YYYY-MM-DD")}
            {field("theme", "Service theme", "e.g., Hope in Christ")}
            {field("scripture", "Scripture", "e.g., Romans 15:13")}
            {field("style", "Worship style", "e.g., Blended")}
            {field("notes", "Service notes", "Transitions, prayers, or special elements", true)}
          </>}
          {tool === "discipleship" && <>
            {field("title", "Plan title", "e.g., Growing in Prayer")}
            {field("groupName", "Group name", "e.g., Tuesday small group")}
            {field("audience", "Who is this for?", "e.g., Adults growing in faith")}
            {field("frequency", "Meeting frequency", "e.g., Weekly")}
            {field("goals", "Group goals", "What would you like the group to grow in?", true)}
            {field("topic", "Plan focus", "e.g., Life with Christ")}
            {field("scripture", "Scripture", "e.g., Colossians 2:6-7")}
            {field("bookRange", "Book or passage range (optional)", "e.g., James 1-5")}
            {inputs.discipleship.bookRange && <label htmlFor="demo-study-mode" className="block text-sm font-medium text-brand-navy">Study mode<select id="demo-study-mode" value={inputs.discipleship.studyMode} onChange={(event) => updateInput("studyMode", event.target.value)} className="mt-1.5 w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">Select study mode</option><option value="entire-book">Entire book study</option><option value="key-themes">Key themes</option></select></label>}
            <div className="grid grid-cols-2 gap-3">
              {field("pathwayStep", "Pathway step", "Foundation, Growth, Service...")}
              <label htmlFor="demo-weeks" className="block text-sm font-medium text-brand-navy">Weeks<input id="demo-weeks" type="number" min={2} max={8} required value={inputs.discipleship.weeks} onChange={(event) => updateInput("weeks", event.target.value)} className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2.5 text-sm" /></label>
            </div>
          </>}
          <button type="submit" disabled={loading} className="w-full rounded bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-navy transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60">
            {loading ? "Preparing your draft..." : `Generate ${toolInfo[tool].label} draft`}
          </button>
        </form>
        {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      </section>

      <section aria-live="polite" className="min-h-[34rem] overflow-hidden rounded-xl border border-neutral-gray-light bg-white shadow-sm">
        {output ? <>
          <header className="border-b border-neutral-gray-light bg-neutral-warm-light px-6 py-5 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-slate-blue-700">{toolInfo[tool].label} · Demo Draft</p>
                <h2 className="mt-2 text-2xl font-bold text-brand-navy">{outputTitle}</h2>
                <p className="mt-2 text-sm text-text-secondary">{tool === "sermon" ? [outputInputs?.sermon.passage, outputInputs?.sermon.audience].filter(Boolean).join(" · ") : tool === "worship" ? [outputInputs?.worship.scripture, outputInputs?.worship.style].filter(Boolean).join(" · ") : [outputInputs?.discipleship.pathwayStep, outputInputs?.discipleship.weeks ? `${outputInputs.discipleship.weeks} weeks` : ""].filter(Boolean).join(" · ")}</p>
              </div>
              <button type="button" onClick={() => void navigator.clipboard.writeText(output)} className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Copy text</button>
            </div>
          </header>
          <article className="prose prose-slate max-w-none px-6 py-7 sm:px-8 sm:py-9">
            <SafeDocumentContent html={output} />
          </article>
          <footer className="border-t border-neutral-gray-light px-6 py-4 text-xs leading-5 text-slate-500 sm:px-8">Preview draft · Review and tailor all content before ministry use.</footer>
        </> : <div className="p-6 sm:p-8">
          <div className="border-b border-neutral-gray-light pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-slate-blue-700">{toolInfo[tool].label} · Demo Draft</p>
            <h2 className="mt-2 text-xl font-bold text-brand-navy">Your draft will appear here</h2>
          </div>
          <div className="mt-8 space-y-4"><div className="h-4 w-2/3 rounded bg-slate-100" /><div className="h-3 w-full rounded bg-slate-100" /><div className="h-3 w-11/12 rounded bg-slate-100" /><div className="h-3 w-3/4 rounded bg-slate-100" /><div className="mt-8 h-4 w-1/3 rounded bg-slate-100" /><div className="h-3 w-full rounded bg-slate-100" /><div className="h-3 w-5/6 rounded bg-slate-100" /></div>
        </div>}
      </section>
    </div>
  );
}
