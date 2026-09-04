import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, Sparkles, Upload, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Room } from '../types';
import { CoverConfig } from './ProjectFolderCard';

export const PRESET_GRADIENTS: Array<{ id: string; name: string; value: string }> = [
  // Monochrome Gradients
  {
    id: 'mono-light-slate',
    name: 'Clean Silver (Monochrome)',
    value: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #94A3B8 100%)'
  },
  {
    id: 'mono-charcoal',
    name: 'Charcoal Slate (Monochrome)',
    value: 'linear-gradient(135deg, #64748B 0%, #334155 50%, #1E293B 100%)'
  },
  {
    id: 'mono-obsidian',
    name: 'Obsidian Black (Monochrome)',
    value: 'linear-gradient(135deg, #334155 0%, #1E293B 50%, #0F172A 100%)'
  },
  {
    id: 'mono-pure-silver',
    name: 'Silver Mist (Monochrome)',
    value: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)'
  },
  // Blue Gradients aligned with NIITS theme
  {
    id: 'blue-sky-indigo',
    name: 'Sky to Indigo (Tema Biru)',
    value: 'linear-gradient(135deg, #38BDF8 0%, #1E6FD9 50%, #1D4ED8 100%)'
  },
  {
    id: 'blue-deep-navy',
    name: 'Deep Navy (Tema Biru)',
    value: 'linear-gradient(135deg, #1E6FD9 0%, #0A2540 100%)'
  },
  {
    id: 'blue-ocean-cyan',
    name: 'Ocean Cyan (Tema Biru)',
    value: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 50%, #0369A1 100%)'
  },
  {
    id: 'blue-midnight-slate',
    name: 'Midnight Blue (Tema Biru)',
    value: 'linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)'
  }
];

export const PRESET_PHOTOS: Array<{ id: string; name: string; value: string }> = [
  {
    id: 'photo-blue-fluid',
    name: 'Blue Wave Minimal',
    value: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-monochrome-geometry',
    name: 'Monochrome Architecture',
    value: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-dark-tech',
    name: 'Dark Minimal Tech',
    value: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-blue-glass',
    name: 'Glass Blue Prism',
    value: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-workspace-mono',
    name: 'Monochrome Desk',
    value: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-blue-abstract',
    name: 'Navy Abstract Gradient',
    value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  }
];

interface ProjectCoverModalProps {
  room: Room;
  currentCover: CoverConfig;
  onSave: (cover: CoverConfig) => void;
  onClose: () => void;
}

export const ProjectCoverModal: React.FC<ProjectCoverModalProps> = ({
  room,
  currentCover,
  onSave,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'gradient' | 'photo' | 'custom'>('gradient');
  const [selectedCover, setSelectedCover] = useState<CoverConfig>(currentCover);
  const [customUrl, setCustomUrl] = useState('');
  const [customError, setCustomError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCustomError('Berkas harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      setCustomError('Ukuran gambar maksimal 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedCover({
          type: 'image',
          value: reader.result,
          name: file.name
        });
        setCustomError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    try {
      new URL(customUrl);
      setSelectedCover({
        type: 'image',
        value: customUrl.trim(),
        name: 'Custom URL'
      });
      setCustomError('');
    } catch {
      setCustomError('Format tautan URL tidak valid. Masukkan tautan gambar yang lengkap.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
              Ganti Cover: {room.nama}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Pilih warna gradasi atau foto latar belakang untuk kartu proyek folder ini.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="px-6 pt-4 pb-2">
          <div className="text-[11px] font-semibold text-[#64748B] mb-1.5 uppercase tracking-wider">
            Pratinjau Cover
          </div>
          <div className="h-20 w-full rounded-2xl overflow-hidden border border-[#E2E8F0] relative">
            {selectedCover.type === 'gradient' ? (
              <div 
                className="w-full h-full"
                style={{ background: selectedCover.value }}
              />
            ) : (
              <img 
                src={selectedCover.value} 
                alt="Preview" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            )}
            <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium">
              {selectedCover.name || (selectedCover.type === 'gradient' ? 'Gradasi Aktif' : 'Foto Aktif')}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3">
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('gradient')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'gradient'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Gradasi Warna</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'photo'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Foto HD Pilihan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Upload / URL</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-64 overflow-y-auto">
          {/* Tab 1: Gradients */}
          {activeTab === 'gradient' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_GRADIENTS.map((g) => {
                const isSelected = selectedCover.type === 'gradient' && selectedCover.value === g.value;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedCover({ type: 'gradient', value: g.value, name: g.name })}
                    className={`h-16 rounded-xl relative overflow-hidden border-2 transition-all p-1 text-left flex flex-col justify-end cursor-pointer ${
                      isSelected ? 'border-[#0F172A] scale-[1.02]' : 'border-transparent hover:border-[#CBD5E1]'
                    }`}
                    style={{ background: g.value }}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-white drop-shadow-md truncate px-1 bg-black/30 rounded backdrop-blur-2xs">
                      {g.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Photos */}
          {activeTab === 'photo' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_PHOTOS.map((p) => {
                const isSelected = selectedCover.type === 'image' && selectedCover.value === p.value;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedCover({ type: 'image', value: p.value, name: p.name })}
                    className={`h-16 rounded-xl relative overflow-hidden border-2 transition-all p-1 text-left flex flex-col justify-end cursor-pointer ${
                      isSelected ? 'border-[#0F172A] scale-[1.02]' : 'border-transparent hover:border-[#CBD5E1]'
                    }`}
                  >
                    <img 
                      src={p.value} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center z-10">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-md truncate px-1 bg-black/50 rounded backdrop-blur-2xs">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Custom Upload & URL */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Unggah dari Komputer
                </label>
                <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#3B82F6] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#F8FAFC]">
                  <Upload className="w-6 h-6 text-[#3B82F6] mb-1" />
                  <span className="text-xs font-semibold text-[#0F172A]">Klik untuk pilih gambar</span>
                  <span className="text-[10px] text-[#64748B] mt-0.5">Mendukung JPG, PNG, WebP (maks. 4MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Atau Tempel Tautan URL Gambar
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-semibold text-[#0F172A] transition-colors cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

              {customError && (
                <div className="text-[11px] text-[#EF4444] font-medium">
                  {customError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(selectedCover);
              onClose();
            }}
            className="px-5 py-2 rounded-full text-xs font-bold bg-[#0F172A] hover:bg-[#1E6FD9] text-white transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Simpan Cover
          </button>
        </div>
      </div>
    </div>
  );
};
