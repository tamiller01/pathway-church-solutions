"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SchedulePlan = {
  id: string;
  title: string | null;
  theme?: string | null;
  scripture?: string | null;
  passage?: string | null;
};

type Sunday = { value: string; label: string };
type SundaySelection = { worship: string; sermon: string };
type SavedSchedule = {
  id: string;
  service_date: string;
  worship_plan_id: string | null;
  sermon_id: string | null;
};
type ScheduleTab = "sundays" | "sermons" | "worship";

export default function SundayScheduleBoard({
  sundays,
  worshipPlans,
  sermons,
  schedules,
  canSchedule
}: {
  sundays: Sunday[];
  worshipPlans: SchedulePlan[];
  sermons: SchedulePlan[];
  schedules: SavedSchedule[];
  canSchedule: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ScheduleTab>("sundays");
  const [selectionOverrides, setSelectionOverrides] = useState<Record<string, Partial<SundaySelection>>>({});
  const [planDateOverrides, setPlanDateOverrides] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function saveSchedule(serviceDate: string, worshipPlanId: string | null, sermonId: string | null) {
    const response = await fetch("/api/sunday-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceDate, worshipPlanId, sermonId })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save this Sunday.");
  }

  async function saveSunday(serviceDate: string, currentWorship: string, currentSermon: string) {
    const selectedWorship = selectionOverrides[serviceDate]?.worship ?? currentWorship;
    const selectedSermon = selectionOverrides[serviceDate]?.sermon ?? currentSermon;
    const key = `sunday-${serviceDate}`;
    setSavingKey(key);
    setSavedKey(null);
    setError("");

    try {
      await saveSchedule(serviceDate, selectedWorship || null, selectedSermon || null);

      setSelectionOverrides((previous) => {
        const next = { ...previous };
        delete next[serviceDate];
        return next;
      });
      setSavedKey(key);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this Sunday.");
    } finally {
      setSavingKey(null);
    }
  }

  async function savePlanDateFromApprovedTab(type: "worship-plans" | "sermons", plan: SchedulePlan) {
    const schedule = schedules.find((item) => type === "worship-plans"
      ? item.worship_plan_id === plan.id
      : item.sermon_id === plan.id);
    const selectedDate = planDateOverrides[plan.id] ?? schedule?.service_date ?? "";
    const key = `${type}-${plan.id}`;
    setSavingKey(key);
    setSavedKey(null);
    setError("");

    try {
      if (!selectedDate && !schedule) return;
      const targetDate = selectedDate || schedule?.service_date;
      if (!targetDate) return;
      const targetSchedule = schedules.find((item) => item.service_date === targetDate);
      if (schedule && selectedDate && selectedDate !== schedule.service_date) {
        throw new Error("Remove this plan from its current Sunday before assigning it to another date.");
      }
      if (targetSchedule && (type === "worship-plans"
        ? targetSchedule.worship_plan_id && targetSchedule.worship_plan_id !== plan.id
        : targetSchedule.sermon_id && targetSchedule.sermon_id !== plan.id)) {
        throw new Error(`That Sunday already has a ${type === "worship-plans" ? "Worship Plan" : "Sermon"}.`);
      }

      await saveSchedule(
        targetDate,
        type === "worship-plans" ? selectedDate ? plan.id : null : targetSchedule?.worship_plan_id || null,
        type === "sermons" ? selectedDate ? plan.id : null : targetSchedule?.sermon_id || null
      );
      setPlanDateOverrides((previous) => {
        const next = { ...previous };
        delete next[plan.id];
        return next;
      });
      setSavedKey(key);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update the Sunday schedule.");
    } finally {
      setSavingKey(null);
    }
  }

  function updateSundaySelection(serviceDate: string, kind: keyof SundaySelection, id: string) {
    setSelectionOverrides((previous) => ({
      ...previous,
      [serviceDate]: { ...previous[serviceDate], [kind]: id }
    }));
    setSavedKey(null);
    setError("");
  }

  function updatePlanDate(planId: string, serviceDate: string) {
    setPlanDateOverrides((previous) => ({ ...previous, [planId]: serviceDate }));
    setSavedKey(null);
    setError("");
  }

  const tabs: Array<{ id: ScheduleTab; label: string; count: number }> = [
    { id: "sundays", label: "Sundays", count: sundays.length },
    { id: "sermons", label: "Approved Sermons", count: sermons.length },
    { id: "worship", label: "Approved Worship Plans", count: worshipPlans.length }
  ];

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Sunday scheduling views" className="flex flex-wrap gap-2 border-b border-neutral-gray-light">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => { setActiveTab(tab.id); setError(""); setSavedKey(null); }}
            className={`border-b-2 px-3 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "border-brand-gold text-brand-navy" : "border-transparent text-slate-600 hover:text-brand-navy"}`}
          >
            {tab.label} <span className="ml-1 text-xs text-slate-500">{tab.count}</span>
          </button>
        ))}
      </div>

      {!canSchedule && <p className="text-sm text-text-secondary">Your role can view this schedule but cannot change it.</p>}
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      {activeTab === "sundays" && (
        <>
          <p className="text-sm text-text-secondary">Each Sunday is one saved service schedule. Choose its approved Worship Plan and Sermon, then save the pair.</p>
          <ol className="space-y-4">
            {sundays.map((sunday, index) => {
              const schedule = schedules.find((item) => item.service_date === sunday.value);
              const currentWorship = schedule?.worship_plan_id || "";
              const currentSermon = schedule?.sermon_id || "";
              const selectedWorship = selectionOverrides[sunday.value]?.worship ?? currentWorship;
              const selectedSermon = selectionOverrides[sunday.value]?.sermon ?? currentSermon;
              const changed = selectedWorship !== currentWorship || selectedSermon !== currentSermon;
              const hasSchedule = Boolean(schedule);
              const key = `sunday-${sunday.value}`;

              return (
                <li key={sunday.value}>
                  <article className="space-y-4 rounded-lg border border-neutral-gray-light bg-white p-5 shadow-sm">
                    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate-blue-700">Sunday {index + 1}</p>
                        <h2 className="mt-1 text-xl font-bold text-brand-navy">{sunday.label}</h2>
                      </div>
                      <span className={`text-sm font-medium ${hasSchedule ? "text-emerald-700" : "text-slate-500"}`}>
                        {hasSchedule ? "Saved Sunday schedule" : "No plans selected yet"}
                      </span>
                    </header>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block text-sm font-medium text-slate-700">
                        <span className="mb-1.5 block">Approved Worship Plan</span>
                        <select
                          aria-label={`Worship Plan for ${sunday.label}`}
                          disabled={!canSchedule || !worshipPlans.length || savingKey === key}
                          className="w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm text-brand-navy disabled:bg-slate-50 disabled:text-slate-400"
                          value={selectedWorship}
                          onChange={(event) => updateSundaySelection(sunday.value, "worship", event.target.value)}
                        >
                          <option value="">No Worship Plan</option>
                          {worshipPlans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {[plan.title || "Untitled Worship Plan", plan.theme].filter(Boolean).join(" · ")}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        <span className="mb-1.5 block">Approved Sermon</span>
                        <select
                          aria-label={`Sermon for ${sunday.label}`}
                          disabled={!canSchedule || !sermons.length || savingKey === key}
                          className="w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm text-brand-navy disabled:bg-slate-50 disabled:text-slate-400"
                          value={selectedSermon}
                          onChange={(event) => updateSundaySelection(sunday.value, "sermon", event.target.value)}
                        >
                          <option value="">No Sermon</option>
                          {sermons.map((sermon) => (
                            <option key={sermon.id} value={sermon.id}>
                              {[sermon.title || "Untitled Sermon", sermon.passage || sermon.theme].filter(Boolean).join(" · ")}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-500">
                        {hasSchedule ? "Saving changes updates this Sunday’s saved schedule." : "Select either or both approved items to create this Sunday’s schedule."}
                      </p>
                      {canSchedule && (
                        <button
                          type="button"
                          disabled={!changed || (!selectedWorship && !selectedSermon) || savingKey === key}
                          onClick={() => void saveSunday(sunday.value, currentWorship, currentSermon)}
                          className="rounded bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          {savingKey === key ? "Saving..." : savedKey === key ? "Saved" : hasSchedule ? "Save Sunday changes" : "Save Sunday Schedule"}
                        </button>
                      )}
                    </footer>
                  </article>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {activeTab === "sermons" && (
        <ApprovedPlanList
          kind="sermons"
          plans={sermons}
          sundays={sundays}
          schedules={schedules}
          canSchedule={canSchedule}
          dateOverrides={planDateOverrides}
          savingKey={savingKey}
          savedKey={savedKey}
          onDateChange={updatePlanDate}
          onSave={savePlanDateFromApprovedTab}
        />
      )}

      {activeTab === "worship" && (
        <ApprovedPlanList
          kind="worship-plans"
          plans={worshipPlans}
          sundays={sundays}
          schedules={schedules}
          canSchedule={canSchedule}
          dateOverrides={planDateOverrides}
          savingKey={savingKey}
          savedKey={savedKey}
          onDateChange={updatePlanDate}
          onSave={savePlanDateFromApprovedTab}
        />
      )}
    </div>
  );
}

function ApprovedPlanList({
  kind,
  plans,
  sundays,
  schedules,
  canSchedule,
  dateOverrides,
  savingKey,
  savedKey,
  onDateChange,
  onSave
}: {
  kind: "sermons" | "worship-plans";
  plans: SchedulePlan[];
  sundays: Sunday[];
  schedules: SavedSchedule[];
  canSchedule: boolean;
  dateOverrides: Record<string, string>;
  savingKey: string | null;
  savedKey: string | null;
  onDateChange: (id: string, date: string) => void;
  onSave: (kind: "sermons" | "worship-plans", plan: SchedulePlan) => void;
}) {
  if (!plans.length) {
    return <p className="border-t border-neutral-gray-light py-6 text-sm text-text-secondary">
      No approved {kind === "sermons" ? "Sermons" : "Worship Plans"} available to schedule.
    </p>;
  }

  return (
    <ul className="space-y-3">
      {plans.map((plan) => {
        const schedule = schedules.find((item) => kind === "sermons"
          ? item.sermon_id === plan.id
          : item.worship_plan_id === plan.id);
        const selectedDate = dateOverrides[plan.id] ?? schedule?.service_date ?? "";
        const changed = selectedDate !== (schedule?.service_date || "");
        const key = `${kind}-${plan.id}`;
        const title = plan.title || (kind === "sermons" ? "Untitled Sermon" : "Untitled Worship Plan");
        const metadata = kind === "sermons"
          ? plan.passage
          : [plan.theme, plan.scripture].filter(Boolean).join(" · ");

        return (
          <li key={plan.id}>
            <article className="grid gap-4 rounded-lg border border-neutral-gray-light bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)_auto] md:items-center sm:p-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approved</p>
                <Link href={`/${kind}/${plan.id}`} className="mt-1 block truncate font-semibold text-brand-navy hover:text-brand-slate-blue-700 hover:underline">{title}</Link>
                {metadata && <p className="mt-1 text-sm text-text-secondary">{metadata}</p>}
                <p className="mt-1 text-xs text-slate-500">
                  {schedule ? `Scheduled for ${sundays.find((sunday) => sunday.value === schedule.service_date)?.label || schedule.service_date}` : "Not yet scheduled"}
                </p>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-1.5 block">Add to Sunday</span>
                <select
                  aria-label={`Add ${title} to Sunday`}
                  disabled={!canSchedule || savingKey === key}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-brand-navy disabled:bg-slate-50 disabled:text-slate-400"
                  value={selectedDate}
                  onChange={(event) => onDateChange(plan.id, event.target.value)}
                >
                  <option value="">Not scheduled</option>
                  {sundays.map((sunday) => <option key={sunday.value} value={sunday.value}>{sunday.label}</option>)}
                </select>
              </label>
              <button
                type="button"
                disabled={!canSchedule || !changed || savingKey === key}
                onClick={() => onSave(kind, plan)}
                className="min-w-32 rounded bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                  {savingKey === key ? "Saving..." : savedKey === key ? "Saved" : schedule && !selectedDate ? "Remove date" : schedule ? "Update date" : "Schedule"}
              </button>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
