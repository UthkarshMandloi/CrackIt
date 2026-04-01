import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { 
      answer, 
      question, 
      targetRole, 
      language, 
      tone, 
      resumeText 
    } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Demo mode
      return Response.json({
        interviewer_text: `[DEMO MODE] Great answer in ${language}. Let's continue with the next question.`,
        scores: { relevance: 8, clarity: 7, technical: 8, confidence: 7 },
        critique: "A solid response. Keep it up!",
        next_question: `Following up on ${targetRole}, can you explain your experience with similar systems?`,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const contextualPrompt = `
      ${SYSTEM_PROMPT.replace("[LANGUAGE]", language || "English").replace("[TONE]", tone || "Professional").replace("[RESUME]", resumeText || "No resume provided.")}
      
      Context Summary:
      - Interviewing for: ${targetRole}
      - Previous Question: ${question}
      - Candidate's Answer: ${answer}
      
      CRITICAL INSTRUCTIONS FOR SCORING:
      1. Be an HONEST and TOUGH interviewer.
      2. If the Answer is empty, extremely short (less than 10 words), "test", "hi", or nonsense, YOU MUST give a Score of 1 or 2 for relevance, technical, and confidence.
      3. Do NOT give high scores (8+) unless the answer is detailed, technically accurate, and professionally delivered.
      4. A "test" answer should result in a failing grade.
      5. Provide scores for: relevance, clarity, technical, and confidence (all 0-10).
      
      Evaluate the answer and provide the next step. Ensure the "interviewer_text" and "next_question" are written in ${language || "English"}.
      Adhere strictly to the requested tone: ${tone || "Professional"}.
    `;

    const result = await model.generateContent(contextualPrompt);
    const response = result.response;
    const text = response.text();

    let parsed;
    try {
      const cleanText = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleanText);
    } catch {
      parsed = {
        interviewer_text: "That was an interesting answer. Let's move on to the next question.",
        scores: { relevance: 5, clarity: 5, technical: 5, confidence: 5 },
        critique: "Evaluation failed to parse.",
        next_question: "Can you tell me more about your technical background?",
      };
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Evaluate API error:", error);
    return Response.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
