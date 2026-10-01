import Link from "next/link";

import DemoBuilders from "./DemoBuilders";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-neutral-warm-light text-brand-navy">
      <header className="border-b border-neutral-gray-light bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-sm font-bold">PC</span>
            <span><span className="block text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">Pathway</span><span className="block text-sm font-semibold">Church Solutions</span></span>
          </Link>
          <Link href="/" className="text-sm font-medium text-brand-slate-blue-700 hover:underline">Back to main page</Link>
        </div>
      </header>
      <section className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-slate-blue-700">Interactive preview</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Try the ministry planning tools</h1>
            <p className="mt-3 text-base leading-7 text-text-secondary">Generate a sample Sermon, Worship Plan, or Discipleship Plan without creating an account. These drafts are temporary: you can review and copy them, but not save, validate, or submit them for review.</p>
          </div>
          <details className="group mb-8 rounded-xl border border-neutral-gray-light bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl bg-brand-slate-blue-50 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">How Pathway applies its biblical and pastoral guardrails</h2>
                <p className="mt-1 text-sm text-text-secondary">See the principles used across all three demo generators.</p>
              </div>
              <span aria-hidden="true" className="shrink-0 text-xl font-semibold text-brand-navy transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="grid gap-6 p-5 text-sm leading-6 text-text-secondary sm:grid-cols-2 sm:p-6">
              <section>
                <h3 className="font-semibold text-brand-navy">Scripture and the gospel</h3>
                <p className="mt-1">Scripture is the final authority. Content is directed to keep Christ central and present salvation by grace through faith, not works, universalism, or prosperity claims.</p>
              </section>
              <section>
                <h3 className="font-semibold text-brand-navy">Church and pastoral leadership</h3>
                <p className="mt-1">AI is a preparation tool, not a spiritual authority or a replacement for pastors, prayer, Scripture, fellowship, or the local church.</p>
              </section>
              <section>
                <h3 className="font-semibold text-brand-navy">Ethics and sensitive topics</h3>
                <p className="mt-1">Prompts reflect Pathway&apos;s documented biblical guardrails on marriage, sexuality, and human life; they reject exploitation, abuse, racism, occult practices, and harmful or unlawful content.</p>
              </section>
              <section>
                <h3 className="font-semibold text-brand-navy">Tone and human review</h3>
                <p className="mt-1">Drafts should be warm, humble, truthful, and nonpartisan. Generated material is a starting point: leaders remain responsible for checking, editing, and deciding what is suitable for their church.</p>
              </section>
            </div>
          </details>
          <DemoBuilders />
          <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-5 text-slate-500">AI-generated content is a starting point, not a substitute for Scripture, pastoral judgment, or human review. Demo requests are limited to help protect availability.</p>
        </div>
      </section>
    </main>
  );
}
