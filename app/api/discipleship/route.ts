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
Generate a structured discipleship plan using the following inputs:

Group:
Name: ${body.group.name}
Audience: ${body.group.audience}
Frequency: ${body.group.frequency}
Goals: ${body.group.goals}

Study:
Passage: ${body.study.passage}
Questions: ${body.study.questions}
Key Takeaways: ${body.study.takeaways}
Prayer Points: ${body.study.prayerPoints}

Pathway Step: ${body.pathwayStep}

Return a clear, organized discipleship plan with sections for:
- Group Overview
- Study Plan
- Key Questions
- Takeaways
- Prayer Points
- Pathway Step Guidance
- Recommended Next Steps
          `
        }
      ]
    });

    const plan = completion.choices[0].message.content;

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Discipleship API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate discipleship plan." },
      { status: 500 }
    );
  }
}
