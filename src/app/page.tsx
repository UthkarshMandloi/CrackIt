"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MarketingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFAFC] flex flex-col overflow-x-hidden">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#EA4C89] via-[#F472A8] to-[#6366F1] px-4 py-2.5 text-center text-xs font-bold text-white relative z-50">
        🚀 Activate your Interview CoPilot™ — Start getting real-time AI support today.
        <span className="ml-3 underline cursor-pointer hover:text-white/80 transition-colors">Learn More →</span>
      </div>

      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center shadow-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-[#1A1A2E] tracking-tight">Codze AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Home", "Career Prep", "Learn & Grow", "Blog", "Contact"].map((item, i) => (
            <Link key={item} href="#" className={`text-sm font-semibold transition-colors ${i === 0 ? 'text-[#EA4C89]' : 'text-slate-500 hover:text-[#EA4C89]'}`}>
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-4 w-4 animate-spin border-2 border-[#EA4C89] border-t-transparent rounded-full" />
          ) : user ? (
            <Link href="/dashboard" className="btn-primary flex items-center gap-2">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#EA4C89] transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="btn-primary shadow-soft">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-28 max-w-5xl mx-auto text-center animate-fade-in-up relative">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#EA4C89]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#6366F1]/5 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EA4C89]/10 border border-[#EA4C89]/15 text-[#EA4C89] mb-8">
          <span className="text-[10px] uppercase font-bold tracking-wider">✨ New</span>
          <span className="text-xs font-bold">Interview CoPilot™ 2.0 is now live!</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#1A1A2E] tracking-tight mb-8 leading-[1.05]">
          Ace Your <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#EA4C89] to-[#D63B75] mx-2 align-middle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span> Next Interview with <br/>
          <span className="gradient-text">AI-Powered</span> Practice
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Practice realistic interviews with AI, get instant feedback on your answers and boost your chances of landing your dream job.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white text-base font-bold shadow-elevated hover:shadow-lg hover:-translate-y-1 transition-all w-full sm:w-auto">
            Start Mock Interview
          </Link>
          <button className="px-10 py-4 rounded-2xl bg-white border-2 border-slate-200 text-[#1A1A2E] text-base font-bold hover:border-[#EA4C89]/30 hover:text-[#EA4C89] transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA4C89" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="#EA4C89" stroke="none" />
            </svg>
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center justify-center gap-6">
          <div className="flex -space-x-3">
            {[0,1,2].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EA4C89] to-[#F472A8] border-3 border-white flex items-center justify-center text-[10px] font-bold text-white">
                {['K', 'M', 'S'][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            {'★★★★★'.split('').map((s, i) => <span key={i} className="text-sm">{s}</span>)}
          </div>
          <span className="text-sm font-bold text-slate-600">18,921 reviews</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 px-8 border-y border-[#EA4C89]/8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">Simple Process. Powerful Results.</h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">Go from anxious to confident in just four simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: "Add Your Resume", desc: "Upload your resume to customize your AI interview profile", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
              { num: 2, title: "Pick Your Role", desc: "Select the target position so AI personalizes every question", icon: "M20 7h-9M14 17H5" },
              { num: 3, title: "Start Interviewing", desc: "Launch your AI-powered mock interview with real-time feedback", icon: "M23 7l-7 5 7 5V7z M1 5h15v14H1z" },
              { num: 4, title: "Get Your Report", desc: "Receive a detailed performance analysis with improvement tips", icon: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
            ].map((step) => (
              <div key={step.num} className="relative p-8 bg-[#FFFAFC] rounded-[28px] border border-[#EA4C89]/8 shadow-soft group hover:shadow-card hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center text-sm font-bold text-white mb-6 shadow-soft group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="text-[17px] font-bold text-[#1A1A2E] mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 px-8 text-center max-w-7xl mx-auto">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-10">Trusted by candidates at</p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-30">
          {["Google", "Microsoft", "Amazon", "Meta", "OpenAI", "NVIDIA"].map(c => (
            <span key={c} className="text-2xl font-extrabold text-[#1A1A2E]">{c}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-8 mb-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#EA4C89] to-[#D63B75] rounded-[32px] p-12 text-center shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <h2 className="text-3xl font-extrabold text-white mb-4 relative z-10">Unlock Your Dream Role — One Session Away</h2>
          <p className="text-base text-white/80 mb-8 max-w-lg mx-auto font-medium relative z-10">Join thousands of candidates who've transformed their interview skills with AI-powered practice.</p>
          <Link href="/login" className="inline-block px-10 py-4 bg-white text-[#EA4C89] rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative z-10">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EA4C89]/8 px-8 py-20 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span className="text-lg font-extrabold text-[#1A1A2E]">Codze AI</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8 font-medium">
                The world's most advanced AI interview preparation platform.
              </p>
              <div className="flex items-center gap-3">
                {["fb", "x", "ig", "yt"].map(s => (
                  <div key={s} className="w-9 h-9 rounded-xl bg-[#FDF0F5] flex items-center justify-center text-[#EA4C89] font-bold text-xs uppercase cursor-pointer hover:bg-[#EA4C89] hover:text-white transition-all">
                    {s}
                  </div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Company", links: ["About", "Contact Us", "Careers", "More"] },
              { title: "Products", links: ["Interview Copilot", "Mock Interview", "AI Resume", "More"] },
              { title: "Resources", links: ["Blog", "Interview Tips", "Salary Guide", "More"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-[#1A1A2E] mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l} className="text-[13px] text-slate-500 hover:text-[#EA4C89] transition-colors cursor-pointer font-medium">{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-[#EA4C89]/8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-slate-400 font-medium">© 2026 Codze AI. All rights reserved.</p>
            <div className="flex gap-8">
              {["Terms", "Privacy", "Security"].map(l => (
                <span key={l} className="text-[11px] text-slate-400 hover:text-[#EA4C89] cursor-pointer font-medium">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
