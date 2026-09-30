import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { getOrCreateProfile } from "@/lib/getProfile";
import { canAccessModules, canManageUsers, canReviewContent, ROLE_LABELS } from "@/lib/roles";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sermons", label: "Sermons" },
  { href: "/worship-plans", label: "Worship Plans" },
  { href: "/worship-plans/schedule", label: "Sunday Schedule" },
  { href: "/discipleship-plans", label: "Discipleship Plans" }
];

// Shared header for every authenticated page — always provides a way back to the
// public homepage plus a persistent nav to every tool, user management, and logout.
export default async function AppHeader() {
  const profile = await getOrCreateProfile();
  const showToolNav = profile && canAccessModules(profile.role);

  return (
    <header className="border-b border-neutral-gray-light bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-navy">
            PC
          </div>
          <span className="text-sm font-semibold text-brand-navy">Pathway Church Solutions</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {profile ? (
            <>
              <span className="hidden text-text-secondary sm:inline">
                {profile.user.email} · {ROLE_LABELS[profile.role]}
              </span>
              {canManageUsers(profile.role) && (
                <Link
                  href="/dashboard/users"
                  className="rounded-lg border border-neutral-gray-light px-3 py-1.5 font-medium text-brand-navy transition hover:bg-neutral-warm-light"
                >
                  Manage Users
                </Link>
              )}
              {canReviewContent(profile.role) && (
                <Link
                  href="/review"
                  className="rounded-lg border border-neutral-gray-light px-3 py-1.5 font-medium text-brand-navy transition hover:bg-neutral-warm-light"
                >
                  Review Queue
                </Link>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-neutral-gray-light px-3 py-1.5 font-medium text-brand-navy transition hover:bg-neutral-warm-light"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-brand-gold px-3 py-1.5 font-semibold text-brand-navy transition hover:brightness-95"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {showToolNav && (
        <nav aria-label="Main app navigation" className="overflow-x-auto border-t border-neutral-gray-light bg-neutral-warm-light">
          <div className="mx-auto flex max-w-5xl min-w-max gap-2 px-4 text-sm font-medium text-brand-navy sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-2 py-3 transition hover:border-brand-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
