import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Save, 
  ChevronDown 
} from 'lucide-react';
import { CaseTask, AVAILABLE_ASSIGNEES, TaskCategory } from '../types/caseManagement';

interface CaseTaskDetailModalProps {
  task: CaseTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: CaseTask) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export const CaseTaskDetailModal: React.FC<CaseTaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onToggleComplete
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '2026-09-05');
  const [priority, setPriority] = useState(task.priority || 'normal');
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [assigneeName, setAssigneeName] = useState(task.assignee?.name || 'Unassigned');

  const handleSave = () => {
    const selectedAssignee = AVAILABLE_ASSIGNEES.find(a => a.name === assigneeName);
    onSave({
      ...task,
      title: title.trim() || task.title,
      description,
      dueDate,
      priority,
      category,
      assignee: selectedAssignee || (assigneeName === 'Unassigned' ? undefined : task.assignee),
      isActionableAdd: false
    });
    onClose();
  };

  const categories: TaskCategory[] = [
    'Request Processing',
    'Problem Resolution',
    'Customer Communication',
    'Testing and Verification',
    'Customer Notification',
    'Customer Satisfaction'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D5E0ED] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EEF5] bg-[#F8FAFD]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleComplete(task.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  task.completed 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${task.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{task.completed ? 'Selesai' : 'Belum Selesai'}</span>
              </button>

              <span className="text-xs text-[#5A6E82] font-medium">
                {task.stage === 'allocation' ? 'Casw Allocation' : task.stage === 'identification' ? 'Issue Identification' : 'Technical Resolution'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Nama Tugas
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E6FD9] focus:ring-2 focus:ring-[#1E6FD9]/10 outline-none text-sm font-medium text-[#0B1528]"
                placeholder="Masukkan nama tugas..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Deskripsi / Catatan Alur
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E6FD9] focus:ring-2 focus:ring-[#1E6FD9]/10 outline-none text-xs text-[#334D6E] leading-relaxed resize-none"
                placeholder="Jelaskan instruksi atau resolusi kasus..."
              />
            </div>

            {/* Category & Assignee Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#1E6FD9]" />
                  Kategori Tugas
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0B1528] bg-white outline-none focus:border-[#1E6FD9]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1E6FD9]" />
                  Penanggung Jawab
                </label>
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0B1528] bg-white outline-none focus:border-[#1E6FD9]"
                >
                  <option value="Unassigned">-- Belum Ditugaskan --</option>
                  {AVAILABLE_ASSIGNEES.map(a => (
                    <option key={a.name} value={a.name}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Due Date */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#1E6FD9]" />
                  Tenggat Waktu
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0B1528] bg-white outline-none focus:border-[#1E6FD9]"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Prioritas
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0B1528] bg-white outline-none focus:border-[#1E6FD9]"
                >
                  <option value="urgent">🔴 Urgent / Kritis</option>
                  <option value="high">🟠 High (Prioritas Tinggi)</option>
                  <option value="normal">🔵 Normal</option>
                  <option value="low">⚪ Low (Rendah)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8EEF5] bg-[#F8FAFD]">
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Tugas</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full btn-3d-primary text-white text-xs font-medium cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
