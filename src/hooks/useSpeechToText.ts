"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface SpeechToTextState {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  restartCount: number;
}

export function useSpeechToText() {
  const [state, setState] = useState<SpeechToTextState>({
    transcript: "",
    interimTranscript: "",
    isListening: false,
    isSupported: false,
    restartCount: 0,
  });

  const transcriptRef = useRef("");
  const shouldRunRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartCountRef = useRef(0);

  // Create a fresh SpeechRecognition instance each time
  const createRecognition = useCallback(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SR) return null;

    const recognition = new SR();
    // KEY CHANGE: Use non-continuous mode — more reliable in Chrome
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        transcriptRef.current += finalText;
      }

      setState(prev => ({
        ...prev,
        transcript: transcriptRef.current,
        interimTranscript: interim,
        isListening: true,
      }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("[STT] Error:", event.error);
      // Don't do anything — onend will fire and restart
    };

    recognition.onend = () => {
      // In non-continuous mode, this fires after EVERY utterance
      // Restart immediately if we should still be running
      if (shouldRunRef.current) {
        restartCountRef.current += 1;
        setState(prev => ({
          ...prev,
          restartCount: restartCountRef.current,
          interimTranscript: "",
        }));
        // Create fresh instance and start
        startFresh();
      } else {
        setState(prev => ({ ...prev, isListening: false }));
      }
    };

    return recognition;
  }, []);

  const startFresh = useCallback(() => {
    if (!shouldRunRef.current) return;

    // Stop old instance if exists
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    // Create a brand new instance — avoids stale Chrome state
    const newRecognition = createRecognition();
    if (!newRecognition) return;

    recognitionRef.current = newRecognition;

    try {
      newRecognition.start();
      setState(prev => ({ ...prev, isListening: true }));
    } catch {
      // Failed to start — retry in 500ms
      setTimeout(() => {
        if (shouldRunRef.current) startFresh();
      }, 500);
    }
  }, [createRecognition]);

  // Check support on mount
  useEffect(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (SR) {
      setState(prev => ({ ...prev, isSupported: true }));
    }

    return () => {
      shouldRunRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const start = useCallback(() => {
    shouldRunRef.current = true;
    restartCountRef.current = 0;
    startFresh();
  }, [startFresh]);

  const stop = useCallback(() => {
    shouldRunRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const reset = useCallback(() => {
    transcriptRef.current = "";
    restartCountRef.current = 0;
    setState(prev => ({
      ...prev,
      transcript: "",
      interimTranscript: "",
      restartCount: 0,
    }));
  }, []);

  const getFullTranscript = useCallback(() => {
    return (transcriptRef.current + state.interimTranscript).trim();
  }, [state.interimTranscript]);

  return {
    ...state,
    start,
    stop,
    reset,
    getFullTranscript,
  };
}
