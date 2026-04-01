"use client";

import { useEffect, useRef, useState } from "react";

export default function SelfView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false, // Audio managed by useSpeechToText separately
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
        }
      } catch (err) {
        console.error("SelfView: Error accessing camera:", err);
        setError("Camera access denied. Please enable your webcam.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-soft group">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4 bg-slate-50">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2l20 20M15 15l1 1h4V8h-7" />
                <path d="M9.5 4.5L11 4h5v2m-6.5 4.5l-4-4V14L10 14h6" />
             </svg>
          </div>
          <p className="text-xs font-bold text-slate-500">{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror transform scale-x-[-1]"
          />
          
          {/* Status Indicators */}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
            <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
               <span className="text-[9px] font-bold text-white uppercase tracking-wider">Candidate View</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-3">
             <div className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 text-white text-[8px] font-black uppercase tracking-widest leading-none">
                Local-HS 1080p
             </div>
          </div>

          {/* Decorative Framing */}
          <div className="absolute inset-0 border-[12px] border-white/5 pointer-events-none rounded-[20px]" />
        </>
      )}
    </div>
  );
}
