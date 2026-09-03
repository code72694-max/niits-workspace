import {
  User,
  RoleInfo,
  Room,
  TaskList,
  Task,
  Comment,
  ActivityLog,
  NotificationItem,
  DocItem,
  TrashItem,
  Channel,
  DirectMessageContact,
  ChatMessage,
  ArticleComment,
  Article,
  QuickTool,
  DocTemplate,
  ApiCollection,
  RoleKey
} from '../types';

export const ROLES_CONFIG: Record<RoleKey, RoleInfo> = {
  ba: {
    kode: "BA",
    label: "Business Analyst",
    singkat: "Bisnis",
    color: "#7A5AF8",
    fokus: "Kebutuhan, alur bisnis, kriteria terima",
    deskripsiLengkap: "Memastikan kebutuhan sistem selaras dengan proses operasional bisnis dan ekspektasi pemangku kepentingan."
  },
  ux: {
    kode: "UX",
    label: "UI/UX Designer",
    singkat: "UI/UX",
    color: "#D9488B",
    fokus: "Riset, wireframe, desain, design system",
    deskripsiLengkap: "Mendesain antarmuka manusia-komputer yang intuitif, aksesibel (WCAG AA), dan konsisten sesuai token."
  },
  fe: {
    kode: "FE",
    label: "Frontend Engineer",
    singkat: "Frontend",
    color: "#1E6FD9",
    fokus: "Antarmuka, state, integrasi API",
    deskripsiLengkap: "Mengimplementasikan antarmuka interaktif responsif, micro-animations, dan penanganan state data yang andal."
  },
  be: {
    kode: "BE",
    label: "Backend Engineer",
    singkat: "Backend",
    color: "#0F8E82",
    fokus: "API, domain, data, otorisasi",
    deskripsiLengkap: "Merancang logika bisnis, transaksi konkurensi aman, indexing database, dan batasan otorisasi RBAC."
  },
  qa: {
    kode: "QA",
    label: "Quality Assurance",
    singkat: "QA",
    color: "#B7791F",
    fokus: "Kasus uji, regresi, bug triage",
    deskripsiLengkap: "Menjalankan pengujian black-box, edge cases negatif, pengujian konkurensi, dan verifikasi sebelum rilis."
  },
  devops: {
    kode: "OP",
    label: "DevOps & Infra",
    singkat: "DevOps",
    color: "#4B5D75",
    fokus: "Pipeline, infra, rilis, monitoring",
    deskripsiLengkap: "Mengelola CI/CD automation, kontainerisasi, restart policies, observabilitas log, dan keamanan cloud."
  },
  sec: {
    kode: "SC",
    label: "Security Engineer",
    singkat: "Security",
    color: "#C4562B",
    fokus: "Audit, OWASP, hardening",
    deskripsiLengkap: "Mendeteksi celah otorisasi (IDOR), rate-limiting, proteksi kebocoran kredensial, dan audit compliance."
  }
};

export const ROLE_KEYS: RoleKey[] = ["ba", "ux", "fe", "be", "qa", "devops", "sec"];

export const CURRENT_USER: User = {
  id: "u1",
  nama: "Hary Kurniawan",
  inisial: "HK",
  peran: "Owner",
  disiplin: ["be", "devops"],
  warna: "#12459C",
  email: "hary@niits.id"
};

export const INITIAL_USERS: User[] = [
  CURRENT_USER,
  { id: "u2", nama: "Dina Ayu", inisial: "DA", peran: "Admin", disiplin: ["ux"], warna: "#D9488B", email: "dina@niits.id" },
  { id: "u3", nama: "Reza Fadhil", inisial: "RF", peran: "Member", disiplin: ["be"], warna: "#0F8E82", email: "reza@niits.id" },
  { id: "u4", nama: "Sinta Larasati", inisial: "SL", peran: "Member", disiplin: ["qa", "sec"], warna: "#C4562B", email: "sinta@niits.id" },
  { id: "u5", nama: "Bagas Pratama", inisial: "BP", peran: "Member", disiplin: ["fe"], warna: "#1E6FD9", email: "bagas@niits.id" },
  { id: "u6", nama: "Nadia Putri", inisial: "NP", peran: "Guest", disiplin: ["ba"], warna: "#7A5AF8", email: "nadia@niits.id" }
];

export const USERS_MAP = Object.fromEntries(INITIAL_USERS.map(u => [u.id, u]));

export const INITIAL_ROOMS: Room[] = [
  {
    id: "r1",
    kode: "A-01",
    nama: "AGRO E-Commerce",
    ringkas: "Marketplace hasil tani, tim inti",
    anggota: ["u1", "u2", "u3", "u4", "u5"],
    tugas: 48,
    selesai: 31,
    akses: "privat",
    warna: "#1E6FD9",
    plan: { x: 0, y: 0, w: 2, h: 2 }
  },
  {
    id: "r2",
    kode: "A-02",
    nama: "QA & Security",
    ringkas: "Black box, OWASP, load test",
    anggota: ["u1", "u4", "u6"],
    tugas: 26,
    selesai: 9,
    akses: "privat",
    warna: "#C4562B",
    plan: { x: 2, y: 0, w: 1, h: 1 }
  },
  {
    id: "r3",
    kode: "B-01",
    nama: "Design System Cyan",
    ringkas: "Token, komponen, dokumentasi",
    anggota: ["u2", "u5"],
    tugas: 17,
    selesai: 14,
    akses: "publik",
    warna: "#0F8E82",
    plan: { x: 2, y: 1, w: 1, h: 1 }
  },
  {
    id: "r4",
    kode: "B-02",
    nama: "Ops & Infra",
    ringkas: "Docker, CI/CD, monitoring",
    anggota: ["u1", "u3"],
    tugas: 21,
    selesai: 12,
    akses: "privat",
    warna: "#12459C",
    plan: { x: 0, y: 2, w: 1, h: 1 }
  },
  {
    id: "r5",
    kode: "B-03",
    nama: "Mobile App Kurir",
    ringkas: "Aplikasi driver pengiriman",
    anggota: ["u2", "u3", "u5"],
    tugas: 33,
    selesai: 4,
    akses: "privat",
    warna: "#B7791F",
    plan: { x: 1, y: 2, w: 1, h: 1 }
  }
];

