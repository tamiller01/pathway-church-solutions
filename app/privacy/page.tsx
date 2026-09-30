import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-warm-light px-6 py-12 text-brand-navy">
      <article className="mx-auto max-w-3xl space-y-8 rounded-xl border border-neutral-gray-light bg-white p-8 shadow-medium sm:p-12">
        <header className="space-y-3">
          <Link href="/" className="text-sm font-medium text-brand-slate-blue-700 hover:underline">Pathway Church Solutions</Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-text-secondary">Last updated: September 28, 2026</p>
        </header>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Information we collect</h2>
          <p>We collect account information such as your email address, authentication data, role, and the ministry plans you create or save. We also receive basic technical information needed to secure and operate the service.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How we use information</h2>
          <p>We use this information to authenticate users, enforce role-based access, store and display plans, support review workflows, improve the product, and communicate about the pilot.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Service providers</h2>
          <p>We use trusted infrastructure providers, including Supabase for authentication and data storage and OpenAI for requested AI generation. Information sent to those providers is used to provide the requested service and should be limited to what is appropriate for ministry planning.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your choices</h2>
          <p>You may request help accessing, correcting, or deleting your account information through the pilot contact channel. Do not include sensitive pastoral care or personal information in plans unless your church has determined that doing so is appropriate.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>Privacy questions should be directed to the Pathway Church Solutions team through the pilot contact channel.</p>
        </section>
        <p className="border-t border-neutral-gray-light pt-6 text-sm text-text-secondary">This pilot policy should receive final legal and data-protection review before a public commercial launch.</p>
      </article>
    </main>
  );
}