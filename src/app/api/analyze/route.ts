import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
const pdf = require("pdf-parse");

// Increase max payload size if needed for large PDFs
export const maxDuration = 30;

// Initialize the Gemini API client
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

    const prompt = `
You are an expert AI technical recruiter and ATS algorithms specialist.
Analyze the candidate's resume against the provided Job Description (JD).
1. Calculate an ATS Score (0-100) based on raw format readability.
2. Calculate a Domain Score (0-100) based on skill match.
3. Extract exactly 5 to 10 critical missing skills, keywords, or concepts present in the JD but missing from the resume.

For EACH missing keyword, you MUST provide an "injection strategy" object mapped to these exact types:
- type: 'hard_skill' (e.g., Python, Docker) OR 'concept' (e.g., Agile, System Design, Leadership).
- target_section: The most logical section to inject this into (e.g., "tech_stack", "experience", "summary", "projects").
- suggested_injection:
   - IF 'hard_skill': Just return ", [Keyword]" so it can be appended to a list.
   - IF 'concept': Write a short, natural sentence fragment starting with an action verb that integrates the concept seamlessly into an experience bullet point (e.g. "Led cross-functional teams utilizing Agile methodologies").
- target_bullet_index: Only required if type is 'concept'. Provide a best-guess integer (e.g. 0, 1, 2) representing the generic bullet position to inject into. Use 0 if unsure.
- confidence: A float from 0.0 to 1.0 indicating your confidence in this injection strategy.

Provide only valid JSON matching the schema.

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
            ats_score: { type: Type.INTEGER },
            domain_score: { type: Type.INTEGER },
            missing_keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  type: { type: Type.STRING, description: "hard_skill or concept" },
                  target_section: { type: Type.STRING },
                  suggested_injection: { type: Type.STRING },
                  target_bullet_index: { type: Type.INTEGER },
                  confidence: { type: Type.NUMBER },
                },
                required: ["keyword", "type", "target_section", "suggested_injection", "confidence"],
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
