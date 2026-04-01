"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useAudioAnalyser() {
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(64)
  );
  const [isActive, setIsActive] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsActive(true);

      const updateData = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        setFrequencyData(data);
        animFrameRef.current = requestAnimationFrame(updateData);
      };
      updateData();
    } catch (err) {
      console.error("Audio analyser failed:", err);
    }
  }, []);

  const stop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setIsActive(false);
    setFrequencyData(new Uint8Array(64));
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { frequencyData, isActive, start, stop };
}
