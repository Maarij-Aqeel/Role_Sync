import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

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

    // Step 3: Write and Compile inside isolated temp space
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "rolesync_latex_"));
    const texPath = path.join(tmpDir, "resume.tex");
    const pdfPath = path.join(tmpDir, "resume.pdf");

    await fs.writeFile(texPath, latexCode, "utf8");

    // Helper to compile LaTeX in child process
    const compileTex = (dir: string, file: string): Promise<{ stdout: string; stderr: string }> => {
      return new Promise((resolve, reject) => {
        exec(
          `pdflatex -interaction=nonstopmode ${file}`,
          { cwd: dir },
          (error, stdout, stderr) => {
            if (error) {
              reject({ error, stdout, stderr });
            } else {
              resolve({ stdout, stderr });
            }
          }
        );
      });
    };

    try {
      await compileTex(tmpDir, "resume.tex");
    } catch (firstAttempt: any) {
      console.warn("First pdflatex compilation failed. Triggering LLM auto-repair fallback.");
      
      // 1-retry fallback loop passing the pdflatex stdout log back to Gemini
      const repairPrompt = `The LaTeX code you provided failed to compile using pdflatex. 

Here is your previous code:
${latexCode}

Here is the compilation error log:
${firstAttempt.stdout || firstAttempt.stderr || firstAttempt.error?.message}

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

      await fs.writeFile(texPath, repairedLatex, "utf8");

      try {
        await compileTex(tmpDir, "resume.tex");
      } catch (secondAttempt: any) {
        console.error("Second pdflatex compile failed STDOUT:", secondAttempt.stdout);
        console.error("Second pdflatex compile failed STDERR:", secondAttempt.stderr);
        console.error("Preserved failing TeX workspace at:", tmpDir);
        // We will purposely NOT clean up the tmpDir here so we can debug it via terminal
        return NextResponse.json(
          { 
            error: "LaTeX compilation failed on repair step", 
            log: secondAttempt.stdout || secondAttempt.stderr || secondAttempt.error?.message
          },
          { status: 500 }
        );
      }
    }

    // Read the compiled PDF buffer securely mapped out of /tmp
    const pdfBuffer = await fs.readFile(pdfPath);
    
    // Server cleanliness, preventing container storage bloat over time as requested
    await fs.rm(tmpDir, { recursive: true, force: true });

    return new NextResponse(pdfBuffer, {
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
