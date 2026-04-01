"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useInterview } from "@/hooks/useInterview";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import SelfView from "@/components/SelfView";
import ControlBar from "@/components/ControlBar";
import RadarReport from "@/components/RadarReport";
import { ROLE_OPTIONS, INTERVIEW_TYPES, LANGUAGE_OPTIONS, TONE_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import DIDAgentView from "@/components/DIDAgentView";

const D_ID_SHARE_URL = process.env.NEXT_PUBLIC_D_ID_URL || "https://studio.d-id.com/agents/share?id=v2_agt_PYjxDF3z&utm_source=copy&key=Y2tfWjlmeGdyeEI5OVQweEN4SXFVYU9N";

// ===== Setup Panel =====
function SetupPanel({ onStart }: { onStart: (role: string, type: string, lang: string, tone: string, resume: string) => void }) {
  const { user } = useAuth();
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get("role") || "fullstack";

    const [role, setRole] = useState(defaultRole);
  const [type, setType] = useState("mixed");
  const [lang, setLang] = useState("english");
  const [tone, setTone] = useState("professional");
  const [resume, setResume] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  useEffect(() => {
    const loadSavedContext = async () => {
      if (!user?.uid) {
        return;
      }

      try {
        setIsLoadingContext(true);
        const [resumeSnapshot, positionSnapshot] = await Promise.all([
          getDoc(doc(db, "users", user.uid, "profile", "resume")),
          getDoc(doc(db, "users", user.uid, "profile", "position")),
        ]);

        const resumeText = resumeSnapshot.exists()
          ? String((resumeSnapshot.data() as { extractedText?: string }).extractedText ?? "").trim()
          : "";
        const positionText = positionSnapshot.exists()
          ? String((positionSnapshot.data() as { extractedText?: string }).extractedText ?? "").trim()
          : "";

        const sections: string[] = [];
        if (resumeText) {
          sections.push(`Resume:\n${resumeText}`);
        }
        if (positionText) {
          sections.push(`Job Description:\n${positionText}`);
        }

        if (sections.length > 0) {
          setResume((prev) => (prev.trim().length > 0 ? prev : sections.join("\n\n")));
        }
      } catch (error) {
        console.error("Failed to load saved resume/position context:", error);
      } finally {
        setIsLoadingContext(false);
      }
    };

    loadSavedContext();
  }, [user?.uid]);

  const handleStart = () => {
    setIsStarting(true);
    const roleLabel = ROLE_OPTIONS.find((r) => r.value === role)?.label || role;
    onStart(roleLabel, type, lang, tone, resume);
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-pink-mesh py-12 liquid-bg relative">
      {/* Liquid background blobs */}
      <div className="liquid-blob liquid-blob-pink w-[400px] h-[400px] -top-20 -right-20" />
      <div className="liquid-blob liquid-blob-purple w-[300px] h-[300px] bottom-10 -left-10" />
      <div className="liquid-blob liquid-blob-peach w-[250px] h-[250px] top-[50%] left-[60%]" />
      
      <div className="w-full max-w-2xl p-4 animate-fade-in-up relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center shadow-glow animate-pulse-glow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">Interview Room</h2>
          <p className="text-sm text-slate-500 font-medium">Configure your session parameters below</p>
        </div>

        {/* Card — Glass */}
        <div className="glass-card rounded-[32px] p-8 space-y-8 aurora-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
            {/* Target Role */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-[#EA4C89] uppercase tracking-widest">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-semibold bg-[#FDF0F5] border border-[#EA4C89]/10 focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/10 outline-none transition-all text-[#1A1A2E]"
              >
                {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {/* Interview Type */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-[#EA4C89] uppercase tracking-widest">
                Interview Type
              </label>
              <div className="flex gap-2">
                {INTERVIEW_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`flex-1 px-3 py-3 rounded-2xl text-[11px] font-bold transition-all border-2 ${type === opt.value
                        ? "bg-[#EA4C89] border-[#EA4C89] text-white shadow-soft"
                        : "bg-white border-slate-100 text-slate-500 hover:border-[#EA4C89]/30 hover:text-[#EA4C89]"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-[#EA4C89] uppercase tracking-widest">
                Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-semibold bg-[#FDF0F5] border border-[#EA4C89]/10 focus:border-[#EA4C89] outline-none transition-all text-[#1A1A2E]"
              >
                {LANGUAGE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {/* Tone */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-[#EA4C89] uppercase tracking-widest">
                Answer Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-semibold bg-[#FDF0F5] border border-[#EA4C89]/10 focus:border-[#EA4C89] outline-none transition-all text-[#1A1A2E]"
              >
                {TONE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Resume */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-[11px] font-bold text-[#EA4C89] uppercase tracking-widest">
                Resume / Job Context
              </label>
              <span className="text-[10px] text-[#EA4C89]/60 font-bold italic">
                {isLoadingContext ? "Loading saved context..." : "AI personalizes analysis based on this"}
              </span>
            </div>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume or the job description here..."
              className="w-full h-32 p-4 rounded-2xl bg-[#FDF0F5] border border-[#EA4C89]/10 focus:border-[#EA4C89] outline-none transition-all text-sm font-medium text-[#1A1A2E] resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={isStarting}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all shrink-0 ${isStarting
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white hover:shadow-elevated hover:-translate-y-1 active:translate-y-0"
              }`}
          >
            {isStarting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Launching Interview Room...
              </span>
            ) : (
              "Begin Mock Interview →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Session Timer =====
function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return <span>{mins}:{secs}</span>;
}

// ===== Main Interview Room =====
export default function InterviewRoomView() {
  const {
    state,
    startInterview,
    toggleMute,
    endInterview,
    retryFinalReport,
    resetInterview
  } = useInterview();
  const speech = useSpeechToText();
  const audio = useAudioAnalyser();

  const { start: startSpeech, stop: stopSpeech, isSupported: speechSupported } = speech;
  const { start: startAudio, stop: stopAudio } = audio;

  useEffect(() => {
    if (state.status === "in-progress" && !state.isMuted && speechSupported) {
      startSpeech();
      startAudio();
    } else {
      stopSpeech();
      stopAudio();
    }
  }, [state.status, state.isMuted, startSpeech, stopSpeech, startAudio, stopAudio, speechSupported]);

  const handleStart = useCallback((role: string, type: string, lang: string, tone: string, resume: string) => {
    startInterview(role, type, lang, tone, resume);
  }, [startInterview]);

  const handleEnd = useCallback(() => {
    const fullTranscript = speech.getFullTranscript();
    speech.stop();
    audio.stop();
    endInterview(fullTranscript);
  }, [speech, audio, endInterview]);

  // Auto-scroll transcript
  const transcriptBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [speech.transcript, speech.interimTranscript]);

  if (state.status === "idle") {
    return <div className="h-full"><SetupPanel onStart={handleStart} /></div>;
  }

  if (state.status === "complete") {
    return (
      <div className="p-8">
        <RadarReport
          report={state.report}
          reportError={state.reportError}
          onRestart={resetInterview}
          onRetry={retryFinalReport}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#FFFAFC] liquid-bg relative">
      {/* Subtle background blobs for depth */}
      <div className="liquid-blob liquid-blob-pink w-[300px] h-[300px] top-0 right-0 opacity-40" />
      <div className="liquid-blob liquid-blob-purple w-[250px] h-[250px] bottom-0 left-0 opacity-30" />
      
      {/* ─── Top Header Bar — Glass ─── */}
      <div className="flex items-center justify-between px-6 py-3 glass-strong border-b border-[#EA4C89]/8 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-9 h-9 rounded-xl hover:bg-[#FDF0F5] flex items-center justify-center transition-colors group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" className="group-hover:stroke-[#EA4C89] transition-colors">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1A2E] leading-none">Interview Room</h3>
              <span className="text-[10px] text-slate-500 font-semibold">{state.targetRole}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Session Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-pink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA4C89" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-xs font-bold text-[#EA4C89] tabular-nums"><SessionTimer /></span>
          </div>
          {/* Live Recording */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EA4C89] text-white shadow-glow">
            <div className="h-2 w-2 rounded-full bg-white animate-recording" />
            <span className="text-[10px] font-bold tracking-wide">Live Recording</span>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex gap-5 p-5 min-h-0 overflow-hidden">
        {/* LEFT: AI Interviewer (Larger) */}
        <div className="flex-1 min-h-0 flex flex-col gap-4">
          <div className="flex-1 glass-card rounded-[28px] relative overflow-hidden group">
            <DIDAgentView url={D_ID_SHARE_URL} />
            {/* Interviewer Label */}
            <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-2 rounded-2xl glass">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#1A1A2E] block leading-none">AI Interviewer</span>
                <span className="text-[8px] text-[#EA4C89] font-semibold">Live Agent</span>
              </div>
            </div>
            {/* Audio indicator */}
            <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-2 rounded-2xl glass">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA4C89" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT: Self-view + Transcript */}
        <div className="w-[400px] flex-shrink-0 min-h-0 flex flex-col gap-4">
          {/* Self View Camera */}
          <div className="h-[45%] glass-card rounded-[28px] relative overflow-hidden group">
            <SelfView />
            <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-2 rounded-2xl glass">
              <div className="w-7 h-7 rounded-lg bg-[#EA4C89]/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EA4C89" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-[#1A1A2E]">You</span>
            </div>
          </div>

          {/* Audio Levels */}
          <div className="h-16 glass rounded-2xl px-5 flex items-center gap-4">
            <div className={`w-2.5 h-2.5 rounded-full ${audio.isActive ? 'bg-[#EA4C89] animate-pulse' : 'bg-slate-300'}`} />
            <div className="flex-1 h-5 bg-[#FDF0F5] rounded-full overflow-hidden flex gap-px p-0.5">
              {(audio.isActive ? Array.from(audio.frequencyData.slice(0, 48)) : Array.from({ length: 48 }).map(() => 0)).map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, (Number(val) / 255) * 100)}%`,
                    background: Number(val) > 100 ? '#EA4C89' : '#F472A8',
                    opacity: Math.max(0.3, Number(val) / 255),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Live Transcript */}
          <div className="flex-1 glass-dark rounded-[28px] p-5 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-[#EA4C89]/10 to-[#6366F1]/5 opacity-60" />
            <div className="relative z-10 flex flex-col gap-3 flex-1 min-h-0">
              {/* Header */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EA4C89] animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Live Transcript</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#EA4C89]/15 border border-[#EA4C89]/20 text-[8px] font-bold text-[#EA4C89]">
                  {speech.isListening ? `LIVE · ${speech.restartCount} cycles` : "RESTARTING..."}
                </div>
              </div>

              {/* Transcript Text */}
              <div ref={transcriptBoxRef} className="flex-1 overflow-y-auto custom-scrollbar bg-black/30 rounded-2xl p-4 border border-white/5">
                <p className="text-[12px] leading-relaxed font-medium">
                  {speech.transcript && (
                    <span className="text-white/90">{speech.transcript}</span>
                  )}
                  {speech.interimTranscript && (
                    <span className="text-[#EA4C89]/80 italic"> {speech.interimTranscript}</span>
                  )}
                  {!speech.transcript && !speech.interimTranscript && (
                    <span className="text-slate-500 italic">Speak freely — your words appear here in real-time...</span>
                  )}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-2.5 py-1 bg-[#EA4C89] text-white rounded-lg text-[9px] font-bold uppercase tracking-tight">Speech → Text</div>
                <div className="text-[9px] font-semibold text-slate-500">Auto-saved on session end</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Control Bar ─── */}
      <div className="px-6 pb-5 shrink-0 z-20">
        <ControlBar
          isMuted={state.isMuted}
          isListening={speech.isListening}
          onToggleMute={toggleMute}
          onEndInterview={handleEnd}
        />
      </div>
    </div>
  );
}
