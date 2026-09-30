import { NextResponse } from "next/server";

import { requireModuleAccess } from "@/lib/requireApiAuth";
import { canCreateContent } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-server";

function isSundayTodayOrLater(serviceDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(serviceDate)) return false;
  const date = new Date(`${serviceDate}T00:00:00.000Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === serviceDate
    && date.getUTCDay() === 0
    && date >= today;
}

export async function POST(req: Request) {
  const { profile, response: authError } = await requireModuleAccess();
  if (authError) return authError;
  if (!canCreateContent(profile.role)) {
    return NextResponse.json({ error: "Your role cannot schedule plans" }, { status: 403 });
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid schedule details" }, { status: 400 });

  const { serviceDate, worshipPlanId, sermonId } = body;
  if (typeof serviceDate !== "string" || !isSundayTodayOrLater(serviceDate)) {
    return NextResponse.json({ error: "Choose a current or future Sunday" }, { status: 400 });
  }
  if ((worshipPlanId !== null && typeof worshipPlanId !== "string")
    || (sermonId !== null && typeof sermonId !== "string")) {
    return NextResponse.json({ error: "Choose valid approved plans" }, { status: 400 });
  }

  for (const [table, id] of [["worship_plans", worshipPlanId], ["sermons", sermonId]] as const) {
    if (!id) continue;

    const { data: plan, error } = await supabaseAdmin
      .from(table)
      .select("id, user_id, review_status")
      .eq("id", id)
      .maybeSingle();

    if (error || !plan || plan.review_status !== "approved") {
      return NextResponse.json({ error: "Only approved plans can be scheduled" }, { status: 400 });
    }
    if (profile.role === "pastor" && plan.user_id !== profile.user.id) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const column = table === "worship_plans" ? "worship_plan_id" : "sermon_id";
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("sunday_schedules")
      .select("service_date")
      .eq("user_id", profile.user.id)
      .eq("organization_id", profile.organizationId)
      .eq(column, id)
      .neq("service_date", serviceDate)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);
      return NextResponse.json({ error: "Could not check the existing Sunday schedule" }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({
        error: `This ${table === "worship_plans" ? "Worship Plan" : "Sermon"} is already assigned to another Sunday. Remove it from that Sunday first.`
      }, { status: 409 });
    }
  }

  if (!worshipPlanId && !sermonId) {
    const { error } = await supabaseAdmin
      .from("sunday_schedules")
      .delete()
      .eq("user_id", profile.user.id)
      .eq("organization_id", profile.organizationId)
      .eq("service_date", serviceDate);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not remove this Sunday schedule" }, { status: 500 });
    }
    return NextResponse.json({ schedule: null });
  }

  const { data, error } = await supabaseAdmin
    .from("sunday_schedules")
    .upsert({
      user_id: profile.user.id,
      organization_id: profile.organizationId,
      service_date: serviceDate,
      worship_plan_id: worshipPlanId,
      sermon_id: sermonId,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,service_date" })
    .select("id, service_date, worship_plan_id, sermon_id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save this Sunday schedule" }, { status: 500 });
  }

  return NextResponse.json({ schedule: data });
}
