import { RoleKey } from '../types';

export interface MemberSkill {
  name: string;
  level: number; // 0 - 100%
  category: 'Core' | 'Framework' | 'Tools' | 'Methodology';
  experienceYears: number;
}

export interface MemberProject {
  id: string;
  name: string;
  code: string;
  roleInProject: string;
  period: string;
  status: 'Selesai' | 'Sedang Berjalan' | 'Perawatan';
  completedTasks: number;
  onTimePercent: number;
  deliverables: string;
  description: string;
  techStack: string[];
}

export interface TeamMemberProfile {
  id: string;
  name: string;
  roleTitle: string;
  discipline: RoleKey;
  departmentName: string;
  avatarUrl: string;
  avatarFallback: string;
  avatarBg: string;
  email: string;
  phone?: string;
  location: string;
  joinDate: string;
  statusAvailability: 'Aktif Sprint' | 'Tersedia' | 'Sedang Tinjauan' | 'Fokus Rilis';
  bio: string;
  
  // Card tags specifically for SubtractedCard under "Skill" or "Role" label
  cardSkillTags: string[];
  cardRoleTags: string[];
  
  // Performance stats
  performance: {
    onTimeRate: number; // e.g. 99.2%
    totalTasksCompleted: number;
    tasksOnTime: number;
    tasksDelayed: number;
    avgCycleTime: string;
    dodAcceptanceRate: number; // e.g. 99.5%
    sprintVelocity: string;
    ratingLevel: number; // 1 to 5
    statusLabel: string; // e.g. "🎯 99% Tepat Waktu"
    reviewScore: number; // 1 to 5, e.g. 4.9
    peerFeedbackCount: number;
  };

  // Detailed lists
  skills: MemberSkill[];
  projects: MemberProject[];
  recentAchievements?: string[];
}

