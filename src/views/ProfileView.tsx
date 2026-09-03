import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FolderGit2, 
  Layers, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  Key, 
  Bell, 
  Lock, 
  Sparkles,
  ExternalLink,
  Code,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { CURRENT_USER, ROLES_CONFIG } from '../data/mockData';
import { TEAM_MEMBERS, TeamMemberProfile } from '../data/membersData';
import { RoleKey } from '../types';

interface ProfileViewProps {
  onNavigate?: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  onShowToast
}) => {
  // Find detailed member profile matching CURRENT_USER or fallback to m-hary
  const baseProfile = TEAM_MEMBERS.find(m => m.id === 'm-hary' || m.name.toLowerCase().includes(CURRENT_USER.nama.toLowerCase())) || TEAM_MEMBERS[0];

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'proyek' | 'keahlian' | 'keamanan'>('ringkasan');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(baseProfile.bio);
  const [phoneText, setPhoneText] = useState(baseProfile.phone || '+62 811-1002-3344');
  const [locationText, setLocationText] = useState(baseProfile.location);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(baseProfile.email);
    setCopiedEmail(true);
    onShowToast?.('Email disalin ke papan klip', 'success');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSaveProfile = () => {
    setIsEditingBio(false);
    onShowToast?.('Perubahan profil berhasil disimpan', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Card with Avatar & Header Info */}
      <div className="bg-white rounded-2xl border border-[#E2EAF3] shadow-xs overflow-hidden">
        {/* Decorative Top Gradient Stripe */}
        <div className="h-28 bg-gradient-to-r from-[#0A2540] via-[#12459C] to-[#1E6FD9] relative px-6 flex items-end">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
              Akun Terverifikasi (Owner)
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12">
          {/* Avatar & Main Identifiers */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
            <div 
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold relative shrink-0"
              style={{ backgroundColor: CURRENT_USER.warna || '#12459C' }}
            >
              {CURRENT_USER.inisial}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#25D366] ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540] tracking-tight">
                  {CURRENT_USER.nama}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF2FD] text-[#1E6FD9] border border-[#1E6FD9]/20">
                  {CURRENT_USER.peran}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F4F8FD] text-[#5B7288] border border-[#E2EAF3]">
                  {baseProfile.departmentName}
                </span>
              </div>
              <p className="text-xs text-[#5B7288] mt-1 flex items-center gap-3 flex-wrap">
                <span>{baseProfile.roleTitle}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3C5A78]" />
                  {locationText}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#3C5A78]" />
                  Bergabung {baseProfile.joinDate}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2EAF3] bg-[#F4F8FD] hover:bg-white text-xs font-semibold text-[#0A2540] transition-colors cursor-pointer"
              title="Salin alamat email"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0F8E82]" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#5B7288]" />
                  <span>{CURRENT_USER.email}</span>
                </>
              )}
            </button>

            {isEditingBio ? (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E6FD9] hover:bg-[#12459C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingBio(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2EAF3] bg-white hover:bg-[#F4F8FD] text-xs font-semibold text-[#0A2540] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#5B7288]" />
                <span>Edit Profil</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="px-6 border-t border-[#E2EAF3] bg-[#F8FAFC] flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'ringkasan', label: 'Ringkasan & Metrik', icon: Layers },
            { id: 'proyek', label: `Proyek (${baseProfile.projects.length})`, icon: FolderGit2 },
            { id: 'keahlian', label: `Keahlian & Kemampuan (${baseProfile.skills.length})`, icon: Award },
            { id: 'keamanan', label: 'Akses & Keamanan', icon: ShieldCheck }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#1E6FD9] text-[#1E6FD9]'
                    : 'border-transparent text-[#5B7288] hover:text-[#0A2540]'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: Ringkasan                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          {/* Top 4 Performance KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[#5B7288]">
                <span className="text-xs font-medium">Ketepatan Waktu (On-Time)</span>
                <Clock className="w-4 h-4 text-[#0F8E82]" />
              </div>
              <div className="text-2xl font-bold text-[#0A2540] font-mono">
                {baseProfile.performance.onTimeRate}%
              </div>
              <div className="text-[11px] text-[#0F8E82] font-semibold flex items-center gap-1">
                <span>🎯 {baseProfile.performance.tasksOnTime} dari {baseProfile.performance.totalTasksCompleted} tugas</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[#5B7288]">
                <span className="text-xs font-medium">Sprint Velocity</span>
                <TrendingUp className="w-4 h-4 text-[#1E6FD9]" />
              </div>
              <div className="text-2xl font-bold text-[#0A2540] font-mono">
                {baseProfile.performance.sprintVelocity}
              </div>
              <div className="text-[11px] text-[#5B7288]">
                Rata-rata siklus: {baseProfile.performance.avgCycleTime}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[#5B7288]">
                <span className="text-xs font-medium">DoD Acceptance Rate</span>
                <CheckCircle2 className="w-4 h-4 text-[#7A5AF8]" />
              </div>
              <div className="text-2xl font-bold text-[#0A2540] font-mono">
                {baseProfile.performance.dodAcceptanceRate}%
              </div>
              <div className="text-[11px] text-[#5B7288]">
                Lolos uji kriteria terima sprint
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAF3] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[#5B7288]">
                <span className="text-xs font-medium">Skor Review Rekan</span>
                <Award className="w-4 h-4 text-[#B7791F]" />
              </div>
              <div className="text-2xl font-bold text-[#0A2540] font-mono flex items-center gap-1.5">
                <span>{baseProfile.performance.reviewScore}</span>
                <span className="text-sm text-[#5B7288] font-normal">/ 5.0</span>
              </div>
              <div className="text-[11px] text-[#5B7288]">
                Berdasarkan {baseProfile.performance.peerFeedbackCount} ulasan peer
              </div>
            </div>
          </div>

          {/* Bio & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Bio & Discipline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Card */}
              <div className="bg-white rounded-2xl border border-[#E2EAF3] p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B7288]">
                    Tentang & Bio Profesional
                  </h3>
                  {isEditingBio ? (
                    <span className="text-[11px] text-[#1E6FD9] font-medium">Sedang diedit</span>
                  ) : null}
                </div>

                {isEditingBio ? (
                  <div className="space-y-3">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-3 rounded-xl border border-[#E2EAF3] focus:outline-none focus:ring-1 focus:ring-[#1E6FD9] text-[#0A2540]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#5B7288] font-medium block mb-1">Nomor Telepon</label>
                        <input
                          type="text"
                          value={phoneText}
                          onChange={(e) => setPhoneText(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2EAF3] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#5B7288] font-medium block mb-1">Lokasi Kerja</label>
                        <input
                          type="text"
                          value={locationText}
                          onChange={(e) => setLocationText(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2EAF3] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#3C5A78] leading-relaxed">
                    {bioText}
                  </p>
                )}

                {/* Tag Pills */}
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  {baseProfile.cardSkillTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F4F8FD] text-[#0A2540] border border-[#E2EAF3]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              {baseProfile.recentAchievements && baseProfile.recentAchievements.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2EAF3] p-5 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B7288] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B7791F]" />
                    Pencapaian & Rekognisi Terbaru
                  </h3>
                  <div className="space-y-2">
                    {baseProfile.recentAchievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF3]/70">
                        <CheckCircle2 className="w-4 h-4 text-[#0F8E82] shrink-0 mt-0.5" />
                        <span className="text-xs text-[#0A2540] font-medium leading-relaxed">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Account Attributes & Disciplines */}
            <div className="space-y-6">
              {/* Disciplines Card */}
              <div className="bg-white rounded-2xl border border-[#E2EAF3] p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B7288]">
                  Ruang Disiplin Terkait
                </h3>
                <div className="space-y-2">
                  {CURRENT_USER.disiplin.map((dk) => {
                    const role = ROLES_CONFIG[dk];
                    if (!role) return null;
                    return (
                      <div
                        key={dk}
                        onClick={() => onNavigate?.('role', { role: dk })}
                        className="p-3 rounded-xl border border-[#E2EAF3] hover:border-[#1E6FD9] hover:bg-[#F4F8FD] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: role.color }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#0A2540] block truncate">
                              {role.label}
                            </span>
                            <span className="text-[10.5px] text-[#5B7288] block truncate">
                              {role.fokus}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#D7E6F5] group-hover:text-[#1E6FD9] transition-colors shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-2xl border border-[#E2EAF3] p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B7288]">
                  Detail Kontak & Jam Kerja
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#5B7288]">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#3C5A78]" />
                      Email
                    </span>
                    <span className="font-mono text-[#0A2540] font-semibold">{CURRENT_USER.email}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#5B7288]">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#3C5A78]" />
                      Telepon
                    </span>
                    <span className="font-mono text-[#0A2540]">{phoneText}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#5B7288]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#3C5A78]" />
                      Zona Waktu
                    </span>
                    <span className="text-[#0A2540]">WIB (UTC+7) 09:00 - 18:00</span>
                  </div>

                  <div className="flex items-center justify-between text-[#5B7288]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3C5A78]" />
                      Hak Akses
                    </span>
                    <span className="text-[#0F8E82] font-semibold">Super Admin & Lead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Proyek                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'proyek' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A2540]">Riwayat Portofolio Proyek</h2>
              <p className="text-xs text-[#5B7288]">Daftar room project yang dipimpin dan dikerjakan</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#EAF2FD] text-[#1E6FD9]">
              {baseProfile.projects.length} Proyek Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baseProfile.projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-[#E2EAF3] p-5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F4F8FD] text-[#1E6FD9] border border-[#E2EAF3]">
                        {proj.code}
                      </span>
                      <h3 className="text-sm font-bold text-[#0A2540] mt-1">{proj.name}</h3>
                      <p className="text-xs text-[#5B7288]">{proj.roleInProject} &bull; {proj.period}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold shrink-0 ${
                      proj.status === 'Selesai' 
                        ? 'bg-[#E6F8F6] text-[#0F8E82]' 
                        : 'bg-[#EAF2FD] text-[#1E6FD9]'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#3C5A78] leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2EAF3]/70 space-y-1">
                    <span className="text-[10.5px] font-bold text-[#5B7288] uppercase tracking-wider block">
                      Serahan Utama:
                    </span>
                    <p className="text-xs font-medium text-[#0A2540]">
                      {proj.deliverables}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2EAF3] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-[#F4F8FD] text-[11px] text-[#3C5A78] border border-[#E2EAF3]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono font-bold text-[#0F8E82] shrink-0">
                    {proj.onTimePercent}% Tepat
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Keahlian                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'keahlian' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A2540]">Matriks Keterampilan Teknis & Arsitektur</h2>
              <p className="text-xs text-[#5B7288]">Tingkat kemahiran terverifikasi dan pengalaman kerja</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baseProfile.skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-white rounded-2xl border border-[#E2EAF3] p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#0A2540] truncate">{skill.name}</h3>
                    <span className="text-[10.5px] text-[#5B7288]">{skill.category} &bull; {skill.experienceYears} tahun pengalaman</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E6FD9] shrink-0">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#E2EAF3] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#0F8E82] transition-all"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Keamanan                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'keamanan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2EAF3] p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1E6FD9]" />
              Pengaturan Keamanan & Kredensial
            </h2>

            <div className="divide-y divide-[#E2EAF3] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0A2540] block">Autentikasi Dua Faktor (2FA)</span>
                  <span className="text-[#5B7288]">Mencegah akses ilegal dengan aplikasi authenticator (TOTP).</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F8F6] text-[#0F8E82]">
                  Aktif
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0A2540] block">Kunci Sesi & Token API</span>
                  <span className="text-[#5B7288]">Kelola token otorisasi Bruno, CLI, dan webhook.</span>
                </div>
                <button 
                  onClick={() => onShowToast?.('Token API diperbarui', 'info')}
                  className="px-3 py-1.5 rounded-lg border border-[#E2EAF3] hover:bg-[#F4F8FD] font-semibold text-[#0A2540]"
                >
                  Kelola Kunci
                </button>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0A2540] block">Sesi Perangkat Masuk</span>
                  <span className="text-[#5B7288]">Sesi browser aktif di Cloud Sandbox Container.</span>
                </div>
                <span className="text-[#0F8E82] font-mono font-semibold">
                  Perangkat Ini (Aktif)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