export const ROOMS_MAP = Object.fromEntries(INITIAL_ROOMS.map(r => [r.id, r]));

export const INITIAL_LISTS: TaskList[] = [
  { id: "l1", roomId: "r1", nama: "Sprint 14" },
  { id: "l2", roomId: "r1", nama: "Backlog Produk" },
  { id: "l3", roomId: "r1", nama: "Bug & Hotfix" }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "T-241",
    listId: "l1",
    roomId: "r1",
    peran: "be",
    next: "qa",
    nama: "Perbaiki race condition saat checkout stok terbatas",
    status: "jalan",
    prioritas: "urgent",
    assignee: ["u3"],
    due: "2026-09-02",
    tags: ["transaksi", "database"],
    sub: [2, 3],
    subtasksList: [
      { id: "st-1", nama: "Tulis test konkurensi 50 request paralel", selesai: true, assignee: "u3" },
      { id: "st-2", nama: "Ganti cek stok ke SELECT ... FOR UPDATE", selesai: true, assignee: "u3" },
      { id: "st-3", nama: "Tambah CHECK constraint stok >= 0 di DB migration", selesai: false, assignee: "u3" }
    ],
    komentar: 7,
    lampiran: 2,
    estimasi: "8j",
    deskripsi: "Dua pembeli bisa lolos checkout untuk item stok terakhir. Butuh pessimistic lock atau constraint di level DB, bukan cek di service."
  },
  {
    id: "T-238",
    listId: "l1",
    roomId: "r1",
    peran: "sec",
    next: "qa",
    nama: "Rate limit endpoint /auth/login (5 req/menit per IP)",
    status: "review",
    prioritas: "high",
    assignee: ["u4"],
    due: "2026-09-01",
    tags: ["api", "security"],
    sub: [3, 3],
    subtasksList: [
      { id: "st-4", nama: "Setup Redis sliding window key", selesai: true, assignee: "u4" },
      { id: "st-5", nama: "Implementasi middleware Express rate limit", selesai: true, assignee: "u4" },
      { id: "st-6", nama: "Balas 429 Too Many Requests + Retry-After header", selesai: true, assignee: "u4" }
    ],
    komentar: 4,
    lampiran: 0,
    estimasi: "3j",
    deskripsi: "Brute force masih mungkin. Pakai Redis sliding window, balas 429 + Retry-After."
  },
  {
    id: "T-236",
    listId: "l1",
    roomId: "r1",
    peran: "sec",
    next: "be",
    nama: "Audit IDOR di endpoint /orders/:id",
    status: "jalan",
    prioritas: "urgent",
    assignee: ["u4"],
    due: "2026-09-03",
    tags: ["audit", "idor"],
    sub: [1, 4],
    subtasksList: [
      { id: "st-7", nama: "Cek kepemilikan user_id di OrderGuard", selesai: true, assignee: "u4" },
      { id: "st-8", nama: "Filter workspace_id di level query repository", selesai: false, assignee: "u3" },
      { id: "st-9", nama: "Uji akses pesanan user lain balas 403", selesai: false, assignee: "u4" },
      { id: "st-10", nama: "Tambah audit log untuk akses order gagal", selesai: false, assignee: "u3" }
    ],
    komentar: 12,
    lampiran: 3,
    estimasi: "6j",
    deskripsi: "Order milik user lain bisa dibaca kalau id-nya ditebak. Guard belum cek kepemilikan."
  },
  {
    id: "T-233",
    listId: "l1",
    roomId: "r1",
    peran: "ux",
    next: "fe",
    nama: "Redesign halaman detail produk versi mobile",
    status: "jalan",
    prioritas: "normal",
    assignee: ["u2"],
    due: "2026-09-05",
    tags: ["mobile", "design"],
    sub: [4, 6],
    komentar: 9,
    lampiran: 5,
    estimasi: "12j",
    deskripsi: "Hierarki harga & tombol beli belum jelas di layar kecil. CTA harus sticky 8px di atas tab bar."
  },
  {
    id: "T-231",
    listId: "l1",
    roomId: "r1",
    peran: "fe",
    next: "qa",
    nama: "Rakit ulang komponen kartu produk sesuai token baru",
    status: "jalan",
    prioritas: "normal",
    assignee: ["u5"],
    due: "2026-09-04",
    tags: ["komponen", "tailwind"],
    sub: [2, 5],
    komentar: 3,
    lampiran: 1,
    estimasi: "9j",
    deskripsi: "Kartu masih pakai warna hardcode. Pindah ke token dan rapikan state hover/fokus."
  },
  {
    id: "T-230",
    listId: "l1",
    roomId: "r1",
    peran: "be",
    next: "fe",
    nama: "Cursor pagination untuk daftar pesanan gudang",
    status: "siap",
    prioritas: "high",
    assignee: ["u3"],
    due: "2026-09-08",
    tags: ["performa", "sql"],
    sub: [0, 2],
    komentar: 2,
    lampiran: 0,
    estimasi: "5j",
    deskripsi: "Offset 10.000+ bikin query 4 detik. Ganti ke keyset pagination."
  },
  {
    id: "T-229",
    listId: "l1",
    roomId: "r1",
    peran: "fe",
    next: "qa",
    nama: "Notifikasi in-app saat status pengiriman berubah",
    status: "siap",
    prioritas: "normal",
    assignee: ["u5"],
    due: "2026-09-09",
    tags: ["realtime", "websocket"],
    sub: [0, 5],
    komentar: 1,
    lampiran: 0,
    estimasi: "10j",
    deskripsi: "Push lewat WebSocket, simpan ke tabel notifications untuk yang offline."
  },
  {
    id: "T-228",
    listId: "l1",
    roomId: "r1",
    peran: "ba",
    next: "ux",
    nama: "Petakan alur pengadaan stok & kriteria terima",
    status: "siap",
    prioritas: "high",
    assignee: ["u6"],
    due: "2026-09-07",
    tags: ["kebutuhan", "prd"],
    sub: [1, 3],
    komentar: 6,
    lampiran: 2,
    estimasi: "6j",
    deskripsi: "Alur permintaan, persetujuan, penerimaan barang, plus siapa yang boleh menyetujui."
  },
  {
    id: "T-227",
    listId: "l1",
    roomId: "r1",
    peran: "qa",
    next: "be",
    nama: "Tulis 24 kasus uji negatif alur checkout",
    status: "jalan",
    prioritas: "high",
    assignee: ["u4"],
    due: "2026-08-31",
    tags: ["uji", "blackbox"],
    sub: [14, 24],
    komentar: 5,
    lampiran: 1,
    estimasi: "7j",
    deskripsi: "Tiap kasus negatif wajib punya ekspektasi kode status HTTP, bukan cuma gagal."
  },
  {
    id: "T-226",
    listId: "l1",
    roomId: "r1",
    peran: "devops",
    next: "be",
    nama: "Pipeline: lint -> test -> build -> scan -> deploy staging",
    status: "jalan",
    prioritas: "high",
    assignee: ["u1"],
    due: "2026-08-29",
    tags: ["ci", "pipeline"],
    sub: [3, 5],
    komentar: 4,
    lampiran: 0,
    estimasi: "8j",
    deskripsi: "Jangan telan kegagalan pakai || true. Secret ambil dari secret manager."
  },
  {
    id: "T-225",
    listId: "l1",
    roomId: "r1",
    peran: "be",
    next: "qa",
    nama: "Perbaiki N+1 di endpoint board (task + assignee + tag)",
    status: "backlog",
    prioritas: "high",
    assignee: ["u3"],
    due: "2026-08-28",
    tags: ["performa", "query"],
    sub: [0, 3],
    komentar: 0,
    lampiran: 1,
    estimasi: "4j",
    deskripsi: "412 query untuk 1 board. Batasi dengan dataloader / join eksplisit."
  },
  {
    id: "T-224",
    listId: "l1",
    roomId: "r1",
    peran: "ux",
    next: "fe",
    nama: "Audit kontras & state fokus di seluruh form",
    status: "backlog",
    prioritas: "normal",
    assignee: ["u2"],
    due: "2026-09-12",
    tags: ["a11y", "audit"],
    sub: [0, 4],
    komentar: 2,
    lampiran: 0,
    estimasi: "5j",
    deskripsi: "Beberapa label 11px di atas biru muda gagal WCAG AA."
  },
  {
    id: "T-222",
    listId: "l1",
    roomId: "r1",
    peran: "devops",
    next: "qa",
    nama: "Health check + restart policy untuk semua container",
    status: "selesai",
    prioritas: "normal",
    assignee: ["u1"],
    due: "2026-08-26",
    tags: ["infra", "docker"],
    sub: [2, 2],
    komentar: 2,
    lampiran: 1,
    estimasi: "2j",
    deskripsi: "Selesai, sudah jalan di staging."
  },
  {
    id: "T-221",
    listId: "l1",
    roomId: "r1",
    peran: "ba",
    next: "ux",
    nama: "SOP pengadaan stok gudang (dokumen)",
    status: "backlog",
    prioritas: "low",
    assignee: ["u6"],
    due: "2026-09-15",
    tags: ["dokumen", "sop"],
    sub: [0, 2],
    komentar: 3,
    lampiran: 0,
    estimasi: "2j",
    deskripsi: "Alur permintaan, persetujuan, penerimaan barang."
  },
  {
    id: "T-218",
    listId: "l1",
    roomId: "r1",
    peran: "be",
    next: "qa",
    nama: "Validasi ulang skema DTO checkout dengan Zod",
    status: "selesai",
    prioritas: "normal",
    assignee: ["u3"],
    due: "2026-08-28",
    tags: ["validasi", "dto"],
    sub: [3, 3],
    komentar: 5,
    lampiran: 0,
    estimasi: "3j",
    deskripsi: "Selesai. Validasi pindah ke boundary, service jadi bersih."
  },
  {
    id: "T-215",
    listId: "l1",
    roomId: "r1",
    peran: "qa",
    next: "be",
    nama: "Regresi alur pendaftaran setelah rilis 1.8",
    status: "selesai",
    prioritas: "normal",
    assignee: ["u4"],
    due: "2026-08-27",
    tags: ["regresi", "auth"],
    sub: [12, 12],
    komentar: 3,
    lampiran: 2,
    estimasi: "4j",
    deskripsi: "Selesai, 12 kasus lulus semua."
  },
  {
    id: "T-212",
    listId: "l1",
    roomId: "r1",
    peran: "ux",
    next: "fe",
    nama: "Token warna & tipografi versi Poppins",
    status: "selesai",
    prioritas: "normal",
    assignee: ["u2"],
    due: "2026-08-25",
    tags: ["token", "poppins"],
    sub: [4, 4],
    komentar: 7,
    lampiran: 3,
    estimasi: "6j",
    deskripsi: "Selesai dan sudah dipakai di 3 halaman."
  },
  {
    id: "T-209",
    listId: "l1",
    roomId: "r1",
    peran: "sec",
    next: "devops",
    nama: "Hapus token debug yang ke-commit di .env.example",
    status: "selesai",
    prioritas: "urgent",
    assignee: ["u4"],
    due: "2026-08-24",
    tags: ["secret", "git"],
    sub: [1, 1],
    komentar: 8,
    lampiran: 0,
    estimasi: "1j",
    deskripsi: "Selesai. Token dirotasi, riwayat git dibersihkan."
  }
];

