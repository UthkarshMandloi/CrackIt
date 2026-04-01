// Legacy types kept for backward compatibility with unused components
export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

export interface Scores {
  relevance: number;
  clarity: number;
  technical: number;
  confidence: number;
}

export interface InterviewReport {
  overallScore: number;
  confidenceScore: number;
  technicalScore: number;
  softSkillsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  confidenceAnalysis: string;
}

export type InterviewStatus =
  | 'idle'
  | 'in-progress'
  | 'complete';

export interface InterviewState {
  status: InterviewStatus;
  targetRole: string;
  interviewType: string;
  isMuted: boolean;
  language: string;
  tone: string;
  resumeText: string;
  rawTranscript: string;
  report: InterviewReport | null;
  reportError: boolean;
}
