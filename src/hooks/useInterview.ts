"use client";

import { useState, useCallback, useRef } from "react";
import type { InterviewState, InterviewReport } from "@/lib/types";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

const initialState: InterviewState = {
  status: "idle",
  targetRole: "",
  interviewType: "",
  isMuted: false,
  language: "english",
  tone: "professional",
  resumeText: "",
  rawTranscript: "",
  report: null,
  reportError: false,
};

export function useInterview() {
  const [state, setState] = useState<InterviewState>(initialState);
  const docIdRef = useRef<string | null>(null);

  const startInterview = useCallback(
    (targetRole: string, interviewType: string, language: string, tone: string, resumeText: string) => {
      setState((prev) => ({
        ...prev,
        status: "in-progress",
        targetRole,
        interviewType,
        language,
        tone,
        resumeText,
        rawTranscript: "",
        report: null,
        reportError: false,
      }));
    },
    []
  );

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const saveInterviewToFirestore = useCallback(async (rawTranscript: string, reportData?: InterviewReport) => {
    try {
      const currentUserId = auth.currentUser?.uid ?? null;
      const interviewData: Record<string, unknown> = {
        targetRole: state.targetRole,
        interviewType: state.interviewType,
        rawTranscript,
        userId: currentUserId,
        updatedAt: serverTimestamp(),
      };

      if (!docIdRef.current) {
        interviewData.createdAt = serverTimestamp();
      }

      if (reportData) {
        interviewData.report = reportData;
        interviewData.reportGeneratedAt = serverTimestamp();
      }

      if (docIdRef.current) {
        try {
          await updateDoc(doc(db, "interviews", docIdRef.current), interviewData);
        } catch (updateError) {
          console.warn("Interview update failed, creating new document:", updateError);
          const fallbackDocRef = await addDoc(collection(db, "interviews"), {
            ...interviewData,
            createdAt: serverTimestamp(),
          });
          docIdRef.current = fallbackDocRef.id;
        }
      } else {
        const docRef = await addDoc(collection(db, "interviews"), interviewData);
        docIdRef.current = docRef.id;
      }
      return docIdRef.current;
    } catch (err) {
      console.error("Firestore Persistence Error:", err);
      return null;
    }
  }, [state.targetRole, state.interviewType]);

  const generateFinalReport = useCallback(async (rawTranscript: string) => {
    setState(prev => ({ ...prev, reportError: false, report: null }));
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rawTranscript,
          targetRole: state.targetRole 
        }),
      });
      
      if (!res.ok) throw new Error("Report API failed");
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Update Firestore record with the report
      await saveInterviewToFirestore(rawTranscript, data);

      setState(prev => ({ ...prev, report: data, reportError: false }));
    } catch (err) {
      console.error("Failed to generate report:", err);
      setState(prev => ({ ...prev, reportError: true }));
    }
  }, [state.targetRole, saveInterviewToFirestore]);

  const endInterview = useCallback(async (rawTranscript: string) => {
    setState((prev) => ({ ...prev, status: "complete", rawTranscript }));
    
    // 1st STORE the raw transcript to Firestore
    await saveInterviewToFirestore(rawTranscript);
    
    // 2nd ANALYZE with Gemini
    generateFinalReport(rawTranscript);
  }, [generateFinalReport, saveInterviewToFirestore]);

  const retryFinalReport = useCallback(() => {
    if (state.rawTranscript) {
      generateFinalReport(state.rawTranscript);
    }
  }, [state.rawTranscript, generateFinalReport]);

  const resetInterview = useCallback(() => {
    setState(initialState);
    docIdRef.current = null;
  }, []);

  return {
    state,
    startInterview,
    toggleMute,
    endInterview,
    retryFinalReport,
    resetInterview,
  };
}
