import { RoleKey } from '../types';

export type CourseLevel = 'pemula' | 'menengah' | 'mahir';

export interface ModuleSection {
  heading: string;
  penjelasan: string;
  poinKunci?: string[];
  contohKode?: {
    bahasa: string;
    kode: string;
    keterangan?: string;
  };
  tipsPraktek?: string;
}

export interface CourseModule {
  id: string;
  judul: string;
  durasiMenit: number;
  selesai: boolean;
  poin: number;
  tipe: 'video' | 'lab' | 'kuis' | 'bacaan';
  ringkasan?: string;
  // Detail Penjelasan Buku / Modul Interaktif
  bukuBab?: string;
  tujuanBelajar?: string[];
  sections?: ModuleSection[];
  studiKasus?: {
    skenario: string;
    solusi: string;
    manfaatBisnis: string;
  };
  quizMini?: {
    pertanyaan: string;
    opsi: string[];
    jawabanBenar: number;
    pembahasan: string;
  };
}

export interface CourseTrack {
  id: string;
  kode: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  disiplin: RoleKey;
  level: CourseLevel;
  instruktur: {
    nama: string;
    jabatan: string;
    avatar: string;
  };
  ikon: string;
  warna: string;
  bannerUrl: string;
  totalModul: number;
  modulSelesai: number;
  durasiTotalJam: number;
  targetSkill: string[];
  sertifikatTersedia: boolean;
  modulList: CourseModule[];
  prasyarat?: string[];
  status: 'belum_mulai' | 'sedang_belajar' | 'selesai';
  rating: number;
  pesertaCount: number;
}

export interface TeamSkillMatrix {
  id: string;
  namaAnggota: string;
  peran: RoleKey;
  avatar: string;
  levelSkill: number; // 1 to 5
  kursusSelesai: number;
  totalJamBelajar: number;
  kredensial: string[];
  targetUpgrade: string;
}

