# Pathway Church Solutions — Final Build Checklist

Working document to track remaining build work. Update statuses as items are completed.
Legend: `[x]` done · `[~]` partially done · `[ ]` not started

_Last updated: 2026-09-26_

---

## 0. Security follow-ups (found during gap analysis, do first)
- [x] Require authentication + module-access role on every content API route
      (`/api/sermon`, `/api/discipleship`, `/api/worship` generation endpoints;
      `/api/sermons*`, `/api/plans*`, `/api/worship-plans*` save/list/detail endpoints).
      Previously callable by anyone with the URL, bypassing all UI-level gating.

## 1. Move all tools into the authenticated app
- [x] Sermon Builder, Worship Planner, Discipleship Tools are role-gated behind auth
      (`app/sermon`, `app/discipleship`, `app/worship` layouts using `getOrCreateProfile`)
- [x] Removed tool links from the public marketing homepage (`app/page.tsx`)
- [x] Standardized on one REST-style convention for all three tools:
      `/sermons`, `/sermons/new`, `/sermons/[id]`; `/worship-plans`, `/worship-plans/new`,
      `/worship-plans/[id]`; `/discipleship-plans`, `/discipleship-plans/new`,
      `/discipleship-plans/[id]`. Old paths (`/sermon`, `/worship`, `/discipleship`, `/plans`,
      `/plans/[id]`) permanently redirect via `next.config.ts`.
- [x] Persistent app navigation across all tools (`components/AppHeader.tsx` now renders a
      second nav row — Dashboard, Sermons, Worship Plans, Discipleship Plans —
      on every authenticated page, shown only to roles with module access)

## 2. Role-based access
- [x] Roles added to Supabase `profiles` table (pastor, discipleship_leader, reviewer, admin, super_admin)
- [x] Role fetched on every authenticated page via `getOrCreateProfile()`
- [x] Enforced in user-management API routes (`/api/admin/users*`)
- [x] Enforced in content API routes (see Security follow-ups above)
- [x] UI hides create/generate actions from Reviewers; Pastors, Discipleship Leaders (for
      discipleship plans), Admins, and Super Admins can create in their permitted modules.
      Reviewer create/save API requests are also rejected server-side.
- [x] Enforce Pastor-only and Discipleship Leader-only ownership in their respective modules;
      Reviewers/Admins/Super Admins retain wider visibility. Save APIs set `user_id`, list/detail
      APIs filter by role, and RLS policies enforce owner access directly. Legacy records with
      null `user_id` remain visible to Reviewer/Admin/Super Admin only; assign owners explicitly
      if needed.
- [x] Implement review workflow: Pastors submit/edit their own drafts and publish approved
      plans; Reviewers edit in-review drafts, approve normal-risk plans, flag high-risk plans,
      and return work with notes; Admins approve high-risk and publish approved plans;
      Super Admins can override publish with a reason. The first Reviewer to open an unassigned
      plan claims it; Pastors see who opened it, when, and subsequent edit/review events on the
      detail page (`plan_review_events`). Resubmitting after changes clears the old assignment.
- [x] Plan detail pages default to Review mode with an explicit Edit tab. Newly inserted text is
      highlighted in Review and Edit modes and always remains highlighted when printed or copied
      for sharing.
- [x] Add a user-triggered Pathway Validation check to edited plans. It screens content against
      the documented doctrinal/pastoral guardrails and returns pass, question, or does-not-pass
      with verbatim statement excerpts, explanations, and aligned alternatives where relevant.
      It does not rewrite the plan and reminds users to retain pastoral review. Saving after a
      question/fail result warns the user, promotes the plan to High risk, and preserves the
      validation finding for the Reviewer/Admin; edits invalidate stale check results.

## 3. Build the dashboard
- [x] Module cards + links to saved-item lists (`app/dashboard/page.tsx`)
- [x] Recent sermons / worship plans / discipleship plans preview (latest three per type,
      role-scoped and linked to detail pages)
- [x] Quick actions (Create Sermon, Create Worship Plan, etc.) directly from the dashboard
      (`+ New` links on each module card)
- [x] Upcoming Sundays overview moved to the dedicated Worship Sunday Schedule at
      `/worship-plans/schedule`, linked in app navigation, Worship Plans tabs, builder, and
      dashboard. The page has Sundays, Approved Sermons, and Approved Worship Plans tabs. Sunday
      cards save the selected pair as one `sunday_schedules` record; the required migration is
      applied to the remote database.

## 4. Full modules for each tool
- [x] List, Detail, Create for Sermons, Worship Plans, Discipleship Plans
- [ ] Delete (all three)
- [ ] Duplicate (all three)

