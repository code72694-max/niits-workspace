import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Upload, 
  Calendar as CalendarIcon, 
  CheckCheck, 
  MoreHorizontal, 
  LayoutDashboard,
  FolderKanban,
  Columns,
  Users,
  FileText,
  Wrench,
  Terminal,
  Settings,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Circle,
  Filter,
  Search,
  Bell,
  X,
  Edit2,
  Trash2,
  Tag
} from 'lucide-react';
import { Task, RoleKey, Room } from '../types';
import { 
  CaseTask, 
  CaseStage, 
  TaskCategory, 
  INITIAL_CASE_TASKS,
  AVAILABLE_ASSIGNEES 
} from '../types/caseManagement';
import { INITIAL_TASKS, CURRENT_USER } from '../data/mockData';
import { ListView } from '../views/ListView';
import { BoardView } from '../views/BoardView';
import { CalendarView } from '../views/CalendarView';
import { RolesView } from '../views/RolesView';
import { ProjectDocsView } from '../views/ProjectDocsView';
import { ToolsView } from '../views/ToolsView';
import { SettingsView } from '../views/SettingsView';
import { CaseTaskDetailModal } from './CaseTaskDetailModal';

interface NewCaseManagementCardProps {
  tasks?: Task[];
  rooms?: Room[];
  onOpenNewTask?: () => void;
  onNavigate?: (page: string, params?: { room?: string; role?: RoleKey; tab?: string }) => void;
  onOpenTask?: (task: Task) => void;
  onOpenPalette?: () => void;
  unreadNotificationsCount?: number;
}

