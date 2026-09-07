import { NextResponse } from "next/server";
import OpenAI from "openai";

// Pricing for GPT‑4o‑mini
const INPUT_PRICE = 0.15 / 1_000_000;
const OUTPUT_PRICE = 0.60 / 1_000_000;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY as string
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a Christian discipleship‑building assistant.
You must output clean, elegant HTML formatted as a professional ministry document.
You must NOT use emojis, ASCII art, decorative characters, or markdown.
You must NOT include <html>, <head>, <body>, or <style> tags.
Only output inner HTML content.
Use headings (<h1>, <h2>, <h3>), paragraphs (<p>), lists (<ul>, <li>), and <hr>.
Stay strictly on the user's topic and inputs.
`
        },
        {
          role: "user",
          content: `
Generate a full discipleship plan in clean, elegant HTML.

<h2>Group Overview</h2>
<p><strong>Name:</strong> ${body.group.name}</p>
<p><strong>Audience:</strong> ${body.group.audience}</p>
<p><strong>Frequency:</strong> ${body.group.frequency}</p>

<h3>Goals</h3>
<ul>
  ${body.group.goals
    .split("\n")
    .map((g: string) => `<li>${g}</li>`)
    .join("")}
</ul>

<hr/>

<h2>Passage Study</h2>
<p><strong>Scripture:</strong> ${body.study.passage}</p>

<h3>Discussion Questions</h3>
<ul>
  ${body.study.questions
    .split("\n")
    .map((q: string) => `<li>${q}</li>`)
    .join("")}
</ul>

<h3>Key Takeaways</h3>
<ul>
  ${body.study.takeaways
    .split("\n")
    .map((t: string) => `<li>${t}</li>`)
    .join("")}
</ul>

<h3>Prayer Points</h3>
<ul>
  ${body.study.prayerPoints
    .split("\n")
    .map((p: string) => `<li>${p}</li>`)
    .join("")}
</ul>

<hr/>

<h2>Pathway Step — ${body.pathwayStep}</h2>

<h3>Purpose</h3>
<p>Provide a clear biblical explanation of this discipleship step.</p>

<h3>Action Items</h3>
<ul>
  <li>Provide 4–6 practical action items based on the step.</li>
</ul>

<h3>Weekly Challenge</h3>
<p>Provide one weekly challenge that aligns with the step.</p>

<hr/>

<h2>Summary</h2>
<p>Provide a clean, pastoral summary of the entire discipleship plan.</p>

<hr/>
`
        }
      ]
    });

    const plan = completion.choices[0].message.content;

    const inputTokens = completion.usage?.prompt_tokens ?? 0;
    const outputTokens = completion.usage?.completion_tokens ?? 0;
    const totalTokens = completion.usage?.total_tokens ?? inputTokens + outputTokens;

    const cost =
      inputTokens * INPUT_PRICE +
      outputTokens * OUTPUT_PRICE;

    return NextResponse.json({
      plan,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        cost: Number(cost.toFixed(6)),
      }
    });

  } catch (error) {
    console.error("Discipleship API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate discipleship plan." },
      { status: 500 }
    );
  }
}
