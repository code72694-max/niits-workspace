import React from 'react';
import { motion } from 'motion/react';
import { FileText, Download, ExternalLink, MoreVertical, Plus } from 'lucide-react';

export interface FolderBadge {
  type: 'drive' | 'notion' | 'sharepoint' | 'figma' | 'pdf' | 'github';
  label?: string;
}

export type SupportedExtType = 'pdf' | 'doc' | 'md' | 'img' | 'fig' | 'json' | 'code';

export interface FileExtensionInfo {
  key: SupportedExtType;
  label: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
}

export interface FolderItem {
  id: string;
  name: string;
  fileCount: number;
  badges: FolderBadge[];
  description?: string;
  updatedAt?: string;
  hasDocuments?: boolean;
  sampleTypes?: string[];
  files?: Array<{
    id: string;
    name: string;
    size: string;
    type: 'pdf' | 'figma' | 'doc' | 'json' | 'image' | 'code';
    updated: string;
    author: string;
  }>;
}

export const EXT_INFO_MAP: Record<SupportedExtType, FileExtensionInfo> = {
  pdf: {
    key: 'pdf',
    label: 'PDF',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
    accentColor: '#EF4444'
  },
  doc: {
    key: 'doc',
    label: 'DOC',
    badgeBg: '#DBEAFE',
    badgeText: '#1D4ED8',
    accentColor: '#2563EB'
  },
  md: {
    key: 'md',
    label: 'MD',
    badgeBg: '#EDE9FE',
    badgeText: '#6D28D9',
    accentColor: '#7C3AED'
  },
  img: {
    key: 'img',
    label: 'IMG',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    accentColor: '#16A34A'
  },
  fig: {
    key: 'fig',
    label: 'FIG',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    accentColor: '#EA580C'
  },
  json: {
    key: 'json',
    label: 'JSON',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    accentColor: '#0284C7'
  },
  code: {
    key: 'code',
    label: 'CODE',
    badgeBg: '#F1F5F9',
    badgeText: '#334155',
    accentColor: '#475569'
  }
};

