import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, RotateCcw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

interface TrashItem {
  id: string;
  nama: string;
  tipe: 'tugas' | 'artikel' | 'dokumen';
  peran: string;
  dihapusPada: string;
}

const INITIAL_TRASH: TrashItem[] = [
  { id: 'T-108', nama: 'Spesifikasi Desain Flow Checkout V1 (Deprecated)', tipe: 'dokumen', peran: 'UX', dihapusPada: 'Kemarin, 14:20' },
  { id: 'T-094', nama: 'Eksperimen migrasi MongoDB ke CockroachDB', tipe: 'artikel', peran: 'DevOps', dihapusPada: '2 hari lalu' },
  { id: 'AGRO-09', nama: 'Refactor tombol legacy ke Web Components', tipe: 'tugas', peran: 'FE', dihapusPada: '3 hari lalu' }
];

export const TrashView: React.FC = () => {
  const [trashItems, setTrashItems] = useState<TrashItem[]>(INITIAL_TRASH);

  const handleRestore = (id: string) => {
    const item = trashItems.find(t => t.id === id);
    setTrashItems(trashItems.filter(t => t.id !== id));
    alert(`"${item?.nama}" berhasil dipulihkan ke daftar aktif.`);
  };

  const handleEmptyTrash = () => {
    if (confirm("Kosongkan semua item di tempat sampah? Tindakan ini permanen.")) {
      setTrashItems([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0A2540]">
            Tempat Sampah
          </h2>
          <p className="text-xs text-[#5B7288] mt-0.5">
            Item yang dihapus akan disimpan selama 30 hari sebelum dimusnahkan permanen.
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#C4562B] text-white hover:bg-[#A3431D] transition-colors shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Tempat Sampah</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-[#E2EAF3] rounded-2xl shadow-sm overflow-hidden">
        {trashItems.length > 0 ? (
          <div className="divide-y divide-[#EFF4F9]">
            {trashItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#F4F8FD] transition-colors text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3] flex items-center justify-center text-[#5B7288] shrink-0">
                    <Trash2 className="w-4 h-4 text-[#C4562B]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#5B7288]">{item.id}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-[#E7F0FA] text-[#1E6FD9] uppercase">
                        {item.tipe} &bull; {item.peran}
                      </span>
                    </div>
                    <h4 className="font-semibold text-[#0A2540] truncate mt-0.5">
                      {item.nama}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[11px] text-[#5B7288]">
                    Dihapus {item.dihapusPada}
                  </span>
                  <button
                    onClick={() => handleRestore(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#1E6FD9] text-[#1E6FD9] hover:bg-[#F4F8FD] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pulihkan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Tempat sampah kosong"
            description="Tidak ada berkas, tugas, atau artikel yang sedang dihapus. Workspace Anda bersih dan rapi."
          />
        )}
      </div>
    </div>
  );
};
