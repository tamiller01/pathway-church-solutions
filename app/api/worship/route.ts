import { NextResponse } from "next/server";
import OpenAI from "openai";

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
You are a Christian worship‑planning assistant.
You must output clean, elegant HTML formatted as a professional ministry document.
You must NOT use emojis, ASCII art, decorative characters, or markdown.
You must NOT include <html>, <head>, <body>, or <style> tags.
Only output inner HTML content.
Use headings (<h1>, <h2>, <h3>), paragraphs (<p>), lists (<ul>, <li>), and <hr>.
`
        },
        {
          role: "user",
          content: `
Generate a full worship plan in clean, elegant HTML.

<h2>Service Theme</h2>
<p><strong>Theme:</strong> ${body.theme}</p>

<h2>Scripture</h2>
<p><strong>Passage:</strong> ${body.scripture}</p>

<h2>Worship Style</h2>
<p><strong>Style:</strong> ${body.style}</p>

<hr/>

<h2>Title</h2>
<p>Provide a compelling worship service title based on the theme and Scripture.</p>

<hr/>

<h2>Overview</h2>
<p>Provide a pastoral overview of the worship service, explaining the flow and purpose.</p>

<hr/>

<h2>Suggested Songs</h2>
<ul>
  <li>Provide 3–5 worship songs that fit the theme.</li>
</ul>

<hr/>

<h2>Service Flow</h2>
<ul>
  <li>Welcome & Call to Worship</li>
  <li>Opening Song</li>
  <li>Scripture Reading</li>
  <li>Prayer</li>
  <li>Message / Sermon</li>
  <li>Response Song</li>
  <li>Communion (if applicable)</li>
  <li>Closing Blessing</li>
</ul>

<hr/>

<h2>Transitions</h2>
<p>${body.notes || "Provide smooth transitions between worship elements."}</p>

<hr/>

<h2>Closing Prayer</h2>
<p>Provide a short closing prayer that reflects the theme and Scripture.</p>

<hr/>

<h2>Pastoral Notes</h2>
<p>Provide pastoral guidance or special instructions for the worship team.</p>

<hr/>
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
