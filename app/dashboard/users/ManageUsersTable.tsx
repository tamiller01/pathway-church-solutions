"use client";

import { useEffect, useState, type FormEvent } from "react";

import { ALL_ROLES, ROLE_LABELS, canAssignRole, canModifyUserWithRole, type UserRole } from "@/lib/roles";

type ManagedUser = {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
};

export default function ManageUsersTable({
  actingRole,
  actingUserId
}: {
  actingRole: UserRole;
  actingUserId: string;
}) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("pastor");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateRole(id: string, role: UserRole) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    } finally {
      setSavingId(null);
    }
  }

  async function inviteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInviteMessage("");
    setInviteError("");
    const res = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole })
    });
    const data = await res.json();
    if (!res.ok) {
      setInviteError(data.error || "Could not send the invitation");
      return;
    }
    setInviteEmail("");
    setInviteMessage(`Invitation sent to ${data.email}.`);
  }

  if (loading) {
    return <p className="text-text-secondary">Loading users...</p>;
  }

  return (
    <div className="space-y-5">
      <form onSubmit={inviteUser} className="space-y-3 rounded-2xl border border-neutral-gray-light bg-white p-5 shadow-medium">
        <div>
          <h2 className="font-semibold text-brand-navy">Invite a team member</h2>
          <p className="mt-1 text-sm text-text-secondary">Invite someone into this organization with a ministry role.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-end">
          <label className="block text-sm font-medium text-brand-navy">
            Email
            <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} type="email" required className="mt-1 block h-11 w-full rounded border border-neutral-gray-light px-3" />
          </label>
          <label className="block text-sm font-medium text-brand-navy">
            Role
            <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value as UserRole)} className="mt-1 block h-11 w-full rounded border border-neutral-gray-light px-3">
              {ALL_ROLES.filter((role) => role !== "super_admin" && canAssignRole(actingRole, role)).map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
            </select>
          </label>
          <button type="submit" className="h-11 rounded bg-brand-gold px-4 text-sm font-semibold text-brand-navy">Send invite</button>
        </div>
        {inviteError && <p role="alert" className="text-sm text-error">{inviteError}</p>}
        {inviteMessage && <p className="text-sm text-success">{inviteMessage}</p>}
      </form>

      <div className="overflow-hidden rounded-2xl border border-neutral-gray-light bg-white shadow-medium">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-warm-light text-xs uppercase tracking-wide text-text-secondary">
          <tr>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSelf = u.id === actingUserId;
            const canEditThisUser = !isSelf && canModifyUserWithRole(actingRole, u.role);

            return (
              <tr key={u.id} className="border-t border-neutral-gray-light">
                <td className="px-6 py-3 text-brand-navy">
                  {u.email}
                  {isSelf && <span className="ml-2 text-xs text-text-secondary">(you)</span>}
                </td>
                <td className="px-6 py-3">
                  {canEditThisUser ? (
                    <select
                      className="rounded border p-1.5 text-sm"
                      value={u.role}
                      disabled={savingId === u.id}
                      onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                    >
                      {ALL_ROLES.filter((r) => canAssignRole(actingRole, r) || r === u.role).map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-brand-navy">{ROLE_LABELS[u.role]}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-text-secondary">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
