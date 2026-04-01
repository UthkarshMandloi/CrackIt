"use client";

import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

import TiltCard from "@/components/TiltCard";

/* Sparkle positions */
const SPARKLES = [
  { top: "8%", left: "12%", dur: "2.8s", delay: "0s", opacity: 0.5 },
  { top: "15%", left: "78%", dur: "3.5s", delay: "0.5s", opacity: 0.4 },
  { top: "22%", left: "45%", dur: "4s", delay: "1.2s", opacity: 0.6 },
  { top: "35%", left: "88%", dur: "3s", delay: "0.8s", opacity: 0.35 },
  { top: "42%", left: "22%", dur: "3.8s", delay: "1.5s", opacity: 0.45 },
  { top: "55%", left: "65%", dur: "2.5s", delay: "0.3s", opacity: 0.55 },
  { top: "60%", left: "10%", dur: "4.2s", delay: "2s", opacity: 0.3 },
  { top: "70%", left: "50%", dur: "3.2s", delay: "0.7s", opacity: 0.4 },
  { top: "75%", left: "85%", dur: "2.9s", delay: "1.8s", opacity: 0.5 },
  { top: "18%", left: "32%", dur: "3.6s", delay: "1s", opacity: 0.45 },
  { top: "48%", left: "72%", dur: "4.5s", delay: "0.2s", opacity: 0.35 },
  { top: "82%", left: "38%", dur: "3.1s", delay: "1.4s", opacity: 0.4 },
];

