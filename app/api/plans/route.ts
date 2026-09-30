import { NextResponse } from "next/server";
import { requireDiscipleshipCreation } from "@/lib/requireApiAuth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { profile, response: authError } = await requireDiscipleshipCreation();
  if (authError) return authError;

  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("plans")
      .insert({
      user_id: profile.user.id,
        organization_id: profile.organizationId,
        // ⭐ NEW FIELD
        title: body.title,
        name: body.name,
        group_name: body.group.name,
        group_audience: body.group.audience,
        group_frequency: body.group.frequency,
        group_goals: body.group.goals,
        topic: body.topic,
        scripture: body.scripture,
        book_range: body.bookRange,
        study_mode: body.studyMode,
        pathway_step: body.pathwayStep,
        weeks: body.weeks,
        plan_html: body.planHtml
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to save plan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
