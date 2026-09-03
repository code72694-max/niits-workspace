import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Hash, 
  ChevronRight, 
  X, 
  Users, 
  Sparkles 
} from 'lucide-react';

interface FloatingChatWidgetProps {
  onSelectChat: () => void;
  onSelectSaluran: () => void;
  unreadChatCount?: number;
  unreadChannelCount?: number;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  onSelectChat,
  onSelectSaluran,
  unreadChatCount = 3,
  unreadChannelCount = 9,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const totalUnread = (unreadChatCount || 0) + (unreadChannelCount || 0);

  const handleOpenChat = () => {
    setIsOpen(false);
    onSelectChat();
  };

  const handleOpenSaluran = () => {
    setIsOpen(false);
    onSelectSaluran();
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Upward Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="mb-3.5 w-76 sm:w-84 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-3.5 space-y-2.5 origin-bottom-right"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-1 pb-1 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0A2540]">Komunikasi & Diskusi</span>
                <span className="text-[10px] font-semibold text-[#1E6FD9] bg-[#EAF2FD] px-2 py-0.5 rounded-full">
                  NIITS Sync
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A2540] hover:bg-[#F8FAFC] transition-colors"
                aria-label="Tutup menu chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu 1: Chat (Pesan Pribadi) - Rounded Rectangle */}
            <button
              onClick={handleOpenChat}
              className="w-full text-left p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1E6FD9] hover:bg-[#F8FAFC] transition-all flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FD] text-[#1E6FD9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0A2540] group-hover:text-[#1E6FD9] transition-colors">
                      Chat Pribadi
                    </span>
                    {unreadChatCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#1E6FD9] text-white">
                        {unreadChatCount} baru
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    Pesan langsung & kontak anggota tim
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E6FD9] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Menu 2: Saluran (Channels) - Rounded Rectangle */}
            <button
              onClick={handleOpenSaluran}
              className="w-full text-left p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1E6FD9] hover:bg-[#F8FAFC] transition-all flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Hash className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0A2540] group-hover:text-[#1E6FD9] transition-colors">
                      Saluran Tim
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    Diskusi room, sprint & pengumuman
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E6FD9] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Chat dan Saluran"
        className={`
          w-14 h-14 rounded-full bg-[#1E6FD9] text-white flex items-center justify-center
          shadow-lg shadow-[#1E6FD9]/30 hover:bg-[#1656A8] active:scale-95 transition-all duration-200 cursor-pointer
          border border-white/20 relative
          ${isOpen ? 'ring-4 ring-[#1E6FD9]/20' : ''}
        `}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge on button */}
        {!isOpen && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#E5484D] text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
            {totalUnread}
          </span>
        )}
      </button>
    </div>
  );
};
