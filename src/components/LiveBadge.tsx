"use client";

export default function LiveBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass" id="live-badge">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-pulse-live" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <span className="text-xs font-semibold tracking-widest text-red-400 uppercase">
        Live
      </span>
    </div>
  );
}