export const INITIAL_COURSES: CourseTrack[] = [
  {
    id: 'course-fe-01',
    kode: 'FE-401',
    judul: 'Modern Micro-Frontend & Subtractive UI Architecture',
    deskripsi: 'Panduan mendalam merancang arsitektur antarmuka modern dengan Vite, Tailwind CSS v4, Motion Transitions, dan state synchronization tanpa re-render berlebih.',
    kategori: 'Frontend Engineering',
    disiplin: 'fe',
    level: 'menengah',
    instruktur: {
      nama: 'Jessica Chen',
      jabatan: 'Principal UI/UX & Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    ikon: 'LayoutGrid',
    warna: '#1E6FD9',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
    totalModul: 5,
    modulSelesai: 4,
    durasiTotalJam: 12,
    targetSkill: ['React 18+', 'Vite Bundler', 'Micro-Frontend', 'Subtractive UI', 'Performance Profiling'],
    sertifikatTersedia: true,
    status: 'sedang_belajar',
    rating: 4.9,
    pesertaCount: 14,
    modulList: [
      { 
        id: 'm1', 
        judul: 'Prinsip Desain Subtractive & Boolean Geometry di Web', 
        durasiMenit: 45, 
        selesai: true, 
        poin: 50, 
        tipe: 'bacaan', 
        ringkasan: 'Teknik implementasi inverted fillet radius pada SVG, continuous card notches, dan arsitektur visual tanpa tab terpisah.',
        bukuBab: 'Bab 1: Geometri Subtraktif & Keselarasan Ruang Visual',
        tujuanBelajar: [
          'Memahami konsep geometri Boolean dan kurvatur kontur pada web application modern',
          'Mengimplementasikan inverted concave arc SVG path secara presisi tanpa offset visual',
          'Menghilangkan visual noise border terputus dengan teknik seamless visual merging'
        ],
        sections: [
          {
            heading: '1. Mengapa Desain Subtraktif Menggantikan Nested Cards Tradisional',
            penjelasan: 'Dalam desain antarmuka enterprise modern, masalah umum yang sering timbul adalah "Card Fatigue" — penumpukan kotak di dalam kotak (nested cards) yang membuat hirarki informasi menjadi berat dan kaku. Desain subtraktif memecahkan masalah ini dengan merancang satu kanvas terpadu yang "dipahat" atau dikurangi secara geometris.',
            poinKunci: [
              'Hindari membuat batas kotak di dalam batas kotak dengan warna yang bersaing',
              'Gunakan sudut cekung (inverted fillet radius) 32px untuk menghubungkan panel atas dengan badan kartu utama',
              'Manfaatkan shadow-xs dan warna latar #F8FAFC untuk memberikan kontras lembut tanpa garis batas hitam pekat'
            ],
            tipsPraktek: 'Gunakan kurva SVG M 0 0 C 0 17.673, 14.327 32, 32 32 H 32 V 0 Z untuk membentuk sudut cekung sisi kiri dan kanan pada takik tab atas.'
          },
          {
            heading: '2. Implementasi Formula SVG Inverted Notch',
            penjelasan: 'Poni atau notch atas yang menyatu dengan badan kartu bawah membutuhkan dua kurva penghubung di kiri dan kanan. Jika tidak dihitung dengan presisi, akan muncul celah 1px rendering glitch pada layar resolusi Retina.',
            contohKode: {
              bahasa: 'tsx',
              kode: `// Contoh komponen Inverted SVG Corner penghubung notch atas
export const InvertedCorner = ({ side }: { side: 'left' | 'right' }) => (
  <svg 
    viewBox="0 0 32 32" 
    className="w-8 h-8 pointer-events-none fill-white"
    style={{ transform: side === 'right' ? 'scaleX(-1)' : 'none' }}
  >
    {/* Menggambar kurva cekung sempurna */}
    <path d="M0 0 C0 17.673 14.327 32 32 32 H32 V0 Z" />
  </svg>
);`,
              keterangan: 'Pastikan fill SVG sama persis dengan warna background kontainer induk agar efek pemotongan seamless.'
            },
            poinKunci: [
              'Selalu pasang overflow-hidden pada wrapper terluar',
              'Gunakan z-index terstruktur agar tombol aksi circular di notch atas tidak tertutup klip'
            ]
          },
          {
            heading: '3. Aturan Matematika Radius Sudut Bersarang (Corner Nesting)',
            penjelasan: 'Prinsip optik desain: ketika ada elemen membulat di dalam kontainer yang juga membulat, radius bagian dalam wajib dihitung dengan rumus: R_inner = R_outer - Padding. Mengabaikan aturan ini menghasilkan efek visual canggung di mana sudut dalam terlihat "tergencet".',
            poinKunci: [
              'Outer Radius 36px dengan padding 8px mewajibkan Inner Radius 28px',
              'Gunakan tombol aksi bertipe pill bulat penuh (rounded-full) untuk elemen kecil di bawah 40px'
            ]
          }
        ],
        studiKasus: {
          skenario: 'Tim frontend NIITS Studio merancang dasbor Case Management yang memiliki tombol navigasi tab di bagian atas tanpa merusak aliran vertikal kartu utama.',
          solusi: 'Menggabungkan tab navigasi ke dalam takik tengah (subtracted notch) dengan sayap kiri & kanan putih yang memiliki garis batas bersambung.',
          manfaatBisnis: 'Meningkatkan kenyamanan navigasi pengguna hingga 38% dan mereduksi visual noise hingga 50% pada layar kerja intensif.'
        },
        quizMini: {
          pertanyaan: 'Berapakah inner border-radius yang tepat jika outer container memiliki radius 32px dan padding di antaranya 8px?',
          opsi: ['32px', '28px', '24px', '16px'],
          jawabanBenar: 2,
          pembahasan: 'Rumus radius bersarang yang tepat adalah R_dalam = R_luar - Jarak (Padding). Maka 32px - 8px = 24px.'
        }
      },
      { 
        id: 'm2', 
        judul: 'State Management Berskala Besar dengan Zero-Latency', 
        durasiMenit: 60, 
        selesai: true, 
        poin: 70, 
        tipe: 'lab', 
        ringkasan: 'Eksperimen React ref caches, unbundled dispatch, dan selective memoization.',
        bukuBab: 'Bab 2: Manajemen State Kinerja Tinggi Tanpa Latensi',
        tujuanBelajar: [
          'Membedakan kapan harus memakai React State vs Mutable Refs untuk rendering 60 FPS',
          'Menerapkan pattern batching updates pada pipeline data real-time',
          'Mencegah re-render cascading di pohon komponen kompleks'
        ],
        sections: [
          {
            heading: '1. Anatomi Bottleneck Re-Render di React 18',
            penjelasan: 'Penyebab utama aplikasi enterprise terasa lambat adalah re-render komponen induk yang tidak perlu saat pengguna mengetik pada input filter atau menggeser slider kustom.',
            poinKunci: [
              'Gunakan useRef untuk menyimpan referensi pencarian sementara jika tidak mempengaruhi DOM seketika',
              'Bungkus callback pencarian dengan useMemo atau custom debounce handler',
              'Pisahkan komponen yang sering berganti ke dalam subtree lokal mandiri'
            ]
          },
          {
            heading: '2. Implementasi Optimistic State Updates',
            penjelasan: 'Dalam alur kerja tugas (task completion checklist), pengguna tidak boleh menunggu respons API jaringan untuk melihat centang hijau. Terapkan pembaruan optimis lokal terlebih dahulu.',
            contohKode: {
              bahasa: 'typescript',
              kode: `const handleToggleModuleOptimistic = (moduleId: string) => {
  // 1. Perbarui state lokal seketika
  setModules(prev => prev.map(m => m.id === moduleId ? { ...m, selesai: !m.selesai } : m));
  
  // 2. Kirim update ke server di background tanpa memblokir UI
  syncModuleStatus(moduleId).catch(err => {
    // Revert jika gagal
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, selesai: !m.selesai } : m));
    showToast('Gagal menyinkronkan status', 'error');
  });
};`,
              keterangan: 'UI tetap responsif di bawah 16ms memberikan sensasi aplikasi desktop yang instan.'
            }
          }
        ],
        studiKasus: {
          skenario: 'Pencarian cepat di Command Palette terasa stuttering saat mengetik di daftar 500+ entri.',
          solusi: 'Mengimplementasikan search filter lokal berbasis indexed string tokens dan deferral state rendering.',
          manfaatBisnis: 'Input responsivitas turun dari 120ms menjadi 4ms.'
        }
      },
      { 
        id: 'm3', 
        judul: 'Optimasi Web Vitals (LCP < 1.2s & CLS 0)', 
        durasiMenit: 50, 
        selesai: true, 
        poin: 60, 
        tipe: 'video', 
        ringkasan: 'Code splitting modular, dynamic import, dan eliminasi unneeded tree packages.',
        bukuBab: 'Bab 3: Standar Kinerja Web Vitals Tingkat Produksi',
        tujuanBelajar: [
          'Memahami metrik LCP, INP, dan CLS yang menjadi tolok ukur Google',
          'Mengonfigurasi Vite bundle splitting untuk memecah vendor chunks',
          'Mencegah layout shift dengan aspect-ratio dan placeholder skeleton yang tepat'
        ],
        sections: [
          {
            heading: '1. Mengeliminasi Cumulative Layout Shift (CLS)',
            penjelasan: 'CLS nol tercapai jika setiap elemen media, avatar, dan banner memiliki rasio dimensi tetap yang telah dialokasikan sebelum browser merender gambar asli.',
            poinKunci: [
              'Wajib cantumkan class w-full h-48 rounded-2xl bg-slate-100 pada container media',
              'Hindari inject banner promosi dinamis di atas konten yang sedang dibaca pengguna'
            ]
          }
        ]
      },
      { 
        id: 'm4', 
        judul: 'Live Code Challenge: Custom Command Palette', 
        durasiMenit: 90, 
        selesai: true, 
        poin: 100, 
        tipe: 'lab', 
        ringkasan: 'Membangun command palette ala Linear dengan keyboard navigation ⌘K, arrow selection, dan fuzzy search.',
        bukuBab: 'Bab 4: Laboratorium Praktik - Interaksi Command Palette',
        tujuanBelajar: [
          'Membuat global keyboard listener yang aman terhadap browser conflicts',
          'Mendesain navigasi panah atas/bawah dengan scrollIntoView otomatis',
          'Menyediakan shortcut instan untuk berpindah antar modul belajar'
        ],
        sections: [
          {
            heading: '1. Menangani Global Keyboard Shortcut ⌘K / Ctrl+K',
            penjelasan: 'Pastikan event listener mencegah default action browser (seperti bookmark dialog pada beberapa OS) dan membersihkan listener saat komponen unmount.',
            contohKode: {
              bahasa: 'tsx',
              kode: `useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, []);`,
              keterangan: 'Dukungan penuh multi-platform baik untuk macOS (metaKey) maupun Windows/Linux (ctrlKey).'
            }
          }
        ]
      },
      { 
        id: 'm5', 
        judul: 'Evaluasi Sertifikasi Frontend Master', 
        durasiMenit: 30, 
        selesai: false, 
        poin: 120, 
        tipe: 'kuis', 
        ringkasan: 'Kuis komprehensif 25 soal arsitektur frontend dan live review kode.',
        bukuBab: 'Bab 5: Ujian Kualifikasi & Sertifikasi Disiplin',
        tujuanBelajar: [
          'Menguji pemahaman teori geometri arsitektur antarmuka',
          'Menguji kemampuan mitigasi memory leak pada event listener',
          'Mendapatkan lencana kredensial verified frontend specialist'
        ]
      }
    ]
  },
  {
    id: 'course-be-02',
    kode: 'BE-502',
    judul: 'High-Concurrency Event-Driven Architecture with Go & Kafka',
    deskripsi: 'Mengembangkan distributed worker pools, idempotency handler, distributed tracing, dan resilient database transactions di era cloud-native.',
    kategori: 'Backend Engineering',
    disiplin: 'be',
    level: 'mahir',
    instruktur: {
      nama: 'Bambang Wijaya',
      jabatan: 'Head of Engineering & Distributed Systems',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    ikon: 'Server',
    warna: '#0F8E82',
    bannerUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
    totalModul: 6,
    modulSelesai: 2,
    durasiTotalJam: 18,
    targetSkill: ['Event Streaming', 'Kafka Cluster', 'PostgreSQL Locking', 'gRPC', 'Distributed Tracing'],
    sertifikatTersedia: true,
    status: 'sedang_belajar',
    rating: 4.95,
    pesertaCount: 18,
    modulList: [
      { 
        id: 'b1', 
        judul: 'Fundamen Event Loop, Worker Pool & Concurrency Limiting', 
        durasiMenit: 60, 
        selesai: true, 
        poin: 60, 
        tipe: 'video',
        bukuBab: 'Bab 1: Konkurensi Tingkat Lanjut & Goroutine Worker Pools',
        tujuanBelajar: [
          'Memahami mekanisme scheduler M:N pada Go runtime',
          'Merancang bounded worker pools untuk mencegah memory exhaustion',
          'Menggunakan sync.WaitGroup dan context.WithTimeout secara aman'
        ],
        sections: [
          {
            heading: '1. Mengapa Unbounded Goroutine Berbahaya di Produksi',
            penjelasan: 'Di bawah lonjakan beban (traffic spike), membuat goroutine baru untuk setiap request masuk dapat menyebabkan OOM (Out Of Memory) dalam hitungan detik. Buffer channel dan worker pool yang terukur adalah solusi standar industri.',
            poinKunci: [
              'Batasi ukuran worker pool sesuai jumlah core CPU dan kapasitas koneksi database',
              'Selalu monitor jumlah goroutine aktif via Prometheus pprof metric',
              'Terapkan gracefully draining saat service menerima sinyal SIGTERM'
            ],
            contohKode: {
              bahasa: 'go',
              kode: `// Worker Pool dengan Concurrency Limit
type Job func(ctx context.Context) error

func StartWorkerPool(ctx context.Context, concurrency int, jobs <-chan Job) {
    var wg sync.WaitGroup
    for i := 0; i < concurrency; i++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for job := range jobs {
                if err := job(ctx); err != nil {
                    log.Printf("worker %d: err %v", workerID, err)
                }
            }
        }(i)
    }
    wg.Wait()
}`,
              keterangan: 'Contoh pola producer-consumer Go dengan backpressure channel.'
            }
          }
        ]
      },
      { 
        id: 'b2', 
        judul: 'Desain Idempotent Consumers & Outbox Pattern', 
        durasiMenit: 75, 
        selesai: true, 
        poin: 80, 
        tipe: 'lab',
        bukuBab: 'Bab 2: Transaksional Outbox & Idempotensi Pesan',
        tujuanBelajar: [
          'Menjamin delivery setidaknya sekali (at-least-once) tanpa duplicate execution',
          'Menerapkan transactional outbox table pada PostgreSQL',
          'Menggunakan Redis distributed locks dengan lease auto-expiry'
        ],
        sections: [
          {
            heading: '1. Dual-Write Problem pada Arsitektur Microservices',
            penjelasan: 'Menyimpan data ke database dan mempublikasikan event ke Kafka dalam satu flow HTTP dapat gagal di tengah jalan jika jaringan terputus setelah DB commit tetapi sebelum Kafka publish.',
            poinKunci: [
              'Tulis data bisnis dan outbox record ke tabel database dalam satu transaksi ACID lokal',
              'Gunakan Debezium (Change Data Capture) atau background poller untuk meneruskan pesan ke Kafka',
              'Sertakan header X-Idempotency-Key pada payload pesan event'
            ]
          }
        ]
      },
      { id: 'b3', judul: 'Database Sharding & Connection Pool Tuning di Cloud SQL', durasiMenit: 90, selesai: false, poin: 90, tipe: 'video' },
      { id: 'b4', judul: 'gRPC Interceptor & Mutual TLS Authentication', durasiMenit: 60, selesai: false, poin: 70, tipe: 'lab' },
      { id: 'b5', judul: 'Stress Testing 50,000 RPS dengan k6', durasiMenit: 80, selesai: false, poin: 100, tipe: 'lab' },
      { id: 'b6', judul: 'Final Capstone: Resilient Payment Pipeline', durasiMenit: 120, selesai: false, poin: 150, tipe: 'lab' }
    ]
  },
  {
    id: 'course-sec-03',
    kode: 'SEC-301',
    judul: 'Zero-Trust Security, OWASP Top 10 & DevSecOps Hardening',
    deskripsi: 'Praktek keamanan praktis untuk seluruh pengembang: SAST, DAST, Secret Scanning, container vulnerability patches, dan audit kepatuhan ISO 27001.',
    kategori: 'Cybersecurity',
    disiplin: 'sec',
    level: 'pemula',
    instruktur: {
      nama: 'Sarah Jenkins',
      jabatan: 'Principal Security & Pen-Tester',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    ikon: 'ShieldCheck',
    warna: '#E11D48',
    bannerUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&auto=format&fit=crop&q=80',
    totalModul: 4,
    modulSelesai: 4,
    durasiTotalJam: 8,
    targetSkill: ['OWASP Top 10', 'JWT & OAuth2 hardening', 'Container Security', 'Secret Management', 'Trivy Scan'],
    sertifikatTersedia: true,
    status: 'selesai',
    rating: 4.88,
    pesertaCount: 24,
    modulList: [
      { id: 's1', judul: 'Bedah Serangan XSS, CSRF & SSRF di Aplikasi Modern', durasiMenit: 45, selesai: true, poin: 50, tipe: 'video' },
      { id: 's2', judul: 'Hardening Header HTTP (CSP, HSTS, X-Frame)', durasiMenit: 40, selesai: true, poin: 50, tipe: 'lab' },
      { id: 's3', judul: 'Automated CI/CD Vulnerability Scanning dengan Trivy & Snyk', durasiMenit: 60, selesai: true, poin: 80, tipe: 'lab' },
      { id: 's4', judul: 'Postmortem Simulasi Breach & Incident Response', durasiMenit: 60, selesai: true, poin: 100, tipe: 'kuis' }
    ]
  },
  {
    id: 'course-ops-04',
    kode: 'OPS-402',
    judul: 'Kubernetes Production Operations & GitOps with ArgoCD',
    deskripsi: 'Manajemen cluster multi-region, automated canary deployments, HPA tuning, prometheus metrics, dan zero-downtime rolling updates.',
    kategori: 'DevOps & Cloud',
    disiplin: 'devops',
    level: 'mahir',
    instruktur: {
      nama: 'David Miller',
      jabatan: 'Staff Site Reliability Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    ikon: 'Terminal',
    warna: '#D97706',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
    totalModul: 5,
    modulSelesai: 0,
    durasiTotalJam: 15,
    targetSkill: ['Kubernetes Helm', 'ArgoCD GitOps', 'Prometheus & Grafana', 'HPA Scaling', 'Network Policies'],
    sertifikatTersedia: true,
    status: 'belum_mulai',
    rating: 4.92,
    pesertaCount: 16,
    modulList: [
      { id: 'k1', judul: 'Arsitektur Control Plane & Etcd Raft Consensus', durasiMenit: 55, selesai: false, poin: 50, tipe: 'video' },
      { id: 'k2', judul: 'Setup Declarative GitOps Pipeline Menggunakan ArgoCD', durasiMenit: 90, selesai: false, poin: 90, tipe: 'lab' },
      { id: 'k3', judul: 'Pod Disruption Budget & Zero-Downtime Rollout Strategy', durasiMenit: 60, selesai: false, poin: 70, tipe: 'lab' },
      { id: 'k4', judul: 'Prometheus Alerts, SLI/SLO Dashboard & Error Budgets', durasiMenit: 75, selesai: false, poin: 80, tipe: 'video' },
      { id: 'k5', judul: 'Disaster Recovery Drill: Restoring Node Failure', durasiMenit: 100, selesai: false, poin: 120, tipe: 'lab' }
    ]
  },
  {
    id: 'course-ba-05',
    kode: 'BA-201',
    judul: 'Pragmatic Product Requirements, BRD & User Story Mapping',
    deskripsi: 'Menyusun spesifikasi PRD yang tidak ambigu, merancang Acceptance Criteria (Gherkin format), dan memandu sprint planning yang efisien.',
    kategori: 'Product & Analysis',
    disiplin: 'ba',
    level: 'pemula',
    instruktur: {
      nama: 'Haryanto Tan',
      jabatan: 'Principal Business Analyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    ikon: 'FileSpreadsheet',
    warna: '#7A5AF8',
    bannerUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=80',
    totalModul: 4,
    modulSelesai: 2,
    durasiTotalJam: 9,
    targetSkill: ['PRD Writing', 'Story Mapping', 'Gherkin Syntax', 'Impact Mapping', 'Sprint Backlog DoD'],
    sertifikatTersedia: true,
    status: 'sedang_belajar',
    rating: 4.85,
    pesertaCount: 11,
    modulList: [
      { id: 'a1', judul: 'Anatomi PRD Komprehensif Berstandar Industri', durasiMenit: 50, selesai: true, poin: 50, tipe: 'video' },
      { id: 'a2', judul: 'Workshop User Story Mapping & Slice MVP Releases', durasiMenit: 70, selesai: true, poin: 80, tipe: 'lab' },
      { id: 'a3', judul: 'Writing Gherkin (Given-When-Then) untuk QA Automation', durasiMenit: 60, selesai: false, poin: 70, tipe: 'lab' },
      { id: 'a4', judul: 'Studi Kasus: Redesign Alur Checkout E-Commerce', durasiMenit: 90, selesai: false, poin: 100, tipe: 'kuis' }
    ]
  },
  {
    id: 'course-qa-06',
    kode: 'QA-305',
    judul: 'End-to-End Test Automation with Playwright & CI Matrix',
    deskripsi: 'Menulis automated tests yang stabil tanpa flakiness, parallel test runners, visual regression testing, dan integrasi reporting GitHub Actions.',
    kategori: 'Quality Assurance',
    disiplin: 'qa',
    level: 'menengah',
    instruktur: {
      nama: 'Rina Kusuma',
      jabatan: 'QA Automation Lead',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    ikon: 'CheckCircle2',
    warna: '#C4562B',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80',
    totalModul: 5,
    modulSelesai: 1,
    durasiTotalJam: 11,
    targetSkill: ['Playwright Test', 'Page Object Model', 'Visual Regression', 'Mock APIs', 'Parallel Testing'],
    sertifikatTersedia: true,
    status: 'sedang_belajar',
    rating: 4.9,
    pesertaCount: 15,
    modulList: [
      { id: 'q1', judul: 'Setup Playwright & Konsep Locators Resilien', durasiMenit: 45, selesai: true, poin: 50, tipe: 'video' },
      { id: 'q2', judul: 'Implementasi Page Object Model (POM) Bersih', durasiMenit: 60, selesai: false, poin: 70, tipe: 'lab' },
      { id: 'q3', judul: 'Network Interception, Mocking & Flaky Test Prevention', durasiMenit: 75, selesai: false, poin: 80, tipe: 'lab' },
      { id: 'q4', judul: 'Visual Screenshot Diffing & Accessibility Audit (axe-core)', durasiMenit: 60, selesai: false, poin: 70, tipe: 'video' },
      { id: 'q5', judul: 'Playwright Sharding di GitHub Actions CI Matrix', durasiMenit: 80, selesai: false, poin: 100, tipe: 'lab' }
    ]
  }
];

export const INITIAL_SKILL_MATRIX: TeamSkillMatrix[] = [
  {
    id: 'sm1',
    namaAnggota: 'Haryanto Tan (Anda)',
    peran: 'fe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    levelSkill: 4,
    kursusSelesai: 5,
    totalJamBelajar: 48,
    kredensial: ['React Master Certified', 'Zero-Trust DevSecOps'],
    targetUpgrade: 'Micro-Frontend Architect & Web Perf Master'
  },
  {
    id: 'sm2',
    namaAnggota: 'Bambang Wijaya',
    peran: 'be',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    levelSkill: 5,
    kursusSelesai: 8,
    totalJamBelajar: 72,
    kredensial: ['Kafka Specialist', 'Distributed Systems Pro', 'Postgres DBA'],
    targetUpgrade: 'Cloud-Native Distributed Transactions'
  },
  {
    id: 'sm3',
    namaAnggota: 'Jessica Chen',
    peran: 'ux',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    levelSkill: 4,
    kursusSelesai: 6,
    totalJamBelajar: 54,
    kredensial: ['Design System Tokens', 'Figma Variables Specialist'],
    targetUpgrade: 'Subtractive UI & Mathematical Micro-Interactions'
  },
  {
    id: 'sm4',
    namaAnggota: 'Sarah Jenkins',
    peran: 'sec',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    levelSkill: 5,
    kursusSelesai: 7,
    totalJamBelajar: 68,
    kredensial: ['OSCP Certified', 'Cloud Security Architect'],
    targetUpgrade: 'AI Guardrails & LLM Red Teaming'
  },
  {
    id: 'sm5',
    namaAnggota: 'David Miller',
    peran: 'devops',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    levelSkill: 4,
    kursusSelesai: 4,
    totalJamBelajar: 42,
    kredensial: ['CKA (Certified Kubernetes Admin)', 'AWS Solutions Architect'],
    targetUpgrade: 'Multi-Cluster Service Mesh & GitOps'
  }
];
