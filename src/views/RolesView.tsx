import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Check, 
  AlertCircle, 
  MessageSquare, 
  SlidersHorizontal,
  Sparkles,
  Layers
} from 'lucide-react';
import { Task, RoleKey, TaskStatus } from '../types';
import { 
  ROLES_CONFIG, 
  USERS_MAP, 
  ROLE_KEYS, 
  ROLE_UPDATES, 
  DEFINITION_OF_DONE,
  CURRENT_USER 
} from '../data/mockData';
import { SubtractedCard } from '../components/SubtractedCard';

// Real Role Lead Profiles with high quality portrait photos
const ROLE_LEADS_DATA: Record<RoleKey, {
  name: string;
  roleTitle: string;
  avatarUrl: string;
  avatarFallback: string;
  sourceLabel: string;
  tags: string[];
  statusLabel: string;
  ratingLevel: number;
}> = {
  ux: {
    name: 'Dina Ayu',
    roleTitle: 'Lead UI/UX Designer & System Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'DA',
    sourceLabel: 'Source',
    tags: ['Figma', 'Design System'],
    statusLabel: '🔥 Sprint Lead',
    ratingLevel: 5
  },
  be: {
    name: 'Reza Fadhil',
    roleTitle: 'Senior Backend Engineer at Core',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'RF',
    sourceLabel: 'Source',
    tags: ['NestJS', 'PostgreSQL'],
    statusLabel: 'High Velocity',
    ratingLevel: 4
  },
  fe: {
    name: 'Bagas Pratama',
    roleTitle: 'Frontend Architect & Web App Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'BP',
    sourceLabel: 'Source',
    tags: ['React', 'Tailwind CSS'],
    statusLabel: 'High Velocity',
    ratingLevel: 4
  },
  qa: {
    name: 'Sinta Larasati',
    roleTitle: 'QA Lead & Security Gatekeeper',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'SL',
    sourceLabel: 'Source',
    tags: ['Cypress', 'DoD Guard'],
    statusLabel: '🔥 DoD Guard',
    ratingLevel: 5
  },
  devops: {
    name: 'Fajar Nugraha',
    roleTitle: 'DevOps & Cloud Infrastructure Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'FN',
    sourceLabel: 'Source',
    tags: ['Docker', 'Kubernetes'],
    statusLabel: 'Medium Load',
    ratingLevel: 3
  },
  ba: {
    name: 'Nadia Putri',
    roleTitle: 'Business Analyst & Product Strategist',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'NP',
    sourceLabel: 'Source',
    tags: ['BRD', 'User Stories'],
    statusLabel: 'High Interest',
    ratingLevel: 4
  },
  sec: {
    name: 'Hary Kurniawan',
    roleTitle: 'Lead Architect & Security Auditor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'HK',
    sourceLabel: 'Source',
    tags: ['OWASP', 'RBAC Audit'],
    statusLabel: '🔥 Core Guard',
    ratingLevel: 5
  }
};

// Exact cards from user's reference image for direct visual verification
const DEMO_REFERENCE_CARDS = [
  {
    id: 'demo-1',
    title: 'Jane Doe',
    subtitle: 'Marketing Director at Microsoft',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'JD',
    sourceLabel: 'Source',
    tags: ['Linkedin', 'Email'],
    statusLabel: '🔥 Hot Client',
    ratingLevel: 5,
    roleKey: 'ux' as RoleKey
  },
  {
    id: 'demo-2',
    title: 'Darlene Robertson',
    subtitle: 'Financial Manager at Ford',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'DR',
    sourceLabel: 'Source',
    tags: ['Linkedin', 'Facebook'],
    statusLabel: 'High Interest',
    ratingLevel: 4,
    roleKey: 'be' as RoleKey
  },
  {
    id: 'demo-3',
    title: 'Wade Warren',
    subtitle: 'Operations Manager at Zenith',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'WW',
    sourceLabel: 'Source',
    tags: ['Typeform'],
    statusLabel: 'Medium Interest',
    ratingLevel: 3,
    roleKey: 'fe' as RoleKey
  }
];

interface RolesViewProps {
  currentRoleKey: RoleKey | null;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onOpenNewTask: () => void;
}

