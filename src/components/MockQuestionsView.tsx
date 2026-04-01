"use client";

import { useState } from "react";
import { FALLBACK_QUESTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

const categories = [
  { id: "frontend", label: "Frontend", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]" },
  { id: "backend", label: "Backend", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", glow: "hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]" },
  { id: "fullstack", label: "Full-Stack", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]" },
  { id: "general", label: "Behavioral", shadow: "shadow-[0_0_20px_rgba(234,76,137,0.1)]", color: "text-[#EA4C89]", bg: "bg-[#EA4C89]/10", border: "border-[#EA4C89]/20", glow: "hover:border-[#EA4C89]/50 hover:shadow-[0_0_30px_rgba(234,76,137,0.3)]" },
];

const difficultyBadge = (i: number) => {
  if (i % 3 === 0) return { label: "Hard", cls: "bg-red-500/10 text-red-500 border-red-500/20", dot: "bg-red-500" };
  if (i % 2 === 0) return { label: "Medium", cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", dot: "bg-yellow-500" };
  return { label: "Easy", cls: "bg-green-500/10 text-green-500 border-green-500/20", dot: "bg-green-500" };
};

export default function MockQuestionsView() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("frontend");
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  
  // Chat Practice state
  const [practicingQ, setPracticingQ] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = FALLBACK_QUESTIONS[activeCategory as keyof typeof FALLBACK_QUESTIONS] || [];

  const handlePractice = (category: string) => {
    // Navigate to interview room with the category pre-selected if possible
    router.push("/dashboard/interview?role=" + encodeURIComponent(category));
  };

  const handleOpenPractice = (index: number) => {
    if (practicingQ === index) {
      setPracticingQ(null);
    } else {
      setPracticingQ(index);
      setAnswer("");
      setFeedback("");
    }
  };

  const handleSubmitAnswer = async (qText: string) => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    setFeedback("");
    try {
      const res = await fetch("/api/practice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: qText, answer }),
      });
      const data = await res.json();
      if (data.reply) {
        setFeedback(data.reply);
      } else {
        setFeedback("Failed to analyze answer.");
      }
    } catch (e) {
      console.error(e);
      setFeedback("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCatData = categories.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-[#EA4C89]/10 rounded-full blur-[100px] pointer-events-none" />
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
          Ultimate <span className="text-[#EA4C89]">Question Bank</span>
        </h1>
        <p className="text-base text-white/50 max-w-xl font-medium leading-relaxed">
          Master real-world tech stack questions and behavioral prompts curated by industry experts.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-4 flex-wrap">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedQ(null);
              }}
              className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 border ${
                isActive
                  ? `${cat.bg} ${cat.border} ${cat.color} ${cat.shadow} scale-105`
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 px-6 py-4 rounded-3xl bg-white/[0.02] border border-white/5 shadow-elevated backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Collection</span>
          <span className="text-xl font-black text-white">{questions.length}</span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-[11px] font-bold text-white/60">Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          <span className="text-[11px] font-bold text-white/60">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-[11px] font-bold text-white/60">Hard</span>
        </div>
      </div>

      {/* Questions list */}
      <div className="grid grid-cols-1 gap-4">
        {questions.map((q, i) => {
          const diff = difficultyBadge(i);
          const isExpanded = expandedQ === i;
          return (
            <div
              key={i}
              className={`rounded-3xl bg-[#0f0f18]/80 border backdrop-blur-md overflow-hidden transition-all duration-300 ${
                isExpanded 
                  ? `border-white/20 shadow-elevated ${currentCatData?.shadow}` 
                  : `border-white/5 hover:border-white/10 hover:bg-white/[0.04]`
              }`}
            >
              <button
                onClick={() => setExpandedQ(isExpanded ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border font-black text-sm transition-colors ${
                    isExpanded ? currentCatData?.bg + " " + currentCatData?.border + " " + currentCatData?.color : "bg-white/5 border-white/10 text-white/40"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className={`flex-1 text-[15px] font-semibold leading-relaxed transition-colors ${isExpanded ? "text-white" : "text-white/80"}`}>
                    {q}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${diff.cls}`}>
                    {diff.label}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? "bg-white/10 rotate-180" : "hover:bg-white/10"}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isExpanded ? "white" : "white"} strokeOpacity="0.5" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </button>

              <div className={`transition-all duration-500 ease-in-out origin-top ${
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="px-6 md:px-8 pb-6 pt-2">
                  <div className={`ml-5 pl-8 border-l-2 py-2 space-y-5 ${currentCatData?.border}`}>
                    <div>
                      <h4 className="text-[11px] uppercase tracking-widest text-[#EA4C89] font-black mb-2 flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Pro Tip
                      </h4>
                      <p className="text-sm text-white/60 leading-relaxed font-medium max-w-3xl">
                        Use the <span className="text-white font-bold">STAR method</span> (Situation, Task, Action, Result) 
                        to structure your response. For technical concepts, explain the &apos;why&apos; before the &apos;how&apos; and highlight the tradeoffs 
                        you would consider in a real production environment.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        onClick={() => handlePractice(activeCategory)}
                        className="text-xs px-6 py-2.5 rounded-xl bg-[#EA4C89] text-white font-bold hover:bg-[#D63B75] transition-all shadow-glow hover:scale-105 active:scale-95"
                      >
                        Start Live Practice
                      </button>
                      <button 
                        onClick={() => handleOpenPractice(i)}
                        className="text-xs px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-bold hover:bg-white/10 hover:text-white transition-all"
                      >
                        {practicingQ === i ? "Close Chat" : "Practice Here"}
                      </button>
                    </div>

                    {/* Chat Practice Box */}
                    {practicingQ === i && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up">
                        <textarea
                          placeholder="Type your answer here..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="w-full h-24 p-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white text-sm focus:outline-none focus:border-[#EA4C89]/50 resize-none placeholder:text-white/20"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleSubmitAnswer(q)}
                            disabled={!answer.trim() || isSubmitting}
                            className="text-xs px-5 py-2 rounded-xl bg-white text-[#0a0a0f] font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
                          >
                            {isSubmitting ? "Evaluating..." : "Submit Answer"}
                          </button>
                        </div>
                        {feedback && (
                          <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                            <h5 className="text-[11px] uppercase tracking-widest text-[#EA4C89] font-bold mb-2">AI Feedback</h5>
                            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
