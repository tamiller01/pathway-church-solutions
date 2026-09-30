"use client";

import { createContext, useContext } from "react";

import { canCreateContent, canCreateDiscipleship, type UserRole } from "@/lib/roles";

const RoleAccessContext = createContext<{
  canCreate: boolean;
  canCreateDiscipleship: boolean;
  role: UserRole | null;
  userId: string | null;
}>({ canCreate: false, canCreateDiscipleship: false, role: null, userId: null });

export function RoleAccessProvider({
  role,
  userId,
  children
}: {
  role: UserRole;
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <RoleAccessContext.Provider value={{ canCreate: canCreateContent(role), canCreateDiscipleship: canCreateDiscipleship(role), role, userId }}>
      {children}
    </RoleAccessContext.Provider>
  );
}

export function useRoleAccess() {
  return useContext(RoleAccessContext);
}