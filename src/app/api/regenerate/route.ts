import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 30;

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey?.trim() || "" });

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText } = await req.json();

    if (!resumeText || !jdText) {
      return NextResponse.json({ error: "Missing resume text or JD text" }, { status: 400 });
    }

    const prompt = `
You are an expert technical resume writer. Your task is to rewrite the provided resume to better match the provided Job Description (JD). 

--------------------------------------------------
REWRITING RULES
--------------------------------------------------
1. Integrate critical keywords and domain skills from the JD naturally into the candidate's experience and summary.
2. Do not hallucinate experiences the candidate did not have; instead, reframe their existing experiences using the vocabulary of the JD.
3. Keep the resume formatting parseable (return the output in clear paragraphs or bullet points).
4. Do NOT wrap the output in markdown code blocks like \`\`\`html or \`\`\`text. Just return the raw rewritten text.

--------------------------------------------------
RESUME:
${resumeText.substring(0, 15000)}

--------------------------------------------------
JOB DESCRIPTION:
${jdText.substring(0, 15000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rewrittenText = response.text || "";

    // Convert raw text into basic TipTap HTML format
    const formattedHtml = rewrittenText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => `<p>${line}</p>`)
      .join("");

    return NextResponse.json({ regeneratedHtml: formattedHtml });
  } catch (error: any) {
    console.error("Regenerate Error:", error);
    return NextResponse.json({ error: "Failed to regenerate resume" }, { status: 500 });
  }
}
