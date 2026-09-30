import { NextResponse } from "next/server";
import { requireContentCreation } from "@/lib/requireApiAuth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { worshipPlanToHtml } from "@/lib/worshipPlanHtml";

export async function POST(req: Request) {
  const { profile, response: authError } = await requireContentCreation();
  if (authError) return authError;

  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("worship_plans")
      .insert({
      user_id: profile.user.id,
        organization_id: profile.organizationId,
        title: body.title || body.plan?.title || "Untitled Worship Plan",
        service_date: body.serviceDate || null,
        theme: body.theme,
        scripture: body.scripture,
        style: body.style,
        notes: body.notes,
        plan_json: body.plan,
        plan_html: worshipPlanToHtml(body.plan),
        assignments: body.assignments || {}
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to save worship plan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ worshipPlan: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
