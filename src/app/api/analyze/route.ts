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
    
    let resumeText = "";
    try {
      const pdfData = await pdf(buffer);
      resumeText = pdfData.text;
    } catch (parseError: any) {
      console.error("PDF-Parse failure:", parseError.message || parseError);
      return NextResponse.json(
        { error: "Could not parse the uploaded file. Ensure it is a valid, readable PDF." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert AI technical recruiter and ATS algorithms specialist.
Analyze the candidate's resume against the provided Job Description (JD).
1. Calculate an ATS Score (0-100) based on raw format readability.
2. Calculate a Domain Score (0-100) based on skill match.
3. Identify exactly 5 to 10 critical missing DOMAIN-SPECIFIC skills, keywords, or concepts present in the JD but missing from the resume. The primary goal is to make the resume perfectly match the DOMAIN of the job and reduce manual edit time.

For EACH missing domain keyword, you MUST provide a Holistic Rewriting strategy using exactly the following JSON structure. 

CRITICAL REWRITING RULES:
- Modification Type (\`type\`): You MUST categorize each modification as either a \`"hard_skill"\` (for single words/technologies) or a \`"concept"\` (for full sentences, methodologies, or structural experience updates).
- Holistic Rewriting (No Splicing): NEVER insert a keyword into the middle of an existing sentence or just append it to the end of a block of text. If you determine a keyword belongs in a specific bullet point or summary paragraph, you must REWRITE the ENTIRE sentence or bullet point so that the new keyword is integrated with perfect grammar, natural flow, and zero redundancy.
- Heal Broken PDF Text (Line Breaks): The resume text you receive has arbitrary hard line breaks (\\n) due to PDF extraction. You MUST ignore these. Your \`original_text\` should match the logical sequence but ignore formatting. Your \`rewritten_text\` MUST be a clean, continuous string of text without internal \\n breaks.
- Strict Contextual Placement: Target specific Experience bullet points, Summary paragraphs, or comma-separated Skills lists. NEVER inject into or modify Section Headers (e.g. "Experiences", "Projects").

Return strictly valid JSON.

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
            modifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "hard_skill or concept" },
                  keyword_added: { type: Type.STRING },
                  target_section: { type: Type.STRING },
                  original_text: { type: Type.STRING },
                  rewritten_text: { type: Type.STRING },
                },
                required: ["type", "keyword_added", "target_section", "original_text", "rewritten_text"],
              },
            },
          },
          required: ["ats_score", "domain_score", "modifications"],
        },
      },
    });

    let analysisResult;
    try {
      analysisResult = JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e);
      analysisResult = { ats_score: 50, domain_score: 50, modifications: [] };
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
      modifications: analysisResult.modifications || [],
      resumeHTML: formattedHtml,
      originalResumeText: resumeText,
    });
  } catch (error) {
    console.error("Error processing analysis:", error);
    return NextResponse.json(
      { error: "Internal server error analyzing resume" },
      { status: 500 }
    );
  }
}
