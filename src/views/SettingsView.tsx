import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Users, 
  Bell, 
  ShieldCheck, 
  Download, 
  Check, 
  Save 
} from 'lucide-react';
import { USERS_MAP, ROLE_KEYS, ROLES_CONFIG } from '../data/mockData';

export const SettingsView: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('NIITS Studio');
  const [timezone, setTimezone] = useState('Asia/Jakarta (WIB)');
  const [notifications, setNotifications] = useState({
    emailHandoff: true,
    dueAlerts: true,
    chatMentions: true,
    soundEffects: false
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportData = () => {
    alert("Cadangan workspace JSON siap diunduh. Data mencakup seluruh tugas, room, artikel, dan pengaturan.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0A2540]">
          Pengaturan Workspace
        </h2>
        <p className="text-xs text-[#5B7288] mt-0.5">
          Kelola identitas tim, preferensi sistem, peran, dan isolasi keamanan.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Identity */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">
            <Building className="w-4 h-4 text-[#1E6FD9]" />
            <span>Identitas Organisasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0A2540] mb-1">
                Nama Workspace
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2EAF3] focus:outline-none focus:border-[#1E6FD9]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0A2540] mb-1">
                Zona Waktu Standar
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2EAF3] focus:outline-none focus:border-[#1E6FD9]"
              >
                <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB, UTC+7)</option>
                <option value="Asia/Makassar (WITA)">Asia/Makassar (WITA, UTC+8)</option>
                <option value="Asia/Jayapura (WIT)">Asia/Jayapura (WIT, UTC+9)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">
            <Bell className="w-4 h-4 text-[#1E6FD9]" />
            <span>Notifikasi & Pemberitahuan</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2EAF3] cursor-pointer hover:bg-[#F4F8FD]">
              <div>
                <span className="font-semibold text-[#0A2540] block">Serahan Tugas Masuk (Handoff)</span>
                <span className="text-[#5B7288] text-[11px]">Beri tahu saat peran hulu menyerahkan tugas ke peran Anda</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailHandoff}
                onChange={(e) => setNotifications({ ...notifications, emailHandoff: e.target.checked })}
                className="w-4 h-4 rounded text-[#1E6FD9]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2EAF3] cursor-pointer hover:bg-[#F4F8FD]">
              <div>
                <span className="font-semibold text-[#0A2540] block">Peringatan Tenggat Waktu</span>
                <span className="text-[#5B7288] text-[11px]">Kirim alarm jika tugas tersisa 24 jam sebelum due date</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.dueAlerts}
                onChange={(e) => setNotifications({ ...notifications, dueAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-[#1E6FD9]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2EAF3] cursor-pointer hover:bg-[#F4F8FD]">
              <div>
                <span className="font-semibold text-[#0A2540] block">Penyebutan (@Mention) di Chat</span>
                <span className="text-[#5B7288] text-[11px]">Dapatkan alert instan saat nama Anda disebut dalam diskusi</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.chatMentions}
                onChange={(e) => setNotifications({ ...notifications, chatMentions: e.target.checked })}
                className="w-4 h-4 rounded text-[#1E6FD9]"
              />
            </label>
          </div>
        </div>

        {/* Security & Multi-tenancy Isolation */}
        <div className="bg-white border border-[#E2EAF3] rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">
            <ShieldCheck className="w-4 h-4 text-[#0F8E82]" />
            <span>Keamanan & Isolasi Data (IDOR Prevention)</span>
          </div>
          <p className="text-xs text-[#5B7288] leading-relaxed">
            Semua dokumen, tugas, dan percakapan diisolasi secara permanen dengan header <code>workspace_id = &apos;ws-niits-studio&apos;</code>.
            Akses antar workspace divalidasi pada lapisan middleware dan Row Level Security (RLS).
          </p>
        </div>

        {/* Save & Export buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E2EAF3] text-[#3C5A78] hover:bg-[#F4F8FD]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Cadangan JSON</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold bg-[#1E6FD9] text-white hover:bg-[#12459C] transition-all shadow-xs"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Berhasil Disimpan!' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
