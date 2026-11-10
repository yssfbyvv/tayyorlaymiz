import React, { useState } from 'react';
import { Lesson, SkillType, User } from '../types';
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookmarkCheck,
  Search,
  Plus,
  Play,
  Clock,
  Sparkles,
  Trash2,
  Edit
} from 'lucide-react';

interface SkillsSectionProps {
  lessons: Lesson[];
  currentUser: User | null;
  onSelectLesson: (lesson: Lesson) => void;
  onAddNewLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  initialSkillFilter?: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  lessons,
  currentUser,
  onSelectLesson,
  onAddNewLesson,
  onEditLesson,
  onDeleteLesson,
  initialSkillFilter = 'all',
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>(initialSkillFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'Barchasi' },
    { id: 'listening', label: 'Listening' },
    { id: 'reading', label: 'Reading' },
    { id: 'writing', label: 'Writing' },
    { id: 'speaking', label: 'Speaking' },
    { id: 'grammar', label: 'Grammar & C2' },
  ];

  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case 'listening':
        return Headphones;
      case 'reading':
        return BookOpen;
      case 'writing':
        return PenTool;
      case 'speaking':
        return Mic;
      case 'grammar':
      default:
        return BookmarkCheck;
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSkill = selectedSkill === 'all' || lesson.skill === selectedSkill;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesSearch;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>IELTS 9.0 O'quv Dasturi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Ko'nikmalar & Maxsus Masterclasslar
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Har bir ko'nikma uchun amaliy video darslar, tushuntirish slaydlari va interaktiv mashqlar
            </p>
          </div>

          {currentUser?.role === 'admin' && (
            <button
              onClick={onAddNewLesson}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Yangi Dars Qo'shish (Admin)</span>
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto w-full sm:w-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSkill(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedSkill === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Darslarni qidirish..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 shadow-2xl/5"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              Hech qanday dars topilmadi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Qidiruv so'zini o'zgartiring yoki boshqa bo'limni tanlang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const Icon = getSkillIcon(lesson.skill);
              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Top Meta */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          {lesson.skill}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{lesson.durationMinutes} daq</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {lesson.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {lesson.description}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {lesson.level}
                      </span>
                      <span>·</span>
                      <span>{lesson.slides.length} ta slayd</span>
                      <span>·</span>
                      <span>{lesson.practiceQuestions.length} ta test</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectLesson(lesson)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Darsni Boshlash</span>
                    </button>

                    {/* Admin quick actions */}
                    {currentUser?.role === 'admin' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditLesson(lesson)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteLesson(lesson.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
