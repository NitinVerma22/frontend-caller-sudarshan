"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Users,
  Search
} from "lucide-react";

export default function AssignLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [telecallers, setTelecallers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [targetTelecaller, setTargetTelecaller] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, callersRes] = await Promise.all([
        api.get("/leads", { params: { assigned: "false", limit: 100 } }),
        api.get("/admin/telecallers")
      ]);
      // Filter for truly unassigned leads if the backend doesn't handle the 'assigned' param yet
      const unassigned = leadsRes.data.leads.filter((l: any) => !l.assignedTo);
      setLeads(unassigned);
      setTelecallers(callersRes.data);
    } catch (err: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(leads.map(l => l._id));
    } else {
      setSelectedLeads([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!targetTelecaller) {
      toast.error("Select a telecaller first");
      return;
    }
    setIsAssigning(true);
    try {
      await api.post("/admin/assign", {
        leadIds: selectedLeads,
        telecallerId: targetTelecaller
      });
      toast.success(`Successfully assigned ${selectedLeads.length} leads`);
      setSelectedLeads([]);
      setTargetTelecaller("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assign Leads</h1>
        <p className="text-slate-500 text-sm mt-1">Distribute unassigned leads to your calling team</p>
      </div>

      {/* Assignment Control Bar */}
      {selectedLeads.length > 0 && (
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up sticky top-20 z-30 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">
              {selectedLeads.length}
            </div>
            <div>
              <p className="font-bold">Leads Selected</p>
              <p className="text-slate-400 text-xs">Ready for distribution</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              value={targetTelecaller}
              onChange={(e) => setTargetTelecaller(e.target.value)}
              className="flex-1 md:w-64 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Telecaller...</option>
              {telecallers.map(tc => (
                <option key={tc._id} value={tc._id}>{tc.name}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={isAssigning}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isAssigning ? <Loader2 className="animate-spin" size={18} /> : "Assign Now"}
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5 w-16">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={leads.length > 0 && selectedLeads.length === leads.length}
                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" 
                  />
                </th>
                <th className="px-4 py-5">Lead Name</th>
                <th className="px-8 py-5">Phone</th>
                <th className="px-8 py-5">Business</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8 h-16 bg-slate-50/10"></td>
                  </tr>
                ))
              ) : leads.length > 0 ? (
                leads.map((lead) => {
                  const isSelected = selectedLeads.includes(lead._id);
                  return (
                    <tr 
                      key={lead._id} 
                      onClick={() => toggleSelect(lead._id)}
                      className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50/30" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="px-8 py-5">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}} // Handled by tr onClick
                          className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                      </td>
                      <td className="px-4 py-5 font-bold text-slate-700">{lead.name}</td>
                      <td className="px-8 py-5 text-slate-500 font-medium">{lead.phone}</td>
                      <td className="px-8 py-5 text-slate-400 text-sm">{lead.businessName || "—"}</td>
                      <td className="px-8 py-5 text-right">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-800 font-bold">No unassigned leads!</p>
                    <p className="text-slate-400 text-sm">All leads have been distributed to your team.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
