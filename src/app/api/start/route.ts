import { GoogleGenerativeAI } from "@google/generative-ai";
import { START_PROMPT, FALLBACK_QUESTIONS } from "@/lib/constants";

export async function POST(request: Request) {
  let targetRole = "General";
  let interviewType = "Mock";
  
  try {
    const body = await request.json();
    targetRole = body.targetRole || targetRole;
    interviewType = body.interviewType || interviewType;
    const { language, tone, resumeText } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Demo mode
      const roleKey = targetRole.toLowerCase().includes("front")
        ? "frontend"
        : "general";

      const questions = FALLBACK_QUESTIONS[roleKey] || FALLBACK_QUESTIONS.general;

      return Response.json({
        interviewer_text: `[DEMO MODE] Using Fallback. Welcome to your ${interviewType} interview for ${targetRole} in ${language}.`,
        question: questions[0],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = START_PROMPT
      .replace("[TARGET_ROLE]", targetRole)
      .replace("[INTERVIEW_TYPE]", interviewType)
      .replace("[LANGUAGE]", language || "English");
    
    // Add additional context for Resume and Tone
    const contextualPrompt = `
      ${prompt}
      
      Additional Context:
      - Preferred Response Tone: ${tone || "Professional"}
      - Candidate Resume/Context: ${resumeText || "No resume provided."}
      
      Remember to start the interview by greeting the candidate in ${language || "English"} and asking the first question.
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
        interviewer_text: `Welcome! Let's begin your ${interviewType} interview for the ${targetRole} role.`,
        question: "Could you start by introducing yourself and your background?",
      };
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Start API error:", error);
    
    // Fallback logic for when the API itself fails
    const roleKey = (targetRole?.toLowerCase().includes("front") ? "frontend" : 
                    targetRole?.toLowerCase().includes("back") ? "backend" : "general") as keyof typeof FALLBACK_QUESTIONS;
    
    const questions = FALLBACK_QUESTIONS[roleKey] || FALLBACK_QUESTIONS.general;
    
    return Response.json({
      interviewer_text: `[FALLBACK] Welcome! Let's begin your ${interviewType} interview for ${targetRole}.`,
      question: questions[0],
      isFallback: true
    });
  }
}
