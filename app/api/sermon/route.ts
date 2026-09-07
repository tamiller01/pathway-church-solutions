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
You are a Christian sermon-building assistant.
You must take a clear, biblical, orthodox stance rooted in Scripture.
You must stay strictly on the user's topic.
You must NOT reference previous topics or unrelated theological debates.
You must output clean, elegant HTML formatted as a professional ministry document.
Do NOT include <html>, <head>, <body>, or <style> tags.
Only output the inner HTML content.
`
        },
        {
          role: "user",
          content: `
Generate a full sermon in clean, elegant HTML using modern ministry document styling.
Stay strictly on the topic: "${body.topic}".

The HTML must include:
• <h1>, <h2>, <h3> headings
• <p> paragraphs
• <ul> and <li> lists
• <hr> dividers
• No emojis
• No ASCII art
• No monospaced formatting
• Clean spacing
• Professional tone

<h2>Sermon Overview</h2>
<p><strong>Passage:</strong> ${body.passage}</p>
<p><strong>Topic:</strong> ${body.topic}</p>
<p><strong>Audience:</strong> ${body.audience}</p>
<p><strong>Tone:</strong> ${body.tone}</p>

<hr/>

<h2>Sermon Title</h2>
<p>Provide a compelling sermon title based on the passage and topic.</p>

<hr/>

<h2>Introduction</h2>
<p>Write a strong, engaging introduction that frames the topic biblically and pastorally.</p>

<hr/>

<h2>Scripture Exposition</h2>
<h3>Context</h3>
<p>Provide historical, cultural, and theological background.</p>

<h3>Key Themes</h3>
<ul>
  <li>Theme 1</li>
  <li>Theme 2</li>
  <li>Theme 3</li>
</ul>

<h3>Verse-by-Verse Insight</h3>
<p>Provide detailed exposition of the passage.</p>

<hr/>

<h2>Main Points</h2>

<h3>Point 1</h3>
<ul>
  <li>Explanation</li>
  <li>Supporting Scripture</li>
  <li>Doctrinal stance</li>
  <li>Practical insight</li>
</ul>

<h3>Point 2</h3>
<ul>
  <li>Explanation</li>
  <li>Supporting Scripture</li>
  <li>Doctrinal stance</li>
  <li>Practical insight</li>
</ul>

<h3>Point 3</h3>
<ul>
  <li>Explanation</li>
  <li>Supporting Scripture</li>
  <li>Doctrinal stance</li>
  <li>Practical insight</li>
</ul>

<hr/>

<h2>Doctrinal Clarity</h2>
<p>Provide a clear biblical stance ONLY on the topic: <strong>${body.topic}</strong>.</p>

<ul>
  <li>Use Scripture</li>
  <li>Take a clear stance</li>
  <li>Avoid ambiguity</li>
  <li>Avoid universalism</li>
  <li>Avoid evasive language</li>
  <li>Stay strictly on the topic</li>
</ul>

<hr/>

<h2>Application</h2>
<ul>
  <li>How should the audience respond?</li>
  <li>What changes should they make?</li>
  <li>How does this passage shape their walk with Christ?</li>
</ul>

<hr/>

<h2>Illustrations</h2>
<ul>
  <li>Illustration 1</li>
  <li>Illustration 2</li>
</ul>

<hr/>

<h2>Closing Challenge</h2>
<p>Provide a strong pastoral challenge that calls the audience to action.</p>

<hr/>

<h2>Prayer</h2>
<p>Provide a short closing prayer that reflects the message of the sermon.</p>

<hr/>
`
        }
      ]
    });

    const sermon = completion.choices[0].message.content;

    const inputTokens = completion.usage?.prompt_tokens ?? 0;
    const outputTokens = completion.usage?.completion_tokens ?? 0;
    const totalTokens = completion.usage?.total_tokens ?? inputTokens + outputTokens;

    const cost =
      inputTokens * INPUT_PRICE +
      outputTokens * OUTPUT_PRICE;

    return NextResponse.json({
      sermon,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        cost: Number(cost.toFixed(6))
      }
    });

  } catch (error) {
    console.error("Sermon API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate sermon." },
      { status: 500 }
    );
  }
}
