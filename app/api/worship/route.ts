import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY as string
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a Christian worship‑planning assistant.

Use only worship songs and liturgical elements from historically established, broadly trusted Christian sources such as traditional hymns, public‑domain works, or widely accepted contemporary songs with no known controversies. Avoid referencing any modern worship artists or ministries unless their doctrinal and ethical reputation is broadly affirmed.

You must return the worship plan as structured JSON.

The JSON object must contain:
{
  "theme": string,
  "scripture": string,
  "style": string,
  "title": string,
  "flow": [
    {
      "id": string,
      "label": string,
      "html": string,
      "assignment": ""
    }
  ]
}

HTML rules:
- Clean, elegant inner HTML only.
- No <html>, <head>, <body>, or <style> tags.
- Use <h1>, <h2>, <h3>, <p>, <ul>, <li>, <hr>.
- No emojis, ASCII art, decorative characters, or markdown.

CONTENT REQUIREMENTS:
Each flow item must contain full, rich, pastoral content — not summaries.
Write complete worship elements including:
- Full explanations
- Pastoral reflections
- Transitions
- Prayers
- Descriptions
- Scripture commentary
- Detailed worship flow descriptions

Do NOT assign people. Leave all "assignment" fields as empty strings.
`
        },
        {
          role: "user",
          content: `
Generate a structured JSON worship plan with full, rich content for each section.

User Inputs:
Theme: ${body.theme}
Scripture: ${body.scripture}
Style: ${body.style}
Notes: ${body.notes || "Provide smooth transitions between worship elements."}

Sections to generate:

1. Title — compelling, thematic worship service title
2. Overview — full pastoral narrative overview
3. Suggested Songs — list + explanations
4. Service Flow — each item with full descriptions
5. Transitions — written transitions between elements
6. Closing Prayer — full written prayer
7. Pastoral Notes — detailed guidance

Return ONLY valid JSON. No surrounding text.
`
        }
      ]
    });

    // FIX: handle null safely
    const raw = response.choices[0].message.content ?? "{}";
    const plan = JSON.parse(raw);

    return NextResponse.json({ plan });

  } catch (error) {
    console.error("Worship API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate worship plan." },
      { status: 500 }
    );
  }
}
