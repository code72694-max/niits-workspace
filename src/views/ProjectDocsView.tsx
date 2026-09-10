import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder as FolderIcon,
  FileText, 
  Search, 
  Plus, 
  UploadCloud, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Download, 
  ExternalLink, 
  Check, 
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  Share2,
  FileCode,
  File,
  X
} from 'lucide-react';
import { Room } from '../types';
import { ROOMS_MAP } from '../data/mockData';
import { SubtractedFolderCard, FolderItem } from '../components/SubtractedFolderCard';

interface ProjectDocsViewProps {
  currentRoomId: string;
  onNavigate: (page: string, params?: { room?: string }) => void;
}

// Default folder dataset with items matching user reference image: "Onboarding" (15 Files) & "Integrations" (5 Files)
const INITIAL_PROJECT_FOLDERS: Record<string, FolderItem[]> = {
  r3: [
    {
      id: 'f-onboarding',
      name: 'Onboarding',
      fileCount: 15,
      hasDocuments: true,
      badges: [{ type: 'drive' }, { type: 'notion' }],
      description: 'Panduan awal kontributor, setup Figma tokens, dan standard arsitektur Cyan',
      updatedAt: 'Kemarin',
      files: [
        { id: 'f1', name: 'NIITS-Design-System-Orientation.pdf', size: '2.4 MB', type: 'pdf', updated: 'Kemarin', author: 'Dina Ayu' },
        { id: 'f2', name: 'Contributor-Workflow-Guide.doc', size: '420 KB', type: 'doc', updated: '2 hari lalu', author: 'Bagas Pratama' },
        { id: 'f3', name: 'Dev-Environment-Quickstart.md', size: '48 KB', type: 'doc', updated: '4 hari lalu', author: 'Reza Fadhil' },
        { id: 'f4', name: 'Token-Mapping-Architecture.pdf', size: '1.8 MB', type: 'pdf', updated: '1 minggu lalu', author: 'Dina Ayu' },
        { id: 'f5', name: 'Git-Commit-Conventions.md', size: '18 KB', type: 'doc', updated: '2 minggu lalu', author: 'Fajar Nugraha' }
      ]
    },
    {
      id: 'f-integrations',
      name: 'Integrations',
      fileCount: 5,
      hasDocuments: false, // In user's reference: clean folder with NO documents inside
      badges: [{ type: 'notion' }, { type: 'sharepoint' }, { type: 'drive' }],
      description: 'Sinkronisasi token otomatis ke GitHub Packages, Figma Studio, dan SharePoint',
      updatedAt: '3 hari lalu',
      files: [
        { id: 'f6', name: 'Figma-Tokens-Studio-Sync.json', size: '128 KB', type: 'json', updated: '3 hari lalu', author: 'Bagas Pratama' },
        { id: 'f7', name: 'GitHub-Action-Token-Publisher.yml', size: '12 KB', type: 'code', updated: '5 hari lalu', author: 'Fajar Nugraha' },
        { id: 'f8', name: 'SharePoint-Asset-Mirror-Spec.pdf', size: '940 KB', type: 'pdf', updated: '1 minggu lalu', author: 'Sinta Larasati' },
        { id: 'f9', name: 'Notion-Documentation-Embeds.doc', size: '320 KB', type: 'doc', updated: '2 minggu lalu', author: 'Nadia Putri' },
        { id: 'f10', name: 'Slack-Webhook-Release-Alerts.json', size: '16 KB', type: 'json', updated: '3 minggu lalu', author: 'Fajar Nugraha' }
      ]
    },
    {
      id: 'f-drafts',
      name: 'Drafts & Proposals',
      fileCount: 0,
      hasDocuments: false, // Empty folder: NO documents inside
      badges: [{ type: 'notion' }],
      description: 'Folder arsip draft kosong (0 berkas) - menampilkan siluet folder polos',
      updatedAt: 'Baru dibuat',
      files: []
    },
    {
      id: 'f-tokens',
      name: 'Design Tokens & Primitives',
      fileCount: 24,
      hasDocuments: true,
      badges: [{ type: 'figma' }, { type: 'github' }, { type: 'notion' }],
      description: 'Spesifikasi warna cyan, skala tipografi, spacing, dan elevation shadow',
      updatedAt: 'Hari ini',
      files: [
        { id: 'f11', name: 'tokens-cyan-palette.json', size: '64 KB', type: 'json', updated: 'Hari ini', author: 'Dina Ayu' },
        { id: 'f12', name: 'typography-scale-modular.pdf', size: '1.6 MB', type: 'pdf', updated: 'Kemarin', author: 'Dina Ayu' },
        { id: 'f13', name: 'token-governance-specs.doc', size: '310 KB', type: 'doc', updated: '3 hari lalu', author: 'Bagas Pratama' }
      ]
    },
    {
      id: 'f-components',
      name: 'Component Library (React)',
      fileCount: 42,
      hasDocuments: true,
      badges: [{ type: 'figma' }, { type: 'github' }, { type: 'drive' }],
      description: 'Komponen UI produksi: SubtractedCard, Buttons, Dialog, Inputs, dan Badges',
      updatedAt: 'Hari ini',
      files: [
        { id: 'f14', name: 'SubtractedCard.spec.md', size: '36 KB', type: 'doc', updated: 'Hari ini', author: 'Bagas Pratama' },
        { id: 'f15', name: 'Buttons-Interactive-States.fig', size: '24.1 MB', type: 'figma', updated: 'Kemarin', author: 'Dina Ayu' },
        { id: 'f16', name: 'Modal-Dialog-Anatomy.pdf', size: '3.2 MB', type: 'pdf', updated: '4 hari lalu', author: 'Dina Ayu' }
      ]
    },
    {
      id: 'f-assets',
      name: 'Brand & Asset Guidelines',
      fileCount: 18,
      hasDocuments: true,
      badges: [{ type: 'drive' }, { type: 'figma' }, { type: 'pdf' }],
      description: 'Logo vector NIITS Studio, favicon, ilustrasi 3D, dan asset grafis',
      updatedAt: '5 hari lalu',
      files: [
        { id: 'f17a', name: 'NIITS-3D-App-Icon.png', size: '3.4 MB', type: 'image', updated: '3 hari lalu', author: 'Dina Ayu' },
        { id: 'f17', name: 'NIITS-Master-Logo-Kit.fig', size: '42.5 MB', type: 'figma', updated: '5 hari lalu', author: 'Dina Ayu' },
        { id: 'f18', name: 'Brand-Color-Standards.pdf', size: '4.8 MB', type: 'pdf', updated: '1 minggu lalu', author: 'Dina Ayu' }
      ]
    },
    {
      id: 'f-a11y',
      name: 'Accessibility & WCAG Specs',
      fileCount: 9,
      hasDocuments: true,
      badges: [{ type: 'notion' }, { type: 'pdf' }, { type: 'sharepoint' }],
      description: 'Audit kontras rasio warna cyan, standar navigasi keyboard, dan ARIA landmarks',
      updatedAt: '1 minggu lalu',
      files: [
        { id: 'f19', name: 'WCAG-2.1-AA-Audit-Report.pdf', size: '2.9 MB', type: 'pdf', updated: '1 minggu lalu', author: 'Sinta Larasati' },
        { id: 'f20', name: 'Keyboard-Focus-Management.md', size: '52 KB', type: 'doc', updated: '2 minggu lalu', author: 'Reza Fadhil' }
      ]
    }
  ]
};

