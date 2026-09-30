import { NextResponse } from "next/server";
import { requireContentCreation } from "@/lib/requireApiAuth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { profile, response: authError } = await requireContentCreation();
  if (authError) return authError;

  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("sermons")
      .insert({
        user_id: profile.user.id,
        organization_id: profile.organizationId,
        title: body.title || "Untitled Sermon",
        passage: body.passage,
        topic: body.topic,
        audience: body.audience,
        tone: body.tone,
        key_points: body.keyPoints,
        outline_type: body.outlineType,
        sermon_html: body.sermonHtml
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to save sermon" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sermon: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
