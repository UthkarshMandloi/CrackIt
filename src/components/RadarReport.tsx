"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { InterviewReport } from "@/lib/types";

interface RadarReportProps {
  report: InterviewReport | null;
  reportError: boolean;
  onRestart: () => void;
  onRetry: () => void;
}

export default function RadarReport({
  report,
  reportError,
  onRestart,
  onRetry,
}: RadarReportProps) {
  const overall = report ? report.overallScore : 0;

  const radarData = report ? [
    { skill: "Technical", score: (report.technicalScore / 10), fullMark: 10 },
    { skill: "Confidence", score: (report.confidenceScore / 10), fullMark: 10 },
    { skill: "Soft Skills", score: (report.softSkillsScore / 10), fullMark: 10 },
    { skill: "Overall", score: (report.overallScore / 10), fullMark: 10 },
  ] : [
    { skill: "Technical", score: 0, fullMark: 10 },
    { skill: "Confidence", score: 0, fullMark: 10 },
    { skill: "Soft Skills", score: 0, fullMark: 10 },
    { skill: "Overall", score: 0, fullMark: 10 },
  ];

  return (
    <div id="radar-report" className="fixed inset-0 z-[100] bg-[#1A1A2E]/40 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-8 px-4 relative liquid-bg">
      {/* Liquid blobs behind report */}
      <div className="liquid-blob liquid-blob-pink w-[400px] h-[400px] top-[10%] left-[10%] opacity-40" />
      <div className="liquid-blob liquid-blob-purple w-[300px] h-[300px] bottom-[20%] right-[10%] opacity-30" />
      <div className="w-full max-w-4xl rounded-[40px] glass-strong p-10 shadow-elevated animate-fade-in-up relative my-4 z-10 aurora-border">
        {/* Close Button */}
        <button 
          onClick={onRestart}
          className="absolute top-8 right-8 w-10 h-10 rounded-xl glass hover:bg-[#EA4C89]/15 flex items-center justify-center transition-colors group"
        >
          <svg className="w-5 h-5 text-[#EA4C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-4 py-1.5 bg-[#EA4C89]/10 text-[#EA4C89] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#EA4C89]/10">Performance Review</span>
            </div>
            <h2 className="text-4xl font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
              Interview <span className="gradient-text">Summary</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right px-6 py-4 rounded-3xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] shadow-elevated">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Score</div>
              <div className="text-4xl font-black text-white leading-none tracking-tighter">{overall}%</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {!report && !reportError && (
          <div className="py-24 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-[#EA4C89]/10 border-t-[#EA4C89] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-3 h-3 rounded-full bg-[#EA4C89] animate-pulse" />
                </div>
             </div>
             <div className="text-center">
                <p className="text-sm font-bold text-[#1A1A2E] uppercase tracking-widest mb-2">Analyzing your speech...</p>
                <p className="text-[11px] text-slate-400 font-medium max-w-[220px] mx-auto leading-relaxed">This may take up to 30 seconds.</p>
             </div>
          </div>
        )}

        {/* Error State */}
        {reportError && (
          <div className="py-24 flex flex-col items-center justify-center gap-6 bg-rose-50/50 rounded-[32px] border border-rose-100 mb-12">
             <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                   <circle cx="12" cy="12" r="10" />
                   <line x1="12" y1="8" x2="12" y2="12" />
                   <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
             </div>
             <div className="text-center">
                <p className="text-sm font-bold text-rose-600 uppercase tracking-widest mb-2">Analysis Failed</p>
                <p className="text-[11px] text-rose-500/60 font-medium max-w-[240px] mx-auto leading-relaxed mb-6">Your transcript is safely stored. Please try again.</p>
                <button 
                  onClick={onRetry}
                  className="px-8 py-3 bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white rounded-2xl font-bold text-xs shadow-elevated hover:shadow-lg transition-all active:scale-95"
                >
                  Retry Analysis
                </button>
             </div>
          </div>
        )}

        {/* Report Content */}
        {report && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-10">
                {/* Improvement Roadmap */}
                <section className="bg-gradient-to-br from-[#FDF0F5] to-[#FFF5F8] p-8 rounded-[32px] border border-[#EA4C89]/10 shadow-soft relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-[#EA4C89]/5 blur-3xl" />
                  <h3 className="text-xs font-bold text-[#EA4C89] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EA4C89]" />
                    🎯 Actionable Roadmap
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {report.improvements.map((imp, i) => (
                      <div key={i} className="bg-white rounded-2xl p-5 border border-[#EA4C89]/8 shadow-soft">
                        <div className="w-8 h-8 rounded-xl bg-[#EA4C89] flex items-center justify-center text-[11px] font-bold text-white mb-3">{i+1}</div>
                        <p className="text-xs font-bold text-[#1A1A2E] leading-relaxed">{imp}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Diagnostic */}
                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Improvement Diagnostic</h3>
                    <div className="p-6 bg-[#FDF0F5] rounded-2xl border border-[#EA4C89]/8">
                      <p className="text-base text-[#1A1A2E] font-medium leading-relaxed italic">
                        &ldquo;{report.summary}&rdquo;
                      </p>
                    </div>
                </section>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-soft">
                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {report.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#1A1A2E] font-medium">
                          <div className="mt-1.5 w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="bg-white p-6 rounded-2xl border border-rose-100 shadow-soft">
                    <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      To Improve
                    </h3>
                    <ul className="space-y-3">
                      {report.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#1A1A2E] font-medium opacity-80">
                          <div className="mt-1.5 w-5 h-5 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="3">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </div>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Radar */}
                <section className="bg-white p-6 rounded-[28px] border border-[#EA4C89]/10 shadow-card">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Skill Radar</h3>
                  <div style={{ minWidth: 200, minHeight: 220 }}>
                    <ResponsiveContainer width="100%" height={220} minWidth={200}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#FDF0F5" strokeWidth={1.5} />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }} />
                        <PolarRadiusAxis domain={[0, 10]} axisLine={false} tick={false} />
                        <Radar name="Score" dataKey="score" stroke="#EA4C89" fill="#EA4C89" fillOpacity={0.1} strokeWidth={2.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Confidence */}
                <section className="bg-white p-6 rounded-[28px] border border-[#EA4C89]/10 shadow-card">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Confidence</h3>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                       <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                           <polyline points="22 4 12 14.01 9 11.01" />
                         </svg>
                       </div>
                     </div>
                     <span className="text-3xl font-black text-[#1A1A2E]">{report.confidenceScore}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-[#FDF0F5] rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-[#EA4C89] to-[#F472A8] rounded-full transition-all duration-1000"
                      style={{ width: `${report.confidenceScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                    {report.confidenceAnalysis}
                  </p>
                </section>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex justify-center pt-8 border-t border-[#EA4C89]/8">
               <button 
                 onClick={onRestart}
                 className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-elevated hover:scale-[1.02] active:scale-95 transition-all"
               >
                 Start New Session
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </button>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
