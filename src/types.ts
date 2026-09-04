export type RoleKey = 'ba' | 'ux' | 'fe' | 'be' | 'qa' | 'devops' | 'sec';

export type TaskStatus = 'backlog' | 'siap' | 'jalan' | 'review' | 'selesai' | 'arsip';
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface User {
  id: string;
  nama: string;
  inisial: string;
  peran: 'Owner' | 'Admin' | 'Member' | 'Guest';
  disiplin: RoleKey[];
  warna: string;
  avatarUrl?: string;
  email?: string;
}

export interface RoleInfo {
  kode: string;
  label: string;
  singkat: string;
  color: string;
  fokus: string;
  deskripsiLengkap?: string;
}

export interface Room {
  id: string;
  kode: string;
  nama: string;
  ringkas: string;
  anggota: string[];
  tugas: number;
  selesai: number;
  akses: 'privat' | 'publik';
  warna: string;
  plan: { x: number; y: number; w: number; h: number };
}

export interface TaskList {
  id: string;
  roomId: string;
  nama: string;
}

export interface Subtask {
  id: string;
  nama: string;
  selesai: boolean;
  assignee?: string;
}

export interface Task {
  id: string;
  listId: string;
  roomId?: string;
  peran: RoleKey;
  next?: RoleKey;
  nama: string;
  status: TaskStatus;
  prioritas: TaskPriority;
  assignee: string[];
  due: string;
  tags: string[];
  sub: [number, number]; // [completed, total]
  subtasksList?: Subtask[];
  komentar: number;
  lampiran: number;
  estimasi: string;
  storyPoints?: number;
  deskripsi: string;
}

export interface Comment {
  id: string;
  taskId?: string;
  user: string;
  waktu: string;
  isi: string;
  react?: { e: string; n: number; users?: string[] }[];
}

export interface ActivityLog {
  id?: string;
  user: string;
  aksi: string;
  dari?: string | null;
  ke?: string | null;
  waktu: string;
}

export interface NotificationItem {
  id: string;
  tipe: 'mention' | 'assign' | 'komentar' | 'due' | 'doc' | 'invite';
  user: string | null;
  teks: string;
  waktu: string;
  baru: boolean;
  room: string;
}

export interface DocItem {
  id: string;
  nama: string;
  halaman: number;
  penulis: string;
  waktu: string;
  room: string;
  content?: string;
}

export interface TrashItem {
  id: string;
  nama: string;
  tipe: 'Tugas' | 'Dokumen' | 'List' | 'Room';
  dihapus: string;
  waktu: string;
  sisa: string;
}

export interface Channel {
  id: string;
  nama: string;
  lingkup: 'tim' | 'room' | 'peran';
  room?: string;
  peran?: RoleKey;
  ringkas: string;
  anggota: string[];
  belum: number;
  pin?: boolean;
  kunci?: boolean;
}

export interface DirectMessageContact {
  id: string;
  user: string;
  belum: number;
  akhir: string;
}

export interface ChatMessage {
  id: string;
  user: string | null;
  waktu: string;
  tipe: 'teks' | 'tugas' | 'berkas' | 'sistem';
  isi: string;
  ket?: string;
  tugas?: string;
  react?: { e: string; n: number }[];
  balasan?: number;
}

export interface ArticleComment {
  id: string;
  user: string;
  waktu: string;
  isi: string;
  like: number;
  sukaSaya: boolean;
  balasan: {
    user: string;
    waktu: string;
    isi: string;
    like: number;
  }[];
}

export interface Article {
  id: string;
  judul: string;
  ringkas: string;
  penulis: string;
  waktu: string;
  baca: number;
  like: number;
  sukaSaya: boolean;
  komentar: number;
  label: string[];
  pin?: boolean;
  tipe: string;
  status?: 'terbit' | 'draft' | 'arsip';
  dilihat?: number;
  medium?: {
    status: 'terbit' | 'draft' | 'belum';
    url: string | null;
    waktu: string | null;
    claps: number;
  } | null;
}

export interface QuickTool {
  id: string;
  nama: string;
  ket: string;
  grup: 'Dokumen' | 'Aset' | 'Kode' | 'Ops' | 'Lain';
  ikon: string;
  warna: string;
  pakai: number;
}

export interface DocTemplate {
  id: string;
  kode: string;
  nama: string;
  untuk: RoleKey[];
  warna: string;
  ket: string;
  bagian: string[];
}

export interface ApiRequestItem {
  id?: string;
  m: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  p: string;
  nama: string;
  status: number;
  ms: number;
  gagal?: boolean;
}

export interface ApiFolder {
  nama: string;
  req: ApiRequestItem[];
}

export interface ApiCollection {
  id: string;
  nama: string;
  sumber: string;
  env: string;
  jumlah: number;
  folder: ApiFolder[];
}
