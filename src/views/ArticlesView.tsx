import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Heart, 
  MessageSquare, 
  Plus, 
  Search, 
  ArrowLeft, 
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Pin,
  Share2,
  Bookmark,
  Copy,
  Check,
  SlidersHorizontal,
  X,
  BookOpen,
  ArrowUpRight,
  Send,
  Sparkles,
  Palette,
  Database,
  Server,
  ShieldCheck,
  CheckSquare,
  Briefcase,
  Bot,
  Layers
} from 'lucide-react';
import { Article } from '../types';
import { INITIAL_ARTICLES, ARTICLE_LABELS, USERS_MAP, CURRENT_USER } from '../data/mockData';
import { ArticleCard } from '../components/ArticleCard';

// Content generators for authentic article reading experience
const getArticleBody = (art: Article) => {
  if (art.id === 'a0') {
    return (
      <>
        <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <span className="text-xs font-semibold text-[#0B1528] tracking-wide uppercase">AI Automation & Email Workflow</span>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            Personal Email Assistant connects your Gmail inbox with ChatGPT logic and Todoist task triage, automatically filtering high-priority client inquiries, generating drafts, and maintaining your daily inbox zero.
          </p>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">1. Core Integrations & Architecture</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          The assistant runs on three synchronized connectors:
        </p>
        <ul className="space-y-2 text-sm text-[#475569] pl-1">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] mt-2 shrink-0" />
            <span><strong>Gmail Push Webhook:</strong> Ingests inbound threads within 200ms using Pub/Sub events.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10A37F] mt-2 shrink-0" />
            <span><strong>OpenAI Categorization:</strong> Analyzes intent, urgency, and extracts actionable todo items.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E44233] mt-2 shrink-0" />
            <span><strong>Todoist Sync:</strong> Creates due-dated tasks with original email links for zero-friction followups.</span>
          </li>
        </ul>

        <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">2. Safety Guardrails</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          Outbound emails are never sent automatically without human-in-the-loop review. Drafts are placed in the &ldquo;Pending Review&rdquo; label inside Gmail for one-tap approval.
        </p>
      </>
    );
  }

  if (art.id === 'a1') {
    return (
      <>
        <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <span className="text-xs font-semibold text-[#0B1528] tracking-wide uppercase">Ringkasan Eksekutif</span>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            SOP ini mendefinisikan langkah wajib deployment produksi pada ekosistem NIITS. Setiap rilis harus melalui staging, verifikasi fungsional, dan manual checklist sebelum trafik diarahkan.
          </p>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">1. Validasi Pra-Merge & Pipeline CI</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          Sebelum pull request digabungkan ke cabang <code>main</code>, pastikan semua prasyarat berikut terpenuhi tanpa kompromi:
        </p>
        <ul className="space-y-2 text-sm text-[#475569] pl-1">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
            <span><strong>Pipeline CI hijau:</strong> Lulus linting, build container, dan tes unit dengan coverage minimal 80%.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
            <span><strong>Cross-role code review:</strong> Minimal 1 persetujuan dari tim fungsional lain (misalnya Backend direview oleh QA/DevOps).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
            <span><strong>Migrasi Database:</strong> Skrip migrasi bersifat backward-compatible (non-blocking schema alteration).</span>
          </li>
        </ul>

        <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">2. Prosedur Eksekusi Deployment</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          Deployment produksi dilakukan menggunakan metode Rolling Update dengan healthcheck terstandarisasi:
        </p>
        <div className="bg-[#0B1528] text-[#F1F5F9] p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
          <div className="text-[#94A3B8]"># 1. Jalankan migrasi schema terlebih dahulu</div>
          <div>pnpm run db:migrate --env=production</div>
          <div className="text-[#94A3B8] pt-2"># 2. Deploy armada container dengan traffic canary 10%</div>
          <div>kubectl rollout restart deployment/niits-core-api -n prod</div>
          <div className="text-[#94A3B8] pt-2"># 3. Verifikasi ketersediaan service</div>
          <div>curl -f https://api.niits.studio/healthz || exit 1</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
          <span className="font-semibold block">Protokol Rollback Darurat</span>
          <p className="leading-relaxed">
            Lakukan rollback instan jika persentase HTTP 5xx meningkat di atas 1.5% dalam interval 3 menit berturut-turut, atau latensi p95 melonjak di atas 800ms. Diagnosis dilakukan setelah rollback selesai.
          </p>
        </div>
      </>
    );
  }

  if (art.id === 'a2') {
    return (
      <>
        <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <span className="text-xs font-semibold text-[#0B1528] tracking-wide uppercase">Prinsip Pertahanan</span>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            Validasi frontend hanya bertujuan meningkatkan pengalaman pengguna (UX), bukan lapisan keamanan. Semua payload yang masuk ke API gateway wajib diasumsikan berbahaya.
          </p>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">1. Mengapa Browser Adalah Lingkungan Publik</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          Setiap kode JavaScript, regex formulir, atau validasi status di client-side dapat dilewati dalam hitungan detik menggunakan DevTools, cURL, atau Postman.
        </p>

        <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">2. Arsitektur Dual-Validation</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          Gunakan schema deklaratif terpadu (seperti Zod) untuk menyinkronkan validasi antara frontend form handler dan backend route parser:
        </p>
        <div className="bg-[#0B1528] text-[#F1F5F9] p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
          <div className="text-[#94A3B8]">// Shared schema di server & client</div>
          <div>const OrderPayloadSchema = z.object({'{'}</div>
          <div className="pl-4">itemId: z.string().uuid(),</div>
          <div className="pl-4">quantity: z.number().int().positive().max(50),</div>
          <div className="pl-4">totalPrice: z.number().nonnegative()</div>
          <div>{'}'});</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
        <span className="text-xs font-semibold text-[#0B1528] tracking-wide uppercase">Ikhtisar Dokumen</span>
        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
          {art.ringkas}
        </p>
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-[#0B1528] pt-2">Panduan Utama & Penerapan</h3>
      <p className="text-sm text-[#475569] leading-relaxed">
        Panduan ini didokumentasikan berdasarkan evaluasi praktik kerja langsung tim internal NIITS Studio. Ikuti petunjuk terperinci di bawah ini untuk memastikan konsistensi output dan keselarasan arsitektur sistem.
      </p>

      <ul className="space-y-2 text-sm text-[#475569] pl-1">
        <li className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
          <span>Lakukan pengecekan checklist pra-implementasi secara menyeluruh.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
          <span>Pastikan komunikasi antar disiplin (Frontend, Backend, dan QA) berjalan aktif selama proses perombakan kode.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FD9] mt-2 shrink-0" />
          <span>Sertakan bukti pengujian empiris (log eksekusi atau benchmark) pada ringkasan penyelesaian tugas.</span>
        </li>
      </ul>

      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
        <span className="font-semibold text-[#0B1528] block">Catatan Tambahan</span>
        <p className="leading-relaxed">
          Jika Anda menemukan bagian yang sudah usang atau memerlukan pembaruan konteks, silakan buat pull request pada repository dokumentasi internal atau hubungi penulis artikel.
        </p>
      </div>
    </>
  );
};

