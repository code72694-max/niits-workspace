import React, { useState, useMemo, useEffect } from 'react';
import { 
  FolderKanban, 
  Search, 
  Plus, 
  Lock, 
  Globe, 
  Filter,
  ArrowUpDown,
  X,
  Palette
} from 'lucide-react';
import { Room, Task } from '../types';
import { ProjectFolderCard, CoverConfig } from '../components/ProjectFolderCard';
import { ProjectCoverModal, PRESET_GRADIENTS, PRESET_PHOTOS } from '../components/ProjectCoverModal';

interface ProjectsListViewProps {
  rooms: Room[];
  tasks: Task[];
  onSelectProject: (roomId: string, tab?: string) => void;
  onOpenNewTask: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

// Default initial covers for rooms (Monochrome & Blue Theme)
export const DEFAULT_COVERS: Record<string, CoverConfig> = {
  'room-1': {
    type: 'gradient',
    value: PRESET_GRADIENTS[4].value, // Sky to Indigo (Tema Biru)
    name: PRESET_GRADIENTS[4].name
  },
  'room-2': {
    type: 'gradient',
    value: PRESET_GRADIENTS[0].value, // Clean Silver (Monochrome)
    name: PRESET_GRADIENTS[0].name
  },
  'room-3': {
    type: 'gradient',
    value: PRESET_GRADIENTS[5].value, // Deep Navy (Tema Biru)
    name: PRESET_GRADIENTS[5].name
  },
  'room-4': {
    type: 'gradient',
    value: PRESET_GRADIENTS[1].value, // Charcoal Slate (Monochrome)
    name: PRESET_GRADIENTS[1].name
  },
  'room-5': {
    type: 'gradient',
    value: PRESET_GRADIENTS[6].value, // Ocean Cyan (Tema Biru)
    name: PRESET_GRADIENTS[6].name
  },
  'room-6': {
    type: 'gradient',
    value: PRESET_GRADIENTS[2].value, // Obsidian Black (Monochrome)
    name: PRESET_GRADIENTS[2].name
  }
};

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  rooms,
  tasks,
  onSelectProject,
  onOpenNewTask,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'tasks'>('name');
  
  // Custom project covers storage
  const [covers, setCovers] = useState<Record<string, CoverConfig>>(() => {
    try {
      const saved = localStorage.getItem('niits_project_covers');
      if (saved) {
        return { ...DEFAULT_COVERS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_COVERS;
  });

  // Target room for cover modal
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const handleSaveCover = (roomId: string, newCover: CoverConfig) => {
    setCovers(prev => {
      const updated = { ...prev, [roomId]: newCover };
      try {
        localStorage.setItem('niits_project_covers', JSON.stringify(updated));
      } catch {
        // Local storage fail safe
      }
      return updated;
    });
    onShowToast?.('Cover proyek berhasil diperbarui!', 'success');
  };

  // Filter & sort rooms
  const filteredRooms = useMemo(() => {
    const list = rooms.filter(room => {
      const matchesSearch = 
        room.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.ringkas.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === 'name') {
        return a.nama.localeCompare(b.nama);
      }
      if (sortBy === 'progress') {
        const pctA = a.selesai / Math.max(a.tugas, 1);
        const pctB = b.selesai / Math.max(b.tugas, 1);
        return pctB - pctA;
      }
      if (sortBy === 'tasks') {
        return b.tugas - a.tugas;
      }
      return 0;
    });
  }, [rooms, searchQuery, sortBy]);

  // Statistics
  const totalProjects = rooms.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'selesai').length;

  const activeEditingRoom = rooms.find(r => r.id === editingRoomId);

  return (
    <div className="w-full h-full flex flex-col space-y-4 pb-8">
      {/* Clean Toolbar Container: Title, Search Bar, and Sort Filter */}
      <div className="bg-[#F4F8FA] border border-[#E2EAF3] rounded-2xl p-2.5 sm:p-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left section: Clean title with refined typography */}
          <div className="flex items-center w-full sm:w-auto">
            <h1 className="text-lg sm:text-xl font-medium text-[#243347] tracking-tight whitespace-nowrap">
              Daftar Proyek & Ruang Tim
            </h1>
          </div>

          {/* Right section: Search bar on the far right & sort filter right next to it */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Sort Filter Dropdown */}
            <div className="relative flex items-center shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5B7288] absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan Proyek"
                className="pl-8 pr-7 h-9 rounded-full border border-[#E2EAF3] bg-white text-xs font-medium text-[#33465C] hover:border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1E6FD9]/20 cursor-pointer appearance-none transition-colors"
              >
                <option value="name">Nama (A-Z)</option>
                <option value="progress">Progres</option>
                <option value="tasks">Jumlah Tugas</option>
              </select>
            </div>

            {/* Search Bar on the Right side with increased height */}
            <div className="relative w-full sm:w-64 md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek..."
                className="w-full pl-9 pr-8 h-9 rounded-full border border-[#E2EAF3] bg-white text-xs text-[#243347] placeholder-[#94A3B8] hover:border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1E6FD9]/20 focus:border-[#1E6FD9] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grid of Projects (Responsive, Proportional, Centered/Balanced) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-4.5">
        {filteredRooms.map((room) => {
          const roomCover = covers[room.id] || {
            type: 'gradient',
            value: PRESET_GRADIENTS[0].value,
            name: PRESET_GRADIENTS[0].name
          };

          return (
            <ProjectFolderCard
              key={room.id}
              room={room}
              tasks={tasks}
              cover={roomCover}
              onSelectProject={(id, tab) => onSelectProject(id, tab)}
              onChangeCover={(id) => setEditingRoomId(id)}
            />
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredRooms.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2EAF3] p-12 text-center">
          <FolderKanban className="w-10 h-10 text-[#8CA9C9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1528]">Tidak ada proyek yang sesuai</h3>
          <p className="text-xs text-[#5A6E82] mt-1">
            Coba kata kunci pencarian yang lain untuk menemukan proyek tim.
          </p>
        </div>
      )}

      {/* 4. Cover Picker Modal for Customizing the Photo/Gradient */}
      {editingRoomId && activeEditingRoom && (
        <ProjectCoverModal
          room={activeEditingRoom}
          currentCover={
            covers[editingRoomId] || {
              type: 'gradient',
              value: PRESET_GRADIENTS[0].value,
              name: PRESET_GRADIENTS[0].name
            }
          }
          onSave={(newCover) => handleSaveCover(editingRoomId, newCover)}
          onClose={() => setEditingRoomId(null)}
        />
      )}
    </div>
  );
};
