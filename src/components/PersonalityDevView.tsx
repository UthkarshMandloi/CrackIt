"use client";

import { useMemo, useState } from "react";

const youtubeLinks = [
  "https://youtu.be/nIUYfReOgLU",
  "https://youtu.be/JmOBM160jZ0",
  "https://youtu.be/R03jKvxzJYw",
  "https://youtu.be/Zkk3cmRqDm0",
];

type PracticeQuestion = {
  id: string;
  type: "mcq" | "text";
  prompt: string;
  options?: string[];
};

const practiceQuestions: PracticeQuestion[] = [
  {
    id: "q1",
    type: "mcq",
    prompt: "What is the best opening behavior in an interview?",
    options: [
      "Start talking quickly to impress",
      "Greet confidently and wait for the first prompt",
      "Ask salary questions immediately",
      "Avoid eye contact to stay calm",
    ],
  },
  {
    id: "q2",
    type: "mcq",
    prompt: "Which answer style usually scores better with interviewers?",
    options: [
      "Long and unstructured",
      "Short and vague",
      "Structured with clear examples",
      "Only theoretical statements",
    ],
  },
  {
    id: "q3",
    type: "text",
    prompt: "In 2-4 lines, introduce yourself for a professional interview.",
  },
  {
    id: "q4",
    type: "mcq",
    prompt: "How should you handle a question you don't know?",
    options: [
      "Panic and stay silent",
      "Guess randomly with confidence",
      "Acknowledge it and explain your approach logically",
      "Change the topic",
    ],
  },
  {
    id: "q5",
    type: "text",
    prompt: "Write one STAR-format example of a challenge you solved.",
  },
];

const skills = [
  {
    category: "Communication",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
    color: "from-blue-500/15 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    accentColor: "text-blue-400",
    items: [
      {
        title: "Clear & Concise Speech",
        desc: "Practice eliminating filler words (um, uh, like) and delivering concise responses.",
        tips: ["Record yourself answering questions", "Aim for 60-90 second answers", "Use the PREP method: Point, Reason, Example, Point"],
        progress: 0,
      },
      {
        title: "Active Listening",
        desc: "Demonstrate you understand the question before answering.",
        tips: ["Paraphrase the question back", "Ask clarifying questions", "Take brief notes during the interview"],
        progress: 0,
      },
      {
        title: "Storytelling",
        desc: "Craft compelling narratives that showcase your impact.",
        tips: ["Structure with STAR method", "Include specific metrics & outcomes", "Keep it relevant to the role"],
        progress: 0,
      },
    ],
  },
  {
    category: "Body Language",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="5" r="2.5" />
        <path d="M12 8v6m0 0 4 7m-4-7-4 7m4-7 6-3m-6 3-6-3" />
      </svg>
    ),
    color: "from-purple-500/15 to-violet-500/10",
    borderColor: "border-purple-500/20",
    accentColor: "text-purple-400",
    items: [
      {
        title: "Eye Contact & Camera Presence",
        desc: "Maintain natural eye contact with the camera during video interviews.",
        tips: ["Look at the camera, not the screen", "Position camera at eye level", "Practice with mock video calls"],
        progress: 0,
      },
      {
        title: "Posture & Gestures",
        desc: "Sit up straight and use natural hand gestures to emphasize points.",
        tips: ["Keep shoulders relaxed and back straight", "Use open hand gestures", "Avoid crossing arms or fidgeting"],
        progress: 0,
      },
    ],
  },
  {
    category: "Confidence",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 14c2 0 2-3 4-3 1.7 0 2.5 1.3 3 3h3a2 2 0 0 1 2 2 4 4 0 0 1-4 4H9a5 5 0 0 1-5-5v-1h4z" />
        <path d="M7 14V9a2 2 0 0 1 2-2h1" />
      </svg>
    ),
    color: "from-amber-500/15 to-orange-500/10",
    borderColor: "border-amber-500/20",
    accentColor: "text-amber-400",
    items: [
      {
        title: "Managing Interview Anxiety",
        desc: "Techniques to stay calm and confident during high-pressure interviews.",
        tips: ["Box breathing: 4-4-4-4 pattern", "Prepare 3-5 stories in advance", "Visualize success before the interview"],
        progress: 0,
      },
      {
        title: "Handling Unknown Questions",
        desc: "Stay composed when you encounter a question you don't know the answer to.",
        tips: ["Say 'Let me think about that for a moment'", "Think out loud to show your reasoning", "It's OK to say 'I'm not sure, but here's how I'd approach it'"],
        progress: 0,
      },
      {
        title: "Negotiation Skills",
        desc: "Learn to confidently discuss compensation and negotiate offers.",
        tips: ["Research market rates on Levels.fyi", "Never give the first number", "Practice saying 'I'd like to discuss the full compensation package'"],
        progress: 0,
      },
    ],
  },
  {
    category: "Professional Presence",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3h8l-1 5 2 13H7L9 8 8 3z" />
        <path d="M12 8v13" />
      </svg>
    ),
    color: "from-green-500/15 to-emerald-500/10",
    borderColor: "border-green-500/20",
    accentColor: "text-green-400",
    items: [
      {
        title: "First Impressions",
        desc: "Make a strong first impression in the opening 30 seconds of your interview.",
        tips: ["Prepare a 30-second elevator pitch", "Research the company and interviewer", "Have thoughtful questions ready"],
        progress: 0,
      },
      {
        title: "Follow-Up Etiquette",
        desc: "Send effective thank-you emails and follow up professionally.",
        tips: ["Send within 24 hours", "Reference specific conversation points", "Keep it brief and genuine"],
        progress: 0,
      },
    ],
  },
];

