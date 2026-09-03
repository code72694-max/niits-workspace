import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  AlertTriangle, 
  Check, 
  MessageSquare, 
  Paperclip, 
  Clock, 
  Tag, 
  ArrowRight,
  Kanban
} from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { ROLES_CONFIG, USERS_MAP } from '../data/mockData';

interface BoardViewProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onOpenNewTask: () => void;
}

const COLUMNS: { key: TaskStatus; label: string; color: string; wip?: number }[] = [
  { key: 'backlog', label: 'Backlog', color: '#5B7288' },
  { key: 'siap', label: 'Siap', color: '#4A90D9' },
  { key: 'jalan', label: 'Dikerjakan', color: '#1E6FD9', wip: 3 },
  { key: 'review', label: 'Review', color: '#B7791F' },
  { key: 'selesai', label: 'Selesai', color: '#0F8E82' }
];

export const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  onOpenTask,
  onUpdateTask,
  onOpenNewTask
}) => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const displayedColumns = hideCompleted 
    ? COLUMNS.filter(c => c.key !== 'selesai')
    : COLUMNS;

  const handleMoveStatus = (task: Task, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const order: TaskStatus[] = ['backlog', 'siap', 'jalan', 'review', 'selesai'];
    const currentIndex = order.indexOf(task.status);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < order.length) {
      onUpdateTask({ ...task, status: order[targetIndex] });
    }
  };

  return (
    <div className="space-y-4">
      {/* Board Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              hideCompleted
                ? 'bg-[#1E6FD9]/10 text-[#1E6FD9] border-[#1E6FD9]'
                : 'bg-white text-[#5B7288] border-[#E2EAF3] hover:bg-[#F4F8FD]'
            }`}
          >
            {hideCompleted ? 'Tampilkan Selesai' : 'Sembunyikan Selesai'}
          </button>
        </div>

        <div className="text-xs text-[#5B7288] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1E6FD9]" />
          <span>WIP limit aktif pada kolom Dikerjakan (maks 3 tugas)</span>
        </div>
      </div>

      {/* Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {displayedColumns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          const isOverWip = col.wip && colTasks.length > col.wip;
          const totalHours = colTasks.reduce((acc, t) => acc + parseInt(t.estimasi || '0'), 0);

          return (
            <div
              key={col.key}
              className="bg-[#F4F8FD]/60 border border-[#E2EAF3] rounded-2xl p-3 flex flex-col min-h-[480px] shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-bold text-[#0A2540]">{col.label}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isOverWip ? 'bg-[#C4562B] text-white' : 'bg-white text-[#5B7288] border border-[#E2EAF3]'
                  }`}>
                    {colTasks.length}{col.wip ? `/${col.wip}` : ''}
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-[#5B7288]">
                  {totalHours}j
                </span>
              </div>

              {isOverWip && (
                <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-[#C4562B]/10 border border-[#C4562B]/20 text-[11px] text-[#C4562B] font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>WIP limit terlampaui! Selesaikan tugas aktif sebelum mulai baru.</span>
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-2.5 flex-1">
                {colTasks.map((t) => {
                  const role = ROLES_CONFIG[t.peran];
                  const isPast = t.due < '2026-09-01' && t.status !== 'selesai';

                  return (
                    <motion.div
                      key={t.id}
                      layout
                      whileHover={{ y: -2, scale: 1.008 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onOpenTask(t)}
                      className="bg-white border border-[#E2EAF3] rounded-xl p-3.5 cursor-pointer shadow-2xs hover:shadow-md hover:border-[#1E6FD9] transition-all space-y-2.5 group"
                    >
                      {/* Top meta */}
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-4 rounded text-[9px] font-bold text-white flex items-center justify-center"
                            style={{ backgroundColor: role.color }}
                          >
                            {role.kode}
                          </span>
                          <span className="font-mono text-[#5B7288]">{t.id}</span>
                        </div>

                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          t.prioritas === 'urgent' ? 'bg-[#C4562B]/10 text-[#C4562B]' :
                          t.prioritas === 'high' ? 'bg-[#D98324]/10 text-[#D98324]' :
                          'bg-[#1E6FD9]/10 text-[#1E6FD9]'
                        }`}>
                          {t.prioritas}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-[#0A2540] group-hover:text-[#1E6FD9] transition-colors leading-snug">
                        {t.nama}
                      </h4>

                      {/* Subtasks Progress */}
                      {t.sub[1] > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10.5px] text-[#5B7288]">
                            <span>Subtugas</span>
                            <span className="font-mono">{t.sub[0]}/{t.sub[1]}</span>
                          </div>
                          <div className="w-full h-1 bg-[#EFF4F9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1E6FD9] rounded-full transition-all"
                              style={{ width: `${(t.sub[0] / t.sub[1]) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Bottom Footer info */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#EFF4F9] text-[11px] text-[#5B7288]">
                        <span className={isPast ? 'text-[#C4562B] font-bold' : ''}>
                          {isPast ? '⚠️ Lewat' : t.due}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Fast move status buttons */}
                          {col.key !== 'backlog' && (
                            <button
                              type="button"
                              onClick={(e) => handleMoveStatus(t, 'prev', e)}
                              title="Pindah ke status sebelumnya"
                              className="w-5 h-5 rounded bg-[#F4F8FD] hover:bg-[#E7F0FA] flex items-center justify-center text-[#5B7288]"
                            >
                              &larr;
                            </button>
                          )}
                          {col.key !== 'selesai' && (
                            <button
                              type="button"
                              onClick={(e) => handleMoveStatus(t, 'next', e)}
                              title="Pindah ke status selanjutnya"
                              className="w-5 h-5 rounded bg-[#F4F8FD] hover:bg-[#E7F0FA] flex items-center justify-center text-[#5B7288]"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center border-2 border-dashed border-[#D7E6F5] rounded-xl">
                    <p className="text-xs text-[#5B7288]">
                      Belum ada tugas di {col.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Add card button */}
              <button
                onClick={onOpenNewTask}
                className="mt-3 w-full py-2 rounded-xl text-xs font-medium text-[#5B7288] hover:text-[#0A2540] hover:bg-white border border-transparent hover:border-[#E2EAF3] flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kartu</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
