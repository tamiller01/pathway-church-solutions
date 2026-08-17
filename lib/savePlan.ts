import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function savePlan(type: "worship" | "sermon" | "discipleship", input: any, output: any) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return { error: "User not logged in." };
  }

  const table = {
    worship: "worship_plans",
    sermon: "sermons",
    discipleship: "discipleship_plans"
  }[type];

  const { data, error } = await supabase.from(table).insert({
    user_id: user.data.user.id,
    input_data: input,
    output_data: output
  });

  if (error) return { error };
  return { data };
}
