import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FolderKanban, 
  Search, 
  Plus, 
  Lock, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  FileText, 
  Users,
  Filter
} from 'lucide-react';
import { Room, Task } from '../types';

interface ProjectsListViewProps {
  rooms: Room[];
  tasks: Task[];
  onSelectProject: (roomId: string, tab?: string) => void;
  onOpenNewTask: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  rooms,
  tasks,
  onSelectProject,
  onOpenNewTask,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'privat' | 'publik'>('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.ringkas.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrivacy = filterPrivacy === 'all' || room.akses === filterPrivacy;
    return matchesSearch && matchesPrivacy;
  });

  // Calculate high-level stats
  const totalProjects = rooms.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'selesai').length;

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#D5E0ED] rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1528] text-white flex items-center justify-center shadow-xs shrink-0">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1528] tracking-tight">
                Daftar Proyek & Ruang Tim
              </h1>
              <p className="text-xs sm:text-sm text-[#5A6E82] mt-0.5">
                Pilih proyek untuk melihat detail lengkap, papan sprint kanban, serahan dokumen, dan anggota tim.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-3 px-3.5 py-2 bg-[#F4F8FD] border border-[#D8E1EC] rounded-full text-xs font-semibold text-[#0B1528]">
              <span>{totalProjects} Proyek</span>
              <span className="w-1 h-1 rounded-full bg-[#8CA9C9]" />
              <span>{completedTasks}/{totalTasks} Tugas Selesai</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-[#EEF3F8]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA9C9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, kode, atau deskripsi proyek..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#D8E1EC] rounded-full text-[#0B1528] placeholder-[#8CA9C9] focus:outline-none focus:border-[#1E6FD9] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#5A6E82] font-medium hidden sm:inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#8CA9C9]" /> Filter:
            </span>
            {(['all', 'privat', 'publik'] as const).map((privacy) => (
              <button
                key={privacy}
                onClick={() => setFilterPrivacy(privacy)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterPrivacy === privacy
                    ? 'bg-[#0B1528] text-white shadow-2xs'
                    : 'bg-white border border-[#D8E1EC] text-[#4A5D70] hover:bg-[#F4F8FD]'
                }`}
              >
                {privacy === 'all' ? 'Semua' : privacy === 'privat' ? 'Privat' : 'Publik'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const roomTasks = tasks.filter(t => t.roomId === room.id);
          const finishedTasks = roomTasks.filter(t => t.status === 'selesai').length;
          const progressPct = roomTasks.length > 0 
            ? Math.round((finishedTasks / roomTasks.length) * 100) 
            : Math.round((room.selesai / room.tugas) * 100);

          return (
            <motion.div
              key={room.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-[24px] border border-[#D5E0ED] p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#1E6FD9]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top badges: Code & Privacy */}
                <div className="flex items-center justify-between mb-3.5">
                  <span 
                    className="font-mono font-bold px-2.5 py-1 rounded-lg text-xs text-white shadow-2xs"
                    style={{ backgroundColor: room.warna || '#1E6FD9' }}
                  >
                    {room.kode}
                  </span>
                  <span className="text-[11px] font-semibold text-[#5A6E82] flex items-center gap-1.5 bg-[#F4F8FD] px-2.5 py-1 rounded-full border border-[#D8E1EC]">
                    {room.akses === 'privat' ? (
                      <Lock className="w-3 h-3 text-[#E38977]" />
                    ) : (
                      <Globe className="w-3 h-3 text-[#1E6FD9]" />
                    )}
                    {room.akses.toUpperCase()}
                  </span>
                </div>

                {/* Project Title & Summary */}
                <h3 className="text-base font-bold text-[#0B1528] group-hover:text-[#1E6FD9] transition-colors line-clamp-1">
                  {room.nama}
                </h3>
                <p className="text-xs text-[#5A6E82] mt-1.5 leading-relaxed line-clamp-2 min-h-[36px]">
                  {room.ringkas}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-[#EEF3F8] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#5A6E82]">
                    <span>Progres Kasus & Fitur</span>
                    <span className="font-mono font-bold text-[#0B1528]">{progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EEF3F8] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${progressPct}%`, 
                        backgroundColor: room.warna || '#1E6FD9' 
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8CA9C9] pt-0.5">
                    <span>{finishedTasks} dari {roomTasks.length || room.tugas} selesai</span>
                    <span>Sprint Aktif</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Open Project Detail & Shortcuts */}
              <div className="mt-5 pt-3.5 border-t border-[#EEF3F8] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectProject(room.id, 'board')}
                    className="p-1.5 rounded-lg bg-[#F4F8FD] hover:bg-[#E8EEF5] text-[#4A5D70] hover:text-[#0B1528] transition-colors cursor-pointer"
                    title="Buka Papan Kanban"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectProject(room.id, 'calendar')}
                    className="p-1.5 rounded-lg bg-[#F4F8FD] hover:bg-[#E8EEF5] text-[#4A5D70] hover:text-[#0B1528] transition-colors cursor-pointer"
                    title="Buka Kalender Sprint"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectProject(room.id, 'docs')}
                    className="p-1.5 rounded-lg bg-[#F4F8FD] hover:bg-[#E8EEF5] text-[#4A5D70] hover:text-[#0B1528] transition-colors cursor-pointer"
                    title="Buka Dokumen Proyek"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onSelectProject(room.id, 'dashboard')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0B1528] hover:bg-[#1E6FD9] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  <span>Detail Proyek</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="bg-white rounded-[24px] border border-[#D5E0ED] p-12 text-center">
          <FolderKanban className="w-10 h-10 text-[#8CA9C9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1528]">Tidak ada proyek yang sesuai</h3>
          <p className="text-xs text-[#5A6E82] mt-1">Coba kata kunci pencarian yang lain atau ubah filter privasi.</p>
        </div>
      )}
    </div>
  );
};
