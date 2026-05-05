// ─── Lead Status ─────────────────────────────────────────────────────────────
export type LeadStatus =
  | "new"
  | "fresh"
  | "connected"
  | "not_connected"
  | "busy"
  | "callback"
  | "follow_up"
  | "interested"
  | "not_interested"
  | "converted";

// ─── Lead ────────────────────────────────────────────────────────────────────
export interface Lead {
  _id: string;
  name: string;
  businessName: string;
  location: string;
  phone: string;
  status: LeadStatus;
  notes?: string;
  followUpDate?: string; // ISO string
  followUpNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Follow-up ───────────────────────────────────────────────────────────────
export interface FollowUp {
  _id: string;
  lead: Lead;
  note: string;
  scheduledAt: string; // ISO string
  status: LeadStatus;
  createdAt: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  total: number;
  fresh: number;
  connected: number;
  not_connected: number;
  interested: number;
  not_interested: number;
  converted: number;
  follow_up: number;
  callback: number;
  busy: number;
  interestedToday: number;
  callsToday: number;
}

// ─── API Response ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Update Lead Payload ─────────────────────────────────────────────────────
export interface UpdateLeadPayload {
  status: LeadStatus;
  followUpNote?: string;
  followUpDate?: string;
}
