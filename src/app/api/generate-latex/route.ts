import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey?.trim() || "" });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resumeFile") as File | null;
    const htmlContent = formData.get("htmlContent") as string | null;

    if (!htmlContent) {
      return NextResponse.json(
        { error: "HTML content missing" },
        { status: 400 },
      );
    }

    let contents: any[] = [];
    const sysPrompt = `You are an expert LaTeX typesetter and resume designer. Your task is to highly optimize the provided "Finalized Content" into raw LaTeX code.
    
CRITICAL INSTRUCTIONS:
1. Spatial Structure: Use standard LaTeX packages (geometry, hyperref, enumitem, titlesec). Use a highly professional modern sans-serif or serif format.
2. Header & Contact Info (CRITICAL): Do NOT use complex tables (like tabularx) for the header. Use a simple \\begin{center} environment. Separate contact items with \\quad|\\quad or \\textbullet. 
   - If using icons, you MUST use standard fontawesome5 syntax: \\faIcon{envelope}, \\faIcon{phone}, \\faIcon{map-marker-alt}, \\faIcon{linkedin}, \\faIcon{github}. 
   - DO NOT invent custom icon macros.
3. Content: You MUST use exactly the text provided in the "Finalized Content" payload. Do not summarize or omit text.
4. Strict Compilation Rules: Your output must be 100% valid, compilable LaTeX code.
   - You MUST escape special characters: % must be \\%, $ must be \\$, & must be \\&, # must be \\#, _ must be \\_.
   - DO NOT escape the plus symbol (+). Write it normally (e.g., 10K+ not 10K\\+).
   - Ensure all \\begin{...} environments have a matching \\end{...}.
5. Output Format: Return ONLY the raw LaTeX code block. Start directly with \\documentclass. Do not include markdown tags like \`\`\`latex.

Finalized Content
${htmlContent}`;

    if (resumeFile) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const base64PDF = buffer.toString("base64");
      contents = [
        {
          inlineData: {
            data: base64PDF,
            mimeType: "application/pdf",
          },
        },
        sysPrompt,
      ];
    } else {
      contents = [sysPrompt];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        temperature: 0.0,
      },
    });

    let latexCode = response.text || "";
    // Clean markdown if injected
    if (latexCode.startsWith("```latex")) {
      latexCode = latexCode
        .replace(/```latex/g, "")
        .replace(/```/g, "")
        .trim();
    } else if (latexCode.startsWith("```")) {
      latexCode = latexCode.replace(/```/g, "").trim();
    }

    return NextResponse.json({ latexCode });
  } catch (error: any) {
    console.error("LaTeX Generation Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error during LaTeX generation",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
