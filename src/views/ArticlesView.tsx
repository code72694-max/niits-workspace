import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Heart, 
  MessageSquare, 
  Share2, 
  Plus, 
  Search, 
  Check, 
  AlertTriangle, 
  ArrowLeft, 
  ExternalLink,
  ShieldAlert,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { Article } from '../types';
import { INITIAL_ARTICLES, ARTICLE_LABELS, USERS_MAP, CURRENT_USER } from '../data/mockData';

export const ArticlesView: React.FC = () => {
  const [subView, setSubView] = useState<'daftar' | 'detail' | 'tulis' | 'ekspor'>('daftar');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('a1');
  const [activeTab, setActiveTab] = useState<'semua' | 'saya'>('semua');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'baru' | 'populer' | 'dibahas'>('baru');

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

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  // Filtered list
  const filtered = articles.filter(a => {
    if (activeTab === 'saya' && a.penulis !== CURRENT_USER.id) return false;
    if (selectedLabel && !a.label.includes(selectedLabel)) return false;
    if (searchQuery.trim() && !a.judul.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'populer') return b.like - a.like;
    if (sortBy === 'dibahas') return b.komentar - a.komentar;
    return (b.pin ? 1 : 0) - (a.pin ? 1 : 0);
  });

  return (
    <div className="space-y-6">
      {/* Subview 1: Daftar Artikel */}
      {subView === 'daftar' && (
        <div className="space-y-4">
          {/* Top Filter and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-[#E2EAF3] rounded-full p-1 shadow-2xs">
                <button
                  onClick={() => setActiveTab('semua')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeTab === 'semua' ? 'bg-[#1E6FD9] text-white' : 'text-[#5B7288] hover:text-[#0A2540]'
                  }`}
                >
                  Semua Artikel ({articles.length})
                </button>
                <button
                  onClick={() => setActiveTab('saya')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeTab === 'saya' ? 'bg-[#1E6FD9] text-white' : 'text-[#5B7288] hover:text-[#0A2540]'
                  }`}
                >
                  Artikel Saya
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2EAF3] rounded-full text-xs w-56">
                <Search className="w-3.5 h-3.5 text-[#5B7288]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari SOP, panduan..."
                  className="w-full bg-transparent focus:outline-none text-[#0A2540] placeholder-[#5B7288]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubView('ekspor')}
                className="px-3.5 py-2 rounded-full text-xs font-medium bg-white border border-[#E2EAF3] text-[#3C5A78] hover:bg-[#F4F8FD] transition-colors"
              >
                Ekspor ke Medium
              </button>
              <button
                onClick={() => setSubView('tulis')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tulis Artikel</span>
              </button>
            </div>
          </div>

          {/* Label Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedLabel(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 border transition-all ${
                selectedLabel === null
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'bg-white text-[#5B7288] border-[#E2EAF3] hover:bg-[#F4F8FD]'
              }`}
            >
              Semua Topik
            </button>
            {ARTICLE_LABELS.map((lbl) => {
              const isSelected = selectedLabel === lbl.id;
              return (
                <button
                  key={lbl.id}
                  onClick={() => setSelectedLabel(isSelected ? null : lbl.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-white font-bold border-2 shadow-xs'
                      : 'bg-white text-[#5B7288] border-[#E2EAF3] hover:bg-[#F4F8FD]'
                  }`}
                  style={{ borderColor: isSelected ? lbl.warna : undefined, color: isSelected ? lbl.warna : undefined }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lbl.warna }} />
                  <span>{lbl.nama}</span>
                  <span className="text-[10px] text-[#5B7288] font-mono">{lbl.jumlah}</span>
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((art) => {
              const user = USERS_MAP[art.penulis];
              return (
                <motion.div
                  key={art.id}
                  whileHover={{ y: -2 }}
                  onClick={() => {
                    setSelectedArticleId(art.id);
                    setSubView('detail');
                  }}
                  className="bg-white border border-[#E2EAF3] rounded-2xl p-5 cursor-pointer shadow-2xs hover:shadow-md hover:border-[#1E6FD9] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F0FA] text-[#1E6FD9]">
                        {art.tipe}
                      </span>
                      <span className="text-[11px] text-[#5B7288] font-mono">
                        {art.baca} mnt baca
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0A2540] leading-snug tracking-tight hover:text-[#1E6FD9] transition-colors">
                      {art.judul}
                    </h3>
                    <p className="text-xs text-[#5B7288] leading-relaxed line-clamp-2">
                      {art.ringkas}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EFF4F9] flex items-center justify-between text-xs text-[#5B7288]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: user?.warna }}
                      >
                        {user?.inisial}
                      </span>
                      <span className="truncate max-w-[100px] text-[#0A2540] font-medium">{user?.nama}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleToggleLike(art.id, e)}
                        className={`flex items-center gap-1 hover:scale-105 transition-transform ${
                          art.sukaSaya ? 'text-[#C4562B] font-bold' : 'text-[#5B7288]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${art.sukaSaya ? 'fill-[#C4562B]' : ''}`} />
                        <span className="font-mono text-[11px]">{art.like}</span>
                      </button>

                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px]">{art.komentar}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white border border-[#E2EAF3] rounded-2xl p-12 text-center max-w-md mx-auto">
              <FileText className="w-10 h-10 text-[#D7E6F5] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0A2540]">Tidak ada artikel yang cocok</p>
              <p className="text-xs text-[#5B7288] mt-1 mb-4">Coba bersihkan kata kunci pencarian atau ganti topik.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedLabel(null); }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subview 2: Detail Artikel Reader */}
      {subView === 'detail' && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E2EAF3] rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          <button
            onClick={() => setSubView('daftar')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E6FD9] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Artikel</span>
          </button>

          {/* Article Header */}
          <div className="space-y-3 border-b border-[#EFF4F9] pb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F0FA] text-[#1E6FD9]">
                {selectedArticle.tipe}
              </span>
              <span className="text-xs text-[#5B7288]">&bull; {selectedArticle.baca} menit baca</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight leading-tight">
              {selectedArticle.judul}
            </h1>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#5B7288]">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: USERS_MAP[selectedArticle.penulis]?.warna }}
                >
                  {USERS_MAP[selectedArticle.penulis]?.inisial}
                </span>
                <div>
                  <div className="font-bold text-[#0A2540]">
                    {USERS_MAP[selectedArticle.penulis]?.nama}
                  </div>
                  <div className="text-[11px] text-[#5B7288]">
                    {selectedArticle.waktu} &bull; Direvisi oleh tim QA
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleLike(selectedArticle.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border font-semibold transition-all ${
                    selectedArticle.sukaSaya
                      ? 'bg-[#C4562B]/10 border-[#C4562B] text-[#C4562B]'
                      : 'bg-white border-[#E2EAF3] text-[#5B7288] hover:bg-[#F4F8FD]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedArticle.sukaSaya ? 'fill-[#C4562B]' : ''}`} />
                  <span>{selectedArticle.like} Suka</span>
                </button>
              </div>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-[#3C5A78] space-y-4">
            <p>
              Dokumen ini wajib diikuti untuk setiap rilis ke lingkungan produksi, termasuk patch hotfix. Kalau kamu merasa satu langkah bisa dilewati karena "cuma perubahan kecil", langkah itulah yang biasanya menjadi akar insiden di masa depan.
            </p>

            <h3 className="text-base font-bold text-[#0A2540] pt-2">1. Langkah Sebelum Merge</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Pipeline CI hijau semua: lint, unit test, container build, dan security scan. Kegagalan tidak boleh ditelan dengan operator <code>|| true</code>.</li>
              <li>Minimal satu reviewer dari ruang peran yang berbeda dari penulis kode (misalnya Backend direview QA / Security).</li>
              <li>Definition of Done di ruang peran terkait sudah terpenuhi, bukan diasumsikan.</li>
            </ul>

            <h3 className="text-base font-bold text-[#0A2540] pt-2">2. Saat Eksekusi Rilis</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Deploy ke staging dulu, selalu. Tidak ada pengecualian untuk hotfix darurat.</li>
              <li>Jalankan koleksi Bruno lingkungan staging. Perhatikan asersi fungsional, bukan hanya HTTP 200.</li>
              <li>Setelah lolos, deploy produksi dengan manual approve. Catat siapa yang menyetujui.</li>
            </ul>

            <div className="p-4 rounded-xl bg-[#C4562B]/5 border border-[#C4562B]/20 my-4 text-xs text-[#3C5A78]">
              <strong className="text-[#C4562B] block mb-1">Kapan Harus Rollback:</strong>
              Rollback segera jika error rate melonjak di atas 2%, atau ada satu saja laporan data pengguna bocor/tertukar (IDOR). Jangan menunggu diagnosis selesai; diagnosis dilakukan setelah sistem kembali aman.
            </div>
          </div>
        </div>
      )}

      {/* Subview 3: Tulis Artikel */}
      {subView === 'tulis' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E2EAF3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <button
            onClick={() => setSubView('daftar')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E6FD9] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </button>

          <h2 className="text-xl font-bold text-[#0A2540]">
            Tulis Artikel Baru
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Judul Artikel
              </label>
              <input
                type="text"
                placeholder="mis: Cara Menangani Race Condition pada PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-sm focus:outline-none focus:border-[#1E6FD9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Ringkasan Singkat
              </label>
              <textarea
                rows={2}
                placeholder="Ringkasan 1-2 kalimat tentang inti artikel..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs focus:outline-none focus:border-[#1E6FD9] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                Konten / Isi Artikel (Markdown didukung)
              </label>
              <textarea
                rows={8}
                placeholder="Tulis langkah-langkah, contoh kode, atau postmortem di sini..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAF3] text-xs font-mono focus:outline-none focus:border-[#1E6FD9]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSubView('daftar')}
                className="px-4 py-2 text-xs font-medium text-[#5B7288] hover:text-[#0A2540]"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert("Artikel baru berhasil disimpan ke draft!");
                  setSubView('daftar');
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C]"
              >
                Simpan & Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subview 4: Ekspor ke Medium */}
      {subView === 'ekspor' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E2EAF3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <button
            onClick={() => setSubView('daftar')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E6FD9] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Artikel</span>
          </button>

          <div>
            <h2 className="text-xl font-bold text-[#0A2540]">
              Ekspor Artikel ke Medium
            </h2>
            <p className="text-xs text-[#5B7288] mt-1">
              Bawa artikel internal ke profil publik Medium dengan pemeriksaan privasi otomatis.
            </p>
          </div>

          {/* Privacy inspection alert */}
          <div className="p-4 rounded-xl bg-[#C4562B]/10 border border-[#C4562B]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C4562B]">
              <ShieldAlert className="w-4 h-4" />
              <span>Pemeriksaan Konten Sensitif Selesai: 2 Temuan</span>
            </div>
            <ul className="text-xs text-[#3C5A78] list-disc pl-5 space-y-1">
              <li>Host internal: <code>staging.agro.internal</code> &rarr; Otomatis diganti ke <code>api.example.com</code></li>
              <li>Nama klien: <code>PT Tani Makmur</code> &rarr; Disamarkan menjadi &ldquo;Klien B2B&rdquo;</li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#1E6FD9]" />
              <span>Simpan sebagai Draft di Medium (jangan langsung terbit publik)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#1E6FD9]" />
              <span>Tambahkan catatan &ldquo;Ditulis untuk tim teknologi NIITS Studio&rdquo;</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EFF4F9]">
            <button
              onClick={() => setSubView('daftar')}
              className="px-4 py-2 text-xs font-medium text-[#5B7288]"
            >
              Batal
            </button>
            <button
              onClick={() => {
                alert("Sukses! 2 artikel telah diekspor sebagai draft di Medium @harykurniawan.");
                setSubView('daftar');
              }}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#0A2540] text-white hover:bg-black"
            >
              Kirim ke Medium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
