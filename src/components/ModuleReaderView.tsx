import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Award, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Check, 
  Copy, 
  Share2, 
  Bookmark, 
  Terminal, 
  HelpCircle, 
  FileText, 
  Sparkles,
  Info
} from 'lucide-react';
import { CourseTrack, CourseModule } from '../types/learning';

interface ModuleReaderViewProps {
  course: CourseTrack;
  module: CourseModule;
  moduleIndex: number;
  totalModules: number;
  onBackToCourse: () => void;
  onToggleComplete: () => void;
  onSelectModule: (moduleId: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const ModuleReaderView: React.FC<ModuleReaderViewProps> = ({
  course,
  module,
  moduleIndex,
  totalModules,
  onBackToCourse,
  onToggleComplete,
  onSelectModule,
  onShowToast
}) => {
  // Reading mode settings (fontSize & active sidebar toggle)
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('intro');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Prev / Next module pointers
  const prevModule = moduleIndex > 0 ? course.modulList[moduleIndex - 1] : null;
  const nextModule = moduleIndex < totalModules - 1 ? course.modulList[moduleIndex + 1] : null;

  // Copy code handler
  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    onShowToast?.('Contoh kode disalin ke clipboard!', 'info');
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Toggle bookmark handler
  const handleToggleBookmark = () => {
    setIsBookmarked(prev => !prev);
    onShowToast?.(!isBookmarked ? 'Bab modul disimpan ke penanda baca!' : 'Penanda baca dilepas', 'info');
  };

  // Share module handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast?.('Tautan modul buku disalin!', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC]/60 overflow-hidden">
      {/* Sub-header inside module view: Navigation breadcrumbs, reader controls & progress */}
      <div className="h-14 shrink-0 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-3 z-10 shadow-2xs">
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBackToCourse}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF4FB] text-[#0A2540] border border-[#D5E0ED] transition-all cursor-pointer active:scale-95 text-xs font-bold shrink-0"
            title="Kembali ke Silabus Kursus"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#1E6FD9]" />
            <span className="hidden sm:inline">Silabus</span>
          </button>

          <div className="h-4 w-px bg-[#E2E8F0] shrink-0" />

          <div className="flex items-center gap-1.5 text-xs text-[#64748B] min-w-0 truncate">
            <span className="font-semibold text-[#0B1528] truncate">{course.kode}</span>
            <span>/</span>
            <span className="text-[#1E6FD9] font-medium truncate">Bab 0{moduleIndex + 1}: {module.judul}</span>
          </div>
        </div>

        {/* Right: Font size toggle, bookmark, and completion CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Font scale toggle */}
          <div className="hidden sm:flex items-center bg-[#F1F5F9] rounded-lg p-0.5 border border-[#E2E8F0]">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                fontSize === 'normal' ? 'bg-white text-[#0B1528] shadow-2xs' : 'text-[#64748B] hover:text-[#0B1528]'
              }`}
              title="Ukuran Font Standar"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 text-[13px] font-bold rounded-md transition-colors ${
                fontSize === 'large' ? 'bg-white text-[#0B1528] shadow-2xs' : 'text-[#64748B] hover:text-[#0B1528]'
              }`}
              title="Ukuran Font Besar Nyaman Membaca"
            >
              A+
            </button>
          </div>

          {/* Bookmark button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-50 text-amber-600 border-amber-200' 
                : 'bg-[#F8FAFC] hover:bg-[#EEF4FB] text-[#64748B] border-[#E2E8F0]'
            }`}
            title="Tandai Bab Ini"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF4FB] text-[#64748B] hover:text-[#0B1528] border border-[#E2E8F0] transition-colors cursor-pointer hidden md:flex"
            title="Bagikan Bab"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Complete Checklist Toggle */}
          <button
            onClick={onToggleComplete}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              module.selesai 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
                : 'bg-[#1E6FD9] text-white hover:bg-[#155BB5] shadow-xs'
            }`}
          >
            {module.selesai ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Bab Selesai</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Tandai Selesai (+{module.poin} XP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Dual-Pane / Book Layout: Table of Contents Sidebar (Left) + Editorial Content (Center) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* Left Table of Contents / Bab List Sidebar (Desktop visible) */}
        <aside className="hidden lg:flex w-72 shrink-0 border-r border-[#E2E8F0] bg-white flex-col min-h-0 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Daftar Bab Kursus</span>
            <h4 className="text-xs font-bold text-[#0B1528] truncate">{course.judul}</h4>
          </div>

          {/* Module items list */}
          <div className="space-y-1.5 flex-1 min-h-0">
            {course.modulList.map((m, idx) => {
              const isCurrent = m.id === module.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer text-xs ${
                    isCurrent 
                      ? 'bg-[#EEF4FB] border-[#C3DCFD] text-[#0B1528] shadow-2xs font-semibold' 
                      : 'bg-white hover:bg-[#F8FAFC] border-transparent text-[#475569]'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {m.selesai ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-mono ${isCurrent ? 'border-[#1E6FD9] text-[#1E6FD9]' : 'border-slate-300 text-slate-400'}`}>
                        {idx + 1}
                      </span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${m.selesai && !isCurrent ? 'text-slate-400' : ''}`}>
                      {m.judul}
                    </p>
                    <span className="text-[10px] text-[#8B9EB5] block mt-0.5">
                      {m.durasiMenit} mnt • {m.tipe}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Table of Content within active module */}
          {module.sections && module.sections.length > 0 && (
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">Dalam Bab Ini</span>
              <ul className="space-y-1 text-xs text-[#475569]">
                <li 
                  onClick={() => {
                    const el = document.getElementById('section-intro');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setActiveHeadingId('intro');
                  }}
                  className={`px-2 py-1 rounded-lg cursor-pointer transition-colors truncate hover:text-[#1E6FD9] ${activeHeadingId === 'intro' ? 'font-bold text-[#1E6FD9] bg-[#F1F5F9]' : ''}`}
                >
                  Ikhtisar & Tujuan Belajar
                </li>
                {module.sections.map((sec, sIdx) => (
                  <li
                    key={sIdx}
                    onClick={() => {
                      const el = document.getElementById(`section-${sIdx}`);
                      el?.scrollIntoView({ behavior: 'smooth' });
                      setActiveHeadingId(`section-${sIdx}`);
                    }}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors truncate hover:text-[#1E6FD9] ${activeHeadingId === `section-${sIdx}` ? 'font-bold text-[#1E6FD9] bg-[#F1F5F9]' : ''}`}
                  >
                    {sec.heading}
                  </li>
                ))}
                {module.studiKasus && (
                  <li 
                    onClick={() => {
                      const el = document.getElementById('section-case');
                      el?.scrollIntoView({ behavior: 'smooth' });
                      setActiveHeadingId('case');
                    }}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors truncate hover:text-[#1E6FD9] ${activeHeadingId === 'case' ? 'font-bold text-[#1E6FD9] bg-[#F1F5F9]' : ''}`}
                  >
                    Studi Kasus Lapangan
                  </li>
                )}
                {module.quizMini && (
                  <li 
                    onClick={() => {
                      const el = document.getElementById('section-quiz');
                      el?.scrollIntoView({ behavior: 'smooth' });
                      setActiveHeadingId('quiz');
                    }}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors truncate hover:text-[#1E6FD9] ${activeHeadingId === 'quiz' ? 'font-bold text-[#1E6FD9] bg-[#F1F5F9]' : ''}`}
                  >
                    Uji Pemahaman Singkat
                  </li>
                )}
              </ul>
            </div>
          )}
        </aside>

        {/* Right / Main Center: Book & Chapter Reading Canvas */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 lg:p-10 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Chapter Title & Metadata Banner */}
            <header id="section-intro" className="space-y-4 pb-6 border-b border-[#E2E8F0]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase text-white" style={{ backgroundColor: course.warna }}>
                  {course.kode}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                  Bab {moduleIndex + 1} dari {totalModules}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#1E6FD9] uppercase">
                  {module.tipe}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#64748B] ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {module.durasiMenit} Menit Baca
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Award className="w-3.5 h-3.5" />
                  +{module.poin} XP
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1E6FD9] block mb-1">
                  {module.bukuBab || `Buku Pedoman Tim: Bagian ${moduleIndex + 1}`}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight leading-tight">
                  {module.judul}
                </h1>
              </div>

              {/* Summary lead text */}
              {module.ringkasan && (
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569] leading-relaxed italic">
                  "{module.ringkasan}"
                </div>
              )}

              {/* Learning Objectives (Tujuan Belajar) */}
              {module.tujuanBelajar && module.tujuanBelajar.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5E0ED] shadow-2xs space-y-2.5">
                  <h3 className="text-xs font-bold text-[#0B1528] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1E6FD9]" />
                    <span>Target Kompetensi Setelah Mempelajari Bab Ini:</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#334155]">
                    {module.tujuanBelajar.map((tujuan, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tujuan}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </header>

            {/* Structured Editorial Sections (Book Body) */}
            {module.sections && module.sections.length > 0 ? (
              <div className="space-y-8">
                {module.sections.map((sec, sIdx) => (
                  <article 
                    key={sIdx} 
                    id={`section-${sIdx}`}
                    className="space-y-4 scroll-mt-6"
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-[#0B1528] tracking-tight flex items-center gap-2">
                      <span className="text-[#1E6FD9] font-mono text-sm">§{sIdx + 1}</span>
                      <span>{sec.heading}</span>
                    </h2>

                    <p className={`text-[#334155] leading-relaxed ${fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                      {sec.penjelasan}
                    </p>

                    {/* Key takeaways bullet points */}
                    {sec.poinKunci && sec.poinKunci.length > 0 && (
                      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0B1528] block">
                          Poin-Poin Kunci & Prinsip Kerja:
                        </span>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#475569]">
                          {sec.poinKunci.map((poin, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
                              <span>{poin}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practical tip note */}
                    {sec.tipsPraktek && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="font-bold block">Tips Praktik dari Arsitek:</span>
                          <p className="leading-relaxed">{sec.tipsPraktek}</p>
                        </div>
                      </div>
                    )}

                    {/* Code snippet block */}
                    {sec.contohKode && (
                      <div className="rounded-2xl border border-[#0B1528] bg-[#0B1528] text-slate-100 overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-400">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-[#1E6FD9]" />
                            <span>Contoh Implementasi ({sec.contohKode.bahasa})</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(sec.contohKode!.kode, sIdx)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Salin Kode"
                          >
                            {copiedCodeIdx === sIdx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
                          <code>{sec.contohKode.kode}</code>
                        </pre>
                        {sec.contohKode.keterangan && (
                          <div className="px-4 py-2 bg-slate-900/90 text-[11px] text-slate-400 border-t border-slate-800">
                            {sec.contohKode.keterangan}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              /* Fallback standard editorial content if sections are not yet populated */
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <h3 className="text-sm font-bold text-[#0B1528] uppercase tracking-wider">
                    Penjelasan & Panduan Penerapan Bab
                  </h3>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    Materi ini disusun sebagai bagian dari kurikulum peningkatan kompetensi tim {course.kategori}. Bab ini membahas secara terperinci prinsip arsitektur, standar checklist kualitas, dan langkah-langkah implementasi di lini produksi.
                  </p>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    Pastikan Anda membaca seluruh konsep fundamental sebelum melangkah ke laboratorium uji atau tugas sprint terkait. Untuk berdiskusi langsung mengenai topik ini, gunakan channel review tim atau konsultasikan dengan instruktur ({course.instruktur.nama}).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-[#C3DCFD] text-xs sm:text-sm text-[#1E429F] flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#1E6FD9] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Rekomendasi Latihan Mandiri:</span>
                    <p>Terapkan pola yang dipelajari pada salah satu branch eksplorasi sebelum mengajukan PR ke codebase utama.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Case Study Section (Studi Kasus Nyata) */}
            {module.studiKasus && (
              <section id="section-case" className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5E0ED] shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1528] uppercase tracking-wider">
                    Studi Kasus Penerapan Nyata di Proyek
                  </h3>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-[#0B1528] block">Skenario Masalah:</span>
                    <p className="text-[#475569] leading-relaxed">{module.studiKasus.skenario}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#0B1528] block">Solusi Arsitektur:</span>
                    <p className="text-[#475569] leading-relaxed">{module.studiKasus.solusi}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="font-bold block">Dampak & Manfaat Bisnis:</span>
                    <span>{module.studiKasus.manfaatBisnis}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Interactive Mini-Quiz Section (Uji Pemahaman) */}
            {module.quizMini && (
              <section id="section-quiz" className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5E0ED] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0B1528] uppercase tracking-wider">
                      Uji Pemahaman Cepat
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#64748B]">1 Pertanyaan Singkat</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#0B1528]">
                  {module.quizMini.pertanyaan}
                </p>

                <div className="space-y-2">
                  {module.quizMini.opsi.map((opsi, oIdx) => {
                    const isSelected = selectedQuizAnswer === oIdx;
                    const isCorrect = oIdx === module.quizMini!.jawabanBenar;
                    
                    let btnStyle = 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#334155]';
                    if (hasSubmittedQuiz) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#EEF4FB] border-[#1E6FD9] text-[#1E6FD9] font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => !hasSubmittedQuiz && setSelectedQuizAnswer(oIdx)}
                        disabled={hasSubmittedQuiz}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opsi}</span>
                        {hasSubmittedQuiz && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!hasSubmittedQuiz ? (
                  <button
                    onClick={() => {
                      if (selectedQuizAnswer === null) {
                        onShowToast?.('Pilih salah satu jawaban terlebih dahulu', 'info');
                        return;
                      }
                      setHasSubmittedQuiz(true);
                      if (selectedQuizAnswer === module.quizMini!.jawabanBenar) {
                        onShowToast?.('Jawaban benar! Hebat!', 'success');
                      } else {
                        onShowToast?.('Kurang tepat, periksa pembahasan di bawah.', 'info');
                      }
                    }}
                    disabled={selectedQuizAnswer === null}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedQuizAnswer !== null
                        ? 'bg-[#1E6FD9] text-white hover:bg-[#155BB5]'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#475569] space-y-1">
                    <span className="font-bold text-[#0B1528] block">Pembahasan:</span>
                    <p className="leading-relaxed">{module.quizMini.pembahasan}</p>
                  </div>
                )}
              </section>
            )}

            {/* Bottom Footer Navigation: Prev & Next Chapter Controls */}
            <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
              {prevModule ? (
                <button
                  onClick={() => onSelectModule(prevModule.id)}
                  className="flex items-center gap-2 p-3 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-left transition-all cursor-pointer group flex-1 max-w-xs"
                >
                  <ChevronLeft className="w-4 h-4 text-[#1E6FD9] group-hover:-translate-x-0.5 transition-transform shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">Bab Sebelumnya</span>
                    <p className="text-xs font-bold text-[#0B1528] truncate">{prevModule.judul}</p>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextModule ? (
                <button
                  onClick={() => onSelectModule(nextModule.id)}
                  className="flex items-center justify-end gap-2 p-3 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-right transition-all cursor-pointer group flex-1 max-w-xs ml-auto"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">Bab Berikutnya</span>
                    <p className="text-xs font-bold text-[#0B1528] truncate">{nextModule.judul}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1E6FD9] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ) : (
                <button
                  onClick={onBackToCourse}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs ml-auto"
                >
                  Selesaikan Seluruh Silabus
                </button>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
