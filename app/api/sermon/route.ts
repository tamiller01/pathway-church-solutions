import { NextResponse } from "next/server";
import OpenAI from "openai";

import { requireContentCreation } from "@/lib/requireApiAuth";

// Pricing for GPT‑4o‑mini
const INPUT_PRICE = 0.15 / 1_000_000;
const OUTPUT_PRICE = 0.60 / 1_000_000;

export async function POST(req: Request) {
  const { response: authError } = await requireContentCreation();
  if (authError) return authError;

  try {
    const body = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY as string
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a Christian sermon-building assistant.

You must generate content that is biblically faithful, doctrinally sound, pastorally warm, and aligned with historic Christian orthodoxy. 
You must stay strictly on the user's topic and avoid unrelated theological debates.
You must output clean, elegant HTML formatted as a professional ministry document.
Do NOT include <html>, <head>, <body>, or <style> tags. Only output the inner HTML content.

REQUIRED SUPPORT ELEMENTS FOR EVERY SERMON:
1. Include 3–5 supporting Scriptures quoted accurately (ESV or NASB).
2. Include contextual notes explaining how each Scripture reinforces the main theme.
3. Include 1–2 short quotes (max 2 sentences each) from trusted Christian authors such as:
   - Charles Spurgeon
   - John Stott
   - J.I. Packer
   - A.W. Tozer
   - Matthew Henry
   - R.C. Sproul
   - D. Martyn Lloyd-Jones
   - Oswald Chambers
   - C.S. Lewis
   - John Calvin
   - Augustine
4. Do NOT quote or reference any Christian leader with substantiated ethical, moral, or legal controversy.
5. All theological statements must align with:
   - Salvation by grace through faith alone
   - The Trinity: Father, Son, Holy Spirit
   - The authority and inerrancy of Scripture
   - The deity, humanity, death, resurrection, and return of Jesus Christ
   - The necessity of repentance and faith
   - The importance of the local church
6. Reject and regenerate any content that implies:
   - Works-based salvation
   - Universalism
   - Prosperity gospel
   - Mystical or occult practices
   - Speculative prophecy or date-setting
   - Redefinition of marriage or gender
   - Denial of biblical sexual ethics
7. Tone must always be:
   - Warm
   - Gentle
   - Christ-centered
   - Pastoral
   - Encouraging
   - Clear
8. You must encourage reliance on Scripture, prayer, and the local church.
9. You must not position AI as a replacement for pastors, Scripture, or the church.
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

<h3>Sermon Overview</h3>
<p><strong>Passage:</strong> ${body.passage}</p>
<p><strong>Topic:</strong> ${body.topic}</p>
<p><strong>Audience:</strong> ${body.audience}</p>
<p><strong>Tone:</strong> ${body.tone}</p>

<hr/>

<h3>Sermon Title</h3>
<p>Provide a compelling sermon title based on the passage and topic.</p>

<hr/>

<h3>Introduction</h3>
<p>Write a strong, engaging introduction that frames the topic biblically and pastorally.</p>

<hr/>

<h3>Scripture Exposition</h3>
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

<h3>Main Points</h3>

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

<h3>Supporting Scriptures & Commentary</h3>
<p>Provide 3–5 additional supporting Scriptures (ESV or NASB) that reinforce the sermon’s main theme. Include a 1–2 sentence contextual explanation for each passage.</p>

<ul>
  <li><strong>Supporting Scripture 1:</strong> Include verse + explanation.</li>
  <li><strong>Supporting Scripture 2:</strong> Include verse + explanation.</li>
  <li><strong>Supporting Scripture 3:</strong> Include verse + explanation.</li>
  <li><strong>Supporting Scripture 4:</strong> Include verse + explanation (optional).</li>
  <li><strong>Supporting Scripture 5:</strong> Include verse + explanation (optional).</li>
</ul>

<h3>Trusted Commentary Quotes</h3>
<p>Include 1–2 short quotes (max 2 sentences each) from trusted Christian authors such as Spurgeon, Stott, Tozer, Packer, Henry, Sproul, Lloyd‑Jones, Chambers, Lewis, Calvin, or Augustine. Each quote must include attribution and a brief explanation of how it reinforces the sermon’s theme.</p>

<ul>
  <li><strong>Quote 1:</strong> Include quote + attribution + explanation.</li>
  <li><strong>Quote 2:</strong> Include quote + attribution + explanation (optional).</li>
</ul>

<hr/>

<h3>Doctrinal Clarity</h3>
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

<h3>Application</h3>
<ul>
  <li>How should the audience respond?</li>
  <li>What changes should they make?</li>
  <li>How does this passage shape their walk with Christ?</li>
</ul>

<hr/>

<h3>Illustrations</h3>
<ul>
  <li>Illustration 1</li>
  <li>Illustration 2</li>
</ul>

<hr/>

<h3>Closing Challenge</h3>
<p>Provide a strong pastoral challenge that calls the audience to action.</p>

<hr/>

<h3>Prayer</h3>
<p>Provide a short closing prayer that reflects the message of the sermon.</p>

<hr/>
`
        }
      ]
    });

    const sermon = response.choices[0].message.content;

    // Token usage (OpenAI v6 still returns usage)
    const inputTokens = response.usage?.prompt_tokens ?? 0;
    const outputTokens = response.usage?.completion_tokens ?? 0;
    const totalTokens = response.usage?.total_tokens ?? inputTokens + outputTokens;

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
