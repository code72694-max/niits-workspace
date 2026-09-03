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
  MessageSquare,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Search
} from 'lucide-react';
import { Task, RoleKey, TaskStatus, TaskPriority } from '../types';
import { ROLES_CONFIG, USERS_MAP, ROLE_KEYS, INITIAL_LISTS } from '../data/mockData';
import { EmptyState } from '../components/EmptyState';

interface ListViewProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTasks: (taskIds: string[]) => void;
  onOpenNewTask: () => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  onOpenTask,
  onUpdateTask,
  onDeleteTasks,
  onOpenNewTask
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('semua');
  const [groupBy, setGroupBy] = useState<'status' | 'prioritas'>('status');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [activeListId, setActiveListId] = useState<string>('l1');
  const [taskSearch, setTaskSearch] = useState<string>('');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
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
      {/* Top Filter & List bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Role pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedRole('semua')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedRole === 'semua'
                ? 'bg-white text-[#1E6FD9] border border-[#1E6FD9] shadow-xs'
                : 'bg-white text-[#5B7288] border border-[#E2EAF3] hover:bg-[#F4F8FD]'
            }`}
          >
            Semua Peran ({tasks.length})
          </button>
          {ROLE_KEYS.map((rk) => {
            const role = ROLES_CONFIG[rk];
            const isSelected = selectedRole === rk;
            const count = tasks.filter(t => t.peran === rk).length;
            return (
              <button
                key={rk}
                onClick={() => setSelectedRole(rk)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
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

        {/* Search, Group by toggle & Add Task */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick list filter input */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2EAF3] text-xs shadow-2xs focus-within:border-[#1E6FD9] transition-all">
            <Search className="w-3.5 h-3.5 text-[#5B7288]" />
            <input
              type="text"
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              placeholder="Filter list ini..."
              className="bg-transparent text-xs text-[#0A2540] placeholder-[#5B7288] focus:outline-none w-28 sm:w-36"
            />
            {taskSearch && (
              <button
                onClick={() => setTaskSearch('')}
                className="text-[#5B7288] hover:text-[#0A2540] text-[11px]"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#E2EAF3] rounded-full p-1 shadow-2xs">
            <span className="text-[11px] text-[#5B7288] pl-2 pr-1 font-medium">Kelompok:</span>
            <button
              onClick={() => setGroupBy('status')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                groupBy === 'status' ? 'bg-[#F4F8FD] text-[#1E6FD9]' : 'text-[#5B7288] hover:text-[#0A2540]'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setGroupBy('prioritas')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                groupBy === 'prioritas' ? 'bg-[#F4F8FD] text-[#1E6FD9]' : 'text-[#5B7288] hover:text-[#0A2540]'
              }`}
            >
              Prioritas
            </button>
          </div>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tugas Baru</span>
          </button>
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
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors"
            >
              Siap
            </button>
            <button
              onClick={() => handleBulkStatus('jalan')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors"
            >
              Dikerjakan
            </button>
            <button
              onClick={() => handleBulkStatus('review')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors"
            >
              Review
            </button>
            <button
              onClick={() => handleBulkStatus('selesai')}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-medium transition-colors"
            >
              Selesai
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded-lg bg-[#C4562B] text-white hover:bg-[#A3431D] font-medium flex items-center gap-1 transition-colors ml-2"
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
            className="w-4 h-4 rounded text-[#1E6FD9] focus:ring-[#1E6FD9]"
          />
          <span className="w-7 text-center">Peran</span>
          <span className="w-14">ID</span>
          <span className="flex-1">Nama Tugas</span>
          <span className="w-28 text-center">Status</span>
          <span className="w-20 text-center">Orang</span>
          <span className="w-24 text-center">Tempo</span>
          <span className="w-20 text-center">Prioritas</span>
          <span className="w-16 text-center">Sub</span>
        </div>

        {/* Groups */}
        {groups.map((group) => {
          if (group.items.length === 0) return null;

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
                <span className="text-[11px] text-[#5B7288] font-mono">
                  {group.items.reduce((acc, t) => acc + parseInt(t.estimasi || '0'), 0)} jam est.
                </span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#EFF4F9]">
                {group.items.map((t) => {
                  const isSelected = selectedTaskIds.includes(t.id);
                  const isPast = t.due < '2026-09-01' && t.status !== 'selesai';
                  const role = ROLES_CONFIG[t.peran];
                  const user = USERS_MAP[t.assignee[0]];

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
                        className="w-4 h-4 rounded text-[#1E6FD9] focus:ring-[#1E6FD9]"
                      />

                      {/* Role badge */}
                      <span
                        className="w-7 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: role.color }}
                      >
                        {role.kode}
                      </span>

                      {/* ID */}
                      <span className="w-14 font-mono text-[11px] text-[#5B7288] shrink-0">
                        {t.id}
                      </span>

                      {/* Title & Quick Check */}
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleTaskStatus(t, e)}
                          title="Tandai selesai"
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
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

                      {/* Status */}
                      <span className="w-28 text-center shrink-0">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-[#F4F8FD] text-[#1E6FD9] border border-[#D7E6F5]">
                          {t.status}
                        </span>
                      </span>

                      {/* Assignee */}
                      <span className="w-20 flex justify-center shrink-0">
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
                      <span className={`w-24 text-center font-mono text-[11px] shrink-0 ${
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
                      <span className="w-16 text-center font-mono text-[11px] text-[#5B7288] shrink-0">
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
            title="Tidak ada tugas untuk filter ini"
            description={`Tidak ditemukan tugas untuk peran "${selectedRole}". Coba pilih "Semua Peran" atau buat tugas baru.`}
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
