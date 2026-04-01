"use client";

import React, { useState, useRef } from "react";

/* ═══════════════════════════════════════════
   PERSPECTIVE TILT COMPONENT (Interactive)
   ═══════════════════════════════════════════ */
export default function TiltCard({ children, className = "", as = "div", ...props }: { children: React.ReactNode; className?: string; as?: any; [key: string]: any }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const Component = as;

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out group ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        zIndex: isHovered ? 50 : 1,
      }}
      {...props}
    >
      {/* Dynamic Cursor Light Glow */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
          style={{
            background: `radial-gradient(circle at ${rotate.y * -5 + 50}% ${rotate.x * 5 + 30}%, rgba(234, 76, 137, 0.15), transparent 70%)`
          }}
        />
      )}
      {children}
    </Component>
  );
}
