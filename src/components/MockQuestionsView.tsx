"use client";

import { useState } from "react";
import { FALLBACK_QUESTIONS } from "@/lib/constants";

const categories = [
  { id: "frontend", label: "Frontend", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "backend", label: "Backend", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  { id: "fullstack", label: "Full-Stack", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "general", label: "Behavioral", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
];

const difficultyBadge = (i: number) => {
  if (i < 3) return { label: "Easy", cls: "bg-green-500/10 text-green-400 border-green-500/20" };
  if (i < 7) return { label: "Medium", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
  return { label: "Hard", cls: "bg-red-500/10 text-red-400 border-red-500/20" };
};

export default function MockQuestionsView() {
  const [activeCategory, setActiveCategory] = useState("frontend");
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const questions = FALLBACK_QUESTIONS[activeCategory] || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-lightest mb-1">Mock Questions</h1>
        <p className="text-sm text-slate">
          Practice with curated questions across different domains and difficulty levels.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setExpandedQ(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? `${cat.bg} ${cat.border} ${cat.color} border`
                : "bg-navy-light/40 border border-navy-mid/30 text-slate hover:text-light-slate"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 px-4 py-2.5 rounded-xl glass border border-navy-mid/30">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate uppercase tracking-wider">Total</span>
          <span className="text-sm font-bold text-lightest">{questions.length}</span>
        </div>
        <div className="h-4 w-px bg-navy-mid/50" />
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-[10px] text-slate">Easy: 3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="text-[10px] text-slate">Medium: 4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="text-[10px] text-slate">Hard: 3</span>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-2">
        {questions.map((q, i) => {
          const diff = difficultyBadge(i);
          const isExpanded = expandedQ === i;
          return (
            <div
              key={i}
              className={`rounded-xl glass border transition-all duration-200 ${
                isExpanded ? "border-electric-blue/20 glow-border" : "border-navy-mid/30 hover:border-navy-mid/60"
              }`}
            >
              <button
                onClick={() => setExpandedQ(isExpanded ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-xs font-bold text-electric-blue/60 w-7 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-[13px] text-lightest leading-relaxed">
                  {q}
                </p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${diff.cls} flex-shrink-0`}>
                  {diff.label}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-slate flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-fade-in">
                  <div className="ml-7 pl-4 border-l-2 border-electric-blue/15 space-y-3">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-slate font-semibold mb-1">
                        Tips for Answering
                      </h4>
                      <p className="text-[12px] text-light-slate leading-relaxed">
                        Use the <span className="text-electric-blue font-medium">STAR method</span> (Situation, Task, Action, Result)
                        for behavioral questions. For technical questions, start with the high-level concept, then dive into specifics
                        with examples from your experience.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-[10px] px-3 py-1.5 rounded-lg btn-primary font-medium">
                        Practice This Question
                      </button>
                      <button className="text-[10px] px-3 py-1.5 rounded-lg bg-navy-light/60 border border-navy-mid/30 text-slate hover:text-light-slate transition-colors">
                        Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
