"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import TiltCard from "@/components/TiltCard";

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

type SetupStepId = "resume" | "position" | "launch" | "report";

interface SetupProgress {
  resume: boolean;
  position: boolean;
  launch: boolean;
  report: boolean;
}

const defaultSetupProgress: SetupProgress = {
  resume: false,
  position: false,
  launch: false,
  report: false,
};

const interviewCards = [
  {
    id: "general",
    title: "General Interview",
    desc: "Works seamlessly across every major platform",
    bgColor: "bg-[#FDF0F5]",
    accentColor: "#EA4C89",
    tags: ["Google Meet", "Zoom", "Microsoft Teams"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA4C89" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    navigateTo: "interview-room",
  },
  {
    id: "mock",
    title: "Mock Interview",
    desc: "Practice makes it perfect",
    bgColor: "bg-[#F0FDF4]",
    accentColor: "#10B981",
    tags: ["Case Study", "Behavioral", "Technical"],
    stat: "1,114 users practicing now",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    navigateTo: "interview-room",
  },
  {
    id: "coding",
    title: "Coding Interview",
    desc: "Solve coding challenges with real-time AI feedback",
    bgColor: "bg-[#F5F3FF]",
    accentColor: "#6366F1",
    tags: ["LeetCode", "HackerRank", "CodeSignal"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    navigateTo: "mock-questions",
  },
  {
    id: "phone",
    title: "Phone Interview",
    desc: "AI-powered suggestions during live phone calls",
    bgColor: "bg-[#EFF6FF]",
    accentColor: "#3B82F6",
    tags: ["Zoom Phone", "Direct Call", "WhatsApp"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    navigateTo: "interview-room",
  },
];

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { user } = useAuth();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [setupProgress, setSetupProgress] = useState<SetupProgress>(defaultSetupProgress);
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [resumeUploadNotice, setResumeUploadNotice] = useState<string | null>(null);
  const [positionText, setPositionText] = useState("");
  const [isPositionSaving, setIsPositionSaving] = useState(false);
  const [positionSaveError, setPositionSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadSetupProgress = async () => {
      if (!user?.uid) {
        setSetupProgress(defaultSetupProgress);
        setIsProgressLoading(false);
        return;
      }

      try {
        const progressRef = doc(db, "users", user.uid, "dashboard", "setupProgress");
        const snapshot = await getDoc(progressRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<SetupProgress>;
          setSetupProgress({
            resume: Boolean(data.resume),
            position: Boolean(data.position),
            launch: Boolean(data.launch),
            report: Boolean(data.report),
          });
        } else {
          setSetupProgress(defaultSetupProgress);
        }
      } catch (error) {
        console.error("Failed to load dashboard setup progress:", error);
      } finally {
        setIsProgressLoading(false);
      }
    };

    loadSetupProgress();
  }, [user?.uid]);

  useEffect(() => {
    const loadSavedPosition = async () => {
      if (!user?.uid) {
        setPositionText("");
        return;
      }

      try {
        const positionRef = doc(db, "users", user.uid, "profile", "position");
        const snapshot = await getDoc(positionRef);
        if (!snapshot.exists()) {
          setPositionText("");
          return;
        }

        const data = snapshot.data() as {
          positionTitle?: string;
          extractedText?: string;
        };
        setPositionText((data.positionTitle ?? data.extractedText ?? "").trim());
      } catch (error) {
        console.error("Failed to load saved position:", error);
      }
    };

    loadSavedPosition();
  }, [user?.uid]);

  const completedSteps = useMemo(
    () => Object.values(setupProgress).filter(Boolean).length,
    [setupProgress]
  );

  const markStepComplete = async (stepId: SetupStepId) => {
    if (!user?.uid) {
      return;
    }

    try {
      const progressRef = doc(db, "users", user.uid, "dashboard", "setupProgress");
      await setDoc(
        progressRef,
        {
          [stepId]: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSetupProgress((prev) => ({ ...prev, [stepId]: true }));
    } catch (error) {
      console.error("Failed to update dashboard setup progress:", error);
    }
  };

  const handleSetupStep = async (stepId: SetupStepId, destination: string) => {
    await markStepComplete(stepId);
    onNavigate(destination);
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
    }
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      disableWorker: true,
    });
    const timeoutMs = 25000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("PDF extraction timed out.")), timeoutMs);
    });

    const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
    const pagesText: string[] = [];
    const pageLimit = Math.min(pdf.numPages, 30);

    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = (content.items as Array<{ str?: string }>)
        .map((item) => item.str ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (text.length > 0) {
        pagesText.push(text);
      }
    }

    return pagesText.join("\n").trim();
  };

  const handleResumeFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) {
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setResumeUploadError("Please upload a PDF file only.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeUploadError("Resume PDF must be under 10MB.");
      event.target.value = "";
      return;
    }

    try {
      setResumeUploadError(null);
      setResumeUploadNotice(null);
      setIsResumeUploading(true);

      const normalizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `users/${user.uid}/resumes/${Date.now()}-${normalizedName}`;
      const resumeRef = ref(storage, filePath);

      await uploadBytes(resumeRef, file, {
        contentType: "application/pdf",
      });
      const downloadURL = await getDownloadURL(resumeRef);

      let extractedText = "";
      let extractionIssue: string | null = null;
      try {
        extractedText = await extractTextFromPdf(file);
      } catch (error) {
        console.warn("Resume text extraction skipped:", error);
        extractionIssue = "Resume uploaded, but text extraction timed out. Try a smaller PDF if you want AI context from resume text.";
      }

      const maxChars = 120000;
      const extractedTextPreview = extractedText.slice(0, maxChars);
      const profileRef = doc(db, "users", user.uid, "profile", "resume");
      await setDoc(
        profileRef,
        {
          fileName: file.name,
          filePath,
          contentType: file.type || "application/pdf",
          sizeBytes: file.size,
          downloadURL,
          extractedText: extractedTextPreview,
          extractedChars: extractedText.length,
          wasTruncated: extractedText.length > maxChars,
          extractionStatus: extractionIssue ? "timeout" : "ok",
          uploadedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await markStepComplete("resume");
      if (extractionIssue) {
        setResumeUploadNotice(extractionIssue);
      }
    } catch (error) {
      console.error("Failed to upload resume:", error);
      setResumeUploadError("Failed to upload and process resume. Please try again.");
    } finally {
      setIsResumeUploading(false);
      event.target.value = "";
    }
  };

  const savePositionText = async () => {
    if (!user?.uid) {
      return;
    }

    const normalizedPosition = positionText.trim();
    if (!normalizedPosition) {
      setPositionSaveError("Please enter your current position.");
      return;
    }

    try {
      setPositionSaveError(null);
      setIsPositionSaving(true);

      const profileRef = doc(db, "users", user.uid, "profile", "position");
      await setDoc(
        profileRef,
        {
          positionTitle: normalizedPosition,
          extractedText: normalizedPosition,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await markStepComplete("position");
    } catch (error) {
      console.error("Failed to save position:", error);
      setPositionSaveError("Failed to save position. Please try again.");
    } finally {
      setIsPositionSaving(false);
    }
  };

  const handleGettingStartedAction = async (step: {
    id: SetupStepId;
    destination: string;
  }) => {
    if (step.id === "resume") {
      resumeInputRef.current?.click();
      return;
    }

    if (step.id === "position") {
      await savePositionText();
      return;
    }

    await handleSetupStep(step.id, step.destination);
  };

  const gettingStartedSteps: {
    num: number;
    id: SetupStepId;
    title: string;
    desc: string;
    destination: string;
    cta: string;
  }[] = [
    {
      num: 1,
      id: "resume",
      title: "Add your resume",
      desc: "Upload your resume and cover letter to customize your AI",
      destination: "interview-room",
      cta: "Add Resume",
    },
    {
      num: 2,
      id: "position",
      title: "Add your position",
      desc: "Upload job description so AI can provide customized answers",
      destination: "interview-room",
      cta: "Add Position",
    },
    {
      num: 3,
      id: "launch",
      title: "Launch an interview",
      desc: "Launch your Interview CoPilot™ for real-time support",
      destination: "interview-room",
      cta: "Launch",
    },
    {
      num: 4,
      id: "report",
      title: "View interview report",
      desc: "Review your interview notes and past performance",
      destination: "interview-report",
      cta: "View Report",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto relative liquid-bg">
      <input
        ref={resumeInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleResumeFileChange}
      />

      {/* Liquid background blobs */}
      <div className="liquid-blob liquid-blob-pink w-[350px] h-[350px] -top-20 left-[30%] opacity-50" />
      <div className="liquid-blob liquid-blob-purple w-[250px] h-[250px] top-[60%] -right-10 opacity-40" />

      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#EA4C89] via-[#F472A8] to-[#6366F1] p-[1.5px] relative z-10">
        <div className="flex items-center justify-between px-6 py-3 glass-strong rounded-[22px]">
          <p className="text-xs font-bold text-[#1A1A2E]">
            🚀 Activate your Interview CoPilot™ and start getting real-time help during interviews.
          </p>
          <button
            onClick={() => handleSetupStep("launch", "interview-room")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white text-[10px] font-bold shadow-soft flex items-center gap-2 hover:shadow-card transition-all"
          >
            Activate CoPilot
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <h1 className="text-2xl font-extrabold text-white mb-1">
          Welcome back, <span className="gradient-text">{user?.displayName?.split(" ")[0] || "there"}</span>
        </h1>
        <p className="text-sm text-white/50 font-medium">
          Ready to ace your next interview? Pick a practice mode below.
        </p>
      </div>

      {/* Getting Started */}
      <section className="relative z-10">
        <div className="mb-5">
          <h2 className="text-base font-bold text-white">Getting Started</h2>
          <p className="text-[13px] text-white/50 mt-1 font-medium">Get the most out of Crack!t</p>
          <p className="text-[12px] font-semibold text-[#EA4C89] mt-2">
            {isProgressLoading
              ? "Loading your setup progress..."
              : `${completedSteps}/4 steps completed`}
          </p>
          {isResumeUploading && (
            <p className="text-[12px] font-semibold text-[#3B82F6] mt-1">
              Uploading and extracting resume...
            </p>
          )}
          {isPositionSaving && (
            <p className="text-[12px] font-semibold text-[#3B82F6] mt-1">
              Saving your current position...
            </p>
          )}
          {resumeUploadError && (
            <p className="text-[12px] font-semibold text-red-600 mt-1">{resumeUploadError}</p>
          )}
          {resumeUploadNotice && (
            <p className="text-[12px] font-semibold text-amber-600 mt-1">{resumeUploadNotice}</p>
          )}
          {positionSaveError && (
            <p className="text-[12px] font-semibold text-red-600 mt-1">{positionSaveError}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {gettingStartedSteps.map((step) => {
            const completed = setupProgress[step.id];
            return (
            <TiltCard key={step.id} className="flex-1 min-w-[240px]">
             <div className="p-6 h-full glass-dark border-white/10 rounded-[24px] liquid-shine group hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center text-[10px] font-bold text-white">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-[12px] text-white/50 leading-relaxed font-medium group-hover:text-white/70 transition-colors">
                {step.desc}
              </p>
              {step.id === "position" && (
                <input
                  type="text"
                  value={positionText}
                  onChange={(event) => setPositionText(event.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="mt-3 w-full px-3 py-2 rounded-lg bg-[#050508] border border-white/10 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#EA4C89]/40"
                />
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${completed ? "bg-green-100 text-green-700" : "bg-[#FDF0F5] text-[#EA4C89]"}`}>
                  {completed ? "Completed" : "Pending"}
                </span>
                <button
                  onClick={() => handleGettingStartedAction(step)}
                  disabled={(isResumeUploading && step.id === "resume") || (isPositionSaving && step.id === "position")}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:border-[#EA4C89]/40 hover:text-[#EA4C89] transition-all"
                >
                  {isResumeUploading && step.id === "resume"
                    ? "Uploading..."
                    : isPositionSaving && step.id === "position"
                      ? "Saving..."
                      : step.cta}
                </button>
              </div>
             </div>
            </TiltCard>
          );
        })}
        </div>
      </section>

      {/* Interview Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {interviewCards.map((card, i) => (
          <TiltCard
            key={card.id}
            as="button"
            onClick={() => onNavigate(card.navigateTo)}
            className="group text-left rounded-[28px] glass-dark border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up hover:bg-white/[0.04]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Icon Area */}
            <div className="w-full aspect-[4/3] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden bg-white/[0.03] border border-white/5">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent to-black/5" />
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-card flex items-center justify-center group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
            </div>

            <h3 className="text-[17px] font-bold text-white mb-1">{card.title}</h3>
            <p className="text-[12px] text-white/50 leading-relaxed mb-4 min-h-[36px] font-medium transition-colors group-hover:text-white/70">
              {card.desc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2 mt-auto">
              {card.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stat */}
            {card.stat && (
              <div className="flex items-center gap-2 px-3 py-1.5 mt-4 rounded-full bg-white/5 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse-live" />
                <span className="text-[10px] font-bold text-white/70">{card.stat}</span>
              </div>
            )}
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
