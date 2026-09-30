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

    const topic = (body.topic || "").trim();
    const scripture = (body.scripture || "").trim();
    const bookRange = (body.bookRange || "").trim();
    const studyMode = (body.studyMode || "").trim(); // NEW FIELD
    const pathwayStep = body.pathwayStep;
    const weeks = body.weeks;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a Christian discipleship‑building assistant.

You must generate content that is biblically faithful, doctrinally sound, pastorally warm, and aligned with historic Christian orthodoxy.
You must output clean, elegant HTML formatted as a professional ministry document.
You must NOT use emojis, ASCII art, decorative characters, or markdown.
You must NOT include <html>, <head>, <body>, or <style> tags.
Only output inner HTML content.

=====================================================
ANCHOR INPUTS (ALL OPTIONAL)
=====================================================
1. Topic (e.g., Fellowship, Leadership, Identity in Christ)
2. Scripture (e.g., James 1:2–4)
3. Entire Book / Chapter / Range Study (e.g., Revelation, James 1–5, Romans 8)
4. Study Mode (required if bookRange is provided):
   - "entire-book" → sequential, end‑to‑end coverage
   - "key-themes" → thematic extraction

=====================================================
PRIORITY LOGIC
=====================================================
1. Scripture ALWAYS takes priority when provided.
2. If Scripture is NOT provided but Book/Chapter/Range IS provided:
   - Book/Chapter/Range becomes the anchor.
3. Topic shapes application but NEVER overrides Scripture or Book/Chapter/Range.
4. If Topic does not meaningfully align with Scripture or Book/Chapter/Range:
   - You MUST include a short pastoral explanation before Week 1:
     a) That Scripture/Book/Chapter/Range was prioritized.
     b) Why the mismatch occurred.
     c) How the Scripture/Book/Chapter/Range still contributes meaningfully.
     d) How the user could regenerate with a better match.

=====================================================
BOOK / CHAPTER / RANGE HANDLING (OPTION E)
=====================================================
If the user enters a book, chapter, or range:
- You MUST:
  1. Choose a meaningful anchor passage from that book/chapter/range.
  2. Explain WHY you chose that passage (1–3 sentences).
  3. Use supporting Scriptures from the same book/chapter/range when appropriate.
  4. Ensure Week 1 anchors to that chosen passage.

=====================================================
STUDY MODE LOGIC
=====================================================
If studyMode = "entire-book":
- Break the book/chapter/range into the number of weeks.
- Identify major movements or macro‑themes sequentially.
- Anchor each week to a passage from that section.
- Ensure full end‑to‑end coverage.

If studyMode = "key-themes":
- Identify the top N themes from the book/chapter/range.
- Anchor each week to the best passage for that theme.
- Supporting Scriptures may come from anywhere in the book.

=====================================================
SCRIPTURE HANDLING (OPTION E)
=====================================================
If Scripture is provided:
- Week 1 MUST anchor to that Scripture.
- Quote it accurately (ESV or NASB).
- Explain why it is central.
- Supporting Scriptures must reinforce its themes.

=====================================================
WEEKLY CONTENT REQUIREMENTS
=====================================================
Each week MUST include:
- Weekly Theme (based on Pathway Step + anchor input)
- Primary Scripture (ESV or NASB)
- 2–4 supporting Scriptures with explanations
- Trusted commentary quote (Spurgeon, Stott, Tozer, Packer, Henry, Sproul, Lloyd‑Jones, Chambers, Lewis, Calvin, Augustine)
- Memory Verse
- Spiritual Practice
- 4–6 Discussion Questions
- Weekly Challenge
- Prayer Focus

=====================================================
PATHWAY STEP THEMES
=====================================================
FOUNDATION → identity, assurance, grace, repentance, faith, belonging  
GROWTH → prayer, Scripture, obedience, holiness, spiritual disciplines  
SERVICE → serving, gifts, compassion, evangelism, community impact  
LEADERSHIP → character, influence, shepherding, teaching, mentoring  

=====================================================
THEOLOGICAL GUARDRAILS
=====================================================
- No works‑based salvation
- No universalism
- No prosperity gospel
- No occult or mystical practices
- No speculative prophecy or date‑setting
- No redefinition of marriage or gender
- No denial of biblical sexual ethics

Tone must always be warm, gentle, Christ‑centered, pastoral, encouraging, and clear.
Encourage reliance on Scripture, prayer, and the local church.
`
        },
        {
          role: "user",
          content: `
Generate a full multi‑week discipleship plan in clean, elegant HTML.

<h3>Group Overview</h3>
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

<h3>Input Summary</h3>
<p><strong>Topic:</strong> ${topic || "None provided"}</p>
<p><strong>Scripture:</strong> ${scripture || "None provided"}</p>
<p><strong>Book/Chapter/Range:</strong> ${bookRange || "None provided"}</p>
<p><strong>Study Mode:</strong> ${studyMode || "None selected"}</p>
<p><strong>Pathway Step:</strong> ${pathwayStep}</p>
<p><strong>Weeks:</strong> ${weeks}</p>

<hr/>

<h3>Priority Notice</h3>
<p>
Scripture always takes priority when provided. If Scripture is not provided but a book, chapter, or range is,
that becomes the anchor. If the topic does not align with the Scripture or book/chapter/range,
please include a brief pastoral explanation before Week 1.
</p>

<hr/>

<h3>Weekly Breakdown</h3>
<p>Generate ${weeks} full weeks of discipleship content now.</p>

<ul>
  <li>Weekly Theme</li>
  <li>Primary Scripture</li>
  <li>Supporting Scriptures (with explanations)</li>
  <li>Trusted Commentary Quote</li>
  <li>Memory Verse</li>
  <li>Spiritual Practice</li>
  <li>Discussion Questions</li>
  <li>Weekly Challenge</li>
  <li>Prayer Focus</li>
</ul>

<hr/>

<h3>Generate Weeks</h3>
<p>
Using the topic, Scripture, book/chapter/range, and study mode provided,
generate ${weeks} full weeks of content. Ensure Week 1 is anchored to either the Scripture passage
(if provided) or a chosen passage from the book/chapter/range, with an explanation of why that passage was selected.
</p>

<hr/>

<h3>Summary</h3>
<p>Provide a pastoral summary of the entire multi‑week pathway.</p>

<hr/>
`
        }
      ]
    });

    const plan = response.choices[0].message.content;

    const inputTokens = response.usage?.prompt_tokens ?? 0;
    const outputTokens = response.usage?.completion_tokens ?? 0;
    const totalTokens = response.usage?.total_tokens ?? inputTokens + outputTokens;

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
