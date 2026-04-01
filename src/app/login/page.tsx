"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import CrackItLoader from "@/components/CrackItLoader";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) {
    return <CrackItLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center hero-dark relative p-4">
      {/* Fountain vortex background */}
      <div className="aurora-vortex">
        <div className="fountain-beam-l" />
        <div className="fountain-beam-r" />
        <div className="fountain-beam-ol" />
        <div className="fountain-beam-or" />
        <div className="fountain-ring" />
        <div className="fountain-ring-2" />
      </div>
      <div className="fountain-pool" />

      {/* Sparkles */}
      <div className="sparkle-field">
        {[
          { top: "10%", left: "20%", dur: "3s", delay: "0s", opacity: 0.4 },
          { top: "30%", left: "80%", dur: "3.5s", delay: "0.5s", opacity: 0.35 },
          { top: "60%", left: "15%", dur: "4s", delay: "1s", opacity: 0.5 },
          { top: "80%", left: "70%", dur: "2.8s", delay: "1.5s", opacity: 0.4 },
          { top: "45%", left: "50%", dur: "3.2s", delay: "0.8s", opacity: 0.45 },
        ].map((s, i) => (
          <div
            key={i}
            className="sparkle"
            style={{ top: s.top, left: s.left, "--dur": s.dur, "--opacity": s.opacity, animationDelay: s.delay } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center shadow-glow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CRACK!T AI</h1>
        </div>

        {/* Login Card — Dark glass */}
        <div className="rounded-3xl p-8 border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <h2 className="text-xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-white/40 text-center mb-8 font-medium">
            Sign in to access your interview platform.
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 transition-all font-semibold text-white group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 pt-6 border-t border-white/5 italic text-[11px] text-white/20 text-center leading-relaxed">
            By signing in, you agree to our Terms of Service & Privacy Policy.
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/30 font-medium">
          New here? <span className="text-[#EA4C89] font-bold cursor-pointer hover:underline">Create an account</span>
        </p>
      </div>
    </div>
  );
}
