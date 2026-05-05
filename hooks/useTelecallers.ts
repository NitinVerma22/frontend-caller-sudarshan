"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export function useTelecallers() {
  const [telecallers, setTelecallers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTelecallers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/telecallers");
      setTelecallers(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch telecallers");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTelecaller = async (userData: any) => {
    try {
      await api.post("/auth/register", { ...userData, role: "telecaller" });
      toast.success("Telecaller added successfully");
      fetchTelecallers();
    } catch (err: any) {
      toast.error(err.message || "Failed to add telecaller");
      throw err;
    }
  };

  const deleteTelecaller = async (id: string) => {
    if (!confirm("Are you sure you want to delete this telecaller?")) return;
    try {
      await api.delete(`/admin/telecallers/${id}`);
      toast.success("Telecaller deleted");
      fetchTelecallers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete telecaller");
    }
  };

  useEffect(() => {
    fetchTelecallers();
  }, [fetchTelecallers]);

  return { telecallers, loading, addTelecaller, deleteTelecaller, refetch: fetchTelecallers };
}