export const ROLE_UPDATES: Record<RoleKey, { u: string; waktu: string; isi: string }[]> = {
  ba: [
    { u: "u6", waktu: "Hari ini 09:20", isi: "Alur pengadaan stok sudah divalidasi tim gudang. Ada satu cabang baru: penolakan sebagian." },
    { u: "u6", waktu: "Kemarin 14:05", isi: "Kriteria terima checkout ditambah: oversell harus mustahil, bukan cuma jarang." }
  ],
  ux: [
    { u: "u2", waktu: "Hari ini 11:40", isi: "Wireframe detail produk mobile rev 3 selesai, CTA jadi sticky. Siap serah ke Frontend." },
    { u: "u2", waktu: "31 Agu 16:10", isi: "Audit kontras nemu 9 label di bawah AA. Aku naikkan ke 12px dan gelapkan abu." }
  ],
  fe: [
    { u: "u5", waktu: "Hari ini 13:15", isi: "Kartu produk sudah pakai token. Sisa state fokus keyboard dan skeleton." },
    { u: "u5", waktu: "Kemarin 10:30", isi: "Nunggu endpoint pagination dari Backend sebelum lanjut daftar pesanan." }
  ],
  be: [
    { u: "u3", waktu: "Hari ini 15:05", isi: "Race condition checkout: lock sudah jalan, test 50 request paralel lolos. Perlu CHECK constraint." },
    { u: "u1", waktu: "Kemarin 17:40", isi: "Endpoint pagination masuk sprint ini, aku pegang skema kursornya." }
  ],
  qa: [
    { u: "u4", waktu: "Hari ini 10:50", isi: "14 dari 24 kasus negatif checkout selesai. Dua GAGAL: oversell dan IDOR order." },
    { u: "u4", waktu: "31 Agu 09:15", isi: "Regresi pendaftaran rilis 1.8 lulus semua, laporan sudah dilampirkan." }
  ],
  devops: [
    { u: "u1", waktu: "Hari ini 08:30", isi: "Pipeline sampai tahap scan sudah hijau. Deploy staging masih manual approve." },
    { u: "u1", waktu: "28 Agu 11:00", isi: "Health check semua container aktif, restart policy on-failure." }
  ],
  sec: [
    { u: "u4", waktu: "Hari ini 12:10", isi: "Rate limit login siap review. Temuan IDOR order sudah jadi tugas T-236, prioritas urgent." },
    { u: "u4", waktu: "27 Agu 15:30", isi: "Token debug di .env.example dihapus, dirotasi, riwayat git dibersihkan." }
  ]
};

