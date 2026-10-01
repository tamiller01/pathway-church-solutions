import Link from "next/link";

import { PrimaryButton, SecondaryButton } from "@/components";
import HowItWorksTour from "./HowItWorksTour";

export default function HowItWorksPage() {
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
            <Link href="/signup"><PrimaryButton className="px-5">Get started</PrimaryButton></Link>
          </div>
        </div>
      </header>

      <section className="px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">See how it works</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">One connected workspace for ministry preparation.</h1>
            <p className="mt-5 text-lg leading-8 text-text-secondary">Take a guided look at how Pathway moves from your ministry inputs to an editable, reviewable plan your church leaders can make their own.</p>
          </div>
          <HowItWorksTour />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/signup"><PrimaryButton className="px-7">Start free</PrimaryButton></Link>
            <Link href="/why-ai"><SecondaryButton className="px-7">Why AI?</SecondaryButton></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
