import { GoogleGenerativeAI } from "@google/generative-ai";

type ATSResponse = {
  atsScore: number;
  summary: string;
  suggestions: string[];
  improvements: string[];
};

const fallbackResponse: ATSResponse = {
  atsScore: 45,
  summary: "Your resume has potential, but it may be missing role-specific keywords and measurable impact statements that ATS systems prioritize.",
  suggestions: [
    "Add job-specific keywords from the target job description",
    "Use standard headings like Summary, Experience, Skills, Education",
    "Keep formatting simple and avoid tables/images"
  ],
  improvements: [
    "Rewrite bullet points with action verbs and quantifiable results",
    "Add a focused professional summary aligned to the role",
    "Include relevant tools, technologies, and certifications"
  ]
};

export async function POST(request: Request) {
  try {
    const { resumeText, targetRole } = await request.json() as {
      resumeText?: string;
      targetRole?: string;
    };

    if (!resumeText || resumeText.trim().length < 50) {
      return Response.json(
        { error: "Resume text is too short. Please provide more details." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return Response.json(fallbackResponse);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an ATS (Applicant Tracking System) resume evaluator.

Analyze the following resume text for ATS readiness${targetRole ? ` for the role: ${targetRole}` : ""}.

Resume text:
${resumeText}

Return ONLY valid JSON in this exact format:
{
  "atsScore": number (0-100),
  "summary": "2-3 sentence summary",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}

Rules:
- Be realistic and critical, do not inflate scores.
- Focus on ATS compatibility: keywords, formatting, section clarity, measurable impact.
- suggestions and improvements must be actionable and specific.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleanText) as Partial<ATSResponse>;

      const response: ATSResponse = {
        atsScore: Math.max(0, Math.min(100, Number(parsed.atsScore ?? fallbackResponse.atsScore))),
        summary: String(parsed.summary ?? fallbackResponse.summary),
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions.map((item) => String(item)).slice(0, 5)
          : fallbackResponse.suggestions,
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements.map((item) => String(item)).slice(0, 5)
          : fallbackResponse.improvements,
      };

      return Response.json(response);
    } catch (parseError) {
      console.error("Failed to parse ATS response:", parseError);
      return Response.json(fallbackResponse);
    }
  } catch (error) {
    console.error("ATS API error:", error);
    return Response.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
