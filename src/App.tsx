/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Lesson, MockExamData, CertificateData, SiteSettings } from './types';
import { StorageService } from './services/storage';
import { PresenceService } from './services/presence';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SkillsSection } from './components/SkillsSection';
import { LessonModal } from './components/LessonModal';
import { MockExamView } from './components/MockExamView';
import { CertificateView } from './components/CertificateView';
import { CommunityChat } from './components/CommunityChat';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function App() {
  // Session Persistence
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [mockExam, setMockExam] = useState<MockExamData>(StorageService.getMockExam());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [skillFilter, setSkillFilter] = useState<string>('all');

  // Modals
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingLessonForAdmin, setEditingLessonForAdmin] = useState<Lesson | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);

  // Initialize data on mount
  useEffect(() => {
    // Initialize presence tracking
    PresenceService.init();

    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    const storedLessons = StorageService.getLessons();
    setLessons(storedLessons);
    setSiteSettings(StorageService.getSiteSettings());
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handleExploreSkills = (skillId?: string) => {
    if (skillId) {
      setSkillFilter(skillId);
    } else {
      setSkillFilter('all');
    }
    setActiveTab('skills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = () => {
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCertificate = (cert: CertificateData) => {
    setActiveCertificate(cert);
    setActiveTab('certificate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminEditLesson = (lesson: Lesson) => {
    setEditingLessonForAdmin(lesson);
    setAdminModalOpen(true);
    if (selectedLesson) setSelectedLesson(null);
  };

  const handleAdminAddNewLesson = () => {
    setEditingLessonForAdmin(null);
    setAdminModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1-Row 3-Zone Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenAdmin={() => setAdminModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Dynamic View Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              siteSettings={siteSettings}
              onStartExam={handleStartExam}
              onExploreSkills={handleExploreSkills}
            />
            <SkillsSection
              lessons={lessons}
              currentUser={currentUser}
              onSelectLesson={(l) => setSelectedLesson(l)}
              onAddNewLesson={handleAdminAddNewLesson}
              onEditLesson={handleAdminEditLesson}
              onDeleteLesson={(id) => {
                StorageService.deleteLesson(id);
                setLessons(StorageService.getLessons());
              }}
              initialSkillFilter="all"
            />
          </>
        )}

        {activeTab === 'skills' && (
          <SkillsSection
            lessons={lessons}
            currentUser={currentUser}
            onSelectLesson={(l) => setSelectedLesson(l)}
            onAddNewLesson={handleAdminAddNewLesson}
            onEditLesson={handleAdminEditLesson}
            onDeleteLesson={(id) => {
              StorageService.deleteLesson(id);
              setLessons(StorageService.getLessons());
            }}
            initialSkillFilter={skillFilter}
          />
        )}

        {activeTab === 'exam' && (
          <MockExamView
            mockExam={mockExam}
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
            onViewCertificate={handleViewCertificate}
          />
        )}

        {activeTab === 'certificate' && (
          <CertificateView
            initialCertificate={activeCertificate}
            currentUser={currentUser}
            onOpenExam={handleStartExam}
          />
        )}

        {activeTab === 'chat' && (
          <CommunityChat
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white font-display">
                  {siteSettings.siteName}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Ingliz tili C2 Mastery va IELTS Band 9.0 darajasiga tayyorlovchi professional ta'lim platformasi. Cambridge akademik standartlari, video darslar, tushuntirish diagrammalari, to'liq nazariy imtihon va rasmiy sertifikat.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Bo'limlar
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('skills')} className="hover:text-white transition-colors cursor-pointer">
                    Listening & Reading Tahlillari
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('skills')} className="hover:text-white transition-colors cursor-pointer">
                    Writing Task 1 & 2 (C2 Inversion)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('skills')} className="hover:text-white transition-colors cursor-pointer">
                    Speaking Cue Card & Fluency
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('exam')} className="hover:text-white transition-colors cursor-pointer">
                    Cambridge Nazariy Imtihon
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Ishonchlilik
              </h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Interaktiv Simulyator</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>Tekshiriluvchi QR Sertifikat</span>
                </div>
                {/* Admin button strictly visible only to logged-in admin */}
                {currentUser?.role === 'admin' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setAdminModalOpen(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Boshqaruviga O'tish</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} {siteSettings.siteName}. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-1">
              <span>Talabalarga cheksiz mehr bilan yaratilgan</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>
      </footer>

      {/* Lesson View Modal */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          currentUser={currentUser}
          onClose={() => setSelectedLesson(null)}
          onEdit={(l) => handleAdminEditLesson(l)}
        />
      )}

      {/* Auth Modal (Register & Login) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Admin Panel Modal */}
      {adminModalOpen && (
        <AdminPanelModal
          isOpen={adminModalOpen}
          onClose={() => {
            setAdminModalOpen(false);
            setEditingLessonForAdmin(null);
          }}
          lessons={lessons}
          onLessonsChange={(updated) => setLessons(updated)}
          mockExam={mockExam}
          onMockExamChange={(updated) => setMockExam(updated)}
          editingLesson={editingLessonForAdmin}
          onClearEditingLesson={() => setEditingLessonForAdmin(null)}
          siteSettings={siteSettings}
          onSiteSettingsChange={(s) => setSiteSettings(s)}
        />
      )}
    </div>
  );
}
