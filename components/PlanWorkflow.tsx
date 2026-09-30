"use client";

import { useEffect, useState } from "react";

import { useRoleAccess } from "@/components/RoleAccessProvider";
import RichTextEditor from "@/components/RichTextEditor";
import { canApprovePlan, canCreateContent, canCreateDiscipleship, canEditPlan, canPublishPlan, ROLE_LABELS, type ReviewStatus, type RiskLevel } from "@/lib/roles";

type PlanType = "sermons" | "worship-plans" | "discipleship-plans";
type WorkflowPlan = {
  id: string;
  user_id: string | null;
  review_status: ReviewStatus;
  risk_level: RiskLevel;
  review_note: string | null;
  title: string;
  content: string;
};
type ReviewEvent = {
  id: string;
  actor_email: string;
  action: string;
  from_status: string;
  to_status: string;
  risk_level: RiskLevel;
  note: string | null;
  created_at: string;
};
type ReviewAssignment = {
  id: string;
  email: string;
  openedAt: string | null;
};
type ValidationResult = {
  status: "pass" | "question" | "fail";
  summary: string;
  findings: Array<{
    status: "question" | "fail";
    statement: string;
    issue: string;
    why: string;
    alternatives: string[];
  }>;
};

function htmlToPlainText(html: string) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  return parsed.body.innerText;
}

const STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
  flagged: "High risk flagged",
  published: "Published"
};

