import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X,
  Menu,
  ArrowLeft
} from 'lucide-react';

import { Task, RoleKey, Room, NotificationItem } from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_ROOMS, 
  INITIAL_NOTIFICATIONS, 
  CURRENT_USER, 
  ROLES_CONFIG,
  INITIAL_ARTICLES
} from './data/mockData';

// Layout components
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { NewTaskModal } from './components/NewTaskModal';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';

// Views
import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { ListView } from './views/ListView';
import { BoardView } from './views/BoardView';
import { CalendarView } from './views/CalendarView';
import { ChatView } from './views/ChatView';
import { InboxView } from './views/InboxView';
import { ArticlesView } from './views/ArticlesView';
import { RolesView } from './views/RolesView';
import { RoomPlanView } from './views/RoomPlanView';
import { ToolsView } from './views/ToolsView';
import { TrashView } from './views/TrashView';
import { SettingsView } from './views/SettingsView';
import { ProjectDocsView } from './views/ProjectDocsView';
import { MembersView } from './views/MembersView';
import { ProfileView } from './views/ProfileView';
import { ProjectWorkspaceView, ProjectSubTab } from './views/ProjectWorkspaceView';
import { ProjectsListView } from './views/ProjectsListView';
import { LearningView } from './views/LearningView';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('dash');
  const [currentRoomId, setCurrentRoomId] = useState<string>('r1');
  const [currentProjectTab, setCurrentProjectTab] = useState<ProjectSubTab>('dashboard');
  const [currentRoleKey, setCurrentRoleKey] = useState<RoleKey | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string>('c-agro');

  // Core Data State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Article Navigation State (for Detail View in Sidebar & ArticlesView)
  const [selectedArticleId, setSelectedArticleId] = useState<string>('a1');
  const [articleSubView, setArticleSubView] = useState<'daftar' | 'detail' | 'tulis' | 'ekspor'>('daftar');

  const isArticleDetail = (currentPage === 'articles' || currentPage === 'artikel') && articleSubView === 'detail';
  const isProjectDetail = currentPage === 'project' || currentPage === 'board' || currentPage === 'room';

  const handleBackFromProjectDetail = () => {
    handleNavigate('projects');
  };

  const currentArticleIndex = INITIAL_ARTICLES.findIndex(a => a.id === selectedArticleId);
  const safeArticleIndex = currentArticleIndex >= 0 ? currentArticleIndex : 0;
  const hasPrevArticle = safeArticleIndex > 0;
  const hasNextArticle = safeArticleIndex < INITIAL_ARTICLES.length - 1;
  const prevArticleTitle = hasPrevArticle ? INITIAL_ARTICLES[safeArticleIndex - 1]?.judul : undefined;
  const nextArticleTitle = hasNextArticle ? INITIAL_ARTICLES[safeArticleIndex + 1]?.judul : undefined;

  const handlePrevArticle = () => {
    if (hasPrevArticle) {
      setSelectedArticleId(INITIAL_ARTICLES[safeArticleIndex - 1].id);
    }
  };

  const handleNextArticle = () => {
    if (hasNextArticle) {
      setSelectedArticleId(INITIAL_ARTICLES[safeArticleIndex + 1].id);
    }
  };

  const handleBackFromArticleDetail = () => {
    setArticleSubView('daftar');
  };

  // Micro-toast alerts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNewTaskModalOpen(false);
        setSelectedTask(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation Handler
  const handleNavigate = (page: string, params?: { room?: string; role?: RoleKey; chatId?: string; tab?: ProjectSubTab }) => {
    if (params?.room) {
      setCurrentRoomId(params.room);
    }
    if (params?.tab) {
      setCurrentProjectTab(params.tab);
    } else if (page === 'project') {
      setCurrentProjectTab('dashboard');
    } else if (page === 'board') {
      setCurrentProjectTab('board');
    }

    if (params?.role) {
      setCurrentRoleKey(params.role);
    } else if (page !== 'role') {
      setCurrentRoleKey(null);
    }
    if (params?.chatId) {
      setCurrentChatId(params.chatId);
    }

    setCurrentPage(page);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Task Operations
  const handleCreateTask = (newTaskData: Partial<Task> | Task) => {
    const nextNum = tasks.length + 1;
    const newTask: Task = {
      id: newTaskData.id || `T-${String(240 + nextNum)}`,
      listId: newTaskData.listId || 'l1',
      nama: newTaskData.nama || 'Tugas Baru',
      peran: newTaskData.peran || 'be',
      status: newTaskData.status || 'siap',
      prioritas: newTaskData.prioritas || 'normal',
      assignee: (newTaskData.assignee && newTaskData.assignee.length > 0) ? newTaskData.assignee : [CURRENT_USER.id],
      due: newTaskData.due || '2026-09-10',
      estimasi: newTaskData.estimasi || '4j',
      sub: newTaskData.sub || [0, newTaskData.subtasksList?.length || 0],
      subtasksList: newTaskData.subtasksList || [],
      tags: (newTaskData.tags && newTaskData.tags.length > 0) ? newTaskData.tags : ['fitur'],
      komentar: 0,
      lampiran: 0,
      deskripsi: newTaskData.deskripsi || '',
      next: newTaskData.next,
      roomId: newTaskData.roomId || currentRoomId
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`Tugas ${newTask.id} "${newTask.nama}" berhasil dibuat.`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
    showToast(`Status tugas ${updatedTask.id} berhasil diperbarui.`);
  };

  const handleDeleteTasks = (taskIds: string[]) => {
    setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      setSelectedTask(null);
    }
    showToast(`${taskIds.length} tugas dipindahkan ke tempat sampah.`, 'info');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dibaca: true })));
    showToast('Semua notifikasi ditandai telah dibaca.');
  };

  // Render view router based on currentPage
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeView
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'dash':
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            rooms={rooms}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'list':
        return (
          <ListView
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTasks={handleDeleteTasks}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'projects':
        return (
          <ProjectsListView
            rooms={rooms}
            tasks={tasks}
            onSelectProject={(roomId, tab) => {
              setCurrentRoomId(roomId);
              if (tab) setCurrentProjectTab(tab as ProjectSubTab);
              handleNavigate('project', { room: roomId, tab: tab || 'dashboard' });
            }}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            onShowToast={showToast}
          />
        );
      case 'project':
      case 'board':
        return (
          <ProjectWorkspaceView
            currentRoomId={currentRoomId}
            rooms={rooms}
            tasks={tasks}
            initialTab={currentProjectTab}
            onOpenTask={setSelectedTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTasks={handleDeleteTasks}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            onNavigate={handleNavigate}
            onSelectRoom={(roomId) => {
              setCurrentRoomId(roomId);
            }}
            onShowToast={showToast}
          />
        );
      case 'cal':
        return (
          <CalendarView
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'inbox':
        return (
          <InboxView
            tasks={tasks}
            rooms={rooms}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 'chat':
        return (
          <ChatView
            tasks={tasks}
            onOpenTask={setSelectedTask}
            initialChatId={currentChatId}
            onBackToWorkspace={() => handleNavigate('dash')}
          />
        );
      case 'artikel':
      case 'articles':
        return (
          <ArticlesView
            subView={articleSubView}
            onSubViewChange={setArticleSubView}
            selectedArticleId={selectedArticleId}
            onSelectArticleId={setSelectedArticleId}
          />
        );
      case 'roles':
        return (
          <RolesView
            currentRoleKey={null}
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'role':
        return (
          <RolesView
            currentRoleKey={currentRoleKey || 'be'}
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'plan':
        return (
          <RoomPlanView
            isDetail={false}
            currentRoomId={currentRoomId}
            rooms={rooms}
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'room':
        return (
          <RoomPlanView
            isDetail={true}
            currentRoomId={currentRoomId}
            rooms={rooms}
            tasks={tasks}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'docs':
        return (
          <ProjectDocsView
            currentRoomId={currentRoomId}
            onNavigate={handleNavigate}
          />
        );
      case 'apps':
      case 'tools':
      case 'gen':
      case 'api':
        return (
          <ToolsView />
        );
      case 'trash':
      case 'sampah':
        return (
          <TrashView />
        );
      case 'members':
      case 'team':
        return (
          <MembersView 
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 'learning':
      case 'lms':
      case 'kursus':
        return (
          <LearningView
            onBackToWorkspace={() => handleNavigate('dash')}
            onShowToast={showToast}
          />
        );
      case 'profile':
      case 'profil':
      case 'akun':
        return (
          <ProfileView 
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 'roomset':
      case 'pengaturan':
      case 'settings':
        return (
          <SettingsView />
        );
      default:
        return (
          <DashboardView
            tasks={tasks}
            rooms={rooms}
            onOpenTask={setSelectedTask}
            onNavigate={handleNavigate}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            onOpenPalette={() => setIsCommandPaletteOpen(true)}
            unreadNotificationsCount={notifications.filter(n => !n.read).length}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F4F8FD] text-[#0A2540] font-sans antialiased selection:bg-[#1E6FD9]/20 selection:text-[#12459C]">
      {/* Mobile-only Top Bar (< md screens): Compact bar for menu drawer toggle & quick tabs */}
      <div className="md:hidden flex items-center justify-between px-3 py-2.5 bg-white/95 backdrop-blur-md border-b border-[#D5E0ED] shrink-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2">
          {isProjectDetail ? (
            <button
              onClick={handleBackFromProjectDetail}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4F8FD] text-[#0A2540] border border-[#D5E0ED] active:scale-95 cursor-pointer hover:bg-[#EAEFF5] text-xs font-semibold"
              title="Kembali ke Daftar Proyek"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A2540]" />
              <span>Kembali</span>
            </button>
          ) : isArticleDetail ? (
            <button
              onClick={handleBackFromArticleDetail}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4F8FD] text-[#0A2540] border border-[#D5E0ED] active:scale-95 cursor-pointer hover:bg-[#EAEFF5] text-xs font-semibold"
              title="Kembali ke Daftar Artikel"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A2540]" />
              <span>Kembali</span>
            </button>
          ) : (currentPage === 'learning' || currentPage === 'lms') ? (
            <button
              onClick={() => handleNavigate('dash')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4F8FD] text-[#0A2540] border border-[#D5E0ED] active:scale-95 cursor-pointer hover:bg-[#EAEFF5] text-xs font-semibold"
              title="Kembali ke Workspace Utama"
            >
              <ArrowLeft className="w-4 h-4 text-[#1E6FD9]" />
              <span className="text-[#0A2540]">Workspace</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-xl bg-[#F4F8FD] text-[#0A2540] border border-[#D5E0ED] active:scale-95 cursor-pointer hover:bg-[#EAEFF5]"
                title="Buka Menu Navigasi"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleNavigate('dash')}>
                <div className="w-6 h-6 rounded-md bg-[#0B1528] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  B
                </div>
                <span className="font-extrabold text-sm text-[#0A2540]">Bruno</span>
              </div>
            </>
          )}
        </div>

        {/* Mobile Quick Pills: Dashboard, Articles, Team, LMS */}
        <div className="flex items-center gap-1 bg-[#EEF4FB] p-1 rounded-full border border-[#D5E0ED]">
          <button
            onClick={() => handleNavigate('dash')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              currentPage === 'dash' ? 'bg-black text-white shadow-2xs' : 'text-[#4A5D70]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigate('articles')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              currentPage === 'articles' || currentPage === 'artikel' ? 'bg-black text-white shadow-2xs' : 'text-[#4A5D70]'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => handleNavigate('team')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              currentPage === 'team' || currentPage === 'members' ? 'bg-black text-white shadow-2xs' : 'text-[#4A5D70]'
            }`}
          >
            Team
          </button>
          <button
            onClick={() => handleNavigate('learning')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              currentPage === 'learning' || currentPage === 'lms' ? 'bg-black text-white shadow-2xs' : 'text-[#4A5D70]'
            }`}
          >
            LMS
          </button>
        </div>
      </div>

      {/* Body container: Full height, sidebar at left (hidden in learning view) and workspace on right */}
      <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-row h-full min-w-0 w-full max-w-[1720px] mx-auto px-4 sm:px-5 lg:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 gap-4 sm:gap-5 lg:gap-6">
          {/* Sidebar Navigation: Floating circular buttons at left (hidden in learning mode) */}
          {currentPage !== 'learning' && currentPage !== 'lms' && (
            <Sidebar
              currentPage={currentPage}
              currentRoomId={currentRoomId}
              currentRoleKey={currentRoleKey}
              rooms={rooms}
              onNavigate={handleNavigate}
              onOpenNewTask={() => setIsNewTaskModalOpen(true)}
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              isArticleDetail={isArticleDetail}
              onBackFromArticleDetail={handleBackFromArticleDetail}
              onPrevArticle={handlePrevArticle}
              onNextArticle={handleNextArticle}
              hasPrevArticle={hasPrevArticle}
              hasNextArticle={hasNextArticle}
              prevArticleTitle={prevArticleTitle}
              nextArticleTitle={nextArticleTitle}
              isProjectDetail={isProjectDetail}
              onBackFromProjectDetail={handleBackFromProjectDetail}
            />
          )}

          {/* Main Workspace Layout */}
          <div className={`flex-1 flex flex-col h-full min-w-0 ${(currentPage === 'dash' || currentPage === 'chat' || currentPage === 'artikel' || currentPage === 'articles' || currentPage === 'learning' || currentPage === 'lms') ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
            {/* View Content Area with Motion Fade Transition */}
            <main className="flex-1 w-full flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${currentRoomId}-${currentRoleKey || 'all'}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="flex-1 flex flex-col min-h-0 w-full h-full"
                >
                  {renderCurrentView()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>

      {/* Global Interactive Modals & Drawers */}

      {/* 1. Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        rooms={rooms}
        onSelectTask={(task) => {
          setSelectedTask(task);
          setIsCommandPaletteOpen(false);
        }}
        onOpenTask={(task) => {
          setSelectedTask(task);
          setIsCommandPaletteOpen(false);
        }}
        onNavigate={(page, params) => {
          handleNavigate(page, params);
          setIsCommandPaletteOpen(false);
        }}
        onOpenNewTask={() => {
          setIsCommandPaletteOpen(false);
          setIsNewTaskModalOpen(true);
        }}
      />

      {/* 2. New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        rooms={rooms}
        onAddTask={handleCreateTask}
        onSubmit={handleCreateTask}
        currentRoomId={currentRoomId}
        currentRoleKey={currentRoleKey}
      />

      {/* 3. Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
        onNavigateRole={(role) => handleNavigate('role', { role })}
      />

      {/* Floating Micro-Toast Feedback System */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0A2540] text-white shadow-xl shadow-[#0A2540]/20 text-xs font-medium border border-white/10"
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#0F8E82] shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#C4562B] shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#1E6FD9] shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
