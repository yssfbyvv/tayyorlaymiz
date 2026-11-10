import React, { useState } from 'react';
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Award,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';

import { SiteSettings } from '../types';

interface HeroSectionProps {
  onStartExam: () => void;
  onExploreSkills: (skill?: string) => void;
  siteSettings?: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartExam,
  onExploreSkills,
  siteSettings,
}) => {
  const [showDiagramModal, setShowDiagramModal] = useState(false);

  const heroBadge = siteSettings?.heroBadge || "O'zbekistondagi Eng Yuqori Natijali Dastur";
  const heroTitle = siteSettings?.heroTitle || "English C2 & IELTS Band 9.0 Darajasiga Tayyorlaymiz";
  const heroDescription = siteSettings?.heroDescription || "Noldan boshlab yoki C1 dan C2 darajaga ko'tariling. Har bir mavzuga doir interaktiv video darslar, tushuntirish diagrammalari, Cambridge formati bo'yicha to'liq nazariy imtihon va rasmiy sertifikat.";
  const heroImageUrl = siteSettings?.heroImageUrl || "/src/assets/images/hero_tayyorlaymiz_ielts_1794322273039.jpg";

  const pillars = [
    {
      id: 'listening',
      name: 'Listening (Tinglash)',
      target: 'Band 9.0 · 40/40',
      desc: "British & American aksentlar, distractorlarni tanib olish, xarita va shakl to'ldirish texnikasi.",
      icon: Headphones,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-700',
    },
    {
      id: 'reading',
      name: "Reading (O'qish)",
      target: 'Academic 9.0',
      desc: "True/False/Not Given sirlari, skimming-scanning, ilmiy matnlarni 15 daqiqada tahlil qilish.",
      icon: BookOpen,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-700',
    },
    {
      id: 'writing',
      name: 'Writing (Yozish)',
      target: 'Task 1 & 2 · C2 Level',
      desc: "Diagramma tahlili, Inversion & Cleft gaplar, kam uchraydigan akademik lug'at (rare lexical items).",
      icon: PenTool,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-700',
    },
    {
      id: 'speaking',
      name: 'Speaking (Nutq)',
      target: 'Fluency & Idioms',
      desc: "Part 2 monolog va Part 3 analitik savollarga to'xtovsiz, tabiiy va idiomatik javob berish.",
      icon: Mic,
      color: 'from-purple-500/10 to-violet-500/10 text-purple-700',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{heroBadge}</span>
              <span aria-hidden="true">·</span>
              <span>Cambridge C2 Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.15]">
              {heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {heroDescription}
            </p>

            {/* Quick Proof Points */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>To'liq 4 ta ko'nikma (L, R, W, S)</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real vaqtli IELTS nazariy imtihoni</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Admin boshqaruvida yangilanuvchi darslar</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartExam}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Nazariy Imtihonni Boshlash</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onExploreSkills()}
                className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Darslarni O'rganish</span>
              </button>

              <button
                onClick={() => setShowDiagramModal(true)}
                className="flex items-center gap-2 px-4 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-medium rounded-xl transition-all cursor-pointer"
                title="IELTS 9.0 Ko'nikmalar Blueprint Diagrammasini Ko'rish"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Metodika xaritasi</span>
              </button>
            </div>
          </div>

          {/* Right Image Column with Study Hall Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 aspect-[16/10] lg:aspect-[4/3] group">
              <img
                src={heroImageUrl}
                alt="Tayyorlaymiz-English IELTS 9.0 Academic Library"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
                  Oxford & Cambridge Standarti
                </span>
                <p className="text-sm font-medium text-slate-100 mt-1">
                  Har kuni yuzlab talabalar orzu qilgan 9.0 ball sari intilmoqda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => onExploreSkills(pillar.id)}
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {pillar.target}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-amber-700 transition-colors">
                    {pillar.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>Darslar & Amaliyot</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Blueprint Skills Diagram Modal */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="text-base font-bold font-display">
                  English Proficiency Mastery & IELTS 9.0 Blueprint
                </h3>
                <p className="text-xs text-slate-300">
                  Platformaning to'liq 4 ko'nikmali metodologiya strukturasi
                </p>
              </div>
              <button
                onClick={() => setShowDiagramModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 bg-slate-950 flex items-center justify-center">
              <img
                src="/src/assets/images/diagram_ielts_skills_1794322273830.jpg"
                alt="English Proficiency Blueprint"
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600">
              Ushbu o'quv dasturi Cambridge University Press va British Council standartlari asosida tuzilgan.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
