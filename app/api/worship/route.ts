import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Generate a worship plan using the following inputs:

Theme: ${body.theme}
Scripture: ${body.scripture}
Style: ${body.style}
Notes: ${body.notes}

Return a clear, structured worship plan with:
- Title
- Overview
- Suggested Songs
- Service Flow
- Transitions
- Closing Prayer
- Pastoral Notes
          `
        }
      ]
    });

    const plan = completion.choices[0].message.content;

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Worship API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate worship plan." },
      { status: 500 }
    );
  }
}
