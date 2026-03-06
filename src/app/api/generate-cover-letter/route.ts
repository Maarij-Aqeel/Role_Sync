import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 30;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is not defined in the environment variables!");
} else {
  // Safe debugging to help the user fix Vercel environment variable formatting
  console.log("=== API KEY DEBUG INFO ===");
  console.log(`Key Length: ${apiKey.length}`);
  console.log(`Starts with quote? ${apiKey.startsWith('"') || apiKey.startsWith("'")}`);
  console.log(`Ends with quote? ${apiKey.endsWith('"') || apiKey.endsWith("'")}`);
  console.log(`Starts with AIza: ${apiKey.startsWith('AIza')}`);
  console.log(`Ends with whitespace: ${apiKey !== apiKey.trim()}`);
  console.log("==========================");
}

const ai = new GoogleGenAI({ apiKey: apiKey?.trim() || "" });

export async function POST(req: NextRequest) {
  try {
    const { originalResumeText, jobDescription } = await req.json();

    if (!originalResumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text or JD missing" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert Technical Recruiter and Senior Engineering Hiring Manager at a fast-paced AI startup. 
Your task is to write a highly compelling, concise, and metric-driven Cover Letter.
You will write it exactly as it should appear physically, including placeholders for the header.

## Core Directives:
1. NO FLUFF: Absolutely do not use generic opening phrases like "I am writing with immense enthusiasm" or "I am thrilled to apply." Get straight to the point.
2. LENGTH: Keep the entire letter under 300 words. Engineers and recruiters skim, so optimize for high-impact readability.
3. NO SKILL GAPS: Do not mention technologies the candidate does not know or is "eager to learn." Focus entirely on the immediate value they bring on day one.
4. FORMATTING: Return the generated cover letter AS PURE HTML text. Do NOT wrap it in a markdown block. Use semantic HTML like <p>, <ul>, <li>, <strong>, and <br/> where appropriate so it renders cleanly in a rich-text editor (TipTap).

## Required Structure:
1. Header: Standard business letter placeholders (Date, Hiring Manager Name, Company, Address).
2. The Hook (1 short paragraph): State the target role, mention one specific thing about the company's mission from the JD, and state the candidate's core value proposition (e.g., "I build scalable, sub-100ms AI pipelines...").
3. The Highlight Reel (3-4 Bullet Points): Extract the top 3-4 achievements from the candidate's resume that directly map to the Job Description's hardest requirements. You MUST prioritize bullet points that include hard metrics (e.g., latency reduction, user count, deployment speed) and the specific technical stack used (e.g., FastAPI, Redis, LangChain). Use <strong> tags to emphasize the metrics and tech stack.
4. The Culture Fit (1 short paragraph): Briefly tie the candidate's problem-solving approach and technical agility to the company's goals.
5. Call to Action: A single, confident closing sentence pointing to an interview, followed by the sign-off.

## Candidate Resume Information:
${originalResumeText.substring(0, 10000)}

## Target Job Description:
${jobDescription.substring(0, 10000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const coverLetterHTML = response.text || "<p>Failed to generate cover letter.</p>";

    // Remove any accidental markdown wrapping the LLM might have included
    const cleanHTML = coverLetterHTML.replace(/```html|```/g, "").trim();

    return NextResponse.json({ coverLetterHTML: cleanHTML });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Internal server error generating cover letter" },
      { status: 500 }
    );
  }
}
