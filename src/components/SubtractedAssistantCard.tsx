import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  MessageSquare, 
  Settings, 
  Paperclip, 
  Smile, 
  Mic, 
  Send, 
  Sparkles,
  Bot,
  CheckCircle2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface SubtractedAssistantCardProps {
  className?: string;
  onNavigate?: (page: string) => void;
}

export const SubtractedAssistantCard: React.FC<SubtractedAssistantCardProps> = ({
  className = '',
  onNavigate
}) => {
  // Active Tab: 0 = Help (?), 1 = Chat (Message), 2 = Settings (Gear), 3 = Avatar
  const [activeTab, setActiveTab] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number>(360);
  const [cardHeight, setCardHeight] = useState<number>(390);

  // Chat message state
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: "Hi there! I'm a virtual assistant. How can I help you today?",
      time: '9:32'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Observe card size for responsive SVG path calculation
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setCardWidth(w);
      }
    };
    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const W = cardWidth;
  const H = cardHeight;

  // Geometry parameters matching Image 1:
  // Tab centers:
  // Tab 0 (?) center: x = 50
  // Tab 1 (chat) center: x = 104
  // Tab 2 (gear) center: x = 158
  const tabCenters = [50, 104, 158];
  const targetX = tabCenters[activeTab] !== undefined ? tabCenters[activeTab] : 104;

  const yCard = 54;     // Base horizontal line of white card
  const yTabTop = 16;   // Top of the protruding tab
  const tabHalfW = 22;  // Half width of the tab
  const rFillet = 14;   // Concave inverted radius at tab base
  const rTabTop = 20;   // Rounded cap of the tab

  const x1 = targetX - tabHalfW;
  const x2 = targetX + tabHalfW;

  // Notch for avatar in top right
  const avatarNotchW = 72;
  const avatarNotchH = 46;

  // Calculate SVG path for the seamless subtracted card with active tab and avatar notch
  const pathD = `
    M 28 ${yCard}
    H ${Math.max(28, x1 - rFillet)}
    A ${rFillet} ${rFillet} 0 0 0 ${x1} ${yCard - rFillet}
    V ${yTabTop + rTabTop}
    A ${rTabTop} ${rTabTop} 0 0 1 ${x1 + rTabTop} ${yTabTop}
    H ${x2 - rTabTop}
    A ${rTabTop} ${rTabTop} 0 0 1 ${x2} ${yTabTop + rTabTop}
    V ${yCard - rFillet}
    A ${rFillet} ${rFillet} 0 0 0 ${x2 + rFillet} ${yCard}
    H ${Math.max(x2 + rFillet + 10, W - avatarNotchW - 20)}
    A 18 18 0 0 1 ${W - avatarNotchW} ${yCard + 16}
    A 22 22 0 0 0 ${W - avatarNotchW + 22} ${yCard + avatarNotchH}
    H ${W - 24}
    A 24 24 0 0 1 ${W} ${yCard + avatarNotchH + 24}
    V ${H - 28}
    A 28 28 0 0 1 ${W - 28} ${H}
    H 28
    A 28 28 0 0 1 0 ${H - 28}
    V ${yCard + 28}
    A 28 28 0 0 1 28 ${yCard}
    Z
  `;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setInputText('');
    
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Baru saja' }
    ]);

    setTimeout(() => {
      let reply = "Saya telah memperbarui status sprint & menyinkronkan dokumen tugas untuk Anda.";
      if (userMsg.toLowerCase().includes('tugas') || userMsg.toLowerCase().includes('task')) {
        reply = "Tugas aktif Anda telah dicatat dalam sprint board ruang proyek.";
      } else if (userMsg.toLowerCase().includes('help') || userMsg.toLowerCase().includes('bantuan')) {
        reply = "Gunakan tombol tab (?) di atas untuk melihat panduan pintas atau langsung ketik kebutuhan Anda di sini.";
      }
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: reply, time: 'Baru saja' }
      ]);
    }, 800);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-[390px] h-[390px] rounded-[34px] bg-[#EAECEF] p-2.5 select-none shadow-md border border-[#DCE1E7] overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Top Outer Tab Buttons (sitting on the light background) */}
      <div className="relative z-20 flex items-center justify-between px-2 pt-1 h-[52px]">
        {/* Tab Icons Cluster */}
        <div className="flex items-center gap-4 pl-1.5">
          {/* Tab 0: Help (?) */}
          <button
            onClick={() => setActiveTab(0)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 0 
                ? 'text-[#0A2540] scale-110 font-bold' 
                : 'text-[#8C9AA8] hover:text-[#0A2540]'
            }`}
            title="Pusat Bantuan & Panduan"
          >
            <HelpCircle className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Tab 1: Chat (Message) */}
          <button
            onClick={() => setActiveTab(1)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 1 
                ? 'text-[#0A2540] scale-110 font-bold' 
                : 'text-[#8C9AA8] hover:text-[#0A2540]'
            }`}
            title="Chat Asisten Virtual"
          >
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Tab 2: Settings (Gear) */}
          <button
            onClick={() => setActiveTab(2)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 2 
                ? 'text-[#0A2540] scale-110 font-bold' 
                : 'text-[#8C9AA8] hover:text-[#0A2540]'
            }`}
            title="Pengaturan Asisten"
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Top-Right Character Avatar (Nestled in Subtracted Notch) */}
        <button
          onClick={() => setActiveTab(3)}
          className={`relative z-20 w-11 h-11 rounded-full bg-gradient-to-tr from-[#9B51E0] to-[#7B2CBF] p-0.5 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-2 ${
            activeTab === 3 ? 'ring-[#0A2540]' : 'ring-white'
          }`}
          title="Profil AI Asisten"
        >
          {/* Stylized character representation matching Image 1 */}
          <div className="w-full h-full rounded-full bg-[#1C1033] flex items-center justify-center overflow-hidden relative">
            <span className="text-base select-none">🤖</span>
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-[#25D366] ring-1 ring-white" />
          </div>
        </button>
      </div>

      {/* The Continuous White Organic Subtracted Card (SVG Layer) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-all duration-300"
        style={{
          filter: 'drop-shadow(0 6px 16px rgba(10, 37, 64, 0.05))'
        }}
      >
        <path
          d={pathD}
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="0.8"
          className="transition-all duration-200"
        />
      </svg>

      {/* Card Inner Content Area (positioned inside the white shape) */}
      <div className="relative z-20 flex-1 flex flex-col justify-between pt-14 pb-2 px-4 mt-2">
        <AnimatePresence mode="wait">
          {/* TAB 1: Chat Message Screen (100% matching Image 1) */}
          {activeTab === 1 && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Messages Container */}
              <div className="space-y-3 overflow-y-auto max-h-[210px] pr-1 pt-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] px-4 py-3 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#0A2540] text-white rounded-2xl rounded-tr-xs shadow-xs'
                          : 'bg-[#F4F5F7] text-[#1E293B] rounded-2xl rounded-tl-xs border border-[#ECEFF3]'
                      }`}
                    >
                      <p className="font-medium">{m.text}</p>
                      <span className={`text-[10px] block mt-1 text-right ${
                        m.sender === 'user' ? 'text-white/70' : 'text-[#8C9AA8]'
                      }`}>
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Input Bar Pill matching Image 1 */}
              <div className="pt-2">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAFAFC] border border-[#E2E8F0] shadow-xs focus-within:border-[#1E6FD9] transition-all">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Write a message"
                    className="flex-1 text-xs text-[#0A2540] placeholder-[#94A3B8] bg-transparent focus:outline-none"
                  />
                  
                  {/* Action Icons matching Image 1: Paperclip, Smile, Mic */}
                  <button 
                    type="button"
                    onClick={() => setInputText(prev => prev + ' [Lampiran Berkas]')}
                    className="text-[#94A3B8] hover:text-[#0A2540] transition-colors p-1 cursor-pointer"
                    title="Lampirkan berkas"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => setInputText(prev => prev + ' 😊')}
                    className="text-[#94A3B8] hover:text-[#0A2540] transition-colors p-1 cursor-pointer"
                    title="Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {inputText.trim() ? (
                    <button 
                      type="button"
                      onClick={handleSendMessage}
                      className="w-7 h-7 rounded-full bg-[#0A2540] text-white flex items-center justify-center hover:bg-[#1E6FD9] transition-all cursor-pointer shadow-xs"
                      title="Kirim pesan"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="text-[#94A3B8] hover:text-[#0A2540] transition-colors p-1 cursor-pointer"
                      title="Rekam suara"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 0: Help & Guidelines */}
          {activeTab === 0 && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col justify-between py-1"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                  <HelpCircle className="w-4 h-4 text-[#1E6FD9]" />
                  <span>Bantuan Cepat Virtual Assistant</span>
                </div>
                <p className="text-[11.5px] text-[#5B7288] leading-relaxed">
                  Asisten ini dapat membantu meringkas sprint, membuat draft PRD/SRS, hingga memantau handoff QA secara real-time.
                </p>

                <div className="space-y-1.5 pt-1">
                  {[
                    "Ketik 'cek status sprint' untuk progres",
                    "Ketik 'buat tugas baru' untuk modal tugas",
                    "Gunakan tab gear untuk konfigurasi AI"
                  ].map((tip, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2EAF3] text-[11px] text-[#0A2540] flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8E82] shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab(1)}
                className="w-full py-2 rounded-full bg-[#0A2540] text-white text-xs font-semibold hover:bg-[#1E6FD9] transition-colors cursor-pointer text-center"
              >
                Mulai Chat Sekarang
              </button>
            </motion.div>
          )}

          {/* TAB 2: Settings */}
          {activeTab === 2 && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col justify-between py-1"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                  <Settings className="w-4 h-4 text-[#1E6FD9]" />
                  <span>Preferensi AI Asisten</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF3] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0A2540] block">Respon Cepat (Quick Mode)</span>
                      <span className="text-[10px] text-[#5B7288]">Saran ringkas untuk alur harian</span>
                    </div>
                    <span className="w-8 h-4 rounded-full bg-[#0F8E82] relative flex items-center px-0.5">
                      <span className="w-3 h-3 rounded-full bg-white ml-auto" />
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF3] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0A2540] block">Auto-Sync Sprint DoD</span>
                      <span className="text-[10px] text-[#5B7288]">Otomatis perbarui tiket</span>
                    </div>
                    <span className="w-8 h-4 rounded-full bg-[#0F8E82] relative flex items-center px-0.5">
                      <span className="w-3 h-3 rounded-full bg-white ml-auto" />
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(1)}
                className="w-full py-2 rounded-full bg-[#F4F8FD] text-[#0A2540] border border-[#E2EAF3] text-xs font-semibold hover:bg-white transition-colors cursor-pointer text-center"
              >
                Kembali ke Chat
              </button>
            </motion.div>
          )}

          {/* TAB 3: Assistant Persona Profile */}
          {activeTab === 3 && (
            <motion.div
              key="avatar-profile"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col justify-between py-1 text-center"
            >
              <div className="space-y-2 pt-2">
                <div className="w-12 h-12 rounded-full bg-[#7B2CBF] mx-auto flex items-center justify-center text-xl shadow-sm text-white">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A2540]">NIITS AI Copilot</h4>
                  <p className="text-[11px] text-[#0F8E82] font-semibold flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#0F8E82] animate-pulse" />
                    Aktif & Terhubung ke Workspace
                  </p>
                </div>
                <p className="text-[11px] text-[#5B7288] px-2 leading-relaxed">
                  Model arsitektur sprint dan virtual assistant untuk mengotomasi alur kerja tim.
                </p>
              </div>

              <button
                onClick={() => setActiveTab(1)}
                className="w-full py-2 rounded-full bg-[#0A2540] text-white text-xs font-semibold hover:bg-[#1E6FD9] transition-colors cursor-pointer"
              >
                Kirim Pertanyaan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
