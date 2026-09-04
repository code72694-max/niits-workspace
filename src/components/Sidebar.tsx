import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2, 
  Upload, 
  Star, 
  Plus, 
  Smartphone, 
  Calendar, 
  Send, 
  AlertTriangle, 
  Moon, 
  Sun,
  LayoutGrid,
  Layers,
  LayoutDashboard,
  FileText,
  User,
  X,
  FolderKanban,
  Users,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Settings,
  Trash2,
  BookOpen,
  Wrench,
  Terminal,
  Activity,
  Check,
  ChevronDown
} from 'lucide-react';
import { Room, RoleKey } from '../types';
import { CURRENT_USER, ROLES_CONFIG } from '../data/mockData';

interface SidebarProps {
  currentPage: string;
  currentRoomId: string;
  currentRoleKey: RoleKey | null;
  rooms: Room[];
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onOpenNewTask?: () => void;
  unreadInboxCount?: number;
  unreadChatCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
  // Article Detail Mode Navigation Props:
  isArticleDetail?: boolean;
  onBackFromArticleDetail?: () => void;
  onPrevArticle?: () => void;
  onNextArticle?: () => void;
  hasPrevArticle?: boolean;
  hasNextArticle?: boolean;
  prevArticleTitle?: string;
  nextArticleTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  currentRoomId,
  currentRoleKey,
  rooms,
  onNavigate,
  onOpenNewTask,
  unreadInboxCount = 3,
  unreadChatCount = 12,
  isMobileOpen = false,
  onCloseMobile,
  onShowToast,
  isArticleDetail = false,
  onBackFromArticleDetail,
  onPrevArticle,
  onNextArticle,
  hasPrevArticle = false,
  hasNextArticle = false,
  prevArticleTitle,
  nextArticleTitle
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Active flyout submenu id: null | 'dash' | 'projects' | 'roles' | 'sprint' | 'docs' | 'tools' | 'chat' | 'inbox' | 'profile'
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [isFlyoutPinned, setIsFlyoutPinned] = useState(false);
  const [flyoutTop, setFlyoutTop] = useState<number>(20);
  const [flyoutLeft, setFlyoutLeft] = useState<number>(76);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // For mobile accordion
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('projects');

