"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import LiveBadge from "./LiveBadge";

interface OrbProps {
  isSpeaking: boolean;
  isThinking: boolean;
}

function AnimatedOrb({ isSpeaking, isThinking }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial & { distort: number; speed: number }>(null);

  const baseColor = useMemo(() => new THREE.Color("#64FFDA"), []);
  const thinkColor = useMemo(() => new THREE.Color("#4FC3F7"), []);
  const speakColor = useMemo(() => new THREE.Color("#81FFE4"), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Rotation
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;

    // Scale breathing
    const breath = Math.sin(Date.now() * 0.002) * 0.05;
    const speakPulse = isSpeaking ? Math.sin(Date.now() * 0.01) * 0.08 : 0;
    const scale = 1 + breath + speakPulse;
    meshRef.current.scale.setScalar(scale);

    // Distortion
    if (materialRef.current) {
      const targetDistort = isSpeaking ? 0.6 : isThinking ? 0.4 : 0.25;
      materialRef.current.distort += (targetDistort - materialRef.current.distort) * delta * 3;

      const targetSpeed = isSpeaking ? 5 : isThinking ? 3 : 1.5;
      materialRef.current.speed += (targetSpeed - materialRef.current.speed) * delta * 2;
    }
  });

  const currentColor = isSpeaking ? speakColor : isThinking ? thinkColor : baseColor;

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 20]} />
        <MeshDistortMaterial
          ref={materialRef as React.RefObject<never>}
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.25}
          speed={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function InnerRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.5;
      ref.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.8, 0.01, 16, 100]} />
      <meshBasicMaterial color="#64FFDA" transparent opacity={0.3} />
    </mesh>
  );
}

function OuterRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z -= delta * 0.3;
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.005, 16, 100]} />
      <meshBasicMaterial color="#4FC3F7" transparent opacity={0.2} />
    </mesh>
  );
}

interface AvatarViewportProps {
  isSpeaking: boolean;
  isThinking: boolean;
}

export default function AvatarViewport({
  isSpeaking,
  isThinking,
}: AvatarViewportProps) {
  return (
    <div
      id="avatar-viewport"
      className="relative w-full h-full rounded-2xl overflow-hidden glow-border"
      style={{ minHeight: "400px" }}
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#64FFDA" />
          <pointLight
            position={[-5, -5, 5]}
            intensity={0.4}
            color="#4FC3F7"
          />
          <pointLight position={[0, 5, -5]} intensity={0.3} color="#E6F1FF" />

          <AnimatedOrb isSpeaking={isSpeaking} isThinking={isThinking} />
          <InnerRing />
          <OuterRing />

          <Sparkles
            count={50}
            scale={6}
            size={1.5}
            speed={0.4}
            color="#64FFDA"
            opacity={0.4}
          />
        </Canvas>
      </div>

      {/* Live badge overlay */}
      <div className="absolute top-4 left-4 z-10">
        <LiveBadge />
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isSpeaking
                ? "bg-electric-blue animate-pulse-live"
                : isThinking
                ? "bg-yellow-400 animate-pulse-live"
                : "bg-slate"
            }`}
          />
          <span className="text-slate">
            {isSpeaking
              ? "AI Speaking..."
              : isThinking
              ? "Analyzing..."
              : "Listening"}
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-electric-blue/20 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-electric-blue/20 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-electric-blue/20 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-electric-blue/20 rounded-br-2xl" />
    </div>
  );
}
