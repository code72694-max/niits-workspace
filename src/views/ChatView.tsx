import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  Send, 
  Paperclip, 
  Smile, 
  Mic,
  Hash, 
  Lock, 
  Users, 
  Search, 
  MoreVertical,
  CheckCheck,
  Check,
  X, 
  MessageSquare,
  Sparkles,
  Phone,
  Video,
  Pin,
  ChevronLeft,
  Info,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { Channel, DirectMessageContact, ChatMessage, Task } from '../types';
import { 
  INITIAL_CHANNELS, 
  INITIAL_DMS, 
  INITIAL_MESSAGES, 
  THREAD_REPLIES, 
  USERS_MAP, 
  CURRENT_USER,
  ROOMS_MAP,
  ROLES_CONFIG
} from '../data/mockData';

interface ChatViewProps {
  onOpenTask: (task: Task) => void;
  tasks: Task[];
  initialChatId?: string;
  onBackToWorkspace?: () => void;
}

type FilterTab = 'semua' | 'saluran' | 'pribadi' | 'belum';

export const ChatView: React.FC<ChatViewProps> = ({
  onOpenTask,
  tasks,
  initialChatId,
  onBackToWorkspace
}) => {
  const [activeChatId, setActiveChatId] = useState<string>(initialChatId || 'c-agro');
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threadReplies, setThreadReplies] = useState(THREAD_REPLIES);
  const [threadInput, setThreadInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('semua');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileList, setShowMobileList] = useState(!initialChatId);
  const [isSearchingInChat, setIsSearchingInChat] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChatId) {
      setActiveChatId(initialChatId);
      setShowMobileList(false);
    }
  }, [initialChatId]);

  // Scroll to bottom when active chat or messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, messagesMap]);

  const currentChannel = INITIAL_CHANNELS.find(c => c.id === activeChatId);
  const currentDM = INITIAL_DMS.find(d => d.id === activeChatId);
  const dmUser = currentDM ? USERS_MAP[currentDM.user] : null;
  const currentMessages = messagesMap[activeChatId] || [];

  // Filter channels & DMs based on search and active tab
  const filteredChannels = INITIAL_CHANNELS.filter(ch => {
    if (activeTab === 'pribadi') return false;
    if (activeTab === 'belum' && ch.belum === 0) return false;
    if (!searchFilter.trim()) return true;
    return ch.nama.toLowerCase().includes(searchFilter.toLowerCase()) ||
           ch.ringkas.toLowerCase().includes(searchFilter.toLowerCase());
  });

  const filteredDMs = INITIAL_DMS.filter(dm => {
    if (activeTab === 'saluran') return false;
    if (activeTab === 'belum' && dm.belum === 0) return false;
    const user = USERS_MAP[dm.user];
    if (!searchFilter.trim()) return true;
    return user?.nama.toLowerCase().includes(searchFilter.toLowerCase()) ||
           dm.akhir.toLowerCase().includes(searchFilter.toLowerCase());
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-new-${Date.now()}`,
      user: CURRENT_USER.id,
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      tipe: 'teks',
      isi: inputMsg.trim(),
      react: []
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));
    setInputMsg('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadInput.trim()) return;

    setThreadReplies(prev => [
      ...prev,
      {
        user: CURRENT_USER.id,
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isi: threadInput.trim()
      }
    ]);
    setThreadInput('');
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessagesMap(prev => {
      const list = prev[activeChatId] || [];
      const updated = list.map(m => {
        if (m.id === msgId) {
          const currentReacts = m.react || [];
          const existing = currentReacts.find(r => r.e === emoji);
          if (existing) {
            return {
              ...m,
              react: currentReacts.map(r => r.e === emoji ? { ...r, n: r.n + 1 } : r)
            };
          } else {
            return {
              ...m,
              react: [...currentReacts, { e: emoji, n: 1 }]
            };
          }
        }
        return m;
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActiveThreadId(null);
    setShowMobileList(false);
    setIsSearchingInChat(false);
    setShowInfoDrawer(false);
  };

  const quickEmojis = ['👍', '❤️', '🔥', '🎉', '🚀', '👏', '😊', '✅'];

  return (
    <div className="h-full w-full overflow-hidden flex rounded-2xl border border-[#D5E0ED] bg-[#EFEAE2] text-[#111B21] font-sans antialiased select-none shadow-xs">
      {/* ========================================================================= */}
      {/* LEFT PANEL: WhatsApp Web Sidebar (Chats & Saluran List)                    */}
      {/* ========================================================================= */}
      <div 
        className={`
          w-full md:w-[380px] lg:w-[420px] bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 h-full z-20
          ${showMobileList ? 'flex' : 'hidden md:flex'}
        `}
      >
        {/* Top Bar / Profile & Actions */}
        <div className="h-16 px-4 bg-[#F0F2F5] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          {/* Header Branding & User Avatar */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#00A884] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
              <Send className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#0A2540] truncate block leading-tight">
                Chat & Saluran Tim
              </span>
              <span className="text-[10px] text-[#54656F] truncate block">
                Diskusi Proyek & Tim
              </span>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-1 text-[#54656F]">
            <button 
              onClick={() => setActiveTab('saluran')}
              className={`p-2 rounded-full hover:bg-[#E2E8F0] transition-colors ${activeTab === 'saluran' ? 'text-[#00A884] bg-[#E2E8F0]' : ''}`}
              title="Saluran Tim"
            >
              <Hash className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => setActiveTab('pribadi')}
              className={`p-2 rounded-full hover:bg-[#E2E8F0] transition-colors ${activeTab === 'pribadi' ? 'text-[#00A884] bg-[#E2E8F0]' : ''}`}
              title="Chat Pribadi"
            >
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => alert("NIITS Web Chat v2.4\nSemua komunikasi tersinkronisasi otomatis dengan Room dan Tugas Proyek.")}
              className="p-2 rounded-full hover:bg-[#E2E8F0] transition-colors"
              title="Pengaturan Chat"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="p-2.5 bg-white border-b border-[#F0F2F5] space-y-2">
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#54656F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Cari saluran atau chat..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F0F2F5] text-xs text-[#111B21] placeholder-[#54656F] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00A884]"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#54656F] hover:text-[#111B21]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills (WhatsApp Web style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {(['semua', 'saluran', 'pribadi', 'belum'] as FilterTab[]).map((tab) => {
              const labels: Record<FilterTab, string> = {
                semua: 'Semua',
                saluran: 'Saluran',
                pribadi: 'Pribadi',
                belum: 'Belum Dibaca'
              };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-[#E7FCE3] text-[#008069] font-semibold' 
                      : 'bg-[#F0F2F5] text-[#54656F] hover:bg-[#E9EDEF]'}
                  `}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat List Scrollable Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F5]">
          {/* Section 1: Saluran Tim */}
          {filteredChannels.length > 0 && activeTab !== 'pribadi' && (
            <div>
              <div className="px-4 py-2 bg-[#F8FAFC] text-[10.5px] font-bold uppercase tracking-wider text-[#54656F] flex items-center justify-between">
                <span>Saluran ({filteredChannels.length})</span>
                <span className="text-[10px] text-[#00A884] font-medium">Ruang Diskusi</span>
              </div>

              {filteredChannels.map((ch) => {
                const isActive = activeChatId === ch.id;
                const room = ch.room ? ROOMS_MAP[ch.room] : null;
                const latestMsg = (messagesMap[ch.id] || []).slice(-1)[0];

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChat(ch.id)}
                    className={`
                      w-full px-3.5 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer
                      ${isActive ? 'bg-[#F0F2F5]' : 'hover:bg-[#F8FAFC]'}
                    `}
                  >
                    {/* Avatar Icon */}
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: room?.warna || '#00A884' }}
                    >
                      {ch.kunci ? <Lock className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
                    </div>

                    {/* Chat Text Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm truncate ${isActive ? 'font-bold text-[#111B21]' : 'font-semibold text-[#111B21]'}`}>
                          #{ch.nama}
                        </span>
                        <span className="text-[11px] text-[#667781] shrink-0 font-mono">
                          {latestMsg?.waktu || 'Baru'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#667781] truncate pr-2">
                          {latestMsg ? (
                            <span>
                              <span className="text-[#54656F] font-medium">
                                {USERS_MAP[latestMsg.user || '']?.nama?.split(' ')[0] || 'Sistem'}: 
                              </span>{' '}
                              {latestMsg.isi}
                            </span>
                          ) : (
                            ch.ringkas
                          )}
                        </p>

                        {/* Unread Badge / Pin */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {ch.pin && <Pin className="w-3 h-3 text-[#8696A0]" />}
                          {ch.belum > 0 && (
                            <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center justify-center leading-none">
                              {ch.belum}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Section 2: Pesan Langsung (DMs) */}
          {filteredDMs.length > 0 && activeTab !== 'saluran' && (
            <div>
              <div className="px-4 py-2 bg-[#F8FAFC] text-[10.5px] font-bold uppercase tracking-wider text-[#54656F] flex items-center justify-between">
                <span>Chat Pribadi ({filteredDMs.length})</span>
                <span className="text-[10px] text-[#00A884] font-medium">Kontak Tim</span>
              </div>

              {filteredDMs.map((dm) => {
                const user = USERS_MAP[dm.user];
                if (!user) return null;
                const isActive = activeChatId === dm.id;
                const latestMsg = (messagesMap[dm.id] || []).slice(-1)[0];

                return (
                  <button
                    key={dm.id}
                    onClick={() => handleSelectChat(dm.id)}
                    className={`
                      w-full px-3.5 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer
                      ${isActive ? 'bg-[#F0F2F5]' : 'hover:bg-[#F8FAFC]'}
                    `}
                  >
                    {/* User Avatar */}
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-2xs relative"
                      style={{ backgroundColor: user.warna }}
                    >
                      {user.inisial}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-white" />
                    </div>

                    {/* Chat Text Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm truncate ${isActive ? 'font-bold text-[#111B21]' : 'font-semibold text-[#111B21]'}`}>
                          {user.nama}
                        </span>
                        <span className="text-[11px] text-[#667781] shrink-0 font-mono">
                          {latestMsg?.waktu || '09:12'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#667781] truncate pr-2">
                          {latestMsg?.isi || dm.akhir}
                        </p>

                        {/* Unread Badge */}
                        {dm.belum > 0 && (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center justify-center leading-none shrink-0">
                            {dm.belum}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty Search State */}
          {filteredChannels.length === 0 && filteredDMs.length === 0 && (
            <div className="p-8 text-center text-[#54656F] space-y-2">
              <Search className="w-8 h-8 mx-auto text-[#8696A0] stroke-[1.5]" />
              <p className="text-xs font-semibold text-[#111B21]">Tidak ada obrolan ditemukan</p>
              <p className="text-[11px]">Coba kata kunci pencarian lain atau pilih tab "Semua".</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: WhatsApp Web Active Chat Window                               */}
      {/* ========================================================================= */}
      <div 
        className={`
          flex-1 flex flex-col h-full min-w-0 bg-[#EFEAE2] relative
          ${showMobileList ? 'hidden md:flex' : 'flex'}
        `}
      >
        {/* Subtle WhatsApp Wallpaper background overlay */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none z-0"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 0.75px, transparent 0.75px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Chat Conversation Header */}
        <div className="h-16 px-4 bg-[#F0F2F5] border-b border-[#E2E8F0] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Back Button to list */}
            <button
              onClick={() => setShowMobileList(true)}
              className="md:hidden p-1.5 -ml-1 rounded-full text-[#54656F] hover:bg-[#E2E8F0] transition-colors"
              aria-label="Kembali ke daftar obrolan"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Chat Avatar */}
            {currentChannel ? (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-2xs cursor-pointer"
                style={{ backgroundColor: ROOMS_MAP[currentChannel.room || '']?.warna || '#00A884' }}
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              >
                {currentChannel.kunci ? <Lock className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
              </div>
            ) : currentDM && dmUser ? (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs cursor-pointer relative"
                style={{ backgroundColor: dmUser.warna }}
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              >
                {dmUser.inisial}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-white" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1E6FD9] flex items-center justify-center text-white font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
            )}

            {/* Chat Title & Status Details */}
            <div 
              className="min-w-0 cursor-pointer"
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
            >
              <h3 className="text-sm font-bold text-[#111B21] truncate leading-tight flex items-center gap-1.5">
                <span>{currentChannel ? `#${currentChannel.nama}` : dmUser?.nama || 'Obrolan'}</span>
              </h3>
              <p className="text-[11px] text-[#54656F] truncate leading-tight mt-0.5">
                {currentChannel ? (
                  <span>{currentChannel.anggota.length} anggota tim &bull; {currentChannel.ringkas}</span>
                ) : dmUser ? (
                  <span>online &bull; {dmUser.peran} ({dmUser.email})</span>
                ) : (
                  <span>Obrolan aktif</span>
                )}
              </p>
            </div>
          </div>

          {/* Right Action Icons in Conversation */}
          <div className="flex items-center gap-1 text-[#54656F]">
            {/* Search within conversation */}
            <button
              onClick={() => setIsSearchingInChat(!isSearchingInChat)}
              className={`p-2 rounded-full hover:bg-[#E2E8F0] transition-colors ${isSearchingInChat ? 'text-[#00A884] bg-[#E2E8F0]' : ''}`}
              title="Cari dalam obrolan"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* View info/members drawer */}
            <button
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              className={`p-2 rounded-full hover:bg-[#E2E8F0] transition-colors ${showInfoDrawer ? 'text-[#00A884] bg-[#E2E8F0]' : ''}`}
              title="Info obrolan & anggota"
            >
              <Users className="w-4.5 h-4.5" />
            </button>

            {/* Quick exit to Workspace */}
            {onBackToWorkspace && (
              <button
                onClick={onBackToWorkspace}
                className="hidden lg:flex items-center gap-1 ml-2 px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0A2540] hover:bg-[#E2E8F0] transition-colors text-xs font-semibold shadow-2xs"
                title="Keluar ke Workspace"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#1E6FD9]" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Search within chat banner (if toggled) */}
        <AnimatePresence>
          {isSearchingInChat && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#F0F2F5] border-b border-[#E2E8F0] px-4 py-2 flex items-center gap-2 z-10 shrink-0"
            >
              <Search className="w-4 h-4 text-[#54656F]" />
              <input
                type="text"
                value={inChatSearchQuery}
                onChange={(e) => setInChatSearchQuery(e.target.value)}
                placeholder="Cari kata atau isi pesan di obrolan ini..."
                className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-[#111B21] focus:outline-none border border-[#E2E8F0]"
                autoFocus
              />
              <button
                onClick={() => { setIsSearchingInChat(false); setInChatSearchQuery(''); }}
                className="p-1 rounded-md text-[#54656F] hover:bg-[#E2E8F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 relative z-10">
          {/* End-to-end encryption notification banner (WhatsApp style) */}
          <div className="flex justify-center my-2">
            <div className="bg-[#FFEECD] text-[#54656F] text-[11px] px-3.5 py-1.5 rounded-lg shadow-xs max-w-md text-center flex items-center gap-1.5 border border-[#FDE68A]">
              <Lock className="w-3 h-3 text-[#B45309] shrink-0" />
              <span>
                Pesan dienkripsi secara end-to-end. Terhubung langsung dengan database NIITS Workspace.
              </span>
            </div>
          </div>

          {/* Date Separator Pill */}
          <div className="flex justify-center my-3">
            <span className="bg-white/90 text-[#54656F] text-[11px] font-semibold px-3 py-1 rounded-lg shadow-2xs border border-[#E2E8F0]">
              HARI INI
            </span>
          </div>

          {/* Messages Stream */}
          {currentMessages
            .filter(m => !inChatSearchQuery || m.isi.toLowerCase().includes(inChatSearchQuery.toLowerCase()))
            .map((msg) => {
              if (msg.tipe === 'sistem') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="text-[11px] font-medium text-[#54656F] bg-white/80 px-3 py-1 rounded-lg border border-[#E2E8F0] shadow-2xs">
                      {msg.isi}
                    </span>
                  </div>
                );
              }

              const isMe = msg.user === CURRENT_USER.id;
              const sender = USERS_MAP[msg.user || ''] || CURRENT_USER;
              const linkedTask = msg.tugas ? tasks.find(t => t.id === msg.tugas) : null;

              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                >
                  {/* WhatsApp Message Bubble */}
                  <div 
                    className={`
                      relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-3.5 pt-2 pb-2 rounded-xl text-xs leading-relaxed shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]
                      ${isMe 
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none' 
                        : 'bg-white text-[#111B21] rounded-tl-none border border-[#E2E8F0]/40'}
                    `}
                  >
                    {/* Sender Name (for incoming messages in channels) */}
                    {!isMe && (
                      <div className="font-bold text-[11.5px] mb-1 flex items-center gap-1.5" style={{ color: sender.warna || '#00A884' }}>
                        <span>{sender.nama}</span>
                        <span className="text-[9.5px] font-normal text-[#667781]">({sender.peran})</span>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="text-[13px] text-[#111B21] whitespace-pre-wrap break-words leading-relaxed">
                      {msg.isi}
                    </div>

                    {/* Interactive Linked Task Card (if message references a task) */}
                    {linkedTask && (
                      <div 
                        onClick={() => onOpenTask(linkedTask)}
                        className="mt-2 p-2.5 bg-white/90 rounded-lg border border-[#CBD5E1] hover:border-[#1E6FD9] cursor-pointer shadow-2xs transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono font-bold text-[#1E6FD9] bg-[#EAF2FD] px-1.5 py-0.5 rounded">
                            {linkedTask.id}
                          </span>
                          <p className="text-xs font-semibold text-[#0A2540] truncate mt-1">
                            {linkedTask.nama}
                          </p>
                          <span className="text-[10px] text-[#64748B]">
                            Klik untuk buka detail tugas
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#1E6FD9] px-2 py-0.5 rounded-full bg-[#1E6FD9]/10 shrink-0">
                          {linkedTask.status}
                        </span>
                      </div>
                    )}

                    {/* Timestamp & Double Check Status (WhatsApp signature bottom right) */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#667781] select-none">
                      <span className="font-mono">{msg.waktu}</span>
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                      )}
                    </div>

                    {/* Quick Reactions Display on bottom of bubble */}
                    {msg.react && msg.react.length > 0 && (
                      <div className="absolute -bottom-2.5 left-2 flex items-center gap-1 z-10">
                        {msg.react.map((r) => (
                          <button
                            key={r.e}
                            onClick={() => handleToggleReaction(msg.id, r.e)}
                            className="bg-white px-1.5 py-0.2 rounded-full shadow-2xs border border-[#E2E8F0] text-[10px] flex items-center gap-0.5 hover:scale-105 transition-transform"
                          >
                            <span>{r.e}</span>
                            <span className="text-[9px] font-semibold text-[#667781]">{r.n}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reaction trigger & Thread replies indicator */}
                  <div className="flex items-center gap-2 mt-1 px-1">
                    {/* Hover Reaction button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {quickEmojis.slice(0, 3).map((em) => (
                        <button
                          key={em}
                          onClick={() => handleToggleReaction(msg.id, em)}
                          className="p-1 rounded-full hover:bg-white text-xs transition-transform hover:scale-110"
                        >
                          {em}
                        </button>
                      ))}
                    </div>

                    {/* Utas / Thread reply trigger */}
                    {msg.balasan && (
                      <button
                        onClick={() => setActiveThreadId(msg.id)}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#008069] hover:underline cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{msg.balasan} balasan di utas</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Bar Picker (if toggled) */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#F0F2F5] border-t border-[#E2E8F0] p-3 flex flex-wrap gap-2 z-20 shrink-0"
            >
              {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😎', '👍', '👎', '👏', '🙌', '🎉', '🔥', '🚀', '💯', '✨', '❤️', '💡', '✅'].map((em) => (
                <button
                  key={em}
                  onClick={() => { setInputMsg(prev => prev + em); setShowEmojiPicker(false); }}
                  className="text-lg p-1.5 rounded-lg hover:bg-white hover:scale-125 transition-transform"
                >
                  {em}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachment Options Drawer (if toggled) */}
        <AnimatePresence>
          {showAttachMenu && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-16 left-12 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-30 flex flex-col gap-2 w-52"
            >
              <button 
                onClick={() => { alert("Katalog Tugas: Anda dapat menyertakan link tugas dengan mengetik ID tugas seperti 'T-241'."); setShowAttachMenu(false); }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F0F2F5] text-xs font-semibold text-[#111B21] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#EAF2FD] text-[#1E6FD9] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Tautkan Tugas</span>
              </button>
              <button 
                onClick={() => { alert("Lampiran dokumen atau gambar siap diunggah."); setShowAttachMenu(false); }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F0F2F5] text-xs font-semibold text-[#111B21] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <span>Unggah Berkas</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Message Input Bar */}
        <form 
          onSubmit={handleSendMessage}
          className="h-16 px-4 bg-[#F0F2F5] border-t border-[#E2E8F0] flex items-center gap-2.5 z-20 shrink-0"
        >
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachMenu(false); }}
            className="p-2 text-[#54656F] hover:text-[#111B21] rounded-full hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Attachment Toggle */}
          <button
            type="button"
            onClick={() => { setShowAttachMenu(!showAttachMenu); setShowEmojiPicker(false); }}
            className="p-2 text-[#54656F] hover:text-[#111B21] rounded-full hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Lampirkan"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input Box */}
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 bg-white text-sm text-[#111B21] placeholder-[#54656F] rounded-lg px-4 py-2.5 focus:outline-none border-0 shadow-2xs"
          />

          {/* Send Button or Mic Icon (WhatsApp style) */}
          {inputMsg.trim() ? (
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008F6F] text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              title="Kirim pesan"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => alert("Pesan suara siap direkam.")}
              className="w-10 h-10 rounded-full text-[#54656F] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Pesan suara"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {/* ========================================================================= */}
      {/* DRAWER: Info Obrolan / Anggota Saluran (WhatsApp Contact Info style)      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showInfoDrawer && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-[#E2E8F0] flex flex-col shrink-0 overflow-hidden shadow-lg h-full z-30"
          >
            {/* Header */}
            <div className="h-16 px-4 bg-[#F0F2F5] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-[#111B21]">Info Saluran & Kontak</span>
              <button
                onClick={() => setShowInfoDrawer(false)}
                className="p-1.5 rounded-full text-[#54656F] hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChannel ? (
                <>
                  <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl shadow-xs"
                      style={{ backgroundColor: ROOMS_MAP[currentChannel.room || '']?.warna || '#00A884' }}
                    >
                      <Hash className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-[#111B21]">#{currentChannel.nama}</h4>
                    <p className="text-xs text-[#54656F]">{currentChannel.ringkas}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#111B21] block mb-2">
                      Anggota Tim ({currentChannel.anggota.length})
                    </span>
                    <div className="space-y-2">
                      {currentChannel.anggota.map((uid) => {
                        const member = USERS_MAP[uid];
                        if (!member) return null;
                        return (
                          <div key={uid} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                              style={{ backgroundColor: member.warna }}
                            >
                              {member.inisial}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[#111B21] block truncate">{member.nama}</span>
                              <span className="text-[10.5px] text-[#64748B] block truncate">{member.peran} &bull; {member.email}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : currentDM && dmUser ? (
                <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-3">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl shadow-xs"
                    style={{ backgroundColor: dmUser.warna }}
                  >
                    {dmUser.inisial}
                  </div>
                  <h4 className="text-base font-bold text-[#111B21]">{dmUser.nama}</h4>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF2FD] text-[#1E6FD9]">
                    {dmUser.peran}
                  </span>
                  <p className="text-xs text-[#54656F]">{dmUser.email}</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DRAWER: Utas Percakapan (Thread Drawer)                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeThreadId && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-[#E2E8F0] flex flex-col shrink-0 overflow-hidden shadow-lg h-full z-30"
          >
            <div className="h-16 px-4 bg-[#F0F2F5] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-[#111B21]">Utas Balasan</span>
              <button
                onClick={() => setActiveThreadId(null)}
                className="p-1.5 rounded-full text-[#54656F] hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
              {threadReplies.map((r, idx) => {
                const user = USERS_MAP[r.user] || CURRENT_USER;
                return (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111B21]">{user.nama}</span>
                      <span className="text-[10px] text-[#667781] font-mono">{r.waktu}</span>
                    </div>
                    <p className="text-xs text-[#3C5A78] leading-relaxed">{r.isi}</p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendThreadReply} className="p-3 bg-[#F0F2F5] border-t border-[#E2E8F0] flex gap-2">
              <input
                type="text"
                value={threadInput}
                onChange={(e) => setThreadInput(e.target.value)}
                placeholder="Balas di utas..."
                className="flex-1 px-3 py-2 text-xs bg-white rounded-lg border border-[#E2E8F0] focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-[#00A884] text-white hover:bg-[#008F6F]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
