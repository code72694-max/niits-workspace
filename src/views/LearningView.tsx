import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  ArrowLeft, 
  Plus, 
  Search, 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Code2, 
  Users, 
  TrendingUp, 
  Star, 
  Filter, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Sparkles, 
  Check, 
  X, 
  Layers, 
  Target, 
  BarChart3, 
  Video,
  ExternalLink,
  Flame,
  Bookmark,
  Share2
} from 'lucide-react';
import { RoleKey } from '../types';
import { CourseTrack, CourseModule, TeamSkillMatrix, INITIAL_COURSES, INITIAL_SKILL_MATRIX, CourseLevel } from '../types/learning';
import { ModuleReaderView } from '../components/ModuleReaderView';

interface LearningViewProps {
  onBackToWorkspace: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  onBackToWorkspace,
  onShowToast
}) => {
  // Navigation Tabs: Katalog Kursus | Matriks Skill Tim | Progres Saya
  const [activeTab, setActiveTab] = useState<'katalog' | 'matriks' | 'progres'>('katalog');
  
  // Courses Data & CRUD State
  const [courses, setCourses] = useState<CourseTrack[]>(INITIAL_COURSES);
  const [skillMatrix, setSkillMatrix] = useState<TeamSkillMatrix[]>(INITIAL_SKILL_MATRIX);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<RoleKey | 'semua'>('semua');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'semua'>('semua');
  
  // Detail & Course Player View
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  // Modal State for Course CRUD
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseTrack | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    judul: '',
    kode: '',
    deskripsi: '',
    kategori: 'Frontend Engineering',
    disiplin: 'fe' as RoleKey,
    level: 'menengah' as CourseLevel,
    durasiTotalJam: 10,
    targetSkillInput: '',
    instrukturNama: 'Tech Lead Team',
    instrukturJabatan: 'Senior Staff Specialist'
  });

  // Modal State for New Module CRUD inside Course
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleFormData, setModuleFormData] = useState({
    judul: '',
    durasiMenit: 45,
    poin: 50,
    tipe: 'video' as 'video' | 'lab' | 'kuis' | 'bacaan',
    ringkasan: ''
  });

  // Derived Active Course & Active Module (Book Chapter)
  const activeCourse = courses.find(c => c.id === activeCourseId) || null;
  const activeModule = activeCourse?.modulList.find(m => m.id === activeModuleId) || null;
  const activeModuleIndex = activeCourse && activeModule 
    ? activeCourse.modulList.findIndex(m => m.id === activeModuleId) 
    : -1;

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetSkill.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDiscipline = selectedDiscipline === 'semua' || c.disiplin === selectedDiscipline;
    const matchesLevel = selectedLevel === 'semua' || c.level === selectedLevel;

    return matchesSearch && matchesDiscipline && matchesLevel;
  });

  // Overall statistics
  const totalCoursesCount = courses.length;
  const completedCoursesCount = courses.filter(c => c.status === 'selesai').length;
  const inProgressCoursesCount = courses.filter(c => c.status === 'sedang_belajar').length;
  const totalModulesCount = courses.reduce((acc, c) => acc + c.totalModul, 0);
  const totalCompletedModules = courses.reduce((acc, c) => acc + c.modulSelesai, 0);
  const overallProgressPercent = totalModulesCount > 0 
    ? Math.round((totalCompletedModules / totalModulesCount) * 100) 
    : 0;

  // Handler: Open Add/Edit Course Modal
  const handleOpenCourseModal = (course?: CourseTrack) => {
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        judul: course.judul,
        kode: course.kode,
        deskripsi: course.deskripsi,
        kategori: course.kategori,
        disiplin: course.disiplin,
        level: course.level,
        durasiTotalJam: course.durasiTotalJam,
        targetSkillInput: course.targetSkill.join(', '),
        instrukturNama: course.instruktur.nama,
        instrukturJabatan: course.instruktur.jabatan
      });
    } else {
      setEditingCourse(null);
      setCourseFormData({
        judul: '',
        kode: `TR-${Math.floor(100 + Math.random() * 900)}`,
        deskripsi: '',
        kategori: 'Frontend Engineering',
        disiplin: 'fe',
        level: 'menengah',
        durasiTotalJam: 8,
        targetSkillInput: 'TypeScript, Clean Architecture',
        instrukturNama: 'Lead Architect',
        instrukturJabatan: 'Principal Engineering'
      });
    }
    setIsCourseModalOpen(true);
  };

  // Handler: Save Course (Create / Update)
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.judul.trim()) return;

    const skillsArray = courseFormData.targetSkillInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingCourse) {
      // Update
      setCourses(prev => prev.map(c => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            judul: courseFormData.judul,
            kode: courseFormData.kode,
            deskripsi: courseFormData.deskripsi,
            kategori: courseFormData.kategori,
            disiplin: courseFormData.disiplin,
            level: courseFormData.level,
            durasiTotalJam: Number(courseFormData.durasiTotalJam) || 8,
            targetSkill: skillsArray.length > 0 ? skillsArray : c.targetSkill,
            instruktur: {
              ...c.instruktur,
              nama: courseFormData.instrukturNama,
              jabatan: courseFormData.instrukturJabatan
            }
          };
        }
        return c;
      }));
      onShowToast?.('Kursus berhasil diperbarui!', 'success');
    } else {
      // Create
      const newCourse: CourseTrack = {
        id: `course-${Date.now()}`,
        kode: courseFormData.kode || `CR-${Date.now().toString().slice(-3)}`,
        judul: courseFormData.judul,
        deskripsi: courseFormData.deskripsi || 'Silabus pelatihan keterampilan tim untuk meningkatkan efisiensi engineering.',
        kategori: courseFormData.kategori,
        disiplin: courseFormData.disiplin,
        level: courseFormData.level,
        instruktur: {
          nama: courseFormData.instrukturNama || 'Tim Lead',
          jabatan: courseFormData.instrukturJabatan || 'Staff Engineer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        },
        ikon: 'BookOpen',
        warna: courseFormData.disiplin === 'fe' ? '#1E6FD9' : courseFormData.disiplin === 'be' ? '#0F8E82' : '#7A5AF8',
        bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
        totalModul: 3,
        modulSelesai: 0,
        durasiTotalJam: Number(courseFormData.durasiTotalJam) || 6,
        targetSkill: skillsArray.length > 0 ? skillsArray : ['Core Competency', 'Production Best Practice'],
        sertifikatTersedia: true,
        status: 'belum_mulai',
        rating: 5.0,
        pesertaCount: 1,
        modulList: [
          { id: `m-${Date.now()}-1`, judul: 'Pengenalan & Setup Konsep Dasar', durasiMenit: 45, selesai: false, poin: 50, tipe: 'video' },
          { id: `m-${Date.now()}-2`, judul: 'Praktik Lapangan & Hands-on Implementation', durasiMenit: 60, selesai: false, poin: 80, tipe: 'lab' },
          { id: `m-${Date.now()}-3`, judul: 'Kuis Evaluasi & Checklist Produksi', durasiMenit: 30, selesai: false, poin: 70, tipe: 'kuis' }
        ]
      };
      setCourses(prev => [newCourse, ...prev]);
      onShowToast?.('Kursus baru berhasil ditambahkan ke katalog!', 'success');
    }

    setIsCourseModalOpen(false);
  };

  // Handler: Delete Course
  const handleDeleteCourse = (courseId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus kursus ini dari silabus tim?')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      if (activeCourseId === courseId) {
        setActiveCourseId(null);
      }
      onShowToast?.('Kursus berhasil dihapus.', 'info');
    }
  };

  // Handler: Toggle Module Completion
  const handleToggleModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedModuls = c.modulList.map(m => {
          if (m.id === moduleId) {
            return { ...m, selesai: !m.selesai };
          }
          return m;
        });
        const selesaiCount = updatedModuls.filter(m => m.selesai).length;
        const newStatus = selesaiCount === updatedModuls.length 
          ? 'selesai' 
          : selesaiCount > 0 
            ? 'sedang_belajar' 
            : 'belum_mulai';

        return {
          ...c,
          modulList: updatedModuls,
          modulSelesai: selesaiCount,
          totalModul: updatedModuls.length,
          status: newStatus
        };
      }
      return c;
    }));
    onShowToast?.('Progres modul diperbarui!', 'success');
  };

  // Handler: Add Module to Course
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourseId || !moduleFormData.judul.trim()) return;

    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      judul: moduleFormData.judul.trim(),
      durasiMenit: Number(moduleFormData.durasiMenit) || 30,
      poin: Number(moduleFormData.poin) || 50,
      tipe: moduleFormData.tipe,
      selesai: false,
      ringkasan: moduleFormData.ringkasan.trim() || undefined
    };

    setCourses(prev => prev.map(c => {
      if (c.id === activeCourseId) {
        const nextList = [...c.modulList, newMod];
        return {
          ...c,
          modulList: nextList,
          totalModul: nextList.length
        };
      }
      return c;
    }));

    setIsModuleModalOpen(false);
    setModuleFormData({
      judul: '',
      durasiMenit: 45,
      poin: 50,
      tipe: 'video',
      ringkasan: ''
    });
    onShowToast?.('Modul baru berhasil ditambahkan ke kursus!', 'success');
  };

  // Handler: Delete Module
  const handleDeleteModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const nextList = c.modulList.filter(m => m.id !== moduleId);
        const selesaiCount = nextList.filter(m => m.selesai).length;
        return {
          ...c,
          modulList: nextList,
          totalModul: nextList.length,
          modulSelesai: selesaiCount,
          status: selesaiCount === nextList.length && nextList.length > 0 ? 'selesai' : selesaiCount > 0 ? 'sedang_belajar' : 'belum_mulai'
        };
      }
      return c;
    }));
    onShowToast?.('Modul berhasil dihapus', 'info');
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col min-h-0">
      {/* Seamless Unified Card Container (Matching ArticlesView structure) */}
      <div className="relative bg-white rounded-[32px] sm:rounded-[36px] border border-[#E2E8F0] shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
        
        {/* Top Header: Matching ArticlesView standard h-[72px] */}
        <div className="h-[72px] shrink-0 border-b border-[#E2E8F0] px-5 sm:px-7 bg-white">
          <div className="w-full h-full flex items-center justify-between gap-4">
            
            {/* Left Header Section: Back to Workspace Button + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={
                  activeModuleId 
                    ? () => setActiveModuleId(null) 
                    : activeCourse 
                      ? () => setActiveCourseId(null) 
                      : onBackToWorkspace
                }
                className="p-2 -ml-1 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF4FB] text-[#0A2540] border border-[#D5E0ED] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 group"
                title={
                  activeModuleId 
                    ? "Kembali ke Silabus Modul" 
                    : activeCourse 
                      ? "Kembali ke Katalog Kursus" 
                      : "Kembali ke Workspace Utama"
                }
              >
                <ArrowLeft className="w-4 h-4 text-[#1E6FD9] group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs font-bold hidden sm:inline text-[#0A2540]">
                  {activeModuleId ? 'Silabus' : activeCourse ? 'Katalog' : 'Workspace'}
                </span>
              </button>

              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center font-bold text-xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0B1528] tracking-tight truncate">
                    {activeModule 
                      ? activeModule.judul 
                      : activeCourse 
                        ? activeCourse.judul 
                        : 'Learning Hub & Team Skill Upgrades'}
                  </h2>
                </div>
                <p className="text-xs text-[#64748B] truncate mt-0.5">
                  {activeModule
                    ? `${activeCourse?.kode} • ${activeModule.bukuBab || 'Bab ' + (activeModuleIndex + 1)} • ${activeModule.durasiMenit} Menit Baca`
                    : activeCourse 
                      ? `${activeCourse.kode} • Disusun oleh ${activeCourse.instruktur.nama} (${activeCourse.instruktur.jabatan})`
                      : 'Pusat silabus kurikulum teknik, jalur sertifikasi, dan peningkatan kompetensi tim'}
                </p>
              </div>
            </div>

            {/* Right Header Section: Subtabs + Action Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              {!activeCourse && (
                <>
                  {/* Clean Segmented Scope Pill Toggle */}
                  <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1">
                    <button
                      onClick={() => setActiveTab('katalog')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'katalog'
                          ? 'bg-white text-[#0B1528] shadow-xs'
                          : 'text-[#64748B] hover:text-[#0B1528]'
                      }`}
                    >
                      Katalog ({courses.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('matriks')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'matriks'
                          ? 'bg-white text-[#0B1528] shadow-xs'
                          : 'text-[#64748B] hover:text-[#0B1528]'
                      }`}
                    >
                      Matriks Skill Tim
                    </button>
                    <button
                      onClick={() => setActiveTab('progres')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'progres'
                          ? 'bg-white text-[#0B1528] shadow-xs'
                          : 'text-[#64748B] hover:text-[#0B1528]'
                      }`}
                    >
                      Progres ({overallProgressPercent}%)
                    </button>
                  </div>

                  {/* Add New Course Button */}
                  <button
                    onClick={() => handleOpenCourseModal()}
                    className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs hover:brightness-105 active:scale-95 transition-all text-white"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>Buat Silabus</span>
                  </button>
                </>
              )}

              {activeCourse && !activeModuleId && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCourseModal(activeCourse)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Silabus</span>
                  </button>
                  <button
                    onClick={() => setIsModuleModalOpen(true)}
                    className="btn-3d-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-2xs hover:brightness-105 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Modul</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Content Body: if reading a module, render full-bleed reader; otherwise render standard scroll body */}
        {activeCourse && activeModule ? (
          <ModuleReaderView
            course={activeCourse}
            module={activeModule}
            moduleIndex={activeModuleIndex}
            totalModules={activeCourse.modulList.length}
            onBackToCourse={() => setActiveModuleId(null)}
            onToggleComplete={() => handleToggleModule(activeCourse.id, activeModule.id)}
            onSelectModule={(modId) => setActiveModuleId(modId)}
            onShowToast={onShowToast}
          />
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 bg-[#F8FAFC]/50 scrollbar-thin scrollbar-thumb-slate-200">
            
            {/* ========================================================================= */}
            {/* 1. SINGLE COURSE DETAIL & LEARNING PLAYER VIEW                             */}
            {/* ========================================================================= */}
            {activeCourse ? (
              <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Course Hero Banner Card */}
              <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase text-white" style={{ backgroundColor: activeCourse.warna }}>
                        {activeCourse.kode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] capitalize">
                        Level {activeCourse.level}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {activeCourse.rating} ({activeCourse.pesertaCount} peserta)
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-bold text-[#0B1528] tracking-tight">
                      {activeCourse.judul}
                    </h1>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {activeCourse.deskripsi}
                    </p>

                    {/* Target Skills Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-semibold text-[#64748B] mr-1">Target Skill:</span>
                      {activeCourse.targetSkill.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF4FB] text-[#1E6FD9] border border-[#D0E2FB]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Quick Stats Card */}
                  <div className="shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 w-full lg:w-72 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#0B1528] mb-1.5">
                        <span>Penyelesaian Kursus</span>
                        <span className="font-mono text-[#1E6FD9]">
                          {Math.round((activeCourse.modulSelesai / activeCourse.totalModul) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1E6FD9] rounded-full transition-all duration-300"
                          style={{ width: `${(activeCourse.modulSelesai / activeCourse.totalModul) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1.5">
                        {activeCourse.modulSelesai} dari {activeCourse.totalModul} modul diselesaikan
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0] text-center">
                      <div className="bg-white p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] block font-medium">Estimasi Durasi</span>
                        <span className="text-xs font-bold text-[#0B1528]">{activeCourse.durasiTotalJam} Jam</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] block font-medium">Kredensial</span>
                        <span className="text-xs font-bold text-emerald-600">Sertifikat Tim</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules Curriculum Checklist (CRUD Enabled) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0B1528] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1E6FD9]" />
                    <span>Daftar Modul & Praktik Lapangan</span>
                    <span className="text-xs font-normal text-[#64748B]">({activeCourse.modulList.length} materi)</span>
                  </h3>
                  <button
                    onClick={() => setIsModuleModalOpen(true)}
                    className="text-xs font-semibold text-[#1E6FD9] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Modul</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeCourse.modulList.map((modul, index) => {
                    return (
                      <div
                        key={modul.id}
                        className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex items-start justify-between gap-4 group/item ${
                          modul.selesai 
                            ? 'border-emerald-200 bg-emerald-50/10' 
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* Checkbox toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(activeCourse.id, modul.id);
                            }}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                            title={modul.selesai ? "Tandai belum selesai" : "Tandai modul selesai"}
                          >
                            {modul.selesai ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                            )}
                          </button>

                          {/* Module Details - Clickable to open reader */}
                          <div 
                            onClick={() => setActiveModuleId(modul.id)}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-[#64748B]">
                                0{index + 1}.
                              </span>
                              <h4 className={`text-xs sm:text-sm font-bold truncate group-hover/item:text-[#1E6FD9] transition-colors ${modul.selesai ? 'text-[#0B1528] line-through opacity-80' : 'text-[#0B1528]'}`}>
                                {modul.judul}
                              </h4>
                              <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold uppercase ${
                                modul.tipe === 'lab' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : modul.tipe === 'kuis' 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-blue-100 text-blue-700'
                              }`}>
                                {modul.tipe}
                              </span>
                              {modul.sections && modul.sections.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Buku Panduan
                                </span>
                              )}
                            </div>

                            {modul.ringkasan && (
                              <p className="text-xs text-[#64748B] mb-2 leading-relaxed line-clamp-2">
                                {modul.ringkasan}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-[11px] text-[#8B9EB5]">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {modul.durasiMenit} Menit
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                +{modul.poin} XP
                              </span>
                              <span className="text-[#1E6FD9] font-semibold text-[11px] hover:underline flex items-center gap-0.5">
                                <BookOpen className="w-3 h-3" />
                                Baca Materi & Buku Modul
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons on right */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setActiveModuleId(modul.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EEF4FB] hover:bg-[#D9E8F9] text-[#1E6FD9] transition-all cursor-pointer flex items-center gap-1"
                            title="Buka Materi Bab Lengkap"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Buka Buku</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(activeCourse.id, modul.id);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              modul.selesai
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155]'
                            }`}
                          >
                            {modul.selesai ? 'Selesai' : 'Centang'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(activeCourse.id, modul.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus modul"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: KATALOG KURSUS & FILTERING                                         */}
              {/* ========================================================================= */}
              {activeTab === 'katalog' && (
                <div className="space-y-6">
                  
                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-[#8B9EB5] tracking-wider uppercase">TOTAL SILABUS</p>
                        <h4 className="text-xl font-extrabold text-[#0B1528] mt-0.5">{totalCoursesCount} Jalur</h4>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Mencakup 7 Disiplin Tim</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FB] text-[#1E6FD9] flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-[#8B9EB5] tracking-wider uppercase">SEDANG DILAKSANAKAN</p>
                        <h4 className="text-xl font-extrabold text-[#1E6FD9] mt-0.5">{inProgressCoursesCount} Kursus</h4>
                        <span className="text-[10px] text-[#64748B] font-medium mt-1 inline-block">Sprint Skill Berjalan</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Flame className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-[#8B9EB5] tracking-wider uppercase">SELESAI & LULUS</p>
                        <h4 className="text-xl font-extrabold text-emerald-600 mt-0.5">{completedCoursesCount} Kursus</h4>
                        <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">100% Kredensial Valid</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-[#8B9EB5] tracking-wider uppercase">RATA-RATA PROGRES TIM</p>
                        <h4 className="text-xl font-extrabold text-[#0B1528] mt-0.5">{overallProgressPercent}%</h4>
                        <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">Target Q3 Upgrade Tercapai</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari materi kursus, topik arsitektur, atau target skill..."
                        className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E6FD9] text-[#0A2540]"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Discipline Pill Select */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                      <select
                        value={selectedDiscipline}
                        onChange={(e) => setSelectedDiscipline(e.target.value as any)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#0A2540] focus:outline-none cursor-pointer"
                      >
                        <option value="semua">Semua Disiplin</option>
                        <option value="fe">Frontend (FE)</option>
                        <option value="be">Backend (BE)</option>
                        <option value="ux">UI/UX Designer</option>
                        <option value="qa">QA Specialist</option>
                        <option value="devops">DevOps & Cloud</option>
                        <option value="sec">Security (SEC)</option>
                        <option value="ba">Business Analyst (BA)</option>
                      </select>

                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value as any)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#0A2540] focus:outline-none cursor-pointer"
                      >
                        <option value="semua">Semua Level</option>
                        <option value="pemula">Pemula</option>
                        <option value="menengah">Menengah</option>
                        <option value="mahir">Mahir</option>
                      </select>
                    </div>
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.length === 0 ? (
                      <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#E2E8F0] p-8">
                        <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-[#0B1528]">Tidak ada kursus yang cocok</h4>
                        <p className="text-xs text-[#64748B] mt-1">Coba sesuaikan kata kunci pencarian atau filter disiplin Anda.</p>
                      </div>
                    ) : (
                      filteredCourses.map((course) => {
                        const progressPercent = Math.round((course.modulSelesai / course.totalModul) * 100);

                        return (
                          <div
                            key={course.id}
                            onClick={() => setActiveCourseId(course.id)}
                            className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
                          >
                            <div className="p-5 sm:p-6 space-y-4">
                              {/* Top Meta Bar */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span 
                                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-white uppercase"
                                    style={{ backgroundColor: course.warna }}
                                  >
                                    {course.kode}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F1F5F9] text-[#475569] capitalize">
                                    {course.level}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenCourseModal(course);
                                    }}
                                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                                    title="Edit Kursus"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteCourse(course.id, e)}
                                    className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                                    title="Hapus Kursus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Title & Description */}
                              <div>
                                <h3 className="text-sm sm:text-base font-bold text-[#0B1528] group-hover:text-[#1E6FD9] transition-colors line-clamp-2">
                                  {course.judul}
                                </h3>
                                <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                                  {course.deskripsi}
                                </p>
                              </div>

                              {/* Target Skills */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {course.targetSkill.slice(0, 3).map((skill, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F1F5F9] text-[#475569]">
                                    {skill}
                                  </span>
                                ))}
                                {course.targetSkill.length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-[#64748B]">
                                    +{course.targetSkill.length - 3} lagi
                                  </span>
                                )}
                              </div>

                              {/* Instructor info */}
                              <div className="flex items-center gap-2.5 pt-2 border-t border-[#F1F5F9]">
                                <img
                                  src={course.instruktur.avatar}
                                  alt={course.instruktur.nama}
                                  className="w-7 h-7 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-[#0B1528] block truncate leading-tight">
                                    {course.instruktur.nama}
                                  </span>
                                  <span className="text-[10px] text-[#8B9EB5] block truncate leading-tight">
                                    {course.instruktur.jabatan}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Progress Bar & Button Footer */}
                            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-[#64748B]">
                                  {course.modulSelesai} / {course.totalModul} Modul Selesai
                                </span>
                                <span className="text-[#1E6FD9] font-mono font-bold">
                                  {progressPercent}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#1E6FD9] rounded-full transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: MATRIKS SKILL TIM (UPGRADE TEAM SKILLS)                            */}
              {/* ========================================================================= */}
              {activeTab === 'matriks' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
                      <div>
                        <h3 className="text-base font-bold text-[#0B1528]">Matriks Kompetensi & Peta Skill Tim</h3>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          Pantau akumulasi jam belajar, kredensial tersertifikasi, dan target upgrade teknis tiap anggota tim
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF4FB] text-[#1E6FD9] border border-[#D0E2FB]">
                        Standard: Level 1 (Junior) s/d Level 5 (Principal)
                      </span>
                    </div>

                    {/* Team Members List */}
                    <div className="divide-y divide-[#F1F5F9] mt-4">
                      {skillMatrix.map((member) => (
                        <div key={member.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={member.avatar}
                              alt={member.namaAnggota}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#0B1528]">{member.namaAnggota}</h4>
                                <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700">
                                  {member.peran.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-[#1E6FD9] font-medium mt-0.5">
                                Target: {member.targetUpgrade}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 text-xs">
                            <div>
                              <span className="text-[10px] text-[#8B9EB5] block font-bold uppercase">Level Kompetensi</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map((lvl) => (
                                  <div
                                    key={lvl}
                                    className={`w-3.5 h-3.5 rounded-sm ${
                                      lvl <= member.levelSkill ? 'bg-[#1E6FD9]' : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                                <span className="ml-1 font-bold text-[#0B1528] font-mono">Lv.{member.levelSkill}</span>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] text-[#8B9EB5] block font-bold uppercase">Jam Belajar</span>
                              <span className="font-bold text-[#0B1528] font-mono">{member.totalJamBelajar} Jam</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-[#8B9EB5] block font-bold uppercase">Kursus Selesai</span>
                              <span className="font-bold text-emerald-600 font-mono">{member.kursusSelesai} Jalur</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-[#8B9EB5] block font-bold uppercase">Kredensial</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                {member.kredensial.map((k, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: PROGRES BELAJAR SAYA                                               */}
              {/* ========================================================================= */}
              {activeTab === 'progres' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-[#0B1528]">Ringkasan Sertifikasi & Jam Belajar Mandiri</h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Rekam jejak latihan mingguan, pencapaian modul lab, dan penyelesaian sertifikasi teknis
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                        <span className="text-2xl font-black text-[#1E6FD9] font-mono">48 Jam</span>
                        <span className="text-xs font-semibold text-[#475569] block mt-1">Waktu Belajar Akumulatif</span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                        <span className="text-2xl font-black text-emerald-600 font-mono">2 Kredensial</span>
                        <span className="text-xs font-semibold text-[#475569] block mt-1">Lulus Ujian Standar Tim</span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                        <span className="text-2xl font-black text-purple-600 font-mono">920 XP</span>
                        <span className="text-xs font-semibold text-[#475569] block mt-1">Poin Praktik Lab Produksi</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B9EB5] mb-3">Kursus Sedang Berjalan</h4>
                      <div className="space-y-3">
                        {courses.filter(c => c.status === 'sedang_belajar').map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => setActiveCourseId(c.id)}
                            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#1E6FD9] transition-all flex items-center justify-between gap-4 cursor-pointer bg-white hover:bg-[#F8FAFC]"
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#1E6FD9] font-mono">{c.kode}</span>
                              <h5 className="text-xs sm:text-sm font-bold text-[#0B1528] truncate">{c.judul}</h5>
                              <p className="text-[11px] text-[#64748B] mt-0.5">{c.modulSelesai} dari {c.totalModul} modul telah diselesaikan</p>
                            </div>
                            <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-3d-primary text-white shrink-0">
                              Lanjutkan
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Tambah / Edit Silabus Kursus (CRUD)                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-7 overflow-hidden relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <h3 className="text-base font-bold text-[#0B1528]">
                  {editingCourse ? 'Edit Silabus Kursus' : 'Buat Silabus Kursus Baru'}
                </h3>
                <button
                  onClick={() => setIsCourseModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4 pt-4">
                <div>
                  <label className="text-xs font-bold text-[#0B1528] block mb-1">Judul Kursus *</label>
                  <input
                    type="text"
                    required
                    value={courseFormData.judul}
                    onChange={(e) => setCourseFormData({ ...courseFormData, judul: e.target.value })}
                    placeholder="Contoh: Scalable Micro-Frontend Architecture"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Kode Silabus</label>
                    <input
                      type="text"
                      value={courseFormData.kode}
                      onChange={(e) => setCourseFormData({ ...courseFormData, kode: e.target.value })}
                      placeholder="FE-401"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Disiplin Tim</label>
                    <select
                      value={courseFormData.disiplin}
                      onChange={(e) => setCourseFormData({ ...courseFormData, disiplin: e.target.value as RoleKey })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none cursor-pointer"
                    >
                      <option value="fe">Frontend (FE)</option>
                      <option value="be">Backend (BE)</option>
                      <option value="ux">UI/UX Design</option>
                      <option value="qa">QA Testing</option>
                      <option value="devops">DevOps & Cloud</option>
                      <option value="sec">Security</option>
                      <option value="ba">Business Analyst</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Level Kesulitan</label>
                    <select
                      value={courseFormData.level}
                      onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value as CourseLevel })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none cursor-pointer"
                    >
                      <option value="pemula">Pemula</option>
                      <option value="menengah">Menengah</option>
                      <option value="mahir">Mahir</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Estimasi Total Jam</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={courseFormData.durasiTotalJam}
                      onChange={(e) => setCourseFormData({ ...courseFormData, durasiTotalJam: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1528] block mb-1">Deskripsi Silabus</label>
                  <textarea
                    rows={2}
                    value={courseFormData.deskripsi}
                    onChange={(e) => setCourseFormData({ ...courseFormData, deskripsi: e.target.value })}
                    placeholder="Rincian tujuan dan keluaran kompetensi..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1528] block mb-1">Target Skill (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={courseFormData.targetSkillInput}
                    onChange={(e) => setCourseFormData({ ...courseFormData, targetSkillInput: e.target.value })}
                    placeholder="React 18, Vite, Subtractive Design"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-3d-primary px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Simpan Kursus
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: Tambah Modul Baru ke Kursus (CRUD)                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 overflow-hidden relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <h3 className="text-base font-bold text-[#0B1528]">Tambah Modul Baru</h3>
                <button
                  onClick={() => setIsModuleModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddModule} className="space-y-4 pt-4">
                <div>
                  <label className="text-xs font-bold text-[#0B1528] block mb-1">Judul Modul *</label>
                  <input
                    type="text"
                    required
                    value={moduleFormData.judul}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, judul: e.target.value })}
                    placeholder="Contoh: Implementasi Dynamic SVG Fillets"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Tipe</label>
                    <select
                      value={moduleFormData.tipe}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, tipe: e.target.value as any })}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none cursor-pointer"
                    >
                      <option value="video">Video</option>
                      <option value="lab">Lab Praktik</option>
                      <option value="kuis">Kuis</option>
                      <option value="bacaan">Bacaan</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Durasi (Mnt)</label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={moduleFormData.durasiMenit}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, durasiMenit: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B1528] block mb-1">Poin (XP)</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={moduleFormData.poin}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, poin: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1528] block mb-1">Ringkasan Instruksi</label>
                  <textarea
                    rows={2}
                    value={moduleFormData.ringkasan}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, ringkasan: e.target.value })}
                    placeholder="Instruksi praktis atau prasyarat lab..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setIsModuleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-3d-primary px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Tambah Modul
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
