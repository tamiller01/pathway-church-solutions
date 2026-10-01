import Link from "next/link";

import { Card, PrimaryButton, SecondaryButton } from "@/components";

const guardrails = [
  {
    title: "Scripture stays central",
    description: "The tools are designed to support Scripture, not replace it with novelty, opinion, or supposed new revelation."
  },
  {
    title: "The church stays in charge",
    description: "AI does not replace pastors, leaders, prayer, theological judgment, or the life of the local church."
  },
  {
    title: "Doctrinal boundaries matter",
    description: "Generated drafts are screened against documented Christian, pastoral, and ethical guardrails."
  },
  {
    title: "People review the result",
    description: "Every draft can be reviewed, edited, returned, approved, and tailored before it is used."
  }
];

export default function WhyAiPage() {
  return (
    <main className="min-h-screen bg-neutral-warm-light text-brand-navy">
      <header className="border-b border-neutral-gray-light bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-sm font-bold">PC</span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">Pathway</span>
              <span className="block text-sm font-semibold">Church Solutions</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm font-medium text-brand-slate-blue-700 hover:underline sm:inline">Back to main page</Link>
            <Link href="/login"><SecondaryButton className="hidden px-5 sm:inline-flex">Log in</SecondaryButton></Link>
            <Link href="/signup"><PrimaryButton className="px-5">Get started</PrimaryButton></Link>
          </div>
        </div>
      </header>

      <section className="border-b border-neutral-gray-light bg-white px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">A thoughtful approach to AI</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
            AI can do the heavy lifting without taking the shepherd&apos;s place.
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-text-secondary">
            Used carelessly, AI can make ministry feel generic, rushed, or disconnected from the people a church serves. Used wisely, it can help leaders move from a blank page to a thoughtful first draft, leaving more time for prayer, people, and pastoral judgment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup"><PrimaryButton className="px-7">Try the ministry tools</PrimaryButton></Link>
            <a href="#guardrails"><SecondaryButton className="px-7">See the guardrails</SecondaryButton></a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">What AI is good at</p>
            <h2 className="mt-3 text-3xl font-bold">Starting the work is often the hardest part.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-text-secondary">
            <p>Pathway helps organize the first draft: a sermon structure, a worship flow, or a multi-week discipleship plan. It gathers the inputs you provide and turns them into a useful ministry document with clear sections and a practical shape.</p>
            <p>That draft is not the finished ministry moment. It is prepared work that a pastor or leader can question, reshape, shorten, expand, and make their own.</p>
          </div>
        </div>
      </section>

      <section className="scroll-mt-6 bg-brand-navy px-6 py-20 text-white sm:px-8 lg:px-12" id="guardrails">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Built for trust</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Comfort comes from knowing where the boundaries are.</h2>
            <p className="mt-4 text-lg leading-8 text-white/75">AI is not biblically accurate simply because a machine produced it. Pathway treats generated content as a draft that needs Scripture, pastoral wisdom, and human review.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {guardrails.map((guardrail) => (
              <Card key={guardrail.title} className="!border-white/10 !bg-white/10 p-6 !text-white shadow-none">
                <h3 className="text-lg font-semibold">{guardrail.title}</h3>
                <p className="mt-2 leading-7 text-white/70">{guardrail.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">From draft to ministry-ready</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">The editor does the heavy lifting. You bring the voice.</h2>
            <p className="mt-4 text-lg leading-8 text-text-secondary">Generated content opens as a structured, visual document rather than a wall of raw code. Pastors and leaders can edit headings, paragraphs, emphasis, lists, and content directly in a powerful editor, then review the document before sharing or using it.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Generate a starting point", "Provide the passage, theme, audience, group, or service details that shape the work."],
              ["2", "Review what was created", "Use the document structure and validation tools to notice what needs attention."],
              ["3", "Make it yours", "Edit the language, emphasis, examples, application, and plan details for your people."],
            ].map(([number, title, description]) => (
              <Card key={number} className="border border-neutral-gray-light bg-white p-6 shadow-medium">
                <span className="text-3xl font-bold text-brand-gold">{number}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-text-secondary">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-warm-medium px-6 py-20 text-center sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">A tool for faithful preparation, not a substitute for faithful leadership.</h2>
          <p className="mt-4 text-lg leading-8 text-text-secondary">Start with a draft. Keep Scripture and people at the center. Let your church leaders make the final message their own.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/how-it-works"><SecondaryButton className="px-8">See how it works</SecondaryButton></Link><Link href="/signup"><PrimaryButton className="px-8">Get started</PrimaryButton></Link></div>
        </div>
      </section>

      <footer className="bg-brand-navy px-6 py-8 text-center text-sm text-white/70 sm:px-8 lg:px-12">
        <Link href="/" className="font-semibold text-white hover:text-brand-gold">Pathway Church Solutions</Link>
        <span className="mx-3">•</span>
        <Link href="/terms" className="hover:text-white">Terms</Link>
        <span className="mx-3">•</span>
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
      </footer>
    </main>
  );
}