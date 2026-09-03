import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench,
  Search, 
  Filter, 
  ArrowRight, 
  Upload, 
  Download, 
  CheckCircle2, 
  FileText, 
  FileType, 
  FileSpreadsheet, 
  Files, 
  FileUp, 
  FileImage, 
  Minimize2, 
  ScanText, 
  QrCode, 
  Code2, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Copy, 
  Check,
  RefreshCw,
  Sliders,
  AlertCircle
} from 'lucide-react';

export interface ToolItem {
  id: string;
  title: string;
  category: 'Dokumen & PDF' | 'Gambar & Aset' | 'Produktivitas' | 'Developer';
  format: string;
  tag: string;
  desc: string;
  color: string;
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  acceptedFile?: string;
  outputExt?: string;
}

export const TOOLS_LIST: ToolItem[] = [
  {
    id: 'img-to-pdf',
    title: 'Image to PDF',
    category: 'Dokumen & PDF',
    format: 'JPG/PNG → PDF',
    tag: 'PDF',
    desc: 'Konversi kumpulan berkas gambar (JPG, PNG, WebP) ke dokumen PDF berkualitas tinggi dengan orientasi otomatis.',
    color: '#C4562B',
    popular: true,
    icon: FileImage,
    acceptedFile: 'image/png, image/jpeg, image/webp',
    outputExt: '.pdf'
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    category: 'Dokumen & PDF',
    format: 'PDF → DOCX',
    tag: 'Word',
    desc: 'Ubah dokumen PDF menjadi file Microsoft Word (.docx) yang dapat diedit langsung dengan mempertahankan tata letak teks.',
    color: '#1E6FD9',
    popular: true,
    icon: FileType,
    acceptedFile: 'application/pdf',
    outputExt: '.docx'
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    category: 'Dokumen & PDF',
    format: 'PDF → XLSX',
    tag: 'Excel',
    desc: 'Pindai dan ekstrak tabel numerik atau laporan data dari PDF ke spreadsheet Excel (.xlsx / CSV) yang rapi.',
    color: '#0F8E82',
    popular: true,
    icon: FileSpreadsheet,
    acceptedFile: 'application/pdf',
    outputExt: '.xlsx'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    category: 'Dokumen & PDF',
    format: 'DOCX → PDF',
    tag: 'PDF',
    desc: 'Konversi berkas dokumen Microsoft Word (.docx / .doc) ke dokumen PDF standar cetak yang rapi dan aman.',
    color: '#2B6CB0',
    popular: false,
    icon: FileUp,
    acceptedFile: '.docx, .doc, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    outputExt: '.pdf'
  },
  {
    id: 'merge-pdf',
    title: 'Gabung PDF (Merge)',
    category: 'Dokumen & PDF',
    format: 'Multi PDF → 1 PDF',
    tag: 'Merge',
    desc: 'Satukan beberapa file PDF terpisah menjadi satu bundel dokumen resmi dengan urutan halaman yang fleksibel.',
    color: '#D97706',
    popular: true,
    icon: Files,
    acceptedFile: 'application/pdf',
    outputExt: '.pdf'
  },
  {
    id: 'compress-pdf',
    title: 'Kompres Ukuran PDF',
    category: 'Dokumen & PDF',
    format: 'PDF → PDF Ringan',
    tag: 'Kompresi',
    desc: 'Kecilkan ukuran kapasitas file PDF hingga 75% lebih hemat kuota tanpa mengurangi keterbacaan teks.',
    color: '#7C3AED',
    popular: true,
    icon: Minimize2,
    acceptedFile: 'application/pdf',
    outputExt: '_compressed.pdf'
  },
  {
    id: 'pdf-to-img',
    title: 'PDF to Image',
    category: 'Dokumen & PDF',
    format: 'PDF → PNG/JPG',
    tag: 'Gambar',
    desc: 'Ekstrak dan simpan setiap halaman dari dokumen PDF sebagai gambar beresolusi tinggi (format PNG atau JPG).',
    color: '#EA580C',
    popular: false,
    icon: FileImage,
    acceptedFile: 'application/pdf',
    outputExt: '.png'
  },
  {
    id: 'compress-img',
    title: 'Kompres Gambar',
    category: 'Gambar & Aset',
    format: 'JPG/PNG → Optimal',
    tag: 'Aset',
    desc: 'Optimasi ukuran file gambar JPG, PNG, dan WebP untuk performa website tanpa menurunkan ketajaman visual.',
    color: '#DB2777',
    popular: false,
    icon: FileImage,
    acceptedFile: 'image/png, image/jpeg, image/webp',
    outputExt: '_optimized.jpg'
  },
  {
    id: 'ocr-text',
    title: 'OCR & Ekstrak Teks',
    category: 'Produktivitas',
    format: 'Gambar → Teks',
    tag: 'OCR',
    desc: 'Kenali dan salin teks dari hasil scan dokumen cetak, foto formulir, struk belanja, atau screenshot.',
    color: '#059669',
    popular: true,
    icon: ScanText,
    acceptedFile: 'image/*, application/pdf',
    outputExt: '.txt'
  },
  {
    id: 'qr-generator',
    title: 'Pembuat QR Code',
    category: 'Produktivitas',
    format: 'Link/Teks → QR',
    tag: 'QR Code',
    desc: 'Generate kode QR instan resolusi tinggi untuk tautan link dokumen, nomor WhatsApp, teks rahasia, atau Wi-Fi.',
    color: '#475569',
    popular: true,
    icon: QrCode,
    acceptedFile: '',
    outputExt: '.png'
  },
  {
    id: 'json-formatter',
    title: 'Format & Validasi JSON',
    category: 'Developer',
    format: 'Raw → Clean JSON',
    tag: 'Kode',
    desc: 'Rapikan indentasi kode JSON/YAML, temukan kesalahan sintaks dengan penanda baris, atau minifikasi data.',
    color: '#2563EB',
    popular: false,
    icon: Code2,
    acceptedFile: '.json, text/plain',
    outputExt: '.json'
  },
  {
    id: 'base64-hash',
    title: 'Base64 & Hash Tool',
    category: 'Developer',
    format: 'Teks → Hash/Base64',
    tag: 'Security',
    desc: 'Encode/Decode string Base64 serta hitung hash checksum SHA-256 dan MD5 untuk verifikasi integritas data.',
    color: '#4F46E5',
    popular: false,
    icon: ShieldCheck,
    acceptedFile: '',
    outputExt: '.txt'
  }
];

