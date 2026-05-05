import api from "@/lib/axios";
import type {
  ApiResponse,
  DashboardStats,
  Lead,
  LeadStatus,
  UpdateLeadPayload,
  FollowUp,
} from "@/types";

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const fetchDashboardStats = () =>
  api.get<ApiResponse<DashboardStats>>("/leads/stats");

// ── Leads ─────────────────────────────────────────────────────────────────────
export const fetchLeads = (status?: LeadStatus) =>
  api.get<ApiResponse<Lead[]>>("/leads", { params: status ? { status } : {} });

export const fetchLeadById = (id: string) =>
  api.get<ApiResponse<Lead>>(`/leads/${id}`);

export const updateLead = (id: string, payload: UpdateLeadPayload) =>
  api.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);

// ── Follow-ups ────────────────────────────────────────────────────────────────
export const fetchFollowUps = () =>
  api.get<ApiResponse<FollowUp[]>>("/follow-ups");

export const fetchTodayFollowUps = () =>
  api.get<ApiResponse<FollowUp[]>>("/follow-ups/today");

export const fetchOverdueFollowUps = () =>
  api.get<ApiResponse<FollowUp[]>>("/follow-ups/overdue");
