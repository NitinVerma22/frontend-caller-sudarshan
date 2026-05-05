"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Lead, LeadStatus, UpdateLeadPayload, DashboardStats } from "@/types";

// ─── Lead Hook ──────────────────────────────────────────────────────────────
export function useLeads(filterStatus?: string, limit: number = 100) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/leads", {
        params: {
          status: filterStatus || undefined,
          limit: limit,
        }
      });
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const updateLeadStatus = useCallback(
    async (id: string, payload: UpdateLeadPayload): Promise<void> => {
      try {
        await api.put(`/leads/${id}`, payload);
        await load();
      } catch (err: any) {
        throw new Error(err.message || "Failed to update lead");
      }
    },
    [load]
  );

  return { leads, loading, error, refetch: load, updateLead: updateLeadStatus };
}

// ─── Dashboard stats hook ────────────────────────────────────────────────────
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    fresh: 0,
    connected: 0,
    not_connected: 0,
    interested: 0,
    not_interested: 0,
    converted: 0,
    follow_up: 0,
    callback: 0,
    busy: 0,
    interestedToday: 0,
    callsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, refetch: load };
}

// ─── Follow-ups hook ─────────────────────────────────────────────────────────
export function useFollowUps() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/followups");
      setFollowUps(data);
    } catch (err) {
      console.error("Failed to load follow-ups", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { followUps, loading, refetch: load };
}

// ─── Notifications hook ───────────────────────────────────────────────────────
export function useNotifications() {
  const [todayFollowUps, setToday] = useState<any[]>([]);
  const [overdueFollowUps, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [todayRes, overdueRes] = await Promise.all([
        api.get("/followups/today"),
        api.get("/followups/overdue"),
      ]);
      setToday(todayRes.data);
      setOverdue(overdueRes.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { todayFollowUps, overdueFollowUps, loading, refetch: load };
}