interface ToolsViewProps {
  initialTab?: string;
}

export const ToolsView: React.FC<ToolsViewProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);

  // Filter tools
  const categories = ['Semua', 'Dokumen & PDF', 'Gambar & Aset', 'Produktivitas', 'Developer'];

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || tool.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#D5E0ED] rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1528] text-white flex items-center justify-center shadow-xs shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1528] tracking-tight">
                Daftar Tools & Utilitas
              </h1>
              <p className="text-xs sm:text-sm text-[#5A6E82] mt-0.5">
                Koleksi alat konversi dokumen, pengolahan PDF, optimasi gambar, dan utilitas produktivitas tim.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F4F8FD] border border-[#D8E1EC] rounded-full text-xs font-semibold text-[#0B1528]">
              <Sparkles className="w-3.5 h-3.5 text-[#1E6FD9]" />
              <span>{TOOLS_LIST.length} Tools Siap Pakai</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-[#EEF3F8]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA9C9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tool: image to pdf, word, qr, json..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#D8E1EC] rounded-full text-[#0B1528] placeholder-[#8CA9C9] focus:outline-none focus:border-[#1E6FD9] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B1528] text-white shadow-2xs'
                    : 'bg-white border border-[#D8E1EC] text-[#4A5D70] hover:bg-[#F4F8FD]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const IconComp = tool.icon;
          return (
            <motion.div
              key={tool.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveTool(tool)}
              className="bg-white rounded-[24px] border border-[#D5E0ED] p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#1E6FD9]/40 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Card Header: Icon, Tags & Format Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                    style={{ backgroundColor: tool.color }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tool.popular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4E5] text-[#B7791F] border border-[#FFE2B8]">
                        Populer
                      </span>
                    )}
                    <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F4F8FD] text-[#0A2540] border border-[#D8E1EC]">
                      {tool.format}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-[#0B1528] group-hover:text-[#1E6FD9] transition-colors line-clamp-1">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#5A6E82] mt-2 leading-relaxed line-clamp-2 min-h-[36px]">
                  {tool.desc}
                </p>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-3.5 border-t border-[#EEF3F8] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#8CA9C9] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tool.color }} />
                  {tool.category}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTool(tool);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B1528] group-hover:bg-[#1E6FD9] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  <span>Gunakan Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="bg-white rounded-[24px] border border-[#D5E0ED] p-12 text-center">
          <Wrench className="w-10 h-10 text-[#8CA9C9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1528]">Tool tidak ditemukan</h3>
          <p className="text-xs text-[#5A6E82] mt-1">Coba kata kunci pencarian lain atau pilih kategori Semua.</p>
        </div>
      )}

      {/* Interactive Tool Modal */}
      <AnimatePresence>
        {activeTool && (
          <ToolRunnerModal 
            tool={activeTool} 
            onClose={() => setActiveTool(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// INTERACTIVE TOOL WORKSPACE MODAL
// =========================================================================
interface ToolRunnerModalProps {
  tool: ToolItem;
  onClose: () => void;
}

const ToolRunnerModal: React.FC<ToolRunnerModalProps> = ({ tool, onClose }) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [resultFileName, setResultFileName] = useState('');

  // Special state for QR Code
  const [qrText, setQrText] = useState('https://brunopmo.studio/app');
  const [qrType, setQrType] = useState<'url' | 'text' | 'wa'>('url');

  // Special state for JSON Formatter
  const [jsonInput, setJsonInput] = useState('{\n  "status": "success",\n  "project": "NIITS Mobile Apps",\n  "sprint": 14,\n  "features": ["Image to PDF", "PDF to Word", "QR Generator"]\n}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Special state for Base64
  const [base64Input, setBase64Input] = useState('Selamat datang di Bruno PMO Studio');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');

  const fileInputId = useId();
  const IconComp = tool.icon;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileList(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileList(Array.from(e.target.files));
    }
  };

  const handleStartProcess = () => {
    setIsProcessing(true);
    setProgress(15);
    setIsDone(false);

    const step1 = setTimeout(() => setProgress(45), 250);
    const step2 = setTimeout(() => setProgress(80), 500);
    const step3 = setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setIsDone(true);
      const original = fileList[0]?.name.replace(/\.[^/.]+$/, "") || "Dokumen_Hasil";
      setResultFileName(`${original}_konversi${tool.outputExt || '.pdf'}`);
    }, 800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleDownloadSimulatedFile = () => {
    const dummyContent = `Bruno PMO Studio - Hasil Olah Tool ${tool.title}\nWaktu: ${new Date().toLocaleString('id-ID')}\nFormat: ${tool.format}`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFileName || `Hasil_${tool.title.replace(/\s+/g, '_')}${tool.outputExt || '.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Format JSON tidak valid');
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Format JSON tidak valid');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Base64 encode/decode
  const getBase64Result = () => {
    try {
      if (base64Mode === 'encode') {
        return btoa(unescape(encodeURIComponent(base64Input)));
      } else {
        return decodeURIComponent(escape(atob(base64Input)));
      }
    } catch {
      return 'Format string tidak dapat di-decode';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white rounded-[28px] border border-[#D5E0ED] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#0B1528] max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EEF3F8]">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-2xs"
              style={{ backgroundColor: tool.color }}
            >
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0B1528]">{tool.title}</h2>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4F8FD] text-[#0A2540] border border-[#D8E1EC]">
                  {tool.format}
                </span>
              </div>
              <p className="text-xs text-[#5A6E82] mt-0.5">{tool.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8CA9C9] hover:text-[#0B1528] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Switch based on tool type */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* SPECIAL WORKSPACE 1: QR CODE GENERATOR */}
          {tool.id === 'qr-generator' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {(['url', 'text', 'wa'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setQrType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                      qrType === t
                        ? 'bg-[#0B1528] text-white'
                        : 'bg-[#F4F8FD] text-[#5A6E82] hover:bg-[#E8EEF5]'
                    }`}
                  >
                    {t === 'url' ? 'Tautan URL' : t === 'text' ? 'Teks Biasa' : 'WhatsApp'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1528] mb-1.5">
                  {qrType === 'url' ? 'Masukkan URL Tautan Web' : qrType === 'wa' ? 'Nomor WhatsApp (Contoh: 6281234567890)' : 'Isi Teks Bebas'}
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F8FAFC] border border-[#D8E1EC] rounded-xl text-[#0B1528] focus:bg-white focus:outline-none focus:border-[#1E6FD9]"
                />
              </div>

              {/* QR Preview Box */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#D8E1EC]">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-[#E2EAF3]">
                  <QrCode className="w-36 h-36 text-[#0B1528]" />
                </div>
                <p className="text-xs font-mono text-[#5A6E82] mt-3 break-all text-center max-w-sm">
                  {qrText || 'https://brunopmo.studio'}
                </p>
                <button
                  onClick={handleDownloadSimulatedFile}
                  className="mt-4 px-4 py-2 bg-[#0B1528] text-white rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#1E6FD9] transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Gambar QR Code (PNG)</span>
                </button>
              </div>
            </div>
          )}

          {/* SPECIAL WORKSPACE 2: JSON FORMATTER */}
          {tool.id === 'json-formatter' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B1528]">Editor & Validator JSON</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFormatJson}
                    className="px-3 py-1 bg-[#1E6FD9] text-white text-xs font-bold rounded-lg hover:bg-[#1557AB] transition-colors cursor-pointer"
                  >
                    Format / Rapikan
                  </button>
                  <button
                    onClick={handleMinifyJson}
                    className="px-3 py-1 bg-[#F4F8FD] border border-[#D8E1EC] text-[#0B1528] text-xs font-bold rounded-lg hover:bg-[#E8EEF5] transition-colors cursor-pointer"
                  >
                    Minifikasi
                  </button>
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1 bg-[#F4F8FD] border border-[#D8E1EC] text-[#0B1528] text-xs font-bold rounded-lg hover:bg-[#E8EEF5] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
                className="w-full p-3 font-mono text-xs bg-[#0B1528] text-emerald-400 rounded-xl border border-[#D8E1EC] focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          {/* SPECIAL WORKSPACE 3: BASE64 & HASH */}
          {tool.id === 'base64-hash' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBase64Mode('encode')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    base64Mode === 'encode' ? 'bg-[#0B1528] text-white' : 'bg-[#F4F8FD] text-[#5A6E82]'
                  }`}
                >
                  Encode to Base64
                </button>
                <button
                  onClick={() => setBase64Mode('decode')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    base64Mode === 'decode' ? 'bg-[#0B1528] text-white' : 'bg-[#F4F8FD] text-[#5A6E82]'
                  }`}
                >
                  Decode from Base64
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1528] mb-1.5">Input Teks</label>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#D8E1EC] rounded-xl text-[#0B1528] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1528] mb-1.5">Hasil Konversi</label>
                <div className="p-3 bg-[#0B1528] text-emerald-400 font-mono text-xs rounded-xl break-all">
                  {getBase64Result()}
                </div>
              </div>
            </div>
          )}

          {/* STANDARD DOCUMENT & CONVERSION WORKSPACE (Image to PDF, PDF to Word, PDF to Excel, etc.) */}
          {tool.id !== 'qr-generator' && tool.id !== 'json-formatter' && tool.id !== 'base64-hash' && (
            <div className="space-y-4">
              {/* Dropzone Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-[#C5D5E6] hover:border-[#1E6FD9] rounded-2xl p-6 sm:p-8 text-center bg-[#F8FAFC] hover:bg-[#F4F8FD] transition-all flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => document.getElementById(fileInputId)?.click()}
              >
                <input
                  id={fileInputId}
                  type="file"
                  multiple={tool.id === 'merge-pdf' || tool.id === 'img-to-pdf'}
                  accept={tool.acceptedFile}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-[#D8E1EC] flex items-center justify-center text-[#1E6FD9] group-hover:scale-105 transition-transform mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#0B1528]">
                  Tarik & lepas berkas di sini, atau <span className="text-[#1E6FD9] underline">pilih dari perangkat</span>
                </p>
                <p className="text-[11px] text-[#8CA9C9] mt-1">
                  Mendukung format: {tool.format} (Maks. 50 MB per berkas)
                </p>
              </div>

              {/* Selected Files List */}
              {fileList.length > 0 && (
                <div className="bg-[#F8FAFC] border border-[#D8E1EC] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1528]">
                    <span>Berkas Terpilih ({fileList.length})</span>
                    <button 
                      onClick={() => setFileList([])}
                      className="text-[#E5484D] hover:underline cursor-pointer"
                    >
                      Hapus Semua
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {fileList.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E2EAF3] text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-[#1E6FD9] shrink-0" />
                          <span className="truncate font-medium text-[#0B1528]">{file.name}</span>
                        </div>
                        <span className="text-[11px] text-[#8CA9C9] font-mono shrink-0 ml-2">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Progress Bar */}
              {isProcessing && (
                <div className="p-4 bg-[#F4F8FD] border border-[#D8E1EC] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1528]">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1E6FD9]" />
                      Sedang memproses konversi berkas...
                    </span>
                    <span className="font-mono text-[#1E6FD9]">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E2EAF3] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1E6FD9] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Done & Download Result */}
              {isDone && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Konversi Berhasil!</p>
                      <p className="text-xs text-emerald-700 font-normal">
                        Berkas siap diunduh: <span className="font-mono font-semibold">{resultFileName}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadSimulatedFile}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas Hasil</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="pt-4 border-t border-[#EEF3F8] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#D8E1EC] text-xs font-bold text-[#5A6E82] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {tool.id !== 'qr-generator' && tool.id !== 'json-formatter' && tool.id !== 'base64-hash' && (
            <button
              disabled={fileList.length === 0 && !isDone}
              onClick={isDone ? handleDownloadSimulatedFile : handleStartProcess}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                fileList.length > 0 || isDone
                  ? 'bg-[#0B1528] hover:bg-[#1E6FD9] text-white active:scale-95'
                  : 'bg-[#E2EAF3] text-[#8CA9C9] cursor-not-allowed'
              }`}
            >
              {isDone ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mulai Konversi</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