export const DEFINITION_OF_DONE: Record<RoleKey, { text: string; done: boolean }[]> = {
  ba: [
    { text: "Alur & aktor terdokumentasi lengkap", done: true },
    { text: "Kriteria terima terukur (Given/When/Then)", done: true },
    { text: "Disetujui pemilik proses bisnis", done: false }
  ],
  ux: [
    { text: "Semua state dirancang (kosong / muat / error / sukses)", done: true },
    { text: "Kontras warna lulus rasio WCAG AA (4.5:1)", done: true },
    { text: "Token desain terikat, tanpa warna lepas", done: false }
  ],
  fe: [
    { text: "Responsif di 3 breakpoint (mobile, tablet, desktop)", done: true },
    { text: "State fokus keyboard dan sentuhan 44px+ ada", done: true },
    { text: "Bebas dari warna atau ukuran hardcode", done: false }
  ],
  be: [
    { text: "Validasi ketat di API boundary (Zod / DTO)", done: true },
    { text: "Otorisasi diuji eksplisit, bukan diasumsikan", done: true },
    { text: "Query bebas N+1 problem dan memiliki indeks", done: false }
  ],
  qa: [
    { text: "Kasus positif & negatif tersedia", done: true },
    { text: "Ekspektasi kode status HTTP eksplisit", done: true },
    { text: "Langkah reproduksi bug dapat diulang", done: false }
  ],
  devops: [
    { text: "Pipeline gagal = merah (tanpa || true)", done: true },
    { text: "Semua secret diambil dari Secret Manager", done: true },
    { text: "Health check container & rollback siap", done: false }
  ],
  sec: [
    { text: "Ancaman nyata dijelaskan (STRIDE / OWASP)", done: true },
    { text: "Mitigasi diuji dengan asersi otomatis", done: true },
    { text: "Tidak ada token atau secret di bundle/log", done: false }
  ]
};

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1",
    taskId: "T-241",
    user: "u4",
    waktu: "2 jam lalu",
    isi: "Aku reproduksi di staging: 2 request paralel, dua-duanya lolos. Lock di service memang tidak cukup.",
    react: [{ e: "👀", n: 3 }]
  },
  {
    id: "c2",
    taskId: "T-241",
    user: "u3",
    waktu: "1 jam lalu",
    isi: "Setuju. Aku pakai SELECT ... FOR UPDATE di dalam transaksi, plus CHECK constraint stok >= 0 sebagai jaring terakhir.",
    react: [{ e: "🔥", n: 2 }, { e: "👍", n: 4 }]
  },
  {
    id: "c3",
    taskId: "T-241",
    user: "u1",
    waktu: "34 menit lalu",
    isi: "Tambahin test konkurensi ya, 50 request paralel. Kalau lolos tanpa oversell baru boleh merge. cc @Sinta Larasati",
    react: []
  }
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  { id: "act-1", user: "u3", aksi: "mengubah status", dari: "Siap", ke: "Dikerjakan", waktu: "1 jam lalu" },
  { id: "act-2", user: "u1", aksi: "menaikkan prioritas", dari: "Tinggi", ke: "Urgent", waktu: "3 jam lalu" },
  { id: "act-3", user: "u4", aksi: "melampirkan", dari: null, ke: "log-oversell.txt", waktu: "5 jam lalu" },
  { id: "act-4", user: "u2", aksi: "menyerahkan ke Frontend", dari: null, ke: "T-233", waktu: "Kemarin 16:20" },
  { id: "act-5", user: "u1", aksi: "membuat tugas", dari: null, ke: null, waktu: "28 Agu 09:10" }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", tipe: "mention", user: "u1", teks: "menyebut kamu di T-241 Perbaiki race condition saat checkout", waktu: "34 menit lalu", baru: true, room: "r1" },
  { id: "n2", tipe: "assign", user: "u2", teks: "menyerahkan T-233 Redesign halaman detail produk ke ruang Frontend", waktu: "2 jam lalu", baru: true, room: "r1" },
  { id: "n3", tipe: "komentar", user: "u4", teks: "membalas di T-236 Audit IDOR di endpoint /orders/:id", waktu: "5 jam lalu", baru: true, room: "r1" },
  { id: "n4", tipe: "due", user: null, teks: "T-238 Rate limit endpoint /auth/login jatuh tempo hari ini", waktu: "Hari ini 08:00", baru: false, room: "r1" },
  { id: "n5", tipe: "doc", user: "u6", teks: "mengubah dokumen Rencana Pengujian Black Box", waktu: "Kemarin", baru: false, room: "r2" },
  { id: "n6", tipe: "invite", user: "u2", teks: "menerima undangan ke room Design System Cyan", waktu: "2 hari lalu", baru: false, room: "r3" }
];

