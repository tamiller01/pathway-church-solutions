import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-warm-light px-6 py-12 text-brand-navy">
      <article className="mx-auto max-w-3xl space-y-8 rounded-xl border border-neutral-gray-light bg-white p-8 shadow-medium sm:p-12">
        <header className="space-y-3">
          <Link href="/" className="text-sm font-medium text-brand-slate-blue-700 hover:underline">Pathway Church Solutions</Link>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-text-secondary">Last updated: September 28, 2026</p>
        </header>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Pilot service</h2>
          <p>Pathway Church Solutions provides planning and ministry support tools for churches. During the private pilot, the service is provided for evaluation and feedback and may change as we improve it.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your responsibility</h2>
          <p>You are responsible for reviewing, editing, and approving content before using it in ministry. AI-generated material is a starting point and does not replace pastoral judgment, Scripture, theological review, or local church leadership.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Acceptable use</h2>
          <p>Use the service lawfully and only for church ministry purposes. Do not upload private information that is unnecessary for planning, attempt to access another account, or use the service to create harmful, abusive, or unlawful content.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Pilot availability</h2>
          <p>The pilot is provided without a guarantee of uninterrupted availability. We may suspend access to protect the service, users, or church data.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>Questions about these terms should be directed to the Pathway Church Solutions team through the pilot contact channel.</p>
        </section>
        <p className="border-t border-neutral-gray-light pt-6 text-sm text-text-secondary">These pilot terms should receive final legal review before a public commercial launch.</p>
      </article>
    </main>
  );
}