export default function MarketingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#0A0A0F] scroll-smooth">

      {/* ═══════════════════════════════════════════
          DARK HERO SECTION — Orbitly Style
          ═══════════════════════════════════════════ */}
      <section className="hero-dark min-h-[100vh] flex flex-col relative">
        {/* WATER FOUNTAIN VORTEX */}
        <div className="aurora-vortex">
          <div className="fountain-beam-l" />
          <div className="fountain-beam-r" />
          <div className="fountain-beam-ol" />
          <div className="fountain-beam-or" />
          <div className="fountain-ring" />
          <div className="fountain-ring-2" />
          <div className="fountain-particles">
            {[30, 50, 70, 20, 80, 40, 60, 45].map((l, i) => (
              <div 
                key={i} 
                className="fountain-particle" 
                style={{ left: `${l}%`, "--rise-dur": `${2.5 + i*0.1}s`, "--rise-delay": `${i*0.2}s` } as React.CSSProperties} 
              />
            ))}
          </div>
        </div>
        <div className="fountain-pool" />

        <div className="sparkle-field">
          {SPARKLES.map((s, i) => (
            <div key={i} className="sparkle" style={{ top: s.top, left: s.left, "--dur": s.dur, "--opacity": s.opacity, animationDelay: s.delay } as React.CSSProperties} />
          ))}
        </div>

        {/* ─── Navbar ─── */}
        <header className="px-6 md:px-10 py-5 flex items-center justify-between max-w-7xl mx-auto w-full relative z-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="Crack!t" className="h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(234,76,137,0.5)]" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Crack!t</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {["Features", "Pricing"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-white/50 hover:text-white transition-all uppercase tracking-widest">
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="px-6 py-2.5 rounded-xl bg-white text-[#0a0a0f] text-sm font-bold hover:bg-white/90 transition-all shadow-glow">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="px-6 py-2.5 rounded-xl border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-all">
                Login
              </Link>
            )}
          </div>
        </header>

        {/* ─── Hero Content ─── */}
        <div className="flex-1 flex flex-col items-center text-center justify-center px-6 md:px-10 max-w-7xl mx-auto w-full relative z-10 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#EA4C89]/30 bg-[#EA4C89]/10 mb-8 animate-fade-in-up">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#EA4C89]">Elevate your interview game</span>
          </div>

          <h1 className="text-5xl md:text-[84px] font-black text-white tracking-tighter leading-none mb-8 max-w-4xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Crack your <br className="hidden md:block" /> <span className="text-[#EA4C89]">dream career</span> now
          </h1>

          <p className="text-base md:text-xl text-white/40 mb-12 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            The all-in-one AI platform to practice, analyze, and ace every interview with real-time feedback and smart coaching.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/login" className="px-10 py-4 rounded-2xl bg-[#EA4C89] text-white text-base font-bold hover:bg-[#D63B75] transition-all shadow-glow hover:scale-105 active:scale-95">
              Start Practicing Free
            </Link>
            <Link href="#features" className="text-sm font-bold text-white/60 hover:text-white transition-all flex items-center gap-2">
              View All Features
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <TiltCard className="w-full mt-24 max-w-5xl">
            <div className="w-full rounded-2xl border border-white/10 bg-[#0f0f18]/80 backdrop-blur-2xl overflow-hidden shadow-elevated">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EA4C89] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polygon points="12 2 2 7 12 12 22 7 12 2" /></svg></div>
                  <span className="text-xs font-bold text-white/80">Crack!t Dashboard</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="aspect-video bg-[#050508] relative overflow-hidden group/mockup">
                {/* Live Interview Session Background (Scaled & Shifted up to hide inner mockup frame) */}
                <img 
                  src="/images/interview.png" 
                  className="absolute inset-x-0 -top-[15%] w-full h-[120%] object-cover object-top opacity-[0.85] group-hover/mockup:scale-105 transition-transform duration-700 z-0" 
                  style={{ filter: "brightness(0.9) contrast(1.15)" }}
                  alt="Live Session"
                />
                
                {/* Overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/10 z-0" />

                {/* Stats Grid Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {[
                      { l: "Confidence", v: "92%", c: "#EA4C89" },
                      { l: "Tone", v: "Positive", c: "#EA4C89" },
                      { l: "Speed", v: "150 wpm", c: "#EA4C89" },
                      { l: "Score", v: "8.5", c: "#EA4C89" }
                    ].map((s) => (
                      <div key={s.l} className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-glow">
                        <p className="text-[9px] font-bold text-white/40 uppercase mb-2">{s.l}</p>
                        <p className="text-xl font-black text-white leading-none">{s.v}</p>
                        <div className="h-1 w-full bg-white/5 mt-3 rounded-full overflow-hidden">
                          <div className="h-full rounded-full animate-grow-x" style={{ width: "75%", background: s.c }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md animate-recording">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Live Analysis</span>
                </div>

                <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#EA4C89]/20 rounded-full blur-[100px] pointer-events-none" />
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Trusted By Section Removed */}

      {/* ─── FEATURES — Dark Modern ─── */}
      <section id="features" className="py-32 px-8 bg-[#0A0A0F] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              Aced Your <span className="text-[#EA4C89]">Workflow</span>
            </h2>
            <p className="text-lg text-white/40 max-w-md font-medium"> everything you need to prepare, practice, and perfect your technique in one integrated dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Mock Interviews", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, color: "#EA4C89",
                desc: "Realistic AI-driven practice sessions tailored to your specific job roles."
              },
              {
                title: "Real-time Support", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>, color: "#6366F1",
                desc: "AI coach that listens and guides you through complex questions live."
              },
              {
                title: "Smart Analytics", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, color: "#10B981",
                desc: "Deep analysis of your confidence, tone, and technical accuracy."
              }
            ].map((feat) => (
              <TiltCard key={feat.title}>
                <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all h-full glass-tilt overflow-hidden">
                  <div className="mb-8 text-[#EA4C89] group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(234,76,137,0.5)] transition-all">{feat.icon}</div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{feat.title}</h3>
                  <p className="text-base text-white/40 leading-relaxed font-medium">{feat.desc}</p>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl" style={{ color: feat.color }} />
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              { title: "Personalized Reports", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>, desc: "Actionable feedback to improve your core weak points after every session." },
              { title: "Global Benchmarking", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>, desc: "Compare your performance against thousands of candidates worldwide." }
            ].map((feat) => (
              <TiltCard key={feat.title}>
                <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col md:flex-row items-center gap-8 glass-tilt">
                   <div className="text-[#EA4C89] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{feat.icon}</div>
                   <div>
                     <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{feat.title}</h3>

                     <p className="text-base text-white/40 font-medium">{feat.desc}</p>
                   </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW SECTION — Dark Glass ─── */}
      <section className="py-32 px-8 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto border border-white/10 rounded-[40px] p-12 md:p-20 relative overflow-hidden bg-white/[0.01]">
          <div className="aurora-vortex opacity-10" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">Simplify your <br /> <span className="text-[#EA4C89]">Preparation</span></h2>
               <div className="space-y-6">
                 {[
                   { t: "AI Resume Analysis", d: "Scan and score your resume against live JDs." },
                   { t: "Custom Question Bank", d: "Curated lists for specialized tech & non-tech roles." },
                   { t: "Team Practice Mode", d: "Collaborate and peer-review with friends online." }
                 ].map((i) => (
                   <div key={i.t} className="flex gap-4 p-5 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
                     <div className="w-6 h-6 rounded-full bg-[#EA4C89] flex items-center justify-center flex-shrink-0 mt-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg></div>
                     <div>
                       <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wide">{i.t}</h4>
                       <p className="text-xs text-white/40 font-medium">{i.d}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div className="mockup-glow">
               <div className="rounded-3xl border border-white/10 bg-[#050508] p-1 aspect-square overflow-hidden shadow-elevated">
                 <div className="w-full h-full relative">
                    <img 
                      src="/images/factory.jpg" 
                      className="w-full h-full object-cover rounded-2xl opacity-80" 
                      alt="AI Preparation Engine"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING — Dark 3000 / 2500 ─── */}
      <section id="pricing" className="py-32 px-8 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <p className="text-sm font-bold text-[#EA4C89] uppercase tracking-widest mb-4">Invest in your future</p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Choose Your Plan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { n: "Standard", p: "Free", d: "Basic mock sessions", f: ["3 simulations", "Public feedback", "Community docs"], h: false },
            { n: "Professional", p: "₹2500", d: "Advanced job prep", f: ["Unlimited sim", "Private AI coach", "Detailed reports", "Priority"], h: true },
            { n: "enterprise", p: "₹3000", d: "Complete mastery", f: ["All features", "Exclusive bank", "1:1 Expert", "Team dashboard"], h: false },
          ].map((plan) => (
            <TiltCard key={plan.n} className="flex flex-col h-full">
              <div className={`p-10 rounded-[32px] border h-full flex flex-col ${plan.h ? "border-[#EA4C89] bg-[#EA4C89]/[0.05] shadow-glow" : "border-white/10 bg-white/[0.02]"}`}>
                <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">{plan.n}</span>
                <div className="mb-8">
                   <h3 className="text-5xl font-black text-white tracking-tight">{plan.p}</h3>
                   <span className="text-xs text-white/30 font-bold uppercase mt-2 block">one time payment</span>
                </div>
                <ul className="space-y-4 mb-10 text-left">
                  {plan.f.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-white/60">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">✔</div>
                       {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl text-sm font-bold mt-auto transition-all ${plan.h ? "bg-[#EA4C89] text-white shadow-glow hover:scale-105" : "bg-white/5 text-white hover:bg-white/10"}`}>Select {plan.n}</button>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ─── FOOTER — Dark ─── */}
      <footer className="py-24 px-8 bg-[#050508] border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-3 mb-8">
                <img src="/logo.png" alt="Crack!t" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(234,76,137,0.5)]" />
             </div>
             <p className="text-sm text-white/30 font-medium leading-relaxed">Built for the next generation of professionals to ace every interview with confidence.</p>
          </div>
          
          {["Platform", "Resources", "Support"].map(c => (
             <div key={c}>
               <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">{c}</h4>
               <ul className="space-y-4">
                 {["About", "Features", "Pricing", "Privacy"].map(l => (
                   <li key={l}><Link href="#" className="text-sm font-bold text-white/40 hover:text-[#EA4C89] transition-colors">{l}</Link></li>
                 ))}
               </ul>
             </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
           <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">© 2026 Crack!t Technologies INC.</p>
           <div className="flex gap-10">
              <span className="text-[11px] font-bold text-white/20 hover:text-white cursor-pointer uppercase tracking-widest transition-all">Twitter</span>
              <span className="text-[11px] font-bold text-white/20 hover:text-white cursor-pointer uppercase tracking-widest transition-all">LinkedIn</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