export const INITIAL_DOCS: DocItem[] = [
  { id: "d1", nama: "Rencana & Kasus Pengujian Black Box", halaman: 14, penulis: "u4", waktu: "3 minggu lalu", room: "r2" },
  { id: "d2", nama: "Arsitektur AGRO E-Commerce v2", halaman: 9, penulis: "u1", waktu: "6 hari lalu", room: "r1" },
  { id: "d3", nama: "SOP Pengadaan Stok Gudang", halaman: 4, penulis: "u6", waktu: "kemarin", room: "r1" },
  { id: "d4", nama: "Panduan Penetration Testing", halaman: 21, penulis: "u4", waktu: "1 bulan lalu", room: "r2" },
  { id: "d5", nama: "Token Warna & Tipografi Cyan", halaman: 6, penulis: "u2", waktu: "4 hari lalu", room: "r3" }
];

export const INITIAL_TRASH: TrashItem[] = [
  { id: "s1", nama: "T-198 Eksperimen cache Redis di listing produk", tipe: "Tugas", dihapus: "u3", waktu: "3 hari lalu", sisa: "27 hari" },
  { id: "s2", nama: "Draft Riset Kompetitor", tipe: "Dokumen", dihapus: "u2", waktu: "8 hari lalu", sisa: "22 hari" },
  { id: "s3", nama: "Sprint 11", tipe: "List", dihapus: "u1", waktu: "12 hari lalu", sisa: "18 hari" },
  { id: "s4", nama: "T-176 Landing page promo lebaran", tipe: "Tugas", dihapus: "u5", waktu: "26 hari lalu", sisa: "4 hari" }
];

export const INITIAL_CHANNELS: Channel[] = [
  { id: "c-umum", nama: "umum", lingkup: "tim", ringkas: "Semua orang di NIITS Studio", anggota: ["u1", "u2", "u3", "u4", "u5", "u6"], belum: 0, pin: true },
  { id: "c-acara", nama: "pengumuman", lingkup: "tim", ringkas: "Rilis, kebijakan, hari libur", anggota: ["u1", "u2", "u3", "u4", "u5", "u6"], belum: 2, pin: true, kunci: true },
  { id: "c-random", nama: "random", lingkup: "tim", ringkas: "Obrolan bebas & diskusi ringan", anggota: ["u1", "u2", "u3", "u5"], belum: 0 },
  { id: "c-agro", nama: "agro-ecommerce", lingkup: "room", room: "r1", ringkas: "Koordinasi harian A-01", anggota: ["u1", "u2", "u3", "u4", "u5"], belum: 5 },
  { id: "c-qa", nama: "qa-security", lingkup: "room", room: "r2", ringkas: "Temuan uji & audit A-02", anggota: ["u1", "u4", "u6"], belum: 1 },
  { id: "c-ds", nama: "design-system", lingkup: "room", room: "r3", ringkas: "Token & komponen B-01", anggota: ["u2", "u5"], belum: 0 },
  { id: "c-infra", nama: "ops-infra", lingkup: "room", room: "r4", ringkas: "Deploy & insiden B-02", anggota: ["u1", "u3"], belum: 0 },
  { id: "c-kurir", nama: "mobile-kurir", lingkup: "room", room: "r5", ringkas: "Aplikasi driver B-03", anggota: ["u2", "u3", "u5"], belum: 3 },
  { id: "c-be", nama: "peran-backend", lingkup: "peran", peran: "be", ringkas: "Ruang peran Backend", anggota: ["u1", "u3"], belum: 0 },
  { id: "c-fe", nama: "peran-frontend", lingkup: "peran", peran: "fe", ringkas: "Ruang peran Frontend", anggota: ["u5"], belum: 0 },
  { id: "c-uxr", nama: "peran-uiux", lingkup: "peran", peran: "ux", ringkas: "Ruang peran UI/UX", anggota: ["u2"], belum: 1 }
];

