import React, { useState } from 'react';
import { Lesson, MockExamData, User, SkillType, SiteSettings } from '../types';
import { StorageService } from '../services/storage';
import {
  X,
  ShieldAlert,
  BookOpen,
  FileText,
  Users,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Save,
  RotateCcw,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
  mockExam: MockExamData;
  onMockExamChange: (exam: MockExamData) => void;
  editingLesson?: Lesson | null;
  onClearEditingLesson?: () => void;
  siteSettings: SiteSettings;
  onSiteSettingsChange: (settings: SiteSettings) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  lessons,
  onLessonsChange,
  mockExam,
  onMockExamChange,
  editingLesson = null,
  onClearEditingLesson,
  siteSettings,
  onSiteSettingsChange,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'lessons' | 'exam' | 'users' | 'chat'>('settings');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  // Lesson Edit Form State
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>(
    editingLesson || {
      skill: 'listening',
      title: '',
      level: 'IELTS 9.0',
      description: '',
      durationMinutes: 20,
      youtubeId: '',
      youtubeTitle: '',
      summaryText: '',
      slides: [
        {
          title: 'Asosiy tushuncha',
          content: 'Ushbu darsning markaziy qoidasi...',
          keyPoints: ['1-muhim jihat', '2-muhim jihat'],
          diagramType: 'flowchart',
        },
      ],
      practiceQuestions: [
        {
          id: 'q_' + Date.now(),
          type: 'multiple-choice',
          question: 'Namunaviy savol matni?',
          options: ['Variant A', 'Variant B', 'Variant C'],
          correctAnswer: 'Variant A',
          explanation: "Tushuntirish: Chunki qoidaga ko'ra...",
        },
      ],
    }
  );
  const [isEditingLesson, setIsEditingLesson] = useState<boolean>(!!editingLesson);

  // Exam Edit Form State
  const [examForm, setExamForm] = useState<MockExamData>(mockExam);

  // Users & Chat
  const [usersList, setUsersList] = useState<User[]>(StorageService.getUsers());
  const [chatList, setChatList] = useState(StorageService.getChatMessages());

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // SETTINGS SAVE
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSiteSettings(settingsForm);
    onSiteSettingsChange(settingsForm);
    showSuccess("Saytning asosiy matnlari va sozlamalari yangilandi!");
  };

  // LESSON ACTIONS
  const handleStartEditLesson = (lesson: Lesson) => {
    setLessonForm({ ...lesson });
    setIsEditingLesson(true);
    setActiveTab('lessons');
  };

  const handleStartNewLesson = () => {
    setLessonForm({
      id: 'lesson_' + Date.now(),
      skill: 'listening',
      title: '',
      level: 'IELTS 9.0',
      description: '',
      durationMinutes: 20,
      youtubeId: '',
      youtubeTitle: '',
      summaryText: '',
      slides: [
        {
          title: '1. Kirish va Qoidalar',
          content: 'Dars mazmuni...',
          keyPoints: ['Nuqta 1', 'Nuqta 2'],
          diagramType: 'flowchart',
        },
      ],
      practiceQuestions: [
        {
          id: 'q_' + Date.now(),
          type: 'multiple-choice',
          question: 'Savol matni?',
          options: ['A', 'B', 'C'],
          correctAnswer: 'A',
          explanation: 'Tushuntirish',
        },
      ],
    });
    setIsEditingLesson(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title?.trim()) return;

    const finalLesson: Lesson = {
      id: lessonForm.id || 'lesson_' + Date.now(),
      skill: (lessonForm.skill as SkillType) || 'listening',
      title: lessonForm.title.trim(),
      level: lessonForm.level || 'IELTS 9.0',
      description: lessonForm.description || '',
      durationMinutes: Number(lessonForm.durationMinutes) || 15,
      youtubeId: lessonForm.youtubeId?.trim() || 'sRFEVzy_sH0',
      youtubeTitle: lessonForm.youtubeTitle || lessonForm.title,
      summaryText: lessonForm.summaryText || '',
      slides: lessonForm.slides || [],
      practiceQuestions: lessonForm.practiceQuestions || [],
    };

    StorageService.saveLesson(finalLesson);
    const updated = StorageService.getLessons();
    onLessonsChange(updated);
    setIsEditingLesson(false);
    if (onClearEditingLesson) onClearEditingLesson();
    showSuccess("Dars muvaffaqiyatli saqlandi va barchaga ko'rinadigan bo'ldi!");
  };

  const handleDeleteLesson = (id: string) => {
    if (!confirm("Haqiqatdan ham ushbu darsni o'chirmoqchimisiz?")) return;
    StorageService.deleteLesson(id);
    const updated = StorageService.getLessons();
    onLessonsChange(updated);
    showSuccess("Dars o'chirildi!");
  };

  // EXAM ACTIONS
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveMockExam(examForm);
    onMockExamChange(examForm);
    showSuccess("Nazariy Imtihon o'zgarishlari saqlandi!");
  };

  // CHAT ACTIONS
  const handleDeleteChatMessage = (id: string) => {
    StorageService.deleteChatMessage(id);
    setChatList(StorageService.getChatMessages());
    showSuccess("Xabar o'chirildi!");
  };

  const handleClearAllChat = () => {
    if (!confirm("Barcha chat xabarlarini o'chirib yubormoqchimisiz?")) return;
    StorageService.clearAllChat();
    setChatList([]);
    showSuccess("Barcha xabarlar tozalandi!");
  };

  // USER ACTIONS
  const handleDeleteUser = (userId: string) => {
    if (!confirm("Foydalanuvchini o'chirmoqchimisiz?")) return;
    StorageService.deleteUser(userId);
    setUsersList(StorageService.getUsers());
    showSuccess("Foydalanuvchi o'chirildi!");
  };

  // RESET DATABASE
  const handleResetDefaults = () => {
    if (!confirm("Barcha darslar va ma'lumotlarni asl holatiga qaytarishni xohlaysizmi?")) return;
    StorageService.resetLessons();
    onLessonsChange(StorageService.getLessons());
    showSuccess("Platforma boshlang'ich ma'lumotlarga qaytarildi!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-white">
                  Boshqaruv Paneli (Admin: bilolbekpr)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-400 text-slate-950 rounded uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Barcha matnlar, bannerlar, darslar, testlar va xabarlarni tahrirlash huquqi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => { setActiveTab('settings'); setIsEditingLesson(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sayt Sozlamalari & Matnlar</span>
            </button>

            <button
              onClick={() => { setActiveTab('lessons'); setIsEditingLesson(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'lessons' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Darslarni Boshqarish ({lessons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'exam' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Nazariy Imtihon Testlari</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setUsersList(StorageService.getUsers()); }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Foydalanuvchilar ({usersList.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('chat'); setChatList(StorageService.getChatMessages()); }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chat' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Hamjamiyat Chat ({chatList.length})</span>
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="text-[11px] text-slate-500 hover:text-red-700 flex items-center gap-1 cursor-pointer shrink-0"
            title="Dastlabki ma'lumotlarni tiklash"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Dastlabki holatga qaytarish</span>
          </button>
        </div>

        {/* Success Notice Notification */}
        {successNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 0: SITE SETTINGS & MAIN TEXTS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Saytning Barcha Asosiy Matnlarini O'zgartirish
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bosh sahifadagi barcha sarlavhalar, shiorlar, tavsiflar va rasmlarni xohlagancha o'zgartiring
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>O'zgarishlarni Saqlash</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sayt Nomi
                  </label>
                  <input
                    type="text"
                    value={settingsForm.siteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Asosiy Banner Shiori (Kichik Badge)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroBadge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Katta Asosiy Sarlavha (Hero Title)
                </label>
                <input
                  type="text"
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Asosiy Tavsif Matni (Hero Description)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.heroDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bosh Sahifa Rasmi URL Havolasi</span>
                </label>
                <input
                  type="text"
                  value={settingsForm.heroImageUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                  placeholder="/src/assets/images/... yoki boshqa rasm havolasi"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Barcha Sozlamalarni Saqlash</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: LESSONS MANAGEMENT */}
          {activeTab === 'lessons' && (
            <div>
              {isEditingLesson ? (
                /* Edit/Create Lesson Form */
                <form onSubmit={handleSaveLesson} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {lessonForm.id ? "Darsni Tahrirlash" : "Yangi Dars Qo'shish"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingLesson(false)}
                      className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Ko'nikma (Skill)
                      </label>
                      <select
                        value={lessonForm.skill}
                        onChange={(e) => setLessonForm({ ...lessonForm, skill: e.target.value as SkillType })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="listening">Listening</option>
                        <option value="reading">Reading</option>
                        <option value="writing">Writing</option>
                        <option value="speaking">Speaking</option>
                        <option value="grammar">Grammar & C2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Daraja (Level)
                      </label>
                      <input
                        type="text"
                        value={lessonForm.level || ''}
                        onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                        placeholder="IELTS 9.0 yoki C2 Mastery"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Davomiyligi (Daqiqa)
                      </label>
                      <input
                        type="number"
                        value={lessonForm.durationMinutes || 20}
                        onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Dars Sarlavhasi
                    </label>
                    <input
                      type="text"
                      required
                      value={lessonForm.title || ''}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      placeholder="Dars nomi..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        YouTube Video ID (Masalan: bA9y1g2M6z8)
                      </label>
                      <input
                        type="text"
                        value={lessonForm.youtubeId || ''}
                        onChange={(e) => setLessonForm({ ...lessonForm, youtubeId: e.target.value })}
                        placeholder="YouTube ID..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        https://youtube.com/watch?v=<strong>ID</strong> qismidagi kod
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        YouTube Video Sarlavhasi
                      </label>
                      <input
                        type="text"
                        value={lessonForm.youtubeTitle || ''}
                        onChange={(e) => setLessonForm({ ...lessonForm, youtubeTitle: e.target.value })}
                        placeholder="Video darslik nomi..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Dars Tavsifi (Qisqa)
                    </label>
                    <textarea
                      rows={2}
                      value={lessonForm.description || ''}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mavzu Matni & Qoidalar (Summary)
                    </label>
                    <textarea
                      rows={4}
                      value={lessonForm.summaryText || ''}
                      onChange={(e) => setLessonForm({ ...lessonForm, summaryText: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsEditingLesson(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Lessons List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Barcha Yuklangan Darslar ({lessons.length} ta)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Admin sifatida siz istalgan darsni o'zgartirishingiz yoki yangisini qo'shishingiz mumkin
                      </p>
                    </div>
                    <button
                      onClick={handleStartNewLesson}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Yangi Dars Yaratish</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-amber-700 uppercase">
                              {lesson.skill}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">{lesson.level}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">{lesson.durationMinutes} daqiqa</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            YouTube ID: <code className="bg-slate-200 px-1 rounded">{lesson.youtubeId}</code>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleStartEditLesson(lesson)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Tahrirlash</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXAM MANAGEMENT */}
          {activeTab === 'exam' && (
            <form onSubmit={handleSaveExam} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nazariy Imtihon Sozlamalari & Matnlari
                  </h3>
                  <p className="text-xs text-slate-500">
                    Imtihondagi matnlar, savollar va to'g'ri javoblarni tahrirlash
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Imtihonni Saqlash</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Imtihon Nomi
                  </label>
                  <input
                    type="text"
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Vaqt Chegarasi (Daqiqa)
                  </label>
                  <input
                    type="number"
                    value={examForm.timeLimitMinutes}
                    onChange={(e) => setExamForm({ ...examForm, timeLimitMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Listening Passage */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-blue-800 uppercase">
                  Listening Bo'limi Sozlamalari
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Sarlavha</label>
                    <input
                      type="text"
                      value={examForm.listeningPassage.title}
                      onChange={(e) =>
                        setExamForm({
                          ...examForm,
                          listeningPassage: { ...examForm.listeningPassage, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">YouTube Audio ID</label>
                    <input
                      type="text"
                      value={examForm.listeningPassage.youtubeId}
                      onChange={(e) =>
                        setExamForm({
                          ...examForm,
                          listeningPassage: { ...examForm.listeningPassage, youtubeId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Audio Transkripti</label>
                  <textarea
                    rows={3}
                    value={examForm.listeningPassage.audioTranscript}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        listeningPassage: { ...examForm.listeningPassage, audioTranscript: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Reading Passage */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 uppercase">
                  Reading Bo'limi Sozlamalari
                </h4>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Matn Sarlavhasi</label>
                  <input
                    type="text"
                    value={examForm.readingPassage.title}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        readingPassage: { ...examForm.readingPassage, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Matn Mazmuni</label>
                  <textarea
                    rows={5}
                    value={examForm.readingPassage.passageText}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        readingPassage: { ...examForm.readingPassage, passageText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-serif"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: USERS LIST */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ro'yxatdan O'tgan Foydalanuvchilar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Platformadagi barcha foydalanuvchilar va ularning hisoblari
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100 text-slate-900 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Ism Familya</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Yosh</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Sana</th>
                      <th className="p-3 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="p-3 font-mono text-slate-700">@{u.username}</td>
                        <td className="p-3 tabular-nums">{u.age || '-'}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          {u.username !== 'bilolbekpr' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CHAT MODERATION */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Hamjamiyat Chat Xabarlarini Boshqarish
                  </h3>
                  <p className="text-xs text-slate-500">
                    Istalgan xabarni o'chirish yoki barcha chatni tozalash
                  </p>
                </div>
                {chatList.length > 0 && (
                  <button
                    onClick={handleClearAllChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Barcha xabarlarni tozalash</span>
                  </button>
                )}
              </div>

              {chatList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                  Hozircha xabarlar yo'q
                </div>
              ) : (
                <div className="space-y-2">
                  {chatList.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-slate-900">{msg.fullName}</strong>
                          <span className="text-slate-400">@{msg.username}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700">{msg.text}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteChatMessage(msg.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
