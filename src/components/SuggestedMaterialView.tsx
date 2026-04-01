"use client";

import { useState } from "react";

const materialCategories = [
  { id: "all", label: "All" },
  { id: "dsa", label: "DSA" },
  { id: "system-design", label: "System Design" },
  { id: "behavioral", label: "Behavioral" },
  { id: "resume", label: "Resume" },
];

const materials = [
  {
    category: "dsa",
    title: "Blind 75 — Must-Do LeetCode Problems",
    desc: "The essential 75 problems covering arrays, trees, graphs, DP, and more. Curated by industry experts.",
    difficulty: "Mixed",
    timeEstimate: "30 hours",
    color: "from-blue-500/15 to-cyan-500/10",
    borderColor: "border-blue-500/15",
    icon: "🧮",
    tags: ["Arrays", "Trees", "Dynamic Programming"],
    progress: 0,
  },
  {
    category: "dsa",
    title: "NeetCode 150 — Extended Problem Set",
    desc: "Expanded list covering all common patterns. Perfect after completing Blind 75.",
    difficulty: "Mixed",
    timeEstimate: "60 hours",
    color: "from-green-500/15 to-emerald-500/10",
    borderColor: "border-green-500/15",
    icon: "📝",
    tags: ["Graphs", "Backtracking", "Sliding Window"],
    progress: 0,
  },
  {
    category: "system-design",
    title: "System Design Primer",
    desc: "Learn how to design large-scale distributed systems. Great for senior engineer interviews.",
    difficulty: "Advanced",
    timeEstimate: "20 hours",
    color: "from-purple-500/15 to-violet-500/10",
    borderColor: "border-purple-500/15",
    icon: "🏗️",
    tags: ["Scalability", "Load Balancing", "Databases"],
    progress: 0,
  },
  {
    category: "system-design",
    title: "Designing Data-Intensive Applications",
    desc: "Deep dive into distributed systems, replication, partitioning, and consistency models.",
    difficulty: "Advanced",
    timeEstimate: "40 hours",
    color: "from-indigo-500/15 to-blue-500/10",
    borderColor: "border-indigo-500/15",
    icon: "📚",
    tags: ["Replication", "Consensus", "Stream Processing"],
    progress: 0,
  },
  {
    category: "behavioral",
    title: "STAR Method Mastery",
    desc: "Framework for structuring your answers to behavioral questions. Practice with real examples.",
    difficulty: "Beginner",
    timeEstimate: "5 hours",
    color: "from-amber-500/15 to-yellow-500/10",
    borderColor: "border-amber-500/15",
    icon: "⭐",
    tags: ["Leadership", "Teamwork", "Conflict Resolution"],
    progress: 0,
  },
  {
    category: "behavioral",
    title: "Amazon Leadership Principles Deep Dive",
    desc: "Understand and prepare answers for all 16 Amazon Leadership Principles with examples.",
    difficulty: "Intermediate",
    timeEstimate: "10 hours",
    color: "from-orange-500/15 to-red-500/10",
    borderColor: "border-orange-500/15",
    icon: "🎯",
    tags: ["Ownership", "Bias for Action", "Invent & Simplify"],
    progress: 0,
  },
  {
    category: "resume",
    title: "Tech Resume That Gets Interviews",
    desc: "Craft a resume that passes ATS filters and impresses hiring managers at FAANG companies.",
    difficulty: "Beginner",
    timeEstimate: "3 hours",
    color: "from-rose-500/15 to-pink-500/10",
    borderColor: "border-rose-500/15",
    icon: "📄",
    tags: ["ATS Optimization", "Action Verbs", "Metrics"],
    progress: 0,
  },
  {
    category: "resume",
    title: "LinkedIn Profile Optimization",
    desc: "Optimize your LinkedIn profile to attract recruiters from top tech companies.",
    difficulty: "Beginner",
    timeEstimate: "2 hours",
    color: "from-sky-500/15 to-blue-500/10",
    borderColor: "border-sky-500/15",
    icon: "🔗",
    tags: ["SEO", "Networking", "Personal Brand"],
    progress: 0,
  },
];

export default function SuggestedMaterialView() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all" ? materials : materials.filter((m) => m.category === activeFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-lightest mb-1">Study Material</h1>
        <p className="text-sm text-slate">
          Curated resources to help you prepare for every aspect of the interview process.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {materialCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
              activeFilter === cat.id
                ? "bg-electric-blue/12 border border-electric-blue/25 text-electric-blue"
                : "bg-navy-light/40 border border-navy-mid/30 text-slate hover:text-light-slate"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Material cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mat, i) => (
          <div
            key={i}
            className={`group rounded-2xl bg-gradient-to-br ${mat.color} border ${mat.borderColor} p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/20 animate-fade-in-up cursor-pointer`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{mat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-lightest leading-snug">
                    {mat.title}
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-navy-light/60 border border-navy-mid/30 text-slate flex-shrink-0">
                    {mat.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-slate leading-relaxed mb-3">
                  {mat.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {mat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-navy-light/60 border border-navy-mid/30 text-slate/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate/60">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {mat.timeEstimate}
                  </span>
                  <button className="text-[10px] px-3 py-1.5 rounded-lg btn-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Learning →
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-3 h-1 rounded-full bg-navy-light/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-electric-blue/40 transition-all"
                    style={{ width: `${mat.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
