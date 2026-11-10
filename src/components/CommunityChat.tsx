import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { StorageService } from '../services/storage';
import {
  Send,
  Trash2,
  Shield,
  Users,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

import { PresenceService } from '../services/presence';

interface CommunityChatProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({
  currentUser,
  onOpenAuth,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [onlineCount, setOnlineCount] = useState<number>(() => PresenceService.getCurrentCount());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    setMessages(StorageService.getChatMessages());

    // Exact online count subscription
    PresenceService.init();
    const unsubscribe = PresenceService.subscribe((count) => {
      setOnlineCount(count);
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const newMsg = StorageService.sendChatMessage({
      userId: currentUser.id,
      username: currentUser.username,
      fullName: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
      role: currentUser.role,
      text: inputText,
    });

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleDeleteMessage = (msgId: string) => {
    if (currentUser?.role !== 'admin') return;
    StorageService.deleteChatMessage(msgId);
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Chat Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>C2 & IELTS 9.0 O'quvchilar Hamjamiyati</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-0.5">
              Tayyorlaymiz-English Jonli Suhbat & Maslahat
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Savollaringizni bering, tajribali talabalar va admin bilan fikr almashing
            </p>
          </div>

          {/* Online Counter Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-sm shrink-0">
            <Users className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold leading-tight">
                Aniq Holat
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {onlineCount} kishi online
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 stroke-1" />
                <p className="text-xs">Hozircha xabarlar yo'q. Birinchi bo'lib yozing!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = currentUser?.id === msg.userId;
                const isAdmin = msg.role === 'admin';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0 ${
                        isAdmin
                          ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                          : isMe
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isAdmin ? <Shield className="w-4 h-4" /> : msg.fullName.charAt(0) || 'U'}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                      <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                        <span className="font-semibold text-slate-900">
                          {msg.fullName}
                        </span>
                        <span className="text-slate-400">@{msg.username}</span>

                        {isAdmin && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-300">
                            ADMIN
                          </span>
                        )}

                        <span className="text-slate-400 text-[10px]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {/* Admin Delete Action */}
                        {currentUser?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-opacity cursor-pointer"
                            title="Xabarni o'chirish (Admin huquqi)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left break-words ${
                          isMe
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : isAdmin
                            ? 'bg-amber-50/90 text-slate-900 border border-amber-200 rounded-tl-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            {currentUser ? (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="IELTS yoki darslar bo'yicha savolingizni yozing..."
                  className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Yuborish</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between p-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>Chatda xabar yozish uchun ro'yxatdan o'ting yoki tizimga kiring.</span>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Kirish
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