export default function PersonalityDevView() {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<Record<string, string>>({});
  const [practiceSkill, setPracticeSkill] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    feedback: string;
    improvements: string[];
  } | null>(null);

  const allSkillTitles = useMemo(
    () => skills.flatMap((group) => group.items.map((item) => item.title)),
    []
  );

  const randomVideoBySkill = useMemo(() => {
    const mapping: Record<string, string> = {};
    allSkillTitles.forEach((title, index) => {
      const randomIndex = (index * 7 + 3) % youtubeLinks.length;
      mapping[title] = youtubeLinks[randomIndex];
    });
    return mapping;
  }, [allSkillTitles]);

  const getVideoId = (url: string) => {
    if (!url) return "";
    
    let videoId = "";
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    } else {
      const longMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
      if (longMatch) {
        videoId = longMatch[1];
      }
    }
    
    return videoId;
  };

  const getCurrentVideoUrl = (skillTitle: string) => selectedVideos[skillTitle] || randomVideoBySkill[skillTitle];

  const handlePracticeNow = (skillTitle: string) => {
    setPracticeSkill(skillTitle);
    setAnswers({});
    setQuizError(null);
    setQuizResult(null);
  };

  const submitPracticeQuiz = async () => {
    if (!practiceSkill) {
      return;
    }

    const unanswered = practiceQuestions.some((question) => !answers[question.id]?.trim());
    if (unanswered) {
      setQuizError("Please answer all 5 questions.");
      return;
    }

    try {
      setIsSubmittingQuiz(true);
      setQuizError(null);

      const payload = {
        skill: practiceSkill,
        questions: practiceQuestions,
        answers,
      };

      const response = await fetch("/api/personality-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as {
        score?: number;
        feedback?: string;
        improvements?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate quiz.");
      }

      setQuizResult({
        score: Number(data.score ?? 0),
        feedback: String(data.feedback ?? "No feedback provided."),
        improvements: Array.isArray(data.improvements)
          ? data.improvements.map((item) => String(item))
          : [],
      });
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : "Failed to evaluate quiz.");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-lightest mb-1">
          Personality Development
        </h1>
        <p className="text-sm text-slate">
          Build the soft skills that make the difference between a good candidate and a great one.
        </p>
      </div>

      {/* Assessment Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-electric-blue/10 to-purple-500/10 border border-electric-blue/15 p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-electric-blue-dim flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-electric-blue">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-lightest mb-0.5">
              Take the Personality Assessment
            </h3>
            <p className="text-[11px] text-slate leading-relaxed">
              Complete a 5-minute assessment to get personalized recommendations based on your communication style and strengths.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold flex-shrink-0">
            Start Assessment →
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-4">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 ${skillGroup.accentColor}`}>
                {skillGroup.icon}
              </span>
              <h2 className="text-sm font-semibold text-lightest">
                {skillGroup.category}
              </h2>
              <span className="text-[10px] text-slate">
                {skillGroup.items.length} skills
              </span>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillGroup.items.map((skill) => {
                const isExpanded = expandedSkill === skill.title;
                return (
                  <div
                    key={skill.title}
                    className={`rounded-xl bg-gradient-to-br ${skillGroup.color} border ${skillGroup.borderColor} transition-all duration-200 ${
                      isExpanded ? "md:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    <button
                      onClick={() => setExpandedSkill(isExpanded ? null : skill.title)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-[13px] font-bold text-lightest mb-1">
                            {skill.title}
                          </h3>
                          <p className="text-[11px] text-slate leading-relaxed">
                            {skill.desc}
                          </p>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`text-slate flex-shrink-0 mt-1 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>

                      {/* Progress */}
                      <div className="mt-3 h-1 rounded-full bg-navy-light/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-electric-blue/40 transition-all"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 animate-fade-in">
                        <div className="border-t border-electric-blue/10 pt-3">
                          <h4 className="text-[10px] uppercase tracking-wider text-slate font-semibold mb-2 flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-electric-blue">
                              <path d="M9 18h6" />
                              <path d="M10 22h4" />
                              <path d="M12 2a7 7 0 0 0-4 12c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 0 0-4-12z" />
                            </svg>
                            Practice Tips
                          </h4>
                          <ul className="space-y-1.5">
                            {skill.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-light-slate">
                                <span className="text-electric-blue mt-0.5 flex-shrink-0">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 rounded-xl border border-white/10 p-3 bg-navy-light/30 space-y-3">
                            <label className="block text-[10px] text-slate uppercase tracking-wider font-semibold">
                              Learning Video
                            </label>
                            <select
                              value={getCurrentVideoUrl(skill.title)}
                              onChange={(event) => setSelectedVideos((prev) => ({ ...prev, [skill.title]: event.target.value }))}
                              className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-2.5 py-2 text-[11px] text-lightest"
                            >
                              {youtubeLinks.map((videoUrl, index) => (
                                <option key={`${skill.title}-video-${index}`} value={videoUrl}>
                                  Video {index + 1}
                                </option>
                              ))}
                            </select>
                            <a
                              href={getCurrentVideoUrl(skill.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Watch on YouTube"
                              className="group relative block w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black cursor-pointer"
                            >
                              {/* Thumbnail */}
                              {getVideoId(getCurrentVideoUrl(skill.title)) && (
                                <img
                                  src={`https://img.youtube.com/vi/${getVideoId(getCurrentVideoUrl(skill.title))}/maxresdefault.jpg`}
                                  alt="Video Thumbnail"
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getVideoId(getCurrentVideoUrl(skill.title))}/hqdefault.jpg`;
                                  }}
                                />
                              )}
                              
                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <div className="w-14 h-14 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </div>
                          <button
                            onClick={() => handlePracticeNow(skill.title)}
                            className="mt-3 text-[10px] px-3 py-1.5 rounded-lg btn-primary font-medium"
                          >
                            Practice Now →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {practiceSkill && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-[#0f172a] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-lightest">Practice Quiz: {practiceSkill}</h3>
                <p className="text-xs text-slate">Answer all 5 questions. Score will be evaluated out of 20 by Gemini.</p>
              </div>
              <button
                onClick={() => setPracticeSkill(null)}
                className="w-8 h-8 rounded-lg border border-white/20 text-slate hover:text-lightest"
              >
                x
              </button>
            </div>

            <div className="space-y-4">
              {practiceQuestions.map((question, index) => (
                <div key={question.id} className="rounded-xl border border-white/10 p-4 bg-[#111827]">
                  <p className="text-sm font-semibold text-lightest mb-3">
                    {index + 1}. {question.prompt}
                  </p>

                  {question.type === "mcq" ? (
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <label key={`${question.id}-opt-${optionIndex}`} className="flex items-center gap-2 text-xs text-slate cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={answers[question.id] || ""}
                      onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                      className="w-full h-24 rounded-lg bg-[#0b1220] border border-white/10 p-2.5 text-xs text-lightest"
                      placeholder="Write your answer..."
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={submitPracticeQuiz}
                disabled={isSubmittingQuiz}
                className="px-4 py-2 rounded-lg btn-primary text-xs font-semibold disabled:opacity-60"
              >
                {isSubmittingQuiz ? "Checking..." : "Submit Practice"}
              </button>
              {quizError && <p className="text-xs text-red-400 font-semibold">{quizError}</p>}
            </div>

            {quizResult && (
              <div className="rounded-xl border border-electric-blue/20 bg-electric-blue/5 p-4 space-y-3">
                <p className="text-sm font-bold text-lightest">Score: {quizResult.score} / 20</p>
                <p className="text-xs text-slate leading-relaxed">{quizResult.feedback}</p>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-electric-blue font-semibold mb-1">Improvements</p>
                  <ul className="space-y-1">
                    {quizResult.improvements.map((item, idx) => (
                      <li key={`improvement-${idx}`} className="text-xs text-light-slate">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
