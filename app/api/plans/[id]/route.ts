import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
  }

  return NextResponse.json({ plan: data });
}
