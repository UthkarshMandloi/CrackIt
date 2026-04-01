"use client";

import { useAuth } from "@/components/AuthContext";

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

const interviewCards = [
  {
    id: "general",
    title: "General Interview",
    desc: "Works seamlessly across every major platform",
    bgColor: "bg-[#FDF0F5]",
    accentColor: "#EA4C89",
    tags: ["Google Meet", "Zoom", "Microsoft Teams"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA4C89" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    navigateTo: "interview-room",
  },
  {
    id: "mock",
    title: "Mock Interview",
    desc: "Practice makes it perfect",
    bgColor: "bg-[#F0FDF4]",
    accentColor: "#10B981",
    tags: ["Case Study", "Behavioral", "Technical"],
    stat: "1,114 users practicing now",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    navigateTo: "interview-room",
  },
  {
    id: "coding",
    title: "Coding Interview",
    desc: "Solve coding challenges with real-time AI feedback",
    bgColor: "bg-[#F5F3FF]",
    accentColor: "#6366F1",
    tags: ["LeetCode", "HackerRank", "CodeSignal"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    navigateTo: "mock-questions",
  },
  {
    id: "phone",
    title: "Phone Interview",
    desc: "AI-powered suggestions during live phone calls",
    bgColor: "bg-[#EFF6FF]",
    accentColor: "#3B82F6",
    tags: ["Zoom Phone", "Direct Call", "WhatsApp"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    navigateTo: "interview-room",
  },
];

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#EA4C89] via-[#F472A8] to-[#6366F1] p-[1.5px]">
        <div className="flex items-center justify-between px-6 py-3 bg-white/95 rounded-[22px] backdrop-blur-sm">
          <p className="text-xs font-bold text-[#1A1A2E]">
            🚀 Activate your Interview CoPilot™ and start getting real-time help during interviews.
          </p>
          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white text-[10px] font-bold shadow-soft flex items-center gap-2 hover:shadow-card transition-all">
            Activate CoPilot
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1">
          Welcome back, <span className="gradient-text">{user?.displayName?.split(" ")[0] || "there"}</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Ready to ace your next interview? Pick a practice mode below.
        </p>
      </div>

      {/* Getting Started */}
      <section>
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#1A1A2E]">Getting Started</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">Get the most out of Codze AI</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { num: 1, title: "Add your resume", desc: "Upload your resume and cover letter to customize your AI" },
            { num: 2, title: "Add your position", desc: "Upload job description so AI can provide customized answers" },
            { num: 3, title: "Launch an interview", desc: "Launch your Interview CoPilot™ for real-time support" },
            { num: 4, title: "View interview report", desc: "Review your interview notes and past performance" },
          ].map((step, idx) => (
            <div key={idx} className="flex-1 min-w-[240px] p-6 bg-white rounded-[24px] border border-[#EA4C89]/8 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center text-[10px] font-bold text-white">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-[#1A1A2E]">{step.title}</h3>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-700">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {interviewCards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.navigateTo)}
            className="group text-left rounded-[28px] bg-white border border-[#EA4C89]/8 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-card shadow-soft active:scale-[0.98] animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Icon Area */}
            <div className={`w-full aspect-[4/3] rounded-2xl ${card.bgColor} mb-6 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent to-black/5" />
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-card flex items-center justify-center group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
            </div>

            <h3 className="text-[17px] font-bold text-[#1A1A2E] mb-1">{card.title}</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4 min-h-[36px] font-medium">
              {card.desc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2 mt-auto">
              {card.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-[#FDF0F5] border border-[#EA4C89]/8 text-[#EA4C89] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stat */}
            {card.stat && (
              <div className="flex items-center gap-2 px-3 py-1.5 mt-4 rounded-full bg-[#FDF0F5] border border-[#EA4C89]/10">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EA4C89] animate-pulse-live" />
                <span className="text-[10px] font-bold text-[#EA4C89]">{card.stat}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