export default function PlanWorkflow({ type, plan }: { type: PlanType; plan: WorkflowPlan }) {
  const { role, userId } = useRoleAccess();
  const [content, setContent] = useState(plan.content);
  const [title, setTitle] = useState(plan.title || "");
  const [viewMode, setViewMode] = useState<"review" | "edit">("review");
  const [printContent, setPrintContent] = useState(plan.content);
  const [printRequested, setPrintRequested] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [events, setEvents] = useState<ReviewEvent[]>([]);
  const [reviewer, setReviewer] = useState<ReviewAssignment | null>(null);
  const [assignmentError, setAssignmentError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (role === "reviewer" && ["in_review", "flagged"].includes(plan.review_status)) {
        const openResponse = await fetch(`/api/review/${type}/${plan.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "open" })
        });
        if (!openResponse.ok && openResponse.status !== 409) {
          const openResult = await openResponse.json();
          setAssignmentError(openResult.error || "Could not claim this plan for review.");
        }
      }

      const response = await fetch(`/api/review/${type}/${plan.id}`);
      if (!response.ok) return;
      const result = await response.json();
      setEvents(result.events || []);
      setReviewer(result.reviewer || null);
    }
    void loadHistory();
  }, [role, type, plan.id, plan.review_status]);

  useEffect(() => {
    if (!printRequested) return;
    const frame = requestAnimationFrame(() => {
      window.print();
      setPrintRequested(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [printRequested, printContent]);

  if (!role || !userId) return null;

  const isOwner = userId === plan.user_id;
  const canEdit = canEditPlan(role, plan.review_status, isOwner)
    && (role !== "reviewer" || reviewer?.id === userId);
  const canReview = (["reviewer", "admin", "super_admin"].includes(role)
    || (isOwner && ["pastor", "discipleship_leader"].includes(role)))
    && ["in_review", "flagged"].includes(plan.review_status)
    && (role !== "reviewer" || reviewer?.id === userId);
  const isDiscipleshipPlan = type === "discipleship-plans";
  const canCreateThisPlan = isDiscipleshipPlan ? canCreateDiscipleship(role) : canCreateContent(role);
  const canPublish = plan.review_status === "approved"
    && canPublishPlan(role, plan.review_status)
    && (role !== "pastor" && role !== "discipleship_leader" || isOwner);
  const canRequestReview = isOwner && canCreateThisPlan
    && ["draft", "changes_requested"].includes(plan.review_status);

  async function runAction(action: string, extra: Record<string, unknown> = {}) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/review/${type}/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note, ...extra })
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not update this plan.");
        return;
      }
      if (result.auditWarning) window.alert(result.auditWarning);
      window.location.reload();
    } catch {
      setError("Could not reach the review service.");
    } finally {
      setSaving(false);
    }
  }

  function saveEdits() {
    const needsHighRiskReview = validationResult && validationResult.status !== "pass";
    const validationSummary = needsHighRiskReview
      ? validationResult.findings
          .map((finding) => `${finding.status.toUpperCase()}: ${finding.statement} — ${finding.issue}`)
          .join("\n")
      : undefined;
    void runAction("edit", {
      content,
      title,
      validationStatus: needsHighRiskReview ? validationResult.status : undefined,
      validationSummary
    });
  }

  function getShareContent() {
    return content;
  }

  const reviewContent = getShareContent();

  function printPlan() {
    setPrintContent(getShareContent());
    setPrintRequested(true);
  }

  async function copyForSharing() {
    const html = getShareContent();
    const plainText = htmlToPlainText(html);
    try {
      if (navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" })
          })
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }
      setCopyMessage("Copied with edit highlights.");
    } catch {
      setCopyMessage("Could not copy this plan. Check browser clipboard permissions.");
    }
  }

  async function runPathwayValidation() {
    setValidating(true);
    setValidationError("");
    setValidationResult(null);
    try {
      const response = await fetch(`/api/validate/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const result = await response.json();
      if (!response.ok) {
        setValidationError(result.error || "Pathway validation could not be completed.");
        return;
      }
      setValidationResult(result as ValidationResult);
    } catch {
      setValidationError("Could not reach the Pathway validation service.");
    } finally {
      setValidating(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-navy-900">Review workflow</h2>
          {canEdit && (
            <div role="tablist" aria-label="Plan view mode" className="flex rounded-lg border border-slate-300 p-0.5">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "review"}
                className={`rounded px-3 py-1.5 text-sm ${viewMode === "review" ? "bg-slate-200 font-semibold text-navy-900" : "text-slate-600"}`}
                onClick={() => setViewMode("review")}
              >
                Review
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "edit"}
                className={`rounded px-3 py-1.5 text-sm ${viewMode === "edit" ? "bg-slate-200 font-semibold text-navy-900" : "text-slate-600"}`}
                onClick={() => setViewMode("edit")}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            {STATUS_LABELS[plan.review_status]}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            {plan.risk_level === "high" ? "High risk" : "Normal risk"}
          </span>
        </div>
      </div>

      {plan.review_note && (
        <p className="border-l-2 border-amber-400 pl-3 text-sm text-slate-700">
          {plan.review_note}
        </p>
      )}

      {["in_review", "flagged"].includes(plan.review_status) && (
        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {reviewer ? (
            <>
              <p><span className="font-semibold">Assigned reviewer:</span> {reviewer.email}</p>
              {reviewer.openedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Opened {new Date(reviewer.openedAt).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <p>Waiting for a Reviewer to open this plan.</p>
          )}
        </div>
      )}
      {assignmentError && <p role="alert" className="text-sm text-red-700">{assignmentError}</p>}

      {canEdit && viewMode === "review" && (
        <div className="plan-document-review prose prose-slate max-w-none rounded-lg border border-slate-200 bg-white p-5">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: reviewContent }} />
        </div>
      )}

      {canEdit && viewMode === "edit" && (
        <div className="space-y-3 border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700">Edit plan</p>
          <label className="block text-sm text-slate-600">
            Plan title
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-navy-900"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setValidationResult(null);
                setValidationError("");
              }}
            />
          </label>
          <RichTextEditor
            value={content}
            onChange={(nextContent) => {
              setContent(nextContent);
              setValidationResult(null);
              setValidationError("");
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving || validating}
              onClick={saveEdits}
              className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-navy-900 disabled:opacity-50"
            >
              {validationResult && validationResult.status !== "pass" ? "Save edits & mark High risk" : "Save edits"}
            </button>
            <button
              type="button"
              disabled={validating || !content.trim()}
              onClick={() => void runPathwayValidation()}
              className="rounded bg-brand-gold px-4 py-2 text-sm font-semibold text-navy-900 disabled:opacity-50"
            >
              {validating ? "Checking guardrails..." : "Run Pathway Validation"}
            </button>
          </div>
          {validationError && <p role="alert" className="text-sm text-red-700">{validationError}</p>}
          {validationResult && (
            <div
              role="status"
              className={`space-y-3 rounded-lg border p-4 ${
                validationResult.status === "pass"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : validationResult.status === "question"
                    ? "border-amber-300 bg-amber-50 text-amber-950"
                    : "border-red-300 bg-red-50 text-red-950"
              }`}
            >
              <div>
                <p className="font-semibold">
                  {validationResult.status === "pass"
                    ? "Pathway Check: Pass"
                    : validationResult.status === "question"
                      ? "Pathway Check: Needs Review"
                      : "Pathway Check: Does Not Pass"}
                </p>
                <p className="mt-1 text-sm">{validationResult.summary}</p>
              </div>
              {validationResult.findings.map((finding, index) => (
                <div key={`${finding.status}-${index}`} className="border-t border-current/15 pt-3 text-sm">
                  <p className="text-xs font-semibold uppercase">Statement from your plan</p>
                  <blockquote className="my-2 border-l-2 border-current/30 pl-3 italic">
                    {finding.statement}
                  </blockquote>
                  <p className="font-semibold">{finding.issue}</p>
                  <p className="mt-1">{finding.why}</p>
                  {finding.alternatives.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold">Suggested alternatives</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {finding.alternatives.map((alternative) => <li key={alternative}>{alternative}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {validationResult.status !== "pass" && (
                <p className="border-t border-current/15 pt-3 text-sm font-semibold">
                  Saving this plan will mark it High risk. Review the findings carefully before approving or publishing it.
                </p>
              )}
              <p className="border-t border-current/15 pt-2 text-xs">
                This AI-assisted check supports, but does not replace, pastoral and theological review.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 border-t border-slate-200 pt-4 print:hidden">
        <p className="text-sm text-slate-600">Inserted text is highlighted in amber and remains highlighted when printed or copied.</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={printPlan} className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Print plan
          </button>
          <button type="button" onClick={() => void copyForSharing()} className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Copy for sharing
          </button>
          {copyMessage && <span role="status" className="text-sm text-slate-600">{copyMessage}</span>}
        </div>
      </div>

      <div className="plan-print-document hidden">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: printContent }} />
      </div>

      {(canRequestReview || canReview || canPublish || (role === "super_admin" && plan.review_status !== "published")) && (
        <div className="space-y-3 border-t border-slate-200 pt-4">
          {(canReview || (role === "super_admin" && plan.review_status !== "published")) && (
            <label className="block text-sm text-slate-600">
              Reviewer note or override reason
              <textarea
                className="mt-1 min-h-20 w-full rounded border border-slate-300 p-3 text-navy-900"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
          )}
          <div className="flex flex-wrap gap-2">
            {canRequestReview && (
              <button type="button" disabled={saving} onClick={() => void runAction("request_review")} className="rounded bg-brand-gold px-4 py-2 text-sm font-semibold text-navy-900 disabled:opacity-50">
                Submit for review
              </button>
            )}
            {canReview && (
              <>
                {canApprovePlan(role, plan.risk_level, isOwner) && (
                  <button type="button" disabled={saving} onClick={() => void runAction("approve")} className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    Approve {plan.risk_level === "high" ? "high-risk" : "normal-risk"}
                  </button>
                )}
                {role === "reviewer" && plan.review_status === "in_review" && (
                  <button type="button" disabled={saving || !note.trim()} onClick={() => void runAction("flag")} className="rounded border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-800 disabled:opacity-50">
                    Flag high risk
                  </button>
                )}
                <button type="button" disabled={saving || !note.trim()} onClick={() => void runAction("return")} className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                  Send back for revision
                </button>
              </>
            )}
            {canPublish && (
              <button type="button" disabled={saving} onClick={() => void runAction("publish")} className="rounded bg-navy-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                Publish approved plan
              </button>
            )}
            {role === "super_admin" && plan.review_status !== "approved" && plan.review_status !== "published" && (
              <button type="button" disabled={saving || !note.trim()} onClick={() => void runAction("override_publish")} className="rounded border border-red-500 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">
                Override and publish
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {events.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-700">Activity</h3>
          <ol className="mt-2 space-y-2">
            {events.map((event) => (
              <li key={event.id} className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">{event.actor_email}</span>
                {" "}{event.action.replaceAll("_", " ")} · {event.from_status.replaceAll("_", " ")} → {event.to_status.replaceAll("_", " ")}
                <span className="ml-2 text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</span>
                {event.note && <p className="ml-2 mt-1 border-l border-slate-300 pl-2">{event.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className="text-xs text-slate-500">Signed in as {ROLE_LABELS[role]}</p>
    </section>
  );
}
