"use client";

import { useAuth } from "@/components/AuthContext";

interface ControlBarProps {
  isMuted: boolean;
  isListening: boolean;
  onToggleMute: () => void;
  onEndInterview: () => void;
}

export default function ControlBar({
  isMuted,
  isListening,
  onToggleMute,
  onEndInterview,
}: ControlBarProps) {
  return (
    <div className="w-full flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 p-2.5 bg-white rounded-[28px] border border-[#EA4C89]/10 shadow-elevated backdrop-blur-xl">
        {/* Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isMuted
              ? "bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100"
              : "bg-[#FDF0F5] text-[#EA4C89] hover:bg-[#EA4C89]/15 border-2 border-[#EA4C89]/10"
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* Camera (decorative) */}
        <button className="w-12 h-12 rounded-2xl bg-[#FDF0F5] text-[#EA4C89] border-2 border-[#EA4C89]/10 flex items-center justify-center hover:bg-[#EA4C89]/15 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </button>

        <div className="h-8 w-px bg-[#EA4C89]/10 mx-1" />

        {/* Status */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#FDF0F5] border border-[#EA4C89]/10 rounded-2xl min-w-[180px]">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-[#EA4C89] uppercase tracking-widest leading-none mb-1">
              MIC STATUS
            </span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-[11px] font-bold text-[#1A1A2E] leading-none">
                {isListening ? "Live Recording" : "Muted"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-[#EA4C89]/10 mx-1" />

        {/* End Interview */}
        <button
          onClick={onEndInterview}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
          End & Get Report
        </button>
      </div>
    </div>
  );
}
