"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export function useAdminPerformance() {
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/performance");
      setPerformance(data);
    } catch (err) {
      console.error("Failed to load performance", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { performance, loading, refetch: load };
}

export function useAdminActions() {
  const [isAssigning, setIsAssigning] = useState(false);

  const assignLeads = async (leadIds: string[], telecallerId: string) => {
    setIsAssigning(true);
    try {
      await api.post("/admin/assign", { leadIds, telecallerId });
    } catch (err: any) {
      throw new Error(err.message || "Failed to assign leads");
    } finally {
      setIsAssigning(false);
    }
  };

  return { assignLeads, isAssigning };
}