export const ProjectDocsView: React.FC<ProjectDocsViewProps> = ({
  currentRoomId,
  onNavigate
}) => {
  const room = ROOMS_MAP[currentRoomId] || ROOMS_MAP['r3'] || {
    id: 'r3',
    kode: 'B-01',
    nama: 'Design System Cyan',
    warna: '#0F8E82',
    ringkas: 'Token, komponen, dokumentasi'
  };

  const [folders, setFolders] = useState<FolderItem[]>(
    INITIAL_PROJECT_FOLDERS[currentRoomId] || INITIAL_PROJECT_FOLDERS['r3']
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string>('f-onboarding');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [previewFile, setPreviewFile] = useState<any | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadExt, setUploadExt] = useState<'pdf' | 'doc' | 'md' | 'img' | 'fig' | 'json'>('pdf');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const selectedFolder = folders.find(f => f.id === selectedFolderId) || folders[0];

  const handleAddNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = uploadFileName.trim() || `Dokumen-Baru-${Date.now().toString().slice(-4)}`;
    const extSuffix = {
      pdf: '.pdf',
      doc: '.doc',
      md: '.md',
      img: '.png',
      fig: '.fig',
      json: '.json'
    }[uploadExt];

    const fullName = cleanName.toLowerCase().endsWith(extSuffix) ? cleanName : `${cleanName}${extSuffix}`;
    const typeMapping: Record<string, 'pdf' | 'doc' | 'image' | 'figma' | 'json'> = {
      pdf: 'pdf',
      doc: 'doc',
      md: 'doc',
      img: 'image',
      fig: 'figma',
      json: 'json'
    };

    const newFile = {
      id: `file-${Date.now()}`,
      name: fullName,
      size: '1.4 MB',
      type: typeMapping[uploadExt] || 'doc',
      updated: 'Baru saja',
      author: 'Anda'
    };

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === selectedFolder.id) {
          const nextFiles = [newFile, ...(f.files || [])];
          return {
            ...f,
            files: nextFiles,
            fileCount: nextFiles.length,
            hasDocuments: true
          };
        }
        return f;
      })
    );

    setUploadFileName('');
    setIsUploadModalOpen(false);
  };

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: FolderItem = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      fileCount: 0,
      badges: [{ type: 'drive' }, { type: 'notion' }],
      description: 'Folder baru ditambahkan ke proyek',
      updatedAt: 'Baru saja',
      files: []
    };

    setFolders([newFolder, ...folders]);
    setSelectedFolderId(newFolder.id);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleDeleteFile = (fileId: string) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === selectedFolder.id) {
          const nextFiles = (f.files || []).filter((file) => file.id !== fileId);
          return {
            ...f,
            files: nextFiles,
            fileCount: nextFiles.length,
            hasDocuments: nextFiles.length > 0 ? f.hasDocuments : false,
          };
        }
        return f;
      })
    );
  };

  const handleEmptyFolder = () => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === selectedFolder.id) {
          return {
            ...f,
            files: [],
            fileCount: 0,
            hasDocuments: false,
          };
        }
        return f;
      })
    );
  };

  const handleRefillSampleFiles = () => {
    const sampleFiles = [
      { id: `sf-${Date.now()}-1`, name: `${selectedFolder.name}-Orientation-Guide.pdf`, size: '2.4 MB', type: 'pdf' as const, updated: 'Baru saja', author: 'Dina Ayu' },
      { id: `sf-${Date.now()}-2`, name: `${selectedFolder.name}-Components-Master.fig`, size: '14.8 MB', type: 'figma' as const, updated: 'Baru saja', author: 'Bagas Pratama' },
      { id: `sf-${Date.now()}-3`, name: `${selectedFolder.name}-Release-Notes.md`, size: '36 KB', type: 'doc' as const, updated: 'Baru saja', author: 'Reza Fadhil' },
    ];

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === selectedFolder.id) {
          return {
            ...f,
            files: sampleFiles,
            fileCount: sampleFiles.length,
            hasDocuments: true,
          };
        }
        return f;
      })
    );
  };

  const handleToggleFolderDocuments = () => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === selectedFolder.id) {
          const currentVisible = f.fileCount > 0 && f.hasDocuments !== false;
          return {
            ...f,
            hasDocuments: !currentVisible,
          };
        }
        return f;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Cari folder atau dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6FD9]/15 focus:border-[#1E6FD9] transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="text-xs text-[#64748B] hidden sm:inline-block mr-1">
            Total <strong className="text-[#0F172A]">{folders.length} Folders</strong> &bull; <strong className="text-[#0F172A]">{folders.reduce((acc, f) => acc + f.fileCount, 0)} Files</strong>
          </span>
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white text-[#0F172A] hover:bg-slate-50 border border-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Folder Baru</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-3d-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-2xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-white" />
            <span>Upload Dokumen</span>
          </button>
        </div>
      </div>

      {/* Modal / Inline Create Folder */}
      <AnimatePresence>
        {isCreatingFolder && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCreateFolder}
            className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex items-center gap-3"
          >
            <FolderIcon className="w-5 h-5 text-[#1E6FD9]" />
            <input
              type="text"
              autoFocus
              placeholder="Nama folder baru (misal: UX Research, Release Notes)..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 text-xs text-[#0F172A] border-b border-[#CBD5E1] pb-1 focus:outline-none focus:border-[#1E6FD9]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#1557B0]"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
            >
              Batal
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FOLDERS SECTION - Identical to User's Uploaded Reference Image */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
              Folders
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
              Subtracted Tab Cutout
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Klik salah satu folder untuk melihat berkas di dalamnya
          </p>
        </div>

        {/* Folders Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFolders.map((folder) => {
            const isSelected = folder.id === selectedFolderId;
            return (
              <SubtractedFolderCard
                key={folder.id}
                folder={folder}
                isSelected={isSelected}
                onClick={() => setSelectedFolderId(folder.id)}
              />
            );
          })}
        </div>
      </div>

      {/* ACTIVE FOLDER FILE EXPLORER SECTION */}
      {selectedFolder && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E2EAF3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Active Folder Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shrink-0">
                <FolderIcon className="w-6 h-6 text-[#1E6FD9]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-[#0F172A]">
                    {selectedFolder.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B]">
                    {selectedFolder.fileCount} Berkas
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {selectedFolder.description} &bull; Diperbarui {selectedFolder.updatedAt}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Toggle document appearance or empty folder */}
              {selectedFolder.fileCount > 0 ? (
                <>
                  <button
                    onClick={handleToggleFolderDocuments}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      selectedFolder.hasDocuments !== false
                        ? 'bg-[#F4F8FD] text-[#1E6FD9] border-[#D7E6F5] hover:bg-[#E7F0FA]'
                        : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1] hover:bg-[#E2E8F0]'
                    }`}
                    title="Beralih antara menampilkan atau menyembunyikan lembaran dokumen pada siluet folder"
                  >
                    {selectedFolder.hasDocuments !== false ? 'Sembunyikan Kertas' : 'Tampilkan Kertas'}
                  </button>
                  <button
                    onClick={handleEmptyFolder}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors"
                    title="Kosongkan semua berkas untuk melihat tampilan folder kosong"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan Folder</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleRefillSampleFiles}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F8FD] text-[#1E6FD9] hover:bg-[#E7F0FA] border border-[#D7E6F5] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Isi Berkas Contoh</span>
                </button>
              )}

              {/* Grid / List Switch */}
              <div className="flex items-center p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'grid' ? 'bg-white shadow-xs text-[#1E6FD9]' : 'text-[#64748B]'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'list' ? 'bg-white shadow-xs text-[#1E6FD9]' : 'text-[#64748B]'
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Berkas</span>
              </button>
            </div>
          </div>

          {/* Files Listing */}
          {selectedFolder.files && selectedFolder.files.length > 0 ? (
            viewLayout === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedFolder.files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    className="group p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1E6FD9] hover:bg-white hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-xs font-bold shadow-2xs">
                        {file.type === 'pdf' && <span className="text-[#DC2626]">PDF</span>}
                        {file.type === 'figma' && <span className="text-[#A259FF]">FIG</span>}
                        {file.type === 'doc' && <span className="text-[#1E6FD9]">DOC</span>}
                        {file.type === 'json' && <span className="text-[#D97706]">JSON</span>}
                        {file.type === 'code' && <span className="text-[#059669]">CODE</span>}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewFile(file);
                          }}
                          className="p-1 rounded-lg hover:bg-[#E2E8F0] text-[#64748B]"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1 rounded-lg hover:bg-[#E2E8F0] text-[#64748B]"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          className="p-1 rounded-lg hover:bg-[#FEE2E2] text-[#DC2626]"
                          title="Hapus Berkas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-xs font-bold text-[#0F172A] group-hover:text-[#1E6FD9] transition-colors truncate">
                        {file.name}
                      </h5>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1.5">
                        <span>{file.size}</span>
                        <span>{file.author} &bull; {file.updated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden">
                {selectedFolder.files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    className="p-3.5 px-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {file.type.toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-[#0F172A] truncate">
                        {file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#64748B] shrink-0">
                      <span>{file.size}</span>
                      <span className="hidden sm:inline">{file.author}</span>
                      <span>{file.updated}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewFile(file);
                          }}
                          className="p-1 rounded-lg hover:bg-[#E2E8F0] text-[#64748B]"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          className="p-1 rounded-lg hover:bg-[#FEE2E2] text-[#DC2626]"
                          title="Hapus Berkas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="py-12 px-6 text-center rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] space-y-3">
              <FolderIcon className="w-12 h-12 text-[#94A3B8] mx-auto opacity-70" />
              <div>
                <h5 className="text-sm font-bold text-[#0F172A]">
                  Folder Ini Kosong (0 Berkas)
                </h5>
                <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
                  Siluet kartu folder di atas tampil polos tanpa dokumen mengintip di dalamnya (efek hollow / empty folder seperti referensi).
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleRefillSampleFiles}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#1859B0] shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Isi Berkas Contoh</span>
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] shadow-2xs"
                >
                  Unggah Berkas Baru
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E2EAF3] rounded-3xl max-w-xl w-full p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center font-bold text-xs">
                    {previewFile.type.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] truncate max-w-sm">
                      {previewFile.name}
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      {previewFile.size} &bull; Diunggah oleh {previewFile.author} ({previewFile.updated})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Document Mock Viewer */}
              <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-3">
                <FileText className="w-12 h-12 text-[#1E6FD9] mx-auto opacity-75" />
                <div>
                  <h5 className="text-xs font-bold text-[#0F172A]">Pratinjau Dokumen Proyek</h5>
                  <p className="text-[11.5px] text-[#64748B] mt-1 max-w-md mx-auto">
                    Berkas ini tersinkronisasi secara langsung dengan repository NIITS Studio dan Figma Workspace tim B-01 Design System Cyan.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                >
                  Tutup
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#1557B0]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Berkas</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload File Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E2EAF3] rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Upload Berkas ke {selectedFolder?.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Label ekstensi pada kertas folder akan menyesuaikan berkas ini (maks 3 tipe)
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewFile} className="space-y-4">
                {/* File Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    Nama Berkas
                  </label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="Contoh: Desain-Katalog-Produk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6FD9]/20 focus:border-[#1E6FD9]"
                  />
                </div>

                {/* File Extension Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    Pilih Ekstensi / Jenis Berkas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'pdf', label: 'PDF (.pdf)', color: 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]' },
                      { key: 'doc', label: 'DOC (.doc)', color: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]' },
                      { key: 'md', label: 'MD (.md)', color: 'border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]' },
                      { key: 'img', label: 'IMG (.png)', color: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]' },
                      { key: 'fig', label: 'FIG (.fig)', color: 'border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]' },
                      { key: 'json', label: 'JSON (.json)', color: 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setUploadExt(item.key as any)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          uploadExt === item.key
                            ? `${item.color} ring-2 ring-offset-1 ring-[#1E6FD9]/40 shadow-xs`
                            : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div 
                  onClick={() => {
                    if (!uploadFileName) {
                      setUploadFileName(`Berkas-Lampiran-${uploadExt.toUpperCase()}`);
                    }
                  }}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] text-center space-y-1 cursor-pointer hover:border-[#1E6FD9] transition-colors"
                >
                  <UploadCloud className="w-6 h-6 text-[#1E6FD9] mx-auto" />
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Klik area ini untuk simulasi pilih berkas
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Ekstensi terpilih: <span className="font-bold text-[#0F172A]">.{uploadExt === 'img' ? 'png' : uploadExt}</span>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#1557B0] shadow-xs"
                  >
                    Tambahkan Berkas
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
