import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Mail, 
  MessageSquare, 
  Plus, 
  Mic, 
  Send, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Users, 
  User, 
  Hash, 
  Sparkles,
  Phone,
  Video,
  ArrowLeft,
  CheckCheck
} from 'lucide-react';
import { Task } from '../types';

interface ChatViewProps {
  onOpenTask?: (task: Task) => void;
  tasks?: Task[];
  initialChatId?: string;
  onBackToWorkspace?: () => void;
}

export type ConversationType = 'grup' | 'personal';

export interface ConversationItem {
  id: string;
  name: string;
  snippet: string;
  avatar: string;
  type: ConversationType;
  badgeType: 'mail' | 'chat';
  unreadCount?: number;
  time: string;
  isOnline?: boolean;
  memberCount?: number;
  role?: string;
  roomColor?: string;
}

export interface ChatMessageItem {
  id: string;
  sender: 'them' | 'me';
  senderName?: string;
  text: string;
  time: string;
  hasPlusButton?: boolean;
}

export interface SmartSuggestion {
  id: string;
  title: string;
  text: string;
}

const CONVERSATIONS_DATA: ConversationItem[] = [
  // PERSONAL CHATS
  {
    id: 'p1',
    name: 'Kenn Strathelm',
    snippet: 'Up is opinion message manners correct hearing husband my. Disposing commanded dashwoods...',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    type: 'personal',
    badgeType: 'mail',
    unreadCount: 2,
    time: '10:12 PM',
    isOnline: true,
    role: 'VP of Operations'
  },
  {
    id: 'p2',
    name: 'Sarah Jenkins',
    snippet: 'Worth no tiled my at house added. Married he to unreserved assistance connection dry...',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    type: 'personal',
    badgeType: 'chat',
    time: '09:55 PM',
    isOnline: true,
    role: 'Lead Security Engineer'
  },
  {
    id: 'p3',
    name: 'Bambang Wijaya',
    snippet: 'Is education residence conveying so so. Suppose shyness say ten behaved morning had...',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    type: 'personal',
    badgeType: 'mail',
    unreadCount: 1,
    time: '09:42 PM',
    isOnline: false,
    role: 'Senior Backend Architect'
  },
  {
    id: 'p4',
    name: 'Jessica Chen',
    snippet: 'Moonlight two applauded conveying end direction. Reviewed the design system tokens...',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    type: 'personal',
    badgeType: 'chat',
    time: 'Yesterday',
    isOnline: true,
    role: 'Principal UI/UX Designer'
  },
  {
    id: 'p5',
    name: 'David Miller',
    snippet: 'Are expenses distance weddings perceive strongly. The Kubernetes cluster autoscaling is stable...',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    type: 'personal',
    badgeType: 'chat',
    time: '2 days ago',
    isOnline: false,
    role: 'DevOps & SRE'
  },

  // GROUP CHATS
  {
    id: 'g1',
    name: 'Core Platform & API',
    snippet: 'Dimas: Deployment sprint v2.4 successfully migrated to cloud cluster.',
    avatar: '',
    type: 'grup',
    badgeType: 'chat',
    unreadCount: 4,
    time: '10:05 PM',
    memberCount: 12,
    roomColor: '#1E6FD9'
  },
  {
    id: 'g2',
    name: 'Mobile Engineering Squad',
    snippet: 'Sarah: Hotfix release untuk iOS push notification sudah siap di review.',
    avatar: '',
    type: 'grup',
    badgeType: 'mail',
    unreadCount: 3,
    time: '08:30 PM',
    memberCount: 8,
    roomColor: '#0EA5E9'
  },
  {
    id: 'g3',
    name: 'QA & Security Automation',
    snippet: 'Bambang: Vulnerability scanning lolos 100% tanpa finding critical.',
    avatar: '',
    type: 'grup',
    badgeType: 'chat',
    time: 'Yesterday',
    memberCount: 6,
    roomColor: '#10B981'
  },
  {
    id: 'g4',
    name: 'Product Design & System',
    snippet: 'Jessica: Desain subtractive UI dan layout clean telah diperbarui di Figma.',
    avatar: '',
    type: 'grup',
    badgeType: 'chat',
    time: '3 days ago',
    memberCount: 9,
    roomColor: '#8B5CF6'
  }
];

