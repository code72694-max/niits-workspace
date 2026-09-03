import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Map, 
  Plus, 
  Lock, 
  Globe, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  Calendar,
  Layers,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Room, Task } from '../types';
import { ROOMS_MAP, USERS_MAP, INITIAL_ACTIVITY } from '../data/mockData';
import { SubtractedFolderCard, FolderItem } from '../components/SubtractedFolderCard';

interface RoomPlanViewProps {
  isDetail?: boolean;
  currentRoomId: string;
  rooms: Room[];
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onNavigate: (page: string, params?: { room?: string }) => void;
  onOpenNewTask: () => void;
}

export const RoomPlanView: React.FC<RoomPlanViewProps> = ({
  isDetail = false,
  currentRoomId,
  rooms,
  tasks,
  onOpenTask,
  onNavigate,
  onOpenNewTask
}) => {
  const currentRoom = ROOMS_MAP[currentRoomId] || rooms[0];
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomPrivacy, setNewRoomPrivacy] = useState<'privat' | 'publik'>('privat');

  if (isDetail) {
    // Room Overview View with Burndown Chart
    const roomTasks = tasks.filter(t => t.roomId === currentRoom.id || !t.roomId);
    const completedTasks = roomTasks.filter(t => t.status === 'selesai');
    const urgentTasks = roomTasks.filter(t => t.prioritas === 'urgent' && t.status !== 'selesai');

    // Burndown data: ideal vs actual
    const idealPoints = [48, 43, 38, 33, 28, 24, 19, 14, 10, 5, 0];
    const actualPoints = [48, 45, 42, 40, 34, 31, 29, 26];

    const generatePolyline = (pts: number[]) => {
      return pts.map((val, idx) => {
        const x = 30 + idx * (520 / 10);
        const y = 120 - (val / 48) * 100;
        return `${x},${y}`;
      }).join(' ');
    };

    return (
      <div className="space-y-6">
        {/* Room Header Banner */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl overflow-hidden shadow-sm">
          <div className="h-1.5" style={{ backgroundColor: currentRoom.warna }} />
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white font-mono" style={{ backgroundColor: currentRoom.warna }}>
                  {currentRoom.kode}
                </span>
                <span className="text-xs text-[#5B7288] flex items-center gap-1 font-medium">
                  {currentRoom.akses === 'privat' ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  {currentRoom.akses.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#0A2540]">
                {currentRoom.nama}
              </h2>
              <p className="text-xs text-[#5B7288] mt-1 max-w-xl">
                {currentRoom.ringkas} &bull; Sprint 14 berjalan sampai 12 September, kecepatan tim 6,2 tugas/hari.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('docs', { room: currentRoom.id })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#F4F8FD] text-[#0A2540] border border-[#E2EAF3] hover:bg-[#E7F0FA] hover:text-[#1E6FD9] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#1E6FD9]" />
                <span>Dokumen Project</span>
              </button>
              <button
                onClick={() => onNavigate('list', { room: currentRoom.id })}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F4F8FD] text-[#0A2540] border border-[#E2EAF3] hover:bg-[#E7F0FA]"
              >
                Buka List
              </button>
              <button
                onClick={onOpenNewTask}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tugas Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Burndown Chart & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Burndown Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0A2540]">
                  Sprint Burndown Chart
                </h3>
                <p className="text-xs text-[#5B7288]">
                  Garis putus-putus = target ideal, garis solid = sisa tugas nyata
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#1E6FD9]">
                26 Tugas Tersisa
              </span>
            </div>

            <div className="h-44 w-full relative">
              <svg viewBox="0 0 580 150" className="w-full h-full overflow-visible">
                {/* Horizontal reference lines */}
                {[0, 16, 32, 48].map((lvl) => {
                  const y = 120 - (lvl / 48) * 100;
                  return (
                    <g key={lvl}>
                      <line x1="30" y1={y} x2="550" y2={y} stroke="#EFF4F9" strokeWidth="1" />
                      <text x="22" y={y + 3} textAnchor="end" fontSize="10" fill="#5B7288" fontFamily="Poppins">
                        {lvl}
                      </text>
                    </g>
                  );
                })}

                {/* Ideal Polyline */}
                <polyline
                  points={generatePolyline(idealPoints)}
                  fill="none"
                  stroke="#D7E6F5"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Actual Polyline */}
                <polyline
                  points={generatePolyline(actualPoints)}
                  fill="none"
                  stroke={currentRoom.warna}
                  strokeWidth="2.5"
                />

                {/* Points */}
                {actualPoints.map((val, idx) => {
                  const x = 30 + idx * (520 / 10);
                  const y = 120 - (val / 48) * 100;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#ffffff"
                      stroke={currentRoom.warna}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Summary */}
          <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0A2540]">
              Status Ringkasan Room
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#EFF4F9]">
                <span className="text-[#5B7288]">Total Tugas</span>
                <span className="font-bold text-[#0A2540]">{roomTasks.length}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#EFF4F9]">
                <span className="text-[#5B7288]">Telah Selesai</span>
                <span className="font-bold text-[#0F8E82]">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#EFF4F9]">
                <span className="text-[#5B7288]">Tugas Berisiko (Urgent)</span>
                <span className="font-bold text-[#C4562B]">{urgentTasks.length}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#EFF4F9]">
                <span className="text-[#5B7288]">Anggota Aktif</span>
                <span className="font-bold text-[#0A2540]">{currentRoom.anggota.length} orang</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#5B7288]">Progres Sprint</span>
                <span className="font-bold" style={{ color: currentRoom.warna }}>
                  {Math.round((completedTasks.length / Math.max(roomTasks.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#EFF4F9] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(completedTasks.length / Math.max(roomTasks.length, 1)) * 100}%`,
                    backgroundColor: currentRoom.warna 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dokumen Project - Folders Section with Subtracted Silhouette */}
        <div className="bg-white border border-[#E2EAF3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
                  Dokumen Project ({currentRoom.nama})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                  Folders
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Aset spesifikasi desain token, panduan integrasi, dan berkas proyek dengan bentuk folder subtracted.
              </p>
            </div>

            <button
              onClick={() => onNavigate('docs', { room: currentRoom.id })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#1E6FD9] bg-[#F4F8FD] hover:bg-[#E7F0FA] border border-[#D7E6F5] self-start sm:self-auto transition-colors cursor-pointer"
            >
              <span>Lihat Semua Folder & Berkas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {[
              {
                id: 'f-onboarding',
                name: 'Onboarding',
                fileCount: 15,
                badges: [{ type: 'drive' as const }, { type: 'notion' as const }],
                description: 'Panduan awal kontributor, setup Figma tokens, dan arsitektur Cyan',
                hasDocuments: true,
                sampleTypes: ['pdf', 'doc', 'md']
              },
              {
                id: 'f-integrations',
                name: 'Integrations',
                fileCount: 5,
                badges: [{ type: 'notion' as const }, { type: 'sharepoint' as const }, { type: 'drive' as const }],
                description: 'Sinkronisasi token ke GitHub, Figma Studio, dan SharePoint',
                hasDocuments: false
              },
              {
                id: 'f-empty-draft',
                name: 'Drafts & Proposals',
                fileCount: 0,
                badges: [{ type: 'notion' as const }],
                description: 'Folder kosong tanpa lembaran dokumen di dalamnya',
                hasDocuments: false
              },
              {
                id: 'f-tokens',
                name: 'Design Tokens & Primitives',
                fileCount: 24,
                badges: [{ type: 'figma' as const }, { type: 'github' as const }, { type: 'notion' as const }],
                description: 'Spesifikasi warna cyan, tipografi modular, dan shadow',
                hasDocuments: true,
                sampleTypes: ['json', 'pdf', 'doc']
              }
            ].map((fld) => (
              <SubtractedFolderCard
                key={fld.id}
                folder={fld}
                isSelected={false}
                onClick={() => onNavigate('docs', { room: currentRoom.id })}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // All Rooms (Visual Floor Plan View)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Visual Blueprint Grid (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0A2540]">
                Denah Ruang Kerja NIITS Studio
              </h3>
              <p className="text-xs text-[#5B7288]">
                {rooms.length} room aktif &bull; 145 tugas terdistribusi
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#1E6FD9] font-semibold hover:underline"
            >
              Kembali ke Beranda
            </button>
          </div>

          {/* Blueprint Canvas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F4F8FD]/50 border border-dashed border-[#D7E6F5]">
            {rooms.map((r) => {
              const isCurrent = r.id === currentRoomId;
              const pct = Math.round((r.selesai / r.tugas) * 100);

              return (
                <motion.div
                  key={r.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => onNavigate('room', { room: r.id })}
                  className={`bg-white border rounded-2xl p-4 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] ${
                    isCurrent ? 'border-[#1E6FD9] ring-2 ring-[#1E6FD9]/10' : 'border-[#E2EAF3]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] text-white" style={{ backgroundColor: r.warna }}>
                        {r.kode}
                      </span>
                      <span className="text-[11px] text-[#5B7288] flex items-center gap-1">
                        {r.akses === 'privat' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {r.akses}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0A2540] mt-1">
                      {r.nama}
                    </h4>
                    <p className="text-xs text-[#5B7288] line-clamp-2 mt-0.5">
                      {r.ringkas}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EFF4F9] space-y-1.5">
                    <div className="flex justify-between text-[11px] text-[#5B7288]">
                      <span>{r.selesai}/{r.tugas} selesai</span>
                      <span className="font-bold font-mono" style={{ color: r.warna }}>{pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#EFF4F9] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: r.warna }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty Slot */}
            <div 
              onClick={() => alert("Form buat room baru tersedia di panel sebelah kanan.")}
              className="border-2 border-dashed border-[#D7E6F5] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/60 transition-colors min-h-[160px]"
            >
              <Plus className="w-6 h-6 text-[#1E6FD9] mb-1" />
              <span className="text-xs font-semibold text-[#0A2540]">Ruang Kosong</span>
              <span className="text-[11px] text-[#5B7288]">Klik untuk buat room</span>
            </div>
          </div>
        </div>

        {/* Create Room Form (1 col) */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#0A2540]">
            Buat Room Project Baru
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Nama Room
              </label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="mis: Riset Pasar Q4"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2EAF3] text-xs focus:outline-none focus:border-[#1E6FD9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Kode Room
              </label>
              <input
                type="text"
                value={newRoomCode}
                onChange={(e) => setNewRoomCode(e.target.value)}
                placeholder="mis: C-01"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2EAF3] text-xs font-mono focus:outline-none focus:border-[#1E6FD9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Akses Privasi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewRoomPrivacy('privat')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                    newRoomPrivacy === 'privat' ? 'bg-[#E7F0FA] border-[#1E6FD9] text-[#1E6FD9]' : 'border-[#E2EAF3] text-[#5B7288]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Privat
                </button>
                <button
                  type="button"
                  onClick={() => setNewRoomPrivacy('publik')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                    newRoomPrivacy === 'publik' ? 'bg-[#E7F0FA] border-[#1E6FD9] text-[#1E6FD9]' : 'border-[#E2EAF3] text-[#5B7288]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Publik
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newRoomName.trim()) return;
                alert(`Room baru "${newRoomName}" berhasil dibuat!`);
                setNewRoomName('');
                setNewRoomCode('');
              }}
              className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-colors mt-2"
            >
              Simpan Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