// Definition of topics for categorized side-by-side display
interface TopicGroupDef {
  id: string;
  title: string;
  labels: string[];
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const TOPIC_SECTIONS: TopicGroupDef[] = [
  {
    id: 'ui-ux',
    title: 'UI / UX & Desain Antarmuka',
    labels: ['ux'],
    icon: Palette,
    iconColor: 'text-[#D9488B]'
  },
  {
    id: 'frontend-sec',
    title: 'Frontend & Keamanan Web',
    labels: ['fe', 'sec'],
    icon: ShieldCheck,
    iconColor: 'text-[#1E6FD9]'
  },
  {
    id: 'backend-data',
    title: 'Backend, Data & Database',
    labels: ['be', 'data'],
    icon: Database,
    iconColor: 'text-[#0F8E82]'
  },
  {
    id: 'devops-infra',
    title: 'DevOps & Rilis ke Produksi',
    labels: ['devops', 'onboard'],
    icon: Server,
    iconColor: 'text-[#4B5D75]'
  },
  {
    id: 'qa-test',
    title: 'QA & Pengujian Kualitas',
    labels: ['qa'],
    icon: CheckSquare,
    iconColor: 'text-[#B7791F]'
  },
  {
    id: 'sop-ba',
    title: 'SOP & Analisis Bisnis (BA)',
    labels: ['ba', 'sop'],
    icon: Briefcase,
    iconColor: 'text-[#7A5AF8]'
  },
  {
    id: 'ai-automation',
    title: 'AI & Asisten Otomasi',
    labels: ['personal', 'marketing'],
    icon: Bot,
    iconColor: 'text-[#EA4335]'
  }
];

// Reusable horizontal scrollable section with sub-heading and navigation arrows
interface ArticleHorizontalSectionProps {
  title: string;
  badge?: string;
  badgeType?: 'primary' | 'amber' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  articles: Article[];
  selectedArticleId: string;
  bookmarkedIds: string[];
  onSelectArticle: (id: string) => void;
  onToggleLike: (id: string, e?: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onExportMedium: (article: Article) => void;
}

const ArticleHorizontalSection: React.FC<ArticleHorizontalSectionProps> = ({
  title,
  badge,
  badgeType = 'neutral',
  icon: Icon,
  iconColor = 'text-[#1E6FD9]',
  articles,
  selectedArticleId,
  bookmarkedIds,
  onSelectArticle,
  onToggleLike,
  onToggleBookmark,
  onExportMedium,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 12);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 12);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [articles]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 330;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Title row: Icon + Title + Controls */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className={`w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 flex items-center justify-center shrink-0 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#0B1528] tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  badgeType === 'amber' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : badgeType === 'primary'
                    ? 'bg-blue-50 text-[#1E6FD9] border border-blue-200/60'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Left & Right Navigation Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll ke kiri"
            className={`w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer ${
              canScrollLeft 
                ? 'bg-white text-slate-700 hover:bg-slate-50 shadow-2xs hover:border-slate-300' 
                : 'bg-slate-50/70 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll ke kanan"
            className={`w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer ${
              canScrollRight 
                ? 'bg-white text-slate-700 hover:bg-slate-50 shadow-2xs hover:border-slate-300' 
                : 'bg-slate-50/70 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row of Cards */}
      <div 
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((art) => (
          <div key={art.id} className="w-[285px] sm:w-[305px] md:w-[320px] shrink-0 snap-start flex">
            <ArticleCard
              article={art}
              isSelected={selectedArticleId === art.id}
              isBookmarked={bookmarkedIds.includes(art.id)}
              onClick={() => onSelectArticle(art.id)}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onExportMedium={onExportMedium}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export interface ArticlesViewProps {
  subView?: 'daftar' | 'detail' | 'tulis' | 'ekspor';
  onSubViewChange?: (subView: 'daftar' | 'detail' | 'tulis' | 'ekspor') => void;
  selectedArticleId?: string;
  onSelectArticleId?: (id: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  subView: propSubView,
  onSubViewChange,
  selectedArticleId: propSelectedArticleId,
  onSelectArticleId,
}) => {
  const [internalSubView, setInternalSubView] = useState<'daftar' | 'detail' | 'tulis' | 'ekspor'>('daftar');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [internalSelectedArticleId, setInternalSelectedArticleId] = useState<string>('a1');
  const [activeTab, setActiveTab] = useState<'semua' | 'saya'>('semua');

  const subView = propSubView !== undefined ? propSubView : internalSubView;
  const setSubView = (val: 'daftar' | 'detail' | 'tulis' | 'ekspor') => {
    setInternalSubView(val);
    onSubViewChange?.(val);
  };

  const selectedArticleId = propSelectedArticleId !== undefined ? propSelectedArticleId : internalSelectedArticleId;
  const setSelectedArticleId = (id: string) => {
    setInternalSelectedArticleId(id);
    onSelectArticleId?.(id);
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to top when article changes in detail view
  useEffect(() => {
    if (subView === 'detail' && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedArticleId, subView]);
  
  // Filter States
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'baru' | 'populer' | 'baca' | 'dibahas'>('baru');

  // Dropdown states
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Bookmark state & Copied feedback
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['a1']);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Dropdown ref for click outside
  const topicRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) {
        setIsTopicOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setIsTypeOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Interactive like
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setArticles(articles.map(a => {
      if (a.id === id) {
        return {
          ...a,
          sukaSaya: !a.sukaSaya,
          like: a.like + (a.sukaSaya ? -1 : 1)
        };
      }
      return a;
    }));
  };

  // Toggle bookmark
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleExportToMedium = (article: Article) => {
    setSelectedArticleId(article.id);
    setSubView('ekspor');
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const currentIdx = articles.findIndex(a => a.id === selectedArticle.id);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  const prevArticle = safeIdx > 0 ? articles[safeIdx - 1] : null;
  const nextArticle = safeIdx < articles.length - 1 ? articles[safeIdx + 1] : null;

  // Distinct document types
  const documentTypes = Array.from(new Set(articles.map(a => a.tipe).filter(Boolean)));

  // Filtered & Sorted articles list
  const filtered = articles.filter(a => {
    if (activeTab === 'saya' && a.penulis !== CURRENT_USER.id) return false;
    if (selectedLabel && !a.label.includes(selectedLabel)) return false;
    if (selectedType && a.tipe !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchJudul = a.judul.toLowerCase().includes(q);
      const matchRingkas = a.ringkas.toLowerCase().includes(q);
      const matchPenulis = USERS_MAP[a.penulis]?.nama.toLowerCase().includes(q);
      if (!matchJudul && !matchRingkas && !matchPenulis) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'populer') return b.like - a.like;
    if (sortBy === 'baca') return b.dilihat - a.dilihat;
    if (sortBy === 'dibahas') return b.komentar - a.komentar;
    return (b.pin ? 1 : 0) - (a.pin ? 1 : 0);
  });

  const activeFiltersCount = (selectedLabel ? 1 : 0) + (selectedType ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSelectedLabel(null);
    setSelectedType(null);
    setSearchQuery('');
    setSortBy('baru');
  };

  const selectedLabelObj = ARTICLE_LABELS.find(l => l.id === selectedLabel);

  return (
    <div className="relative w-full h-full flex-1 flex flex-col min-h-0">
      {/* Seamless Unified Card Container (Matching Dashboard structure, without notch / poni) */}
      <div className="relative bg-white rounded-[32px] sm:rounded-[36px] border border-[#E2E8F0] shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
        
        {/* Top Header: Clean, monochrome, professional navigation bar */}
        <div className="h-[72px] shrink-0 border-b border-[#E2E8F0] px-5 sm:px-7 bg-white">
          <div className={`w-full h-full flex items-center justify-between gap-4 ${subView === 'detail' ? 'max-w-4xl mx-auto' : ''}`}>
            {/* Left: Title & Subtitle */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2.5">
                {subView !== 'daftar' && subView !== 'detail' && (
                  <button
                    onClick={() => setSubView('daftar')}
                    className="p-1.5 -ml-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B1528] transition-colors cursor-pointer"
                    title="Kembali ke Daftar Artikel"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-base sm:text-lg font-semibold text-[#0B1528] tracking-tight truncate">
                  {subView === 'daftar' && 'Artikel & Knowledge Base'}
                  {subView === 'detail' && (selectedArticle?.judul || 'Detail Artikel')}
                  {subView === 'tulis' && 'Tulis Artikel Baru'}
                  {subView === 'ekspor' && 'Ekspor ke Medium'}
                </h2>
              </div>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                {subView === 'daftar' && 'Dokumentasi teknis, SOP rilis, dan standar arsitektur tim'}
                {subView === 'detail' && `${selectedArticle?.tipe || 'Artikel'} • ${selectedArticle?.baca} menit baca • Ditulis oleh ${USERS_MAP[selectedArticle?.penulis]?.nama || 'Tim'}`}
                {subView === 'tulis' && 'Bagikan pengetahuan teknis atau catatan postmortem dengan tim'}
                {subView === 'ekspor' && 'Sinkronisasi artikel internal ke Medium publik dengan sensor privasi'}
              </p>
            </div>

            {/* Right Header Actions */}
            {subView === 'daftar' && (
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Clean Scope Toggle: Semua / Saya */}
                <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab('semua')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'semua'
                        ? 'bg-white text-[#0B1528] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0B1528]'
                    }`}
                  >
                    Semua ({articles.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('saya')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'saya'
                        ? 'bg-white text-[#0B1528] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0B1528]'
                    }`}
                  >
                    Artikel Saya
                  </button>
                </div>

                {/* Action Buttons - Primary Color Matching Active Sidebar */}
                <button
                  onClick={() => setSubView('tulis')}
                  className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs hover:brightness-105 active:scale-95 transition-all text-white"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Buat Artikel</span>
                </button>
              </div>
            )}

            {subView === 'detail' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleLike(selectedArticle.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedArticle.sukaSaya
                      ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0B1528]'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedArticle.sukaSaya ? 'fill-[#0B1528] text-[#0B1528]' : ''}`} />
                  <span>{selectedArticle.like}</span>
                </button>

                <button
                  onClick={() => handleToggleBookmark(selectedArticle.id)}
                  className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                    bookmarkedIds.includes(selectedArticle.id)
                      ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0B1528]'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                  title={bookmarkedIds.includes(selectedArticle.id) ? 'Disimpan' : 'Simpan artikel'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(selectedArticle.id) ? 'fill-[#0B1528]' : ''}`} />
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  title="Salin tautan artikel"
                >
                  {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copyFeedback ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            )}

            {(subView === 'tulis' || subView === 'ekspor') && (
              <button
                onClick={() => setSubView('daftar')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-white transition-colors cursor-pointer"
              >
                Tutup
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 sm:p-7 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          <AnimatePresence mode="wait">
            
            {/* SUBVIEW 1: DAFTAR ARTIKEL (Clean Slate Architecture with Dropdown Filters) */}
            {subView === 'daftar' && (
              <motion.div
                key="daftar"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="space-y-5"
              >
                {/* Clean, Uncontained Toolbar (Search + Dropdown Filters) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
                  
                  {/* Left Filters Group */}
                  <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                    
                    {/* Search Field */}
                    <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs w-full sm:w-68 hover:border-[#CBD5E1] focus-within:border-[#346FE5] focus-within:ring-2 focus-within:ring-[#346FE5]/15 transition-all shadow-2xs">
                      <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari judul, ringkasan, penulis..."
                        className="w-full bg-transparent focus:outline-none text-[#0B1528] placeholder-[#94A3B8]"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="text-[#94A3B8] hover:text-[#0B1528] cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown 1: Topik / Label */}
                    <div className="relative" ref={topicRef}>
                      <button
                        onClick={() => {
                          setIsTopicOpen(!isTopicOpen);
                          setIsTypeOpen(false);
                          setIsSortOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                          selectedLabel
                            ? 'bg-[#F4F8FD] border-[#346FE5] text-[#1E6FD9] font-semibold'
                            : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-slate-50 hover:border-[#CBD5E1]'
                        }`}
                      >
                        <span className="text-[#94A3B8]">Topik:</span>
                        <span className={selectedLabel ? 'text-[#1E6FD9] font-semibold' : 'text-[#0B1528]'}>
                          {selectedLabelObj ? selectedLabelObj.nama : 'Semua Topik'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${isTopicOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isTopicOpen && (
                        <div className="absolute left-0 mt-1.5 w-52 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-1.5 z-50 space-y-0.5">
                          <button
                            onClick={() => { setSelectedLabel(null); setIsTopicOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              selectedLabel === null ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            <span>Semua Topik</span>
                            {selectedLabel === null && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                          </button>
                          
                          <div className="h-px bg-[#E2E8F0] my-1" />
                          
                          {ARTICLE_LABELS.map((lbl) => (
                            <button
                              key={lbl.id}
                              onClick={() => { setSelectedLabel(lbl.id); setIsTopicOpen(false); }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                selectedLabel === lbl.id ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                              }`}
                            >
                              <span>{lbl.nama}</span>
                              <span className="text-[11px] font-mono text-[#94A3B8]">{lbl.jumlah}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dropdown 2: Tipe Dokumen */}
                    <div className="relative" ref={typeRef}>
                      <button
                        onClick={() => {
                          setIsTypeOpen(!isTypeOpen);
                          setIsTopicOpen(false);
                          setIsSortOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                          selectedType
                            ? 'bg-[#F4F8FD] border-[#346FE5] text-[#1E6FD9] font-semibold'
                            : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-slate-50 hover:border-[#CBD5E1]'
                        }`}
                      >
                        <span className="text-[#94A3B8]">Tipe:</span>
                        <span className={selectedType ? 'text-[#1E6FD9] font-semibold' : 'text-[#0B1528]'}>
                          {selectedType || 'Semua Tipe'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isTypeOpen && (
                        <div className="absolute left-0 mt-1.5 w-44 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-1.5 z-50 space-y-0.5">
                          <button
                            onClick={() => { setSelectedType(null); setIsTypeOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              selectedType === null ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            <span>Semua Tipe</span>
                            {selectedType === null && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                          </button>
                          
                          <div className="h-px bg-[#E2E8F0] my-1" />

                          {documentTypes.map((tipe) => (
                            <button
                              key={tipe}
                              onClick={() => { setSelectedType(tipe); setIsTypeOpen(false); }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                selectedType === tipe ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                              }`}
                            >
                              <span>{tipe}</span>
                              {selectedType === tipe && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reset button when filter applied */}
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#64748B] hover:text-[#0B1528] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reset Filter ({activeFiltersCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Right Group: Sort & Export */}
                  <div className="flex items-center gap-2 shrink-0">
                    
                    {/* Sort Dropdown */}
                    <div className="relative" ref={sortRef}>
                      <button
                        onClick={() => {
                          setIsSortOpen(!isSortOpen);
                          setIsTopicOpen(false);
                          setIsTypeOpen(false);
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-[#E2E8F0] text-[#475569] hover:bg-slate-50 hover:border-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-[#94A3B8]" />
                        <span className="text-[#0B1528]">
                          {sortBy === 'baru' && 'Terbaru'}
                          {sortBy === 'populer' && 'Paling Populer'}
                          {sortBy === 'baca' && 'Paling Banyak Dibaca'}
                          {sortBy === 'dibahas' && 'Banyak Diskusi'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isSortOpen && (
                        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-1.5 z-50 space-y-0.5">
                          <button
                            onClick={() => { setSortBy('baru'); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              sortBy === 'baru' ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            <span>Terbaru (Default)</span>
                            {sortBy === 'baru' && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                          </button>
                          <button
                            onClick={() => { setSortBy('populer'); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              sortBy === 'populer' ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            <span>Paling Populer (Suka)</span>
                            {sortBy === 'populer' && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                          </button>
                          <button
                            onClick={() => { setSortBy('baca'); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              sortBy === 'baca' ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            <span>Paling Banyak Dibaca</span>
                            {sortBy === 'baca' && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                          </button>
                          <button
                            onClick={() => { setSortBy('dibahas'); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              sortBy === 'dibahas' ? 'bg-[#F1F5F9] font-semibold text-[#0B1528]' : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            <span>Banyak Diskusi</span>
                            {sortBy === 'dibahas' && <Check className="w-3.5 h-3.5 text-[#0B1528]" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Article Count & Active Summary */}
                <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                  <span>Menampilkan {filtered.length} dari {articles.length} artikel</span>
                  {selectedLabelObj && (
                    <span className="text-[#0B1528] font-medium">
                      Kategori: <strong className="font-semibold">{selectedLabelObj.nama}</strong>
                    </span>
                  )}
                </div>

                {/* Categorized Sections View: Latest at Top (Max 4) followed by Sub-headings per Topic */}
                {filtered.length === 0 ? (
                  /* Empty State */
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
                    <FileText className="w-10 h-10 text-[#94A3B8] mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#0B1528]">Tidak ada artikel ditemukan</p>
                      <p className="text-xs text-[#64748B]">Kriteria filter atau pencarian Anda tidak menghasilkan artikel apa pun.</p>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                    >
                      Reset Semua Filter
                    </button>
                  </div>
                ) : searchQuery.trim() ? (
                  /* Search Results View */
                  <div className="space-y-6">
                    <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-[#1E6FD9]">
                      <span>Ditemukan <strong>{filtered.length}</strong> artikel untuk kata kunci &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
                      <button onClick={() => setSearchQuery('')} className="font-semibold hover:underline cursor-pointer">
                        Hapus Pencarian
                      </button>
                    </div>

                    <ArticleHorizontalSection
                      title="Hasil Pencarian"
                      icon={Search}
                      iconColor="text-[#1E6FD9]"
                      articles={filtered}
                      selectedArticleId={selectedArticleId}
                      bookmarkedIds={bookmarkedIds}
                      onSelectArticle={(id) => {
                        setSelectedArticleId(id);
                        setSubView('detail');
                      }}
                      onToggleLike={handleToggleLike}
                      onToggleBookmark={handleToggleBookmark}
                      onExportMedium={handleExportToMedium}
                    />
                  </div>
                ) : (
                  /* Standard Categorized View */
                  <div className="space-y-7">
                    {/* 1. PALING ATAS: TERBARU (Hanya tulisan "Terbaru") */}
                    {!selectedLabel && (
                      <ArticleHorizontalSection
                        title="Terbaru"
                        icon={Sparkles}
                        iconColor="text-amber-500"
                        articles={articles
                          .filter(a => {
                            if (activeTab === 'saya' && a.penulis !== CURRENT_USER.id) return false;
                            if (selectedType && a.tipe !== selectedType) return false;
                            return true;
                          })
                          .slice(0, 4)
                        }
                        selectedArticleId={selectedArticleId}
                        bookmarkedIds={bookmarkedIds}
                        onSelectArticle={(id) => {
                          setSelectedArticleId(id);
                          setSubView('detail');
                        }}
                        onToggleLike={handleToggleLike}
                        onToggleBookmark={handleToggleBookmark}
                        onExportMedium={handleExportToMedium}
                      />
                    )}

                    {/* Divider lembut antara Terbaru dan Topik */}
                    {!selectedLabel && <div className="h-px bg-[#F1F5F9]" />}

                    {/* 2. TOPIK DENGAN KARTU BERJAJAR KE SAMPING (Tanpa sub-judul) */}
                    {TOPIC_SECTIONS.map((topic) => {
                      // Filter articles matching this topic
                      const topicArticles = articles.filter(a => {
                        if (activeTab === 'saya' && a.penulis !== CURRENT_USER.id) return false;
                        if (selectedType && a.tipe !== selectedType) return false;
                        if (selectedLabel && !a.label.includes(selectedLabel)) return false;
                        return a.label.some(l => topic.labels.includes(l));
                      });

                      if (topicArticles.length === 0) return null;

                      return (
                        <ArticleHorizontalSection
                          key={topic.id}
                          title={topic.title}
                          icon={topic.icon}
                          iconColor={topic.iconColor}
                          articles={topicArticles}
                          selectedArticleId={selectedArticleId}
                          bookmarkedIds={bookmarkedIds}
                          onSelectArticle={(id) => {
                            setSelectedArticleId(id);
                            setSubView('detail');
                          }}
                          onToggleLike={handleToggleLike}
                          onToggleBookmark={handleToggleBookmark}
                          onExportMedium={handleExportToMedium}
                        />
                      );
                    })}

                    {/* Topik / Dokumentasi Lainnya jika ada artikel yang belum tercakup */}
                    {(() => {
                      const coveredIds = new Set(
                        TOPIC_SECTIONS.flatMap(t => 
                          articles.filter(a => a.label.some(l => t.labels.includes(l))).map(a => a.id)
                        )
                      );
                      const otherArticles = articles.filter(a => {
                        if (activeTab === 'saya' && a.penulis !== CURRENT_USER.id) return false;
                        if (selectedType && a.tipe !== selectedType) return false;
                        if (selectedLabel && !a.label.includes(selectedLabel)) return false;
                        return !coveredIds.has(a.id);
                      });

                      if (otherArticles.length === 0) return null;

                      return (
                        <ArticleHorizontalSection
                          title="Topik & Dokumen Lainnya"
                          icon={Layers}
                          iconColor="text-slate-600"
                          articles={otherArticles}
                          selectedArticleId={selectedArticleId}
                          bookmarkedIds={bookmarkedIds}
                          onSelectArticle={(id) => {
                            setSelectedArticleId(id);
                            setSubView('detail');
                          }}
                          onToggleLike={handleToggleLike}
                          onToggleBookmark={handleToggleBookmark}
                          onExportMedium={handleExportToMedium}
                        />
                      );
                    })()}
                  </div>
                )}
              </motion.div>
            )}

            {/* SUBVIEW 2: DETAIL ARTIKEL (Polished, clean typographic reader) */}
            {subView === 'detail' && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="max-w-4xl mx-auto space-y-8 pb-10"
              >
                {/* Main Article Content - Flat & Seamless without nested card container */}
                <article className="space-y-8">
                  
                  {/* Header Meta */}
                  <div className="space-y-4 border-b border-[#E2E8F0] pb-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        {selectedArticle.tipe}
                      </span>
                      {selectedArticle.pin && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#0B1528] border border-[#E2E8F0]">
                          <Pin className="w-3 h-3 fill-[#0B1528]" />
                          <span>Pinned</span>
                        </span>
                      )}
                      <span className="text-xs text-[#94A3B8]">&bull;</span>
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {selectedArticle.baca} menit baca
                      </span>
                      <span className="text-xs text-[#94A3B8]">&bull;</span>
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {selectedArticle.dilihat} pembaca
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1528] tracking-tight leading-tight">
                      {selectedArticle.judul}
                    </h1>

                    {/* Author & Revision Status */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-[#0B1528] text-white flex items-center justify-center text-xs font-semibold">
                          {USERS_MAP[selectedArticle.penulis]?.inisial || 'U'}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-[#0B1528]">
                            {USERS_MAP[selectedArticle.penulis]?.nama}
                          </div>
                          <div className="text-[11px] text-[#64748B]">
                            {selectedArticle.waktu} &bull; Diverifikasi tim teknis
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleLike(selectedArticle.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            selectedArticle.sukaSaya
                              ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0B1528]'
                              : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${selectedArticle.sukaSaya ? 'fill-[#0B1528]' : ''}`} />
                          <span>{selectedArticle.like} Suka</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-6">
                    {getArticleBody(selectedArticle)}
                  </div>

                  {/* Footer tags */}
                  <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-[#94A3B8] mr-1">Topik:</span>
                      {selectedArticle.label.map((lblKey) => {
                        const lbl = ARTICLE_LABELS.find(l => l.id === lblKey);
                        return (
                          <span
                            key={lblKey}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                          >
                            {lbl ? lbl.nama : lblKey}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0B1528] transition-colors cursor-pointer"
                    >
                      {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copyFeedback ? 'Tautan disalin' : 'Salin tautan artikel'}</span>
                    </button>
                  </div>
                </article>

                {/* Related Articles Section */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-[#0B1528] tracking-wide uppercase px-1">Artikel Terkait Lainnya</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {articles.filter(a => a.id !== selectedArticle.id).slice(0, 2).map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          setSelectedArticleId(rel.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border border-[#E2E8F0] rounded-2xl p-4 cursor-pointer hover:border-[#CBD5E1] transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                          <span className="font-medium text-[#475569]">{rel.tipe}</span>
                          <span>{rel.baca} mnt baca</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#0B1528] leading-snug line-clamp-1 hover:text-[#1E6FD9] transition-colors">
                          {rel.judul}
                        </h4>
                        <p className="text-[11px] text-[#64748B] line-clamp-2">
                          {rel.ringkas}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Prev / Next Article Bar */}
                <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prevArticle ? (
                    <button
                      onClick={() => {
                        setSelectedArticleId(prevArticle.id);
                      }}
                      className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0B1528] text-left transition-all group flex items-start gap-3 cursor-pointer shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-[#0B1528] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
                          Artikel Sebelumnya
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#0B1528] line-clamp-1 group-hover:text-[#1E6FD9] transition-colors">
                          {prevArticle.judul}
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#E2E8F0] text-[#94A3B8] text-xs flex items-center gap-2">
                      <span className="text-[11px] font-medium">Ini adalah artikel pertama</span>
                    </div>
                  )}

                  {nextArticle ? (
                    <button
                      onClick={() => {
                        setSelectedArticleId(nextArticle.id);
                      }}
                      className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0B1528] text-right transition-all group flex items-start justify-end gap-3 cursor-pointer shadow-2xs"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
                          Artikel Berikutnya
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#0B1528] line-clamp-1 group-hover:text-[#1E6FD9] transition-colors">
                          {nextArticle.judul}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-[#0B1528] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#E2E8F0] text-[#94A3B8] text-xs flex items-center justify-end gap-2">
                      <span className="text-[11px] font-medium">Ini adalah artikel terakhir</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUBVIEW 3: TULIS ARTIKEL */}
            {subView === 'tulis' && (
              <motion.div
                key="tulis"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="max-w-2xl mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 my-2"
              >
                <div className="border-b border-[#F1F5F9] pb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1528]">
                    Tulis Artikel Baru
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Publikasikan SOP, postmortem, atau panduan arsitektur ke basis pengetahuan tim.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1528] mb-1.5">
                      Judul Artikel
                    </label>
                    <input
                      type="text"
                      placeholder="mis: Cara Menangani Race Condition pada PostgreSQL"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#0B1528] bg-[#F8FAFC] focus:bg-white transition-colors text-[#0B1528]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1528] mb-1.5">
                        Tipe Dokumen
                      </label>
                      <select className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#0B1528] bg-[#F8FAFC] focus:bg-white transition-colors text-[#0B1528]">
                        <option>Tata cara</option>
                        <option>Panduan</option>
                        <option>Checklist</option>
                        <option>Postmortem</option>
                        <option>Penjelasan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1528] mb-1.5">
                        Topik Utama
                      </label>
                      <select className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#0B1528] bg-[#F8FAFC] focus:bg-white transition-colors text-[#0B1528]">
                        {ARTICLE_LABELS.map(l => (
                          <option key={l.id} value={l.id}>{l.nama}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B1528] mb-1.5">
                      Ringkasan Singkat
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ringkasan 1-2 kalimat tentang inti artikel..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#0B1528] resize-none bg-[#F8FAFC] focus:bg-white transition-colors text-[#0B1528]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B1528] mb-1.5">
                      Isi Artikel (Markdown didukung)
                    </label>
                    <textarea
                      rows={9}
                      placeholder="Tulis langkah-langkah, contoh kode, atau postmortem di sini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-mono focus:outline-none focus:border-[#0B1528] bg-[#F8FAFC] focus:bg-white transition-colors text-[#0B1528]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => setSubView('daftar')}
                      className="px-4 py-2 text-xs font-medium text-[#64748B] hover:text-[#0B1528] cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => setSubView('daftar')}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#1E293B] cursor-pointer shadow-xs"
                    >
                      Simpan & Terbitkan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUBVIEW 4: EKSPOR KE MEDIUM */}
            {subView === 'ekspor' && (
              <motion.div
                key="ekspor"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="max-w-2xl mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 my-2"
              >
                <div className="border-b border-[#F1F5F9] pb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1528]">
                    Ekspor Artikel ke Medium
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Sinkronisasi artikel internal terpilih ke akun Medium publik dengan audit data rahasia.
                  </p>
                </div>

                {/* Privacy inspection alert - clean, subtle theme */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0B1528]">
                    <ShieldAlert className="w-4 h-4 text-[#475569]" />
                    <span>Audit Konten Sensitif Selesai: 2 Temuan Terdeteksi</span>
                  </div>
                  <ul className="text-xs text-[#475569] list-disc pl-5 space-y-1">
                    <li>Domain internal: <code>staging.agro.internal</code> &rarr; Otomatis dialihkan ke <code>api.example.com</code></li>
                    <li>Identitas mitra: <code>PT Tani Makmur</code> &rarr; Disamarkan menjadi &ldquo;Klien B2B Agro&rdquo;</li>
                  </ul>
                </div>

                <div className="space-y-3 text-xs text-[#475569]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#CBD5E1] text-[#0B1528] focus:ring-0" />
                    <span>Simpan sebagai Draft di Medium (jangan langsung diterbitkan publik)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#CBD5E1] text-[#0B1528] focus:ring-0" />
                    <span>Sertakan catatan atribusi &ldquo;Ditulis oleh tim rekayasa NIITS Studio&rdquo;</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => setSubView('daftar')}
                    className="px-4 py-2 text-xs font-medium text-[#64748B] hover:text-[#0B1528] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setSubView('daftar')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#1E293B] cursor-pointer shadow-xs"
                  >
                    Kirim ke Medium
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
