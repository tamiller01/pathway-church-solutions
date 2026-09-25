import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("sermons")
      .insert({
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
