import Link from "next/link";

import { updatePassword } from "@/app/actions/auth";
import { Card, PrimaryButton, TextInput } from "@/components";

export default async function UpdatePasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-warm-light px-6 py-12">
      <Card className="w-full max-w-md border border-neutral-gray-light bg-white p-8 shadow-medium">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">Account recovery</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">Choose a new password</h1>
        </div>
        {params.error && <p className="mb-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">{params.error}</p>}
        <form action={updatePassword} className="space-y-5">
          <TextInput label="New password" name="password" type="password" required minLength={6} autoComplete="new-password" />
          <TextInput label="Confirm new password" name="confirmation" type="password" required minLength={6} autoComplete="new-password" />
          <PrimaryButton type="submit" className="w-full md:min-w-0">Update password</PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link href="/login" className="font-medium text-brand-navy underline-offset-4 hover:underline">Back to login</Link>
        </p>
      </Card>
    </main>
  );
}