import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("worship_plans")
      .insert({
        title: body.title || body.plan?.title || "Untitled Worship Plan",
        theme: body.theme,
        scripture: body.scripture,
        style: body.style,
        notes: body.notes,
        plan_json: body.plan,
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
