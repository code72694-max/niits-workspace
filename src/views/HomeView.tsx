import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { Task, RoleKey } from '../types';
import { ROLES_CONFIG, USERS_MAP, ROLE_KEYS, INITIAL_ACTIVITY } from '../data/mockData';

interface HomeViewProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onOpenNewTask: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tasks,
  onOpenTask,
  onNavigate,
  onOpenNewTask
}) => {
  const activeTasks = tasks.filter(t => ['jalan', 'review', 'siap'].includes(t.status));
  const pastDueTasks = tasks.filter(t => t.due < '2026-09-01' && t.status !== 'selesai');

  // Days load data: [hours, pastDueHours]
  const weekLoad = [
    { day: "Sen 31", hours: 6, overdue: 2 },
    { day: "Sel 1", hours: 9, overdue: 3, isToday: true },
    { day: "Rab 2", hours: 11, overdue: 0 },
    { day: "Kam 3", hours: 7, overdue: 0 },
    { day: "Jum 4", hours: 12, overdue: 0 },
    { day: "Sab 5", hours: 2, overdue: 0 },
    { day: "Min 6", hours: 0, overdue: 0 }
  ];

  const maxHours = 14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="space-y-6"
    >
      {/* Top Banner & Workload Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Workload card (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#5B7288]">
                Selasa, 1 September 2026
              </span>
              <h2 className="text-2xl font-bold text-[#0A2540] tracking-tight mt-1">
                Siang, Hary.
              </h2>
              <p className="text-xs text-[#3C5A78] mt-1 max-w-md leading-relaxed">
                <span className="font-semibold text-[#C4562B]">
                  {pastDueTasks.length} tugas lewat tempo
                </span>{' '}
                dan estimasi Rabu kelebihan 3 jam dari kapasitas tim.
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3] text-center">
                <div className="text-lg font-bold text-[#1E6FD9]">12</div>
                <div className="text-[10.5px] text-[#5B7288]">Ditugaskan</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3] text-center">
                <div className="text-lg font-bold text-[#C4562B]">{pastDueTasks.length}</div>
                <div className="text-[10.5px] text-[#5B7288]">Lewat Tempo</div>
              </div>
            </div>
          </div>

          {/* SVG Workload bar chart */}
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-[#0A2540]">
                Beban Jam Kerja Minggu Ini
              </span>
              <span className="text-[#5B7288]">
                Kapasitas normal 8 jam / hari (garis merah)
              </span>
            </div>

            <div className="h-44 w-full relative">
              <svg viewBox="0 0 620 160" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                {[0, 4, 8, 12].map((lvl) => {
                  const y = 135 - (lvl / maxHours) * 120;
                  return (
                    <g key={lvl}>
                      <line x1="28" y1={y} x2="600" y2={y} stroke="#EFF4F9" strokeWidth="1" />
                      <text x="20" y={y + 4} textAnchor="end" fontSize="10" fill="#5B7288" fontFamily="Poppins">
                        {lvl}j
                      </text>
                    </g>
                  );
                })}

                {/* 8-hour threshold line */}
                <line
                  x1="28"
                  y1={135 - (8 / maxHours) * 120}
                  x2="600"
                  y2={135 - (8 / maxHours) * 120}
                  stroke="#C4562B"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* Bars */}
                {weekLoad.map((item, idx) => {
                  const colWidth = 570 / weekLoad.length;
                  const x = 36 + idx * colWidth + colWidth * 0.2;
                  const barWidth = colWidth * 0.6;
                  const h = (item.hours / maxHours) * 120;
                  const y = 135 - h;

                  return (
                    <g key={item.day}>
                      {/* Base Bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={h}
                        rx="4"
                        fill={item.isToday ? "#1E6FD9" : "#B9D8F2"}
                        className="transition-all"
                      />

                      {/* Overdue part */}
                      {item.overdue > 0 && (
                        <rect
                          x={x}
                          y={135 - (item.overdue / maxHours) * 120}
                          width={barWidth}
                          height={(item.overdue / maxHours) * 120}
                          rx="4"
                          fill="#C4562B"
                          opacity="0.9"
                        />
                      )}

                      {/* Day Label */}
                      <text
                        x={x + barWidth / 2}
                        y="152"
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight={item.isToday ? "700" : "500"}
                        fill={item.isToday ? "#0A2540" : "#5B7288"}
                        fontFamily="Poppins"
                      >
                        {item.day}
                      </text>

                      {/* Hours Top Label */}
                      {item.hours > 0 && (
                        <text
                          x={x + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill="#0A2540"
                          fontFamily="Poppins"
                        >
                          {item.hours}j
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right 1 col: Role progress */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0A2540]">
              Kemajuan per Peran
            </h3>
            <button
              onClick={() => onNavigate('roles')}
              className="text-xs font-medium text-[#1E6FD9] hover:underline"
            >
              Semua &rarr;
            </button>
          </div>

          <div className="space-y-3.5">
            {ROLE_KEYS.map((rk) => {
              const role = ROLES_CONFIG[rk];
              const rTasks = tasks.filter(t => t.peran === rk);
              const rDone = rTasks.filter(t => t.status === 'selesai').length;
              const pct = rTasks.length > 0 ? Math.round((rDone / rTasks.length) * 100) : 0;

              return (
                <div
                  key={rk}
                  onClick={() => onNavigate('role', { role: rk })}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#0A2540] group-hover:text-[#1E6FD9] transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                      {role.singkat}
                    </span>
                    <span className="text-[#5B7288] font-mono text-[11px]">
                      {rDone}/{rTasks.length} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EFF4F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: role.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focus Today & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Focus Today (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0A2540]">
                Fokus Hari Ini
              </h3>
              <p className="text-xs text-[#5B7288]">
                Tugas aktif dalam antrean eksekusi dan verifikasi
              </p>
            </div>
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1E6FD9]/10 text-[#1E6FD9] hover:bg-[#1E6FD9]/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tugas Cepat</span>
            </button>
          </div>

          <div className="divide-y divide-[#EFF4F9]">
            {activeTasks.slice(0, 6).map((t) => {
              const role = ROLES_CONFIG[t.peran];
              const isPast = t.due < '2026-09-01';

              return (
                <div
                  key={t.id}
                  onClick={() => onOpenTask(t)}
                  className="py-3 flex items-center gap-3 cursor-pointer hover:bg-[#F4F8FD] px-2 rounded-xl transition-colors group"
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: role.color }}
                  >
                    {role.kode}
                  </span>
                  <span className="text-[11px] font-mono text-[#5B7288] w-12 shrink-0">
                    {t.id}
                  </span>
                  <span className="text-xs font-medium text-[#0A2540] flex-1 truncate group-hover:text-[#1E6FD9] transition-colors">
                    {t.nama}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    t.prioritas === 'urgent' ? 'bg-[#C4562B]/10 text-[#C4562B]' : 'bg-[#1E6FD9]/10 text-[#1E6FD9]'
                  }`}>
                    {t.prioritas}
                  </span>
                  <span className={`text-[11px] font-mono shrink-0 ${isPast ? 'text-[#C4562B] font-bold' : 'text-[#5B7288]'}`}>
                    {isPast ? 'Lewat' : t.due}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log (1 col) */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#0A2540]">
            Aktivitas Tim Terbaru
          </h3>

          <div className="space-y-3.5 text-xs">
            {INITIAL_ACTIVITY.map((act, i) => {
              const user = USERS_MAP[act.user];
              return (
                <div key={i} className="flex gap-2.5 items-start">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: user?.warna || '#12459C' }}
                  >
                    {user?.inisial || 'U'}
                  </span>
                  <div className="flex-1 min-w-0 leading-relaxed text-[#3C5A78]">
                    <strong className="text-[#0A2540]">{user?.nama.split(' ')[0]}</strong>{' '}
                    {act.aksi}{' '}
                    {act.ke && <strong className="text-[#1E6FD9]">{act.ke}</strong>}
                    <div className="text-[10px] text-[#5B7288] mt-0.5">
                      {act.waktu}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-[#F4F8FD] border border-[#EFF4F9] text-xs text-[#5B7288] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E6FD9] shrink-0 mt-0.5" />
            <p className="text-[11.5px] leading-relaxed">
              Semua query tugas terisolasi per <code>workspace_id</code> &bull; Otorisasi otomatis ditegakkan di level database.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