  const openFlyout = (id: string, el: HTMLElement, pin = false) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    const rect = el.getBoundingClientRect();
    setFlyoutLeft(rect.right + 10);
    const windowH = window.innerHeight;
    let targetTop = rect.top;
    if (targetTop + 400 > windowH) {
      targetTop = Math.max(16, windowH - 430);
    }
    setFlyoutTop(targetTop);
    setActiveFlyout(id);
    if (pin) {
      setIsFlyoutPinned(true);
    }
  };

  const closeFlyout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveFlyout(null);
    setIsFlyoutPinned(false);
  };

  const handleNavigate = (page: string, params?: any) => {
    closeFlyout();
    onNavigate(page, params);
    if (onCloseMobile) onCloseMobile();
  };

  const handleToggleTheme = (dark: boolean) => {
    setIsDarkMode(dark);
    onShowToast?.(dark ? 'Mode gelap diaktifkan' : 'Mode terang aktif (default)', 'info');
  };

  // Click handler on sidebar items: if it has submenu, hovering then clicking pins it open so it doesn't close!
  const handleItemClick = (
    id: string, 
    e: React.MouseEvent<HTMLButtonElement>, 
    hasSubmenu: boolean, 
    defaultAction?: () => void
  ) => {
    e.stopPropagation();
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (!hasSubmenu) {
      closeFlyout();
      defaultAction?.();
      return;
    }

    // If already open AND pinned, second click on the same button toggles it off
    if (activeFlyout === id && isFlyoutPinned) {
      closeFlyout();
      return;
    }

    // If opened via hover (unpinned) or was closed: click pins it open firmly!
    openFlyout(id, e.currentTarget, true);
  };

  // Hover handlers: open flyout smoothly on hover
  const handleMouseEnterItem = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // If another menu is already pinned by a deliberate click, do not override on casual hover
    if (isFlyoutPinned && activeFlyout && activeFlyout !== id) {
      return;
    }
    openFlyout(id, e.currentTarget, false);
  };

  const handleMouseLeaveItem = () => {
    // If pinned by click, never close on mouse leave!
    if (isFlyoutPinned) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveFlyout(null);
    }, 320);
  };

  const handleMouseEnterFlyout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseLeaveFlyout = () => {
    // If pinned by click, never close on mouse leave!
    if (isFlyoutPinned) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveFlyout(null);
    }, 320);
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFlyout();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 9 Technical Roles list
  const rolesList: { key: RoleKey; label: string; code: string; color: string; fokus: string }[] = [
    { key: 'ba', label: 'Business Analyst', code: 'BA', color: '#7A5AF8', fokus: 'Kebutuhan, alur bisnis & DoD' },
    { key: 'ux', label: 'UI/UX Designer', code: 'UX', color: '#D9488B', fokus: 'Design system, wireframe & prototipe' },
    { key: 'fe', label: 'Frontend Engineer', code: 'FE', color: '#1E6FD9', fokus: 'Antarmuka responsif & state client' },
    { key: 'be', label: 'Backend Engineer', code: 'BE', color: '#0F8E82', fokus: 'API, database, auth & arsitektur' },
    { key: 'qa', label: 'QA Specialist', code: 'QA', color: '#C4562B', fokus: 'Test suite, regresi, load test' },
    { key: 'devops', label: 'DevOps & Cloud', code: 'OPS', color: '#D97706', fokus: 'CI/CD, container, cloud & monitoring' },
    { key: 'sec', label: 'Security Specialist', code: 'SEC', color: '#E11D48', fokus: 'OWASP, enkripsi & vulnerability check' },
  ];

  // Primary top navigation items (moved from Header to Sidebar):
  const primaryNavItems = [
    {
      id: 'dash',
      label: 'Dashboard',
      icon: LayoutDashboard,
      action: () => handleNavigate('dash'),
      active: currentPage === 'dash',
      hasSubmenu: false
    },
    {
      id: 'articles',
      label: 'Articles',
      icon: BookOpen,
      action: () => handleNavigate('articles'),
      active: currentPage === 'articles' || currentPage === 'artikel',
      hasSubmenu: false
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      action: () => handleNavigate('team'),
      active: currentPage === 'team' || currentPage === 'members',
      hasSubmenu: false
    }
  ];

  // The rail items with rich sub-menu triggers (workspace & project operations):
  const railItems = [
    {
      id: 'projects',
      label: 'Proyek & Ruang Tim',
      icon: FolderKanban,
      action: () => handleNavigate('projects'),
      active: currentPage === 'projects' || currentPage === 'board' || currentPage === 'plan' || currentPage === 'project',
      hasSubmenu: false,
      badge: rooms.length
    },
    {
      id: 'roles',
      label: '9 Ruang Disiplin & Peran',
      icon: Users,
      action: () => setActiveFlyout(prev => prev === 'roles' ? null : 'roles'),
      active: currentPage === 'role' || currentPage === 'roles',
      hasSubmenu: true
    },
    {
      id: 'docs',
      label: 'Dokumen & Serahan Proyek',
      icon: Upload,
      action: () => handleNavigate('docs'),
      active: currentPage === 'docs' || currentPage === 'gen',
      hasSubmenu: true
    },
    {
      id: 'inbox',
      label: 'Inbox & Peringatan',
      icon: AlertTriangle,
      action: () => handleNavigate('inbox'),
      active: currentPage === 'inbox' || currentPage === 'trash' || currentPage === 'audit',
      badge: unreadInboxCount,
      hasSubmenu: true
    }
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP: Pure Floating Circular Buttons (No Container)                     */}
      {/* ========================================================================= */}
      <aside 
        className="hidden md:flex flex-col items-center justify-between pt-0 pb-1 shrink-0 z-[60] relative select-none h-full w-10"
      >
        {/* TOP: Bruno PMO Brand Icon or Article Back Button */}
        <div className="w-full flex flex-col items-center pt-[14px]">
          {isArticleDetail ? (
            <button
              onClick={onBackFromArticleDetail}
              className="relative group w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#D5E0ED] text-[#0B1528] shadow-2xs hover:shadow-xs hover:border-[#0B1528] hover:bg-[#F8FAFC] transition-all active:scale-95 cursor-pointer"
              title="Kembali ke Daftar Artikel"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-[#0B1528] group-hover:-translate-x-0.5 transition-transform" />
              <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Kembali ke Daftar Artikel
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('dash')}
              className="relative group w-10 h-10 rounded-full flex items-center justify-center bg-[#0B1528] text-white shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer border border-[#0B1528] hover:ring-2 hover:ring-[#1E6FD9]/40"
              title="Bruno PMO (Home)"
            >
              <span className="font-black text-sm tracking-wider text-white">B</span>
              <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Bruno PMO
              </span>
            </button>
          )}
        </div>

        {/* CENTER: All Menus Vertically Centered (Hidden during Article Detail view) */}
        {!isArticleDetail && (
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 my-auto">
            {/* 1. Primary Menus (Dashboard, Articles, Team) moved from Header */}
            <div className="w-full flex flex-col items-center gap-2">
              {primaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => handleItemClick(item.id, e, !!item.hasSubmenu, item.action)}
                  onMouseEnter={(e) => item.hasSubmenu && handleMouseEnterItem(item.id, e)}
                  onMouseLeave={handleMouseLeaveItem}
                  className={`relative group w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                    item.active || activeFlyout === item.id
                      ? 'btn-3d-icon-active text-white font-medium'
                      : 'bg-white border border-[#D5E0ED] text-[#4A5D70] hover:text-[#0A2540] hover:border-[#B4C6DC] hover:bg-white'
                  }`}
                  title={item.label}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${item.active || activeFlyout === item.id ? 'text-white' : ''}`} />

                  {/* Hover Tooltip when NO flyout is open */}
                  {activeFlyout !== item.id && (
                    <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Subtle separator divider line */}
            <div className="w-5 h-[1.5px] bg-[#D5E0ED] my-1 rounded-full shrink-0" />

            {/* 2. Workspace & Operational Tools */}
            <div className="w-full flex flex-col items-center gap-2">
              {railItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => handleItemClick(item.id, e, !!item.hasSubmenu, item.action)}
                  onMouseEnter={(e) => item.hasSubmenu && handleMouseEnterItem(item.id, e)}
                  onMouseLeave={handleMouseLeaveItem}
                  className={`relative group w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                    item.active || activeFlyout === item.id
                      ? 'btn-3d-icon-active text-white font-medium'
                      : 'bg-white border border-[#D5E0ED] text-[#4A5D70] hover:text-[#0A2540] hover:border-[#B4C6DC] hover:bg-white'
                  }`}
                  title={item.label}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${item.active || activeFlyout === item.id ? 'text-white' : ''}`} />

                  {/* Badge for counts */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#C4562B] text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white shadow-2xs">
                      {item.badge}
                    </span>
                  )}

                  {/* Hover Tooltip when NO flyout is open */}
                  {activeFlyout !== item.id && (
                    <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM: Chat & Saluran Tim or Prev/Next Article Navigation Arrows */}
        <div className="w-full flex flex-col items-center pt-2">
          {isArticleDetail ? (
            <div className="flex flex-col items-center gap-2">
              {/* Back / Previous Article Arrow */}
              <button
                onClick={onPrevArticle}
                disabled={!hasPrevArticle}
                className={`relative group w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs active:scale-95 ${
                  hasPrevArticle
                    ? 'bg-white border border-[#D5E0ED] text-[#0B1528] hover:border-[#0B1528] hover:bg-[#F8FAFC] cursor-pointer'
                    : 'bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                }`}
                title={hasPrevArticle ? `Artikel Sebelumnya: ${prevArticleTitle || ''}` : 'Artikel Pertama'}
              >
                <ChevronLeft className="w-4.5 h-4.5 shrink-0" />
                <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {hasPrevArticle ? `Sebelumnya: ${prevArticleTitle}` : 'Artikel Pertama'}
                </span>
              </button>

              {/* Next Article Arrow */}
              <button
                onClick={onNextArticle}
                disabled={!hasNextArticle}
                className={`relative group w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs active:scale-95 ${
                  hasNextArticle
                    ? 'bg-white border border-[#D5E0ED] text-[#0B1528] hover:border-[#0B1528] hover:bg-[#F8FAFC] cursor-pointer'
                    : 'bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                }`}
                title={hasNextArticle ? `Artikel Berikutnya: ${nextArticleTitle || ''}` : 'Artikel Terakhir'}
              >
                <ChevronRight className="w-4.5 h-4.5 shrink-0" />
                <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {hasNextArticle ? `Berikutnya: ${nextArticleTitle}` : 'Artikel Terakhir'}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => handleItemClick('chat', e, true, () => handleNavigate('chat'))}
              onMouseEnter={(e) => handleMouseEnterItem('chat', e)}
              onMouseLeave={handleMouseLeaveItem}
              className={`relative group w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                currentPage === 'chat' || activeFlyout === 'chat'
                  ? 'bg-[#00A884] text-white shadow-sm ring-2 ring-[#00A884]/40 font-semibold'
                  : 'bg-white border border-[#D5E0ED] text-[#4A5D70] hover:text-[#00A884] hover:border-[#00A884]/60 hover:bg-white'
              }`}
              title="Chat & Saluran Tim"
            >
              <Send className="w-4.5 h-4.5 shrink-0" />

              {/* Badge for unread chats */}
              {unreadChatCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#C4562B] text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white shadow-2xs">
                  {unreadChatCount}
                </span>
              )}

              {/* Hover Tooltip when NO flyout is open */}
              {activeFlyout !== 'chat' && (
                <span className="absolute left-13 px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Chat & Saluran Tim
                </span>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* FLOATING SUBMENU DRAWER / POPOVER ON HOVER / CLICK (Desktop)               */}
      {/* Appears smoothly to the right of the circular buttons                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeFlyout && (
          <>
            {/* Click-outside backdrop at z-40 so aside (z-[60]) and flyout (z-50) stay accessible */}
            <div 
              className="fixed inset-0 z-40 bg-black/[0.02] cursor-default"
              onClick={closeFlyout}
            />

            <motion.div
              ref={flyoutRef}
              initial={{ opacity: 0, x: -10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              onMouseEnter={handleMouseEnterFlyout}
              onMouseLeave={handleMouseLeaveFlyout}
              style={{ top: Math.max(16, flyoutTop), left: flyoutLeft }}
              className="fixed pointer-events-auto w-72 sm:w-80 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D8E1EC] shadow-xl shadow-[#0A2540]/10 p-3.5 z-50 text-[#0A2540] overflow-hidden before:absolute before:-left-3.5 before:top-0 before:bottom-0 before:w-3.5 before:bg-transparent"
            >
              {/* Little left pointer indicator */}
              <div className="absolute -left-1.5 top-5 w-3 h-3 bg-white rotate-45 border-l border-b border-[#D8E1EC]" />

              {/* ------------------------------------------------------------- */}
              {/* 1. DASHBOARD SUBMENU                                          */}
              {/* ------------------------------------------------------------- */}
              {activeFlyout === 'dash' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-[#1E6FD9]" />
                      <span className="text-xs font-bold text-[#0A2540]">Dashboard & Ringkasan</span>
                    </div>
                    <button 
                      onClick={closeFlyout} 
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F4F8FD]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => handleNavigate('dash')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        currentPage === 'dash' ? 'bg-[#0A2540] text-white' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Customer Journeys Dashboard</span>
                      </div>
                      {currentPage === 'dash' && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <button
                      onClick={() => handleNavigate('profile')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        currentPage === 'profile' ? 'bg-[#0A2540] text-white' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Profil Pengguna Saya</span>
                      </div>
                      {currentPage === 'profile' && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <button
                      onClick={() => handleNavigate('inbox')}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold hover:bg-[#F4F8FD] text-[#0A2540] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#C4562B]" />
                        <span>Notifikasi & Peringatan Sprint</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#C4562B] text-white text-[9px] font-bold">
                        {unreadInboxCount}
                      </span>
                    </button>
                  </div>
                </div>
              )}



              {/* ------------------------------------------------------------- */}
              {/* 2. PROJECT / ROOMS SUBMENU (Requested by user)                 */}
              {/* ------------------------------------------------------------- */}
              {activeFlyout === 'projects' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-[#1E6FD9]" />
                      <span className="text-xs font-bold text-[#0A2540]">Proyek & Ruang Tim</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#F4F8FD] text-[#1E6FD9] text-[10px] font-bold border border-[#D8E1EC]">
                        {rooms.length} Ruang
                      </span>
                    </div>
                    <button 
                      onClick={closeFlyout} 
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F4F8FD]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* List of rooms */}
                  <div className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
                    {rooms.map((room) => {
                      const isActiveRoom = currentRoomId === room.id;
                      return (
                        <div
                          key={room.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isActiveRoom 
                              ? 'bg-[#F4F8FD] border-[#1E6FD9]/40 shadow-xs' 
                              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'dashboard' })}
                              className="flex items-center gap-2 text-left flex-1 min-w-0 group cursor-pointer"
                            >
                              <span 
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: room.warna || '#1E6FD9' }}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#0A2540] truncate group-hover:text-[#1E6FD9]">
                                    {room.nama}
                                  </span>
                                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#EAEFF5] text-[#5B7288]">
                                    {room.kode}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#5B7288] block truncate">
                                  {room.selesai}/{room.tugas} tugas selesai ({room.akses})
                                </span>
                              </div>
                            </button>

                            {isActiveRoom && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#0F8E82]/10 text-[#0F8E82] text-[9px] font-bold shrink-0">
                                Aktif
                              </span>
                            )}
                          </div>

                          {/* Quick sub-menu shortcuts for this project */}
                          <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-[#EAEFF5] text-[10px]">
                            <button
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'dashboard' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#0A2540] font-semibold"
                              title="Dashboard awal proyek"
                            >
                              Dashboard
                            </button>
                            <button
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'board' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#0A2540] font-medium"
                              title="Papan Kanban sprint"
                            >
                              Board
                            </button>
                            <button
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'calendar' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#0A2540] font-medium"
                              title="Kalender deadline proyek"
                            >
                              Kalender
                            </button>
                            <button
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'docs' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#0A2540] font-medium"
                              title="Dokumen & folder serahan"
                            >
                              Dokumen
                            </button>
                            <button
                              onClick={() => handleNavigate('settings', { room: room.id })}
                              className="px-1.5 py-0.5 rounded hover:bg-[#F4F8FD] text-[#5B7288] ml-auto"
                              title="Pengaturan ruang"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom quick links */}
                  <div className="pt-2 border-t border-[#EAEFF5] flex items-center justify-between">
                    <button
                      onClick={() => handleNavigate('plan')}
                      className="text-xs font-semibold text-[#1E6FD9] hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Denah Semua Ruang</span>
                    </button>
                    <button
                      onClick={() => onShowToast?.('Membuka modal tambah ruang proyek', 'info')}
                      className="text-[11px] font-semibold text-[#0A2540] hover:text-[#1E6FD9] flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ruang Baru</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 3. ROLES / 9 DISIPLIN SUBMENU                                 */}
              {/* ------------------------------------------------------------- */}
              {activeFlyout === 'roles' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#7A5AF8]" />
                      <span className="text-xs font-bold text-[#0A2540]">9 Ruang Disiplin & Peran</span>
                    </div>
                    <button 
                      onClick={closeFlyout} 
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F4F8FD]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1">
                    {rolesList.map((r) => {
                      const isSelected = currentRoleKey === r.key && currentPage === 'role';
                      return (
                        <button
                          key={r.key}
                          onClick={() => handleNavigate('role', { role: r.key })}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                            isSelected 
                              ? 'bg-[#0A2540] text-white shadow-xs' 
                              : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span 
                              className="w-6 h-6 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs"
                              style={{ backgroundColor: r.color }}
                            >
                              {r.code}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold block truncate">
                                {r.label}
                              </span>
                              <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-[#5B7288]'}`}>
                                {r.fokus}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#EAEFF5]">
                    <button
                      onClick={() => handleNavigate('roles')}
                      className="w-full py-1.5 rounded-lg bg-[#F4F8FD] hover:bg-[#EAEFF5] text-center text-xs font-semibold text-[#0A2540] transition-colors"
                    >
                      Buka Ringkasan Matriks Peran
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 5. DOCUMENTS SUBMENU                                          */}
              {/* ------------------------------------------------------------- */}
              {activeFlyout === 'docs' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#1E6FD9]" />
                      <span className="text-xs font-bold text-[#0A2540]">Dokumen & Serahan</span>
                    </div>
                    <button 
                      onClick={closeFlyout} 
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F4F8FD]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigate('docs')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentPage === 'docs' ? 'bg-[#0A2540] text-white font-bold' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#1E6FD9]" />
                        <div>
                          <span className="font-semibold block">Serahan Dokumen Proyek</span>
                          <span className={`text-[10px] ${currentPage === 'docs' ? 'text-white/70' : 'text-[#5B7288]'}`}>
                            Berkas spesifikasi tiap ruang kerja
                          </span>
                        </div>
                      </div>
                      {currentPage === 'docs' && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <button
                      onClick={() => handleNavigate('gen')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentPage === 'gen' ? 'bg-[#0A2540] text-white font-bold' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-[#7A5AF8]" />
                        <div>
                          <span className="font-semibold block">Generator Dokumen AI</span>
                          <span className={`text-[10px] ${currentPage === 'gen' ? 'text-white/70' : 'text-[#5B7288]'}`}>
                            PRD, SRS, BRD, UI/UX Spec, ADR
                          </span>
                        </div>
                      </div>
                      {currentPage === 'gen' && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 8. INBOX / ALERTS SUBMENU                                     */}
              {/* ------------------------------------------------------------- */}
              {activeFlyout === 'inbox' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#C4562B]" />
                      <span className="text-xs font-bold text-[#0A2540]">Kotak Masuk & Sistem</span>
                    </div>
                    <button 
                      onClick={closeFlyout} 
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F4F8FD]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigate('inbox')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentPage === 'inbox' ? 'bg-[#0A2540] text-white font-bold' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-[#C4562B]" />
                        <span>Kotak Masuk Notifikasi</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#C4562B] text-white text-[9px] font-bold">
                        {unreadInboxCount}
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavigate('audit')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentPage === 'audit' ? 'bg-[#0A2540] text-white font-bold' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="w-4 h-4 text-[#0F8E82]" />
                        <span>Log Audit & Aktivitas</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate('trash')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentPage === 'trash' ? 'bg-[#0A2540] text-white font-bold' : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Trash2 className="w-4 h-4 text-[#94A3B8]" />
                        <span>Tong Sampah</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 9. CHAT & SALURAN TIM SUBMENU                                 */}
              {/* ------------------------------------------------------------- */}
              {activeFlyout === 'chat' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#00A884]" />
                      <span className="text-xs font-bold text-[#0A2540]">Chat & Saluran Tim</span>
                    </div>
                    <button 
                      onClick={closeFlyout} 
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F4F8FD]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B7288] px-1 pt-1">
                      Saluran Tim
                    </div>
                    <button
                      onClick={() => handleNavigate('chat', { chatId: 'c-agro' })}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs hover:bg-[#F4F8FD] text-[#0A2540] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1E6FD9]" />
                        <span className="font-semibold"># agro-sprint</span>
                      </div>
                      <span className="text-[10px] text-[#5B7288]">Tim Inti</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('chat', { chatId: 'c-qa' })}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs hover:bg-[#F4F8FD] text-[#0A2540] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C4562B]" />
                        <span className="font-semibold"># qa-security</span>
                      </div>
                      <span className="text-[10px] text-[#5B7288]">Bug & Vuln</span>
                    </button>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B7288] px-1 pt-1">
                      Chat Pribadi
                    </div>
                    <button
                      onClick={() => handleNavigate('chat', { chatId: 'dm-u3' })}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs hover:bg-[#F4F8FD] text-[#0A2540] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                        <span className="font-semibold">Bambang Wijaya (BE)</span>
                      </div>
                      <span className="text-[10px] text-[#00A884] font-bold">Baru</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('chat')}
                      className="w-full py-2 mt-2 rounded-xl bg-[#0A2540] text-white text-center text-xs font-semibold hover:bg-[#00A884] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Buka Halaman Chat & Saluran</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER: For Responsive Mobile Screens                              */}
      {/* With expandable sub-sections so mobile users also get all features        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-80 bg-[#EAEFF5] border-r border-[#D8E1EC] p-4 flex flex-col justify-between z-50 shadow-2xl overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D8E1EC]">
                  {isArticleDetail ? (
                    <button
                      onClick={() => {
                        onBackFromArticleDetail?.();
                        onCloseMobile?.();
                      }}
                      className="flex items-center gap-2 px-2 py-1 -ml-1 text-[#0A2540] font-semibold text-xs hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#0A2540]" />
                      <span>Kembali ke Artikel</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0B1528] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                        B
                      </div>
                      <span className="font-extrabold text-sm text-[#0A2540]">Bruno PMO</span>
                    </div>
                  )}
                  <button onClick={onCloseMobile} className="p-1.5 rounded-lg text-[#5B7288] hover:bg-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Article Detail Quick Prev / Next Navigator */}
                {isArticleDetail && (
                  <div className="p-2 rounded-xl bg-white border border-[#CBD7E6] flex items-center justify-between gap-2 shadow-2xs">
                    <button
                      onClick={() => onPrevArticle?.()}
                      disabled={!hasPrevArticle}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#0B1528] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Sebelum</span>
                    </button>
                    <span className="text-[11px] font-medium text-[#64748B]">Navigasi Detail</span>
                    <button
                      onClick={() => onNextArticle?.()}
                      disabled={!hasNextArticle}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#0B1528] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>Berikut</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* The 3 Main Navigation Pills (Dashboard, Articles, Team) */}
                <div className="bg-[#DFE7F1] p-1 rounded-full border border-[#CBD7E6] flex items-center gap-1 shadow-inner">
                  <button
                    onClick={() => handleNavigate('dash')}
                    className={`flex-1 py-2 px-2.5 rounded-full text-xs font-bold text-center transition-all ${
                      currentPage === 'dash'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-[#3E5166] hover:text-[#0A2540] hover:bg-white/60'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigate('articles')}
                    className={`flex-1 py-2 px-2.5 rounded-full text-xs font-bold text-center transition-all ${
                      currentPage === 'articles' || currentPage === 'artikel'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-[#3E5166] hover:text-[#0A2540] hover:bg-white/60'
                    }`}
                  >
                    Articles
                  </button>
                  <button
                    onClick={() => handleNavigate('team')}
                    className={`flex-1 py-2 px-2.5 rounded-full text-xs font-bold text-center transition-all ${
                      currentPage === 'team' || currentPage === 'members'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-[#3E5166] hover:text-[#0A2540] hover:bg-white/60'
                    }`}
                  >
                    Team
                  </button>
                </div>

                {/* Profil Direct Link */}
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    currentPage === 'profile' ? 'bg-[#0A2540] text-white shadow-xs' : 'text-[#4A5D70] hover:bg-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profil Saya</span>
                </button>

                {/* Chat & Saluran Tim Direct Link */}
                <button
                  onClick={() => handleNavigate('chat')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    currentPage === 'chat' ? 'bg-[#00A884] text-white shadow-xs' : 'text-[#4A5D70] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Send className="w-4 h-4 text-[#00A884]" />
                    <span>Chat & Saluran Tim</span>
                  </div>
                  {unreadChatCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C4562B] text-white text-[10px] font-bold">
                      {unreadChatCount}
                    </span>
                  )}
                </button>

                {/* Accordion 1: Proyek & Ruang Tim */}
                <div className="rounded-xl bg-white border border-[#D8E1EC] overflow-hidden">
                  <button
                    onClick={() => setMobileExpandedSection(prev => prev === 'projects' ? null : 'projects')}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0A2540]"
                  >
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-[#1E6FD9]" />
                      <span>Proyek & Ruang Tim ({rooms.length})</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'projects' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileExpandedSection === 'projects' && (
                    <div className="p-2 pt-0 space-y-1 border-t border-[#EAEFF5]">
                      <button
                        onClick={() => {
                          handleNavigate('projects');
                          onCloseMobile();
                        }}
                        className="w-full my-1.5 py-1.5 px-3 rounded-lg bg-[#0B1528] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#1E6FD9] transition-all"
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                        <span>Buka Halaman Daftar Proyek</span>
                      </button>
                      {rooms.map((room) => (
                        <div key={room.id} className="p-2 rounded-lg bg-[#F8FAFC] border border-[#EAEFF5] text-xs">
                          <button
                            onClick={() => handleNavigate('project', { room: room.id, tab: 'dashboard' })}
                            className="w-full text-left font-bold text-[#0A2540] flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: room.warna }} />
                            <span>{room.nama}</span>
                          </button>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                            <button 
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'dashboard' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC] font-semibold"
                            >
                              Dashboard
                            </button>
                            <button 
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'board' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC]"
                            >
                              Board
                            </button>
                            <button 
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'calendar' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC]"
                            >
                              Kalender
                            </button>
                            <button 
                              onClick={() => handleNavigate('project', { room: room.id, tab: 'docs' })}
                              className="px-2 py-0.5 rounded bg-white border border-[#D8E1EC]"
                            >
                              Dokumen
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 2: 9 Ruang Disiplin */}
                <div className="rounded-xl bg-white border border-[#D8E1EC] overflow-hidden">
                  <button
                    onClick={() => setMobileExpandedSection(prev => prev === 'roles' ? null : 'roles')}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0A2540]"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#7A5AF8]" />
                      <span>9 Ruang Disiplin & Peran</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'roles' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileExpandedSection === 'roles' && (
                    <div className="p-2 pt-0 grid grid-cols-2 gap-1.5 border-t border-[#EAEFF5]">
                      {rolesList.map((r) => (
                        <button
                          key={r.key}
                          onClick={() => handleNavigate('role', { role: r.key })}
                          className="p-2 rounded-lg bg-[#F8FAFC] border border-[#EAEFF5] text-left text-xs font-semibold text-[#0A2540] flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                          <span className="truncate">{r.code} - {r.label.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 3: Fitur Kerja */}
                <div className="rounded-xl bg-white border border-[#D8E1EC] overflow-hidden">
                  <button
                    onClick={() => setMobileExpandedSection(prev => prev === 'views' ? null : 'views')}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0A2540]"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#1E6FD9]" />
                      <span>Fitur Kerja & Tampilan</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'views' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileExpandedSection === 'views' && (
                    <div className="p-2 pt-0 space-y-1 border-t border-[#EAEFF5]">
                      <button onClick={() => handleNavigate('board')} className="w-full p-2 text-left text-xs text-[#0A2540] hover:bg-[#F8FAFC] rounded-lg">
                        Kanban Sprint Board
                      </button>
                      <button onClick={() => handleNavigate('list')} className="w-full p-2 text-left text-xs text-[#0A2540] hover:bg-[#F8FAFC] rounded-lg">
                        Daftar Tugas (List View)
                      </button>
                      <button onClick={() => handleNavigate('cal')} className="w-full p-2 text-left text-xs text-[#0A2540] hover:bg-[#F8FAFC] rounded-lg">
                        Kalender Sprint
                      </button>
                      <button onClick={() => handleNavigate('plan')} className="w-full p-2 text-left text-xs text-[#0A2540] hover:bg-[#F8FAFC] rounded-lg">
                        Denah Ruang Proyek
                      </button>
                      <button onClick={() => handleNavigate('members')} className="w-full p-2 text-left text-xs text-[#0A2540] hover:bg-[#F8FAFC] rounded-lg">
                        Anggota & Tim
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Theme Mode Switcher */}
              <div className="pt-4 mt-4 border-t border-[#D8E1EC] flex items-center justify-between">
                <span className="text-xs text-[#5B7288] font-medium">Tema Tampilan</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleTheme(true)}
                    className="p-1.5 rounded-full hover:bg-white text-[#5B7288]"
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleTheme(false)}
                    className="p-1.5 rounded-full bg-black text-white"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