export const RolesView: React.FC<RolesViewProps> = ({
  currentRoleKey,
  tasks,
  onOpenTask,
  onNavigate,
  onOpenNewTask
}) => {
  // If no specific role selected, show Roles Overview (7 roles + pipeline)
  const isOverview = !currentRoleKey;

  // State for single role view
  const roleKey = currentRoleKey || 'be';
  const role = ROLES_CONFIG[roleKey];
  const [roleTab, setRoleTab] = useState<'papan' | 'antrean' | 'update'>('papan');
  const [cardViewMode, setCardViewMode] = useState<'personel' | 'disiplin' | 'contoh'>('personel');
  const [dodList, setDodList] = useState(DEFINITION_OF_DONE[roleKey] || []);
  const [updateText, setUpdateText] = useState('');
  const [roleUpdates, setRoleUpdates] = useState(ROLE_UPDATES[roleKey] || []);

  const roleTasks = tasks.filter(t => t.peran === roleKey);
  const incomingHandoff = tasks.filter(t => t.next === roleKey && t.peran !== roleKey && t.status !== 'selesai');

  const handleToggleDod = (index: number) => {
    setDodList(dodList.map((item, idx) => 
      idx === index ? { ...item, done: !item.done } : item
    ));
  };

  const handleAddRoleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim()) return;

    setRoleUpdates([
      {
        u: CURRENT_USER.id,
        waktu: 'Baru saja',
        isi: updateText.trim()
      },
      ...roleUpdates
    ]);
    setUpdateText('');
  };

  if (isOverview) {
    return (
      <div className="space-y-6">
        {/* Pipeline Handoff Flow */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0A2540]">
                Alur Serahan Kerja Antar Peran (Handoff Pipeline)
              </h3>
              <p className="text-xs text-[#5B7288]">
                Tugas mengalir secara disiplin dari kiri ke kanan melewati kriteria Definition of Done
              </p>
            </div>
            <span className="text-xs text-[#1E6FD9] font-medium">7 Ruang Peran</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {(['ba', 'ux', 'fe', 'be', 'qa', 'devops'] as RoleKey[]).map((rk, idx, arr) => {
              const r = ROLES_CONFIG[rk];
              const rTasks = tasks.filter(t => t.peran === rk);
              const activeCount = rTasks.filter(t => t.status === 'jalan').length;
              const waitingIn = tasks.filter(t => t.next === rk && t.status !== 'selesai').length;

              return (
                <React.Fragment key={rk}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={() => onNavigate('role', { role: rk })}
                    className="p-3.5 rounded-xl border border-[#E2EAF3] bg-[#F4F8FD]/60 hover:bg-[#F4F8FD] hover:border-[#1E6FD9] cursor-pointer min-w-[145px] shrink-0 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-xs font-bold text-[#0A2540]">{r.singkat}</span>
                    </div>
                    <div className="text-xs text-[#5B7288]">{activeCount} dikerjakan</div>
                    {waitingIn > 0 && (
                      <div className="text-[11px] font-semibold text-[#B7791F] mt-0.5">
                        +{waitingIn} antrean masuk
                      </div>
                    )}
                  </motion.div>

                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[#D7E6F5] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Subtracted Corner Cards Grid (Identical to User Design Reference) */}
        <div className="bg-[#EBECEF] border border-[#D8DCE3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                  Kartu Ruang Peran & Tim
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-white text-[#1E6FD9] border border-[#CBD5E1] shadow-2xs">
                  SVG Subtracted Corner
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Bentuk kurva inverted radius presisi dengan tombol aksi floating di sudut kanan atas
              </p>
            </div>

            {/* View Mode Segmented Switch */}
            <div className="flex items-center gap-1 p-1 bg-white/80 rounded-xl border border-[#CBD5E1] shadow-2xs self-start sm:self-auto">
              <button
                onClick={() => setCardViewMode('personel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  cardViewMode === 'personel'
                    ? 'bg-[#1E6FD9] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Lead & Personel
              </button>
              <button
                onClick={() => setCardViewMode('disiplin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  cardViewMode === 'disiplin'
                    ? 'bg-[#1E6FD9] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                7 Disiplin
              </button>
              <button
                onClick={() => setCardViewMode('contoh')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  cardViewMode === 'contoh'
                    ? 'bg-[#1E6FD9] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Foto Referensi</span>
              </button>
            </div>
          </div>

          {/* Cards Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Mode 1: Real Team Leads */}
            {cardViewMode === 'personel' && (
              ROLE_KEYS.map((rk) => {
                const profile = ROLE_LEADS_DATA[rk];
                const r = ROLES_CONFIG[rk];
                const rTasks = tasks.filter(t => t.peran === rk);
                const rDone = rTasks.filter(t => t.status === 'selesai').length;

                return (
                  <SubtractedCard
                    key={rk}
                    id={rk}
                    title={profile.name}
                    subtitle={`${profile.roleTitle} · ${r.singkat}`}
                    avatarUrl={profile.avatarUrl}
                    avatarFallback={profile.avatarFallback}
                    avatarBg={r.color}
                    sourceLabel={profile.sourceLabel}
                    tags={profile.tags}
                    statusLabel={profile.statusLabel}
                    ratingLevel={profile.ratingLevel}
                    onClick={() => onNavigate('role', { role: rk })}
                    onActionClick={() => onNavigate('role', { role: rk })}
                    actionTitle={`Buka Ruang ${r.label}`}
                  />
                );
              })
            )}

            {/* Mode 2: 7 Disciplines Overview */}
            {cardViewMode === 'disiplin' && (
              ROLE_KEYS.map((rk) => {
                const r = ROLES_CONFIG[rk];
                const rTasks = tasks.filter(t => t.peran === rk);
                const rDone = rTasks.filter(t => t.status === 'selesai').length;
                const progressLevel = rTasks.length > 0 
                  ? Math.min(5, Math.max(1, Math.ceil((rDone / rTasks.length) * 5))) 
                  : 3;

                return (
                  <SubtractedCard
                    key={rk}
                    id={rk}
                    title={r.label}
                    subtitle={r.fokus}
                    avatarFallback={r.kode}
                    avatarBg={r.color}
                    sourceLabel="Disiplin"
                    tags={[r.singkat, `${rTasks.length} Tugas`]}
                    statusLabel={`${rDone}/${rTasks.length} Selesai`}
                    ratingLevel={progressLevel}
                    onClick={() => onNavigate('role', { role: rk })}
                    onActionClick={() => onNavigate('role', { role: rk })}
                    actionTitle={`Buka Ruang ${r.label}`}
                  />
                );
              })
            )}

            {/* Mode 3: Exact 3 Demo Cards from User's Reference Image */}
            {cardViewMode === 'contoh' && (
              DEMO_REFERENCE_CARDS.map((card) => (
                <SubtractedCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  subtitle={card.subtitle}
                  avatarUrl={card.avatarUrl}
                  avatarFallback={card.avatarFallback}
                  sourceLabel={card.sourceLabel}
                  tags={card.tags}
                  statusLabel={card.statusLabel}
                  ratingLevel={card.ratingLevel}
                  onClick={() => onNavigate('role', { role: card.roleKey })}
                  onActionClick={() => onNavigate('role', { role: card.roleKey })}
                  actionTitle={`Buka Ruang ${ROLES_CONFIG[card.roleKey].label}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Single Role Detail View
  return (
    <div className="space-y-6">
      {/* Role Header Banner */}
      <div className="bg-white border border-[#E2EAF3] rounded-2xl overflow-hidden shadow-sm">
        <div className="h-1.5" style={{ backgroundColor: role.color }} />
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-bold shadow-md shrink-0"
              style={{ backgroundColor: role.color }}
            >
              {role.kode}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0A2540]">
                  Ruang Peran: {role.label}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: role.color }}>
                  {role.singkat}
                </span>
              </div>
              <p className="text-xs text-[#5B7288] mt-0.5">
                {role.fokus}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('roles')}
              className="px-3.5 py-2 text-xs font-medium text-[#5B7288] hover:text-[#0A2540]"
            >
              &larr; Semua Peran
            </button>
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tugas {role.singkat}</span>
            </button>
          </div>
        </div>

        {/* Subtabs for Role */}
        <div className="flex items-center gap-4 px-6 border-t border-[#EFF4F9] bg-[#F4F8FD]/50 text-xs font-medium">
          <button
            onClick={() => setRoleTab('papan')}
            className={`py-3 border-b-2 font-semibold transition-colors ${
              roleTab === 'papan' ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
            }`}
          >
            Papan Disiplin ({roleTasks.length})
          </button>
          <button
            onClick={() => setRoleTab('antrean')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              roleTab === 'antrean' ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
            }`}
          >
            <span>Antrean Handoff</span>
            {incomingHandoff.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#B7791F] text-white font-bold">
                {incomingHandoff.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setRoleTab('update')}
            className={`py-3 border-b-2 font-semibold transition-colors ${
              roleTab === 'update' ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
            }`}
          >
            Update Harian
          </button>
        </div>
      </div>

      {/* Role Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab 1: Papan Disiplin Tasks */}
          {roleTab === 'papan' && (
            <div className="space-y-3">
              <div className="divide-y divide-[#EFF4F9] bg-white border border-[#E2EAF3] rounded-2xl p-4 shadow-sm">
                {roleTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTask(t)}
                    className="py-3 flex items-center gap-3 cursor-pointer hover:bg-[#F4F8FD] px-2 rounded-xl transition-colors group"
                  >
                    <span className="font-mono text-xs text-[#5B7288] w-14 shrink-0">
                      {t.id}
                    </span>
                    <span className="text-xs font-semibold text-[#0A2540] flex-1 truncate group-hover:text-[#1E6FD9]">
                      {t.nama}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full capitalize font-semibold bg-[#F4F8FD] text-[#1E6FD9] border border-[#D7E6F5]">
                      {t.status}
                    </span>
                    <span className="text-[11px] font-mono text-[#5B7288]">
                      {t.due}
                    </span>
                  </div>
                ))}

                {roleTasks.length === 0 && (
                  <div className="py-12 text-center text-xs text-[#5B7288]">
                    Belum ada tugas untuk ruang peran {role.label}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Antrean Handoff Masuk */}
          {roleTab === 'antrean' && (
            <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#0A2540]">
                Tugas yang Diserahkan ke {role.label}
              </h3>
              <p className="text-xs text-[#5B7288]">
                Diserahkan dari peran hulu setelah memenuhi DoD awal mereka
              </p>

              <div className="divide-y divide-[#EFF4F9] pt-2">
                {incomingHandoff.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTask(t)}
                    className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F4F8FD] px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: ROLES_CONFIG[t.peran].color }}>
                        Dari {ROLES_CONFIG[t.peran].singkat}
                      </span>
                      <span className="text-xs font-semibold text-[#0A2540] truncate">
                        {t.nama}
                      </span>
                    </div>
                    <span className="text-xs text-[#1E6FD9] font-medium hover:underline">
                      Periksa & Terima &rarr;
                    </span>
                  </div>
                ))}

                {incomingHandoff.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#5B7288]">
                    Tidak ada antrean serahan masuk untuk saat ini.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Update Harian */}
          {roleTab === 'update' && (
            <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#0A2540]">
                Update Harian {role.label}
              </h3>

              <form onSubmit={handleAddRoleUpdate} className="space-y-2">
                <textarea
                  rows={2}
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  placeholder={`Apa yang sedang bergerak di ruang ${role.singkat} hari ini?`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs focus:outline-none focus:border-[#1E6FD9] resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C]"
                >
                  Kirim Update
                </button>
              </form>

              <div className="divide-y divide-[#EFF4F9] pt-2">
                {roleUpdates.map((u, i) => {
                  const user = USERS_MAP[u.u];
                  return (
                    <div key={i} className="py-3 flex gap-3 text-xs">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: user?.warna || '#1E6FD9' }}
                      >
                        {user?.inisial}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <strong className="text-[#0A2540]">{user?.nama}</strong>
                          <span className="text-[10.5px] text-[#5B7288] font-mono">{u.waktu}</span>
                        </div>
                        <p className="text-[#3C5A78] leading-relaxed">
                          {u.isi}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 col: Lead Specialist Card + Definition of Done */}
        <div className="space-y-4">
          {/* Subtracted Corner Card of this Role's Lead */}
          {ROLE_LEADS_DATA[roleKey] && (
            <div className="p-3 rounded-3xl bg-[#EBECEF] border border-[#D8DCE3] shadow-xs">
              <SubtractedCard
                id={`lead-${roleKey}`}
                title={ROLE_LEADS_DATA[roleKey].name}
                subtitle={`${ROLE_LEADS_DATA[roleKey].roleTitle} · Lead ${role.singkat}`}
                avatarUrl={ROLE_LEADS_DATA[roleKey].avatarUrl}
                avatarFallback={ROLE_LEADS_DATA[roleKey].avatarFallback}
                avatarBg={role.color}
                sourceLabel={ROLE_LEADS_DATA[roleKey].sourceLabel}
                tags={ROLE_LEADS_DATA[roleKey].tags}
                statusLabel={ROLE_LEADS_DATA[roleKey].statusLabel}
                ratingLevel={ROLE_LEADS_DATA[roleKey].ratingLevel}
                actionTitle={`Kirim Pesan ke ${ROLE_LEADS_DATA[roleKey].name}`}
                onClick={() => onNavigate('chat')}
                onActionClick={() => onNavigate('chat')}
              />
            </div>
          )}

          <div className="bg-white border border-[#E2EAF3] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0A2540]">
              Definition of Done (DoD)
            </h3>
            <p className="text-xs text-[#5B7288] leading-relaxed">
              Tugas tidak boleh diserahkan ke peran berikutnya sebelum semua checklist ini terpenuhi.
            </p>

            <div className="space-y-2 pt-2">
              {dodList.map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    item.done ? 'bg-[#F4F8FD] border-[#D7E6F5]' : 'bg-white border-[#E2EAF3] hover:border-[#1E6FD9]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggleDod(idx)}
                    className="w-4 h-4 mt-0.5 rounded text-[#1E6FD9]"
                  />
                  <span className={`leading-relaxed ${item.done ? 'line-through text-[#5B7288]' : 'text-[#0A2540] font-medium'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
