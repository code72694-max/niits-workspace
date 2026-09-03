import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, 
  AtSign, 
  ArrowRightLeft, 
  MessageSquare, 
  Bell, 
  CheckCheck, 
  Check, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  ArrowLeft, 
  ExternalLink, 
  Filter, 
  Clock, 
  User as UserIcon, 
  Tag, 
  ChevronRight, 
  Sparkles,
  CircleDot,
  FileText
} from 'lucide-react';
import { Task, Room, RoleKey } from '../types';
import { 
  USERS_MAP, 
  CURRENT_USER, 
  ROLES_CONFIG, 
  INITIAL_TASKS, 
  INITIAL_ROOMS 
} from '../data/mockData';

export type InboxCategory = 'semua' | 'mention' | 'serahan' | 'review' | 'chat';

export interface InboxThreadMessage {
  id: string;
  user: string | null;
  waktu: string;
  isi: string;
  isCurrentUser?: boolean;
  lampiran?: string;
  tugasId?: string;
}

export interface InboxItem {
  id: string;
  type: 'mention' | 'serahan' | 'review' | 'chat' | 'pemberitahuan';
  title: string;
  subtitle: string;
  user: string;
  waktu: string;
  baru: boolean;
  roomId?: string;
  taskId?: string;
  snippet: string;
  messages: InboxThreadMessage[];
}

