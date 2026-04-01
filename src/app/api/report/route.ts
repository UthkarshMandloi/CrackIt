import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { rawTranscript, targetRole } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API Key missing" }, { status: 500 });
    }

    if (!rawTranscript || rawTranscript.trim().length < 10) {
      return Response.json({
        overallScore: 0,
        confidenceScore: 0,
        technicalScore: 0,
        softSkillsScore: 0,
        summary: "The transcript was too short or empty to analyze. Please speak more during your interview session.",
        strengths: ["Session was initiated"],
        weaknesses: ["No meaningful speech was captured"],
        improvements: ["Speak clearly and at length during the interview", "Ensure your microphone is working", "Answer each question with detailed responses"],
        confidenceAnalysis: "No speech data available to analyze confidence."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert Interview Coach. A candidate just completed a mock interview for a "${targetRole}" position.
      
      The candidate was speaking to an AI video interviewer. Below is the RAW TRANSCRIPT of everything the candidate said during the interview (their answers, not the interviewer's questions).
      
      The interviewer's questions are NOT included because they were on a separate platform. You must analyze ONLY the candidate's speech below.
      
      === CANDIDATE'S RAW SPEECH TRANSCRIPT ===
      ${rawTranscript}
      === END OF TRANSCRIPT ===
      
      Based on the candidate's responses, analyze:
      1. How well they communicated their ideas
      2. Technical depth and accuracy of their answers
      3. Confidence level based on speech patterns (hesitation, repetition, filler words)
      4. Clarity and structure of their responses
      5. Areas where they can improve
      
      IMPORTANT SCORING RULES:
      - If the transcript contains mostly filler words, repetitions, or non-technical content, score LOW (below 30).
      - If the candidate gave thoughtful, structured technical answers, score HIGHER.
      - Be honest and critical. Do NOT inflate scores.
      
      Provide your analysis as a valid JSON object with this exact structure:
      {
        "overallScore": number (0-100),
        "confidenceScore": number (0-100),
        "technicalScore": number (0-100),
        "softSkillsScore": number (0-100),
        "summary": "2-3 sentences about what the candidate needs to improve most. Be specific and critical.",
        "strengths": ["strength 1", "strength 2"],
        "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
        "improvements": ["Specific actionable step 1", "Specific actionable step 2", "Specific actionable step 3"],
        "confidenceAnalysis": "Detailed paragraph analyzing the candidate's confidence based on their speech patterns, hesitations, filler words, and delivery style."
      }
      
      Respond ONLY with the JSON object. No markdown, no explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    let report;
    try {
      const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      report = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse report JSON:", e);
      report = {
        overallScore: 30,
        confidenceScore: 25,
        technicalScore: 30,
        softSkillsScore: 35,
        summary: "The AI could not fully parse your interview. Your answers may have been too brief or unclear.",
        strengths: ["Attempted to engage with the interview"],
        weaknesses: ["Responses lacked depth", "Speech was unclear or too brief"],
        improvements: ["Practice giving structured, detailed answers", "Use the STAR method for behavioral questions", "Record yourself and review for clarity"],
        confidenceAnalysis: "Unable to fully assess confidence. Practice speaking at a steady pace with clear articulation."
      };
    }

    return Response.json(report);
  } catch (error) {
    console.error("Report API error:", error);
    return Response.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
