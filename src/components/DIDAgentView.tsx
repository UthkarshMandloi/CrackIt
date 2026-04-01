"use client";

interface DIDAgentViewProps {
  url: string;
}

export default function DIDAgentView({ url }: DIDAgentViewProps) {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden bg-black border border-slate-800 relative shadow-2xl group animate-fade-in group">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none z-10" />
      
      {/* 
          Iframe Wrapper with Precision Zoom & Crop
          We use a 160% size and negative offsets to focus on the center-top where the avatar is.
          This hides the headers and footers effectively.
      */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={url}
          className="absolute border-none pointer-events-auto"
          style={{
            width: '160%',
            height: '160%',
            top: '-25%',    // Removes D-ID Header
            left: '-30%',   // Centers horizontally
          }}
          allow="microphone; camera; autoplay; encrypted-media; clipboard-write; display-capture"
        />
      </div>

      {/* Floating Status Indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none z-20">
        <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-2 shadow-card">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest leading-none">Live Agent Ready</span>
        </div>
      </div>

      {/* Transparent Overlay to Catch Clicks if needed, or to soften edges */}
      <div className="absolute inset-0 border-[12px] border-slate-900/10 pointer-events-none z-10 rounded-[28px]" />
      
      {/* Instruction Tip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest z-20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Click &quot;Start Conversation&quot; if prompted inside the video
      </div>
    </div>
  );
}
