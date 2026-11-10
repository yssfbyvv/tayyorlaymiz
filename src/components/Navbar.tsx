import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  LogOut,
  LogIn,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

import { PresenceService } from '../services/presence';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  activeTab,
  setActiveTab,
}) => {
  const [onlineCount, setOnlineCount] = useState<number>(() => PresenceService.getCurrentCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact real-time active user subscription
  useEffect(() => {
    PresenceService.init();
    const unsubscribe = PresenceService.subscribe((count) => {
      setOnlineCount(count);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { id: 'home', label: 'Bosh sahifa' },
    { id: 'skills', label: 'IELTS Darslari' },
    { id: 'exam', label: 'Nazariy Imtihon' },
    { id: 'certificate', label: 'Sertifikat' },
    { id: 'chat', label: 'Hamjamiyat Chat' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  Tayyorlaymiz-English
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium ml-2">
                  C2 & IELTS 9.0
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 ${
                  activeTab === link.id
                    ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Online users + Auth Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Online Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-900 tabular-nums">{onlineCount}</span>
              <span className="text-slate-500">online</span>
            </div>

            {/* Admin Badge/Button if logged in as Admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                title="Admin Boshqaruv Paneli"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-left">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {currentUser.firstName.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      @{currentUser.username} {currentUser.age ? `· ${currentUser.age} yosh` : ''}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Chiqish (Logout)"
                  aria-label="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Kirish</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Ro'yxatdan o'tish</span>
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500 bg-slate-50 rounded-lg mb-2">
              <span>Hozirda faol foydalanuvchilar:</span>
              <span className="font-semibold text-slate-900">{onlineCount} online</span>
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === link.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
