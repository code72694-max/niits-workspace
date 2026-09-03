import React from 'react';
import { motion } from 'motion/react';
import { Task, Room, RoleKey } from '../types';
import { NewCaseManagementCard } from '../components/NewCaseManagementCard';

interface DashboardViewProps {
  tasks: Task[];
  rooms: Room[];
  onOpenTask: (task: Task) => void;
  onNavigate: (page: string, params?: { room?: string; role?: RoleKey }) => void;
  onOpenNewTask: () => void;
  onOpenPalette?: () => void;
  unreadNotificationsCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  rooms,
  onOpenTask,
  onNavigate,
  onOpenNewTask,
  onOpenPalette,
  unreadNotificationsCount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col min-h-0 w-full h-full"
    >
      {/* ========================================================================= */}
      {/* MAIN WORKFLOW CONTAINER: "New Case Management" with all internal views    */}
      {/* ========================================================================= */}
      <NewCaseManagementCard
        tasks={tasks}
        rooms={rooms}
        onOpenNewTask={onOpenNewTask}
        onNavigate={onNavigate}
        onOpenTask={onOpenTask}
        onOpenPalette={onOpenPalette}
        unreadNotificationsCount={unreadNotificationsCount}
      />
    </motion.div>
  );
};

