export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text-gap' | 'true-false-not-given';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LessonSlide {
  title: string;
  content: string;
  keyPoints: string[];
  diagramType?: 'flowchart' | 'comparison' | 'band9-criteria' | 'mindmap';
}

export interface Lesson {
  id: string;
  skill: SkillType;
  title: string;
  level: string; // 'IELTS 9.0' | 'C2 Mastery' | 'C1 Advanced'
  description: string;
  durationMinutes: number;
  youtubeId: string; // e.g. "sRFEVzy_sH0"
  youtubeTitle: string;
  slides: LessonSlide[];
  summaryText: string;
  practiceQuestions: Question[];
}

export interface MockExamQuestion extends Question {
  section: 'listening' | 'reading' | 'writing' | 'speaking';
}

export interface MockExamData {
  id: string;
  title: string;
  timeLimitMinutes: number;
  listeningPassage: {
    title: string;
    description: string;
    youtubeId: string;
    audioTranscript: string;
    questions: Question[];
  };
  readingPassage: {
    title: string;
    passageText: string;
    questions: Question[];
  };
  writingTasks: {
    task1Prompt: string;
    task1ChartTitle: string;
    task1ChartData: { label: string; year2010: number; year2025: number }[];
    task1SampleBand9: string;
    task2Prompt: string;
    task2SampleBand9: string;
  };
  speakingPrompts: {
    part1: string[];
    part2Topic: string;
    part2Points: string[];
    part3: string[];
    sampleBand9Notes: string;
  };
}

export interface ExamResult {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  completedAt: string;
  timeSpentSeconds: number;
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  speakingScore: number;
  overallBand: number;
  cefrLevel: 'C2' | 'C1' | 'B2';
  answers: Record<string, string>;
  questionReviews: {
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    section: string;
  }[];
  certificateId: string;
}

export interface CertificateData {
  id: string;
  serialNumber: string;
  userId: string;
  fullName: string;
  overallBand: number;
  cefrLevel: string;
  listeningBand: number;
  readingBand: number;
  writingBand: number;
  speakingBand: number;
  issueDate: string;
  verificationHash: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
  text: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl?: string;
}