export const INITIAL_DMS: DirectMessageContact[] = [
  { id: "dm-u3", user: "u3", belum: 2, akhir: "Lock-nya udah aku push, cek ya" },
  { id: "dm-u2", user: "u2", belum: 0, akhir: "Wireframe rev 3 aku taruh di dokumen" },
  { id: "dm-u4", user: "u4", belum: 1, akhir: "Dua kasus uji masih GAGAL" }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "c-agro": [
    { id: "m1", user: "u2", waktu: "09:12", tipe: "teks", isi: "Pagi semua. Wireframe detail produk mobile rev 3 selesai, hierarki harga & CTA sudah aku benerin.", react: [{ e: "🎉", n: 3 }] },
    { id: "m2", user: "u2", waktu: "09:13", tipe: "tugas", tugas: "T-233", isi: "Aku serahkan ke Frontend ya, DoD UI/UX sudah lengkap." },
    { id: "m3", user: "u5", waktu: "09:20", tipe: "teks", isi: "Sip, aku ambil hari ini. Cuma butuh konfirmasi: sticky CTA-nya nempel di atas tab bar atau nutup tab bar?", balasan: 3 },
    { id: "m4", user: "u4", waktu: "10:48", tipe: "teks", isi: "Heads up: 14 dari 24 kasus uji negatif checkout selesai. Dua GAGAL, dua-duanya soal otorisasi.", react: [{ e: "👀", n: 4 }] },
    { id: "m5", user: "u4", waktu: "10:49", tipe: "tugas", tugas: "T-236", isi: "Yang ini paling serius. Order user lain kebaca kalau id-nya ditebak." },
    { id: "m6", user: "u3", waktu: "15:05", tipe: "teks", isi: "Race condition checkout: lock sudah jalan, test 50 request paralel lolos tanpa oversell. Sisa CHECK constraint stok >= 0." },
    { id: "m7", user: "u1", waktu: "15:26", tipe: "teks", isi: "Bagus. @Reza Fadhil jangan merge sebelum constraint-nya masuk, itu jaring terakhir kita. @Sinta Larasati siap regresi habis itu?", react: [{ e: "👍", n: 2 }] },
    { id: "m8", user: null, waktu: "15:30", tipe: "sistem", isi: "Bagas Pratama mengubah T-231 ke Dikerjakan" },
    { id: "m9", user: "u4", waktu: "15:41", tipe: "teks", isi: "Siap, aku sudah siapkan skenario regresinya. Estimasi 4 jam setelah constraint masuk." }
  ],
  "c-umum": [
    { id: "u1m", user: "u1", waktu: "08:05", tipe: "teks", isi: "Sprint 14 jalan sampai 12 September. Kecepatan kita 6,2 tugas per hari, jadi perkiraan selesai 14 September, molor 2 hari." },
    { id: "u2m", user: "u6", waktu: "08:31", tipe: "teks", isi: "Kalau soal scope creep, alur pengadaan stok memang nambah satu cabang: penolakan sebagian. Itu dari tim gudang." },
    { id: "u3m", user: "u1", waktu: "08:40", tipe: "teks", isi: "Oke, itu masuk hitungan. Yang penting jangan nambah lagi sebelum sprint review.", react: [{ e: "💯", n: 5 }] },
    { id: "u4m", user: "u2", waktu: "11:52", tipe: "berkas", isi: "token-poppins-v2.json", ket: "Token warna & tipografi versi Poppins, sudah dipakai di 3 halaman." }
  ],
  "c-qa": [
    { id: "q1", user: "u4", waktu: "12:10", tipe: "teks", isi: "Rate limit login siap review. Redis sliding window, balas 429 plus Retry-After." },
    { id: "q2", user: "u6", waktu: "13:02", tipe: "teks", isi: "Kriteria terima checkout aku perketat: oversell harus mustahil, bukan cuma jarang." }
  ],
  "dm-u3": [
    { id: "d1", user: "u3", waktu: "14:02", tipe: "teks", isi: "Har, soal race condition itu. Aku pakai SELECT ... FOR UPDATE di dalam transaksi, bukan lock di service." },
    { id: "d2", user: "u1", waktu: "14:15", tipe: "teks", isi: "Bener. Cuma satu catatan: lock-nya harus di baris stok, bukan di baris order. Kalau salah baris, dua pembeli tetap bisa lolos." },
    { id: "d3", user: "u3", waktu: "14:20", tipe: "teks", isi: "Oh iya, itu yang tadinya salah. Sudah aku pindah ke tabel stok." },
    { id: "d4", user: "u3", waktu: "15:44", tipe: "teks", isi: "Lock-nya udah aku push, cek ya. Test 50 request paralel lolos." },
    { id: "d5", user: "u1", waktu: "15:51", tipe: "tugas", tugas: "T-241", isi: "Sip. Constraint stok >= 0 tetap masuk ya, jaring terakhir." }
  ],
  "dm-u2": [
    { id: "e1", user: "u2", waktu: "11:40", tipe: "teks", isi: "Wireframe rev 3 aku taruh di dokumen. CTA sticky, jarak 8px dari tab bar." },
    { id: "e2", user: "u1", waktu: "11:58", tipe: "teks", isi: "Aku lihat. Satu hal: harga diskon dan harga asli hierarkinya masih setara, mata bingung mana yang dibayar." },
    { id: "e3", user: "u2", waktu: "12:06", tipe: "teks", isi: "Noted, harga bayar aku besarkan dan yang asli jadi abu dengan strikethrough." }
  ],
  "dm-u4": [
    { id: "f1", user: "u4", waktu: "10:50", tipe: "teks", isi: "Dua kasus uji masih GAGAL: oversell checkout dan IDOR order. Dua-duanya otorisasi." },
    { id: "f2", user: "u1", waktu: "10:57", tipe: "teks", isi: "Yang IDOR prioritas satu. Itu bocoran data, bukan bug fungsional." },
    { id: "f3", user: "u4", waktu: "11:03", tipe: "tugas", tugas: "T-236", isi: "Sudah aku naikkan ke Urgent dan serahkan ke Backend." }
  ]
};

export const THREAD_REPLIES = [
  { user: "u2", waktu: "09:24", isi: "Nempel di atas tab bar. Tab bar jangan pernah ketutup, itu navigasi utama." },
  { user: "u5", waktu: "09:26", isi: "Oke jelas. Aku kasih jarak 8px biar nggak keliatan nempel." },
  { user: "u2", waktu: "09:31", isi: "Pas. Nanti aku cek di device kecil (iPhone SE) sebelum kamu serahkan ke QA." }
];

