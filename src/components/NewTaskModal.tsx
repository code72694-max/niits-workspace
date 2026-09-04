import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Calendar, Clock, Tag, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Task, Room, RoleKey, TaskPriority, TaskStatus, Subtask } from '../types';
import { ROLES_CONFIG, INITIAL_USERS, ROLE_KEYS, INITIAL_ROOMS } from '../data/mockData';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms?: Room[];
  currentRoomId?: string;
  currentRoleKey?: RoleKey | null;
  onAddTask?: (task: Task) => void;
  onSubmit?: (task: Task) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  rooms = INITIAL_ROOMS,
  currentRoomId = 'r1',
  currentRoleKey,
  onAddTask,
  onSubmit
}) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [roomId, setRoomId] = useState(currentRoomId);
  const [peran, setPeran] = useState<RoleKey>(currentRoleKey || 'fe');
  const [nextPeran, setNextPeran] = useState<RoleKey | ''>('qa');
  const [prioritas, setPrioritas] = useState<TaskPriority>('normal');
  const [status, setStatus] = useState<TaskStatus>('siap');
  const [assignee, setAssignee] = useState<string[]>(['u5']);
  const [due, setDue] = useState('2026-09-08');
  const [estimasi, setEstimasi] = useState('6j');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['fitur']);
  const [subtasks, setSubtasks] = useState<string[]>(['Analisis spesifikasi & mock', 'Implementasi kode']);
  const [newSubtask, setNewSubtask] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const subtasksList: Subtask[] = subtasks.map((st, i) => ({
      id: `st-new-${Date.now()}-${i}`,
      nama: st,
      selesai: false,
      assignee: assignee[0] || 'u1'
    }));

    const newTask: Task = {
      id: `T-${Math.floor(250 + Math.random() * 50)}`,
      listId: 'l1',
      roomId: roomId,
      peran: peran,
      next: nextPeran ? (nextPeran as RoleKey) : undefined,
      nama: nama.trim(),
      status: status,
      prioritas: prioritas,
      assignee: assignee.length ? assignee : ['u1'],
      due: due,
      tags: tags.length ? tags : ['tugas'],
      sub: [0, subtasks.length],
      subtasksList: subtasksList,
      komentar: 0,
      lampiran: 0,
      estimasi: estimasi.endsWith('j') ? estimasi : `${estimasi}j`,
      deskripsi: deskripsi.trim() || 'Tidak ada deskripsi tambahan.'
    };

    const handler = onAddTask || onSubmit;
    if (handler) {
      handler(newTask);
    }
    setNama('');
    setDeskripsi('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A2540]/40 backdrop-blur-[2px]"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2EAF3] overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2EAF3] bg-gradient-to-r from-[#F4F8FD] to-white">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#0A2540]">
                  Buat Tugas Baru
                </h3>
                <p className="text-xs text-[#5B7288]">
                  Tugas akan masuk ke ruang peran dan room terkait
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5B7288] hover:bg-[#E7F0FA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Judul Tugas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Implementasi validasi Zod untuk endpoint order"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-sm focus:outline-none focus:border-[#1E6FD9] focus:ring-2 focus:ring-[#1E6FD9]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Deskripsi
              </label>
              <textarea
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan kebutuhan, batasan masalah, atau tautan isu terkait..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-sm focus:outline-none focus:border-[#1E6FD9] focus:ring-2 focus:ring-[#1E6FD9]/10 transition-all resize-none"
              />
            </div>

            {/* Room & Role selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Room Project
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.kode} - {r.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Ruang Peran Utama
                </label>
                <select
                  value={peran}
                  onChange={(e) => setPeran(e.target.value as RoleKey)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                >
                  {ROLE_KEYS.map((rk) => (
                    <option key={rk} value={rk}>
                      {ROLES_CONFIG[rk].kode} - {ROLES_CONFIG[rk].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Next handoff role & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Serahkan Selanjutnya (Handoff)
                </label>
                <select
                  value={nextPeran}
                  onChange={(e) => setNextPeran(e.target.value as RoleKey | '')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                >
                  <option value="">Tidak ada handoff</option>
                  {ROLE_KEYS.filter(rk => rk !== peran).map((rk) => (
                    <option key={rk} value={rk}>
                      Serahkan ke {ROLES_CONFIG[rk].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Status Awal
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                >
                  <option value="backlog">Backlog</option>
                  <option value="siap">Siap</option>
                  <option value="jalan">Dikerjakan</option>
                  <option value="review">Review</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            {/* Prioritas, Due Date, Estimasi */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Prioritas
                </label>
                <select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                >
                  <option value="low">Rendah</option>
                  <option value="normal">Normal</option>
                  <option value="high">Tinggi</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                  Estimasi (jam)
                </label>
                <input
                  type="text"
                  value={estimasi}
                  onChange={(e) => setEstimasi(e.target.value)}
                  placeholder="mis: 6j"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EAF3] text-xs bg-white focus:outline-none focus:border-[#1E6FD9]"
                />
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                Subtugas ({subtasks.length})
              </label>
              <div className="space-y-1.5 mb-2">
                {subtasks.map((st, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4F8FD] text-xs text-[#0A2540]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9]" />
                    <span className="flex-1 truncate">{st}</span>
                    <button
                      type="button"
                      onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))}
                      className="text-[#5B7288] hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                  placeholder="Ketik subtugas lalu tekan Enter..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E2EAF3] focus:outline-none focus:border-[#1E6FD9]"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E7F0FA] text-[#1E6FD9] hover:bg-[#D7E6F5]"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                Label / Tag
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EFF4F9] text-[#3C5A78]">
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-red-500 ml-0.5">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Tambah tag baru..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E2EAF3] focus:outline-none focus:border-[#1E6FD9]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E7F0FA] text-[#1E6FD9] hover:bg-[#D7E6F5]"
                >
                  Tambah Tag
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-[#E2EAF3] bg-[#F4F8FD]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5B7288] hover:text-[#0A2540]"
            >
              Batal
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="btn-3d-primary px-5 py-2 rounded-full text-xs font-medium cursor-pointer"
            >
              Simpan Tugas
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
