"use client";

import { Suspense } from "react";
import InterviewRoomView from "@/components/InterviewRoomView";

export default function InterviewRoomPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <Suspense fallback={<div className="p-8 text-white/50 text-center animate-pulse">Loading Interview Room...</div>}>
        <InterviewRoomView />
      </Suspense>
    </div>
  );
}
