"use client";

import { useLeads } from "@/hooks/useLeads";
import LeadCard from "@/components/leads/LeadCard";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import { Users, Search, Target, X } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/utils";

export default function FreshLeads() {
  const { leads, loading, updateLead } = useLeads("fresh,busy,not_connected");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => {
        // Prioritize 'new' (fresh) leads at the top
        const aIsNew = a.status === "new" || a.status === "fresh";
        const bIsNew = b.status === "new" || b.status === "fresh";
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        return 0;
      })
      .filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.includes(searchTerm)
      );
  }, [leads, searchTerm]);

  return (
    <main className="min-h-screen bg-[#030712] pb-24 max-w-lg mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/50 px-5 py-4 mb-4">
        <div className="flex items-center justify-between">
          {!showSearch ? (
            <>
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <h1 className="text-2xl font-black text-white tracking-tight">Fresh Leads</h1>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">High-intent prospects queue</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSearch(true)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
                >
                  <Search size={18} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                  <Users size={20} className="text-blue-500" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Search size={16} />
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                />
              </div>
              <button 
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                }}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-2">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800/50" />
            ))}
          </div>
        ) : filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} onUpdate={updateLead} />
          ))
        ) : (
          <EmptyState
            title="Queue Optimized"
            description="All fresh leads have been processed. Great work!"
            icon={<Target size={32} className="text-slate-800" />}
          />
        )}
      </div>

      <BottomNav />
    </main>
  );
}
