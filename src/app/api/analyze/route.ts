import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
const pdf = require("pdf-parse");

// Increase max payload size if needed for large PDFs
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

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: apiKey?.trim() || "" });

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

Your task is to analyze the candidate's resume against the provided Job Description (JD).

--------------------------------------------------
EVALUATION TASKS
--------------------------------------------------

1. Calculate an ATS Score (0–100)
   - Based on raw format readability and ATS compatibility.

2. Calculate a Domain Score (0–100)
   - Based on the relevance and match of technical/domain skills with the JD.

3. Identify 5–10 critical missing DOMAIN-SPECIFIC skills, keywords, or concepts
   - These must be present in the JD but missing from the resume.
   - The goal is to help the candidate optimize their resume for the target role
   - Reduce manual editing by suggesting precise improvements.

4. Generate Constructive Feedback
   - Act as a hiring manager and provide an 'interviewerCritique' with a summary and tone.
   - Analyze 'repetitiveWords' (e.g., overusing 'managed', 'developed') with count and better alternatives.
   - Provide 'sectionAnalysis' for core sections (e.g., experience, education) indicating if they pass or need work.
   - Select 'uiHighlights' to point out exactly which phrases in the resume should be rewritten, with a reason and suggested rewrite.

--------------------------------------------------
CRITICAL REWRITING RULES
--------------------------------------------------

1. Modification Type
   - Each modification MUST be categorized as one of:
     - "hard_skill" → single technologies or tools
     - "concept" → methodologies, experience statements, or structural improvements

2. Holistic Rewriting (NO Keyword Splicing)
   - NEVER insert a keyword into the middle of an existing sentence.
   - NEVER append keywords to the end of a sentence.
   - If a keyword belongs in a bullet point, you MUST rewrite the entire sentence
     so the keyword integrates naturally with proper grammar and flow.

3. Heal Broken PDF Text
   - The resume text contains arbitrary line breaks (\\n) from PDF extraction.
   - You MUST ignore these formatting breaks.
   - "originalText" should represent the logical sentence.
   - "rewrittenText" MUST be a clean continuous string with no internal \\n breaks.

4. Strict Contextual Placement
   - Target only:
     - Experience bullet points
     - Summary paragraphs
   - NEVER modify or inject content into section headers such as:
     - "Experience"
     - "Projects"
     - "Education"

--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

You MUST return a valid JSON object strictly matching the following schema.

Do NOT wrap the response in markdown (no \`\`\`json).

  "atsScore": 85,
  "domainScore": 72,
  "modifications": [
    {
      "type": "hard_skill | concept",
      "keyword_added": "Microservices",
      "target_section": "Experience",
      "original_text": "The exact original sentence from the resume to be replaced",
      "rewritten_text": "The fully rewritten sentence integrating the keyword naturally"
    }
  ],
  "feedback": {
    "interviewerCritique": {
      "summary": "Strong technical background but lacks business impact metrics.",
      "tone": "Constructive"
    },
    "repetitiveWords": [
      {
        "word": "developed",
        "count": 5,
        "impact": "medium",
        "betterAlternatives": ["engineered", "architected"]
      }
    ],
    "sectionAnalysis": {
      "experience": { "status": "needs_work", "message": "Add more quantifiable achievements." }
    },
    "uiHighlights": [
      {
        "exactPhrase": "responsible for",
        "reason": "Passive voice",
        "suggestedRewrite": "spearheaded"
      }
    ]
  }
}

--------------------------------------------------
INPUT DATA
--------------------------------------------------

Resume Content:
${resumeText.substring(0, 15000)}

Job Description:
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
            feedback: {
              type: Type.OBJECT,
              properties: {
                interviewerCritique: {
                  type: Type.OBJECT,
                  properties: {
                    summary: { type: Type.STRING },
                    tone: { type: Type.STRING }
                  },
                  required: ["summary", "tone"]
                },
                repetitiveWords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      count: { type: Type.INTEGER },
                      impact: { type: Type.STRING },
                      betterAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["word", "count", "impact", "betterAlternatives"]
                  }
                },
                sectionAnalysis: {
                  type: Type.OBJECT, // We will treat it as a generic object (Record<string, { status, message }>)
                  description: "Object mapping section names like 'experience' to analysis results"
                },
                uiHighlights: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      exactPhrase: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      suggestedRewrite: { type: Type.STRING }
                    },
                    required: ["exactPhrase", "reason", "suggestedRewrite"]
                  }
                }
              },
              required: ["interviewerCritique", "repetitiveWords", "sectionAnalysis", "uiHighlights"]
            }
          },
          required: ["ats_score", "domain_score", "modifications", "feedback"],
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
      feedback: analysisResult.feedback || null,
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