interface InboxViewProps {
  tasks: Task[];
  rooms: Room[];
  onOpenTask: (task: Task) => void;
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

// Initial rich seed items for notifications, mentions, handoffs, reviews, and chat
const SEED_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'inbox-1',
    type: 'mention',
    title: 'Bagas Pratama menyebut kamu',
    subtitle: 'di T-241: Perbaiki race condition saat checkout',
    user: 'u1',
    waktu: '34 menit lalu',
    baru: true,
    roomId: 'r1',
    taskId: 'T-241',
    snippet: 'Tambahin test konkurensi ya, 50 request paralel. Kalau lolos baru boleh merge.',
    messages: [
      {
        id: 'msg-1',
        user: 'u4',
        waktu: '2 jam lalu',
        isi: 'Aku reproduksi di staging: 2 request paralel, dua-duanya lolos checkout padahal stok tinggal 1. Lock di service level tidak cukup kuat.'
      },
      {
        id: 'msg-2',
        user: 'u3',
        waktu: '1 jam lalu',
        isi: 'Setuju. Aku pakai query SELECT ... FOR UPDATE di dalam transaksi stok, plus CHECK constraint stok >= 0 sebagai jaring pengaman terakhir.'
      },
      {
        id: 'msg-3',
        user: 'u1',
        waktu: '34 menit lalu',
        isi: 'Tambahin test konkurensi ya, 50 request paralel. Kalau lolos tanpa oversell baru boleh merge ke main. cc @Haris Kurniawan @Sinta Larasati tolong kawal.',
        tugasId: 'T-241'
      }
    ]
  },
  {
    id: 'inbox-2',
    type: 'serahan',
    title: 'Dewi Sartika menyerahkan tugas',
    subtitle: 'ke Frontend: T-233 Redesign detail produk',
    user: 'u2',
    waktu: '2 jam lalu',
    baru: true,
    roomId: 'r1',
    taskId: 'T-233',
    snippet: 'Aku serahkan ke Frontend ya, spesifikasi Figma rev 3 dan DoD UI/UX sudah lengkap.',
    messages: [
      {
        id: 'msg-20',
        user: 'u2',
        waktu: '09:12',
        isi: 'Pagi tim Frontend! Wireframe detail produk mobile rev 3 sudah selesai di Figma. Hierarki harga diskon & tombol Beli Sekarang sudah disesuaikan.'
      },
      {
        id: 'msg-21',
        user: 'u2',
        waktu: '09:15',
        isi: 'Tugas T-233 resmi aku serahkan ke ruang Frontend ya. DoD UI/UX sudah centang semua.',
        tugasId: 'T-233'
      },
      {
        id: 'msg-22',
        user: 'u5',
        waktu: '09:20',
        isi: 'Siap mbak Dewi! Pertanyaan cepat: sticky CTA tombol Beli itu nempel di atas floating tab bar atau menutup tab bar?'
      },
      {
        id: 'msg-23',
        user: 'u2',
        waktu: '09:24',
        isi: 'Nempel berjarak 8px di atas tab bar ya, tab bar jangan sampai tertutup navigasinya.'
      }
    ]
  },
  {
    id: 'inbox-3',
    type: 'review',
    title: 'Sinta Larasati meminta review QA',
    subtitle: 'di T-236: Audit IDOR di endpoint /orders/:id',
    user: 'u4',
    waktu: '4 jam lalu',
    baru: true,
    roomId: 'r2',
    taskId: 'T-236',
    snippet: 'Yang IDOR paling kritis, order milik user lain kebaca kalau ID ditebak. Mohon dicek!',
    messages: [
      {
        id: 'msg-30',
        user: 'u4',
        waktu: '10:48',
        isi: 'Heads up untuk tim Backend & Tech Lead: dari 24 kasus uji checkout, 2 GAGAL dan dua-duanya menyangkut otorisasi access control.'
      },
      {
        id: 'msg-31',
        user: 'u4',
        waktu: '10:50',
        isi: 'Khususnya T-236: endpoint GET /orders/:id tidak memvalidasi apakah order.userId === session.userId. Siapapun yang punya token bisa baca invoice orang lain.',
        tugasId: 'T-236'
      },
      {
        id: 'msg-32',
        user: 'u1',
        waktu: '11:00',
        isi: 'Temuan valid dan kritis. Prioritas dinaikkan ke Urgent, langsung kami tangani sebelum rilis beta.'
      }
    ]
  },
  {
    id: 'inbox-4',
    type: 'chat',
    title: 'Reza Fadhil (Backend)',
    subtitle: 'Direct Message & Diskusi Database',
    user: 'u3',
    waktu: '15:44',
    baru: true,
    roomId: 'r1',
    taskId: 'T-241',
    snippet: 'Lock-nya sudah aku push ke staging, test 50 request paralel lolos tanpa selisih stok.',
    messages: [
      {
        id: 'msg-40',
        user: 'u3',
        waktu: '14:02',
        isi: 'Har, soal race condition itu. Aku coba pakai SELECT ... FOR UPDATE di level row database alih-alih memory lock di Node.js.'
      },
      {
        id: 'msg-41',
        user: 'u1',
        waktu: '14:15',
        isi: 'Bagus. Pastikan lock-nya di baris tabel `inventaris_produk`, bukan tabel `transaksi`. Kalau salah baris, race condition tetap bisa jebol.',
        isCurrentUser: true
      },
      {
        id: 'msg-42',
        user: 'u3',
        waktu: '15:44',
        isi: 'Sip, sudah pas di tabel stok. Test 50 concurrency request lolos tanpa oversell. Tinggal tunggu approval kamu.'
      }
    ]
  },
  {
    id: 'inbox-5',
    type: 'chat',
    title: 'Dewi Sartika (UI/UX)',
    subtitle: 'Direct Message Desain Poppins',
    user: 'u2',
    waktu: 'Kemarin',
    baru: false,
    roomId: 'r3',
    snippet: 'Token warna dan tipografi rev 3 sudah aku perbarui di room Design System.',
    messages: [
      {
        id: 'msg-50',
        user: 'u2',
        waktu: 'Kemarin 11:40',
        isi: 'Halo mas Haris! Token tipografi Poppins v2 dan komponen button sudah aku taruh di dokumentasi ya.'
      },
      {
        id: 'msg-51',
        user: 'u1',
        waktu: 'Kemarin 11:58',
        isi: 'Keren mbak Dewi, nanti akan langsung diselaraskan oleh tim Frontend ke Tailwind config.',
        isCurrentUser: true
      }
    ]
  },
  {
    id: 'inbox-6',
    type: 'pemberitahuan',
    title: 'Peringatan Jatuh Tempo Sprint',
    subtitle: 'T-238: Rate limit endpoint /auth/login',
    user: 'u4',
    waktu: 'Hari ini 08:00',
    baru: false,
    roomId: 'r1',
    taskId: 'T-238',
    snippet: 'Tugas T-238 jatuh tempo hari ini. Status saat ini: Review QA.',
    messages: [
      {
        id: 'msg-60',
        user: null,
        waktu: '08:00',
        isi: 'Pemberitahuan Sistem Otomatis: Tugas T-238 Rate limit endpoint /auth/login memiliki tanggal jatuh tempo hari ini.'
      },
      {
        id: 'msg-61',
        user: 'u4',
        waktu: '12:10',
        isi: 'Implementasi Redis sliding window sudah dicek, respon HTTP 429 Too Many Requests dan header Retry-After sudah sesuai standar RFC.'
      }
    ]
  },
  {
    id: 'inbox-7',
    type: 'serahan',
    title: 'Fajar Nugraha (DevOps)',
    subtitle: 'Dokumen SOP Pengadaan Stok Gudang v2',
    user: 'u6',
    waktu: 'Kemarin',
    baru: false,
    roomId: 'r1',
    snippet: 'SOP alur pengadaan stok gudang diperbarui dengan mekanisme penolakan parsial.',
    messages: [
      {
        id: 'msg-70',
        user: 'u6',
        waktu: 'Kemarin 08:31',
        isi: 'Tim gudang minta penambahan cabang penolakan barang parsial di SOP pengadaan. Sudah aku dokumentasikan di wiki project.'
      }
    ]
  }
];

