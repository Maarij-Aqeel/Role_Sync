import { NextRequest, NextResponse } from "next/server";
const pdf = require("pdf-parse");

// Increase max payload size if needed for large PDFs
export const maxDuration = 30; // 30 seconds max execution time for Vercel

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

    // TODO: In Phase 2, this will be passed to an LLM for real semantic analysis.
    // For now, we mock the analysis result to build out the UI.

    const mockedAtsScore = Math.floor(Math.random() * 20) + 60; // 60-80
    const mockedDomainScore = Math.floor(Math.random() * 30) + 60; // 60-90

    // Build some mocked missing keywords based on common AI Engineer concepts
    const mockKeywords = [
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "Vector Embeddings",
      "AWS SageMaker",
      "CI/CD Pipeline",
    ];

    // Format the resume text roughly into HTML for the TipTap editor
    const formattedHtml = resumeText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => `<p>${line}</p>`)
      .join("");

    return NextResponse.json({
      ats_score: mockedAtsScore,
      domain_score: mockedDomainScore,
      missing_keywords: mockKeywords,
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
