import Link from "next/link";

import {
  Card,
  FeatureGrid,
  HeroSection,
  PrimaryButton,
  SecondaryButton,
  TextInput,
  TwoColumnSection,
} from "@/components";
import { getOrCreateProfile } from "@/lib/getProfile";

function BackToTop() {
  return (
    <Link href="#top" className="shrink-0 whitespace-nowrap text-sm font-medium text-brand-slate-blue-600 hover:text-brand-navy">
      Back to top ↑
    </Link>
  );
}

export default async function Home() {
  const profile = await getOrCreateProfile();

  return (
    <main id="top" className="min-h-screen bg-neutral-warm-light text-brand-navy">
      {/* HEADER */}
      <header className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-navy">
              PC
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                Pathway
              </p>
              <p className="text-sm font-semibold text-brand-navy">Church Solutions</p>
            </div>
          </div>

          <nav className="hidden items-center gap-10 text-base font-medium text-brand-navy md:flex">
            <Link href="#features">Features</Link>
            <Link href="#modules">Modules</Link>
            <Link href="/why-ai">Why AI?</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#about">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            {profile ? (
              <Link href="/dashboard">
                <PrimaryButton className="px-6">Go to Dashboard</PrimaryButton>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <SecondaryButton className="hidden px-6 sm:inline-flex">Log In</SecondaryButton>
                </Link>
                <Link href="/signup">
                  <PrimaryButton className="px-6">Get Started</PrimaryButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <HeroSection
        eyebrow="AI-powered ministry assistant"
        title="AI-Powered Ministry Assistant for Pastors and Church Leaders"
        subtitle="Plan Worship. Build Sermons. Equip the Church. Lead with Clarity."
        primaryAction={<Link href="/signup"><PrimaryButton className="w-full sm:w-auto">Start free</PrimaryButton></Link>}
        secondaryAction={<Link href="/how-it-works"><SecondaryButton className="w-full sm:w-auto">See how it works</SecondaryButton></Link>}
      />

      {/* INTRO */}
      <section className="bg-white px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-lg text-text-secondary">
            We help church leaders organize ministry, simplify planning, and stay focused on discipleship and pastoral care.
          </p>
          <div className="mt-4">
            <BackToTop />
          </div>
        </div>
      </section>

      {/* WORSHIP SECTION */}
      <TwoColumnSection
        id="features"
        eyebrow="Worship planning"
        title="Create a complete worship plan in minutes"
        headerAction={<BackToTop />}
        description="Start with a service theme, Scripture, style, and notes. The generator returns an editable service document with a structured flow, transitions, and assignment fields."
        media={
          <Card className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                    Generated service document
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-brand-navy">Hope in Christ</h3>
                </div>
                <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                  Editable
                </span>
              </div>

              <div className="space-y-3 rounded-xl bg-neutral-warm-light p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Welcome</span>
                  <span className="font-semibold text-brand-navy">Opening greeting</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Call to worship</span>
                  <span className="font-semibold text-brand-navy">Congregational focus</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Song set</span>
                  <span className="font-semibold text-brand-navy">Suggested sequence</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Scripture and prayer</span>
                  <span className="font-semibold text-brand-navy">Passage and prayer focus</span>
                </div>
              </div>
            </div>
          </Card>
        }
      >
        <div className="flex flex-wrap gap-3">
          {["Service theme", "Scripture passage", "Worship style", "Song preferences"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-brand-slate-blue-200 bg-brand-slate-blue-50 px-3 py-1.5 text-sm font-medium text-brand-slate-blue-700"
            >
              {item}
            </span>
          ))}
        </div>
      </TwoColumnSection>

      {/* SERMON SECTION */}
      <TwoColumnSection
        eyebrow="Sermon builder"
        title="Draft biblically grounded messages with structure and flow"
        headerAction={<BackToTop />}
        description="Turn a passage, topic, audience, and tone into an editable HTML sermon document with an overview, exposition, main points, supporting Scriptures, and commentary."
        reverse
        media={
          <Card className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-neutral-warm-light p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                  Sermon document
                </p>
                <div className="mt-4 space-y-3 text-sm text-text-secondary">
                  <p><strong>Passage:</strong> Romans 15:13</p>
                  <p><strong>Topic:</strong> Hope in Christ</p>
                  <hr />
                  <p className="font-semibold text-brand-navy">Introduction</p>
                  <p className="font-semibold text-brand-navy">Scripture Exposition</p>
                  <p className="font-semibold text-brand-navy">Main Points</p>
                  <p className="font-semibold text-brand-navy">Supporting Scriptures & Commentary</p>
                </div>
              </div>
            </div>
          </Card>
        }
      >
        <div className="space-y-4 text-text-secondary">
          <p>• Sermon overview with passage, topic, audience, and tone</p>
          <p>• Introduction, exposition, and main points</p>
          <p>• Supporting Scriptures and commentary</p>
        </div>
      </TwoColumnSection>

      {/* DISCIPLESHIP SECTION */}
      <TwoColumnSection
        eyebrow="Discipleship tools"
        title="Build studies and growth pathways for your church"
        headerAction={<BackToTop />}
        description="Enter a group, audience, goals, Scripture, and pathway step. The generator returns a multi-week HTML study document with weekly themes, Scripture, practices, questions, challenges, and prayer focus."
        media={
          <Card className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
            <div className="space-y-4 p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-brand-gold/10 p-3">
                  <span className="font-medium text-brand-navy">Group Overview</span>
                  <span className="text-xs uppercase text-brand-slate-blue-600">6 weeks</span>
                </div>
                <div className="rounded-xl bg-neutral-warm-light p-3 text-sm text-text-secondary">
                  <p><strong>Input Summary:</strong> prayer, trust, and obedience</p>
                  <p className="mt-2 font-semibold text-brand-navy">Weekly Breakdown</p>
                  <p className="mt-1">Theme · Scripture · Practice · Questions · Prayer Focus</p>
                </div>
              </div>
            </div>
          </Card>
        }
      >
        <div className="space-y-4 text-text-secondary">
          <p>• Group overview and input summary</p>
          <p>• Multi-week themes and primary Scripture</p>
          <p>• Practices, discussion questions, challenges, and prayer focus</p>
        </div>
      </TwoColumnSection>

      {/* FEATURES OVERVIEW */}

      {/* MODULES SECTION — preview only; actual access is role-gated behind login (see /dashboard) */}
      <section id="modules" className="bg-white px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">
              Ministry Modules
            </h2>
            <BackToTop />
          </div>
          <p className="text-center text-text-secondary mb-12">
            Sign in to access the modules based on your ministry role.
          </p>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {/* Worship */}
            <Card className="p-6 rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="text-xl font-bold text-brand-navy">Worship Planning</h3>
              <p className="text-text-secondary mt-2">
                Build flows, transitions, and service outlines in minutes.
              </p>
            </Card>

            {/* Sermon */}
            <Card className="p-6 rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
              <div className="text-4xl mb-4">✧</div>
              <h3 className="text-xl font-bold text-brand-navy">Sermon Builder</h3>
              <p className="text-text-secondary mt-2">
                Shape biblical messages with structure and clarity.
              </p>
            </Card>

            {/* Discipleship */}
            <Card className="p-6 rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
              <div className="text-4xl mb-4">✷</div>
              <h3 className="text-xl font-bold text-brand-navy">Discipleship Tools</h3>
              <p className="text-text-secondary mt-2">
                Create study pathways, group plans, and growth rhythms.
              </p>
            </Card>
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/login">
              <PrimaryButton className="px-8">Sign in to get started</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* LEADERSHIP GRID */}
      <FeatureGrid
        title="Built for leadership and ministry teams"
        description="A single system for planning, preparation, and discipleship across your church."
        headerAction={<BackToTop />}
        items={[
          {
            icon: "⚑",
            title: "Pastoral clarity",
            description: "Keep sermons, worship plans, and communication aligned around your values and vision.",
          },
          {
            icon: "◌",
            title: "Time savings",
            description: "Reduce planning friction and spend more time with people instead of paperwork and meetings.",
          },
          {
            icon: "✓",
            title: "Team alignment",
            description: "Share plans, workflows, and ministry rhythms with leaders and volunteers in one place.",
          },
        ]}
        className="bg-neutral-warm-light"
      />

      {/* ABOUT */}
      <section className="bg-neutral-warm-medium px-6 py-20 sm:px-8 lg:px-12" id="about">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                About Pathway
              </p>
              <h2 className="mt-5 text-4xl font-bold text-brand-navy sm:text-5xl">
                Less time wrestling with a blank page. More time caring for people.
              </h2>
            </div>
            <BackToTop />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-5 text-lg leading-8 text-text-secondary">
              <p>
                Pathway Church Solutions is a ministry planning workspace for pastors and church leaders. It brings sermon preparation, worship planning, discipleship pathways, review, and Sunday scheduling into one calm place.
              </p>
              <p>
                Churches should not have to choose between thoughtful ministry and practical structure. Pathway helps organize the work that surrounds ministry so leaders can spend more attention on prayer, Scripture, people, and the particular needs of their congregation.
              </p>
              <p>
                The system creates a strong first draft, but the church leader remains the author and decision-maker. Every message, service plan, and discipleship resource can be reviewed and shaped before it is used.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-slate-blue-200 bg-white p-7 shadow-medium">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">What guides us</p>
              <ul className="mt-5 space-y-4 text-brand-navy">
                <li className="border-b border-neutral-gray-light pb-4"><strong>People over production.</strong><span className="mt-1 block text-sm leading-6 text-text-secondary">Tools should reduce pressure, not create more of it.</span></li>
                <li className="border-b border-neutral-gray-light pb-4"><strong>Scripture and pastoral wisdom.</strong><span className="mt-1 block text-sm leading-6 text-text-secondary">AI assists preparation; it does not replace the church or its leaders.</span></li>
                <li><strong>Clarity with room for care.</strong><span className="mt-1 block text-sm leading-6 text-text-secondary">Structure gives leaders more freedom to tailor the work for real people.</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-brand-slate-blue-200 pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">One connected workflow</p>
            <div className="mt-6 grid gap-6 md:grid-cols-4">
              {[
                ["Prepare", "Start with the Scripture, theme, audience, or ministry goal in front of you."],
                ["Shape", "Turn the first draft into a clear document with your own voice and priorities."],
                ["Review", "Use human review and documented guardrails to catch what needs attention."],
                ["Serve", "Bring a prepared, editable plan into the life of your local church."],
              ].map(([title, description]) => (
                <div key={title}>
                  <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-white px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-text-secondary">
            Pathway Church Solutions helps churches lead with clarity, consistency, and care from planning through follow-up.
          </p>
          <div className="mt-4">
            <BackToTop />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-brand-navy px-6 py-24 text-white sm:px-8 lg:px-12" id="pricing">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-brand-navy/80 p-10 text-center shadow-deep">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Early access
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white">Join the early access list</h2>
          <div className="mt-4">
            <Link href="#top" className="text-sm font-medium text-white/80 hover:text-white">
              Back to top ↑
            </Link>
          </div>
          <p className="mt-4 text-xl text-white/80">
            Be first to explore the system built for modern ministry leadership.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-center">
            <div className="w-full max-w-md">
              <TextInput
                type="email"
                placeholder="Email address"
                className="border-white/20 bg-white text-brand-navy placeholder:text-neutral-gray-light"
              />
            </div>
            <PrimaryButton className="w-full sm:w-auto">Get updates</PrimaryButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-navy px-6 py-8 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">Pathway Church Solutions</p>
            <p>Serving churches with excellence and faithfulness</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features">Features</Link>
            <Link href="#modules">Modules</Link>
            <Link href="/why-ai">Why AI?</Link>
            <Link href="#about">About</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <Link href="/demo" className="text-xs text-white/50 transition hover:text-white/80">Try the tools</Link>
        </div>
      </footer>
    </main>
  );
}
