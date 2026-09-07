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

const featureItems = [
  {
    icon: "✦",
    title: "Worship Planning",
    description: "Build flows, transitions, and service outlines in minutes with guided AI prompts.",
  },
  {
    icon: "✧",
    title: "Sermon Builder",
    description: "Shape biblical messages with clear structure, illustrations, and application points.",
  },
  {
    icon: "✷",
    title: "Discipleship Tools",
    description: "Create study pathways, group plans, and growth rhythms that keep people engaged.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-warm-light text-brand-navy">
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
            <Link href="#pricing">Pricing</Link>
            <Link href="#about">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            <SecondaryButton className="hidden px-6 sm:inline-flex">Early Access</SecondaryButton>
            <PrimaryButton className="px-6">Get Started</PrimaryButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <HeroSection
        eyebrow="AI-powered ministry assistant"
        title="AI-Powered Ministry Assistant for Pastors"
        subtitle="Plan worship. Build sermons. Lead with clarity."
        primaryAction={<PrimaryButton className="w-full sm:w-auto">Start free</PrimaryButton>}
        secondaryAction={<SecondaryButton className="w-full sm:w-auto">Book a demo</SecondaryButton>}
      />

      {/* INTRO */}
      <section className="bg-white px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-lg text-text-secondary">
            We help church leaders organize ministry, simplify planning, and stay focused on discipleship and pastoral care.
          </p>
        </div>
      </section>

      {/* WORSHIP SECTION */}
      <TwoColumnSection
        eyebrow="Worship planning"
        title="Create a complete worship plan in minutes"
        description="From scripture and service theme to song flow, transitions, and pastoral notes, every part of the service is organized in one place."
        media={
          <Card className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                    Service outline
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-brand-navy">Sunday Morning</h3>
                </div>
                <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                  Ready
                </span>
              </div>

              <div className="space-y-3 rounded-xl bg-neutral-warm-light p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Welcome</span>
                  <span className="font-semibold text-brand-navy">3 min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Call to worship</span>
                  <span className="font-semibold text-brand-navy">2 min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Song set</span>
                  <span className="font-semibold text-brand-navy">12 min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Scripture</span>
                  <span className="font-semibold text-brand-navy">5 min</span>
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
        description="Turn a passage, topic, and audience into a sermon outline with illustrations, key points, and application moments that are ready to refine."
        reverse
        media={
          <Card className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-neutral-warm-light p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                  Outline
                </p>
                <div className="mt-4 space-y-3 text-sm text-text-secondary">
                  <p>1. Opening tension</p>
                  <p>2. Exposition of the passage</p>
                  <p>3. Practical application</p>
                  <p>4. Closing invitation</p>
                </div>
              </div>
            </div>
          </Card>
        }
      >
        <div className="space-y-4 text-text-secondary">
          <p>• Audience-aware messaging</p>
          <p>• Narrative and expository options</p>
          <p>• Prayer and application guidance</p>
        </div>
      </TwoColumnSection>

      {/* DISCIPLESHIP SECTION */}
      <TwoColumnSection
        eyebrow="Discipleship tools"
        title="Build studies and growth pathways for your church"
        description="Create group studies, discipleship goals, and seasonal care plans that align with your ministry priorities and the life of your congregation."
        media={
          <Card className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
            <div className="space-y-4 p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-brand-gold/10 p-3">
                  <span className="font-medium text-brand-navy">Group Study</span>
                  <span className="text-xs uppercase text-brand-slate-blue-600">Active</span>
                </div>
                <div className="rounded-xl bg-neutral-warm-light p-3 text-sm text-text-secondary">
                  6-week journey on prayer, trust, and obedience
                </div>
              </div>
            </div>
          </Card>
        }
      >
        <div className="space-y-4 text-text-secondary">
          <p>• Small group curriculum planning</p>
          <p>• Prayer and discipleship pathways</p>
          <p>• Care and follow-up rhythms</p>
        </div>
      </TwoColumnSection>

      {/* FEATURES OVERVIEW */}

      {/* ⭐ MODULES SECTION — FULLY WORKING ⭐ */}
      <section id="modules" className="bg-white px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-brand-navy mb-12">
            Ministry Modules
          </h2>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {/* Worship */}
            <Link href="/worship">
              <Card className="p-6 rounded-2xl border border-neutral-gray-light bg-white shadow-medium hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-4">✦</div>
                <h3 className="text-xl font-bold text-brand-navy">Worship Planning</h3>
                <p className="text-text-secondary mt-2">
                  Build flows, transitions, and service outlines in minutes.
                </p>
              </Card>
            </Link>

            {/* Sermon */}
            <Link href="/sermon">
              <Card className="p-6 rounded-2xl border border-neutral-gray-light bg-white shadow-medium hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-4">✧</div>
                <h3 className="text-xl font-bold text-brand-navy">Sermon Builder</h3>
                <p className="text-text-secondary mt-2">
                  Shape biblical messages with structure and clarity.
                </p>
              </Card>
            </Link>

            {/* Discipleship */}
            <Link href="/discipleship">
              <Card className="p-6 rounded-2xl border border-neutral-gray-light bg-white shadow-medium hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-4">✷</div>
                <h3 className="text-xl font-bold text-brand-navy">Discipleship Tools</h3>
                <p className="text-text-secondary mt-2">
                  Create study pathways, group plans, and growth rhythms.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* LEADERSHIP GRID */}
      <FeatureGrid
        title="Built for leadership and ministry teams"
        description="A single system for planning, preparation, and discipleship across your church."
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
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
            Pastoral trust
          </p>
          <h2 className="mt-5 text-4xl font-bold text-brand-navy">
            Designed for churches that want structure without losing spiritual warmth.
          </h2>
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-brand-gold" />
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-white px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-text-secondary">
            Pathway Church Solutions helps churches lead with clarity, consistency, and care from planning through follow-up.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-brand-navy px-6 py-24 text-white sm:px-8 lg:px-12" id="pricing">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-brand-navy/80 p-10 text-center shadow-deep">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Early access
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white">Join the early access list</h2>
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
            <Link href="#about">About</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
