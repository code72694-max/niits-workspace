import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Plus, 
  Trash2, 
  UserCheck, 
  Calendar, 
  ArrowRight, 
  SlidersHorizontal,
  FolderOpen,
  FolderKanban,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Zap,
  Gauge
} from 'lucide-react';
import { Task, RoleKey, TaskStatus, TaskPriority, Room } from '../types';
import { ROLES_CONFIG, USERS_MAP, ROLE_KEYS, INITIAL_LISTS, INITIAL_ROOMS, ROOMS_MAP } from '../data/mockData';
import { EmptyState } from '../components/EmptyState';

export interface ListViewProps {
  tasks: Task[];
  rooms?: Room[];
  selectedProjectId?: string;
  onSelectProject?: (roomId: string) => void;
  onOpenTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTasks: (taskIds: string[]) => void;
  onOpenNewTask: () => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  rooms = INITIAL_ROOMS,
  selectedProjectId: externalSelectedProjectId,
  onSelectProject,
  onOpenTask,
  onUpdateTask,
  onDeleteTasks,
  onOpenNewTask
}) => {
  const [internalSelectedProjectId, setInternalSelectedProjectId] = useState<string>('semua');
  const selectedProjectId = externalSelectedProjectId !== undefined 
    ? externalSelectedProjectId 
    : internalSelectedProjectId;

  const handleSelectProject = (roomId: string) => {
    setInternalSelectedProjectId(roomId);
    if (onSelectProject) {
      onSelectProject(roomId);
    }
  };

  const [selectedRole, setSelectedRole] = useState<string>('semua');
  const [groupBy, setGroupBy] = useState<'status' | 'prioritas'>('status');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [taskSearch, setTaskSearch] = useState<string>('');

  // Available projects (from props or default mock)
  const projectList = rooms && rooms.length > 0 ? rooms : INITIAL_ROOMS;
  const selectedProjectRoom = projectList.find(r => r.id === selectedProjectId);

  // Tasks in the selected project (before role/search filtering)
  const tasksInProject = tasks.filter(t => {
    if (selectedProjectId !== 'semua' && t.roomId !== selectedProjectId) return false;
    return true;
  });

  // Calculate Story Points and Estimasi Beban for selected project
  const getTaskStoryPoints = (t: Task): number => {
    if (t.storyPoints !== undefined) return t.storyPoints;
    const hours = parseInt(t.estimasi || '4');
    if (hours <= 2) return 1;
    if (hours <= 4) return 2;
    if (hours <= 6) return 3;
    if (hours <= 8) return 5;
    return 8;
  };

  const totalStoryPoints = tasksInProject.reduce((acc, t) => acc + getTaskStoryPoints(t), 0);
  const totalHours = tasksInProject.reduce((acc, t) => acc + parseInt(t.estimasi || '0'), 0);
  const urgentCount = tasksInProject.filter(t => t.prioritas === 'urgent').length;
  const highCount = tasksInProject.filter(t => t.prioritas === 'high').length;

  // Fully filtered tasks (project + role + search)
  const filteredTasks = tasksInProject.filter(t => {
    if (selectedRole !== 'semua' && t.peran !== selectedRole) return false;
    if (taskSearch.trim()) {
      const s = taskSearch.toLowerCase();
      const matchName = t.nama.toLowerCase().includes(s);
      const matchId = t.id.toLowerCase().includes(s);
      const matchDesc = t.deskripsi ? t.deskripsi.toLowerCase().includes(s) : false;
      if (!matchName && !matchId && !matchDesc) return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(i => i !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleBulkStatus = (status: TaskStatus) => {
    selectedTaskIds.forEach(id => {
      const t = tasks.find(item => item.id === id);
      if (t) onUpdateTask({ ...t, status });
    });
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    onDeleteTasks(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const handleToggleTaskStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: TaskStatus = task.status === 'selesai' ? 'jalan' : 'selesai';
    onUpdateTask({ ...task, status: nextStatus });
  };

  // Group definitions
  const statusGroups: { key: TaskStatus; label: string; color: string }[] = [
    { key: 'backlog', label: 'Backlog', color: '#5B7288' },
    { key: 'siap', label: 'Siap Dikerjakan', color: '#4A90D9' },
    { key: 'jalan', label: 'Sedang Dikerjakan', color: '#1E6FD9' },
    { key: 'review', label: 'Dalam Review', color: '#B7791F' },
    { key: 'selesai', label: 'Selesai', color: '#0F8E82' }
  ];

  const priorityGroups: { key: TaskPriority; label: string; color: string }[] = [
    { key: 'urgent', label: 'Urgent 🔥', color: '#C4562B' },
    { key: 'high', label: 'Prioritas Tinggi', color: '#D98324' },
    { key: 'normal', label: 'Normal', color: '#1E6FD9' },
    { key: 'low', label: 'Rendah', color: '#5B7288' }
  ];

  const groups = groupBy === 'status' 
    ? statusGroups.map(g => ({ ...g, items: filteredTasks.filter(t => t.status === g.key) }))
    : priorityGroups.map(g => ({ ...g, items: filteredTasks.filter(t => t.prioritas === g.key) }));

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. FILTER DIATAS: FILTER DAFTAR PROJECT & METRIK STORY POINT / BEBAN        */}
      {/* ========================================================================= */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 space-y-3 shadow-2xs">
        {/* Row 1: Filter Daftar Project Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B1528] pr-2.5 mr-0.5 border-r border-[#CBD5E1] shrink-0">
              <FolderKanban className="w-4 h-4 text-[#1E6FD9]" />
              <span>Daftar Project:</span>
            </div>

            {/* "Semua Project" Button */}
            <button
              onClick={() => handleSelectProject('semua')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedProjectId === 'semua'
                  ? 'bg-[#0B1528] text-white shadow-xs'
                  : 'bg-white text-[#5A6E82] border border-[#DCE4EC] hover:bg-[#F1F5F9] hover:text-[#0B1528]'
              }`}
            >
              <span>Semua Project</span>
              <span className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedProjectId === 'semua' ? 'bg-white/20 text-white' : 'bg-[#EAEFF5] text-[#5A6E82]'
              }`}>
                {tasks.length}
              </span>
            </button>

            {/* Projects list from rooms */}
            {projectList.map((room) => {
              const isSelected = selectedProjectId === room.id;
              const count = tasks.filter(t => t.roomId === room.id).length;
              return (
                <button
                  key={room.id}
                  onClick={() => handleSelectProject(room.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#0B1528] font-bold border-2 shadow-xs'
                      : 'bg-white text-[#5A6E82] border border-[#DCE4EC] hover:bg-[#F1F5F9] hover:text-[#0B1528]'
                  }`}
                  style={{
                    borderColor: isSelected ? (room.warna || '#1E6FD9') : undefined,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: room.warna || '#1E6FD9' }}
                  />
                  <span className="truncate max-w-[130px] sm:max-w-none">{room.nama}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-[#0B1528] text-white' : 'bg-[#EAEFF5] text-[#5A6E82]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Quick Project Story Point & Beban Stats */}
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-[#E2E8F0] text-xs shadow-2xs">
              <span className="flex items-center gap-1 font-bold text-[#0B1528]">
                <Sparkles className="w-3.5 h-3.5 text-[#7A5AF8]" />
                {totalStoryPoints} SP
              </span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="flex items-center gap-1 font-medium text-[#1E6FD9]">
                <Gauge className="w-3.5 h-3.5 text-[#1E6FD9]" />
                {totalHours}j Beban
              </span>
              {(urgentCount > 0 || highCount > 0) && (
                <>
                  <span className="text-[#CBD5E1]">•</span>
                  <span className="text-[11px] font-bold text-[#C4562B]">
                    {urgentCount + highCount} Prioritas Tinggi
                  </span>
                </>
              )}
            </div>

            {selectedProjectRoom && (
              <span 
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg text-white shadow-2xs" 
                style={{ backgroundColor: selectedProjectRoom.warna }}
                title={`Kode Project: ${selectedProjectRoom.kode}`}
              >
                {selectedProjectRoom.kode}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Sub-toolbar for Roles in Project, Search, and Group By */}
        <div className="pt-2.5 border-t border-[#EAEFF5] flex flex-wrap items-center justify-between gap-2.5">
          {/* Role pills scoped to project */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            <span className="text-[11px] font-semibold text-[#5A6E82] mr-1 hidden sm:inline">Peran:</span>
            <button
              onClick={() => setSelectedRole('semua')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedRole === 'semua'
                  ? 'bg-white text-[#1E6FD9] border border-[#1E6FD9] shadow-xs'
                  : 'bg-white text-[#5B7288] border border-[#E2EAF3] hover:bg-[#F4F8FD]'
              }`}
            >
              Semua Peran ({tasksInProject.length})
            </button>
            {ROLE_KEYS.map((rk) => {
              const role = ROLES_CONFIG[rk];
              const isSelected = selectedRole === rk;
              const count = tasksInProject.filter(t => t.peran === rk).length;
              if (count === 0 && selectedProjectId !== 'semua') return null;
              return (
                <button
                  key={rk}
                  onClick={() => setSelectedRole(rk)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-white font-semibold text-[#0A2540] border shadow-xs'
                      : 'bg-white text-[#5B7288] border border-[#E2EAF3] hover:bg-[#F4F8FD]'
                  }`}
                  style={{ borderColor: isSelected ? role.color : undefined }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                  <span>{role.singkat}</span>
                  <span className="text-[10.5px] font-mono text-[#5B7288]">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Group By & Add New Task */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick search input */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2EAF3] text-xs shadow-2xs focus-within:border-[#1E6FD9] transition-all">
              <Search className="w-3.5 h-3.5 text-[#5B7288]" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Cari user story / tugas..."
                className="bg-transparent border-none outline-none text-xs w-28 sm:w-36 text-[#0A2540] placeholder:text-[#5B7288]"
              />
              {taskSearch && (
                <button
                  onClick={() => setTaskSearch('')}
                  className="text-[#5B7288] hover:text-[#0A2540] text-[11px] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Group By toggle */}
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-[#E2EAF3] text-xs">
              <button
                onClick={() => setGroupBy('status')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  groupBy === 'status'
                    ? 'bg-[#0B1528] text-white shadow-xs'
                    : 'text-[#5B7288] hover:text-[#0A2540]'
                }`}
              >
                Status
              </button>
              <button
                onClick={() => setGroupBy('prioritas')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  groupBy === 'prioritas'
                    ? 'bg-[#0B1528] text-white shadow-xs'
                    : 'text-[#5B7288] hover:text-[#0A2540]'
                }`}
              >
                Prioritas
              </button>
            </div>

            {/* Add task button */}
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E6FD9] text-white text-xs font-semibold hover:bg-[#12459C] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedTaskIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#1E6FD9] to-[#12459C] text-white shadow-lg shadow-[#12459C]/20 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="font-bold bg-white/20 px-2.5 py-1 rounded-lg">
              {selectedTaskIds.length} Tugas Dipilih
            </span>
            <span>Ubah status serentak:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('siap')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors cursor-pointer"
            >
              Siap
            </button>
            <button
              onClick={() => handleBulkStatus('jalan')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors cursor-pointer"
            >
              Dikerjakan
            </button>
            <button
              onClick={() => handleBulkStatus('review')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors cursor-pointer"
            >
              Review
            </button>
            <button
              onClick={() => handleBulkStatus('selesai')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors cursor-pointer"
            >
              Selesai
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded-lg bg-[#C4562B] text-white hover:bg-[#A3431D] font-medium flex items-center gap-1 transition-colors ml-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Table Container */}
      <div className="bg-white border border-[#E2EAF3] rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2EAF3] bg-[#F4F8FD] text-xs font-semibold text-[#5B7288]">
          <input
            type="checkbox"
            checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded text-[#1E6FD9] focus:ring-[#1E6FD9] cursor-pointer"
          />
          <span className="w-7 text-center">Peran</span>
          <span className="w-14">ID</span>
          <span className="flex-1">User Story / Tugas</span>
          <span className="w-24 text-center">Story Point</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-18 text-center">PIC</span>
          <span className="w-22 text-center">Tenggat</span>
          <span className="w-20 text-center">Prioritas</span>
          <span className="w-14 text-center">Sub</span>
        </div>

        {/* Groups */}
        {groups.map((group) => {
          if (group.items.length === 0) return null;
          const groupStoryPoints = group.items.reduce((acc, t) => acc + getTaskStoryPoints(t), 0);
          const groupHours = group.items.reduce((acc, t) => acc + parseInt(t.estimasi || '0'), 0);

          return (
            <div key={group.key} className="border-b border-[#EFF4F9] last:border-b-0">
              {/* Group Title Bar */}
              <div 
                className="flex items-center justify-between px-4 py-2 text-xs font-semibold bg-[#F4F8FD]/50 border-b border-[#EFF4F9]"
                style={{ borderLeftColor: group.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0A2540]">{group.label}</span>
                  <span className="text-[11px] px-2 py-0.2 rounded-full bg-white border border-[#E2EAF3] text-[#5B7288]">
                    {group.items.length}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#5B7288] font-mono">
                  <span className="font-semibold text-[#0B1528]">{groupStoryPoints} SP</span>
                  <span>•</span>
                  <span>{groupHours} jam beban</span>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#EFF4F9]">
                {group.items.map((t) => {
                  const isSelected = selectedTaskIds.includes(t.id);
                  const isPast = t.due < '2026-09-01' && t.status !== 'selesai';
                  const role = ROLES_CONFIG[t.peran];
                  const user = USERS_MAP[t.assignee[0]];
                  const sp = getTaskStoryPoints(t);
                  const taskRoom = projectList.find(r => r.id === t.roomId);

                  return (
                    <div
                      key={t.id}
                      onClick={() => onOpenTask(t)}
                      className={`flex items-center gap-3 px-4 py-3 text-xs cursor-pointer hover:bg-[#F4F8FD] transition-colors group ${
                        isSelected ? 'bg-[#F4F8FD]' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectOne(t.id, e as any)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded text-[#1E6FD9] focus:ring-[#1E6FD9] cursor-pointer"
                      />

                      {/* Role badge */}
                      <span
                        className="w-7 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: role.color }}
                        title={`Peran: ${role.label}`}
                      >
                        {role.kode}
                      </span>

                      {/* ID */}
                      <span className="w-14 font-mono text-[11px] text-[#5B7288] shrink-0">
                        {t.id}
                      </span>

                      {/* Title & Quick Check & Project Badge */}
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleTaskStatus(t, e)}
                          title="Tandai selesai"
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            t.status === 'selesai'
                              ? 'bg-[#0F8E82] border-[#0F8E82] text-white'
                              : 'border-[#D7E6F5] hover:border-[#1E6FD9] text-transparent hover:text-[#1E6FD9]'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </button>

                        <span className={`font-medium truncate ${
                          t.status === 'selesai' ? 'line-through text-[#5B7288]' : 'text-[#0A2540] group-hover:text-[#1E6FD9]'
                        }`}>
                          {t.nama}
                        </span>

                        {/* If viewing Semua Project, show which project this task belongs to */}
                        {selectedProjectId === 'semua' && taskRoom && (
                          <span 
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 border"
                            style={{ 
                              color: taskRoom.warna || '#1E6FD9', 
                              backgroundColor: `${taskRoom.warna || '#1E6FD9'}10`,
                              borderColor: `${taskRoom.warna || '#1E6FD9'}30`
                            }}
                          >
                            {taskRoom.kode}
                          </span>
                        )}

                        {t.komentar > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-[#5B7288] shrink-0">
                            <MessageSquare className="w-3 h-3" />
                            {t.komentar}
                          </span>
                        )}
                        {t.lampiran > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-[#5B7288] shrink-0">
                            <Paperclip className="w-3 h-3" />
                            {t.lampiran}
                          </span>
                        )}
                      </div>

                      {/* Story Point & Estimasi Beban */}
                      <span className="w-24 text-center shrink-0">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-[#F1F5F9] text-[#0B1528] border border-[#E2E8F0]">
                          <span className="font-bold text-[#7A5AF8]">{sp} SP</span>
                          <span className="text-[#94A3B8]">/</span>
                          <span className="text-[#5A6E82]">{t.estimasi}</span>
                        </span>
                      </span>

                      {/* Status */}
                      <span className="w-24 text-center shrink-0">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-[#F4F8FD] text-[#1E6FD9] border border-[#D7E6F5]">
                          {t.status}
                        </span>
                      </span>

                      {/* Assignee */}
                      <span className="w-18 flex justify-center shrink-0">
                        {user ? (
                          <span 
                            title={user.nama}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: user.warna }}
                          >
                            {user.inisial}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </span>

                      {/* Due */}
                      <span className={`w-22 text-center font-mono text-[11px] shrink-0 ${
                        isPast ? 'text-[#C4562B] font-bold' : 'text-[#5B7288]'
                      }`}>
                        {isPast ? `⚠️ ${t.due}` : t.due}
                      </span>

                      {/* Priority */}
                      <span className="w-20 text-center shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.prioritas === 'urgent' ? 'bg-[#C4562B]/10 text-[#C4562B]' :
                          t.prioritas === 'high' ? 'bg-[#D98324]/10 text-[#D98324]' :
                          'bg-[#1E6FD9]/10 text-[#1E6FD9]'
                        }`}>
                          {t.prioritas.toUpperCase()}
                        </span>
                      </span>

                      {/* Subtask count */}
                      <span className="w-14 text-center font-mono text-[11px] text-[#5B7288] shrink-0">
                        {t.sub[0]}/{t.sub[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty state if 0 tasks match */}
        {filteredTasks.length === 0 && (
          <EmptyState
            title="Tidak ada user story / tugas untuk filter ini"
            description={`Tidak ditemukan tugas untuk proyek ${selectedProjectRoom ? `"${selectedProjectRoom.nama}"` : ''} dengan peran "${selectedRole}". Coba pilih filter lain atau tambahkan tugas baru.`}
            actionText="Tampilkan Semua Peran"
            onAction={() => setSelectedRole('semua')}
            secondaryActionText="Buat Tugas Baru"
            onSecondaryAction={onOpenNewTask}
          />
        )}
      </div>
    </div>
  );
};
