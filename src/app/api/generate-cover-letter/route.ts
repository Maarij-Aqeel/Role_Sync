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

    const prompt = `
You are an expert AI Career Coach. 
Write a highly compelling, professional, and personalized Cover Letter.
You will write it exactly as it should appear physically, including placeholders for the header.

## Instructions:
1. Use a standard business letter format.
2. The letter MUST be tailored to the provided Job Description, proving the candidate's Domain Match.
3. The letter MUST use the candidate's accomplishments from their Resume to prove they are the best fit.
4. Keep the tone confident, professional, and engaging.
5. Return the generated cover letter AS PURE HTML text. Do NOT wrap it in a markdown block. Use semantic HTML like <p>, <strong>, and <br/> where appropriate so it renders cleanly in a rich-text editor (TipTap).

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