export const QUICK_TOOLS: QuickTool[] = [
  { id: "pdf", nama: "Konversi PDF", ket: "Word/Excel/gambar -> PDF dan sebaliknya", grup: "Dokumen", ikon: "FileText", warna: "#C4562B", pakai: 42 },
  { id: "merge", nama: "Gabung & Pisah PDF", ket: "Susun ulang, hapus, atau pecah halaman", grup: "Dokumen", ikon: "Files", warna: "#B7791F", pakai: 18 },
  { id: "kompres", nama: "Kompres Gambar", ket: "PNG/JPG/WebP, target ukuran atau kualitas", grup: "Aset", ikon: "Image", warna: "#D9488B", pakai: 27 },
  { id: "ikon", nama: "Ekstrak Warna & Ikon", ket: "Ambil palet dan aset dari mockup", grup: "Aset", ikon: "Palette", warna: "#7A5AF8", pakai: 9 },
  { id: "json", nama: "Format JSON / YAML", ket: "Rapikan, validasi, konversi antar format", grup: "Kode", ikon: "Code", warna: "#0F8E82", pakai: 63 },
  { id: "jwt", nama: "Inspeksi JWT", ket: "Baca header & payload, cek kedaluwarsa", grup: "Kode", ikon: "Lock", warna: "#12459C", pakai: 31 },
  { id: "hash", nama: "Hash & Encode", ket: "SHA/MD5, Base64, URL encode", grup: "Kode", ikon: "ShieldCheck", warna: "#4B5D75", pakai: 14 },
  { id: "cron", nama: "Pembaca Cron", ket: "Terjemahkan ekspresi cron ke bahasa manusia", grup: "Ops", ikon: "Clock", warna: "#1E6FD9", pakai: 11 },
  { id: "sql", nama: "Format & Explain SQL", ket: "Rapikan query, baca rencana eksekusi", grup: "Ops", ikon: "Database", warna: "#0F8E82", pakai: 22 },
  { id: "qr", nama: "Pembuat QR", ket: "Tautan, teks, atau kartu kontak", grup: "Lain", ikon: "QrCode", warna: "#5B7288", pakai: 6 }
];

export const DOC_TEMPLATES: DocTemplate[] = [
  {
    id: "prd",
    kode: "PRD",
    nama: "Product Requirements Document",
    untuk: ["ba", "ux"],
    warna: "#7A5AF8",
    ket: "Apa yang dibangun dan kenapa, dari sudut pandang produk.",
    bagian: ["Ringkasan & masalah", "Tujuan & metrik sukses", "Persona pengguna", "Ruang lingkup (in/out)", "User story & kriteria terima", "Alur utama", "Ketergantungan & risiko", "Rencana rilis"]
  },
  {
    id: "brd",
    kode: "BRD",
    nama: "Business Requirements Document",
    untuk: ["ba"],
    warna: "#B7791F",
    ket: "Kebutuhan bisnis, proses, dan nilai yang dikejar.",
    bagian: ["Konteks bisnis", "Pemangku kepentingan", "Proses saat ini vs usulan", "Kebutuhan bisnis", "Aturan bisnis", "Dampak & biaya", "Asumsi & batasan", "Kriteria persetujuan"]
  },
  {
    id: "srs",
    kode: "SRS",
    nama: "Software Requirements Specification",
    untuk: ["be", "fe"],
    warna: "#0F8E82",
    ket: "Spesifikasi teknis fungsional dan non-fungsional (gaya IEEE 830).",
    bagian: ["Pendahuluan & lingkup", "Deskripsi umum sistem", "Kebutuhan fungsional", "Kebutuhan non-fungsional", "Antarmuka eksternal & API", "Model data", "Batasan desain", "Matriks keterlacakan"]
  },
  {
    id: "uxs",
    kode: "UX Spec",
    nama: "UI/UX Specification",
    untuk: ["ux", "fe"],
    warna: "#D9488B",
    ket: "Dokumen kebutuhan UI/UX: persona, user journey, wireframe, dan token sistem desain.",
    bagian: ["Persona & kebutuhan pengguna", "User journey map", "Information architecture & sitemap", "User flow per tugas", "Wireframe & anotasi", "Design system (token, komponen)", "Semua state (kosong/muat/error/sukses)", "Aksesibilitas (kontras, fokus, target sentuh)"]
  },
  {
    id: "tcs",
    kode: "Test Plan",
    nama: "Rencana & Kasus Uji",
    untuk: ["qa", "sec"],
    warna: "#C4562B",
    ket: "Strategi uji, kasus positif dan negatif, plus kriteria lulus.",
    bagian: ["Strategi & lingkup uji", "Lingkungan uji", "Kasus positif", "Kasus negatif & batas", "Uji otorisasi (IDOR, RBAC)", "Uji beban & konkurensi", "Kriteria lulus/gagal", "Laporan temuan"]
  },
  {
    id: "adr",
    kode: "ADR",
    nama: "Architecture Decision Record",
    untuk: ["be", "devops"],
    warna: "#12459C",
    ket: "Satu keputusan arsitektur, konteksnya, dan konsekuensinya.",
    bagian: ["Konteks & masalah", "Pilihan yang dipertimbangkan", "Keputusan", "Alasan", "Konsekuensi (positif & negatif)", "Status & tanggal"]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "a1",
    judul: "Tata cara rilis ke produksi",
    ringkas: "Urutan wajib dari merge sampai verifikasi pasca-rilis, termasuk kapan harus rollback.",
    penulis: "u1",
    waktu: "2 hari lalu",
    baca: 6,
    like: 24,
    sukaSaya: true,
    komentar: 5,
    label: ["sop", "devops"],
    pin: true,
    tipe: "Tata cara",
    status: "terbit",
    dilihat: 148,
    medium: { status: "terbit", url: "medium.com/@harykurniawan/tata-cara-rilis", waktu: "2 hari lalu", claps: 62 }
  },
  {
    id: "a2",
    judul: "Kenapa validasi di frontend bukan keamanan",
    ringkas: "Penjelasan singkat plus tiga contoh nyata dari audit kita sendiri.",
    penulis: "u4",
    waktu: "5 hari lalu",
    baca: 4,
    like: 31,
    sukaSaya: false,
    komentar: 9,
    label: ["sec", "fe"],
    tipe: "Penjelasan",
    status: "terbit",
    dilihat: 213,
    medium: { status: "draft", url: null, waktu: "disimpan 3 hari lalu", claps: 0 }
  },
  {
    id: "a3",
    judul: "Setup lingkungan lokal AGRO dari nol",
    ringkas: "Docker Compose, seed data, dan cara jalanin worker tanpa nabrak port.",
    penulis: "u3",
    waktu: "1 minggu lalu",
    baca: 9,
    like: 18,
    sukaSaya: true,
    komentar: 12,
    label: ["onboard", "devops", "be"],
    tipe: "Tata cara",
    status: "terbit",
    dilihat: 182,
    medium: null
  },
  {
    id: "a4",
    judul: "Aturan indexing: kapan bikin, kapan jangan",
    ringkas: "Index bukan obat serba bisa. Cara baca EXPLAIN sebelum menambah index.",
    penulis: "u1",
    waktu: "1 minggu lalu",
    baca: 7,
    like: 27,
    sukaSaya: false,
    komentar: 6,
    label: ["data", "be"],
    tipe: "Panduan",
    status: "terbit",
    dilihat: 164,
    medium: { status: "draft", url: null, waktu: "disimpan 3 hari lalu", claps: 0 }
  },
  {
    id: "a5",
    judul: "Checklist review desain sebelum masuk sprint",
    ringkas: "Delapan pertanyaan yang harus lolos: hierarki, aksi utama, state, kontras.",
    penulis: "u2",
    waktu: "2 minggu lalu",
    baca: 5,
    like: 22,
    sukaSaya: true,
    komentar: 4,
    label: ["ux", "sop"],
    tipe: "Checklist",
    status: "terbit",
    dilihat: 110,
    medium: null
  },
  {
    id: "a6",
    judul: "Menulis kasus uji negatif yang berguna",
    ringkas: "Kasus negatif tanpa ekspektasi kode status itu cuma catatan, bukan uji.",
    penulis: "u4",
    waktu: "3 minggu lalu",
    baca: 6,
    like: 15,
    sukaSaya: false,
    komentar: 3,
    label: ["qa"],
    tipe: "Panduan",
    status: "terbit",
    dilihat: 95,
    medium: null
  },
  {
    id: "a7",
    judul: "Cara menulis kriteria terima yang tidak bikin ribut",
    ringkas: "Format Given/When/Then plus contoh dari alur pengadaan stok.",
    penulis: "u6",
    waktu: "3 minggu lalu",
    baca: 4,
    like: 13,
    sukaSaya: false,
    komentar: 7,
    label: ["ba", "sop"],
    tipe: "Panduan",
    status: "terbit",
    dilihat: 87,
    medium: null
  },
  {
    id: "a8",
    judul: "Postmortem: oversell 12 pesanan pada 24 Agustus",
    ringkas: "Apa yang terjadi, kenapa lolos uji, dan apa yang kita ubah setelahnya.",
    penulis: "u3",
    waktu: "1 bulan lalu",
    baca: 8,
    like: 41,
    sukaSaya: true,
    komentar: 15,
    label: ["be", "data", "sec"],
    tipe: "Postmortem",
    status: "terbit",
    dilihat: 290,
    medium: null
  }
];

