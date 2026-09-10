import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Layers, 
  FileText, 
  Users, 
  Terminal, 
  ArrowUpRight, 
  CheckCircle2, 
  Send,
  X,
  Clock,
  Briefcase,
  SlidersHorizontal,
  Bookmark,
  Hash,
  MessageSquare,
  Sparkles,
  ChevronRight,
  User as UserIcon,
  GraduationCap
} from 'lucide-react';
import { Task, Room, DocItem, RoleKey } from '../types';
import { 
  ROLES_CONFIG, 
  INITIAL_ROOMS, 
  INITIAL_DOCS, 
  INITIAL_CHANNELS, 
  CURRENT_USER, 
  INITIAL_ARTICLES,
  USERS_MAP 
} from '../data/mockData';

export type SearchTab = 'all' | 'tasks' | 'docs' | 'rooms' | 'chat' | 'actions';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  rooms?: Room[];
  docs?: DocItem[];
  onSelectTask?: (task: Task) => void;
  onOpenTask?: (task: Task) => void;
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onOpenNewTask: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks = [],
  rooms = INITIAL_ROOMS,
  docs = INITIAL_DOCS,
  onSelectTask,
  onOpenTask,
  onNavigate,
  onOpenNewTask
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [filterAssignedToMe, setFilterAssignedToMe] = useState(false);
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);
  const [filterInProgressOnly, setFilterInProgressOnly] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleTaskClick = (task: Task) => {
    onClose();
    if (onSelectTask) {
      onSelectTask(task);
    } else if (onOpenTask) {
      onOpenTask(task);
    }
  };

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const q = query.toLowerCase().trim();

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filterAssignedToMe && !t.assignee?.includes(CURRENT_USER.id)) return false;
      if (filterUrgentOnly && t.prioritas !== 'urgent' && t.prioritas !== 'high') return false;
      if (filterInProgressOnly && t.status !== 'jalan') return false;

      if (!q) return true;
      return (
        t.nama.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (t.deskripsi && t.deskripsi.toLowerCase().includes(q)) ||
        (ROLES_CONFIG[t.peran]?.label.toLowerCase().includes(q))
      );
    });
  }, [tasks, q, filterAssignedToMe, filterUrgentOnly, filterInProgressOnly]);

  // Filter Rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      if (!q) return true;
      return (
        r.nama.toLowerCase().includes(q) ||
        r.kode.toLowerCase().includes(q) ||
        r.ringkas.toLowerCase().includes(q)
      );
    });
  }, [rooms, q]);

  // Filter Docs & Articles
  const filteredDocs = useMemo(() => {
    const combinedDocs = [
      ...docs.map(d => ({ ...d, isArticle: false })),
      ...INITIAL_ARTICLES.map(a => ({
        id: a.id,
        nama: a.judul,
        halaman: Math.ceil((a.ringkas || '').length / 50) || 3,
        penulis: USERS_MAP[a.penulis]?.nama || 'Tim',
        waktu: a.waktu,
        room: 'artikel',
        isArticle: true
      }))
    ];

    return combinedDocs.filter(d => {
      if (!q) return true;
      return (
        d.nama.toLowerCase().includes(q) ||
        d.penulis.toLowerCase().includes(q)
      );
    });
  }, [docs, q]);

  // Filter Channels
  const filteredChannels = useMemo(() => {
    return INITIAL_CHANNELS.filter(c => {
      if (!q) return true;
      return (
        c.nama.toLowerCase().includes(q) ||
        c.ringkas.toLowerCase().includes(q)
      );
    });
  }, [q]);

  // Quick Action Commands
  const quickActions = useMemo(() => {
    const list = [
      { 
        id: 'action-new-task', 
        label: 'Buat Tugas Baru', 
        sub: 'Buka modal pembuatan tugas baru dengan assign per room & peran', 
        action: () => { onClose(); onOpenNewTask(); }, 
        icon: Plus, 
        key: 'N',
        badge: 'Tugas'
      },
      { 
        id: 'action-dash', 
        label: 'Buka Dasbor Ringkasan', 
        sub: 'Lihat metrik beban jam kerja, sprint burndown, dan log aktivitas', 
        action: () => { onClose(); onNavigate('dash'); }, 
        icon: Layers, 
        key: 'D',
        badge: 'Dasbor'
      },
      { 
        id: 'action-profile', 
        label: 'Buka Profil Saya', 
        sub: 'Kelola identitas, riwayat proyek, matriks keahlian teknis, dan keamanan akun', 
        action: () => { onClose(); onNavigate('profile'); }, 
        icon: UserIcon, 
        key: 'P',
        badge: 'Akun'
      },
      { 
        id: 'action-chat', 
        label: 'Buka Chat & Saluran Tim', 
        sub: 'Saluran obrolan tim, pesan langsung (DM), dan diskusi', 
        action: () => { onClose(); onNavigate('chat'); }, 
        icon: Send, 
        key: 'C',
        badge: 'Komunikasi'
      },
      { 
        id: 'action-api', 
        label: 'Uji API (REST & Bruno Test)', 
        sub: 'Klien pengujian API REST lokal, staging, dan simulasi endpoint', 
        action: () => { onClose(); onNavigate('api'); }, 
        icon: Terminal, 
        key: 'A',
        badge: 'Alat Dev'
      },
      { 
        id: 'action-gen', 
        label: 'Generator Dokumen & PRD', 
        sub: 'Buat dokumen PRD, BRD, DoD, dan panduan arsitektur otomatis', 
        action: () => { onClose(); onNavigate('gen'); }, 
        icon: FileText, 
        key: 'G',
        badge: 'Dokumen'
      },
      { 
        id: 'action-members', 
        label: 'Daftar Semua Anggota & Profil', 
        sub: 'Katalog seluruh anggota tim, keahlian teknis (Skill), rekam jejak proyek, dan performa tepat waktu', 
        action: () => { onClose(); onNavigate('members'); }, 
        icon: Users, 
        key: 'M',
        badge: 'Tim'
      },
      { 
        id: 'action-learning', 
        label: 'Learning Hub & LMS Tim', 
        sub: 'Silabus pelatihan teknik, sertifikasi, matriks skill tim, dan progres upgrade kompetensi', 
        action: () => { onClose(); onNavigate('learning'); }, 
        icon: GraduationCap, 
        key: 'L',
        badge: 'LMS'
      }
    ];

    if (!q) return list;
    return list.filter(item => 
      item.label.toLowerCase().includes(q) || 
      item.sub.toLowerCase().includes(q)
    );
  }, [q, onClose, onOpenNewTask, onNavigate]);

  // Aggregate results based on activeTab
  const flatSelectableItems = useMemo(() => {
    const items: Array<{
      type: 'task' | 'room' | 'doc' | 'channel' | 'action';
      data: any;
      onExecute: () => void;
    }> = [];

    if (activeTab === 'all' || activeTab === 'actions') {
      quickActions.forEach(a => {
        items.push({ type: 'action', data: a, onExecute: a.action });
      });
    }

    if (activeTab === 'all' || activeTab === 'tasks') {
      filteredTasks.slice(0, activeTab === 'tasks' ? 25 : 8).forEach(t => {
        items.push({ type: 'task', data: t, onExecute: () => handleTaskClick(t) });
      });
    }

    if (activeTab === 'all' || activeTab === 'rooms') {
      filteredRooms.slice(0, activeTab === 'rooms' ? 12 : 4).forEach(r => {
        items.push({ 
          type: 'room', 
          data: r, 
          onExecute: () => { onClose(); onNavigate('room', { room: r.id }); } 
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'docs') {
      filteredDocs.slice(0, activeTab === 'docs' ? 15 : 4).forEach(d => {
        items.push({ 
          type: 'doc', 
          data: d, 
          onExecute: () => { onClose(); onNavigate(d.isArticle ? 'artikel' : 'docs'); } 
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'chat') {
      filteredChannels.slice(0, activeTab === 'chat' ? 15 : 4).forEach(c => {
        items.push({ 
          type: 'channel', 
          data: c, 
          onExecute: () => { onClose(); onNavigate('chat'); } 
        });
      });
    }

    return items;
  }, [activeTab, quickActions, filteredTasks, filteredRooms, filteredDocs, filteredChannels, onClose, onNavigate]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < flatSelectableItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, flatSelectableItems.length - 1)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatSelectableItems[selectedIndex]) {
          flatSelectableItems[selectedIndex].onExecute();
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Cycle tabs
        const tabs: SearchTab[] = ['all', 'tasks', 'docs', 'rooms', 'chat', 'actions'];
        const curIdx = tabs.indexOf(activeTab);
        const nextIdx = (curIdx + 1) % tabs.length;
        setActiveTab(tabs[nextIdx]);
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatSelectableItems, selectedIndex, activeTab, onClose]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= flatSelectableItems.length && flatSelectableItems.length > 0) {
      setSelectedIndex(0);
    }
  }, [flatSelectableItems.length, selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A2540]/50 backdrop-blur-xs transition-opacity"
        />

        {/* ClickUp-style Command Center Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E2EAF3] overflow-hidden flex flex-col max-h-[82vh] z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Bar */}
          <div className="p-4 sm:p-5 border-b border-[#EFF4F9] bg-[#FCFDFE]">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-[#1E6FD9] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Cari tugas, SOP/dokumen, room, percakapan, atau aksi cepat..."
                className="flex-1 bg-transparent text-sm sm:text-base text-[#0A2540] placeholder-[#5B7288] focus:outline-none font-normal"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-[#5B7288] hover:text-[#0A2540] hover:bg-[#EFF4F9] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-white border border-[#D7E6F5] text-[#5B7288] shadow-xs">
                  ESC
                </kbd>
              </div>
            </div>

            {/* ClickUp Category Tabs */}
            <div className="flex items-center gap-1 mt-3.5 pt-3 border-t border-[#EFF4F9] overflow-x-auto no-scrollbar text-xs">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'tasks', label: `Tugas (${filteredTasks.length})` },
                { id: 'docs', label: `Dokumen (${filteredDocs.length})` },
                { id: 'rooms', label: `Room (${filteredRooms.length})` },
                { id: 'chat', label: `Chat (${filteredChannels.length})` },
                { id: 'actions', label: 'Aksi Cepat' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as SearchTab);
                      setSelectedIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#1E6FD9] text-white shadow-xs'
                        : 'text-[#5B7288] hover:text-[#0A2540] hover:bg-[#F4F8FD]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick ClickUp Scope Filters (Tugas) */}
            {(activeTab === 'all' || activeTab === 'tasks') && (
              <div className="flex items-center gap-2 mt-2.5 pt-2 text-[11px] text-[#5B7288] flex-wrap">
                <span className="flex items-center gap-1 text-[#3C5A78] font-medium">
                  <SlidersHorizontal className="w-3 h-3 text-[#1E6FD9]" /> Filter Cepat:
                </span>
                <button
                  onClick={() => setFilterAssignedToMe(!filterAssignedToMe)}
                  className={`px-2 py-0.5 rounded-full border transition-all ${
                    filterAssignedToMe 
                      ? 'bg-[#E7F0FA] border-[#1E6FD9] text-[#1E6FD9] font-medium' 
                      : 'bg-white border-[#E2EAF3] text-[#5B7288] hover:border-[#1E6FD9]'
                  }`}
                >
                  Ditugaskan ke Saya
                </button>
                <button
                  onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
                  className={`px-2 py-0.5 rounded-full border transition-all ${
                    filterUrgentOnly 
                      ? 'bg-rose-50 border-rose-500 text-rose-600 font-medium' 
                      : 'bg-white border-[#E2EAF3] text-[#5B7288] hover:border-rose-400'
                  }`}
                >
                  Urgent / Tinggi
                </button>
                <button
                  onClick={() => setFilterInProgressOnly(!filterInProgressOnly)}
                  className={`px-2 py-0.5 rounded-full border transition-all ${
                    filterInProgressOnly 
                      ? 'bg-amber-50 border-amber-500 text-amber-700 font-medium' 
                      : 'bg-white border-[#E2EAF3] text-[#5B7288] hover:border-amber-400'
                  }`}
                >
                  Sedang Dikerjakan
                </button>
                {(filterAssignedToMe || filterUrgentOnly || filterInProgressOnly) && (
                  <button
                    onClick={() => {
                      setFilterAssignedToMe(false);
                      setFilterUrgentOnly(false);
                      setFilterInProgressOnly(false);
                    }}
                    className="text-[10.5px] text-[#1E6FD9] hover:underline"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Container */}
          <div 
            ref={listContainerRef}
            className="flex-1 overflow-y-auto divide-y divide-[#EFF4F9] p-2 space-y-3 focus:outline-none"
          >
            {/* Empty Search: Show Recent & Suggested */}
            {!q && !filterAssignedToMe && !filterUrgentOnly && !filterInProgressOnly && activeTab === 'all' && (
              <div className="p-3 mb-2 bg-[#F4F8FD]/60 rounded-xl border border-[#E2EAF3]/70 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#3C5A78]">
                  <Sparkles className="w-4 h-4 text-[#1E6FD9]" />
                  <span>Pencarian Cepat ClickUp Style &bull; Navigasi cepat ke tugas, dokumen SOP, atau room</span>
                </div>
                <span className="text-[11px] text-[#5B7288]">Tekan &uarr;&darr; lalu Enter</span>
              </div>
            )}

            {/* List rendered by categories */}
            {flatSelectableItems.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F4F8FD] border border-[#E2EAF3] flex items-center justify-center mx-auto mb-3 text-[#5B7288]">
                  <Search className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-[#0A2540]">
                  Tidak ada hasil ditemukan
                </p>
                <p className="text-xs text-[#5B7288] mt-1 max-w-sm mx-auto">
                  Tidak ada data yang cocok dengan &ldquo;{query}&rdquo; pada kategori yang dipilih.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {flatSelectableItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;

                  // Render Action Item
                  if (item.type === 'action') {
                    const action = item.data;
                    const Icon = action.icon;
                    return (
                      <div
                        key={action.id}
                        onClick={item.onExecute}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#1E6FD9] text-white shadow-sm' 
                            : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-[#E7F0FA] text-[#1E6FD9] group-hover:bg-[#1E6FD9] group-hover:text-white'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{action.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF4F9] text-[#5B7288]'
                            }`}>
                              {action.badge}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#5B7288]'}`}>
                            {action.sub}
                          </p>
                        </div>
                        <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          isSelected ? 'bg-white/20 text-white border border-white/30' : 'bg-white border border-[#E2EAF3] text-[#5B7288]'
                        }`}>
                          {action.key}
                        </kbd>
                      </div>
                    );
                  }

                  // Render Task Item
                  if (item.type === 'task') {
                    const t: Task = item.data;
                    const roleInfo = ROLES_CONFIG[t.peran];
                    const roomInfo = rooms.find(r => r.id === t.roomId);

                    return (
                      <div
                        key={t.id}
                        onClick={item.onExecute}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#1E6FD9] text-white shadow-sm' 
                            : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                        }`}
                      >
                        <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF4F9] text-[#3C5A78]'
                        }`}>
                          {t.id}
                        </span>

                        <span 
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0" 
                          style={{ backgroundColor: roleInfo?.color || '#1E6FD9' }}
                          title={roleInfo?.label}
                        >
                          {roleInfo?.kode || 'TK'}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold truncate">{t.nama}</span>
                            {roomInfo && (
                              <span className={`hidden sm:inline-block text-[10.5px] px-1.5 py-0.2 rounded ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-white border border-[#E2EAF3] text-[#5B7288]'
                              }`}>
                                {roomInfo.nama}
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 text-[10.5px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#5B7288]'}`}>
                            <span className="capitalize">{t.status}</span>
                            <span>&bull;</span>
                            <span>Est: {t.estimasi}</span>
                            {t.due && (
                              <>
                                <span>&bull;</span>
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> {t.due}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : t.prioritas === 'urgent' 
                              ? 'bg-rose-100 text-rose-700' 
                              : t.prioritas === 'high' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-[#E7F0FA] text-[#1E6FD9]'
                        }`}>
                          {t.prioritas}
                        </span>
                      </div>
                    );
                  }

                  // Render Room Item
                  if (item.type === 'room') {
                    const r: Room = item.data;
                    return (
                      <div
                        key={r.id}
                        onClick={item.onExecute}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#1E6FD9] text-white shadow-sm' 
                            : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                        }`}
                      >
                        <span 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0"
                          style={{ backgroundColor: r.warna }}
                        >
                          {r.kode}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{r.nama}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded capitalize ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF4F9] text-[#5B7288]'
                            }`}>
                              {r.akses}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#5B7288]'}`}>
                            {r.ringkas} &bull; {r.tugas} total tugas ({r.selesai} selesai)
                          </p>
                        </div>
                        <ArrowUpRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#5B7288]'}`} />
                      </div>
                    );
                  }

                  // Render Doc / Article Item
                  if (item.type === 'doc') {
                    const d = item.data;
                    return (
                      <div
                        key={d.id}
                        onClick={item.onExecute}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#1E6FD9] text-white shadow-sm' 
                            : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF4F9] text-[#5B7288]'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold truncate">{d.nama}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {d.isArticle ? 'SOP & Artikel' : 'Dokumen'}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#5B7288]'}`}>
                            Penulis: {d.penulis} &bull; {d.halaman} halaman &bull; {d.waktu}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#5B7288]'}`} />
                      </div>
                    );
                  }

                  // Render Channel Item
                  if (item.type === 'channel') {
                    const c = item.data;
                    return (
                      <div
                        key={c.id}
                        onClick={item.onExecute}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#1E6FD9] text-white shadow-sm' 
                            : 'hover:bg-[#F4F8FD] text-[#0A2540]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF4F9] text-[#1E6FD9]'
                        }`}>
                          <Hash className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{c.nama}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded capitalize ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF4F9] text-[#5B7288]'
                            }`}>
                              {c.lingkup}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#5B7288]'}`}>
                            {c.ringkas} &bull; {c.anggota?.length || 4} anggota
                          </p>
                        </div>
                        <MessageSquare className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#5B7288]'}`} />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>

          {/* ClickUp Bottom Shortcuts Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-t border-[#E2EAF3] bg-[#F4F8FD] text-[11px] text-[#5B7288]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-[#E2EAF3] rounded text-[10px]">&uarr;&darr;</kbd> navigasi
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-[#E2EAF3] rounded text-[10px]">&crarr;</kbd> pilih
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-[#E2EAF3] rounded text-[10px]">TAB</kbd> ganti tab
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10.5px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Universal Search</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
