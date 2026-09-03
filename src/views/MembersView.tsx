import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  FolderGit2, 
  ChevronRight, 
  X, 
  ArrowLeft, 
  Layers, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { SubtractedCard } from '../components/SubtractedCard';
import { TEAM_MEMBERS, TeamMemberProfile, MemberProject, MemberSkill } from '../data/membersData';
import { ROLES_CONFIG, ROLE_KEYS } from '../data/mockData';
import { RoleKey } from '../types';

interface MembersViewProps {
  onNavigate?: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'onTime' | 'tasks' | 'rating' | 'name'>('onTime');
  const [selectedMember, setSelectedMember] = useState<TeamMemberProfile | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string>('all');

  // Filter & sort members
  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter((m) => {
      const matchSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.cardSkillTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDiscipline = selectedDiscipline === 'all' || m.discipline === selectedDiscipline;
      return matchSearch && matchDiscipline;
    }).sort((a, b) => {
      if (sortBy === 'onTime') {
        return b.performance.onTimeRate - a.performance.onTimeRate;
      }
      if (sortBy === 'tasks') {
        return b.performance.totalTasksCompleted - a.performance.totalTasksCompleted;
      }
      if (sortBy === 'rating') {
        return b.performance.reviewScore - a.performance.reviewScore;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedDiscipline, sortBy]);

  // Overall workspace team stats
  const totalTasksSum = useMemo(() => 
    TEAM_MEMBERS.reduce((acc, m) => acc + m.performance.totalTasksCompleted, 0), 
  []);

  const avgOnTime = useMemo(() => {
    const sum = TEAM_MEMBERS.reduce((acc, m) => acc + m.performance.onTimeRate, 0);
    return (sum / TEAM_MEMBERS.length).toFixed(1);
  }, []);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    if (onShowToast) {
      onShowToast(`Email ${email} berhasil disalin ke papan klip.`);
    }
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Clean & Simple Filter Toolbar */}
      <div className="bg-[#F4F8FA] border border-[#E2EAF3] rounded-2xl p-2.5 sm:p-3 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5">
          {/* Search Bar */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari anggota atau peran..."
              className="w-full pl-9 pr-8 py-2 rounded-full border border-[#E2EAF3] bg-white text-xs text-[#0F172A] placeholder-[#94A3B8] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1E6FD9]/20 focus:border-[#1E6FD9]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Discipline Filter Pills */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto py-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setSelectedDiscipline('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
                selectedDiscipline === 'all'
                  ? 'bg-white text-[#0A2540] shadow-xs ring-1 ring-[#CBD5E1]'
                  : 'bg-white/80 text-[#5B7288] hover:text-[#0A2540] hover:bg-white'
              }`}
            >
              All ({TEAM_MEMBERS.length})
            </button>
            {ROLE_KEYS.map((rk) => {
              const conf = ROLES_CONFIG[rk];
              const count = TEAM_MEMBERS.filter(m => m.discipline === rk).length;
              if (count === 0) return null;
              const isSelected = selectedDiscipline === rk;
              return (
                <button
                  key={rk}
                  onClick={() => setSelectedDiscipline(rk)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#0A2540] shadow-xs ring-1 ring-[#CBD5E1]'
                      : 'bg-white/80 text-[#5B7288] hover:text-[#0A2540] hover:bg-white'
                  }`}
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: conf.color }} 
                  />
                  <span>{conf.singkat}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center pl-2 lg:border-l lg:border-[#E2EAF3]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#E2EAF3] bg-white text-[#0F172A] shadow-xs focus:outline-none focus:border-[#1E6FD9] cursor-pointer"
            >
              <option value="name">Nama (A - Z)</option>
              <option value="onTime">Ketepatan Waktu Tertinggi</option>
              <option value="tasks">Tugas Terbanyak</option>
              <option value="rating">Skor Ulasan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div>

        {filteredMembers.length === 0 ? (
          <div className="bg-white border border-[#E2EAF3] rounded-3xl p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h4 className="text-sm font-bold text-[#0F172A]">
              Tidak Ada Anggota yang Sesuai
            </h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Tidak ditemukan profil anggota dengan kriteria pencarian "{searchQuery}". Silakan coba kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#1E6FD9] text-white text-xs font-semibold hover:bg-[#1557B0] transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const roleConfig = ROLES_CONFIG[member.discipline];
              return (
                <div key={member.id} className="relative group">
                  <SubtractedCard
                    id={member.id}
                    title={member.name}
                    subtitle={`${member.roleTitle} · ${roleConfig?.singkat || ''}`}
                    avatarUrl={member.avatarUrl}
                    avatarFallback={member.avatarFallback}
                    avatarBg={member.avatarBg}
                    sourceLabel="Role"
                    tags={member.cardRoleTags || member.cardSkillTags}
                    showRatingDots={false}
                    ratingLevel={0}
                    onClick={() => setSelectedMember(member)}
                    onActionClick={() => setSelectedMember(member)}
                    actionTitle={`Buka Profil ${member.name}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Member Profile Modal / Flyout */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs"
            />

            {/* Profile Detail Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white border border-[#E2EAF3] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 space-y-6 p-6 sm:p-8 text-[#0F172A]"
            >
              {/* Top Bar: Close & Header */}
              <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-5">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={selectedMember.avatarUrl}
                      alt={selectedMember.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: selectedMember.avatarBg }}
                    >
                      {ROLES_CONFIG[selectedMember.discipline]?.singkat}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                        {selectedMember.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                        {selectedMember.statusAvailability}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#1E6FD9]">
                      {selectedMember.roleTitle}
                    </p>

                    <p className="text-xs text-[#64748B] flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {selectedMember.departmentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {selectedMember.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                        Bergabung {selectedMember.joinDate}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                  aria-label="Tutup detail"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bio & Contact Strip */}
              <div className="bg-[#F8FAFC] border border-[#E2EAF3] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[#475569] leading-relaxed max-w-xl">
                  {selectedMember.bio}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyEmail(selectedMember.email)}
                    className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] flex items-center gap-1.5 transition-colors"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                    <span>{copiedEmail ? 'Disalin' : 'Salin Email'}</span>
                  </button>

                  {onNavigate && (
                    <button
                      onClick={() => {
                        setSelectedMember(null);
                        onNavigate('chat');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1E6FD9] text-white text-xs font-semibold hover:bg-[#1557B0] flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kirim Pesan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. SECTION: On-Time Performance & Metrics (Performa Tepat Waktu) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#16A34A]" />
                    <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
                      Performa Ketepatan Waktu & Statistik Kinerja
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-0.5 rounded-full">
                    Tingkat Sukses: Sangat Tinggi
                  </span>
                </div>

                {/* Performance Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* On-Time Rate Gauge */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] space-y-1">
                    <span className="text-[11px] font-semibold text-[#166534] block">
                      Ketepatan Waktu Serahan
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#15803D]">
                        {selectedMember.performance.onTimeRate}%
                      </span>
                    </div>
                    <div className="w-full bg-white/80 rounded-full h-1.5 overflow-hidden mt-1">
                      <div 
                        className="bg-[#16A34A] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${selectedMember.performance.onTimeRate}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#166534] font-medium block pt-0.5">
                      {selectedMember.performance.tasksOnTime} dari {selectedMember.performance.totalTasksCompleted} tugas tepat waktu
                    </span>
                  </div>

                  {/* Avg Cycle Time */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] space-y-1">
                    <span className="text-[11px] font-semibold text-[#64748B] block">
                      Rata-rata Waktu Siklus
                    </span>
                    <span className="text-2xl font-black text-[#0F172A]">
                      {selectedMember.performance.avgCycleTime}
                    </span>
                    <p className="text-[10px] text-[#64748B]">
                      Waktu penyelesaian tugas per serahan
                    </p>
                  </div>

                  {/* DoD Acceptance Rate */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] space-y-1">
                    <span className="text-[11px] font-semibold text-[#64748B] block">
                      Kelulusan DoD (Review)
                    </span>
                    <span className="text-2xl font-black text-[#1E6FD9]">
                      {selectedMember.performance.dodAcceptanceRate}%
                    </span>
                    <p className="text-[10px] text-[#64748B]">
                      Lolos review pertama kali tanpa cacat
                    </p>
                  </div>

                  {/* Review Score & Velocity */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] space-y-1">
                    <span className="text-[11px] font-semibold text-[#64748B] block">
                      Skor Rekan & Kecepatan
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black text-[#0F172A]">
                        {selectedMember.performance.reviewScore}
                      </span>
                      <div className="flex text-[#EAB308]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-[#64748B]">
                      {selectedMember.performance.sprintVelocity}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. SECTION: Skills & Keahlian Teknis (Daftar Skill dll) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1E6FD9]" />
                    <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
                      Daftar Skill & Tingkat Kemahiran
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#64748B]">
                    {selectedMember.skills.length} Keahlian Terverifikasi
                  </span>
                </div>

                {/* Skill Bars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMember.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2EAF3] space-y-2 hover:border-[#1E6FD9]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#0F172A] block">
                            {skill.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] font-medium">
                            Kategori: {skill.category} &bull; {skill.experienceYears} tahun pengalaman
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#1E6FD9] bg-white px-2 py-0.5 rounded-lg border border-[#E2EAF3]">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#1E6FD9] to-[#0F8E82] h-full rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. SECTION: Projects Worked On (Project yang Sudah Dikerjakan) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#D9488B]" />
                    <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
                      Proyek yang Sudah & Sedang Dikerjakan
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#64748B]">
                    {selectedMember.projects.length} Proyek Tercatat
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedMember.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 sm:p-5 rounded-2xl border border-[#E2EAF3] bg-white hover:shadow-sm transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-white text-[10px] font-mono font-bold">
                              {proj.code}
                            </span>
                            <h5 className="text-sm font-bold text-[#0F172A]">
                              {proj.name}
                            </h5>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            Peran: <span className="font-semibold text-[#0F172A]">{proj.roleInProject}</span> &bull; {proj.period}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            proj.status === 'Selesai'
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : 'bg-[#DBEAFE] text-[#1D4ED8]'
                          }`}>
                            {proj.status}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-bold">
                            {proj.completedTasks} Tugas
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#475569] leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Deliverables */}
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#EFF4F9] text-xs space-y-1">
                        <span className="text-[11px] font-bold text-[#0F172A] block">
                          Hasil Serahan Kunci (Deliverables):
                        </span>
                        <p className="text-[#64748B] text-xs">
                          {proj.deliverables}
                        </p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[11px] text-[#94A3B8] font-medium mr-1">
                          Teknologi:
                        </span>
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E6FD9] border border-[#BFDBFE] text-[10.5px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. SECTION: Recent Highlights & Recognition */}
              {selectedMember.recentAchievements && selectedMember.recentAchievements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#EAB308]" />
                    <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
                      Pencapaian & Sorotan Sprint Terkini
                    </h4>
                  </div>
                  <ul className="grid grid-cols-1 gap-2">
                    {selectedMember.recentAchievements.map((item, aIdx) => (
                      <li
                        key={aIdx}
                        className="flex items-start gap-2.5 text-xs text-[#334155] p-3 rounded-xl bg-[#FEFCE8] border border-[#FEF08A]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  ID Anggota: <code className="font-mono text-[#0F172A]">{selectedMember.id}</code> &bull; Terverifikasi NIITS
                </span>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors"
                >
                  Tutup Tinjauan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
