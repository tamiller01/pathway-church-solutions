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
Generate a sermon using the following inputs:

Passage: ${body.passage}
Topic: ${body.topic}
Audience: ${body.audience}
Tone: ${body.tone}
Key Points: ${body.keyPoints}
Outline Type: ${body.outlineType}

Return a clear, structured sermon with:
- Title
- Introduction
- Main Points
- Scripture Exposition
- Application
- Illustrations
- Closing Challenge
- Prayer
          `
        }
      ]
    });

    const sermon = completion.choices[0].message.content;

    return NextResponse.json({ sermon });
  } catch (error) {
    console.error("Sermon API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate sermon." },
      { status: 500 }
    );
  }
}
