"use client";

import { useEffect, useRef } from "react";
import WaveformVisualizer from "./WaveformVisualizer";

import { Message } from "@/lib/types";

interface TranscriptionSidebarProps {
  messages: Message[];
  currentQuestion: string;
  questionIndex: number;
  totalQuestions: number;
  frequencyData: Uint8Array;
  isAudioActive: boolean;
  interimTranscript: string;
}

export default function TranscriptionSidebar({
  messages,
  currentQuestion,
  questionIndex,
  totalQuestions,
  frequencyData,
  isAudioActive,
  interimTranscript,
}: TranscriptionSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of transcripts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript]);

  return (
    <div className="h-full flex flex-col bg-white rounded-[32px] border border-slate-200 shadow-soft overflow-hidden group">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
             Transcript
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </h2>
          <span className="text-[10px] font-bold text-primary/60 tracking-wider">
            Q{questionIndex + 1}/{totalQuestions}
          </span>
        </div>
        
        {/* Current Question Bubble (Styled like screenshot) */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm relative group/q">
          <p className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mb-1">CURRENT QUESTION</p>
          <p className="text-[13px] font-bold text-slate-800 leading-relaxed italic">
            "{currentQuestion}"
          </p>
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-primary rounded-full opacity-40" />
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth min-h-0"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            } animate-fade-in`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                msg.role === "ai" ? "text-primary" : "text-slate-400"
              }`}>
                {msg.role === "ai" ? "AI COPILOT" : msg.role}
              </span>
              <span className="text-[8px] text-slate-300 font-medium">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div
              className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium transition-all ${
                msg.role === "user"
                  ? "bg-slate-50 border border-slate-100 text-slate-700 shadow-soft"
                  : msg.role === "ai"
                  ? "bg-white border border-slate-200 text-slate-800 shadow-soft"
                  : "bg-slate-50 text-slate-400 italic text-[11px] border border-dashed border-slate-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Interim (Live) Transcript */}
        {interimTranscript && (
          <div className="flex flex-col items-end animate-pulse">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">
              LISTENING...
            </span>
            <div className="max-w-[90%] p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-[13px] leading-relaxed font-bold italic shadow-soft">
              {interimTranscript}
            </div>
          </div>
        )}
      </div>

      {/* Audio Visualizer Footer (Styled like screenshot) */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isAudioActive ? 'bg-primary' : 'bg-slate-300'} animate-pulse-live`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              VOICE ACTIVITY
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-300 bg-white border border-slate-200 px-2 py-0.5 rounded-md">64kbps / 48kHz</span>
        </div>
        <div className="h-10">
          <WaveformVisualizer 
            frequencyData={frequencyData} 
            isActive={isAudioActive} 
          />
        </div>
      </div>
    </div>
  );
}