export const ARTICLE_LABELS = [
  { id: "fe", nama: "Frontend", warna: "#1E6FD9", jumlah: 14 },
  { id: "be", nama: "Backend", warna: "#0F8E82", jumlah: 21 },
  { id: "data", nama: "Data & DB", warna: "#7A5AF8", jumlah: 9 },
  { id: "devops", nama: "DevOps", warna: "#4B5D75", jumlah: 12 },
  { id: "qa", nama: "QA", warna: "#B7791F", jumlah: 8 },
  { id: "sec", nama: "Security", warna: "#C4562B", jumlah: 11 },
  { id: "ux", nama: "UI/UX", warna: "#D9488B", jumlah: 7 },
  { id: "ba", nama: "Bisnis", warna: "#B7791F", jumlah: 5 },
  { id: "sop", nama: "Prosedur", warna: "#5B7288", jumlah: 18 },
  { id: "onboard", nama: "Onboarding", warna: "#0F8E82", jumlah: 6 }
];

export const INITIAL_API_COLLECTIONS: ApiCollection[] = [
  {
    id: "k1",
    nama: "AGRO E-Commerce",
    sumber: "Bruno",
    env: "staging",
    jumlah: 24,
    folder: [
      {
        nama: "Auth",
        req: [
          { m: "POST", p: "/auth/login", nama: "Login", status: 200, ms: 182 },
          { m: "POST", p: "/auth/refresh", nama: "Refresh token", status: 200, ms: 74 },
          { m: "POST", p: "/auth/login", nama: "Login salah sandi", status: 401, ms: 168 },
          { m: "POST", p: "/auth/login", nama: "Brute force 6x", status: 429, ms: 12 }
        ]
      },
      {
        nama: "Orders",
        req: [
          { m: "GET", p: "/orders", nama: "Daftar pesanan", status: 200, ms: 240 },
          { m: "GET", p: "/orders/:id", nama: "Detail pesanan", status: 200, ms: 96 },
          { m: "GET", p: "/orders/:id", nama: "Pesanan user lain (IDOR)", status: 200, ms: 88, gagal: true },
          { m: "POST", p: "/orders/checkout", nama: "Checkout stok terakhir", status: 201, ms: 412 },
          { m: "POST", p: "/orders/checkout", nama: "Checkout paralel 50x", status: 201, ms: 1840, gagal: true }
        ]
      },
      {
        nama: "Stock",
        req: [
          { m: "GET", p: "/stock", nama: "Daftar stok", status: 200, ms: 132 },
          { m: "PATCH", p: "/stock/:id", nama: "Kurangi stok negatif", status: 422, ms: 61 }
        ]
      }
    ]
  },
  {
    id: "k2",
    nama: "Mobile Kurir",
    sumber: "Bruno",
    env: "lokal",
    jumlah: 11,
    folder: []
  },
  {
    id: "k3",
    nama: "Ops Healthcheck",
    sumber: "Manual",
    env: "produksi",
    jumlah: 6,
    folder: []
  }
];
