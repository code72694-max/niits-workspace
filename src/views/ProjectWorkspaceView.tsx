import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderKanban, 
  Layers, 
  Smartphone, 
  Calendar as CalendarIcon, 
  FileText, 
  ListFilter, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Search, 
  UploadCloud, 
  ExternalLink, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
  Tag,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { Room, Task, RoleKey, TaskStatus } from '../types';
import { ROLES_CONFIG, USERS_MAP, ROOMS_MAP } from '../data/mockData';
import { BoardView } from './BoardView';
import { CalendarView } from './CalendarView';
import { ProjectDocsView } from './ProjectDocsView';
import { ListView } from './ListView';

export type ProjectSubTab = 'dashboard' | 'board' | 'calendar' | 'docs' | 'list';

interface ProjectWorkspaceViewProps {
  currentRoomId: string;
  rooms: Room[];
  tasks: Task[];
  initialTab?: ProjectSubTab;
  onOpenTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTasks?: (taskIds: string[]) => void;
  onOpenNewTask: () => void;
  onNavigate: (page: string, params?: any) => void;
  onSelectRoom: (roomId: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceViewProps> = ({
  currentRoomId,
  rooms,
  tasks,
  initialTab = 'dashboard',
  onOpenTask,
  onUpdateTask,
  onDeleteTasks,
  onOpenNewTask,
  onNavigate,
  onSelectRoom,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<ProjectSubTab>(initialTab);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Get active room object (fallback to first room if not found)
  const currentRoom = useMemo(() => {
    return rooms.find(r => r.id === currentRoomId) || rooms[0] || {
      id: 'r1',
      kode: 'AGRO-2026',
      nama: 'AGRO E-Commerce App',
      ringkas: 'Aplikasi belanja hasil tani langsung dari petani ke konsumen',
      anggota: ['u1', 'u2', 'u3', 'u4'],
      tugas: 19,
      selesai: 12,
      akses: 'publik',
      warna: '#1E6FD9',
      plan: { x: 0, y: 0, w: 100, h: 100 }
    };
  }, [rooms, currentRoomId]);

  // Tasks for current project
  const projectTasks = useMemo(() => {
    // If tasks have roomId matching currentRoomId, use those; otherwise provide all tasks as fallback
    const filtered = tasks.filter(t => !t.roomId || t.roomId === currentRoomId);
    return filtered.length > 0 ? filtered : tasks;
  }, [tasks, currentRoomId]);

  // Compute stats for current project
  const stats = useMemo(() => {
    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === 'selesai').length;
    const inProgress = projectTasks.filter(t => t.status === 'jalan').length;
    const review = projectTasks.filter(t => t.status === 'review').length;
    const ready = projectTasks.filter(t => t.status === 'siap').length;
    const backlog = projectTasks.filter(t => t.status === 'backlog').length;
    const overdue = projectTasks.filter(t => t.due < '2026-09-02' && t.status !== 'selesai').length;
    const urgent = projectTasks.filter(t => t.prioritas === 'urgent' && t.status !== 'selesai').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, review, ready, backlog, overdue, urgent, percent };
  }, [projectTasks]);

  // Weekly load data for project chart
  const weekLoad = [
    { day: "Sen 31", hours: 6, overdue: 1 },
    { day: "Sel 1", hours: 9, overdue: 2, isToday: true },
    { day: "Rab 2", hours: 11, overdue: 0 },
    { day: "Kam 3", hours: 7, overdue: 0 },
    { day: "Jum 4", hours: 12, overdue: 0 },
    { day: "Sab 5", hours: 2, overdue: 0 },
    { day: "Min 6", hours: 0, overdue: 0 }
  ];
  const maxHours = 14;

  const urgentTasks = useMemo(() => {
    return projectTasks.filter(t => t.prioritas === 'urgent' || t.prioritas === 'high').slice(0, 4);
  }, [projectTasks]);

  return (
    <div className="space-y-6 pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP PROJECT HEADER & ROOM SWITCHER                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#D8E1EC] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Project identity & Dropdown Switcher */}
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0"
              style={{ backgroundColor: currentRoom.warna || '#1E6FD9' }}
            >
              {currentRoom.kode.substring(0, 2)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Project Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                    className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-[#0A2540] hover:text-[#1E6FD9] transition-colors cursor-pointer group"
                  >
                    <span>{currentRoom.nama}</span>
                    <ChevronDown className="w-5 h-5 text-[#5B7288] group-hover:text-[#1E6FD9] transition-transform" />
                  </button>

                  {/* Dropdown menu */}
                  {isRoomDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsRoomDropdownOpen(false)} 
                      />
                      <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white border border-[#D8E1EC] shadow-xl p-2 z-50 space-y-1">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5B7288]">
                          Pilih Ruang Kerja Proyek:
                        </div>
                        {rooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => {
                              onSelectRoom(room.id);
                              setIsRoomDropdownOpen(false);
                              onShowToast?.(`Beralih ke proyek ${room.nama}`, 'info');
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              room.id === currentRoom.id 
                                ? 'bg-[#F4F8FD] text-[#0A2540] font-bold border border-[#1E6FD9]/30' 
                                : 'hover:bg-[#F8FAFC] text-[#3C5A78]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span 
                                className="w-3 h-3 rounded-full shrink-0" 
                                style={{ backgroundColor: room.warna }} 
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-[#0A2540] truncate">{room.nama}</div>
                                <div className="text-[10px] text-[#5B7288] font-mono">{room.kode}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#5B7288] shrink-0">
                              {room.selesai}/{room.tugas}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#EAEFF5] text-[#0A2540] border border-[#D8E1EC]">
                  {currentRoom.kode}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F8E82]/10 text-[#0F8E82] border border-[#0F8E82]/20">
                  Sprint 4 Aktif
                </span>
              </div>

              <p className="text-xs text-[#5B7288] max-w-xl leading-relaxed">
                {currentRoom.ringkas || 'Ruang kolaborasi terpusat untuk serahan sprint, pelacakan kanban, dan dokumen teknis.'}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Buttons & Progress Mini-gauge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#F4F8FD] border border-[#E2EAF3] flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-[#0A2540]">
                  {stats.completed} dari {stats.total} Tugas
                </div>
                <div className="text-[10px] text-[#5B7288]">
                  {stats.percent}% Selesai (DoD)
                </div>
              </div>
              <div className="w-10 h-10 relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="#D8E1EC" strokeWidth="3.5" fill="none" />
                  <circle 
                    cx="20" 
                    cy="20" 
                    r="16" 
                    stroke={currentRoom.warna || "#1E6FD9"} 
                    strokeWidth="3.5" 
                    strokeDasharray="100" 
                    strokeDashoffset={100 - stats.percent} 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-[#0A2540]">
                  {stats.percent}%
                </span>
              </div>
            </div>

            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0A2540] text-white text-xs font-bold shadow-sm hover:bg-[#1E6FD9] transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PROJECT TABS NAVIGATION (Dashboard, Board, Kalender, Dokumen, List)    */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#EAEFF5] overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard' as ProjectSubTab, label: 'Dashboard Proyek', icon: Layers, count: undefined },
            { id: 'board' as ProjectSubTab, label: 'Board Kanban', icon: Smartphone, count: stats.total },
            { id: 'calendar' as ProjectSubTab, label: 'Kalender Sprint', icon: CalendarIcon, count: stats.overdue > 0 ? `${stats.overdue} alert` : undefined },
            { id: 'docs' as ProjectSubTab, label: 'Daftar Dokumen & Folder', icon: FileText, count: '5 folder' },
            { id: 'list' as ProjectSubTab, label: 'Daftar Tugas (List)', icon: ListFilter, count: undefined }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0A2540] text-white shadow-xs'
                    : 'text-[#5B7288] hover:text-[#0A2540] hover:bg-[#F4F8FD]'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#5B7288]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAEFF5] text-[#5B7288]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE SUB-TAB CONTENT                                                 */}
      {/* ========================================================================= */}

      {/* TAB 1: DASHBOARD AWAL SI PROJECT (Requested by User) */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Top KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-[#D8E1EC] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B7288]">Total Tugas</span>
              <div className="text-2xl font-black text-[#0A2540] mt-1">{stats.total}</div>
              <span className="text-[10px] text-[#5B7288]">di ruang proyek ini</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8E1EC] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B7288]">Dikerjakan (WIP)</span>
              <div className={`text-2xl font-black mt-1 ${stats.inProgress > 3 ? 'text-[#C4562B]' : 'text-[#1E6FD9]'}`}>
                {stats.inProgress}/3
              </div>
              <span className="text-[10px] text-[#5B7288]">
                {stats.inProgress > 3 ? 'Melebihi limit WIP!' : 'Kapasitas aman'}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8E1EC] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B7288]">Review & QA</span>
              <div className="text-2xl font-black text-[#B7791F] mt-1">{stats.review}</div>
              <span className="text-[10px] text-[#5B7288]">menunggu pengujian</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8E1EC] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B7288]">Selesai (DoD)</span>
              <div className="text-2xl font-black text-[#0F8E82] mt-1">{stats.completed}</div>
              <span className="text-[10px] text-[#0F8E82] font-semibold">Telah terverifikasi</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8E1EC] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B7288]">Lewat Tempo</span>
              <div className="text-2xl font-black text-[#C4562B] mt-1">{stats.overdue}</div>
              <span className="text-[10px] text-[#C4562B] font-semibold">Perlu tindakan</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8E1EC] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B7288]">Sprint Rate</span>
              <div className="text-2xl font-black text-[#0A2540] mt-1">{stats.percent}%</div>
              <span className="text-[10px] text-[#5B7288]">Target sprint 85%</span>
            </div>
          </div>

