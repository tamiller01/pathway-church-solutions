import Link from "next/link";

import { requestPasswordReset } from "@/app/actions/auth";
import { Card, PrimaryButton, TextInput } from "@/components";

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-warm-light px-6 py-12">
      <Card className="w-full max-w-md border border-neutral-gray-light bg-white p-8 shadow-medium">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">Account recovery</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">Reset your password</h1>
          <p className="mt-2 text-sm text-text-secondary">Enter your email and we will send a reset link.</p>
        </div>
        {params.error && <p className="mb-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">{params.error}</p>}
        {params.message && <p className="mb-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">{params.message}</p>}
        <form action={requestPasswordReset} className="space-y-5">
          <TextInput label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          <PrimaryButton type="submit" className="w-full md:min-w-0">Send reset link</PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link href="/login" className="font-medium text-brand-navy underline-offset-4 hover:underline">Back to login</Link>
        </p>
      </Card>
    </main>
  );
}