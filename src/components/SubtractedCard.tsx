import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export interface SubtractedCardProps {
  id?: string;
  avatarUrl?: string;
  avatarFallback?: string;
  avatarBg?: string;
  title: string;
  subtitle: string;
  sourceLabel?: string;
  tags: string[];
  statusLabel?: string;
  ratingLevel?: number; // 1 to 5, or 0 to hide
  showRatingDots?: boolean;
  onClick?: () => void;
  onActionClick?: (e: React.MouseEvent) => void;
  actionTitle?: string;
  className?: string;
}

export const SubtractedCard: React.FC<SubtractedCardProps> = ({
  avatarUrl,
  avatarFallback,
  avatarBg = '#1E6FD9',
  title,
  subtitle,
  sourceLabel = 'Source',
  tags = [],
  statusLabel,
  ratingLevel = 5,
  showRatingDots = true,
  onClick,
  onActionClick,
  actionTitle = 'Buka Detail',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 320, h: 240 });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ w: clientWidth, h: clientHeight });
        }
      }
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dimensions;

  // Geometric parameters for the subtracted corner card
  // Tuned so the 52px circular button is tangent to the top and right edges, cradled by a smooth curve
  const R_CORNER = 32;    // Outer card corners (top-left, bottom-left, bottom-right)
  const NOTCH_W = 92;     // Notch cutout width from right edge
  const NOTCH_H = 64;     // Depth of the shelf from top edge (12px clearance under 52px button)
  const R_SHOULDER = 30;  // Convex arc transitioning smoothly down from top edge
  const R_VALLEY = 30;    // Concave inverted arc transitioning smoothly into horizontal shelf
  const R_RIGHT = 32;     // Generous 32px rounded transition into right edge

  // Calculate safe coordinates ensuring curves never cross even on compact widths
  const shoulderStartX = Math.max(R_CORNER + 40, w - NOTCH_W - R_SHOULDER);
  const shoulderEndX = Math.max(R_CORNER + 40 + R_SHOULDER, w - NOTCH_W);
  const valleyEndX = Math.max(shoulderEndX, w - NOTCH_W + R_VALLEY);
  const rightCornerStartX = Math.max(valleyEndX, w - R_RIGHT);

  // Generate the mathematically precise, tangent-continuous subtracted path
  const pathD = `
    M ${R_CORNER} 0
    H ${shoulderStartX}
    A ${R_SHOULDER} ${R_SHOULDER} 0 0 1 ${shoulderEndX} ${R_SHOULDER}
    A ${R_VALLEY} ${R_VALLEY} 0 0 0 ${valleyEndX} ${NOTCH_H}
    H ${rightCornerStartX}
    A ${R_RIGHT} ${R_RIGHT} 0 0 1 ${w} ${NOTCH_H + R_RIGHT}
    V ${Math.max(NOTCH_H + R_RIGHT, h - R_CORNER)}
    A ${R_CORNER} ${R_CORNER} 0 0 1 ${w - R_CORNER} ${h}
    H ${R_CORNER}
    A ${R_CORNER} ${R_CORNER} 0 0 1 0 ${h - R_CORNER}
    V ${R_CORNER}
    A ${R_CORNER} ${R_CORNER} 0 0 1 ${R_CORNER} 0
    Z
  `;

  // 5 Rating dots colors exactly like the user's reference image
  const dotColors = ['#F87171', '#FB923C', '#FBBF24', '#86EFAC', '#4ADE80'];

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative h-[240px] w-full select-none cursor-pointer group transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {/* Exact SVG Background with Subtracted Corner and Inverted Radius Fillet */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: 'drop-shadow(0 10px 25px rgba(15, 23, 42, 0.06)) drop-shadow(0 2px 4px rgba(15, 23, 42, 0.03))'
        }}
      >
        <path
          d={pathD}
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth="1"
          className="transition-colors group-hover:stroke-[#CBD5E1]"
        />
      </svg>

      {/* Circular Action Button Nestled in the Cutout Notch - Flush with Top Edge */}
      <button
        type="button"
        title={actionTitle}
        onClick={(e) => {
          e.stopPropagation();
          if (onActionClick) {
            onActionClick(e);
          } else if (onClick) {
            onClick();
          }
        }}
        className="absolute top-0 right-0 w-[52px] h-[52px] rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#1E293B] hover:text-[#1E6FD9] hover:border-[#1E6FD9] hover:shadow-md hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer group/btn"
      >
        <ArrowUpRight className="w-5 h-5 text-[#1E293B] group-hover/btn:text-[#1E6FD9] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
      </button>

      {/* Card Body Content */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full">
        {/* Top: Avatar */}
        <div className="flex items-center justify-between">
          <div className="relative">
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs border-2 border-white"
                style={{ backgroundColor: avatarBg }}
              >
                {avatarFallback || title.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Name & Title */}
        <div className="mt-3">
          <h4 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight truncate group-hover:text-[#1E6FD9] transition-colors">
            {title}
          </h4>
          <p className="text-xs text-[#64748B] font-normal truncate mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Bottom Section: Source Tags (Left) and Status / Rating Dots (Right) */}
        <div className="mt-3 pt-2 flex items-end justify-between gap-2 border-t border-[#F1F5F9]/80">
          {/* Left: Source Label and Pills */}
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-[#94A3B8] font-medium block mb-1">
              {sourceLabel}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap max-h-[54px] overflow-hidden">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-0.5 sm:py-1 rounded-full bg-white border border-[#E2EAF3] text-[#475569] text-[11px] font-medium whitespace-nowrap shadow-2xs group-hover:border-[#CBD5E1] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Status Label and Rating Indicator Dots */}
          {(statusLabel || (showRatingDots && ratingLevel > 0)) && (
            <div className="shrink-0 flex flex-col items-end pb-0.5">
              {statusLabel && (
                <span className="text-[11px] font-semibold text-[#475569] flex items-center gap-1 mb-1 whitespace-nowrap">
                  {statusLabel}
                </span>
              )}
              {showRatingDots && ratingLevel > 0 && (
                <div className="flex items-center gap-1 p-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const isActive = i < ratingLevel;
                    return (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full transition-all"
                        style={{
                          backgroundColor: isActive ? dotColors[i] : '#CBD5E1'
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
