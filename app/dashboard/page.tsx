import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server-auth";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Protected route</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-200">
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="mt-2 text-lg font-medium text-white">{user.email}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Home
          </Link>

          <form action={logout} className="flex-1">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
