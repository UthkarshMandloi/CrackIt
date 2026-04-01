import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();
    if (!question || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert technical interviewer.
Question asked: "${question}"
Candidate's Answer: "${answer}"

Please evaluate the candidate's answer. Keep your response brief, simple, and direct.
Provide:
1. A short assessment of correctness.
2. What they missed or could improve.
3. A concise example of a better or complete answer.
Respond in plain text with clear spacing or minimal markdown. No conversational fluff.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
