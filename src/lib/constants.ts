export const TOTAL_QUESTIONS = 10;

export const SYSTEM_PROMPT = `You are an AI Interviewer at a top-tier tech firm. Your persona is professional, encouraging, but rigorous.

Your Workflow:
1. Receive the [User_Answer] and [Target_Role].
2. Evaluate based on Technical Accuracy and STAR Method (Situation, Task, Action, Result).
3. Return ONLY a valid JSON object with NO additional text, markdown, or code fences:

{
  "interviewer_text": "The verbal response the 3D model will say (e.g., 'Great point on the Action phase. Let's move to the next question...')",
  "scores": { "relevance": 8, "clarity": 7, "technical": 9 },
  "critique": "One specific sentence on what they missed.",
  "next_question": "The next technical or behavioral question."
}

Rules:
- Scores must be integers from 1 to 10.
- interviewer_text should be 1-3 sentences, encouraging but constructive.
- critique should be specific and actionable.
- next_question should be relevant to the target role and progressively more challenging.
- RESPOND IN THE SELECTED [LANGUAGE] AT ALL TIMES.
- MATCH THE REQUESTED [TONE] (e.g. 'Short', 'Detailed').
- REFERENCE THE CANDIDATE'S [RESUME] IF RELEVANT TO THE QUESTION.
- Do NOT include any text outside the JSON object. No markdown fences, no explanations.`;

export const START_PROMPT = `You are an AI Interviewer at a top-tier tech firm conducting a mock interview.

Generate the FIRST interview question for a candidate applying for the role of [TARGET_ROLE].
The interview type is [INTERVIEW_TYPE].

Return ONLY a valid JSON object with NO additional text:
{
  "interviewer_text": "A brief, welcoming introduction (1-2 sentences)",
  "question": "The first interview question"
}

Rules:
- The question should be appropriate for the role and interview type.
- For technical interviews, start with a medium-difficulty question.
- For behavioral interviews, use a STAR-method question.
- Do NOT include any text outside the JSON object.
- RESPOND IN [LANGUAGE].`;

export const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi (हिंदी)' },
  { value: 'spanish', label: 'Spanish (Español)' },
  { value: 'french', label: 'French (Français)' },
  { value: 'german', label: 'German (Deutsch)' },
];

export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional & Balanced' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'detailed', label: 'Deeply Technical & Detailed' },
  { value: 'short', label: 'Fast-Paced & Short' },
];

export const FALLBACK_QUESTIONS: Record<string, string[]> = {
  frontend: [
    "Can you explain the virtual DOM and how React uses it to optimize rendering?",
    "What's the difference between CSS Grid and Flexbox? When would you use each?",
    "How would you implement infinite scrolling in a web application?",
    "Explain the concept of closures in JavaScript with a practical example.",
    "How do you handle state management in large-scale React applications?",
    "What are Web Vitals and how do you optimize for them?",
    "Describe your approach to making a web application accessible (WCAG compliance).",
    "How would you implement authentication and authorization in a single-page application?",
    "What strategies do you use for testing React components?",
    "Tell me about a challenging frontend bug you debugged. How did you solve it?"
  ],
  backend: [
    "Explain the differences between SQL and NoSQL databases. When would you choose each?",
    "How would you design a rate limiter for an API?",
    "What is the CAP theorem and how does it influence system design?",
    "Describe how you would implement a caching strategy for a high-traffic API.",
    "Explain the concept of database sharding and when you'd use it.",
    "How do you ensure data consistency in a microservices architecture?",
    "What's your approach to API versioning?",
    "How would you design a job queue system?",
    "Explain the difference between horizontal and vertical scaling.",
    "Tell me about a production incident you handled. What was your debugging process?"
  ],
  fullstack: [
    "How would you architect a real-time collaborative editing application?",
    "Explain the trade-offs between SSR, SSG, and CSR.",
    "How do you handle file uploads in a web application end-to-end?",
    "Describe your CI/CD pipeline for a full-stack application.",
    "How would you implement WebSocket communication between server and client?",
    "What's your approach to error handling across the full stack?",
    "How do you optimize database queries for a slow endpoint?",
    "Explain how you'd implement role-based access control (RBAC).",
    "How do you manage environment-specific configurations?",
    "Tell me about a time you had to refactor a legacy codebase. What was your approach?"
  ],
  general: [
    "Tell me about yourself and your experience in software development.",
    "What's the most challenging project you've worked on?",
    "How do you handle disagreements with team members about technical decisions?",
    "Describe a time when you had to learn a new technology quickly.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "What's your approach to code reviews?",
    "How do you stay up-to-date with new technologies?",
    "Describe a situation where you had to make a trade-off between quality and speed.",
    "How do you handle production incidents?",
    "Where do you see yourself in 5 years?"
  ]
};

export const ROLE_OPTIONS = [
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full-Stack Developer' },
  { value: 'general', label: 'General / Behavioral' },
];

export const INTERVIEW_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'mixed', label: 'Mixed' },
];
