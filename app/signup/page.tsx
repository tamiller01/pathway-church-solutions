import Link from "next/link";

import { signup } from "@/app/actions/auth";
import { Card, PrimaryButton, TextInput } from "@/components";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-warm-light px-6 py-12">
      <Card className="w-full max-w-md border border-neutral-gray-light bg-white p-8 shadow-medium">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
            Create account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">Sign up</h1>
        </div>

        {error ? (
          <p className="mb-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        ) : null}

        <form action={signup} className="space-y-5">
          <TextInput
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
          />

          <PrimaryButton type="submit" className="w-full md:min-w-0">
            Create account
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account? {" "}
          <Link
            href="/login"
            className="font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
