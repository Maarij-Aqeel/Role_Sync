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
        { status: 400 }
      );
    }

    let contents: any[] = [];
    const sysPrompt = `You are an expert LaTeX typesetter and resume designer. Your task is to highly optimize the provided "Finalized Content" into raw LaTeX code.
    
CRITICAL INSTRUCTIONS:
1. Spatial Structure: Use standard LaTeX packages (e.g., geometry, hyperref, enumitem, titlesec). If a visual PDF is provided, try to match its margin and font style. Otherwise, use a highly professional modern serif format.
2. Content: You MUST use exactly the text provided in the "Finalized Content" payload. Do not summarize or omit text.
3. Strict Compilation Rules: Your output must be 100% valid, compilable LaTeX code.
   - You MUST escape all special LaTeX characters in the user's text: % must be \\%, $ must be \\$, & must be \\&, # must be \\#, _ must be \\_.
   - Ensure all \\begin{...} environments have a matching \\end{...}.
4. Output Format: Return ONLY the raw LaTeX code block. Start directly with \\documentclass. Do not include markdown tags like \`\`\`latex.

Finalized Content:
${htmlContent}`;

    if (resumeFile) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const base64PDF = buffer.toString("base64");
      contents = [
        {
          inlineData: {
            data: base64PDF,
            mimeType: "application/pdf"
          }
        },
        sysPrompt
      ];
    } else {
      contents = [sysPrompt];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        temperature: 0.0,
      }
    });

    let latexCode = response.text || "";
    // Clean markdown if injected
    if (latexCode.startsWith("```latex")) {
      latexCode = latexCode.replace(/```latex/g, "").replace(/```/g, "").trim();
    } else if (latexCode.startsWith("```")) {
      latexCode = latexCode.replace(/```/g, "").trim();
    }

    return NextResponse.json({ latexCode });

  } catch (error: any) {
    console.error("LaTeX Generation Error:", error);
    return NextResponse.json(
      { error: "Internal server error during LaTeX generation", details: error.message },
      { status: 500 }
    );
  }
}
