import React, { useState } from 'react';
import { Lesson, User } from '../types';
import {
  X,
  Play,
  Presentation,
  FileText,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Layers,
  ArrowRight,
  Edit
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson | null;
  currentUser: User | null;
  onClose: () => void;
  onEdit?: (lesson: Lesson) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  currentUser,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slides' | 'text' | 'quiz'>('video');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  if (!lesson) return null;

  const currentSlide = lesson.slides[currentSlideIndex] || lesson.slides[0];

  const handleSelectAnswer = (qId: string, answer: string) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleCheckQuiz = () => {
    setSubmittedQuiz(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  const calculateQuizScore = () => {
    let score = 0;
    lesson.practiceQuestions.forEach((q) => {
      const userAns = selectedAnswers[q.id]?.trim().toLowerCase();
      const correct = q.correctAnswer.trim().toLowerCase();
      if (userAns === correct) score++;
    });
    return score;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-amber-400 uppercase tracking-wide">
                {lesson.skill.toUpperCase()}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{lesson.level}</span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                {lesson.durationMinutes} daqiqa
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display line-clamp-1">
              {lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.role === 'admin' && onEdit && (
              <button
                onClick={() => onEdit(lesson)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 transition-colors cursor-pointer"
                title="Darsni Tahrirlash (Admin)"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tahrirlash</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1 py-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'video'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Video Dars (YouTube)</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'slides'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Prezentatsiya & Diagramma</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'text'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Mavzu Matni & Qoidalar</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Amaliy Test ({lesson.practiceQuestions.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: VIDEO LESSON EMBED */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?autoplay=0&rel=0`}
                  title={lesson.youtubeTitle || lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {lesson.youtubeTitle || "Video darslik tahlili"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lesson.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                  <span>Maslahat: Videoni to'liq ko'rib, so'ng prezentatsiya va amaliy test bo'limiga o'ting.</span>
                  <button
                    onClick={() => setActiveTab('slides')}
                    className="font-semibold text-slate-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Prezentatsiyaga o'tish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SLIDES & DIAGRAMS */}
          {activeTab === 'slides' && currentSlide && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
                
                {/* Slide Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs uppercase tracking-wider text-slate-400">
                      Slayd {currentSlideIndex + 1} / {lesson.slides.length}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-amber-300 font-display">
                    {currentSlide.title}
                  </h3>
                </div>

                {/* Slide Main Content */}
                <div className="space-y-4">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentSlide.content}
                  </p>

                  {/* Visual Diagram Representation */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Strukturaviy Diagramma / Asosiy Qoidalar
                    </span>
                    <ul className="space-y-2">
                      {currentSlide.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Slide Controls */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Oldingi</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {lesson.slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlideIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          i === currentSlideIndex ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={currentSlideIndex === lesson.slides.length - 1}
                    onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Keyingi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUMMARY TEXT & GRAMMAR */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div className="prose prose-slate max-w-none">
                <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl mb-4">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    Nazariy Xulosa (Summary)
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {lesson.summaryText}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Barcha slaydlar mazmuni:
                  </h4>
                  {lesson.slides.map((s, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {s.title}
                      </h5>
                      <p className="text-xs text-slate-600">{s.content}</p>
                      <div className="pt-2">
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Kalit jihatlar:
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          {s.keyPoints.map((kp, kIdx) => (
                            <li key={kIdx}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRACTICE MINI QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Mavzuni Mustahkamlash Testi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Savollarga javob bering va o'z bilimingizni darhol tekshiring
                  </p>
                </div>
                {submittedQuiz && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900 text-amber-400 rounded-lg tabular-nums">
                      Natija: {calculateQuizScore()} / {lesson.practiceQuestions.length}
                    </span>
                    <button
                      onClick={handleResetQuiz}
                      className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Qayta topshirish
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {lesson.practiceQuestions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all ${
                        submittedQuiz
                          ? isCorrect
                            ? 'bg-emerald-50/50 border-emerald-300'
                            : 'bg-red-50/50 border-red-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {q.question}
                          </p>

                          {/* Multiple Choice Options */}
                          {q.options && q.options.length > 0 && (
                            <div className="space-y-2">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = userAns === opt;
                                const isOptionCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                                if (submittedQuiz) {
                                  if (isOptionCorrect) {
                                    btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold';
                                  } else if (isSelected && !isOptionCorrect) {
                                    btnStyle = 'bg-red-100 border-red-400 text-red-900';
                                  }
                                } else if (isSelected) {
                                  btnStyle = 'bg-slate-900 border-slate-900 text-white font-medium';
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={submittedQuiz}
                                    onClick={() => handleSelectAnswer(q.id, opt)}
                                    className={`w-full text-left px-3.5 py-2 rounded-lg text-xs border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {submittedQuiz && isOptionCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                    )}
                                    {submittedQuiz && isSelected && !isOptionCorrect && (
                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Text Gap Input */}
                          {!q.options && (
                            <div>
                              <input
                                type="text"
                                disabled={submittedQuiz}
                                value={userAns || ''}
                                onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                                placeholder="Javobingizni ingliz tilida yozing..."
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white"
                              />
                            </div>
                          )}

                          {/* Explanation if submitted */}
                          {submittedQuiz && (
                            <div className="p-3 rounded-lg bg-white/80 border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-semibold">
                                {isCorrect ? (
                                  <span className="text-emerald-700">To'g'ri javob!</span>
                                ) : (
                                  <span className="text-red-700">
                                    Noto'g'ri. To'g'ri javob: <strong>{q.correctAnswer}</strong>
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600">
                                <strong>Tushuntirish:</strong> {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!submittedQuiz && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCheckQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Javoblarni Tekshirish</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
