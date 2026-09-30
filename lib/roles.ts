// System roles per docs/PathwaySolutions Vision "User Roles" section.
export type UserRole = "pastor" | "discipleship_leader" | "reviewer" | "admin" | "super_admin";
export type ReviewStatus = "draft" | "in_review" | "changes_requested" | "approved" | "flagged" | "published";
export type RiskLevel = "normal" | "high";

export const ALL_ROLES: UserRole[] = ["pastor", "discipleship_leader", "reviewer", "admin", "super_admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  pastor: "Pastor",
  discipleship_leader: "Discipleship Leader",
  reviewer: "Reviewer",
  admin: "Admin",
  super_admin: "Super Admin"
};

const MODULE_ACCESS_ROLES: UserRole[] = ["pastor", "discipleship_leader", "reviewer", "admin", "super_admin"];

export function canAccessModules(role: string | null | undefined): boolean {
  return MODULE_ACCESS_ROLES.includes(role as UserRole);
}

export function canCreateContent(role: string | null | undefined): boolean {
  return role === "pastor" || role === "discipleship_leader" || role === "admin" || role === "super_admin";
}

export function canCreateDiscipleship(role: string | null | undefined): boolean {
  return role === "pastor" || role === "discipleship_leader" || role === "admin" || role === "super_admin";
}

export function canEditPlan(role: UserRole, status: ReviewStatus, isOwner: boolean): boolean {
  if (role === "pastor" || role === "discipleship_leader") return isOwner && (status === "draft" || status === "changes_requested");
  if (role === "reviewer") return status === "in_review";
  return role === "admin" || role === "super_admin" ? status !== "published" : false;
}

export function canApprovePlan(role: UserRole, riskLevel: RiskLevel, isOwner = false): boolean {
  if (isOwner && (role === "pastor" || role === "discipleship_leader" || role === "admin")) return true;
  if (role === "reviewer") return riskLevel === "normal";
  return role === "admin" || role === "super_admin";
}

export function canPublishPlan(role: UserRole, status: ReviewStatus): boolean {
  if (role === "super_admin") return true;
  return (role === "pastor" || role === "discipleship_leader" || role === "admin") && status === "approved";
}

// Per vision doc: Admin can "Manage users / Manage roles"; Super Admin has full access.
export function canManageUsers(role: string | null | undefined): boolean {
  return role === "admin" || role === "super_admin";
}

export function canReviewContent(role: string | null | undefined): boolean {
  return role === "reviewer" || role === "admin" || role === "super_admin";
}

// Only a Super Admin may grant or modify a Super Admin — prevents an Admin from
// self-escalating or handing out the top-level role.
export function canAssignRole(actingRole: UserRole, targetRole: UserRole): boolean {
  if (!canManageUsers(actingRole)) return false;
  if (targetRole === "super_admin") return actingRole === "super_admin";
  return true;
}

export function canModifyUserWithRole(actingRole: UserRole, targetCurrentRole: UserRole): boolean {
  if (!canManageUsers(actingRole)) return false;
  if (targetCurrentRole === "super_admin") return actingRole === "super_admin";
  return true;
}

