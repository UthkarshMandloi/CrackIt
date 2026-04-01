"use client";

import React, { useState, useEffect } from "react";

const LightningBolt = ({ style }: { style: React.CSSProperties }) => (
  <svg
    viewBox="0 0 100 200"
    className="absolute pointer-events-none z-50 transition-opacity duration-75"
    style={{
      width: "40px",
      height: "80px",
      ...style,
    }}
  >
    <path
      d="M50 0 L20 100 L50 90 L30 200 L80 80 L50 90 L70 0 Z"
      fill="#EA4C89"
      className="animate-pulse"
      style={{ filter: "drop-shadow(0 0 8px #EA4C89)" }}
    />
  </svg>
);

export default function CrackItLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isWrecked, setIsWrecked] = useState(true);

  // Handle subtle mouse interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculateShift = (index: number) => {
    const factor = index % 2 === 0 ? 1 : -1;
    const innerWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    const innerHeight = typeof window !== "undefined" ? window.innerHeight : 1000;
    const dx = (mousePos.x - innerWidth / 2) * 0.01 * factor;
    const dy = (mousePos.y - innerHeight / 2) * 0.01 * factor;
    return `translate(${dx}px, ${dy}px)`;
  };

  return (
    <div

      className={`${
        fullScreen ? "fixed inset-0 z-[9999]" : "relative w-full h-full min-h-[400px]"
      } flex items-center justify-center hero-dark overflow-hidden transition-all duration-700`}
    >
      {/* Background Lightning Flash */}
      <div className="absolute inset-0 animate-lightning pointer-events-none" />
      
      {/* Vortex Background */}
      <div className="aurora-vortex opacity-30">
        <div className="fountain-beam-l" />
        <div className="fountain-beam-r" />
      </div>

      {/* Screen Shake during "Thunder" transitions would be here but we use CSS animations */}
      <div className="relative z-10 flex flex-col items-center animate-thunder-shake">
        
        {/* The Animated Logo Image */}
        <div 
          className="relative perspective-1000 flex items-center justify-center p-8"
          onMouseEnter={() => setIsWrecked(false)}
          onMouseLeave={() => setIsWrecked(true)}
        >
          {/* The new logo image */}
          <img 
            src="/logo.png" 
            alt="Crack!t Loading" 
            className={`w-48 md:w-72 object-contain transition-all duration-700 ease-out z-10 
              ${isWrecked ? 'animate-float drop-shadow-[0_0_30px_rgba(234,76,137,0.6)]' : 'scale-110 drop-shadow-[0_0_50px_rgba(234,76,137,1)]'}`
            }
            style={{ 
              transform: calculateShift(1),
              filter: isWrecked ? "none" : "brightness(1.2)"
            }}
          />
          
          {/* Circular pulse behind the logo */}
          {isWrecked && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 bg-[#EA4C89] rounded-full blur-[60px] opacity-40 animate-pulse" />
          )}
        </div>

        {/* Subtext */}
        <div className="mt-8 overflow-hidden">
          <p className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] animate-fade-in-up">
            Optimizing your performance...
          </p>
        </div>
      </div>

      {/* Random Lightning Bolts */}
      <LightningBolt style={{ top: "10%", left: "15%", opacity: Math.random() > 0.7 ? 1 : 0 }} />
      <LightningBolt style={{ top: "20%", right: "10%", opacity: Math.random() > 0.8 ? 1 : 0, transform: "scale(1.5)" }} />
      <LightningBolt style={{ bottom: "15%", left: "40%", opacity: Math.random() > 0.9 ? 1 : 0, transform: "rotate(180deg)" }} />

      {/* Sparkles everywhere */}
      <div className="sparkle-field z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              "--dur": `${2 + Math.random() * 3}s`,
              "--opacity": 0.3 + Math.random() * 0.4,
              animationDelay: `${Math.random() * 2}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
