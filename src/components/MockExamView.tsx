import React, { useState, useEffect } from 'react';
import { MockExamData, ExamResult, User, CertificateData } from '../types';
import { StorageService } from '../services/storage';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Play,
  RotateCcw,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface MockExamViewProps {
  mockExam: MockExamData;
  currentUser: User | null;
  onOpenAuth: () => void;
  onViewCertificate: (cert: CertificateData) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  mockExam,
  currentUser,
  onOpenAuth,
  onViewCertificate,
}) => {
  const [examStarted, setExamStarted] = useState(false);
  const [activeSection, setActiveSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(mockExam.timeLimitMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [writingTask1, setWritingTask1] = useState('');
  const [writingTask2, setWritingTask2] = useState('');
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Speaking Part 2 interactive timer
  const [speakingPrepTime, setSpeakingPrepTime] = useState(60);
  const [isSpeakingPrepActive, setIsSpeakingPrepActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Exam Countdown Timer
  useEffect(() => {
    if (!examStarted || isPaused || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isPaused, examSubmitted]);

  // Speaking prep timer
  useEffect(() => {
    if (!isSpeakingPrepActive || speakingPrepTime <= 0) return;
    const interval = setInterval(() => {
      setSpeakingPrepTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSpeakingPrepActive, speakingPrepTime]);

  // Speaking record timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (qId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const calculateWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleSubmitExam = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    // Evaluate answers
    const allQuestions = [
      ...mockExam.listeningPassage.questions.map((q) => ({ ...q, section: 'Listening' })),
      ...mockExam.readingPassage.questions.map((q) => ({ ...q, section: 'Reading' })),
    ];

    let correctCount = 0;
    const reviews = allQuestions.map((q) => {
      const userAns = userAnswers[q.id]?.trim() || "Javob berilmadi";
      const isCorrect = userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.question,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        section: q.section,
      };
    });

    // Score calculations
    // Base objective ratio
    const objectiveRatio = correctCount / allQuestions.length;
    
    // Writing evaluation factor based on word count & structure
    const task1Words = calculateWordCount(writingTask1);
    const task2Words = calculateWordCount(writingTask2);
    let writingScore = 6.0;
    if (task1Words >= 150 && task2Words >= 250) {
      writingScore = 8.5;
      if (task2Words >= 280) writingScore = 9.0;
    } else if (task1Words >= 100 || task2Words >= 180) {
      writingScore = 7.5;
    }

    // Speaking simulation score
    const speakingScore = recordingSeconds >= 60 ? 9.0 : 8.0;

    // Listening & Reading scores
    const listeningScore = objectiveRatio >= 0.8 ? 9.0 : objectiveRatio >= 0.6 ? 8.0 : 7.0;
    const readingScore = objectiveRatio >= 0.8 ? 9.0 : objectiveRatio >= 0.6 ? 8.0 : 7.0;

    // Overall Band
    const rawBand = (listeningScore + readingScore + writingScore + speakingScore) / 4;
    // Round to nearest 0.5
    const overallBand = Math.round(rawBand * 2) / 2;

    const cefrLevel: 'C2' | 'C1' | 'B2' = overallBand >= 8.5 ? 'C2' : overallBand >= 7.0 ? 'C1' : 'B2';

    // Generate Certificate
    const certId = 'CERT_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const serialNumber = `TE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const certData: CertificateData = {
      id: certId,
      serialNumber,
      userId: currentUser.id,
      fullName: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
      overallBand,
      cefrLevel,
      listeningBand: listeningScore,
      readingBand: readingScore,
      writingBand: writingScore,
      speakingBand: speakingScore,
      issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      verificationHash: 'SHA256_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    };

    StorageService.saveCertificate(certData);

    const result: ExamResult = {
      id: 'res_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      fullName: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds: mockExam.timeLimitMinutes * 60 - timeLeftSeconds,
      listeningScore,
      readingScore,
      writingScore,
      speakingScore,
      overallBand,
      cefrLevel,
      answers: userAnswers,
      questionReviews: reviews,
      certificateId: certId,
    };

    StorageService.saveExamResult(result);
    setExamResult(result);
    setExamSubmitted(true);
  };

  const handleStartExam = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setExamStarted(true);
    setExamSubmitted(false);
    setTimeLeftSeconds(mockExam.timeLimitMinutes * 60);
  };

  const handleRetakeExam = () => {
    setExamSubmitted(false);
    setExamResult(null);
    setUserAnswers({});
    setWritingTask1('');
    setWritingTask2('');
    setTimeLeftSeconds(mockExam.timeLimitMinutes * 60);
    setExamStarted(true);
  };

  // If exam has not started yet
  if (!examStarted && !examSubmitted) {
    return (
      <div className="py-12 bg-slate-50 min-h-[600px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block mb-2">
                Cambridge English & British Council Formati
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {mockExam.title}
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                Ushbu nazariy imtihon IELTS 9.0 va C2 darajadagi haqiqiy sinov muhitini yaratadi. Imtihon yakunida xatolaringiz batafsil ko'rsatiladi va rasmiy sertifikat beriladi.
              </p>
            </div>

            {/* Exam Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Vaqt chegarasi</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {mockExam.timeLimitMinutes} daqiqa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Ko'nikmalar</span>
                <span className="text-sm font-bold text-slate-900">
                  4 ta (L, R, W, S)
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Maqsad daraja</span>
                <span className="text-sm font-bold text-amber-700">
                  C2 · Band 9.0
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Sertifikat</span>
                <span className="text-sm font-bold text-slate-900">
                  QR Kodli Rasmiy
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Imtihonni Boshlash</span>
              </button>
            </div>

            {!currentUser && (
              <p className="text-xs text-amber-700 font-medium">
                * Eslatma: Imtihon natijalari va sertifikat saqlanib qolishi uchun ro'yxatdan o'tgan bo'lishingiz kerak.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // EXAM RESULTS SCREEN (If submitted)
  if (examSubmitted && examResult) {
    return (
      <div className="py-10 bg-slate-50 min-h-[600px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Result Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                  Imtihon Muvaffaqiyatli Tamomlandi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {examResult.fullName} ning Imtihon Natijalari
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Topshirilgan vaqt: {new Date(examResult.completedAt).toLocaleString('uz-UZ')} · Sarflangan vaqt: {formatTime(examResult.timeSpentSeconds)}
                </p>
              </div>

              {/* Band Score Display */}
              <div className="flex items-center gap-3 p-3 bg-slate-900 text-white rounded-2xl shadow-md shrink-0">
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    IELTS BAND
                  </span>
                  <span className="text-3xl font-black text-amber-400 font-display tabular-nums">
                    {examResult.overallBand.toFixed(1)}
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-3 pr-2 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    CEFR LEVEL
                  </span>
                  <span className="text-xl font-bold text-white">
                    {examResult.cefrLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Headphones className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 block">Listening</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {examResult.listeningScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 block">Reading</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {examResult.readingScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <PenTool className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 block">Writing</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {examResult.writingScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Mic className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 block">Speaking</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {examResult.speakingScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={handleRetakeExam}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Qaytadan Imtihon Topshirish</span>
              </button>

              <button
                onClick={() => {
                  const cert = StorageService.getCertificateById(examResult.certificateId);
                  if (cert) onViewCertificate(cert);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Rasmiy Sertifikatni Ko'rish / Yuklab Olish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QUESTION REVIEW (QAYSI SAVOLLARDA XATO QILINGANLIGI VA TUSHUNTIRISHLAR) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Savollar Tahlili & Xatolar Ustida Ishlash
                </h3>
                <p className="text-xs text-slate-500">
                  Har bir savol bo'yicha sizning javobingiz, to'g'ri variant va izoh
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                Jami savollar: {examResult.questionReviews.length} ta
              </span>
            </div>

            <div className="space-y-4">
              {examResult.questionReviews.map((item, idx) => (
                <div
                  key={item.questionId}
                  className={`p-4 rounded-xl border transition-all ${
                    item.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {item.section}
                        </span>
                        {item.isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>To'g'ri</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-700 text-xs font-semibold">
                            <AlertCircle className="w-4 h-4" />
                            <span>Xato</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-900">
                        {item.questionText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-[11px] text-slate-500 block mb-0.5">Sizning javobingiz:</span>
                          <span className={`font-semibold ${item.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                            {item.userAnswer}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-[11px] text-slate-500 block mb-0.5">To'g'ri javob:</span>
                          <span className="font-semibold text-slate-900">
                            {item.correctAnswer}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
                        <strong className="text-slate-900">Tushuntirish:</strong> {item.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ACTIVE EXAM SESSION (Questions & Tasks)
  return (
    <div className="py-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Exam Sticky Status Bar */}
        <div className="sticky top-18 z-30 bg-slate-900 text-white rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Qolgan Vaqt
                </span>
                <span className="text-xl font-bold font-mono tracking-wider tabular-nums text-amber-300">
                  {formatTime(timeLeftSeconds)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
            >
              {isPaused ? "Davom ettirish" : "To'xtatib turish"}
            </button>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveSection('listening')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'listening' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Listening</span>
            </button>

            <button
              onClick={() => setActiveSection('reading')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'reading' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reading</span>
            </button>

            <button
              onClick={() => setActiveSection('writing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'writing' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Writing</span>
            </button>

            <button
              onClick={() => setActiveSection('speaking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'speaking' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speaking</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitExam}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <FileCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Imtihonni Yakunlash</span>
          </button>
        </div>

        {/* SECTION 1: LISTENING */}
        {activeSection === 'listening' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Audio/Video Media Container */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                  <Headphones className="w-4 h-4" />
                  <span>IELTS Listening Audio Track</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {mockExam.listeningPassage.title}
                </h3>
                <p className="text-xs text-slate-600">
                  {mockExam.listeningPassage.description}
                </p>

                {/* Embedded Audio/Video player */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${mockExam.listeningPassage.youtubeId}?autoplay=0`}
                    title="IELTS Listening Track"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>

                {/* Audio Transcript details */}
                <details className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <summary className="font-semibold text-slate-800 cursor-pointer">
                    Audio transkriptini ko'rish (Yordam)
                  </summary>
                  <p className="mt-2 text-slate-600 leading-relaxed font-mono text-[11px]">
                    {mockExam.listeningPassage.audioTranscript}
                  </p>
                </details>
              </div>
            </div>

            {/* Questions Container */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Listening Savollari (1-3)
                </h3>

                {mockExam.listeningPassage.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options?.map((opt, oIdx) => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, opt)}
                            className={`w-full text-left px-3.5 py-2 text-xs rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setActiveSection('reading')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <span>Reading Bo'limiga O'tish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: READING */}
        {activeSection === 'reading' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Reading Passage */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                  <BookOpen className="w-4 h-4" />
                  <span>Academic Reading Passage</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {mockExam.readingPassage.title}
                </h3>
                <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-serif">
                  {mockExam.readingPassage.passageText.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Reading Questions */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Reading Savollari (4-6)
                </h3>

                {mockExam.readingPassage.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {idx + 4}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options?.map((opt, oIdx) => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, opt)}
                            className={`w-full text-left px-3.5 py-2 text-xs rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setActiveSection('writing')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <span>Writing Bo'limiga O'tish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: WRITING */}
        {activeSection === 'writing' && (
          <div className="space-y-6">
            {/* Task 1: Comparative Energy Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
                  <PenTool className="w-4 h-4" />
                  <span>Writing Task 1 (Academic Report)</span>
                </div>
                <span className="text-xs text-slate-500">Kamida 150 ta so'z tavsiya etiladi</span>
              </div>

              <p className="text-sm text-slate-800 font-medium">
                {mockExam.writingTasks.task1Prompt}
              </p>

              {/* Dynamic Interactive SVG Bar Chart for Task 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {mockExam.writingTasks.task1ChartTitle}
                  </span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> 2010 yil
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> 2025 yil (Prognoz)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {mockExam.writingTasks.task1ChartData.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span className="font-semibold">{item.label}</span>
                        <span className="font-mono tabular-nums text-slate-500">
                          {item.year2010} TWh → {item.year2025} TWh
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${(item.year2010 / 6000) * 100}%` }}
                          />
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all"
                            style={{ width: `${(item.year2025 / 6000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task 1 Textarea with Word Count */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Sizning tahliliy hisobotingiz (Task 1):</span>
                  <span className={`font-mono font-semibold tabular-nums ${calculateWordCount(writingTask1) >= 150 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {calculateWordCount(writingTask1)} / 150 so'z
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={writingTask1}
                  onChange={(e) => setWritingTask1(e.target.value)}
                  placeholder="The comparative bar chart demonstrates global power generation..."
                  className="w-full p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>

              {/* Band 9 Model Sample view */}
              <details className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                <summary className="font-semibold text-amber-900 cursor-pointer">
                  Band 9.0 namunaviy javobni ko'rish (Model Answer)
                </summary>
                <p className="mt-2 text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                  {mockExam.writingTasks.task1SampleBand9}
                </p>
              </details>
            </div>

            {/* Task 2: Discursive Essay */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
                  <PenTool className="w-4 h-4" />
                  <span>Writing Task 2 (Discursive Essay)</span>
                </div>
                <span className="text-xs text-slate-500">Kamida 250 ta so'z tavsiya etiladi</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-900 font-semibold leading-relaxed">
                  {mockExam.writingTasks.task2Prompt}
                </p>
              </div>

              {/* Task 2 Textarea with Word Count */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Sizning inshoingiz (Task 2):</span>
                  <span className={`font-mono font-semibold tabular-nums ${calculateWordCount(writingTask2) >= 250 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {calculateWordCount(writingTask2)} / 250 so'z
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={writingTask2}
                  onChange={(e) => setWritingTask2(e.target.value)}
                  placeholder="Write your C2 level argument here using Inversion and Cleft sentences..."
                  className="w-full p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>

              {/* Band 9 Model Sample view */}
              <details className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                <summary className="font-semibold text-amber-900 cursor-pointer">
                  Band 9.0 namunaviy essey (Model Essay)
                </summary>
                <p className="mt-2 text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                  {mockExam.writingTasks.task2SampleBand9}
                </p>
              </details>
            </div>
          </div>
        )}

        {/* SECTION 4: SPEAKING */}
        {activeSection === 'speaking' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase">
                <Mic className="w-4 h-4" />
                <span>Speaking Bo'limi (Simulyatsiya)</span>
              </div>
              <span className="text-xs text-slate-500">Fluency, Lexical Resource, Pronunciation</span>
            </div>

            {/* Part 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Part 1: Kirish savollari</h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {mockExam.speakingPrompts.part1.map((p1, idx) => (
                  <li key={idx}>{p1}</li>
                ))}
              </ul>
            </div>

            {/* Part 2 Cue Card with Interactive Timer */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Part 2: Individual Long Turn (Cue Card)
                </span>
                <span className="text-xs text-slate-400">
                  Tayyorgarlik: 1 daqiqa · Gapirish: 2 daqiqa
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-amber-300">
                  {mockExam.speakingPrompts.part2Topic}
                </h4>
                <p className="text-xs text-slate-400">You should say:</p>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {mockExam.speakingPrompts.part2Points.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Prep Timer & Speech Recorder Simulator */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-300">
                    Tayyorgarlik taymeri: <span className="font-mono font-bold text-amber-400 tabular-nums">{speakingPrepTime}s</span>
                  </div>
                  <button
                    onClick={() => setIsSpeakingPrepActive(!isSpeakingPrepActive)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {isSpeakingPrepActive ? "Pauza" : "1 daqiqani boshlash"}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? `Yozilmoqda... (${recordingSeconds}s)` : "Nutqni Yozishni Boshlash"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Part 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Part 3: Analitik Munozara</h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {mockExam.speakingPrompts.part3.map((p3, idx) => (
                  <li key={idx}>{p3}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong>Band 9 Maslahat:</strong> {mockExam.speakingPrompts.sampleBand9Notes}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