export const InboxView: React.FC<InboxViewProps> = ({
  tasks,
  rooms,
  onOpenTask,
  onNavigate,
  onShowToast
}) => {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(SEED_INBOX_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string>('inbox-1');
  const [activeCategory, setActiveCategory] = useState<InboxCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active selected item
  const activeItem = useMemo(() => {
    return inboxItems.find(item => item.id === selectedItemId) || inboxItems[0];
  }, [inboxItems, selectedItemId]);

  // Associated Task if exists
  const activeTask = useMemo(() => {
    if (!activeItem?.taskId) return null;
    return tasks.find(t => t.id === activeItem.taskId) || INITIAL_TASKS.find(t => t.id === activeItem.taskId) || null;
  }, [activeItem, tasks]);

  // Associated Room if exists
  const activeRoom = useMemo(() => {
    if (!activeItem?.roomId) return null;
    return rooms.find(r => r.id === activeItem.roomId) || null;
  }, [activeItem, rooms]);

  // Filtered list on the left
  const filteredItems = useMemo(() => {
    return inboxItems.filter(item => {
      if (onlyUnread && !item.baru) return false;

      if (activeCategory === 'mention' && item.type !== 'mention') return false;
      if (activeCategory === 'serahan' && item.type !== 'serahan') return false;
      if (activeCategory === 'review' && item.type !== 'review') return false;
      if (activeCategory === 'chat' && item.type !== 'chat') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = item.subtitle.toLowerCase().includes(q);
        const matchSnippet = item.snippet.toLowerCase().includes(q);
        const matchTask = item.taskId ? item.taskId.toLowerCase().includes(q) : false;
        const sender = USERS_MAP[item.user];
        const matchUser = sender ? sender.nama.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchSub && !matchSnippet && !matchTask && !matchUser) return false;
      }

      return true;
    });
  }, [inboxItems, onlyUnread, activeCategory, searchQuery]);

  // Scroll to bottom when messages update or active item changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeItem?.messages]);

  // Handle Mark as Read
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInboxItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, baru: !item.baru };
      }
      return item;
    }));
  };

  const handleMarkAllRead = () => {
    setInboxItems(prev => prev.map(item => ({ ...item, baru: false })));
    if (onShowToast) {
      onShowToast('Semua notifikasi dan pesan telah ditandai dibaca.');
    }
  };

  // Handle Select Item
  const handleSelectItem = (item: InboxItem) => {
    setSelectedItemId(item.id);
    setIsMobileDetailOpen(true);
    // Automatically mark read on click
    if (item.baru) {
      setInboxItems(prev => prev.map(i => i.id === item.id ? { ...i, baru: false } : i));
    }
  };

  // Send reply in WhatsApp-style chat
  const handleSendReply = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || !activeItem) return;

    const newMsg: InboxThreadMessage = {
      id: `reply-${Date.now()}`,
      user: CURRENT_USER.id,
      waktu: 'Baru saja',
      isi: text.trim(),
      isCurrentUser: true
    };

    setInboxItems(prev => prev.map(item => {
      if (item.id === activeItem.id) {
        return {
          ...item,
          baru: false,
          waktu: 'Baru saja',
          snippet: `Anda: ${text.trim()}`,
          messages: [...item.messages, newMsg]
        };
      }
      return item;
    }));

    setChatInput('');
    if (onShowToast) {
      onShowToast('Pesan balasan berhasil dikirim.');
    }
  };

  const quickReplies = [
    'Siap dikerjakan! 👍',
    'Sudah saya review & approve ✓',
    'Tolong lampirkan langkah reproduksi',
    'Sedang saya verifikasi di staging'
  ];

  const getTypeBadge = (type: InboxItem['type']) => {
    switch (type) {
      case 'mention':
        return {
          label: '@ Mention',
          icon: AtSign,
          className: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'serahan':
        return {
          label: 'Serahan Tugas',
          icon: ArrowRightLeft,
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'review':
        return {
          label: 'Review & QA',
          icon: FileText,
          className: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'chat':
        return {
          label: 'Chat DM',
          icon: MessageSquare,
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      default:
        return {
          label: 'Pemberitahuan',
          icon: Bell,
          className: 'bg-slate-50 text-slate-700 border-slate-200'
        };
    }
  };

  const unreadCount = inboxItems.filter(i => i.baru).length;

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col bg-white rounded-2xl border border-[#E2EAF3] shadow-sm overflow-hidden select-none">
      {/* Top Bar / Header of Inbox */}
      <div className="px-5 py-3.5 border-b border-[#EFF4F9] bg-[#FCFDFE] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6FC0EF] to-[#1E6FD9] flex items-center justify-center text-white shadow-xs">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#0A2540] flex items-center gap-2">
              Inbox Notifikasi & Chat
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1E6FD9] text-white">
                  {unreadCount} baru
                </span>
              )}
            </h1>
            <p className="text-[11px] text-[#5B7288] hidden sm:block">
              Pemberitahuan, serahan tugas antar-peran, mention tim, dan percakapan interaktif
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2EAF3] text-xs font-medium text-[#3C5A78] hover:text-[#1E6FD9] hover:border-[#1E6FD9] transition-all shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tandai Semua Dibaca</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Master-Detail Layout (WhatsApp / ClickUp Style) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* LEFT COLUMN: List of Notifications & Chat Threads */}
        <div className={`w-full md:w-[360px] lg:w-[400px] border-r border-[#EFF4F9] flex flex-col bg-[#FAFBFD] shrink-0 ${
          isMobileDetailOpen ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Search Bar */}
          <div className="p-3 border-b border-[#EFF4F9] bg-white">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F8FD] border border-[#E2EAF3] text-xs focus-within:border-[#1E6FD9] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-[#5B7288]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari notifikasi, nama, atau #tugas..."
                className="w-full bg-transparent text-xs text-[#0A2540] placeholder-[#5B7288] focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#5B7288] hover:text-[#0A2540]"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'mention', label: '@ Mention' },
                { id: 'serahan', label: 'Serahan' },
                { id: 'review', label: 'Review' },
                { id: 'chat', label: 'Chat' }
              ].map(tab => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as InboxCategory)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      isActive 
                        ? 'bg-[#1E6FD9] text-white shadow-2xs' 
                        : 'text-[#5B7288] hover:text-[#0A2540] hover:bg-[#F4F8FD]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-filter: unread only */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EFF4F9] text-[11px]">
              <button
                onClick={() => setOnlyUnread(!onlyUnread)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all ${
                  onlyUnread 
                    ? 'bg-[#E7F0FA] border-[#1E6FD9] text-[#1E6FD9] font-medium' 
                    : 'bg-white border-[#E2EAF3] text-[#5B7288] hover:border-[#1E6FD9]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${onlyUnread ? 'bg-[#1E6FD9]' : 'bg-[#5B7288]'}`} />
                Hanya yang belum dibaca
              </button>

              <span className="text-[10px] text-[#5B7288]">
                {filteredItems.length} item
              </span>
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EFF4F9]">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center px-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F8FD] border border-[#E2EAF3] flex items-center justify-center mx-auto mb-2.5 text-[#5B7288]">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-[#0A2540]">Tidak ada notifikasi</p>
                <p className="text-[11px] text-[#5B7288] mt-0.5">
                  Semua item telah ditinjau atau tidak cocok dengan filter.
                </p>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = item.id === activeItem?.id;
                const sender = USERS_MAP[item.user] || CURRENT_USER;
                const badge = getTypeBadge(item.type);
                const BadgeIcon = badge.icon;
                const roleKey = sender.disiplin?.[0];
                const role = roleKey ? ROLES_CONFIG[roleKey] : null;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected 
                        ? 'bg-white border-l-4 border-l-[#1E6FD9] shadow-xs' 
                        : 'hover:bg-white/70'
                    } ${item.baru ? 'bg-[#F7FAFD]' : ''}`}
                  >
                    {/* User Avatar */}
                    <div className="relative shrink-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                        style={{ backgroundColor: sender.warna || role?.color || '#1E6FD9' }}
                      >
                        {sender.inisial || sender.nama.substring(0, 2).toUpperCase()}
                      </div>
                      <span 
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-[#E2EAF3] flex items-center justify-center text-[9px] text-[#1E6FD9]"
                        title={badge.label}
                      >
                        <BadgeIcon className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    {/* Content preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${item.baru ? 'font-bold text-[#0A2540]' : 'font-medium text-[#3C5A78]'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#5B7288] shrink-0 font-normal">
                          {item.waktu}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9.5px] px-1.5 py-0.2 rounded border font-medium inline-flex items-center gap-1 ${badge.className}`}>
                          {badge.label}
                        </span>
                        {item.taskId && (
                          <span className="text-[10px] font-mono font-semibold px-1 rounded bg-[#EFF4F9] text-[#1E6FD9]">
                            {item.taskId}
                          </span>
                        )}
                      </div>

                      <p className={`text-[11px] truncate mt-1 ${item.baru ? 'text-[#0A2540] font-medium' : 'text-[#5B7288]'}`}>
                        {item.snippet}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {item.baru && (
                      <span 
                        onClick={(e) => handleToggleRead(item.id, e)}
                        title="Tandai telah dibaca"
                        className="w-2.5 h-2.5 rounded-full bg-[#1E6FD9] shrink-0 mt-1 hover:scale-125 transition-transform"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WhatsApp-style Interactive Chat & Details */}
        <div className={`flex-1 flex flex-col bg-[#F9FBFC] min-w-0 ${
          isMobileDetailOpen ? 'flex' : 'hidden md:flex'
        }`}>
          {activeItem ? (
            <>
              {/* WhatsApp-Style Header */}
              <div className="px-4 py-3 bg-white border-b border-[#EFF4F9] flex items-center justify-between shrink-0 shadow-2xs z-10">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setIsMobileDetailOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-[#F4F8FD] text-[#5B7288] md:hidden"
                    aria-label="Kembali ke daftar"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                      style={{ 
                        backgroundColor: USERS_MAP[activeItem.user]?.warna || 
                          (USERS_MAP[activeItem.user]?.disiplin?.[0] ? ROLES_CONFIG[USERS_MAP[activeItem.user].disiplin[0]]?.color : '#1E6FD9') 
                      }}
                    >
                      {USERS_MAP[activeItem.user]?.inisial || activeItem.user.toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-[#0A2540] truncate flex items-center gap-2">
                      {activeItem.title}
                    </h2>
                    <p className="text-[11px] text-[#5B7288] truncate flex items-center gap-1.5">
                      <span>{activeItem.subtitle}</span>
                      {activeRoom && (
                        <>
                          <span>&bull;</span>
                          <span className="text-[#1E6FD9] font-medium">{activeRoom.nama}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {activeTask && (
                    <button
                      onClick={() => onOpenTask(activeTask)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E7F0FA] text-[#1E6FD9] hover:bg-[#1E6FD9] hover:text-white transition-all text-xs font-semibold shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Buka Tugas {activeTask.id}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleRead(activeItem.id)}
                    title={activeItem.baru ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'}
                    className="p-2 rounded-xl text-[#5B7288] hover:text-[#0A2540] hover:bg-[#F4F8FD] transition-colors"
                  >
                    <CheckCheck className={`w-4 h-4 ${!activeItem.baru ? 'text-[#1E6FD9]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Task Context Card Banner (if related to a task) */}
              {activeTask && (
                <div className="mx-4 mt-3 p-3 rounded-xl bg-white border border-[#E2EAF3] shadow-2xs flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: ROLES_CONFIG[activeTask.peran]?.color || '#1E6FD9' }}
                    >
                      {ROLES_CONFIG[activeTask.peran]?.kode}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0A2540] truncate">
                          {activeTask.nama}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#EFF4F9] text-[#3C5A78]">
                          {activeTask.id}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#5B7288] truncate mt-0.5">
                        Status: <span className="capitalize font-medium text-[#0A2540]">{activeTask.status}</span> &bull; Prioritas: <span className="capitalize font-medium text-[#0A2540]">{activeTask.prioritas}</span> &bull; Tenggat: {activeTask.due || '-'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenTask(activeTask)}
                    className="px-2.5 py-1 text-xs font-medium text-[#1E6FD9] hover:bg-[#E7F0FA] rounded-lg transition-colors shrink-0"
                  >
                    Detail Lengkap &rarr;
                  </button>
                </div>
              )}

              {/* WhatsApp-Style Chat Canvas Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F8FD]/40">
                {/* Date separator */}
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 rounded-full bg-white/80 border border-[#E2EAF3] text-[10.5px] font-medium text-[#5B7288] shadow-2xs backdrop-blur-xs">
                    Hari Ini &bull; Percakapan Terkait
                  </span>
                </div>

                {/* Message stream */}
                {activeItem.messages.map((msg) => {
                  const isMe = msg.isCurrentUser || msg.user === CURRENT_USER.id;
                  const senderUser = msg.user ? USERS_MAP[msg.user] : null;
                  const roleKey = senderUser?.disiplin?.[0];
                  const role = roleKey ? ROLES_CONFIG[roleKey] : null;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%]`}>
                        {!isMe && (
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs mb-0.5"
                            style={{ backgroundColor: senderUser?.warna || role?.color || '#5B7288' }}
                          >
                            {senderUser?.inisial || 'U'}
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-2.5 shadow-xs text-xs relative ${
                            isMe
                              ? 'bg-gradient-to-r from-[#1E6FD9] to-[#1656A8] text-white rounded-br-xs'
                              : 'bg-white text-[#0A2540] border border-[#E2EAF3] rounded-bl-xs'
                          }`}
                        >
                          {!isMe && senderUser && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <span 
                                className="font-semibold text-[11px]" 
                                style={{ color: role?.color || '#1E6FD9' }}
                              >
                                {senderUser.nama}
                              </span>
                              <span className="text-[10px] text-[#5B7288]">
                                ({role?.label || 'Tim'})
                              </span>
                            </div>
                          )}

                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.isi}
                          </p>

                          {msg.tugasId && (
                            <div className={`mt-2 p-2 rounded-xl flex items-center justify-between gap-2 ${
                              isMe ? 'bg-white/15 text-white' : 'bg-[#F4F8FD] text-[#0A2540] border border-[#E2EAF3]'
                            }`}>
                              <span className="font-mono font-bold text-[11px]">
                                {msg.tugasId}
                              </span>
                              <button
                                onClick={() => {
                                  const t = tasks.find(item => item.id === msg.tugasId);
                                  if (t) onOpenTask(t);
                                }}
                                className={`text-[10.5px] font-medium underline ${
                                  isMe ? 'text-white' : 'text-[#1E6FD9]'
                                }`}
                              >
                                Periksa Tugas
                              </button>
                            </div>
                          )}

                          {/* Message Time & Checkmark */}
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                            isMe ? 'text-white/80' : 'text-[#5B7288]'
                          }`}>
                            <span>{msg.waktu}</span>
                            {isMe && (
                              <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* WhatsApp-Style Quick Suggestions & Bottom Reply Bar */}
              <div className="p-3 bg-white border-t border-[#EFF4F9] shrink-0 space-y-2">
                {/* Quick reply chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-[10.5px] text-[#5B7288] shrink-0 font-medium">
                    Balasan Cepat:
                  </span>
                  {quickReplies.map((qr, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendReply(qr)}
                      className="px-2.5 py-1 rounded-full bg-[#F4F8FD] hover:bg-[#E7F0FA] text-[#3C5A78] hover:text-[#1E6FD9] border border-[#E2EAF3] text-[11px] whitespace-nowrap transition-all shrink-0"
                    >
                      {qr}
                    </button>
                  ))}
                </div>

                {/* Input form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2EAF3] bg-[#FCFDFE] focus-within:border-[#1E6FD9] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E6FD9]/10 transition-all">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Balas pesan ke ${USERS_MAP[activeItem.user]?.nama || 'tim'}...`}
                      className="flex-1 bg-transparent text-xs text-[#0A2540] placeholder-[#5B7288] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply('👍 Terkonfirmasi')}
                      className="text-[#5B7288] hover:text-[#0A2540] transition-colors p-1"
                      title="Kirim jempol"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                      chatInput.trim()
                        ? 'bg-gradient-to-r from-[#1E6FD9] to-[#12459C] text-white shadow-sm shadow-[#1E6FD9]/30 hover:scale-105 active:scale-95'
                        : 'bg-[#EFF4F9] text-[#5B7288] cursor-not-allowed'
                    }`}
                    aria-label="Kirim balasan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div className="max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#E7F0FA] text-[#1E6FD9] flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-[#0A2540]">
                  Pusat Pesan & Inbox Terpadu
                </h3>
                <p className="text-xs text-[#5B7288] mt-1">
                  Pilih notifikasi, serahan tugas, atau percakapan di sebelah kiri untuk melihat pesan lengkap dan membalas secara langsung.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
