import React from 'react';
import { 
  Search, 
  Bell, 
  Mail,
  Plus, 
  Menu,
  Layers,
  Sparkles
} from 'lucide-react';
import { Room, RoleKey } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface HeaderProps {
  currentPage: string;
  currentRoom: Room | null;
  currentRoleKey: RoleKey | null;
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onOpenPalette: () => void;
  onOpenNewTask: () => void;
  unreadNotificationsCount?: number;
  notifications?: any[];
  onMarkAllNotificationsRead?: () => void;
  onToggleMobileSidebar?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenPalette,
  onOpenNewTask,
  unreadNotificationsCount = 3,
  onToggleMobileSidebar,
  onShowToast
}) => {
  // 3 distinct header navigation menus, distinct from sidebar items:
  // 1. Dashboard (replaces Cases)
  // 2. Articles (Knowledge Base & Standard Docs)
  // 3. Team (Team Members & Directory)
  const navTabs = [
    { id: 'dash', label: 'Dashboard', page: 'dash', tooltip: 'Dashboard Utama & Alur Kasus' },
    { id: 'artikel', label: 'Articles', page: 'artikel', tooltip: 'Artikel & Dokumentasi Standar' },
    { id: 'members', label: 'Team', page: 'members', tooltip: 'Direktori Tim & Anggota' }
  ];

  const isTabActive = (tab: typeof navTabs[0]) => {
    if (tab.id === 'dash') {
      return currentPage === 'dash' || currentPage === 'dashboard' || currentPage === 'home';
    }
    if (tab.id === 'artikel') {
      return currentPage === 'artikel' || currentPage === 'articles';
    }
    if (tab.id === 'members') {
      return currentPage === 'members' || currentPage === 'team';
    }
    return currentPage === tab.page;
  };

  return (
    <header className="sticky top-0 z-30 w-full py-2.5 bg-[#F4F8FD]/90 backdrop-blur-md border-b border-[#E2EAF3]/80 select-none">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-5 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo matching Image 2 */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-[#3C5A78] hover:bg-white transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onNavigate('dash')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            {/* Geometric logo mark inspired by SugarCRM / modern workspace */}
            <div className="w-7 h-7 rounded-lg bg-[#0A2540] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#0A2540] tracking-tight">
                NIITS
              </span>
              <span className="text-xs font-semibold text-[#5B7288] hidden sm:inline">
                Studio
              </span>
            </div>
          </button>
        </div>

        {/* Center: Exactly 3 Navigation Menus with Solid Black Pill when selected */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navTabs.map((tab) => {
            const isActive = isTabActive(tab);
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.page)}
                title={tab.tooltip}
                className={`transition-all duration-200 cursor-pointer text-xs font-semibold ${
                  isActive
                    ? 'bg-black text-white px-5 py-2 rounded-full shadow-sm hover:brightness-110 active:scale-95'
                    : 'text-[#4A5D70] hover:text-[#0A2540] px-4 py-2 rounded-full hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: When on dashboard, actions are housed in the container's top-right wing; on other pages, display them */}
        <div className="flex items-center justify-end shrink-0 min-w-[36px] sm:min-w-[120px]">
          {currentPage !== 'dash' ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Quick Search Button (Circular) */}
              <button
                onClick={onOpenPalette}
                className="w-9 h-9 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] hover:text-[#0A2540] flex items-center justify-center shadow-2xs transition-transform active:scale-95 cursor-pointer"
                title="Cari cepat (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Mail / Chat Button (Circular) */}
              <button
                onClick={() => onNavigate('chat')}
                className="w-9 h-9 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] hover:text-[#0A2540] flex items-center justify-center shadow-2xs transition-transform active:scale-95 cursor-pointer"
                title="Pesan & Obrolan Tim"
              >
                <Mail className="w-4 h-4" />
              </button>

              {/* Notification Bell Button (Circular with Badge) */}
              <button
                onClick={() => onNavigate('inbox')}
                className="relative w-9 h-9 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] hover:text-[#0A2540] flex items-center justify-center shadow-2xs transition-transform active:scale-95 cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C4562B] ring-2 ring-white" />
                )}
              </button>

              {/* User Profile Avatar in Circle matching Image 2 */}
              <button
                onClick={() => onNavigate('profile')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ring-2 ring-white hover:ring-[#1E6FD9] transition-all cursor-pointer overflow-hidden ml-1"
                style={{ backgroundColor: CURRENT_USER.warna || '#12459C' }}
                title="Buka profil saya"
              >
                {CURRENT_USER.inisial}
              </button>
            </div>
          ) : (
            <div className="hidden lg:block w-9 h-9" />
          )}
        </div>
      </div>
    </header>
  );
};
