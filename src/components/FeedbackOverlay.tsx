"use client";

import { Scores } from "@/lib/types";

interface FeedbackOverlayProps {
  scores?: Scores | null;
  critique?: string;
  isVisible: boolean;
}

export default function FeedbackOverlay({
  scores,
  critique,
  isVisible,
}: FeedbackOverlayProps) {
  if (!isVisible || !scores) return null;

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-[32px] border border-primary/20 shadow-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-soft">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-none mb-1 uppercase tracking-tight">AI Assessment</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Instant Analysis Complete</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Score Bars (Styled for Final Round) */}
      <div className="space-y-5 mb-6">
        {[
          { label: "RELEVANCE", value: scores.relevance, color: "bg-primary" },
          { label: "CLARITY", value: scores.clarity, color: "bg-secondary" },
          { label: "TECHNICAL", value: scores.technical, color: "bg-slate-800" },
        ].map((score) => (
          <div key={score.label} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-widest leading-none">
                {score.label}
              </span>
              <span className="text-xs font-bold text-slate-900 leading-none">
                {score.value}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div
                className={`h-full ${score.color} transition-all duration-1000 ease-out rounded-full shadow-soft`}
                style={{ width: `${score.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Critique (Styled for readability) */}
      {critique && (
        <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-100 group">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             COACH FEEDBACK
          </p>
          <p className="text-[13px] text-slate-700 leading-relaxed font-bold italic">
            "{critique}"
          </p>
          <div className="absolute -left-1 top-10 w-1 h-8 bg-primary rounded-full opacity-40" />
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <p className="text-[9px] font-bold text-slate-300 italic">Self-optimizing based on your resume data...</p>
      </div>
    </div>
  );
}
