import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className={`bg-white border border-[#E2EAF3] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 shadow-sm ${className}`}
    >
      <div className="relative mb-5">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -inset-2 rounded-full bg-[#E7F0FA] blur-md"
        />
        <div className="relative w-14 h-14 rounded-2xl bg-[#F4F8FD] border border-[#D7E6F5] flex items-center justify-center text-[#1E6FD9] shadow-sm">
          <Icon className="w-7 h-7 stroke-[1.8]" />
        </div>
      </div>

      <h3 className="text-[17px] font-semibold text-[#0A2540] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-[13.5px] text-[#5B7288] leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAction}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#6FC0EF] via-[#1E6FD9] to-[#12459C] text-white shadow-md shadow-[#1E6FD9]/20 hover:brightness-105 transition-all"
            >
              {actionText}
            </motion.button>
          )}
          {secondaryActionText && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSecondaryAction}
              className="px-4 py-2.5 rounded-full text-xs font-medium bg-[#F4F8FD] text-[#3C5A78] hover:bg-[#E7F0FA] transition-all"
            >
              {secondaryActionText}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};
