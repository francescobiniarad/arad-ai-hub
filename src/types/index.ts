// Kanban column definitions
export const KANBAN_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  { id: 'doing', label: 'Doing', color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
  { id: 'done', label: 'Done', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  { id: 'testing', label: 'Testing', color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  { id: 'ready', label: 'Ready for Adoption', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  { id: 'adopted', label: 'Adopted', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
] as const;

export type KanbanColumnId = (typeof KANBAN_COLUMNS)[number]['id'];

// Substream
export interface Substream {
  id: string;
  name: string;
  leader: string;
}

// Stream
export interface Stream {
  id: string;
  name: string;
  leader: string;
  substreams: Substream[];
}

// Idea (R&D)
export interface Idea {
  id: string;
  ideaId: number;
  text: string;
  description: string;
  streamId: string;
  substreamId: string | null;
  col: KanbanColumnId;
  partenza: string;
  arrivo: string;
}

// Certification
export interface Certification {
  id: string;
  name: string;
  provider: string;
  description: string;
  level: string;
  members: string;
}

// Practical AI Session
export interface PracticalSession {
  id: string;
  date: string;
  topic: string;
  referente: string;
  theory: string;
  practice: string;
}

// Workshop
export interface Workshop {
  id: string;
  date: string;
  topic: string;
  leader: string;
  notes: string;
}

// AI Offering
export interface AIOffering {
  id: string;
  stream: string;
  title: string;
  description: string;
  valueProp: string;
  sforzo: number;
  appetibilita: number;
  noteAM: string;
}

// Updates log entry (audit trail)
export interface UpdateLogEntry {
  id: string;
  timestamp: Date;
  userEmail: string;
  collection: string;
  documentId: string;
  fieldChanged: string;
  oldValue: unknown;
  newValue: unknown;
  reason?: string;
}

// Proposal (idea submitted by any team member)
export interface Proposal {
  id: string;
  titolo: string;
  descrizione: string;
  perche: string;
  asIs: string;
  toBe: string;
  streamId: string | null;
  roi: string;
  tipologia: string;
  email: string;
  createdAt?: Date;
}

// User (from Firebase Auth)
export interface AppUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}
