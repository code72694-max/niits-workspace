export type CaseStage = 'allocation' | 'identification' | 'resolution';

export type TaskCategory = 
  | 'Request Processing'
  | 'Problem Resolution'
  | 'Customer Communication'
  | 'Testing and Verification'
  | 'Customer Notification'
  | 'Customer Satisfaction';

export interface CaseTask {
  id: string;
  stage: CaseStage;
  title: string;
  completed: boolean;
  category: TaskCategory;
  assignee?: {
    name: string;
    avatar: string;
    role?: string;
  };
  dueDate?: string;
  isBold?: boolean;
  isActionableAdd?: boolean;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  description?: string;
}

export const INITIAL_CASE_TASKS: CaseTask[] = [
  // STAGE 1: Casw Allocation
  {
    id: 'ct-1',
    stage: 'allocation',
    title: 'Allocate Case to User!',
    completed: true,
    category: 'Request Processing',
    assignee: {
      name: 'Sam Frank',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'Support Lead'
    },
    dueDate: '2026-09-03',
    priority: 'high',
    description: 'Alokasikan tiket kasus ke petugas spesialis sesuai domain masalah pelanggan.'
  },
  {
    id: 'ct-2',
    stage: 'allocation',
    title: 'Acknowledge Case receipt to customer!',
    completed: true,
    category: 'Customer Communication',
    assignee: {
      name: 'Sam Frank',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'Support Lead'
    },
    dueDate: '2026-09-03',
    priority: 'normal',
    description: 'Kirim notifikasi tanda terima dan nomor tiket resmi kepada pelanggan.'
  },

  // STAGE 2: Issue Identification
  {
    id: 'ct-3',
    stage: 'identification',
    title: 'Identify Issue Category',
    completed: true,
    category: 'Problem Resolution',
    assignee: {
      name: 'Sarah K.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Triage Specialist'
    },
    dueDate: '2026-09-03',
    priority: 'normal',
    description: 'Klasifikasikan tipe kendala: bug API, frontend UI, atau konfigurasi data pengguna.'
  },
  {
    id: 'ct-4',
    stage: 'identification',
    title: 'Identify Issue Severity',
    completed: true,
    category: 'Problem Resolution',
    assignee: {
      name: 'Sarah K.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Triage Specialist'
    },
    dueDate: '2026-09-04',
    priority: 'high',
    description: 'Tentukan tingkat keparahan (P1 Critical, P2 Major, P3 Minor).'
  },
  {
    id: 'ct-5',
    stage: 'identification',
    title: 'Identify Issue Impact',
    completed: true,
    category: 'Problem Resolution',
    assignee: {
      name: 'Sarah K.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Triage Specialist'
    },
    dueDate: '2026-09-04',
    priority: 'normal',
    description: 'Ukur dampak terhadap jumlah pengguna aktif dan jalur pembayaran utama.'
  },
  {
    id: 'ct-6',
    stage: 'identification',
    title: 'Allocate to Resolution Team',
    completed: false,
    isBold: true,
    category: 'Request Processing',
    assignee: {
      name: 'Elena R.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      role: 'Technical Lead'
    },
    dueDate: '2026-09-05',
    priority: 'urgent',
    description: 'Serahkan kasus ke tim rekayasa backend/frontend yang bertugas untuk investigasi teknis.'
  },
  {
    id: 'ct-7',
    stage: 'identification',
    title: 'Advise Customer of Resolution estimate',
    completed: false,
    isBold: true,
    category: 'Customer Communication',
    assignee: {
      name: 'Maya T.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      role: 'Customer Success'
    },
    dueDate: '2026-09-05',
    priority: 'normal',
    description: 'Beritahu klien mengenai estimasi waktu penyelesaian (SLA response time).'
  },

  // STAGE 3: Technical Resolution
  {
    id: 'ct-8',
    stage: 'resolution',
    title: 'Identify Issue Dependencies',
    completed: false,
    isActionableAdd: true,
    category: 'Testing and Verification',
    dueDate: '2026-09-05',
    priority: 'high',
    description: 'Cek dependensi antarmuka pihak ketiga, gateway payment, dan antrean Redis.'
  },
  {
    id: 'ct-9',
    stage: 'resolution',
    title: 'Identify Issue Resolution',
    completed: false,
    isActionableAdd: true,
    category: 'Problem Resolution',
    dueDate: '2026-09-06',
    priority: 'urgent',
    description: 'Rancang patch perbaikan kode atau konfigurasi parameter sistem.'
  },
  {
    id: 'ct-10',
    stage: 'resolution',
    title: 'Estimate Resolution Time',
    completed: false,
    isBold: true,
    category: 'Problem Resolution',
    assignee: {
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Engineer'
    },
    dueDate: '2026-09-06',
    priority: 'high',
    description: 'Kalkulasi sprint point dan estimasi durasi deployment hotfix.'
  },
  {
    id: 'ct-11',
    stage: 'resolution',
    title: 'Advise Customer of Resolution Estimate',
    completed: false,
    category: 'Customer Communication',
    assignee: {
      name: 'Elena R.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      role: 'Technical Lead'
    },
    dueDate: '2026-09-07',
    priority: 'normal',
    description: 'Pembaruan berkala kepada pelanggan bahwa analisis selesai dan proses fixing berjalan.'
  },
  {
    id: 'ct-12',
    stage: 'resolution',
    title: 'Advise Customer Issue Resolved',
    completed: false,
    isActionableAdd: true,
    category: 'Customer Satisfaction',
    dueDate: '2026-09-08',
    priority: 'normal',
    description: 'Konfirmasi penyelesaian kendala secara resmi setelah pengujian QA berhasil lulus.'
  }
];

export const AVAILABLE_ASSIGNEES = [
  {
    name: 'Sam Frank',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    role: 'Support Lead'
  },
  {
    name: 'Sarah K.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Triage Specialist'
  },
  {
    name: 'Elena R.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Technical Lead'
  },
  {
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Senior Engineer'
  },
  {
    name: 'Maya T.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    role: 'Customer Success'
  }
];
