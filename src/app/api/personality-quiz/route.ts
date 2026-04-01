import { GoogleGenerativeAI } from "@google/generative-ai";

type QuizQuestion = {
  id: string;
  type: "mcq" | "text";
  prompt: string;
  options?: string[];
};

type QuizBody = {
  skill?: string;
  questions?: QuizQuestion[];
  answers?: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuizBody;
    const skill = body.skill || "Personality";
    const questions = Array.isArray(body.questions) ? body.questions : [];
    const answers = body.answers || {};

    if (questions.length !== 5) {
      return Response.json({ error: "Exactly 5 questions are required." }, { status: 400 });
    }

    const unanswered = questions.some((q) => !String(answers[q.id] || "").trim());
    if (unanswered) {
      return Response.json({ error: "Please answer all questions." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return Response.json({
        score: 14,
        feedback: "Good attempt. Your communication is clear, but add more structured examples and stronger confidence framing.",
        improvements: [
          "Use STAR format for scenario questions",
          "Keep answers concise and focused",
          "Add measurable outcomes in examples"
        ]
      });
    }

    const formattedQuestions = questions
      .map((q, index) => {
        const options = q.options?.length
          ? `\nOptions: ${q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join(" | ")}`
          : "";
        return `${index + 1}. (${q.type.toUpperCase()}) ${q.prompt}${options}\nAnswer: ${answers[q.id]}`;
      })
      .join("\n\n");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an interview personality skills evaluator.
Skill focus: ${skill}

Evaluate the following 5-question practice quiz answers.
Score total must be out of 20.

${formattedQuestions}

Return ONLY valid JSON using this format:
{
  "score": number,
  "feedback": "short paragraph",
  "improvements": ["item 1", "item 2", "item 3"]
}

Rules:
- score must be integer 0-20.
- feedback must be concise and practical.
- improvements must be actionable.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleanText) as {
        score?: number;
        feedback?: string;
        improvements?: string[];
      };

      return Response.json({
        score: Math.max(0, Math.min(20, Math.round(Number(parsed.score ?? 0)))),
        feedback: String(parsed.feedback ?? "No feedback generated."),
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements.map((item) => String(item)).slice(0, 5)
          : ["Practice concise and structured responses."],
      });
    } catch (parseError) {
      console.error("Failed to parse personality quiz response:", parseError);
      return Response.json({
        score: 12,
        feedback: "Your answers show good intent, but they need clearer structure and stronger examples.",
        improvements: [
          "Use STAR format for scenario responses",
          "Reduce filler language",
          "Focus on confidence and clarity"
        ]
      });
    }
  } catch (error) {
    console.error("Personality quiz API error:", error);
    return Response.json({ error: "Failed to evaluate practice quiz." }, { status: 500 });
  }
}