export function parseFileExtension(fileName?: string, fileType?: string): SupportedExtType {
  const name = (fileName || '').toLowerCase().trim();
  const type = (fileType || '').toLowerCase().trim();

  if (name.endsWith('.pdf') || type === 'pdf') return 'pdf';
  if (name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.word') || type === 'doc' || type === 'word') return 'doc';
  if (name.endsWith('.md') || name.endsWith('.markdown') || type === 'md') return 'md';
  if (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.svg') ||
    name.endsWith('.webp') ||
    name.endsWith('.gif') ||
    type === 'image' ||
    type === 'img'
  ) {
    return 'img';
  }
  if (name.endsWith('.fig') || type === 'figma' || type === 'fig') return 'fig';
  if (name.endsWith('.json') || type === 'json') return 'json';
  if (
    name.endsWith('.ts') ||
    name.endsWith('.tsx') ||
    name.endsWith('.js') ||
    name.endsWith('.jsx') ||
    name.endsWith('.yml') ||
    name.endsWith('.yaml') ||
    type === 'code'
  ) {
    return 'code';
  }

  return 'doc';
}

export function getFolderFileExtensions(folder: FolderItem): FileExtensionInfo[] {
  const set = new Set<SupportedExtType>();

  if (folder.files && folder.files.length > 0) {
    for (const f of folder.files) {
      set.add(parseFileExtension(f.name, f.type));
      if (set.size >= 3) break;
    }
  } else if (folder.sampleTypes && folder.sampleTypes.length > 0) {
    for (const st of folder.sampleTypes) {
      set.add(parseFileExtension(st, st));
      if (set.size >= 3) break;
    }
  } else {
    // If no explicit files, fallback to sensible combinations based on folder badges
    if (folder.badges.some(b => b.type === 'pdf')) set.add('pdf');
    if (folder.badges.some(b => b.type === 'figma')) set.add('fig');
    if (folder.badges.some(b => b.type === 'drive')) set.add('doc');
    if (folder.badges.some(b => b.type === 'notion')) set.add('md');
    if (set.size === 0) set.add('pdf');
  }

  const keys = Array.from(set).slice(0, 3);
  return keys.map((key) => EXT_INFO_MAP[key] || EXT_INFO_MAP['doc']);
}

interface SubtractedFolderCardProps {
  folder: FolderItem;
  isSelected?: boolean;
  onClick?: () => void;
}

export const SubtractedFolderCard: React.FC<SubtractedFolderCardProps> = ({
  folder,
  isSelected = false,
  onClick
}) => {
  // Determine if documents should peek out: false if folder is empty (0 files) or explicitly hasDocuments: false
  const showDocuments = folder.fileCount > 0 && folder.hasDocuments !== false;

  // Distinct file extensions inside this folder (max 3)
  const detectedExtensions = showDocuments ? getFolderFileExtensions(folder) : [];

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex flex-col items-center p-6 rounded-3xl cursor-pointer transition-all duration-200 select-none ${
        isSelected 
          ? 'bg-[#E7E9ED] ring-2 ring-[#0F172A]/10 shadow-sm' 
          : 'bg-[#F2F3F5] hover:bg-[#E9EBEF] hover:shadow-sm'
      }`}
    >
      {/* Folder Graphic Illustration with Subtracted Notch */}
      <div className="relative w-[180px] h-[130px] flex items-center justify-center my-2">
        {/* SVG Container for the entire folder structure */}
        <svg
          viewBox="0 0 180 130"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
        >
          <defs>
            {/* Folder Back Gradient */}
            <linearGradient id={`backGrad-${folder.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3C3F46" />
              <stop offset="100%" stopColor="#2A2C31" />
            </linearGradient>

            {/* Folder Front Flap Gradient */}
            <linearGradient id={`frontGrad-${folder.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#555861" />
              <stop offset="100%" stopColor="#41444C" />
            </linearGradient>

            {/* Document Shadow */}
            <filter id={`paperShadow-${folder.id}`} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* 1. Back Plate of Folder with Realistic Tab Shape */}
          <path
            d="
              M 8 28
              A 14 14 0 0 1 22 14
              H 62
              A 12 12 0 0 1 74 22
              A 14 14 0 0 0 86 28
              H 158
              A 14 14 0 0 1 172 42
              V 104
              A 16 16 0 0 1 156 120
              H 24
              A 16 16 0 0 1 8 104
              Z
            "
            fill={`url(#backGrad-${folder.id})`}
            stroke="#454850"
            strokeWidth="0.75"
          />

          {/* Back Plate Subtle Top Highlight */}
          <path
            d="
              M 22 14.5
              H 62
              A 12 12 0 0 1 74 22.5
              A 14 14 0 0 0 86 28.5
              H 158
            "
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.6"
            strokeOpacity="0.2"
          />

          {/* Empty Folder Inner Pocket Depth */}
          {!showDocuments && (
            <path
              d="
                M 14 32
                H 66
                C 76 32, 82 38, 90 42
                H 166
                V 64
                H 14
                Z
              "
              fill="#1C1E23"
              opacity="0.5"
            />
          )}

          {/* 2. Documents Peeking Out From Inside (Only when NOT empty, showing up to 3 distinct file extension labels) */}
          {showDocuments && detectedExtensions.length > 0 && (
            <g>
              {/* If only 1 file type, show a subtle background sheet for visual depth */}
              {detectedExtensions.length === 1 && (
                <g transform="translate(54, 9) rotate(-4)">
                  <rect
                    x="0"
                    y="0"
                    width="60"
                    height="68"
                    rx="6"
                    fill="#F8FAFC"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                  />
                  <rect x="8" y="14" width="30" height="2" rx="1" fill="#E2E8F0" />
                  <rect x="8" y="20" width="40" height="2" rx="1" fill="#E2E8F0" />
                  <rect x="8" y="26" width="34" height="2" rx="1" fill="#E2E8F0" />
                </g>
              )}

              {detectedExtensions.map((ext, idx) => {
                const total = detectedExtensions.length;
                let transform = 'translate(62, 6) rotate(1)';
                let width = 62;
                let height = 70;

                if (total === 3) {
                  if (idx === 0) {
                    transform = 'translate(22, 10) rotate(-6)';
                    width = 58;
                    height = 68;
                  } else if (idx === 1) {
                    transform = 'translate(66, 5) rotate(2)';
                    width = 62;
                    height = 72;
                  } else {
                    transform = 'translate(108, 14) rotate(8)';
                    width = 52;
                    height = 64;
                  }
                } else if (total === 2) {
                  if (idx === 0) {
                    transform = 'translate(36, 8) rotate(-5)';
                    width = 60;
                    height = 70;
                  } else {
                    transform = 'translate(86, 6) rotate(3)';
                    width = 62;
                    height = 72;
                  }
                } else if (total === 1) {
                  transform = 'translate(62, 6) rotate(1)';
                  width = 64;
                  height = 72;
                }

                const badgeW = 32;
                const badgeH = 15;
                const badgeX = Math.round((width - badgeW) / 2);
                const badgeY = 7;

                return (
                  <g key={`${ext.key}-${idx}`} transform={transform}>
                    {/* Paper Sheet */}
                    <rect
                      x="0"
                      y="0"
                      width={width}
                      height={height}
                      rx="6"
                      fill="#FFFFFF"
                      filter={`url(#paperShadow-${folder.id})`}
                      stroke="#E2E8F0"
                      strokeWidth="0.8"
                    />

                    {/* Paper Top Extension Badge (PDF, DOC, MD, IMG, FIG, etc.) */}
                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={badgeW}
                      height={badgeH}
                      rx="4"
                      fill={ext.badgeBg}
                      stroke={ext.accentColor}
                      strokeWidth="0.75"
                      strokeOpacity="0.6"
                    />
                    <text
                      x={badgeX + badgeW / 2}
                      y={badgeY + 10.5}
                      textAnchor="middle"
                      fontSize="7.5"
                      fontWeight="bold"
                      fill={ext.badgeText}
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                      letterSpacing="0.4"
                    >
                      {ext.label}
                    </text>

                    {/* Distinctive Document Lines or Visual Elements tailored to type */}
                    {ext.key === 'pdf' && (
                      <g>
                        <rect x="7" y="26" width="3.5" height="3.5" rx="0.8" fill="#EF4444" />
                        <rect x="13" y="27" width={Math.max(16, width - 20)} height="2" rx="1" fill="#CBD5E1" />
                        <rect x="7" y="33" width={Math.max(20, width - 14)} height="2" rx="1" fill="#E2E8F0" />
                        <rect x="7" y="39" width={Math.max(16, width - 22)} height="2" rx="1" fill="#E2E8F0" />
                        <rect x="7" y="45" width={Math.max(18, width - 16)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}

                    {ext.key === 'doc' && (
                      <g>
                        <rect x="7" y="26" width="3.5" height="3.5" rx="0.8" fill="#2563EB" />
                        <rect x="13" y="27" width={Math.max(16, width - 20)} height="2" rx="1" fill="#93C5FD" />
                        <rect x="7" y="33" width={Math.max(20, width - 14)} height="2" rx="1" fill="#E2E8F0" />
                        <rect x="7" y="39" width={Math.max(18, width - 18)} height="2" rx="1" fill="#E2E8F0" />
                        <rect x="7" y="45" width={Math.max(14, width - 24)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}

                    {ext.key === 'md' && (
                      <g>
                        <rect x="7" y="26" width="4" height="4" rx="0.8" fill="#7C3AED" />
                        <rect x="14" y="27" width={Math.max(14, width - 21)} height="2" rx="1" fill="#C4B5FD" />
                        <circle cx="9" cy="35" r="1.3" fill="#A78BFA" />
                        <rect x="13" y="34" width={Math.max(16, width - 20)} height="2" rx="1" fill="#E2E8F0" />
                        <circle cx="9" cy="41" r="1.3" fill="#A78BFA" />
                        <rect x="13" y="40" width={Math.max(14, width - 24)} height="2" rx="1" fill="#E2E8F0" />
                        <rect x="7" y="47" width={Math.max(16, width - 18)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}

                    {ext.key === 'img' && (
                      <g>
                        <rect
                          x="6"
                          y="25"
                          width={Math.max(28, width - 12)}
                          height="22"
                          rx="3"
                          fill="#F0FDF4"
                          stroke="#86EFAC"
                          strokeWidth="0.8"
                        />
                        <circle cx="12" cy="31" r="2.2" fill="#FBBF24" />
                        <polygon points="8,44 17,34 26,44" fill="#4ADE80" opacity="0.8" />
                        <polygon points="16,44 25,37 34,44" fill="#22C55E" opacity="0.7" />
                        <rect x="7" y="49" width={Math.max(16, width - 18)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}

                    {ext.key === 'fig' && (
                      <g>
                        <rect
                          x="6"
                          y="25"
                          width={Math.max(16, (width - 16) / 2)}
                          height="20"
                          rx="2.5"
                          fill="#FFF7ED"
                          stroke="#FDBA74"
                          strokeWidth="0.8"
                        />
                        <rect
                          x={6 + Math.max(16, (width - 16) / 2) + 3}
                          y="25"
                          width={Math.max(16, (width - 16) / 2)}
                          height="20"
                          rx="2.5"
                          fill="#FFF7ED"
                          stroke="#FDBA74"
                          strokeWidth="0.8"
                        />
                        <rect x="9" y="29" width="9" height="2" rx="0.5" fill="#FB923C" />
                        <rect x="9" y="34" width="7" height="1.5" rx="0.5" fill="#FED7AA" />
                        <rect x="7" y="48" width={Math.max(16, width - 18)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}

                    {ext.key === 'json' && (
                      <g>
                        <text x="7" y="32" fontSize="7.5" fontWeight="bold" fill="#0284C7" fontFamily="monospace">
                          {'{'}
                        </text>
                        <rect x="13" y="30" width={Math.max(14, width - 20)} height="2" rx="1" fill="#38BDF8" />
                        <rect x="13" y="36" width={Math.max(12, width - 24)} height="2" rx="1" fill="#BAE6FD" />
                        <text x="7" y="44" fontSize="7.5" fontWeight="bold" fill="#0284C7" fontFamily="monospace">
                          {'}'}
                        </text>
                        <rect x="7" y="49" width={Math.max(16, width - 18)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}

                    {ext.key === 'code' && (
                      <g>
                        <text x="6" y="31" fontSize="6" fontWeight="bold" fill="#475569" fontFamily="monospace">
                          &lt;/&gt;
                        </text>
                        <rect x="18" y="29" width={Math.max(14, width - 24)} height="2" rx="1" fill="#94A3B8" />
                        <rect x="12" y="35" width={Math.max(16, width - 20)} height="2" rx="1" fill="#CBD5E1" />
                        <rect x="12" y="41" width={Math.max(12, width - 24)} height="2" rx="1" fill="#E2E8F0" />
                        <rect x="7" y="47" width={Math.max(16, width - 18)} height="2" rx="1" fill="#E2E8F0" />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 3. Front Flap of Folder with Subtracted Cutout Curve */}
          <path
            d="
              M 8 44
              A 14 14 0 0 1 22 30
              H 70
              A 16 16 0 0 1 84 42
              A 16 16 0 0 0 98 54
              H 158
              A 14 14 0 0 1 172 68
              V 104
              A 16 16 0 0 1 156 120
              H 24
              A 16 16 0 0 1 8 104
              Z
            "
            fill={`url(#frontGrad-${folder.id})`}
            stroke="#686C77"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />

          {/* Front Flap Top Subtle Highlight Line */}
          <path
            d="
              M 22 30.5
              H 70
              A 16 16 0 0 1 84 42.5
              A 16 16 0 0 0 98 54.5
              H 158
            "
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.25"
          />
        </svg>

        {/* 4. Overlapping Platform Integration Badges at Bottom-Left */}
        <div className="absolute left-4 bottom-3 flex items-center -space-x-1.5 z-10">
          {folder.badges.map((badge, idx) => (
            <div
              key={idx}
              className="w-5 h-5 rounded-full flex items-center justify-center bg-white border border-[#3A3D44] shadow-xs overflow-hidden"
              title={badge.type.toUpperCase()}
            >
              {badge.type === 'drive' && (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5z" fill="#0066DA" />
                  <path d="M16.29 3.5H7.71l6.57 11.5h8.57z" fill="#00AC47" />
                  <path d="M22.85 15l-3.43 6H4.58L8.01 15z" fill="#FFBA00" />
                </svg>
              )}
              {badge.type === 'notion' && (
                <div className="w-full h-full bg-[#191919] flex items-center justify-center text-white font-serif font-bold text-[10px]">
                  N
                </div>
              )}
              {badge.type === 'sharepoint' && (
                <div className="w-full h-full bg-[#0078D4] flex items-center justify-center text-white font-bold text-[9px]">
                  S
                </div>
              )}
              {badge.type === 'figma' && (
                <svg viewBox="0 0 38 57" className="w-3 h-3">
                  <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
                  <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/>
                  <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262"/>
                  <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
                  <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
                </svg>
              )}
              {badge.type === 'github' && (
                <div className="w-full h-full bg-[#24292F] flex items-center justify-center text-white font-bold text-[9px]">
                  Git
                </div>
              )}
              {badge.type === 'pdf' && (
                <div className="w-full h-full bg-[#DC2626] flex items-center justify-center text-white font-bold text-[8px]">
                  PDF
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Folder Name and File Count Below */}
      <div className="mt-3 text-center w-full">
        <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight truncate group-hover:text-[#1E6FD9] transition-colors">
          {folder.name}
        </h4>
        <div className="flex items-center justify-center gap-1.5 mt-0.5 text-xs text-[#64748B] font-medium flex-wrap">
          <span>{folder.fileCount} Files</span>
          {showDocuments && detectedExtensions.length > 0 && (
            <>
              <span className="text-[#CBD5E1]">•</span>
              <span className="text-[#1E6FD9] font-semibold text-[11px]">
                {detectedExtensions.map((e) => e.label).join(', ')}
              </span>
            </>
          )}
          {!showDocuments && (
            <>
              <span className="text-[#CBD5E1]">•</span>
              <span className="text-[#94A3B8] text-[11px]">Kosong</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

