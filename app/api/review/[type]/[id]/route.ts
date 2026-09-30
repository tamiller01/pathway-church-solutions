import { NextResponse } from "next/server";

import { requireModuleAccess } from "@/lib/requireApiAuth";
import { canApprovePlan, canCreateContent, canCreateDiscipleship, canEditPlan, canPublishPlan, type ReviewStatus, type RiskLevel, type UserRole } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

const resources = {
  sermons: { table: "sermons", contentField: "sermon_html" },
  "worship-plans": { table: "worship_plans", contentField: "plan_html" },
  "discipleship-plans": { table: "plans", contentField: "plan_html" }
} as const;

type ResourceType = keyof typeof resources;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;

  const { type, id } = await params;
  if (!(type in resources)) {
    return NextResponse.json({ error: "Unknown plan type" }, { status: 404 });
  }

  const resourceType = type as ResourceType;
  const resource = resources[resourceType];
  const { data: plan } = await supabaseAdmin
    .from(resource.table)
    .select("id, user_id, assigned_reviewer_id, reviewer_opened_at")
    .eq("id", id)
    .eq("organization_id", profile.organizationId)
    .single();

  if (!plan || ((profile.role === "pastor" || profile.role === "discipleship_leader") && plan.user_id !== profile.user.id)) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const { data: events, error } = await supabaseAdmin
    .from("plan_review_events")
    .select("id, actor_id, action, from_status, to_status, risk_level, note, created_at")
    .eq("plan_type", resourceType)
    .eq("plan_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load review history" }, { status: 500 });
  }

  const actorIds = [...new Set([
    ...(events || []).map((event) => event.actor_id),
    ...(plan.assigned_reviewer_id ? [plan.assigned_reviewer_id] : [])
  ])];
  const { data: profiles } = actorIds.length
    ? await supabaseAdmin.from("profiles").select("id, email").in("id", actorIds)
    : { data: [] };
  const emailById = new Map((profiles || []).map((item) => [item.id, item.email]));

  return NextResponse.json({
    reviewer: plan.assigned_reviewer_id
      ? {
          id: plan.assigned_reviewer_id,
          email: emailById.get(plan.assigned_reviewer_id) || "Reviewer account unavailable",
          openedAt: plan.reviewer_opened_at
        }
      : null,
    events: (events || []).map((event) => ({ ...event, actor_email: emailById.get(event.actor_id) || "Team member" }))
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;

  const { type, id } = await params;
  if (!(type in resources)) {
    return NextResponse.json({ error: "Unknown plan type" }, { status: 404 });
  }

  const resourceType = type as ResourceType;
  const resource = resources[resourceType];
  const { data: record, error: loadError } = await supabaseAdmin
    .from(resource.table)
    .select("*")
    .eq("id", id)
    .eq("organization_id", profile.organizationId)
    .single();

  if (loadError || !record) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const isOwner = record.user_id === profile.user.id;
  if ((profile.role === "pastor" || profile.role === "discipleship_leader") && !isOwner) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const body = await req.json();
  const action = body.action as string;
  const status = record.review_status as ReviewStatus;
  const riskLevel = record.risk_level as RiskLevel;
  const role = profile.role as UserRole;
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const updates: Record<string, unknown> = {};
  const now = new Date().toISOString();
  let auditNote = note;

  if (action === "open") {
    if (role !== "reviewer" || !["in_review", "flagged"].includes(status)) {
      return NextResponse.json({ error: "Only Reviewers can claim plans awaiting review" }, { status: 403 });
    }
    if (record.assigned_reviewer_id && record.assigned_reviewer_id !== profile.user.id) {
      return NextResponse.json({ error: "This plan is already assigned to another Reviewer" }, { status: 409 });
    }
    if (record.assigned_reviewer_id === profile.user.id) {
      return NextResponse.json({ plan: record, alreadyOpened: true });
    }

    const { data: claimedPlan, error: claimError } = await supabaseAdmin
      .from(resource.table)
      .update({ assigned_reviewer_id: profile.user.id, reviewer_opened_at: now })
      .eq("id", id)
      .eq("organization_id", profile.organizationId)
      .is("assigned_reviewer_id", null)
      .select("*")
      .maybeSingle();

    if (claimError) {
      console.error(claimError);
      return NextResponse.json({ error: "Could not claim this plan for review" }, { status: 500 });
    }
    if (!claimedPlan) {
      return NextResponse.json({ error: "Another Reviewer opened this plan first" }, { status: 409 });
    }

    const { error: openAuditError } = await supabaseAdmin.from("plan_review_events").insert({
      plan_type: resourceType,
      plan_id: id,
      actor_id: profile.user.id,
      action: "opened",
      from_status: status,
      to_status: status,
      risk_level: claimedPlan.risk_level,
      note: null
    });

    return NextResponse.json({
      plan: claimedPlan,
      auditWarning: openAuditError ? "Reviewer assignment was saved, but its activity event could not be recorded." : undefined
    });
  } else if (action === "request_review") {
    const canCreateThisPlan = resourceType === "discipleship-plans" ? canCreateDiscipleship(role) : canCreateContent(role);
    if (!isOwner || !canCreateThisPlan || !["draft", "changes_requested"].includes(status)) {
      return NextResponse.json({ error: "This plan cannot be submitted for review" }, { status: 403 });
    }
    updates.review_status = "in_review";
    updates.submitted_at = now;
    const savedValidationNote = typeof record.review_note === "string"
      && record.review_note.startsWith("Pathway Validation (")
      && riskLevel === "high"
      ? record.review_note
      : null;
    updates.review_note = savedValidationNote;
    auditNote = savedValidationNote || note;
    updates.reviewed_by = null;
    updates.reviewed_at = null;
    updates.assigned_reviewer_id = null;
    updates.reviewer_opened_at = null;
  } else if (action === "edit") {
    if (!canEditPlan(role, status, isOwner)) {
      return NextResponse.json({ error: "Your role cannot edit this plan" }, { status: 403 });
    }
    if (role === "reviewer" && record.assigned_reviewer_id !== profile.user.id) {
      return NextResponse.json({ error: "This plan is assigned to another Reviewer" }, { status: 403 });
    }
    const content = body.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Plan content must be text" }, { status: 400 });
    }
    updates[resource.contentField] = content;
    if (typeof body.title === "string") updates.title = body.title.trim().slice(0, 200);
    if (["question", "fail"].includes(body.validationStatus)) {
      updates.risk_level = "high";
      const summary = typeof body.validationSummary === "string"
        ? body.validationSummary.slice(0, 2000)
        : "Pathway Validation needs further review.";
      updates.review_note = `Pathway Validation (${body.validationStatus}): ${summary}`;
      auditNote = updates.review_note as string;
    }
  } else if (action === "approve") {
    if (!["in_review", "flagged"].includes(status) || !canApprovePlan(role, riskLevel, isOwner)) {
      return NextResponse.json({ error: "Your role cannot approve this plan at its current risk level" }, { status: 403 });
    }
    if (role === "reviewer" && record.assigned_reviewer_id !== profile.user.id) {
      return NextResponse.json({ error: "This plan is assigned to another Reviewer" }, { status: 403 });
    }
    updates.review_status = "approved";
    updates.reviewed_by = profile.user.id;
    updates.reviewed_at = now;
    updates.review_note = note || null;
  } else if (action === "flag") {
    if (role !== "reviewer" || status !== "in_review" || !note) {
      return NextResponse.json({ error: "Reviewers must provide a note to flag a plan" }, { status: 400 });
    }
    if (record.assigned_reviewer_id !== profile.user.id) {
      return NextResponse.json({ error: "Open this plan to claim it before flagging it" }, { status: 403 });
    }
    updates.review_status = "flagged";
    updates.risk_level = "high";
    updates.review_note = note;
    updates.reviewed_by = profile.user.id;
    updates.reviewed_at = now;
  } else if (action === "return") {
    if (!["reviewer", "admin", "super_admin"].includes(role) || !["in_review", "flagged"].includes(status) || !note) {
      return NextResponse.json({ error: "A reviewer note is required to return this plan" }, { status: 400 });
    }
    if (role === "reviewer" && record.assigned_reviewer_id !== profile.user.id) {
      return NextResponse.json({ error: "This plan is assigned to another Reviewer" }, { status: 403 });
    }
    updates.review_status = "changes_requested";
    updates.review_note = note;
    updates.reviewed_by = profile.user.id;
    updates.reviewed_at = now;
  } else if (action === "publish") {
    if (!canPublishPlan(role, status) || (role === "super_admin" && status !== "approved")) {
      return NextResponse.json({ error: "Only approved plans can be published" }, { status: 403 });
    }
    updates.review_status = "published";
    updates.published_by = profile.user.id;
    updates.published_at = now;
  } else if (action === "override_publish") {
    if (role !== "super_admin" || status === "published" || !note) {
      return NextResponse.json({ error: "Super Admin override requires a reason" }, { status: 403 });
    }
    updates.review_status = "published";
    updates.published_by = profile.user.id;
    updates.published_at = now;
    updates.review_note = note;
  } else {
    return NextResponse.json({ error: "Unknown workflow action" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from(resource.table)
    .update(updates)
    .eq("id", id)
    .eq("organization_id", profile.organizationId)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update plan workflow" }, { status: 500 });
  }

  const { error: auditError } = await supabaseAdmin.from("plan_review_events").insert({
    plan_type: resourceType,
    plan_id: id,
    actor_id: profile.user.id,
    action,
    from_status: status,
    to_status: data.review_status,
    risk_level: data.risk_level,
    note: auditNote || null
  });

  if (auditError) {
    console.error("Plan changed but review event could not be recorded:", auditError);
    return NextResponse.json({
      plan: data,
      auditWarning: "The plan was updated, but the audit event could not be recorded. Contact an administrator."
    });
  }

  return NextResponse.json({ plan: data });
}
