"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type ATSResult = {
  atsScore: number;
  summary: string;
  suggestions: string[];
  improvements: string[];
};

type ATSCheckRecord = ATSResult & {
  id: string;
  userId?: string | null;
  targetRole?: string;
  resumeFileName?: string;
  resumeDownloadURL?: string;
  resumeText?: string;
  createdAt?: { toDate?: () => Date };
};

export default function ATSPage() {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [history, setHistory] = useState<ATSCheckRecord[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPersisting, setIsPersisting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    });

    const timeoutMs = 25000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("PDF extraction timed out.")), timeoutMs);
    });

    const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
    const pageLimit = Math.min(pdf.numPages, 30);
    const chunks: string[] = [];

    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = (content.items as Array<{ str?: string }>)
        .map((item) => item.str ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) {
        chunks.push(text);
      }
    }

    return chunks.join("\n").trim();
  };

  const loadHistory = async (uid: string) => {
    try {
      setIsHistoryLoading(true);
      const checksQuery = query(collection(db, "atsChecks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(checksQuery);
      const records = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<ATSCheckRecord, "id">) }))
        .filter((item) => item.userId === uid)
        .slice(0, 20);
      setHistory(records);
    } catch (loadError) {
      console.error("Failed to load ATS history:", loadError);
      setError("Could not load ATS history.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) {
      setHistory([]);
      setIsHistoryLoading(false);
      return;
    }

    loadHistory(user.uid);
  }, [user?.uid]);

  const averageScore = useMemo(() => {
    if (history.length === 0) {
      return 0;
    }
    const total = history.reduce((sum, item) => sum + item.atsScore, 0);
    return Math.round(total / history.length);
  }, [history]);

  const runATSCheck = async () => {
    if (!user?.uid) {
      setError("Please login to use ATS checker.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume PDF first.");
      return;
    }

    const isPdf = resumeFile.type === "application/pdf" || resumeFile.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Only PDF files are supported for ATS check.");
      return;
    }

    if (resumeFile.size > 10 * 1024 * 1024) {
      setError("Resume PDF must be under 10MB.");
      return;
    }

    try {
      setError(null);
      setIsRunning(true);

      const extractedText = await extractTextFromPdf(resumeFile);
      if (extractedText.length < 50) {
        throw new Error("Could not extract enough text from the PDF. Please upload a clearer resume PDF.");
      }

      const response = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: extractedText, targetRole: targetRole.trim() }),
      });

      const data = await response.json() as ATSResult | { error?: string };
      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "ATS analysis failed");
      }

      const parsed = data as ATSResult;
      setResult(parsed);
      setIsRunning(false);

      setIsPersisting(true);

      const normalizedName = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `users/${user.uid}/ats-resumes/${Date.now()}-${normalizedName}`;
      const resumeRef = ref(storage, storagePath);
      await uploadBytes(resumeRef, resumeFile, { contentType: "application/pdf" });
      const resumeDownloadURL = await getDownloadURL(resumeRef);

      await addDoc(collection(db, "atsChecks"), {
        userId: user.uid,
        targetRole: targetRole.trim(),
        resumeText: extractedText,
        resumeFileName: resumeFile.name,
        resumeStoragePath: storagePath,
        resumeDownloadURL,
        atsScore: parsed.atsScore,
        summary: parsed.summary,
        suggestions: parsed.suggestions,
        improvements: parsed.improvements,
        createdAt: serverTimestamp(),
      });

      await loadHistory(user.uid);
    } catch (runError) {
      console.error("ATS check failed:", runError);
      setError(runError instanceof Error ? runError.message : "ATS check failed");
    } finally {
      setIsRunning(false);
      setIsPersisting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#EA4C89] to-[#6366F1] p-[1.5px]">
        <div className="rounded-[22px] bg-white/90 backdrop-blur-md px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">ATS Resume Checker</h1>
            <p className="text-sm text-slate-500">Analyze your resume with Gemini and track all past checks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#FDF0F5] border border-[#EA4C89]/10">
              <p className="text-[10px] font-bold text-[#EA4C89] uppercase tracking-widest">Checks</p>
              <p className="text-lg font-extrabold text-[#1A1A2E] leading-none">{history.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#EFF6FF] border border-[#3B82F6]/10">
              <p className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-widest">Avg ATS</p>
              <p className="text-lg font-extrabold text-[#1A1A2E] leading-none">{averageScore}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#1A1A2E]">Run New ATS Check</h2>
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="Target role (optional), e.g. Frontend Developer"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-[#EA4C89]/40"
          />
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">Resume PDF</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
              className="mt-2 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#FDF0F5] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#EA4C89]"
            />
          </label>
          {resumeFile && (
            <p className="text-xs text-slate-500">
              Selected: {resumeFile.name}
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">Upload one PDF (max 10MB).</p>
            <button
              onClick={runATSCheck}
              disabled={isRunning || isPersisting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA4C89] to-[#D63B75] text-white text-xs font-bold disabled:opacity-60"
            >
              {isRunning ? "Analyzing..." : isPersisting ? "Saving..." : "Run ATS Check"}
            </button>
          </div>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        </section>

        <section className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#1A1A2E]">Latest Result</h2>
          {!result && <p className="text-sm text-slate-500">Run a check to see score and suggestions.</p>}
          {result && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#FDF0F5] border border-[#EA4C89]/10 p-4">
                <p className="text-[10px] font-bold text-[#EA4C89] uppercase tracking-widest">ATS Score</p>
                <p className="text-4xl font-black text-[#1A1A2E] leading-none">{result.atsScore}%</p>
              </div>
              <p className="text-sm text-slate-600">{result.summary}</p>
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-2">Suggestions</p>
                <ul className="space-y-1">
                  {result.suggestions.map((item, idx) => (
                    <li key={`s-${idx}`} className="text-xs text-slate-600">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wide mb-2">Improvements</p>
                <ul className="space-y-1">
                  {result.improvements.map((item, idx) => (
                    <li key={`i-${idx}`} className="text-xs text-slate-600">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A1A2E]">Past ATS Checks</h2>
          {isHistoryLoading && <p className="text-xs text-slate-500">Loading history...</p>}
        </div>

        {!isHistoryLoading && history.length === 0 && (
          <p className="text-sm text-slate-500">No ATS checks yet.</p>
        )}

        {!isHistoryLoading && history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {history.map((item) => {
              const createdAt = item.createdAt?.toDate ? item.createdAt.toDate() : null;
              return (
                <article key={item.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#1A1A2E]">{item.targetRole || "General ATS Check"}</p>
                      <p className="text-[11px] text-slate-500">{createdAt ? createdAt.toLocaleString() : "Date unavailable"}</p>
                      {item.resumeFileName && (
                        <p className="text-[11px] text-slate-500">{item.resumeFileName}</p>
                      )}
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-[#FDF0F5] text-[#EA4C89] text-xs font-bold">{item.atsScore}%</div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3">{item.summary}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