export const TEAM_MEMBERS: TeamMemberProfile[] = [
  {
    id: 'm-dina',
    name: 'Dina Ayu',
    roleTitle: 'Lead UI/UX Designer & System Lead',
    discipline: 'ux',
    departmentName: 'Product Design & Research',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'DA',
    avatarBg: '#D9488B',
    email: 'dina@niits.id',
    phone: '+62 812-4421-9980',
    location: 'Bandung, Indonesia (WIB)',
    joinDate: 'Maret 2024',
    statusAvailability: 'Aktif Sprint',
    bio: 'Fokus pada arsitektur design tokens, riset usability berbasis data, dan standardisasi antarmuka WCAG AA. Memastikan konsistensi visual seluruh produk NIITS Studio.',
    cardSkillTags: ['Figma', 'Design Tokens', 'WCAG AA'],
    cardRoleTags: ['Lead UI/UX Designer', 'System Lead'],
    performance: {
      onTimeRate: 99.2,
      totalTasksCompleted: 148,
      tasksOnTime: 147,
      tasksDelayed: 1,
      avgCycleTime: '1.4 hari',
      dodAcceptanceRate: 99.5,
      sprintVelocity: '38 Poin / Sprint',
      ratingLevel: 5,
      statusLabel: '🎯 99.2% Tepat Waktu',
      reviewScore: 4.95,
      peerFeedbackCount: 34
    },
    skills: [
      { name: 'Figma Auto-Layout & Variants', level: 98, category: 'Core', experienceYears: 5 },
      { name: 'Design Tokens & Token Studio', level: 95, category: 'Core', experienceYears: 4 },
      { name: 'WCAG AA Accessibility', level: 92, category: 'Methodology', experienceYears: 4 },
      { name: 'Interactive Micro-Prototyping', level: 90, category: 'Tools', experienceYears: 3 },
      { name: 'Tailwind CSS Synchronization', level: 88, category: 'Framework', experienceYears: 3 },
      { name: 'Qualitative User Research & Usability Testing', level: 86, category: 'Methodology', experienceYears: 4 }
    ],
    projects: [
      {
        id: 'p-agro',
        name: 'AGRO E-Commerce Marketplace',
        code: 'A-01',
        roleInProject: 'Lead Product Designer',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 52,
        onTimePercent: 100,
        deliverables: 'Cyan Design System, 72 Halaman Responsif, Alur Checkout & Keranjang',
        description: 'Membangun arsitektur antarmuka marketplace hasil pertanian dari wireframe dasar hingga token warna cyan dan micro-interaction checkout.',
        techStack: ['Figma', 'Design Tokens', 'Tailwind', 'Zeroheight']
      },
      {
        id: 'p-smartfarm',
        name: 'Smart Farm IoT Mobile Telemetry',
        code: 'A-02',
        roleInProject: 'UI/UX Specialist',
        period: 'Okt 2025 - Jan 2026',
        status: 'Selesai',
        completedTasks: 38,
        onTimePercent: 97.4,
        deliverables: 'Dasbor Sensor Lapangan, Mode Gelap Malam Hari, Alur Peringatan Cuaca Ekstrem',
        description: 'Mendesain tata visual dasbor sensor kelembaban tanah dan monitoring cuaca dengan keterbacaan tinggi di luar ruangan.',
        techStack: ['Figma', 'Protopie', 'Mobile Usability']
      },
      {
        id: 'p-tokens',
        name: 'NIITS Unified Token System',
        code: 'CORE-DS',
        roleInProject: 'Design System Architect',
        period: 'Jul 2025 - Nov 2025',
        status: 'Selesai',
        completedTasks: 46,
        onTimePercent: 100,
        deliverables: 'Format JSON Token Multi-Platform, Plugin Figma Sync, Komponen Subtracted Card',
        description: 'Standarisasi seluruh token warna, tipografi modular 1.25 ratio, elevation curve, dan border-radius nesting rules.',
        techStack: ['Style Dictionary', 'Figma API', 'JSON Schema']
      }
    ],
    recentAchievements: [
      'Mempertahankan 100% serahan tepat waktu selama 4 sprint berturut-turut',
      'Merilis pustaka Subtracted Card Design yang diadopsi di 3 proyek utama',
      'Meraih skor kepuasan Definition of Done (DoD) tertinggi di divisi desain'
    ]
  },
  {
    id: 'm-bagas',
    name: 'Bagas Pratama',
    roleTitle: 'Frontend Architect & Web App Specialist',
    discipline: 'fe',
    departmentName: 'Frontend Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'BP',
    avatarBg: '#1E6FD9',
    email: 'bagas@niits.id',
    phone: '+62 813-8820-1123',
    location: 'Jakarta Selatan, Indonesia (WIB)',
    joinDate: 'Januari 2024',
    statusAvailability: 'Aktif Sprint',
    bio: 'Arsitek frontend spesialis React, TypeScript, dan performa rendering tinggi. Berpengalaman membangun dasbor analitik real-time dan modul interaktif responsif.',
    cardSkillTags: ['React', 'TypeScript', 'Tailwind CSS'],
    cardRoleTags: ['Frontend Architect', 'Web Specialist'],
    performance: {
      onTimeRate: 98.7,
      totalTasksCompleted: 162,
      tasksOnTime: 160,
      tasksDelayed: 2,
      avgCycleTime: '1.6 hari',
      dodAcceptanceRate: 99.1,
      sprintVelocity: '46 Poin / Sprint',
      ratingLevel: 5,
      statusLabel: '⚡ 98.7% Tepat Waktu',
      reviewScore: 4.9,
      peerFeedbackCount: 42
    },
    skills: [
      { name: 'React 18+ & Concurrent Rendering', level: 96, category: 'Core', experienceYears: 5 },
      { name: 'TypeScript Strict Mode & Generics', level: 94, category: 'Core', experienceYears: 4 },
      { name: 'Tailwind CSS & Token Mapping', level: 95, category: 'Framework', experienceYears: 4 },
      { name: 'Motion / Framer Motion Animations', level: 90, category: 'Framework', experienceYears: 3 },
      { name: 'State Management (Zustand & TanStack Query)', level: 92, category: 'Tools', experienceYears: 4 },
      { name: 'Web Performance Optimization (Lighthouse 95+)', level: 89, category: 'Methodology', experienceYears: 4 }
    ],
    projects: [
      {
        id: 'p-agro-fe',
        name: 'AGRO E-Commerce Marketplace',
        code: 'A-01',
        roleInProject: 'Lead Frontend Engineer',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 58,
        onTimePercent: 98.3,
        deliverables: 'Katalog Produk Multi-Filter, Checkout Wizard, Keranjang Real-time',
        description: 'Mengimplementasikan seluruh antarmuka web toko tani dengan performa render 60fps dan bundle size terkompresi.',
        techStack: ['React', 'TypeScript', 'Tailwind', 'Vite']
      },
      {
        id: 'p-workspace',
        name: 'NIITS Workspace Desktop Web',
        code: 'A-03',
        roleInProject: 'Core Frontend Architect',
        period: 'Nov 2025 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 64,
        onTimePercent: 100,
        deliverables: 'Siluet Subtracted Card SVG, Papan Kanban Responsif, File Explorer Folder',
        description: 'Mengembangkan arsitektur visual SVG matematis tangensial SubtractedCard dan dynamic folder preview dengan nol glitch.',
        techStack: ['React', 'SVG Calculus', 'Tailwind', 'Motion']
      },
      {
        id: 'p-bruno',
        name: 'Internal Bruno API Collection Runner',
        code: 'DEV-RUN',
        roleInProject: 'Frontend Specialist',
        period: 'Agu 2025 - Okt 2025',
        status: 'Selesai',
        completedTasks: 28,
        onTimePercent: 96.4,
        deliverables: 'Console Log Interaktif, Request Builder, Verifikasi Status Asersi',
        description: 'Membangun antarmuka uji coba endpoint API instan dengan preview JSON syntax highlight.',
        techStack: ['React', 'TypeScript', 'Web Workers']
      }
    ],
    recentAchievements: [
      'Menyelesaikan 160 tugas tepat waktu dari total 162 serahan',
      'Merancang kalkulasi kurva SVG SubtractedCard berpresisi tinggi',
      'Menurunkan First Contentful Paint (FCP) aplikasi hingga 35%'
    ]
  },
  {
    id: 'm-reza',
    name: 'Reza Fadhil',
    roleTitle: 'Senior Backend Engineer at Core',
    discipline: 'be',
    departmentName: 'Backend & Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'RF',
    avatarBg: '#0F8E82',
    email: 'reza@niits.id',
    phone: '+62 811-9032-4411',
    location: 'Yogyakarta, Indonesia (WIB)',
    joinDate: 'Februari 2024',
    statusAvailability: 'Aktif Sprint',
    bio: 'Spesialis sistem backend terdistribusi, transaksi konkurensi data tingkat tinggi, dan API resilient. Mengutamakan performa query PostgreSQL terindeks dan proteksi integritas data.',
    cardSkillTags: ['NestJS', 'PostgreSQL', 'Redis'],
    cardRoleTags: ['Senior Backend Engineer', 'Systems Lead'],
    performance: {
      onTimeRate: 97.9,
      totalTasksCompleted: 192,
      tasksOnTime: 188,
      tasksDelayed: 4,
      avgCycleTime: '1.8 hari',
      dodAcceptanceRate: 98.8,
      sprintVelocity: '48 Poin / Sprint',
      ratingLevel: 5,
      statusLabel: '🔥 97.9% Tepat Waktu',
      reviewScore: 4.88,
      peerFeedbackCount: 39
    },
    skills: [
      { name: 'NestJS & Node.js Architecture', level: 95, category: 'Framework', experienceYears: 5 },
      { name: 'PostgreSQL Indexing & Transactions', level: 93, category: 'Core', experienceYears: 5 },
      { name: 'Redis Caching & Pub/Sub', level: 90, category: 'Tools', experienceYears: 4 },
      { name: 'REST & GraphQL API Contract', level: 92, category: 'Core', experienceYears: 5 },
      { name: 'Prisma & Drizzle ORM', level: 88, category: 'Tools', experienceYears: 3 },
      { name: 'Event-Driven Architecture (Kafka/RabbitMQ)', level: 85, category: 'Methodology', experienceYears: 3 }
    ],
    projects: [
      {
        id: 'p-agro-be',
        name: 'AGRO Core Commerce Backend Engine',
        code: 'A-01',
        roleInProject: 'Lead Backend Engineer',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 72,
        onTimePercent: 97.2,
        deliverables: 'Mesin Lock Stok Keranjang, Payment Webhook Idempotency, 45 Endpoints',
        description: 'Membangun backend e-commerce berdaya tahan tinggi terhadap lonjakan flash sale dengan locking row PostgreSQL.',
        techStack: ['NestJS', 'PostgreSQL', 'Redis', 'Docker']
      },
      {
        id: 'p-iot-be',
        name: 'IoT Telemetry Data Pipeline',
        code: 'A-02',
        roleInProject: 'Systems Engineer',
        period: 'Sep 2025 - Jan 2026',
        status: 'Selesai',
        completedTasks: 44,
        onTimePercent: 100,
        deliverables: 'TimescaleDB Pipeline, MQTT Broker, Algoritma Deteksi Anomali Suhu',
        description: 'Arsitektur penyerapan jutaan titik data sensor pertanian per jam dengan konsumsi memori hemat.',
        techStack: ['Go', 'PostgreSQL', 'TimescaleDB', 'MQTT']
      },
      {
        id: 'p-auth',
        name: 'Enterprise RBAC & Token Rotation Gateway',
        code: 'SEC-GW',
        roleInProject: 'Senior Backend Engineer',
        period: 'Mei 2025 - Agu 2025',
        status: 'Selesai',
        completedTasks: 50,
        onTimePercent: 98.0,
        deliverables: 'JWT Rotation, Dual Session Revocation, IP Geofencing Policy',
        description: 'Pondasi sistem otentikasi multi-tenant dengan audit log tak terhapuskan.',
        techStack: ['Node.js', 'Redis', 'Argon2', 'Crypto']
      }
    ],
    recentAchievements: [
      'Mengoptimasi waktu respon API transaksi utama dari 240ms menjadi 38ms',
      'Meraih 188 tugas selesai tepat waktu sepanjang 12 sprint berturut-turut',
      'Memimpin standarisasi OpenAPI 3.0 specs di seluruh tim backend'
    ]
  },
  {
    id: 'm-sinta',
    name: 'Sinta Larasati',
    roleTitle: 'QA Lead & Security Gatekeeper',
    discipline: 'qa',
    departmentName: 'Quality Assurance & Compliance',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'SL',
    avatarBg: '#B7791F',
    email: 'sinta@niits.id',
    phone: '+62 812-7711-2090',
    location: 'Surabaya, Indonesia (WIB)',
    joinDate: 'Maret 2024',
    statusAvailability: 'Fokus Rilis',
    bio: 'Menjaga standar kualitas aplikasi tanpa kompromi. Memimpin otomatisasi pengujian E2E, verifikasi kriteria Definition of Done, serta stress testing dan pencegahan celah keamanan OWASP.',
    cardSkillTags: ['Cypress', 'Playwright', 'DoD Guard'],
    cardRoleTags: ['QA Lead', 'Security Gatekeeper'],
    performance: {
      onTimeRate: 99.5,
      totalTasksCompleted: 178,
      tasksOnTime: 177,
      tasksDelayed: 1,
      avgCycleTime: '1.2 hari',
      dodAcceptanceRate: 99.8,
      sprintVelocity: '40 Poin / Sprint',
      ratingLevel: 5,
      statusLabel: '🛡️ 99.5% Tepat Waktu',
      reviewScore: 4.96,
      peerFeedbackCount: 45
    },
    skills: [
      { name: 'Cypress & Playwright E2E Automation', level: 96, category: 'Tools', experienceYears: 5 },
      { name: 'Definition of Done (DoD) Verification', level: 98, category: 'Methodology', experienceYears: 4 },
      { name: 'OWASP Top 10 Security Audit', level: 91, category: 'Core', experienceYears: 4 },
      { name: 'API Automated Testing (Newman / Postman)', level: 94, category: 'Tools', experienceYears: 5 },
      { name: 'Load & Stress Testing (k6 / Artillery)', level: 89, category: 'Tools', experienceYears: 3 },
      { name: 'Regression Test Matrix Design', level: 95, category: 'Methodology', experienceYears: 5 }
    ],
    projects: [
      {
        id: 'p-qa-agro',
        name: 'AGRO E-Commerce Regression Suite',
        code: 'A-01',
        roleInProject: 'Lead QA Engineer',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 62,
        onTimePercent: 100,
        deliverables: '124 Automated E2E Test Cases, Smoke Test CI/CD Pipeline',
        description: 'Memastikan alur checkout pembayaran tanpa celah bug serta verifikasi kepatuhan data form pembeli.',
        techStack: ['Playwright', 'TypeScript', 'GitHub Actions', 'k6']
      },
      {
        id: 'p-sec-audit',
        name: 'Security Penetration & Hardening Audit',
        code: 'SEC-01',
        roleInProject: 'Security Gatekeeper',
        period: 'Nov 2025 - Des 2025',
        status: 'Selesai',
        completedTasks: 35,
        onTimePercent: 100,
        deliverables: 'Laporan Audit OWASP, Patch Mitigasi SQLi/XSS, Review Token Sanitasi',
        description: 'Audit mendalam proteksi celah otorisasi rusak (BOLA/IDOR) dan konfigurasi header CSP.',
        techStack: ['OWASP ZAP', 'Burp Suite', 'Postman']
      },
      {
        id: 'p-mobile-qa',
        name: 'Smart Farm Field Mobile Testing',
        code: 'A-02',
        roleInProject: 'Mobile QA Specialist',
        period: 'Agu 2025 - Nov 2025',
        status: 'Selesai',
        completedTasks: 42,
        onTimePercent: 97.6,
        deliverables: 'Matrix Pengujian 12 Perangkat Android/iOS, Pengujian Kondisi Offline',
        description: 'Validasi sinkronisasi data sensor ketika koneksi internet terputus dan tersambung kembali.',
        techStack: ['Appium', 'BrowserStack', 'Charles Proxy']
      }
    ],
    recentAchievements: [
      'Mencapai 99.5% ketepatan waktu verifikasi tugas rilis',
      'Menemukan dan mengamankan 4 potensi celah BOLA sebelum masuk tahap staging',
      'Membangun suite uji regresi Playwright yang berjalan 3x lebih cepat'
    ]
  },
  {
    id: 'm-fajar',
    name: 'Fajar Nugraha',
    roleTitle: 'DevOps & Cloud Infrastructure Lead',
    discipline: 'devops',
    departmentName: 'Cloud & Infrastructure',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'FN',
    avatarBg: '#4B5D75',
    email: 'fajar@niits.id',
    phone: '+62 813-2200-4581',
    location: 'Semarang, Indonesia (WIB)',
    joinDate: 'Mei 2024',
    statusAvailability: 'Aktif Sprint',
    bio: 'Mengelola siklus hidup deployment otomatis, infrastruktur cloud berkemampuan scale-out tinggi, dan observabilitas 24/7 dengan metrik terpusat.',
    cardSkillTags: ['Docker', 'Kubernetes', 'CI/CD Cloud'],
    cardRoleTags: ['DevOps Lead', 'Cloud Infrastructure'],
    performance: {
      onTimeRate: 98.1,
      totalTasksCompleted: 118,
      tasksOnTime: 116,
      tasksDelayed: 2,
      avgCycleTime: '1.5 hari',
      dodAcceptanceRate: 99.0,
      sprintVelocity: '36 Poin / Sprint',
      ratingLevel: 5,
      statusLabel: '🚀 98.1% Tepat Waktu',
      reviewScore: 4.87,
      peerFeedbackCount: 30
    },
    skills: [
      { name: 'Docker & Multi-Stage Containers', level: 96, category: 'Core', experienceYears: 5 },
      { name: 'Kubernetes & Helm Charts', level: 90, category: 'Tools', experienceYears: 4 },
      { name: 'GitHub Actions CI/CD Pipeline', level: 94, category: 'Tools', experienceYears: 4 },
      { name: 'Google Cloud Platform (GCP) & Cloud Run', level: 92, category: 'Core', experienceYears: 4 },
      { name: 'Terraform Infrastructure as Code', level: 86, category: 'Framework', experienceYears: 3 },
      { name: 'Prometheus & Grafana Observability', level: 88, category: 'Tools', experienceYears: 4 }
    ],
    projects: [
      {
        id: 'p-devops-gcp',
        name: 'GCP Zero-Downtime Pipeline',
        code: 'INFRA-01',
        roleInProject: 'DevOps Lead',
        period: 'Des 2025 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 38,
        onTimePercent: 100,
        deliverables: 'Pipeline Staging-to-Prod Otomatis, Rollback Instan, Secret Manager Sync',
        description: 'Menyusun alur rilis berkesinambungan dengan waktu deploy di bawah 3 menit tanpa gangguan layanan.',
        techStack: ['GitHub Actions', 'Docker', 'Google Cloud Run', 'Terraform']
      },
      {
        id: 'p-logging',
        name: 'Centralized Logging & Alerting System',
        code: 'OPS-LOG',
        roleInProject: 'Cloud Engineer',
        period: 'Okt 2025 - Des 2025',
        status: 'Selesai',
        completedTasks: 28,
        onTimePercent: 96.4,
        deliverables: 'Dasbor Grafana Real-Time, Integrasi Bot Peringatan Telegram, P99 Latency Monitor',
        description: 'Menyatukan jutaan log aplikasi ke dalam satu dasbor observabilitas yang dapat ditelusuri seketika.',
        techStack: ['Grafana', 'Loki', 'Prometheus', 'Telegram API']
      },
      {
        id: 'p-db-replica',
        name: 'Database Failover & Automated Backups',
        code: 'INFRA-DB',
        roleInProject: 'DevOps Architect',
        period: 'Jun 2025 - Sep 2025',
        status: 'Selesai',
        completedTasks: 32,
        onTimePercent: 96.9,
        deliverables: 'Read-Replica Sync, Point-in-Time Recovery, Retensi Enkripsi 30 Hari',
        description: 'Menerapkan replikasi data asinkronus dan uji coba simulasi bencana pemulihan.',
        techStack: ['PostgreSQL', 'Wal-G', 'Cloud Storage']
      }
    ],
    recentAchievements: [
      'Menjaga SLA uptime infrastruktur 99.98% selama 6 bulan terakhir',
      'Mengurangi durasi build image Docker dari 9 menit menjadi 1.5 menit',
      'Meraih 98.1% ketepatan waktu dalam penyelesaian tiket infrastruktur'
    ]
  },
  {
    id: 'm-nadia',
    name: 'Nadia Putri',
    roleTitle: 'Business Analyst & Product Strategist',
    discipline: 'ba',
    departmentName: 'Product & Business Strategy',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'NP',
    avatarBg: '#7A5AF8',
    email: 'nadia@niits.id',
    phone: '+62 811-3321-0099',
    location: 'Jakarta Barat, Indonesia (WIB)',
    joinDate: 'Januari 2024',
    statusAvailability: 'Aktif Sprint',
    bio: 'Menghubungkan ekspektasi bisnis klien dengan arsitektur teknis engineering. Ahli dalam penyusunan PRD, user stories dengan kriteria penerimaan terukur, dan pemetaan alur bisnis.',
    cardSkillTags: ['PRD & BRD', 'User Stories', 'Scrum Agile'],
    cardRoleTags: ['Lead Business Analyst', 'Product Strategist'],
    performance: {
      onTimeRate: 96.8,
      totalTasksCompleted: 98,
      tasksOnTime: 95,
      tasksDelayed: 3,
      avgCycleTime: '2.1 hari',
      dodAcceptanceRate: 98.5,
      sprintVelocity: '34 Poin / Sprint',
      ratingLevel: 4,
      statusLabel: '📈 96.8% Tepat Waktu',
      reviewScore: 4.82,
      peerFeedbackCount: 26
    },
    skills: [
      { name: 'Product Requirement Document (PRD)', level: 96, category: 'Core', experienceYears: 5 },
      { name: 'User Story Mapping & Acceptance Criteria', level: 94, category: 'Core', experienceYears: 4 },
      { name: 'Scrum & Agile Sprint Planning', level: 90, category: 'Methodology', experienceYears: 4 },
      { name: 'Business Process Modeling (BPMN)', level: 88, category: 'Methodology', experienceYears: 3 },
      { name: 'Stakeholder Interview & Product Strategy', level: 92, category: 'Core', experienceYears: 5 },
      { name: 'Data-Driven Feature Prioritization (RICE/MoSCoW)', level: 90, category: 'Methodology', experienceYears: 4 }
    ],
    projects: [
      {
        id: 'p-ba-agro',
        name: 'AGRO E-Commerce Merchant Expansion',
        code: 'A-01',
        roleInProject: 'Lead Business Analyst',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 36,
        onTimePercent: 97.2,
        deliverables: 'PRD v2.0, 54 User Stories Kriteria Penerimaan, Analisis Alur Payout Petani',
        description: 'Mendefinisikan spesifikasi kebutuhan teknis fitur bagi hasil dan verifikasi identitas petani mitra.',
        techStack: ['Notion', 'Miro', 'BPMN 2.0', 'Figma']
      },
      {
        id: 'p-smartfarm-ba',
        name: 'Smart Farm Field Adoption Discovery',
        code: 'A-02',
        roleInProject: 'Product Strategist',
        period: 'Sep 2025 - Des 2025',
        status: 'Selesai',
        completedTasks: 26,
        onTimePercent: 96.1,
        deliverables: 'Laporan Riset Lapangan 15 Gap Usability, Dokumen Bisnis Roadmap',
        description: 'Wawancara langsung dengan petani di Jawa Barat untuk merumuskan antarmuka IoT sederhana.',
        techStack: ['Miro', 'Google Sheets', 'PRD Framework']
      },
      {
        id: 'p-pricing',
        name: 'NIITS Workspace Enterprise Model',
        code: 'BIZ-PRC',
        roleInProject: 'Product Owner',
        period: 'Mei 2025 - Jul 2025',
        status: 'Selesai',
        completedTasks: 22,
        onTimePercent: 95.5,
        deliverables: 'Matriks Tier Fitur, Kalkulator ROI, Kebijakan Limit Kuota Workspace',
        description: 'Merumuskan paket berlangganan dan batasan pemakaian komputasi sesuai kapasitas cloud.',
        techStack: ['Spreadsheet Modeling', 'Competitive Analysis']
      }
    ],
    recentAchievements: [
      'Menyusun 54 User Stories tanpa revisi logika bisnis pada Sprint 12',
      'Meningkatkan kejelasan kriteria terima (Acceptance Criteria) hingga 98% persetujuan developer',
      'Mempertahankan 96.8% ketepatan waktu pengiriman dokumen PRD'
    ]
  },
  {
    id: 'm-hary',
    name: 'Hary Kurniawan',
    roleTitle: 'Lead Architect & Security Auditor',
    discipline: 'sec',
    departmentName: 'Architecture & Cyber Security',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'HK',
    avatarBg: '#12459C',
    email: 'hary@niits.id',
    phone: '+62 811-1002-3344',
    location: 'Bandung, Indonesia (WIB)',
    joinDate: 'November 2023',
    statusAvailability: 'Tersedia',
    bio: 'Direktur teknis dan lead arsitek keamanan sistem. Memastikan seluruh blueprint perangkat lunak memiliki ketahanan arsitektural jangka panjang, audit keamanan berkala, dan kepatuhan kepemilikan data.',
    cardSkillTags: ['OWASP Audit', 'System Architecture', 'Go & Rust'],
    cardRoleTags: ['Lead Architect', 'Security Auditor'],
    performance: {
      onTimeRate: 99.8,
      totalTasksCompleted: 214,
      tasksOnTime: 213,
      tasksDelayed: 1,
      avgCycleTime: '1.1 hari',
      dodAcceptanceRate: 99.9,
      sprintVelocity: '52 Poin / Sprint',
      ratingLevel: 5,
      statusLabel: '👑 99.8% Tepat Waktu',
      reviewScore: 4.99,
      peerFeedbackCount: 58
    },
    skills: [
      { name: 'Distributed System Architecture', level: 98, category: 'Core', experienceYears: 7 },
      { name: 'Cyber Security Auditing & Pentesting', level: 96, category: 'Core', experienceYears: 6 },
      { name: 'OWASP ASVS Compliance', level: 95, category: 'Methodology', experienceYears: 5 },
      { name: 'Go, Rust & High-Perf Concurrency', level: 92, category: 'Core', experienceYears: 4 },
      { name: 'Cryptographic Protocols & Key Mgmt', level: 94, category: 'Tools', experienceYears: 5 },
      { name: 'Code Review & Architectural Governance', level: 99, category: 'Methodology', experienceYears: 7 }
    ],
    projects: [
      {
        id: 'p-iso',
        name: 'ISO 27001 Security Readiness & RBAC',
        code: 'SEC-ISO',
        roleInProject: 'Chief Auditor',
        period: 'Okt 2025 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 54,
        onTimePercent: 100,
        deliverables: 'Standar Keamanan Enkripsi At-Rest & In-Transit, Penegakan Aturan RBAC',
        description: 'Audit arsitektur total ruang kerja untuk memenuhi standar sertifikasi keamanan internasional.',
        techStack: ['Vault', 'OpenID Connect', 'mTLS', 'PostgreSQL']
      },
      {
        id: 'p-core-mesh',
        name: 'Distributed Microservices Core Engine',
        code: 'CORE-ENG',
        roleInProject: 'Lead Architect',
        period: 'Mei 2025 - Sep 2025',
        status: 'Selesai',
        completedTasks: 76,
        onTimePercent: 100,
        deliverables: 'gRPC Service Mesh, Circuit Breaker Pattern, Distributed Tracing',
        description: 'Membangun komunikasi antar-layanan berlatensi di bawah 5 milidetik dengan isolasi kegagalan.',
        techStack: ['Go', 'gRPC', 'Envoy', 'Jaeger']
      },
      {
        id: 'p-agro-arch',
        name: 'AGRO E-Commerce Architecture Review',
        code: 'A-01',
        roleInProject: 'Supervisory Architect',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 48,
        onTimePercent: 99.1,
        deliverables: 'Architecture Decision Records (ADR 01-14), Threat Modeling Report',
        description: 'Memastikan model data dan transaksi order mampu menangani konkurensi ribuan keranjang serentak.',
        techStack: ['ADR', 'PostgreSQL', 'Cloud Run', 'C4 Model']
      }
    ],
    recentAchievements: [
      'Memimpin audit 214 serahan dengan tingkat ketepatan waktu 99.8%',
      'Memperkenalkan standar ADR (Architecture Decision Record) di seluruh organisasi',
      'Meraih predikat Top Reviewer dengan 100% kepuasan tim antar divisi'
    ]
  },
  {
    id: 'm-anisa',
    name: 'Anisa Rahma',
    roleTitle: 'Mobile App Specialist & Cross-Platform Lead',
    discipline: 'fe',
    departmentName: 'Mobile Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    avatarFallback: 'AR',
    avatarBg: '#0284C7',
    email: 'anisa@niits.id',
    phone: '+62 812-9011-8844',
    location: 'Malang, Indonesia (WIB)',
    joinDate: 'Juli 2024',
    statusAvailability: 'Aktif Sprint',
    bio: 'Pengembang aplikasi mobile dengan fokus pada offline-first sync, efisiensi konsumsi baterai, dan integrasi hardware Bluetooth / sensor. Mahir dalam ekosistem Flutter dan React Native.',
    cardSkillTags: ['Flutter', 'React Native', 'Offline-First'],
    cardRoleTags: ['Mobile Specialist', 'Cross-Platform Lead'],
    performance: {
      onTimeRate: 97.4,
      totalTasksCompleted: 94,
      tasksOnTime: 91,
      tasksDelayed: 3,
      avgCycleTime: '1.7 hari',
      dodAcceptanceRate: 98.6,
      sprintVelocity: '38 Poin / Sprint',
      ratingLevel: 4,
      statusLabel: '📱 97.4% Tepat Waktu',
      reviewScore: 4.85,
      peerFeedbackCount: 22
    },
    skills: [
      { name: 'Flutter & Dart Mobile Development', level: 94, category: 'Core', experienceYears: 4 },
      { name: 'React Native & Expo Modules', level: 90, category: 'Framework', experienceYears: 3 },
      { name: 'Offline-First SQLite / WatermelonDB', level: 92, category: 'Tools', experienceYears: 4 },
      { name: 'Bluetooth Low Energy (BLE) IoT Sync', level: 88, category: 'Core', experienceYears: 3 },
      { name: 'App Store & Play Store CI/CD Release', level: 86, category: 'Tools', experienceYears: 3 },
      { name: 'Mobile Push Notifications (FCM/OneSignal)', level: 89, category: 'Tools', experienceYears: 4 }
    ],
    projects: [
      {
        id: 'p-agro-mitra',
        name: 'AGRO Mitra Farmer Mobile Application',
        code: 'A-01-MOB',
        roleInProject: 'Lead Mobile Engineer',
        period: 'Jan 2026 - Sekarang',
        status: 'Sedang Berjalan',
        completedTasks: 44,
        onTimePercent: 97.7,
        deliverables: 'Aplikasi Android Ringan (APK < 18MB), Pencatatan Panen Mode Offline',
        description: 'Mengembangkan aplikasi bagi petani daerah dengan koneksi tidak stabil dan sinkronisasi otomatis ketika ada sinyal.',
        techStack: ['Flutter', 'SQLite', 'Riverpod', 'REST API']
      },
      {
        id: 'p-smartfarm-mob',
        name: 'Smart Farm Field Mobile Telemetry',
        code: 'A-02',
        roleInProject: 'Mobile Engineer',
        period: 'Sep 2025 - Des 2025',
        status: 'Selesai',
        completedTasks: 32,
        onTimePercent: 96.8,
        deliverables: 'BLE Pairing Gateway, Dasbor Grafik Sensor Suhu Tanah',
        description: 'Koneksi real-time perangkat seluler ke stasiun pemancar IoT di perkebunan.',
        techStack: ['Flutter', 'BLE Plugin', 'FL Chart']
      }
    ],
    recentAchievements: [
      'Menyelesaikan 91 tugas tepat waktu dengan skor review 4.85',
      'Mengurangi konsumsi baterai aplikasi hingga 40% saat mode background sync',
      'Menerapkan arsitektur caching lokal yang mencegah kehilangan data petani'
    ]
  }
];
