"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { InterviewReport } from "@/lib/types";

type StoredInterview = {
  id: string;
  userId?: string | null;
  targetRole?: string;
  interviewType?: string;
  report?: InterviewReport;
  rawTranscript?: string;
  createdAt?: { toDate?: () => Date };
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<StoredInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<StoredInterview | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      if (!user?.uid) {
        setReports([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const interviewsQuery = query(collection(db, "interviews"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(interviewsQuery);

        const allDocs = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<StoredInterview, "id">) }))
          .filter((item) => Boolean(item.report));

        const docs = allDocs
          .filter((item) => item.userId === user.uid || !item.userId)
          .slice(0, 50);

        setReports(docs);
      } catch (loadError) {
        console.error("Failed to load interview reports:", loadError);
        setError("Failed to load your reports. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user?.uid]);

  const averageScore = useMemo(() => {
    if (reports.length === 0) {
      return 0;
    }
    const total = reports.reduce((sum, item) => sum + (item.report?.overallScore ?? 0), 0);
    return Math.round(total / reports.length);
  }, [reports]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#EA4C89] to-[#6366F1] p-[1.5px]">
        <div className="rounded-[22px] px-6 py-5 bg-white/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Interview Reports</h1>
            <p className="text-sm text-slate-500">All your previously generated reports from Firebase.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#FDF0F5] border border-[#EA4C89]/10">
              <p className="text-[10px] font-bold text-[#EA4C89] uppercase tracking-widest">Reports</p>
              <p className="text-lg font-extrabold text-[#1A1A2E] leading-none">{reports.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#EFF6FF] border border-[#3B82F6]/10">
              <p className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-widest">Avg Score</p>
              <p className="text-lg font-extrabold text-[#1A1A2E] leading-none">{averageScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="glass-card rounded-3xl p-10 text-center">
          <p className="text-sm font-semibold text-slate-500">Loading your report history...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="glass-card rounded-3xl p-10 text-center space-y-4">
          <p className="text-lg font-bold text-[#1A1A2E]">No reports yet</p>
          <p className="text-sm text-slate-500">Complete an interview and generate a report to see it here.</p>
          <Link
            href="/dashboard/interview"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#EA4C89] text-white text-xs font-bold"
          >
            Start Interview
          </Link>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {reports.map((item) => {
            const report = item.report as InterviewReport;
            const createdAtDate = item.createdAt?.toDate ? item.createdAt.toDate() : null;

            return (
              <article
                key={item.id}
                onClick={() => setSelectedReport(item)}
                className="glass-card rounded-3xl p-6 space-y-4 cursor-pointer hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A2E]">{item.targetRole || "Interview Session"}</h2>
                    <p className="text-xs text-slate-500">
                      {createdAtDate ? createdAtDate.toLocaleString() : "Date unavailable"}
                    </p>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-[#FDF0F5] border border-[#EA4C89]/10 text-right">
                    <p className="text-[10px] font-bold text-[#EA4C89] uppercase tracking-widest">Overall</p>
                    <p className="text-xl font-extrabold text-[#1A1A2E] leading-none">{report.overallScore}%</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{report.summary}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/80 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Technical</p>
                    <p className="text-base font-extrabold text-[#1A1A2E]">{report.technicalScore}%</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Confidence</p>
                    <p className="text-base font-extrabold text-[#1A1A2E]">{report.confidenceScore}%</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Soft Skills</p>
                    <p className="text-base font-extrabold text-[#1A1A2E]">{report.softSkillsScore}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {report.strengths.slice(0, 3).map((strength, index) => (
                        <li key={`${item.id}-s-${index}`} className="text-xs text-slate-600">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-2">Improvements</p>
                    <ul className="space-y-1">
                      {report.improvements.slice(0, 3).map((improvement, index) => (
                        <li key={`${item.id}-i-${index}`} className="text-xs text-slate-600">• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-[11px] font-semibold text-[#EA4C89]">Click to view full report</p>
              </article>
            );
          })}
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1A1A2E]">
                  {selectedReport.targetRole || "Interview Session"}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedReport.createdAt?.toDate
                    ? selectedReport.createdAt.toDate().toLocaleString()
                    : "Date unavailable"}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Overall", value: selectedReport.report?.overallScore ?? 0 },
                { label: "Technical", value: selectedReport.report?.technicalScore ?? 0 },
                { label: "Confidence", value: selectedReport.report?.confidenceScore ?? 0 },
                { label: "Soft Skills", value: selectedReport.report?.softSkillsScore ?? 0 },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
                  <p className="text-xl font-extrabold text-[#1A1A2E]">{metric.value}%</p>
                </div>
              ))}
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Summary</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedReport.report?.summary}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section>
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Strengths</h3>
                <ul className="space-y-1.5">
                  {(selectedReport.report?.strengths ?? []).map((item, index) => (
                    <li key={`full-s-${index}`} className="text-sm text-slate-700">• {item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Weaknesses</h3>
                <ul className="space-y-1.5">
                  {(selectedReport.report?.weaknesses ?? []).map((item, index) => (
                    <li key={`full-w-${index}`} className="text-sm text-slate-700">• {item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section>
              <h3 className="text-xs font-bold text-[#EA4C89] uppercase tracking-wider mb-2">Improvements</h3>
              <ul className="space-y-1.5">
                {(selectedReport.report?.improvements ?? []).map((item, index) => (
                  <li key={`full-i-${index}`} className="text-sm text-slate-700">• {item}</li>
                ))}
              </ul>
            </section>

            {selectedReport.report?.confidenceAnalysis && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confidence Analysis</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedReport.report.confidenceAnalysis}</p>
              </section>
            )}

            {selectedReport.rawTranscript && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transcript</h3>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedReport.rawTranscript}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
