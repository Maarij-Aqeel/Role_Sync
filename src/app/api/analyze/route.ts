import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
const pdf = require("pdf-parse");

// Increase max payload size if needed for large PDFs
export const maxDuration = 30; // 30 seconds max execution time for Vercel

// Initialize the Gemini API client
// It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jdText = formData.get("jd") as string | null;

    if (!resumeFile || !jdText) {
      return NextResponse.json(
        { error: "Resume file or JD text missing" },
        { status: 400 }
      );
    }

    // Process PDF to extract text
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // Use Gemini to perform semantic analysis on the resume vs the JD
    const prompt = `
You are an expert AI technical recruiter and ATS specialist.
Analyze the following candidate's resume against the provided Job Description (JD).
Calculate:
1. ATS Score (0-100): How well formatted, readable, and structured the resume text is for Applicant Tracking Systems.
2. Domain Score (0-100): How well the candidate's skills and experience match the core requirements of the job description.
3. Missing Keywords: Extract exactly 5 to 15 critical keywords, skills, or tools present in the JD that are EITHER completely missing or underrepresented in the resume. 

Provide only the JSON matching the required schema.

## Resume Content:
${resumeText.substring(0, 15000)}

## Job Description:
${jdText.substring(0, 15000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ats_score: {
              type: Type.INTEGER,
              description: "Score out of 100 for ATS compatibility",
            },
            domain_score: {
              type: Type.INTEGER,
              description: "Score out of 100 for domain fit against JD",
            },
            missing_keywords: {
              type: Type.ARRAY,
              description: "Array of exactly 5 to 15 critical missing keywords",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["ats_score", "domain_score", "missing_keywords"],
        },
      },
    });

    let analysisResult;
    try {
      analysisResult = JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e);
      analysisResult = { ats_score: 50, domain_score: 50, missing_keywords: [] };
    }

    // Format the resume text roughly into HTML for the TipTap editor
    const formattedHtml = resumeText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => `<p>${line}</p>`)
      .join("");

    return NextResponse.json({
      ats_score: analysisResult.ats_score || 0,
      domain_score: analysisResult.domain_score || 0,
      missing_keywords: analysisResult.missing_keywords || [],
      resumeHTML: formattedHtml,
    });
  } catch (error) {
    console.error("Error processing analysis:", error);
    return NextResponse.json(
      { error: "Internal server error analyzing resume" },
      { status: 500 }
    );
  }
}