export const NewCaseManagementCard: React.FC<NewCaseManagementCardProps> = ({
  tasks,
  rooms,
  onOpenNewTask,
  onNavigate,
  onOpenTask,
  onOpenPalette,
  unreadNotificationsCount = 3
}) => {
  // Sync tasks for internal tabs
  const [internalTasks, setInternalTasks] = useState<Task[]>(tasks || INITIAL_TASKS);

  React.useEffect(() => {
    if (tasks && tasks.length > 0) {
      setInternalTasks(tasks);
    }
  }, [tasks]);

  const handleUpdateTask = (updatedTask: Task) => {
    setInternalTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTasks = (taskIds: string[]) => {
    setInternalTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
  };

  // Selected task in the Stage 4 (New Tasks matrix)
  const [selectedTaskSquare, setSelectedTaskSquare] = useState<TaskCategory>('Request Processing');
  
  // Active circular menu icon
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);

  // REAL TASK LIST STATE
  const [caseTasks, setCaseTasks] = useState<CaseTask[]>(INITIAL_CASE_TASKS);
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Edit State
  const [activeTaskModal, setActiveTaskModal] = useState<CaseTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inline Quick Add State per stage
  const [addingInStage, setAddingInStage] = useState<CaseStage | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Toggle complete state
  const handleToggleComplete = (taskId: string) => {
    setCaseTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed, isActionableAdd: false };
      }
      return t;
    }));
  };

  // Add task to stage
  const handleAddQuickTask = (stage: CaseStage, title: string) => {
    if (!title.trim()) return;
    const newTask: CaseTask = {
      id: `ct-${Date.now()}`,
      stage,
      title: title.trim(),
      completed: false,
      category: selectedTaskSquare || 'Problem Resolution',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      priority: 'normal',
      assignee: AVAILABLE_ASSIGNEES[Math.floor(Math.random() * AVAILABLE_ASSIGNEES.length)]
    };
    setCaseTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setAddingInStage(null);
  };

  // Quick activate placeholder (+) items
  const handleActivatePlaceholder = (task: CaseTask) => {
    setActiveTaskModal(task);
    setIsModalOpen(true);
  };

  // Save updated task from modal
  const handleSaveTask = (updatedTask: CaseTask) => {
    setCaseTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setCaseTasks(prev => prev.filter(t => t.id !== taskId));
    setOpenDropdownId(null);
  };

  // Quick change due date
  const handleQuickChangeDate = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const task = caseTasks.find(t => t.id === taskId);
    if (!task) return;
    const nextDate = prompt("Ubah Tenggat Waktu (YYYY-MM-DD):", task.dueDate || '2026-09-05');
    if (nextDate && nextDate.trim()) {
      setCaseTasks(prev => prev.map(t => t.id === taskId ? { ...t, dueDate: nextDate.trim() } : t));
    }
  };

  // 8 Circular Icon Menus in the Subtracted Notch Dock (Requested by user)
  const menuIcons = [
    { 
      id: 'dashboard', 
      title: 'New Case Managment',
      subtitle: 'Workflow Matrix & Pipeline Tahapan Kasus',
      label: 'New Case Management (Matriks Alur)', 
      icon: LayoutDashboard, 
    },
    { 
      id: 'cases', 
      title: 'Sprint Backlog & User Story',
      subtitle: 'Story Point, Prioritas Kasus & Estimasi Beban',
      label: 'Sprint Backlog & User Story', 
      icon: Layers, 
    },
    { 
      id: 'board', 
      title: 'Kanban Workflow & Board',
      subtitle: 'Papan Alur Status Backlog, Jalan, Review & Selesai',
      label: 'Papan Kanban Sprint', 
      icon: Columns, 
    },
    { 
      id: 'calendar', 
      title: 'Kalender & Jadwal Sprint',
      subtitle: 'Milestone Rilis, Sprint Review & Deadline',
      label: 'Kalender & Deadline', 
      icon: CalendarIcon, 
    },
    { 
      id: 'roles', 
      title: '9 Disiplin & Alokasi Tim',
      subtitle: 'Distribusi Beban Kerja 9 Peran Spesialis Proyek',
      label: '9 Disiplin & Peran Tim', 
      icon: Users, 
    },
    { 
      id: 'docs', 
      title: 'Dokumen & Spesifikasi Serahan',
      subtitle: 'PRD, SRS, Dokumen Arsitektur & Pedoman QA',
      label: 'Dokumen & Spesifikasi', 
      icon: FileText, 
    },
    { 
      id: 'tools', 
      title: 'Daftar Tools & Utilitas',
      subtitle: 'Konversi Dokumen (Image to PDF, PDF to Word), Pengolahan Berkas & Utilitas',
      label: 'Daftar Tools & Utilitas', 
      icon: Wrench, 
    },
    { 
      id: 'settings', 
      title: 'Pengaturan Proyek & Sistem',
      subtitle: 'Konfigurasi Workspace, Hak Akses & Integrasi CI/CD',
      label: 'Pengaturan Proyek & Sistem', 
      icon: Settings, 
    },
  ];

  // Stage 4 Squircle Cards
  const matrixCards = [
    { id: 'Request Processing', labelTop: 'Request', labelBottom: 'Processing' },
    { id: 'Problem Resolution', labelTop: 'Problem', labelBottom: 'Resolution' },
    { id: 'Customer Communication', labelTop: 'Customer', labelBottom: 'Communication' },
    { id: 'Testing and Verification', labelTop: 'Testing and', labelBottom: 'Verification' },
    { id: 'Customer Notification', labelTop: 'Customer', labelBottom: 'Notification' },
    { id: 'Customer Satisfaction', labelTop: 'Customer', labelBottom: 'Satisfaction' },
  ];

  return (
    <div className="relative w-full h-full flex-1 flex flex-col min-h-0">
      
      {/* ========================================================================= */}
      {/* 1. SEAMLESS SUBTRACTED NOTCH CONTAINER (BOOLEAN SUBTRACTION AS IN IMAGE 1) */}
      {/* ========================================================================= */}

      {/* Desktop & Large Screen Header: Left Wing + Center Subtracted Notch + Right Wing */}
      <div className="hidden lg:flex items-stretch justify-between w-full h-[74px] shrink-0 relative z-10">
        
        {/* TOP-LEFT WING: White background, rounded top-left corner */}
        <div className="flex-1 bg-white rounded-tl-[32px] border-t border-l border-[#D5E0ED] px-6 sm:px-7 flex flex-col justify-center shadow-2xs">
          <h2 className="text-lg font-extrabold text-[#0B1528] tracking-tight font-sans">
            {menuIcons[activeMenuIndex]?.title || 'New Case Managment'}
          </h2>
          {menuIcons[activeMenuIndex]?.subtitle && (
            <p className="text-[11px] text-[#5A6E82] font-medium hidden sm:block truncate mt-0.5">
              {menuIcons[activeMenuIndex].subtitle}
            </p>
          )}
        </div>

        {/* CENTER SUBTRACTED NOTCH: Vector Inverted Fillets with Transparent Cutout Area (scaled down slightly) */}
        <div className="relative w-[480px] shrink-0 h-[74px] flex items-start justify-center">
          
          {/* SVG Subtracted Notch Background Path */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            viewBox="0 0 480 74" 
            preserveAspectRatio="none"
          >
            {/* White fill below the notch curve (joins seamlessly with the white body below) */}
            <path
              d="M 0 0 
                 C 14 0, 25 12, 25 26 
                 C 25 40, 37 52, 50 52 
                 L 430 52 
                 C 443 52, 455 40, 455 26 
                 C 455 12, 466 0, 480 0 
                 L 480 74 
                 L 0 74 
                 Z"
              fill="#FFFFFF"
            />
            {/* Top border stroke following the inverted fillet notch curve */}
            <path
              d="M 0 0.5 
                 C 14 0.5, 25 12, 25 26 
                 C 25 40, 37 52, 50 52 
                 L 430 52 
                 C 443 52, 455 40, 455 26 
                 C 455 12, 466 0.5, 480 0.5"
              stroke="#D5E0ED"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* 8 Circular Menu Icons sitting neatly inside the Subtracted Notch (resized to w-9.5 h-9.5) */}
          <div className="relative z-10 h-[52px] flex items-start justify-center gap-2 sm:gap-2.5 px-3 pt-0">
            {menuIcons.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeMenuIndex === idx;

              return (
                <div key={item.id} className="relative flex flex-col items-center group">
                  <button
                    onClick={() => {
                      setActiveMenuIndex(idx);
                    }}
                    className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                      isActive
                        ? 'bg-[#0B1528] text-white shadow-xs ring-2 ring-[#0B1528]/25'
                        : 'bg-white hover:bg-[#F4F8FD] text-[#334D6E] hover:text-[#0B1528] border border-[#D8E1EC] hover:border-[#1E6FD9]/40'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                  </button>

                  {/* Hover Floating Tooltip */}
                  <div className="absolute top-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1528] text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap z-50 shadow-md">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* TOP-RIGHT WING: White background, rounded top-right corner with Search, Notif, and Profile */}
        <div className="flex-1 bg-white rounded-tr-[32px] border-t border-r border-[#D5E0ED] px-6 sm:px-7 flex items-center justify-end gap-2 shadow-2xs">
          {/* Quick Search Button (Circular) */}
          <button
            onClick={onOpenPalette}
            className="w-9 h-9 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] hover:text-[#0A2540] flex items-center justify-center shadow-2xs transition-all active:scale-95 cursor-pointer hover:border-[#1E6FD9]"
            title="Cari cepat (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Notification Bell Button (Circular with Badge) */}
          <button
            onClick={() => onNavigate && onNavigate('inbox')}
            className="relative w-9 h-9 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] hover:text-[#0A2540] flex items-center justify-center shadow-2xs transition-all active:scale-95 cursor-pointer hover:border-[#1E6FD9]"
            title="Notifikasi"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C4562B] ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Avatar in Circle */}
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ring-2 ring-white hover:ring-[#1E6FD9] transition-all cursor-pointer overflow-hidden ml-1 active:scale-95"
            style={{ backgroundColor: CURRENT_USER.warna || '#12459C' }}
            title={`Buka profil ${CURRENT_USER.nama} (${CURRENT_USER.inisial})`}
          >
            {CURRENT_USER.inisial}
          </button>
        </div>

      </div>

      {/* Mobile/Tablet Fallback Header (< 1024px) */}
      <div className="lg:hidden shrink-0 bg-white rounded-t-[32px] border-t border-x border-[#D5E0ED] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#0B1528] tracking-tight">
              {menuIcons[activeMenuIndex]?.title || 'New Case Managment'}
            </h2>
            {menuIcons[activeMenuIndex]?.subtitle && (
              <p className="text-xs text-[#5A6E82] mt-0.5">
                {menuIcons[activeMenuIndex].subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenPalette}
              className="w-8 h-8 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] flex items-center justify-center shadow-2xs transition-all active:scale-95"
              title="Cari cepat"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate && onNavigate('inbox')}
              className="relative w-8 h-8 rounded-full bg-white border border-[#D8E1EC] hover:bg-[#F4F8FD] text-[#4A5D70] flex items-center justify-center shadow-2xs transition-all active:scale-95"
              title="Notifikasi"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C4562B] ring-2 ring-white" />
              )}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ring-2 ring-white ml-0.5 active:scale-95"
              style={{ backgroundColor: CURRENT_USER.warna || '#12459C' }}
              title="Profil"
            >
              {CURRENT_USER.inisial}
            </button>
          </div>
        </div>

        {/* Circular Menu Icons in Mobile View with slightly added bottom margin */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none mb-1">
          {menuIcons.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = activeMenuIndex === idx;

            return (
              <div key={item.id} className="relative shrink-0 flex flex-col items-center">
                <button
                  onClick={() => {
                    setActiveMenuIndex(idx);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1528] text-white shadow-xs'
                      : 'bg-[#F4F8FD] text-[#334D6E] border border-[#D8E1EC]'
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-4.5 h-4.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD BODY: CONTINUOUS WHITE CARD MERGED WITH SUBTRACTED NOTCH & WINGS   */}
      {/* ========================================================================= */}
      <div className="relative bg-white rounded-b-[36px] sm:rounded-b-[42px] border-b border-x border-[#D5E0ED] shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 sm:p-7 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          <AnimatePresence mode="wait">
          {activeMenuIndex === 0 && (
            <motion.div
              key="cases-pipeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* INTERACTIVE TASK LIST TOOLBAR: Filter tabs, category filter indicator & quick search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0F4F8] sticky -top-5 sm:-top-7 z-20 bg-white pt-1">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#F4F7FA] p-1 rounded-2xl border border-[#E2E8F0]">
            <button
              onClick={() => setTaskStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                taskStatusFilter === 'all'
                  ? 'bg-white text-[#0B1528] shadow-2xs'
                  : 'text-[#5A6E82] hover:text-[#0B1528]'
              }`}
            >
              Semua ({caseTasks.length})
            </button>
            <button
              onClick={() => setTaskStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                taskStatusFilter === 'pending'
                  ? 'bg-white text-[#0B1528] shadow-2xs'
                  : 'text-[#5A6E82] hover:text-[#0B1528]'
              }`}
            >
              Belum Selesai ({caseTasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setTaskStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                taskStatusFilter === 'completed'
                  ? 'bg-white text-[#0B1528] shadow-2xs'
                  : 'text-[#5A6E82] hover:text-[#0B1528]'
              }`}
            >
              Selesai ({caseTasks.filter(t => t.completed).length})
            </button>
          </div>

          {/* Active Category Filter Badge & Search */}
          <div className="flex items-center gap-2">
            {categoryFilter && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1528] text-white text-[11px] font-medium shadow-2xs">
                <span>Kategori: {categoryFilter}</span>
                <button
                  onClick={() => setCategoryFilter(null)}
                  className="hover:bg-white/20 p-0.5 rounded-full cursor-pointer"
                  title="Hapus filter kategori"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E92A6]" />
              <input
                type="text"
                placeholder="Cari tugas alur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 rounded-full text-xs bg-[#F4F7FA] border border-[#E2E8F0] focus:border-[#1E6FD9] outline-none text-[#0B1528] w-36 sm:w-48 placeholder-[#8CA0B3]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Columns Horizontal Flow */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">

          {/* ========================================================================= */}
          {/* COLUMN 1: "Case Allocation" (Daftar Tugas Alokasi)                         */}
          {/* ========================================================================= */}
          {(() => {
            const stageTasks = caseTasks.filter(t => t.stage === 'allocation');
            const filteredTasks = stageTasks.filter(t => {
              if (taskStatusFilter === 'completed' && !t.completed) return false;
              if (taskStatusFilter === 'pending' && t.completed) return false;
              if (categoryFilter && t.category !== categoryFilter) return false;
              if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              return true;
            });
            const completedCount = stageTasks.filter(t => t.completed).length;

            return (
              <div className="flex flex-col justify-between space-y-3">
                {/* White Rounded Container */}
                <div className="relative bg-white rounded-[32px] p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      Tidak ada tugas di tahap ini.
                    </div>
                  ) : (
                    filteredTasks.map((task, idx) => (
                      <React.Fragment key={task.id}>
                        {idx > 0 && <div className="border-t border-[#F1F5F9]" />}
                        <div className="group relative space-y-3 transition-all">
                          <div className="flex items-center justify-between">
                            {/* User Avatar */}
                            <div 
                              onClick={() => {
                                setActiveTaskModal(task);
                                setIsModalOpen(true);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                              title={task.assignee ? `${task.assignee.name} (${task.assignee.role})` : 'Belum ada assignee'}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-2xs shrink-0 bg-[#E8EEF5]">
                                {task.assignee?.avatar ? (
                                  <img 
                                    src={task.assignee.avatar} 
                                    alt={task.assignee.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                    ?
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions: Clickable Double Checkmarks + Calendar */}
                            <div className="flex items-center gap-1.5">
                              {/* Checkbox / Double checkmark toggle */}
                              <button
                                onClick={() => handleToggleComplete(task.id)}
                                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                                  task.completed
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-white border border-[#DCE4EC] hover:bg-[#F4F8FD] text-[#5A6E82]'
                                }`}
                                title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                              >
                                <CheckCheck className={`w-4 h-4 ${task.completed ? 'text-emerald-600' : 'text-[#5A6E82]'}`} />
                              </button>

                              {/* Calendar date button */}
                              <button 
                                onClick={(e) => handleQuickChangeDate(task.id, e)}
                                className="w-8 h-8 rounded-full bg-white border border-[#DCE4EC] hover:bg-[#F4F8FD] text-[#5A6E82] flex items-center justify-center shadow-2xs cursor-pointer hover:border-[#1E6FD9]"
                                title={`Tenggat: ${task.dueDate || 'Belum diatur'} (Klik untuk ubah)`}
                              >
                                <CalendarIcon className="w-3.5 h-3.5" />
                              </button>

                              {/* More menu */}
                              <div className="relative">
                                <button
                                  onClick={() => setOpenDropdownId(openDropdownId === task.id ? null : task.id)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                                {openDropdownId === task.id && (
                                  <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30">
                                    <button
                                      onClick={() => {
                                        setActiveTaskModal(task);
                                        setIsModalOpen(true);
                                        setOpenDropdownId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Edit2 className="w-3 h-3 text-slate-500" />
                                      Edit Detail
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleToggleComplete(task.id);
                                        setOpenDropdownId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                      {task.completed ? 'Batal Selesai' : 'Tandai Selesai'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Hapus
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Task Title (Clickable to open modal) */}
                          <div
                            onClick={() => {
                              setActiveTaskModal(task);
                              setIsModalOpen(true);
                            }}
                            className="cursor-pointer group-hover:text-[#1E6FD9] transition-colors"
                          >
                            <p className={`text-xs sm:text-[13px] font-semibold leading-snug transition-all ${
                              task.completed 
                                ? 'line-through decoration-slate-300 text-slate-400' 
                                : 'text-[#1E293B]'
                            }`}>
                              {task.title}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  )}

                  {/* Inline Quick Add Input */}
                  {addingInStage === 'allocation' ? (
                    <div className="pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nama tugas baru..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddQuickTask('allocation', newTitle);
                          if (e.key === 'Escape') setAddingInStage(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#1E6FD9] text-xs outline-none text-[#0B1528] mb-2"
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAddingInStage(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-md"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleAddQuickTask('allocation', newTitle)}
                          className="px-3 py-1 text-[11px] bg-[#0B1528] text-white rounded-md font-bold"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingInStage('allocation')}
                      className="w-full py-2 rounded-xl border border-dashed border-slate-200 hover:border-[#1E6FD9] text-slate-500 hover:text-[#1E6FD9] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Tugas</span>
                    </button>
                  )}
                </div>

                {/* Column Label & Task Counter */}
                <div className="text-center pt-1">
                  <span className="text-xs font-bold text-[#334D6E]">
                    Case Allocation
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EEF5] text-[#1E6FD9]">
                    {completedCount}/{stageTasks.length} Selesai
                  </span>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* COLUMN 2: "Issue Identification" (Daftar Tugas Identifikasi)               */}
          {/* ========================================================================= */}
          {(() => {
            const stageTasks = caseTasks.filter(t => t.stage === 'identification');
            const filteredTasks = stageTasks.filter(t => {
              if (taskStatusFilter === 'completed' && !t.completed) return false;
              if (taskStatusFilter === 'pending' && t.completed) return false;
              if (categoryFilter && t.category !== categoryFilter) return false;
              if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              return true;
            });
            const completedCount = stageTasks.filter(t => t.completed).length;

            return (
              <div className="flex flex-col justify-between space-y-3">
                {/* White Rounded Container */}
                <div className="relative bg-white rounded-[32px] p-5 sm:p-5.5 shadow-xs border border-slate-200/80 space-y-3.5">
                  {filteredTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      Tidak ada tugas di tahap ini.
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="group flex items-center justify-between gap-2 py-1 transition-all rounded-lg hover:bg-slate-50/60 px-1 -mx-1"
                      >
                        <div 
                          onClick={() => {
                            setActiveTaskModal(task);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-[#E8EEF5]">
                            {task.assignee?.avatar ? (
                              <img 
                                src={task.assignee.avatar} 
                                alt={task.assignee.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                ?
                              </div>
                            )}
                          </div>
                          <span className={`text-xs truncate transition-all ${
                            task.completed 
                              ? 'line-through decoration-slate-300 text-slate-400' 
                              : task.isBold ? 'font-bold text-[#0B1528]' : 'text-[#1E293B] font-medium'
                          }`}>
                            {task.title}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              task.completed 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                : 'bg-white border border-[#DCE4EC] hover:bg-[#F4F8FD] text-[#5A6E82]'
                            }`}
                            title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                          >
                            <CheckCheck className={`w-3.5 h-3.5 ${task.completed ? 'text-emerald-600' : 'text-[#334D6E]'}`} />
                          </button>

                          <button 
                            onClick={(e) => handleQuickChangeDate(task.id, e)}
                            className="w-7 h-7 rounded-full bg-white border border-[#DCE4EC] flex items-center justify-center text-[#5A6E82] hover:bg-[#F4F8FD] cursor-pointer"
                            title={`Tenggat: ${task.dueDate || 'Belum diatur'}`}
                          >
                            <CalendarIcon className="w-3 h-3" />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === task.id ? null : task.id)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                            {openDropdownId === task.id && (
                              <div className="absolute right-0 top-7 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30">
                                <button
                                  onClick={() => {
                                    setActiveTaskModal(task);
                                    setIsModalOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3 text-slate-500" />
                                  Edit Detail
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Inline Quick Add Input */}
                  {addingInStage === 'identification' ? (
                    <div className="pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nama tugas identifikasi..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddQuickTask('identification', newTitle);
                          if (e.key === 'Escape') setAddingInStage(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#1E6FD9] text-xs outline-none text-[#0B1528] mb-2"
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAddingInStage(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-md"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleAddQuickTask('identification', newTitle)}
                          className="px-3 py-1 text-[11px] bg-[#0B1528] text-white rounded-md font-bold"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingInStage('identification')}
                      className="w-full py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-[#1E6FD9] text-slate-500 hover:text-[#1E6FD9] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Tugas</span>
                    </button>
                  )}
                </div>

                {/* Column Label & Task Counter */}
                <div className="text-center pt-1">
                  <span className="text-xs font-bold text-[#334D6E]">
                    Issue Identification
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EEF5] text-[#1E6FD9]">
                    {completedCount}/{stageTasks.length} Selesai
                  </span>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* COLUMN 3: "Technical Resolution" (Daftar Tugas Resolusi Teknis)            */}
          {/* ========================================================================= */}
          {(() => {
            const stageTasks = caseTasks.filter(t => t.stage === 'resolution');
            const filteredTasks = stageTasks.filter(t => {
              if (taskStatusFilter === 'completed' && !t.completed) return false;
              if (taskStatusFilter === 'pending' && t.completed) return false;
              if (categoryFilter && t.category !== categoryFilter) return false;
              if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              return true;
            });
            const completedCount = stageTasks.filter(t => t.completed).length;

            return (
              <div className="flex flex-col justify-between space-y-3">
                {/* White Rounded Container */}
                <div className="relative bg-white rounded-[32px] p-5 sm:p-5.5 shadow-xs border border-slate-200/80 space-y-3.5">
                  {filteredTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      Tidak ada tugas di tahap ini.
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="group flex items-center justify-between gap-2 py-1 transition-all rounded-lg hover:bg-slate-50/60 px-1 -mx-1"
                      >
                        <div 
                          onClick={() => handleActivatePlaceholder(task)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                        >
                          {task.isActionableAdd ? (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleComplete(task.id);
                              }}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                                task.completed
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                  : 'bg-[#F4F8FD] border-[#DCE4EC] text-[#5A6E82] hover:bg-[#E8EEF5]'
                              }`}
                              title={task.completed ? "Selesai" : "Klik untuk selesaikan atau ubah"}
                            >
                              {task.completed ? <CheckCheck className="w-4 h-4" /> : '+'}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-[#E8EEF5]">
                              {task.assignee?.avatar ? (
                                <img 
                                  src={task.assignee.avatar} 
                                  alt={task.assignee.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  ?
                                </div>
                              )}
                            </div>
                          )}

                          <span className={`text-xs truncate transition-all ${
                            task.completed 
                              ? 'line-through decoration-slate-300 text-slate-400' 
                              : task.isBold ? 'font-bold text-[#0B1528]' : 'text-[#1E293B] font-medium'
                          }`}>
                            {task.title}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              task.completed 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                : 'bg-white border border-[#DCE4EC] hover:bg-[#F4F8FD] text-[#5A6E82]'
                            }`}
                            title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                          >
                            <CheckCheck className={`w-3.5 h-3.5 ${task.completed ? 'text-emerald-600' : 'text-[#334D6E]'}`} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === task.id ? null : task.id)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                            {openDropdownId === task.id && (
                              <div className="absolute right-0 top-7 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30">
                                <button
                                  onClick={() => {
                                    setActiveTaskModal(task);
                                    setIsModalOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3 text-slate-500" />
                                  Edit Detail
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Inline Quick Add Input */}
                  {addingInStage === 'resolution' ? (
                    <div className="pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nama tugas teknis..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddQuickTask('resolution', newTitle);
                          if (e.key === 'Escape') setAddingInStage(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#1E6FD9] text-xs outline-none text-[#0B1528] mb-2"
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAddingInStage(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-md"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleAddQuickTask('resolution', newTitle)}
                          className="px-3 py-1 text-[11px] bg-[#0B1528] text-white rounded-md font-bold"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingInStage('resolution')}
                      className="w-full py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-[#1E6FD9] text-slate-500 hover:text-[#1E6FD9] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Tugas</span>
                    </button>
                  )}
                </div>

                {/* Column Label & Task Counter */}
                <div className="text-center pt-1">
                  <span className="text-xs font-bold text-[#334D6E]">
                    Technical Resolution
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EEF5] text-[#1E6FD9]">
                    {completedCount}/{stageTasks.length} Selesai
                  </span>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* COLUMN 4: "New Tasks" (Matriks Kategori Tugas & Quick Creator)            */}
          {/* ========================================================================= */}
          <div className="flex flex-col justify-between space-y-3">
            
            {/* Subtle Substrate Panel holding the 2x3 Grid */}
            <div className="bg-[#DFE7F1]/70 p-2.5 sm:p-3 rounded-[32px] border border-[#D0DAE6]/80 shadow-2xs space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {matrixCards.map((card) => {
                  const isSelected = selectedTaskSquare === card.id || categoryFilter === card.id;
                  const categoryCount = caseTasks.filter(t => t.category === card.id).length;

                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        setSelectedTaskSquare(card.id as TaskCategory);
                        // Toggle category filter
                        if (categoryFilter === card.id) {
                          setCategoryFilter(null);
                        } else {
                          setCategoryFilter(card.id as TaskCategory);
                        }
                      }}
                      className={`h-20 sm:h-22 p-2.5 rounded-[22px] flex flex-col justify-center items-center text-center transition-all cursor-pointer shadow-2xs group relative ${
                        isSelected
                          ? 'bg-[#0B1528] text-white shadow-md scale-[1.02]'
                          : 'bg-white text-[#1E293B] border border-white/80 hover:border-[#0B1528]/40 hover:bg-[#FBFDFF]'
                      }`}
                      title={`Klik untuk filter tugas kategori ${card.id}`}
                    >
                      <span className={`text-[11px] font-bold leading-tight block ${
                        isSelected ? 'text-white' : 'text-[#1E293B]'
                      }`}>
                        {card.labelTop}
                      </span>
                      <span className={`text-[11px] font-bold leading-tight block ${
                        isSelected ? 'text-white' : 'text-[#1E293B]'
                      }`}>
                        {card.labelBottom}
                      </span>

                      {/* Counter Badge */}
                      <span className={`mt-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {categoryCount} tugas
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Add Task Button for Selected Category */}
              <button
                onClick={() => {
                  const title = prompt(`Tambah tugas baru untuk kategori "${selectedTaskSquare}":`, `Proses ${selectedTaskSquare}`);
                  if (title && title.trim()) {
                    handleAddQuickTask('allocation', title.trim());
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#0B1528] hover:text-white border border-[#CCD8E6] text-[#0B1528] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buat Kasus / Tugas Baru</span>
              </button>
            </div>

            {/* Column Label */}
            <div className="text-center pt-1">
              <span className="text-xs font-bold text-[#334D6E]">
                New Tasks
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EEF5] text-[#1E6FD9]">
                6 Kategori Alur
              </span>
            </div>

          </div>

        </div>
        </div>
            </motion.div>
          )}

          {activeMenuIndex === 1 && (
            <motion.div
              key="sprint-backlog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ListView
                tasks={internalTasks}
                onOpenTask={onOpenTask || (() => {})}
                onUpdateTask={handleUpdateTask}
                onDeleteTasks={handleDeleteTasks}
                onOpenNewTask={onOpenNewTask || (() => {})}
              />
            </motion.div>
          )}

          {activeMenuIndex === 2 && (
            <motion.div
              key="kanban-board"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <BoardView
                tasks={internalTasks}
                onOpenTask={onOpenTask || (() => {})}
                onUpdateTask={handleUpdateTask}
                onOpenNewTask={onOpenNewTask || (() => {})}
              />
            </motion.div>
          )}

          {activeMenuIndex === 3 && (
            <motion.div
              key="sprint-calendar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <CalendarView
                tasks={internalTasks}
                onOpenTask={onOpenTask || (() => {})}
                onOpenNewTask={onOpenNewTask || (() => {})}
              />
            </motion.div>
          )}

          {activeMenuIndex === 4 && (
            <motion.div
              key="roles-allocation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <RolesView
                currentRoleKey={null}
                tasks={internalTasks}
                onOpenTask={onOpenTask || (() => {})}
                onNavigate={onNavigate || (() => {})}
                onOpenNewTask={onOpenNewTask || (() => {})}
              />
            </motion.div>
          )}

          {activeMenuIndex === 5 && (
            <motion.div
              key="project-docs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ProjectDocsView
                currentRoomId={rooms?.[0]?.id || 'r1'}
                onNavigate={onNavigate || (() => {})}
              />
            </motion.div>
          )}

          {activeMenuIndex === 6 && (
            <motion.div
              key="bruno-tools"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ToolsView />
            </motion.div>
          )}

          {activeMenuIndex === 7 && (
            <motion.div
              key="project-settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <SettingsView />
            </motion.div>
          )}
        </AnimatePresence>
        </div>

      </div>

      {/* Task Detail Modal */}
      <CaseTaskDetailModal
        task={activeTaskModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />


    </div>
  );
};
