"use client";

import { useRef, useEffect } from "react";

interface WaveformVisualizerProps {
  frequencyData: Uint8Array;
  isActive: boolean;
}

export default function WaveformVisualizer({
  frequencyData,
  isActive,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 32;
      const gap = 2;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      const maxBarHeight = height - 4;

      for (let i = 0; i < barCount; i++) {
        let barHeight: number;

        if (isActive && frequencyData.length > 0) {
          const dataIndex = Math.floor(
            (i / barCount) * frequencyData.length
          );
          const value = frequencyData[dataIndex] || 0;
          barHeight = Math.max(2, (value / 255) * maxBarHeight);
        } else {
          // Idle animation
          const wave =
            Math.sin(Date.now() * 0.003 + i * 0.3) * 0.3 + 0.5;
          barHeight = Math.max(2, wave * 8);
        }

        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Gradient color based on height
        const intensity = barHeight / maxBarHeight;
        const r = Math.floor(100 + intensity * 0);
        const g = Math.floor(255 - intensity * 40);
        const b = Math.floor(218 - intensity * 20);
        const alpha = 0.4 + intensity * 0.6;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [frequencyData, isActive]);

  return (
    <div id="waveform-visualizer" className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-electric-blue animate-pulse-live" : "bg-slate/40"
          }`}
        />
        <span className="text-[10px] uppercase tracking-widest text-slate font-medium">
          Voice Activity
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: "48px" }}
      />
    </div>
  );
}