          {/* Middle 2 Columns: Workload Chart & Quick Deliverables / Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Cols: Sprint Workload Chart */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D8E1EC] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0A2540]">
                    Beban Jam Kerja Proyek ({currentRoom.kode})
                  </h3>
                  <p className="text-[11px] text-[#5B7288]">
                    Alokasi jam kerja tim minggu ini vs batas aman kapasitas harian (8 jam)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="text-xs font-semibold text-[#1E6FD9] hover:underline flex items-center gap-1"
                >
                  <span>Lihat Kalender</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Workload SVG Bar Chart */}
              <div className="h-44 w-full relative pt-2">
                <svg viewBox="0 0 620 160" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  {[0, 4, 8, 12].map((lvl) => {
                    const y = 135 - (lvl / maxHours) * 120;
                    return (
                      <g key={lvl}>
                        <line x1="40" y1={y} x2="600" y2={y} stroke="#EFF4F9" strokeWidth="1" />
                        <text x="15" y={y + 4} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                          {lvl}j
                        </text>
                      </g>
                    );
                  })}

                  {/* 8 Hours Red Threshold Line */}
                  <line 
                    x1="40" 
                    y1={135 - (8 / maxHours) * 120} 
                    x2="600" 
                    y2={135 - (8 / maxHours) * 120} 
                    stroke="#EF4444" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />

                  {/* Bars */}
                  {weekLoad.map((item, idx) => {
                    const barWidth = 46;
                    const spacing = 78;
                    const x = 55 + idx * spacing;
                    const barH = (item.hours / maxHours) * 120;
                    const y = 135 - barH;
                    const isOver = item.hours > 8;

                    return (
                      <g key={item.day} className="cursor-pointer group">
                        {/* Background subtle pill */}
                        <rect
                          x={x}
                          y="15"
                          width={barWidth}
                          height="120"
                          rx="6"
                          fill="#F8FAFC"
                        />
                        {/* Actual Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barH}
                          rx="6"
                          fill={isOver ? '#C4562B' : '#1E6FD9'}
                          className="transition-all group-hover:brightness-110"
                        />
                        {/* Value label */}
                        <text
                          x={x + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fill="#0A2540"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {item.hours}j
                        </text>
                        {/* Day label */}
                        <text
                          x={x + barWidth / 2}
                          y="150"
                          textAnchor="middle"
                          fill={item.isToday ? '#1E6FD9' : '#5B7288'}
                          fontSize="11"
                          fontWeight={item.isToday ? 'bold' : 'normal'}
                        >
                          {item.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5B7288] pt-2 border-t border-[#EFF4F9]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#1E6FD9]" /> Jam Normal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#C4562B]" /> Kelebihan Beban (&gt;8j)
                  </span>
                </div>
                <span className="font-semibold text-[#0A2540]">
                  Total: 47 Jam Sprint
                </span>
              </div>
            </div>

            {/* Right 5 Cols: Quick Access Deliverables & Folders */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D8E1EC] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0A2540]">
                    Folder & Dokumen Proyek
                  </h3>
                  <p className="text-[11px] text-[#5B7288]">
                    Akses cepat berkas spesifikasi & serahan
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('docs')}
                  className="text-xs font-semibold text-[#1E6FD9] hover:underline flex items-center gap-1"
                >
                  <span>Buka Semua</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Folders list */}
              <div className="space-y-2">
                {[
                  { name: 'Onboarding & Guidelines', count: '15 Berkas', updated: 'Kemarin', color: '#1E6FD9' },
                  { name: 'Integrations & API Sync', count: '5 Berkas', updated: '3 hari lalu', color: '#0F8E82' },
                  { name: 'Design Tokens & Specs', count: '24 Berkas', updated: 'Hari ini', color: '#7A5AF8' },
                  { name: 'Sprint 4 DoD QA Checklist', count: '8 Berkas', updated: '2 hari lalu', color: '#C4562B' },
                ].map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab('docs')}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2EAF3] hover:border-[#1E6FD9] hover:bg-white transition-all text-left group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: f.color }}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#0A2540] block truncate group-hover:text-[#1E6FD9]">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-[#5B7288]">
                          {f.count} • Diperbarui {f.updated}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E6FD9] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('docs')}
                className="w-full py-2.5 rounded-2xl bg-[#F4F8FD] hover:bg-[#EAEFF5] border border-[#D8E1EC] text-xs font-bold text-[#0A2540] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FolderKanban className="w-4 h-4 text-[#1E6FD9]" />
                <span>Lihat Folder Manager & Upload Berkas</span>
              </button>
            </div>

          </div>

          {/* Bottom Row: Urgent Tasks & Next Milestones */}
          <div className="bg-white rounded-3xl border border-[#D8E1EC] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#0A2540]">
                  Tugas Prioritas & Menunggu Eskalasi
                </h3>
                <p className="text-[11px] text-[#5B7288]">
                  Tugas dengan label urgent/high yang perlu diselesaikan dalam sprint ini
                </p>
              </div>
              <button
                onClick={() => setActiveTab('board')}
                className="text-xs font-semibold text-[#1E6FD9] hover:underline flex items-center gap-1"
              >
                <span>Buka Board Kanban</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {urgentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onOpenTask(t)}
                  className="p-3.5 rounded-2xl border border-[#E2EAF3] bg-[#F8FAFC] hover:bg-white hover:border-[#1E6FD9] transition-all cursor-pointer space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-[#0A2540] border border-[#D8E1EC]">
                      {t.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      t.prioritas === 'urgent' ? 'bg-[#C4562B] text-white' : 'bg-[#D97706] text-white'
                    }`}>
                      {t.prioritas}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#0A2540] line-clamp-2 leading-snug">
                    {t.nama}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-[#5B7288] pt-1 border-t border-[#EFF4F9]">
                    <span className="font-semibold text-[#1E6FD9]">
                      Status: {t.status}
                    </span>
                    <span>Jatuh: {t.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: BOARD KANBAN (Matches User Reference Screenshot) */}
      {activeTab === 'board' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <BoardView
            tasks={projectTasks}
            onOpenTask={onOpenTask}
            onUpdateTask={onUpdateTask}
            onOpenNewTask={onOpenNewTask}
          />
        </motion.div>
      )}

      {/* TAB 3: KALENDER SPRINT */}
      {activeTab === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CalendarView
            tasks={projectTasks}
            onOpenTask={onOpenTask}
            onOpenNewTask={onOpenNewTask}
          />
        </motion.div>
      )}

      {/* TAB 4: DOKUMEN & FOLDER */}
      {activeTab === 'docs' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ProjectDocsView
            currentRoomId={currentRoom.id}
            onNavigate={onNavigate}
          />
        </motion.div>
      )}

      {/* TAB 5: LIST VIEW */}
      {activeTab === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ListView
            tasks={projectTasks}
            onOpenTask={onOpenTask}
            onUpdateTask={onUpdateTask}
            onDeleteTasks={onDeleteTasks || (() => {})}
            onOpenNewTask={onOpenNewTask}
          />
        </motion.div>
      )}

    </div>
  );
};
