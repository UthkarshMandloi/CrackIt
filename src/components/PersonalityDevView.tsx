"use client";

import { useState } from "react";

const skills = [
  {
    category: "Communication",
    icon: "🗣️",
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
    icon: "🧍",
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
    icon: "💪",
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
    icon: "👔",
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
              <span className="text-xl">{skillGroup.icon}</span>
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
                          <h4 className="text-[10px] uppercase tracking-wider text-slate font-semibold mb-2">
                            💡 Practice Tips
                          </h4>
                          <ul className="space-y-1.5">
                            {skill.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-light-slate">
                                <span className="text-electric-blue mt-0.5 flex-shrink-0">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                          <button className="mt-3 text-[10px] px-3 py-1.5 rounded-lg btn-primary font-medium">
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
    </div>
  );
}