const INITIAL_MESSAGES_MAP: Record<string, ChatMessageItem[]> = {
  p1: [
    {
      id: 'm1',
      sender: 'them',
      senderName: 'Kenn Strathelm',
      text: 'Up is opinion message manners correct hearing husband my. Disposing commanded dashwoods cordially depending at at. Its strangers who you certainly earnestly resources suffering she.',
      time: '10:12 PM'
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'And produce say the ten moments parties. Simple innate summer fat appear basket his desire joy.',
      time: '10:12 PM',
      hasPlusButton: true
    }
  ],
  g1: [
    {
      id: 'mg1',
      sender: 'them',
      senderName: 'Bambang Wijaya',
      text: 'Sprint review v2.4 telah selesai. Semua task integrasi backend telah dimerge ke staging branch.',
      time: '09:50 PM'
    },
    {
      id: 'mg2',
      sender: 'them',
      senderName: 'Sarah Jenkins',
      text: 'Security check dan SSL verification juga pass dengan skor 98/100.',
      time: '09:58 PM'
    },
    {
      id: 'mg3',
      sender: 'me',
      text: 'Bagus sekali tim! Kita jadwalkan rilis produksi malam ini pukul 23:00 WIB.',
      time: '10:05 PM',
      hasPlusButton: true
    }
  ],
  p2: [
    {
      id: 'mp20',
      sender: 'them',
      senderName: 'Sarah Jenkins',
      text: 'Worth no tiled my at house added. Married he to unreserved assistance connection dry. Please confirm the courier schedule.',
      time: '09:55 PM'
    }
  ],
  g2: [
    {
      id: 'mg21',
      sender: 'them',
      senderName: 'Jessica Chen',
      text: 'Animasi subtractive curve dan segmented filter di tampilan mobile sudah dites di iPhone dan Android, pergerakannya sangat smooth.',
      time: '08:30 PM'
    }
  ]
};

const SMART_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 's1',
    title: 'Smart Response',
    text: 'Hey, Kenn! Is education residence conveying so so. Suppose shyness say ten behaved morning had. Your request will be processed immediately.'
  },
  {
    id: 's2',
    title: 'Smart Response',
    text: 'Terima kasih atas updatenya! Semua spesifikasi telah dicek dan diverifikasi oleh tim internal kami.'
  },
  {
    id: 's3',
    title: 'Smart Response',
    text: 'Siap, kita jadwalkan sync call singkat 15 menit untuk menyelaraskan detail pengerjaan.'
  }
];

