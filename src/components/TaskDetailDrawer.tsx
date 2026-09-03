import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  Calendar, 
  CheckSquare, 
  AlertCircle, 
  Paperclip, 
  Send, 
  Share2, 
  Tag, 
  Flame, 
  ThumbsUp, 
  Eye, 
  Play, 
  Pause,
  RotateCcw
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Comment, ActivityLog, Subtask } from '../types';
import { ROLES_CONFIG, USERS_MAP, CURRENT_USER } from '../data/mockData';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  onClose,
  onUpdateTask
}) => {
  const [activeTab, setActiveTab] = useState<'komentar' | 'aktivitas' | 'waktu'>('komentar');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(19200); // 5h 20m in seconds

  useEffect(() => {
    if (task) {
      // Mock initial comments for this task
      setComments([
        {
          id: 'c1',
          taskId: task.id,
          user: 'u4',
          waktu: '2 jam lalu',
          isi: 'Aku reproduksi di staging: 2 request paralel, dua-duanya lolos. Lock di service memang tidak cukup.',
          react: [{ e: '👀', n: 3 }]
        },
        {
          id: 'c2',
          taskId: task.id,
          user: 'u3',
          waktu: '1 jam lalu',
          isi: 'Setuju. Aku pakai SELECT ... FOR UPDATE di dalam transaksi, plus CHECK constraint stok >= 0 sebagai jaring terakhir.',
          react: [{ e: '🔥', n: 2 }, { e: '👍', n: 4 }]
        },
        {
          id: 'c3',
          taskId: task.id,
          user: 'u1',
          waktu: '34 menit lalu',
          isi: 'Tambahin test konkurensi ya, 50 request paralel. Kalau lolos tanpa oversell baru boleh merge. cc @Sinta Larasati',
          react: []
        }
      ]);
    }
  }, [task?.id]);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!task) return null;

  const role = ROLES_CONFIG[task.peran];
  const isPastDue = task.due <= '2026-09-01' && task.status !== 'selesai';

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours}j ${minutes}m ${seconds}d`;
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  const handlePriorityChange = (newPrio: TaskPriority) => {
    onUpdateTask({ ...task, prioritas: newPrio });
  };

  const handleToggleSubtask = (stId: string) => {
    const currentList = task.subtasksList || [];
    const updatedList = currentList.map(st => 
      st.id === stId ? { ...st, selesai: !st.selesai } : st
    );
    const completedCount = updatedList.filter(s => s.selesai).length;
    onUpdateTask({
      ...task,
      subtasksList: updatedList,
      sub: [completedCount, updatedList.length]
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newC: Comment = {
      id: `c-new-${Date.now()}`,
      taskId: task.id,
      user: CURRENT_USER.id,
      waktu: 'Baru saja',
      isi: commentText.trim(),
      react: []
    };

    setComments([...comments, newC]);
    setCommentText('');
    onUpdateTask({ ...task, komentar: task.komentar + 1 });
  };

  const handleAddEmojiReact = (commentId: string, emoji: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const existing = c.react?.find(r => r.e === emoji);
        if (existing) {
          return {
            ...c,
            react: c.react?.map(r => r.e === emoji ? { ...r, n: r.n + 1 } : r)
          };
        } else {
          return {
            ...c,
            react: [...(c.react || []), { e: emoji, n: 1 }]
          };
        }
      }
      return c;
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A2540]/30 backdrop-blur-[2px]"
        />

        {/* Drawer panel */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-[#E2EAF3] z-50 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-[#E2EAF3] bg-gradient-to-r from-[#F4F8FD] to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#1E6FD9] bg-[#E7F0FA] px-2.5 py-1 rounded-md">
                {task.id}
              </span>
              <span className="text-xs text-[#5B7288] font-medium">
                Sprint 14 &bull; A-01 AGRO
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => alert(`Tautan disalin: /task/${task.id}`)}
                title="Salin tautan"
                className="p-1.5 rounded-lg text-[#5B7288] hover:bg-[#EFF4F9] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#5B7288] hover:bg-[#EFF4F9] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EFF4F9]">
            {/* Title & Role */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <span 
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: role.color }}
                >
                  {role.kode} - {role.singkat}
                </span>
                {task.next && (
                  <span className="text-xs text-[#5B7288] flex items-center gap-1 bg-[#F4F8FD] px-2.5 py-1 rounded-full border border-[#E2EAF3]">
                    Handoff &rarr; <span className="font-semibold text-[#0A2540]">{ROLES_CONFIG[task.next]?.singkat}</span>
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-[#0A2540] leading-snug tracking-tight">
                {task.nama}
              </h2>

              {/* Status & Priority interactive controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3]">
                  <span className="text-[11px] font-medium text-[#5B7288] block mb-1">
                    Status Papan
                  </span>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                    className="w-full bg-white text-xs font-semibold text-[#0A2540] rounded-lg px-2.5 py-1.5 border border-[#D7E6F5] focus:outline-none focus:border-[#1E6FD9]"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="siap">Siap</option>
                    <option value="jalan">Dikerjakan</option>
                    <option value="review">Review</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3]">
                  <span className="text-[11px] font-medium text-[#5B7288] block mb-1">
                    Tingkat Prioritas
                  </span>
                  <select
                    value={task.prioritas}
                    onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                    className="w-full bg-white text-xs font-semibold text-[#0A2540] rounded-lg px-2.5 py-1.5 border border-[#D7E6F5] focus:outline-none focus:border-[#1E6FD9]"
                  >
                    <option value="low">Rendah</option>
                    <option value="normal">Normal</option>
                    <option value="high">Tinggi</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Meta attributes */}
            <div className="px-6 py-4 space-y-3 bg-[#F4F8FD]/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5B7288] flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Jatuh Tempo
                </span>
                <span className={`font-semibold ${isPastDue ? 'text-[#C4562B] bg-[#C4562B]/10 px-2 py-0.5 rounded-full' : 'text-[#0A2540]'}`}>
                  {isPastDue ? `⚠️ Lewat: ${task.due}` : task.due}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5B7288] flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Estimasi & Durasi
                </span>
                <span className="font-semibold text-[#0A2540]">
                  {task.estimasi} (tercatat: {Math.floor(timerSeconds/3600)}j {Math.floor((timerSeconds%3600)/60)}m)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5B7288] flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Label
                </span>
                <div className="flex gap-1">
                  {task.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-[#E7F0FA] text-[#1E6FD9] font-medium text-[11px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description & Technical Risk */}
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-2">
                  Deskripsi Masalah
                </h4>
                <p className="text-xs text-[#3C5A78] leading-relaxed">
                  {task.deskripsi}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#C4562B]/5 border border-[#C4562B]/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-[#C4562B] shrink-0 mt-0.5" />
                <div className="text-xs text-[#3C5A78] leading-relaxed">
                  <strong className="text-[#C4562B] block mb-0.5">Catatan Keamanan & Konkurensi:</strong>
                  Validasi di service bukan batas keamanan. Constraint di DB harus jadi jaring pengaman terakhir untuk mencegah anomali data.
                </div>
              </div>
            </div>

            {/* Interactive Subtasks */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                  Subtugas ({task.sub[0]}/{task.sub[1]} selesai)
                </h4>
                <span className="text-xs text-[#1E6FD9] font-semibold">
                  {task.sub[1] > 0 ? Math.round((task.sub[0] / task.sub[1]) * 100) : 0}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#E7F0FA] rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-[#1E6FD9] transition-all duration-300"
                  style={{ width: `${task.sub[1] > 0 ? (task.sub[0] / task.sub[1]) * 100 : 0}%` }}
                />
              </div>

              <div className="space-y-2">
                {task.subtasksList && task.subtasksList.length > 0 ? (
                  task.subtasksList.map((st) => (
                    <label
                      key={st.id}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        st.selesai ? 'bg-[#F4F8FD] border-[#D7E6F5]' : 'bg-white border-[#E2EAF3] hover:border-[#1E6FD9]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={st.selesai}
                        onChange={() => handleToggleSubtask(st.id)}
                        className="w-4 h-4 mt-0.5 rounded text-[#1E6FD9] focus:ring-[#1E6FD9]"
                      />
                      <span className={`flex-1 text-xs ${st.selesai ? 'line-through text-[#5B7288]' : 'text-[#0A2540] font-medium'}`}>
                        {st.nama}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="text-xs text-[#5B7288] italic py-2">
                    Belum ada subtugas yang dibuat.
                  </div>
                )}
              </div>
            </div>

            {/* Tabs: Komentar / Aktivitas / Waktu */}
            <div className="p-6 space-y-4">
              <div className="flex border-b border-[#E2EAF3] gap-6 text-xs">
                <button
                  onClick={() => setActiveTab('komentar')}
                  className={`pb-2.5 font-semibold transition-colors border-b-2 ${
                    activeTab === 'komentar' ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
                  }`}
                >
                  Komentar ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab('aktivitas')}
                  className={`pb-2.5 font-semibold transition-colors border-b-2 ${
                    activeTab === 'aktivitas' ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
                  }`}
                >
                  Aktivitas
                </button>
                <button
                  onClick={() => setActiveTab('waktu')}
                  className={`pb-2.5 font-semibold transition-colors border-b-2 ${
                    activeTab === 'waktu' ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
                  }`}
                >
                  Timer Kerja
                </button>
              </div>

              {/* Tab 1: Komentar */}
              {activeTab === 'komentar' && (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {comments.map((c) => {
                      const user = USERS_MAP[c.user] || CURRENT_USER;
                      return (
                        <div key={c.id} className="flex gap-3 text-xs bg-[#F4F8FD]/70 p-3 rounded-xl border border-[#EFF4F9]">
                          <span 
                            className="w-7 h-7 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0 shadow-sm"
                            style={{ backgroundColor: user.warna }}
                          >
                            {user.inisial}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#0A2540]">{user.nama}</span>
                              <span className="text-[10px] text-[#5B7288]">{c.waktu}</span>
                            </div>
                            <p className="text-[#3C5A78] leading-relaxed mb-2">
                              {c.isi}
                            </p>
                            <div className="flex items-center gap-1.5">
                              {c.react?.map((r) => (
                                <button
                                  key={r.e}
                                  onClick={() => handleAddEmojiReact(c.id, r.e)}
                                  className="px-2 py-0.5 rounded-full bg-white border border-[#D7E6F5] text-[11px] text-[#0A2540] hover:bg-[#E7F0FA] flex items-center gap-1"
                                >
                                  <span>{r.e}</span>
                                  <span className="font-mono text-[10px]">{r.n}</span>
                                </button>
                              ))}
                              <button
                                onClick={() => handleAddEmojiReact(c.id, '👍')}
                                className="px-1.5 py-0.5 rounded-full text-[11px] text-[#5B7288] hover:bg-white"
                                title="Tambah reaksi"
                              >
                                +👍
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Tulis balasan atau insight teknis..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#E2EAF3] text-xs focus:outline-none focus:border-[#1E6FD9]"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 2: Aktivitas */}
              {activeTab === 'aktivitas' && (
                <div className="space-y-3 text-xs text-[#3C5A78]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1E6FD9]" />
                    <span>Reza Fadhil mengubah status ke <strong>Dikerjakan</strong> (1 jam lalu)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C4562B]" />
                    <span>Hary Kurniawan menaikkan prioritas ke <strong>Urgent</strong> (3 jam lalu)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F8E82]" />
                    <span>Sinta Larasati melampirkan <code>log-oversell.txt</code> (5 jam lalu)</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Waktu / Timer */}
              {activeTab === 'waktu' && (
                <div className="p-4 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3] text-center space-y-3">
                  <div className="text-2xl font-mono font-bold text-[#0A2540]">
                    {formatTimer(timerSeconds)}
                  </div>
                  <p className="text-[11px] text-[#5B7288]">
                    Lacak waktu riil yang kamu habiskan untuk tugas ini
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white ${
                        timerRunning ? 'bg-[#C4562B] hover:bg-[#A3431D]' : 'bg-[#1E6FD9] hover:bg-[#12459C]'
                      }`}
                    >
                      {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {timerRunning ? 'Jeda Timer' : 'Mulai Timer'}
                    </button>
                    <button
                      onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                      className="p-2 rounded-full bg-white border border-[#E2EAF3] text-[#5B7288] hover:text-[#0A2540]"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
