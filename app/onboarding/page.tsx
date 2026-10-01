import { redirect } from "next/navigation";

import { completeOnboarding } from "@/app/actions/auth";
import { Card, PrimaryButton, TextInput } from "@/components";
import { getOrCreateProfile } from "@/lib/getProfile";
import { ROLE_LABELS } from "@/lib/roles";

export default async function OnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/login");
  if (profile.onboardingCompleted) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-warm-light px-6 py-12">
      <Card className="w-full max-w-2xl border border-neutral-gray-light bg-white p-8 shadow-medium sm:p-10">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">Welcome to Pathway</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">Let&apos;s set up your ministry workspace.</h1>
          <p className="mt-3 leading-7 text-text-secondary">We&apos;ll use this short setup to personalize your organization and take you to the first tool you want to explore.</p>
        </div>

        {params.error && <p role="alert" className="mt-6 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">{params.error}</p>}

        <form action={completeOnboarding} className="mt-8 space-y-7">
          <TextInput label="Church or ministry name" name="ministryName" required minLength={2} placeholder="e.g., Grace Community Church" autoComplete="organization" />

          <div>
            <p className="text-sm font-medium text-brand-navy">Your role</p>
            <div className="mt-2 rounded-lg border border-neutral-gray-light bg-neutral-warm-light px-4 py-3 text-sm text-text-secondary">
              {ROLE_LABELS[profile.role]}
              <span className="mt-1 block text-xs">Roles are managed by your organization Admin.</span>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-brand-navy">What would you like to do first?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["sermon", "Build a Sermon", "Shape a message from Scripture and ministry direction."],
                ["worship", "Plan Worship", "Create a service flow with transitions and notes."],
                ["discipleship", "Create a Discipleship Plan", "Build a multi-week pathway for your group."],
                ["dashboard", "Explore the Dashboard", "See your workspace before creating a plan."]
              ].map(([value, title, description]) => (
                <label key={value} className="cursor-pointer rounded-lg border border-neutral-gray-light p-4 transition has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold/10">
                  <input type="radio" name="firstAction" value={value} defaultChecked={value === "dashboard"} className="sr-only" />
                  <span className="block font-semibold text-brand-navy">{title}</span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">{description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-gray-light pt-6">
            <span className="text-sm text-text-secondary">You can update these details later.</span>
            <PrimaryButton type="submit" className="px-7">Continue</PrimaryButton>
          </div>
        </form>
      </Card>
    </main>
  );
}