export const ChatView: React.FC<ChatViewProps> = ({
  onOpenTask,
  tasks,
  initialChatId,
  onBackToWorkspace
}) => {
  const [filterType, setFilterType] = useState<'semua' | 'grup' | 'personal'>('semua');
  const [activeChatId, setActiveChatId] = useState<string>(
    initialChatId && CONVERSATIONS_DATA.some(c => c.id === initialChatId) ? initialChatId : 'p1'
  );
  const [conversations] = useState<ConversationItem[]>(CONVERSATIONS_DATA);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessageItem[]>>(INITIAL_MESSAGES_MAP);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [smartIndex, setSmartIndex] = useState(0);
  const [showSmartResponse, setShowSmartResponse] = useState(true);
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('chat');
  const [inChatSearch, setInChatSearch] = useState(false);
  const [inChatQuery, setInChatQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations by category ('semua' | 'grup' | 'personal') and search query
  const filteredConversations = conversations.filter((conv) => {
    const matchesFilter = 
      filterType === 'semua' ? true :
      filterType === 'grup' ? conv.type === 'grup' :
      conv.type === 'personal';

    const matchesSearch = 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0];
  const currentMessages = messagesMap[activeChatId] || [
    {
      id: 'm-def-1',
      sender: 'them',
      senderName: activeConversation.name,
      text: activeConversation.snippet,
      time: activeConversation.time
    }
  ];

  // Filter messages if in-chat search is active
  const displayedMessages = inChatQuery.trim()
    ? currentMessages.filter(m => m.text.toLowerCase().includes(inChatQuery.toLowerCase()))
    : currentMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, messagesMap]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hasPlusButton: true
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));

    if (!textToSend) {
      setInputMsg('');
    }
  };

  const handleSelectSmartResponse = () => {
    const suggestion = SMART_SUGGESTIONS[smartIndex];
    if (!suggestion) return;
    handleSendMessage(suggestion.text);
    setShowSmartResponse(false);
  };

  const groupCount = conversations.filter(c => c.type === 'grup').length;
  const personalCount = conversations.filter(c => c.type === 'personal').length;

  return (
    <div className="relative w-full h-full flex-1 flex flex-col min-h-0">
      {/* Seamless Unified Card Container - exactly matching ArticlesView structure */}
      <div className="relative bg-white rounded-[32px] sm:rounded-[36px] border border-[#E2E8F0] shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
        
        {/* Top Header: Clean, monochrome, professional navigation bar matching ArticlesView (h-[72px]) */}
        <div className="h-[72px] shrink-0 border-b border-[#E2E8F0] px-5 sm:px-7 bg-white">
          <div className="w-full h-full flex items-center justify-between gap-4">
            {/* Left: Title & Subtitle */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2.5">
                {onBackToWorkspace && (
                  <button
                    onClick={onBackToWorkspace}
                    className="p-1.5 -ml-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B1528] transition-colors cursor-pointer"
                    title="Kembali ke Workspace"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-base sm:text-lg font-semibold text-[#0B1528] tracking-tight truncate">
                  Pesan & Percakapan
                </h2>
              </div>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                Komunikasi langsung dan koordinasi grup kerja tim secara instan
              </p>
            </div>

            {/* Right Header: Scope Filter (Semua, Grup, Personal) & Action Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Clean Scope Toggle: Semua / Grup / Personal matching ArticlesView pill toggle */}
              <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1">
                <button
                  onClick={() => setFilterType('semua')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterType === 'semua'
                      ? 'bg-white text-[#0B1528] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0B1528]'
                  }`}
                >
                  Semua ({conversations.length})
                </button>
                <button
                  onClick={() => setFilterType('grup')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterType === 'grup'
                      ? 'bg-white text-[#0B1528] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0B1528]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Grup ({groupCount})</span>
                </button>
                <button
                  onClick={() => setFilterType('personal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterType === 'personal'
                      ? 'bg-white text-[#0B1528] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0B1528]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personal ({personalCount})</span>
                </button>
              </div>

              {/* Action Button: Kirim Pesan Baru */}
              <button
                onClick={() => setShowSmartResponse(true)}
                className="btn-3d-primary hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs hover:brightness-105 active:scale-95 transition-all text-white"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Pesan Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: Left conversation sidebar + Right chat message stream */}
        <div className="flex-1 min-h-0 flex overflow-hidden relative">

          {/* ========================================================================= */}
          {/* COLUMN 1: Conversations (Left Panel with Subtracted Smooth Tab) */}
          {/* ========================================================================= */}
          <div 
            className={`
              w-full md:w-[320px] lg:w-[350px] xl:w-[370px] bg-[#F4F7FB] flex flex-col shrink-0 h-full relative z-10 border-r border-[#E2E8F0]
              ${mobilePane === 'list' ? 'flex' : 'hidden md:flex'}
            `}
          >
            {/* Header info in list */}
            <div className="pt-4 pb-2 px-6 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8B9EB5] tracking-wider uppercase">
                {filterType === 'semua' ? 'Semua Obrolan' : filterType === 'grup' ? 'Saluran Grup' : 'Kontak Personal'}
              </span>
              <span className="text-[11px] font-mono text-[#64748B] font-semibold">
                {filteredConversations.length} obrolan
              </span>
            </div>

            {/* Conversations List with Subtracted Smooth Active Tab */}
            <div className="flex-1 overflow-y-auto py-1 relative scrollbar-none">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-[#8B9EB5] text-xs">
                  Tidak ada obrolan dalam filter ini.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeChatId;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveChatId(conv.id);
                        setMobilePane('chat');
                      }}
                      className={`
                        group relative px-6 py-3.5 flex items-center gap-3.5 cursor-pointer transition-colors
                        ${isActive ? 'bg-white z-20' : 'hover:bg-white/50 text-[#64748B]'}
                      `}
                    >
                      {/* SUBTRACTED CONCAVE FILLETS (Only on Active Item) */}
                      {isActive && (
                        <>
                          {/* Active Blue Indicator Dot on the far left */}
                          <motion.span 
                            layoutId="activeSubtractedDot"
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1E6FD9]"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          />

                          {/* Top Inverted Concave Fillet (melts into the right white panel) */}
                          <svg 
                            className="absolute right-0 -top-5 w-5 h-5 pointer-events-none fill-white z-30" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M 0 20 Q 20 20 20 0 L 20 20 Z" />
                          </svg>

                          {/* Bottom Inverted Concave Fillet (melts into the right white panel) */}
                          <svg 
                            className="absolute right-0 -bottom-5 w-5 h-5 pointer-events-none fill-white z-30" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M 0 0 Q 20 0 20 20 L 20 0 Z" />
                          </svg>
                        </>
                      )}

                      {/* Avatar (Group Icon with room color OR Personal Photo) */}
                      <div className="relative shrink-0">
                        {conv.type === 'grup' ? (
                          <div 
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xs"
                            style={{ backgroundColor: conv.roomColor || '#1E6FD9' }}
                          >
                            <Hash className="w-5 h-5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="relative">
                            <img 
                              src={conv.avatar} 
                              alt={conv.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-white shadow-2xs"
                            />
                            {conv.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className={`text-xs font-bold truncate flex items-center gap-1.5 ${isActive ? 'text-[#0A2540]' : 'text-[#334155]'}`}>
                            <span>{conv.name}</span>
                            {conv.type === 'grup' && (
                              <span className="text-[10px] font-semibold text-[#8B9EB5]">
                                ({conv.memberCount})
                              </span>
                            )}
                          </h3>
                          <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
                            {conv.time}
                          </span>
                        </div>
                        <p className={`text-[11.5px] leading-relaxed line-clamp-2 ${isActive ? 'text-[#475569] font-medium' : 'text-[#8B9EB5]'}`}>
                          {conv.snippet}
                        </p>
                      </div>

                      {/* Right Status Badge Icon (Red Mail or Cyan Bubble) */}
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {conv.badgeType === 'mail' ? (
                          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[#F43F5E]">
                            <Mail className="w-4 h-4 stroke-[1.75]" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[#06B6D4]">
                            <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                          </span>
                        )}
                        {conv.unreadCount && (
                          <span className="w-4 h-4 rounded-full bg-[#1E6FD9] text-white text-[9.5px] font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Search Input */}
            <div className="p-4 px-6 pb-5 bg-[#F4F7FB] border-t border-[#E9EFF6]">
              <div className="relative flex items-center">
                <span className="absolute left-3 w-4 h-4 rounded-full border-2 border-[#CBD5E1] flex items-center justify-center pointer-events-none">
                  <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                </span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pesan atau kontak..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white text-xs text-[#0A2540] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#1E6FD9]/30 transition-all border border-[#E2E8F0]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 rounded-full text-[#94A3B8] hover:text-[#0A2540]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: Active Chat Stream (White Canvas filling rest of container)     */}
          {/* ========================================================================= */}
          <div 
            className={`
              flex-1 flex flex-col h-full min-w-0 bg-white relative z-0
              ${mobilePane === 'chat' ? 'flex' : 'hidden md:flex'}
            `}
          >
            {/* Header Bar */}
            <div className="h-14 px-6 border-b border-[#F1F5F9] flex items-center justify-between shrink-0 bg-white z-10">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setMobilePane('list')}
                  className="md:hidden p-1.5 -ml-2 rounded-xl text-[#64748B] hover:bg-slate-100"
                  aria-label="Kembali ke daftar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Active Conversation Avatar */}
                {activeConversation.type === 'grup' ? (
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-2xs shrink-0"
                    style={{ backgroundColor: activeConversation.roomColor || '#1E6FD9' }}
                  >
                    <Hash className="w-4.5 h-4.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="relative shrink-0">
                    <img 
                      src={activeConversation.avatar} 
                      alt={activeConversation.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    {activeConversation.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>
                )}

                {/* Title & Subtitle */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#0A2540] truncate leading-tight">
                      {activeConversation.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      activeConversation.type === 'grup' 
                        ? 'bg-purple-50 text-purple-700' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {activeConversation.type === 'grup' ? 'Grup' : 'Personal'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B9EB5] truncate leading-tight mt-0.5">
                    {activeConversation.type === 'grup' ? (
                      <span>{activeConversation.memberCount} anggota tim aktif</span>
                    ) : (
                      <span>{activeConversation.isOnline ? 'Online • ' : 'Offline • '}{activeConversation.role}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1 text-[#8B9EB5]">
                <button 
                  onClick={() => setInChatSearch(!inChatSearch)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${inChatSearch ? 'text-[#1E6FD9] bg-[#E8F1FD]' : 'hover:text-[#0A2540] hover:bg-slate-100'}`}
                  title="Cari dalam pesan"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => alert(`Memulai panggilan suara dengan ${activeConversation.name}...`)}
                  className="p-2 rounded-xl hover:text-[#0A2540] hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Panggilan suara"
                >
                  <Phone className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => alert(`Memulai panggilan video dengan ${activeConversation.name}...`)}
                  className="p-2 rounded-xl hover:text-[#0A2540] hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Panggilan video"
                >
                  <Video className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* In-Chat Search Bar Dropdown */}
            <AnimatePresence>
              {inChatSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#F8FAFC] border-b border-[#EAEFF5] px-6 py-2.5 flex items-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={inChatQuery}
                    onChange={(e) => setInChatQuery(e.target.value)}
                    placeholder="Cari kata dalam percakapan ini..."
                    className="flex-1 bg-white rounded-xl px-3.5 py-1.5 text-xs text-[#0A2540] border border-[#E2E8F0] focus:outline-none focus:border-[#1E6FD9]"
                    autoFocus
                  />
                  <button
                    onClick={() => { setInChatQuery(''); setInChatSearch(false); }}
                    className="p-1 text-[#94A3B8] hover:text-[#0A2540]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 flex flex-col justify-start">
              {displayedMessages.map((msg) => {
                const isThem = msg.sender === 'them';

                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isThem ? 'items-start' : 'items-start'} max-w-2xl`}
                  >
                    {/* Sender Name for group chats */}
                    {isThem && activeConversation.type === 'grup' && msg.senderName && (
                      <span className="text-[11px] font-bold text-[#1E6FD9] mb-1 pl-1">
                        {msg.senderName}
                      </span>
                    )}

                    <div className="flex items-center gap-3 w-full">
                      {/* Blue plus circle icon next to outgoing responses */}
                      {!isThem && msg.hasPlusButton && (
                        <button 
                          onClick={() => setShowSmartResponse(true)}
                          className="w-8 h-8 rounded-full bg-[#1E6FD9] text-white flex items-center justify-center shrink-0 shadow-2xs hover:bg-[#185DC0] transition-colors cursor-pointer"
                          title="Tindakan respons"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      )}

                      {/* Message Bubble */}
                      <div 
                        className={`
                          relative px-5 py-3.5 rounded-[20px] text-xs sm:text-[13px] leading-relaxed transition-all flex-1
                          ${isThem 
                            ? 'bg-[#F3F6FA] text-[#1E293B] rounded-tl-sm' 
                            : 'bg-[#EDF5FF] text-[#1E40AF] rounded-tl-sm'}
                        `}
                      >
                        <p className="font-normal pr-14 leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                        
                        {/* Timestamp on bottom right */}
                        <span className="absolute bottom-2.5 right-4 text-[10px] text-[#94A3B8] font-mono select-none">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* SMART RESPONSE CARD (Vibrant Electric Blue Floating Card) */}
              <AnimatePresence>
                {showSmartResponse && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="w-full max-w-xl bg-[#1E6FD9] text-white rounded-[24px] p-6 shadow-xl relative overflow-hidden mt-6"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          Smart Response
                        </h4>
                      </div>
                      <button 
                        onClick={() => setShowSmartResponse(false)}
                        className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
                        aria-label="Tutup Smart Response"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Body Content */}
                    <div className="py-2 text-xs sm:text-[13px] text-white/95 leading-relaxed font-normal">
                      {smartIndex === 0 ? (
                        <>
                          Hey, <strong className="font-bold text-white">{activeConversation.name}</strong>! Is education residence conveying so so. Suppose shyness say ten behaved morning had. Your request will be processed immediately.
                        </>
                      ) : (
                        SMART_SUGGESTIONS[smartIndex].text
                      )}
                    </div>

                    {/* Footer Navigation & Select Action */}
                    <div className="pt-4 flex items-center justify-between">
                      {/* Navigation Pills: < > ... */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setSmartIndex((prev) => (prev > 0 ? prev - 1 : SMART_SUGGESTIONS.length - 1))}
                          className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Saran sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setSmartIndex((prev) => (prev < SMART_SUGGESTIONS.length - 1 ? prev + 1 : 0))}
                          className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Saran berikutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setSmartIndex(0)}
                          className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Opsi"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Select Action Button */}
                      <button 
                        onClick={handleSelectSmartResponse}
                        className="px-6 py-2 rounded-full bg-white text-[#1E6FD9] font-bold text-xs shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Bar */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#F1F5F9] shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-3"
              >
                {/* Plus button inside square icon */}
                <button 
                  type="button"
                  onClick={() => setShowSmartResponse(true)}
                  className="w-9 h-9 rounded-xl border border-[#CBD5E1] text-[#94A3B8] hover:text-[#1E6FD9] hover:border-[#1E6FD9] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Buka Smart Response"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>

                {/* Text Input */}
                <input 
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Start typing your message..."
                  className="flex-1 bg-transparent py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
                />

                {/* Microphone / Send icon */}
                {inputMsg.trim() ? (
                  <button 
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-[#1E6FD9] text-white flex items-center justify-center hover:bg-[#185DC0] transition-colors cursor-pointer shrink-0 shadow-xs"
                    title="Kirim pesan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => alert("Fitur dikte suara siap digunakan.")}
                    className="p-2 text-[#94A3B8] hover:text-[#1E6FD9] transition-colors cursor-pointer shrink-0"
                    title="Pesan suara"
                  >
                    <Mic className="w-5 h-5 stroke-[1.75]" />
                  </button>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