## 5. Team assignment system
- [~] Worship has a freeform "Assign person" text field per flow item (not a real team system)
- [ ] Team member list/directory
- [ ] Structured roles (worship leader, prayer, announcements, etc.)
- [ ] Assignments saved/displayed for Sermons and Discipleship Plans (currently worship-only)

## 6. Worship flow builder
- [x] AI-generated flow items render as a list
- [ ] Add/remove flow items manually
- [ ] Save flow templates
- [ ] Multi-week worship calendar
- [ ] Drag-and-drop reordering (optional)

## 7. Export & sharing tools
- [x] Copy-to-clipboard and browser Print on all three tools
- [ ] Real PDF export (not just browser print-to-PDF)
- [ ] Shareable public link (view-only, no login required)
- [ ] Email export

## 8. Settings pages
- [ ] Church profile
- [ ] Branding
- [ ] Team roles
- [ ] Permissions
- [ ] Account settings

## 9. Launch prep
- [~] Pricing section exists on homepage (`#pricing` anchor); no standalone Pricing page
- [ ] Dedicated onboarding flow after signup
- [~] Login/signup functional but minimal (no forgot-password, no post-signup welcome)
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Final QA pass
- [ ] Deploy to production

---

## Working notes
- Test accounts for each role are documented in repo memory (`/memories/repo/test-accounts.md`),
  delete before go-live.
- Architecture/persona/guardrail source of truth: `docs/PathwaySolutions Vision`.

## CSV Tasklist Cross-Check

The project tasklist in `docs/tasklist.csv` is preserved as the roadmap source. The following
audit compares it with the current implementation and does not replace the checklist above.

### Verified Complete
- Navigation Structure
- Dashboard and Saved Plans List
- Admin Controls
- Multi-User Support
- Role-Based Permissions, including the Discipleship Leader role
- Pastors, Discipleship Leaders, and Admins can generate, review, approve, and publish their
      own Sermons, Worship Plans, and Discipleship Plans.
- Organization isolation for the private pilot: users belong to one organization, content and
      Sunday schedules carry `organization_id`, RLS and server queries scope access by organization,
      and organization Admins can invite members.
- Assignment System and Assignment Saving for Worship plans
- Landing Page and Pricing Model
- Innovation Guardrails and Theology Review documentation

### Partially Complete or Requires Final QA
- Curriculum Builder: discipleship generation, saving, lists, detail, and review exist; broader
      curriculum management still needs validation.
- MVP Integration and Workflow Test: the major modules and review workflow exist, but the full
      role-by-role end-to-end test has not been completed.
- Weekly Content Pack: no dedicated generator or assembled delivery view is implemented.
- Worship JSON Richness, Flow Content, and Transitions: generated flows work, but editing depth
      and output quality still need a focused product review.
- Copy/Export Consistency and Print Layout: browser copy/print exist; formatting needs final QA.
- Content Delivery System, Onboarding Flow, Feedback Loop, Content Refresh, and Roadmap Updates:
      these are not fully verifiable as product workflows from the current codebase.
- Brand Identity, Promo Video Script, Email Campaign, and Outreach Plan: treat as complete only
      where the corresponding external marketing artifacts have been reviewed.

### Still Outstanding Before a Complete Launch
- Team Directory, Assignment Reuse, and Auto-Suggestions
- Drag-and-drop Flow Editor, Add/Remove Flow Items, Template System, and Multi-Week Calendar
- Real PDF Export, Email Export, and Planning Center Export
- Search and Filtering
- Church Profile, Branding Settings, Team Roles, Permissions Settings, and Account Settings
- Dedicated post-signup onboarding with ministry name, assigned role, and first-action routing
- Forgot Password recovery flow is complete
- Terms of Service and Privacy Policy pages with signup acknowledgment are complete; final legal
      review remains required before any public commercial launch.
- Final role-based QA, production smoke test, and deployment

These CSV items are product-scope decisions: they may be launch blockers for a full-featured
release, but are not all required for a smaller MVP launch. Test accounts must be removed before
production.

## Private Pilot Scope

The initial launch target is a private pilot. The pilot includes the existing Sermon, Worship, and
Discipleship workflows; saved plans; review and publishing; Pastor and Discipleship Leader roles;
Sunday scheduling; dashboard/admin controls; browser copy/print; password recovery; and final
role-based QA. Weekly content packs, advanced worship editing, team directories, advanced exports,
public sharing, and settings customization remain post-pilot unless explicitly promoted.
