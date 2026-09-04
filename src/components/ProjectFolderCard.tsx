import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Room, Task } from '../types';

export interface CoverConfig {
  type: 'gradient' | 'image';
  value: string;
  name?: string;
}

interface ProjectFolderCardProps {
  room: Room;
  tasks: Task[];
  cover: CoverConfig;
  onSelectProject: (roomId: string, tab?: 'dashboard' | 'board' | 'calendar' | 'docs') => void;
  onChangeCover?: (roomId: string) => void;
  className?: string;
}

export const ProjectFolderCard: React.FC<ProjectFolderCardProps> = ({
  room,
  tasks,
  cover,
  onSelectProject,
  onChangeCover,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 280, h: 250 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ w: clientWidth, h: clientHeight });
        }
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const { w, h } = dimensions;

  // Exact Folder Tab Silhouette Geometry
  // Top tab at y=68px, shelf at y=96px, connected by an exact tangent S-curve
  const R_CORNER = 20;
  const Y_TAB = 68;
  const Y_SHELF = 96;
  const R_FILLET = 14; // 14 * 2 = 28px delta height for perfect C1 continuity
  const TAB_W = Math.round(Math.max(110, Math.min(w * 0.52, 160)));

  // Inner SVG Flap: path draws only the folder partition/flap.
  // We do NOT draw overlapping borders on the outer card edges (left/right/bottom)
  // to prevent thicker borders on some sides! The outer wrapper border handles the container.
  const pathD = `
    M -1 ${Y_TAB + 12}
    A 12 12 0 0 1 11 ${Y_TAB}
    H ${TAB_W - R_FILLET}
    A ${R_FILLET} ${R_FILLET} 0 0 1 ${TAB_W} ${Y_TAB + R_FILLET}
    A ${R_FILLET} ${R_FILLET} 0 0 0 ${TAB_W + R_FILLET} ${Y_SHELF}
    H ${w + 1}
    V ${h + 1}
    H -1
    Z
  `;

  // Top dividing contour line of the folder flap with exact 1px minimalist stroke
  const strokeLineD = `
    M 0 ${Y_TAB + 12}
    A 12 12 0 0 1 11 ${Y_TAB}
    H ${TAB_W - R_FILLET}
    A ${R_FILLET} ${R_FILLET} 0 0 1 ${TAB_W} ${Y_TAB + R_FILLET}
    A ${R_FILLET} ${R_FILLET} 0 0 0 ${TAB_W + R_FILLET} ${Y_SHELF}
    H ${w}
  `;

  // Project task statistics
  const roomTasks = tasks.filter(t => t.roomId === room.id);
  const finishedTasks = roomTasks.filter(t => t.status === 'selesai').length;
  const totalCount = roomTasks.length > 0 ? roomTasks.length : room.tugas;
  const progressPct = totalCount > 0 
    ? Math.round((finishedTasks / totalCount) * 100) 
    : Math.round((room.selesai / room.tugas) * 100);

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectProject(room.id, 'dashboard')}
      className={`relative h-[212px] w-full max-w-[340px] mx-auto rounded-[20px] overflow-hidden border border-[#E2E8F0] cursor-pointer select-none group transition-all duration-200 hover:-translate-y-1 bg-white shadow-2xs ${className}`}
    >
      {/* 1. Background Cover Banner (Gradient or Image) */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        {cover.type === 'gradient' ? (
          <div 
            className="w-full h-[125px] transition-all duration-300"
            style={{ background: cover.value }}
          />
        ) : (
          <img
            src={cover.value}
            alt={room.nama}
            referrerPolicy="no-referrer"
            className="w-full h-[125px] object-cover"
          />
        )}
      </div>

      {/* 2. Clean White Folder Flap Silhouette (SVG Cutout with Minimalist Gray Border) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        {/* Fill White with 0 border bleed */}
        <path
          d={pathD}
          fill="#FFFFFF"
        />
        {/* Crisp, uniform 1px outline contour along the tab curve */}
        <path
          d={strokeLineD}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1"
          className="transition-colors group-hover:stroke-[#CBD5E1]"
        />
      </svg>

      {/* 3. Folder Flap Content: Project title & subtitle in bottom-left above task count and line */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-3.5 pointer-events-none">
        {/* Title & Subtitle: at the bottom left, above task count and divider line */}
        <div className="mb-2">
          <h4 className="text-[13.5px] font-semibold text-[#0F172A] tracking-tight leading-snug truncate group-hover:text-[#1E6FD9] transition-colors">
            {room.nama}
          </h4>
          <p className="text-[10.5px] text-[#64748B] font-normal truncate mt-0.5 leading-tight">
            {room.ringkas}
          </p>
        </div>

        {/* Bottom Section: "04 Tags" on left and "1012 Shots" / Progress on right */}
        <div className="flex items-end justify-between pt-2 border-t border-[#F1F5F9]">
          {/* Left: Big Number + Label (Matching "04 Tags") */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight font-mono">
              {String(totalCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">
              Tugas
            </span>
          </div>

          {/* Right: Progress / Shots style status */}
          <div className="flex items-center gap-1.5">
            <div className="text-right">
              <span className="text-xs font-semibold text-[#0F172A] font-mono block leading-none">
                {progressPct}%
              </span>
              <span className="text-[9.5px] text-[#64748B] font-normal block mt-0.5">
                {finishedTasks} Selesai
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-white group-hover:bg-[#1E6FD9] group-hover:border-[#1E6FD9] transition-all">
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
