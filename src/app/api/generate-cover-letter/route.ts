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
Your task is to write a highly compelling, concise, and metric-driven Cover Letter based on the provided resume and job description.

## Core Directives:
1. NO FLUFF: Absolutely no generic opening phrases (e.g., "I am writing with immense enthusiasm", "I am thrilled"). Start directly with the value proposition.
2. LENGTH & TONE: Keep the entire letter under 300 words. The tone must be confident, professional, and highly direct. Engineers skim, so optimize for high-impact readability.
3. FACTUAL ONLY: Do not invent or hallucinate metrics, projects, or skills. Focus entirely on the immediate value they bring based strictly on the provided resume. 
4. STRICT FORMATTING: Return the generated cover letter AS PURE, RAW HTML. Do NOT wrap the output in markdown code blocks (do not use \`\`\`html or \`\`\`). The first character of your response must be a valid HTML tag. Use semantic HTML (<p>, <ul>, <li>, <strong>, <br/>) optimized for a rich-text editor.

## Required Structure:
1. Header: Use the candidate's actual name and contact info from the resume. Use exact bracketed placeholders for the employer: [Date], [Hiring Manager Name], [Company Name], [Company Address]. Use <br/> tags for line breaks here.
2. The Hook (1 short <p>): State the target role, mention one specific thing about the company's mission/product from the JD, and state the candidate's core value proposition.
3. The Highlight Reel (1 <ul> with 3-4 <li>): Extract the top 3-4 achievements from the resume that directly solve the hardest technical requirements in the JD. Prioritize bullet points with hard metrics. Use <strong> to highlight metrics and the specific technical stack.
4. The Culture Fit (1 short <p>): Briefly tie the candidate's problem-solving approach to the company's goals.
5. Call to Action & Sign-off (1 short <p>): A single, confident closing sentence pointing to an interview, followed by "Sincerely,<br/>[Candidate Name from Resume]".

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
