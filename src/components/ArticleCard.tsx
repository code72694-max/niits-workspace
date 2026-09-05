import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  BookOpen, 
  Heart, 
  Bookmark, 
  Copy, 
  ArrowUpRight, 
  Check 
} from 'lucide-react';
import { Article } from '../types';
import { USERS_MAP } from '../data/mockData';

export interface ArticleCardProps {
  article: Article;
  isSelected?: boolean;
  onClick: () => void;
  onToggleLike?: (id: string, e?: React.MouseEvent) => void;
  onToggleBookmark?: (id: string, e?: React.MouseEvent) => void;
  isBookmarked?: boolean;
  onExportMedium?: (article: Article) => void;
  className?: string;
}

// Map label id to human readable name
const LABEL_NAMES: Record<string, string> = {
  personal: 'Personal',
  marketing: 'Marketing',
  sop: 'SOP',
  devops: 'DevOps',
  sec: 'Security',
  fe: 'Frontend',
  be: 'Backend',
  onboard: 'Onboarding',
  data: 'Database',
  ux: 'Design / UX',
  qa: 'QA & Test',
  ba: 'Business Analyst'
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isSelected = false,
  onClick,
  onToggleLike,
  onToggleBookmark,
  isBookmarked = false,
  onExportMedium,
  className = ''
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 1200);
  };

  // Fallback avatars if not provided
  const author = USERS_MAP[article.penulis];
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80'
  ];
  const avatarList = article.collaborators && article.collaborators.length > 0 
    ? article.collaborators 
    : defaultAvatars;

  // Tools list for right badges
  const tools = article.tools && article.tools.length > 0 
    ? article.tools 
    : ['gmail', 'chatgpt', 'todoist'];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer h-full ${
        isSelected
          ? 'border-[#1E6FD9] ring-2 ring-[#1E6FD9]/20 shadow-[0_12px_28px_rgba(30,111,217,0.12)]'
          : 'border-[#E2E8F0]/80 hover:border-[#CBD5E1] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)]'
      } ${className}`}
    >
      {/* ========================================================================= */}
      {/* TOP ROW: TIME AGO • ACTIVE STATUS + MORE OPTIONS BUTTON                   */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between gap-2">
          {/* Time Ago • Active Status */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] font-medium">
            <span>{article.waktu || '5 days ago'}</span>
            <span className="text-[#CBD5E1] text-[10px]">•</span>
            <span className="text-[#475569] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {article.statusText || (article.status === 'terbit' ? 'Active' : 'Draft')}
            </span>
          </div>

          {/* Three-dot action button */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={handleMenuToggle}
              aria-label="Menu Opsi Artikel"
              className="w-7 h-7 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0]/70 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Quick Action Dropdown Popup */}
            {menuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-1.5 z-50 text-xs text-[#334155] space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer text-[#0B1528]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#1E6FD9]" />
                  <span>Baca Artikel</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike?.(article.id, e);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer text-[#0B1528]"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className={`w-3.5 h-3.5 ${article.sukaSaya ? 'fill-[#E11D48] text-[#E11D48]' : 'text-slate-500'}`} />
                    <span>{article.sukaSaya ? 'Batal Suka' : 'Suka'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{article.like}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark?.(article.id, e);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer text-[#0B1528]"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#1E6FD9] text-[#1E6FD9]' : 'text-slate-500'}`} />
                  <span>{isBookmarked ? 'Hapus Simpan' : 'Simpan'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer text-[#0B1528]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Disalin!' : 'Salin Tautan'}</span>
                </button>

                {onExportMedium && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onExportMedium(article);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer text-[#0B1528]"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ekspor Medium</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Title */}
        <h3 className="text-[15.5px] sm:text-[16px] font-bold text-[#0B1528] tracking-tight leading-snug group-hover:text-[#1E6FD9] transition-colors line-clamp-2 mt-2.5">
          {article.judul}
        </h3>

        {/* Thin Subtle Divider */}
        <div className="w-full h-px bg-[#F1F5F9] my-2.5" />

        {/* Summary / Excerpt */}
        <p className="text-[12.5px] sm:text-[13px] text-[#64748B] leading-relaxed line-clamp-2">
          {article.ringkas}
        </p>

        {/* Rounded Pill Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {article.label.slice(0, 3).map((tag) => {
            const formattedName = LABEL_NAMES[tag.toLowerCase()] || tag;
            return (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full border border-[#E2E8F0] text-[#475569] text-[11px] font-medium bg-[#FAFAFA] hover:bg-slate-100 transition-colors"
              >
                {formattedName}
              </span>
            );
          })}
          {article.label.length > 3 && (
            <span className="text-[10px] text-[#94A3B8] font-medium self-center pl-0.5">
              +{article.label.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM FOOTER: AVATARS STACK (LEFT) + TOOL SQUIRCLES (RIGHT)              */}
      {/* ========================================================================= */}
      <div className="mt-4 pt-3 border-t border-[#F8FAFC] flex items-center justify-between gap-2">
        {/* Left: Avatar Stack with 3 overlapping avatars + count */}
        <div className="flex items-center -space-x-1.5">
          {avatarList.slice(0, 3).map((avatarUrl, idx) => (
            <img
              key={idx}
              src={avatarUrl}
              alt="Member"
              className="w-6.5 h-6.5 rounded-full ring-2 ring-white object-cover shadow-2xs"
            />
          ))}
          <span className="w-6.5 h-6.5 rounded-full bg-[#F8FAFC] ring-2 ring-white text-[#475569] text-[10px] font-bold flex items-center justify-center border border-[#E2E8F0]/70 shadow-2xs">
            +3
          </span>
        </div>

        {/* Right: Integration Squircles (Gmail, ChatGPT / OpenAI, Todoist / Tools) */}
        <div className="flex items-center -space-x-1">
          {tools.map((toolKey) => {
            if (toolKey === 'gmail') {
              return (
                <div
                  key="gmail"
                  title="Gmail Integration"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#1F1F1F] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path fill="#4285F4" d="M1.5 5.5v13a2 2 0 0 0 2 2h2.5V11L1.5 7.5z" />
                    <path fill="#34A853" d="M18 20.5h2.5a2 2 0 0 0 2-2v-13l-4.5 3.5v11.5z" />
                    <path fill="#EA4335" d="M18 7.5L12 12 6 7.5V5a2 2 0 0 1 3.2-1.6L12 5.5l2.8-2.1A2 2 0 0 1 18 5v2.5z" />
                    <path fill="#FBBC04" d="M6 7.5V20.5H3.5a2 2 0 0 1-2-2v-11L6 7.5z" opacity="0.15" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'chatgpt' || toolKey === 'openai') {
              return (
                <div
                  key="chatgpt"
                  title="ChatGPT / AI Integration"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#111111] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M20.5 10.2a5.4 5.4 0 0 0-.46-4.38 5.57 5.57 0 0 0-4.83-2.77 5.3 5.3 0 0 0-1.78.3 5.5 5.5 0 0 0-3.9-1.85 5.6 5.6 0 0 0-5.3 3.84 5.38 5.38 0 0 0-3.3 2.4A5.5 5.5 0 0 0 .5 10.8a5.53 5.53 0 0 0 2.2 4.38 5.4 5.4 0 0 0 .46 4.38 5.57 5.57 0 0 0 4.83 2.77 5.3 5.3 0 0 0 1.78-.3 5.5 5.5 0 0 0 3.9 1.85 5.6 5.6 0 0 0 5.3-3.84 5.38 5.38 0 0 0 3.3-2.4 5.5 5.5 0 0 0 .43-3.06 5.53 5.53 0 0 0-2.2-4.38zM12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-6-2a4 4 0 0 1 3.5-3.95v.35a2.5 2.5 0 0 0 2.5 2.5h.35a4 4 0 0 1-6.35 1.1zm7.85-4.5a4 4 0 0 1 3.35 2.2 4 4 0 0 1-.85 4.85l-.25-.2a2.5 2.5 0 0 0-3.5-1v-.35a4 4 0 0 1 1.25-5.5zm4.65 6.5a4 4 0 0 1-3.5 3.95v-.35a2.5 2.5 0 0 0-2.5-2.5h-.35a4 4 0 0 1 6.35-1.1zm-7.85 4.5a4 4 0 0 1-3.35-2.2 4 4 0 0 1 .85-4.85l.25.2a2.5 2.5 0 0 0 3.5 1v.35a4 4 0 0 1-1.25 5.5z" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'todoist') {
              return (
                <div
                  key="todoist"
                  title="Todoist / Workflow Integration"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#E44233] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M4 7l4 4 12-12L22 1 8 15 2 9l2-2zm0 6l4 4 12-12 2 2-14 14-6-6 2-2zm0 6l4 4 12-12 2 2-14 14-6-6 2-2z" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'github') {
              return (
                <div
                  key="github"
                  title="GitHub"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#181717] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'slack') {
              return (
                <div
                  key="slack"
                  title="Slack"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#4A154B] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5zm2-8a2 2 0 1 1-2 2V7h2zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h7zm8 2a2 2 0 1 1 2 2h-2v-2zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v7zm-2 8a2 2 0 1 1 2-2v2h-2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h7a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-7z" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'notion') {
              return (
                <div
                  key="notion"
                  title="Notion"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#000000] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.735c-.466-.373-.933-.606-2.053-.513L3.106 2.341c-.327.047-.42.233-.28.373l1.633 1.494zm-.326 2.753v14.137c0 .653.373.98 1.12.933l13.774-.793c.746-.047.933-.513.933-1.073V6.027c0-.56-.233-.84-.793-.793l-14.24.84c-.56.046-.794.326-.794.887zm11.897.886c.093.42 0 .84-.42.887l-.746.14v10.592c-.466.28-.933.42-1.353.42-.653 0-.84-.187-1.353-.84l-4.526-7.092v6.626l1.213.28c.093.42 0 .84-.42.886l-3.36.187c-.093-.42 0-.84.42-.887l.84-.186V8.414l-1.073-.093c-.093-.42 0-.84.42-.887l3.5-.233 4.666 7.185V8.181l-1.12-.14c-.093-.42 0-.84.42-.887l3.08-.187z" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'figma') {
              return (
                <div
                  key="figma"
                  title="Figma"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#000000] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path fill="#F24E1E" d="M8 2h4v5H8a2.5 2.5 0 0 1 0-5z" />
                    <path fill="#FF7262" d="M12 2h4a2.5 2.5 0 0 1 0 5h-4V2z" />
                    <path fill="#A259FF" d="M8 7h4v5H8a2.5 2.5 0 0 1 0-5z" />
                    <path fill="#1ABCFE" d="M12 7h4a2.5 2.5 0 0 1 0 5h-4V7z" />
                    <path fill="#0ACF83" d="M8 12h4v2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 1-2.5z" />
                  </svg>
                </div>
              );
            }

            if (toolKey === 'medium') {
              return (
                <div
                  key="medium"
                  title="Medium"
                  className="w-6.5 h-6.5 rounded-[7px] bg-[#000000] ring-1 ring-white flex items-center justify-center shadow-xs"
                >
                  <span className="text-white font-serif font-bold text-[11px]">M</span>
                </div>
              );
            }

            // Default fall-through tool
            return (
              <div
                key={toolKey}
                className="w-6.5 h-6.5 rounded-[7px] bg-[#1E293B] ring-1 ring-white flex items-center justify-center text-white text-[9px] font-bold shadow-xs"
              >
                {toolKey.slice(0, 2).toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
