import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Allow for a significantly longer timeout to let the LLM generate the full LaTeX payload.
export const maxDuration = 60;

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resumeFile") as File | null;
    const htmlContent = formData.get("htmlContent") as string | null;

    if (!resumeFile || !htmlContent) {
      return NextResponse.json(
        { error: "Resume file or HTML content missing" },
        { status: 400 }
      );
    }

    // Step 1: Read the visual reference
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const base64PDF = buffer.toString("base64");

    // The multimodal call constraints from the user
    const sysPrompt = `You are an expert LaTeX typesetter and resume designer. Your task is to perfectly recreate the visual layout of the provided "Original Resume PDF" while using ONLY the text from the "Finalized Content" provided below.

CRITICAL INSTRUCTIONS:
1. Visual Cloning: Analyze the spatial layout, margins, font styles (serif vs sans-serif), and column structure of the Original PDF. Recreate this structure using standard LaTeX packages (e.g., geometry, hyperref, enumitem, titlesec).
2. Content Replacement: Ignore the text in the Original PDF. You MUST use the exact text provided in the "Finalized Content" payload. Do not alter, summarize, or omit any of the new text.
3. Strict Compilation Rules: Your output must be 100% valid, compilable LaTeX code. 
   - You MUST escape all special LaTeX characters in the user's text: % must be \\%, $ must be \\$, & must be \\&, # must be \\#, _ must be \\_.
   - Ensure all \\begin{...} environments have a matching \\end{...}.
   - Do not use obscure packages that require external downloading. Stick to standard TeX Live packages.
4. Output Format: Return ONLY the raw LaTeX code block. Do not include markdown formatting like \`\`\`latex or any conversational text. Start directly with \\documentclass.

INPUTS:
[Image/Document: Original Resume PDF]
[Text: Finalized Content]`;

    // Step 2: Pass into Gemini 2.5 Flash Multimodal inference
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64PDF,
            mimeType: "application/pdf"
          }
        },
        `${sysPrompt}\n\nFinalized Content:\n${htmlContent}`
      ],
      config: {
        // Temperature 0 guarantees structural predictability
        temperature: 0.0,
      }
    });

    let latexCode = response.text || "";
    // Clean markdown if injected anyway
    if (latexCode.startsWith("```latex")) {
      latexCode = latexCode.replace(/```latex/g, "").replace(/```/g, "").trim();
    } else if (latexCode.startsWith("```")) {
      latexCode = latexCode.replace(/```/g, "").trim();
    }

    // Helper to compile LaTeX via Serverless external API
    const compileTexAPI = async (latexContent: string): Promise<Buffer> => {
      const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
      let body = "";
      
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="filecontents"; filename="document.tex"\r\n`;
      body += `Content-Type: application/x-tex\r\n\r\n`;
      body += `${latexContent}\r\n`;
      
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="filename"\r\n\r\n`;
      body += `document.tex\r\n`;
      
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="engine"\r\n\r\n`;
      body += `pdflatex\r\n`;
      
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="return"\r\n\r\n`;
      body += `pdf\r\n`;
      
      body += `--${boundary}--\r\n`;

      const compileResponse = await fetch("https://texlive.net/cgi-bin/latexcgi", {
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`
        },
        body: body,
      });

      if (!compileResponse.ok) {
        throw new Error(`TexLive API Network Error: ${compileResponse.statusText}`);
      }

      const arrayBuffer = await compileResponse.arrayBuffer();
      const pdfBuffer = Buffer.from(arrayBuffer);

      // TexLive returns an HTML page if latex fails compilation. Verify PDF Magic Bytes.
      if (pdfBuffer.length < 5 || pdfBuffer.toString('utf8', 0, 5) !== '%PDF-') {
        const errorLog = pdfBuffer.toString('utf8').substring(0, 2000); // Send the HTML text error back to LLM
        throw new Error(errorLog);
      }
      return pdfBuffer;
    };

    let pdfBuffer: Buffer;

    try {
      pdfBuffer = await compileTexAPI(latexCode);
    } catch (firstAttempt: any) {
      console.warn("First TexLive compilation failed. Triggering LLM auto-repair fallback.");
      
      // 1-retry fallback loop passing the stdout log back to Gemini
      const repairPrompt = `The LaTeX code you provided failed to compile. 

Here is your previous code:
${latexCode}

Here is the compilation error log:
${firstAttempt.message || firstAttempt}

Fix the syntax errors directly to make it compilable. Return ONLY the raw fixed LaTeX code block. Start directly with \\documentclass. Do not include markdown tags.`;

      const repairResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: repairPrompt,
        config: { temperature: 0.0 }
      });

      let repairedLatex = repairResponse.text || "";
      if (repairedLatex.startsWith("```latex")) {
        repairedLatex = repairedLatex.replace(/```latex/g, "").replace(/```/g, "").trim();
      } else if (repairedLatex.startsWith("```")) {
        repairedLatex = repairedLatex.replace(/```/g, "").trim();
      }

      try {
        pdfBuffer = await compileTexAPI(repairedLatex);
      } catch (secondAttempt: any) {
        console.error("Second TexLive compile failed:", secondAttempt.message);
        return NextResponse.json(
          { 
            error: "LaTeX compilation failed on repair step", 
            log: secondAttempt.message || "Unknown proxy error"
          },
          { status: 500 }
        );
      }
    }

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rolesync-optimized-resume.pdf"',
      },
    });

  } catch (error: any) {
    console.error("LaTeX Export Error:", error);
    return NextResponse.json(
      { error: "Internal server error during PDF generation", details: error.message },
      { status: 500 }
    );
  }
}
