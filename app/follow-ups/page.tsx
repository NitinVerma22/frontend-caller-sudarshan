"use client";

import { useFollowUps, useLeads } from "@/hooks/useLeads";
import { useMemo, useState } from "react";
import LeadCard from "@/components/leads/LeadCard";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import { CalendarClock, AlertCircle, Clock, CheckCircle2, Search, X } from "lucide-react";
import { isToday, isOverdue } from "@/utils";
import { cn } from "@/utils";

export default function FollowUps() {
  const { followUps, loading } = useFollowUps();
  const { updateLead } = useLeads();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filters = [
    { id: "all", label: "All", color: "bg-slate-800 text-slate-300" },
    { id: "interested", label: "Interested", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { id: "not_interested", label: "Not Interested", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { id: "converted", label: "Converted", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { id: "follow_up", label: "Need Follow", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { id: "callback", label: "Callback", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    { id: "busy", label: "Busy", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    { id: "not_connected", label: "No Answer", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  ];

  const filteredFollowUps = useMemo(() => {
    let list = followUps;
    if (activeFilter !== "all") {
      list = list.filter(f => f.leadId?.status === activeFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(f => 
        f.leadId?.name?.toLowerCase().includes(term) || 
        f.leadId?.phone?.includes(searchTerm)
      );
    }
    return list;
  }, [followUps, activeFilter, searchTerm]);

  const sections = useMemo(() => {
    const overdue = filteredFollowUps.filter(f => isOverdue(f.nextFollowUpDate) && f.status === "pending");
    const today = filteredFollowUps.filter(f => isToday(f.nextFollowUpDate) && !isOverdue(f.nextFollowUpDate));
    const upcoming = filteredFollowUps.filter(f => !isToday(f.nextFollowUpDate) && !isOverdue(f.nextFollowUpDate));
    return { overdue, today, upcoming };
  }, [filteredFollowUps]);

  const renderSection = (title: string, items: any[], icon: any, colorClass: string, sub: string) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", colorClass)}>
            {icon}
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{sub}</h3>
            <h2 className="text-sm font-bold text-white">{title}</h2>
          </div>
          <span className="ml-auto text-[10px] font-black text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/50">
            {items.length}
          </span>
        </div>
        <div className="space-y-0">
          {items.map((item) => {
            const leadData = {
              ...item.leadId,
              followUpNote: item.note,
              followUpDate: item.nextFollowUpDate,
            };
            const isLate = isOverdue(item.nextFollowUpDate);

            return (
              <div key={item._id} className="relative group">
                <div className={cn(
                  "absolute left-0 top-0 bottom-4 w-1 rounded-full transition-all group-hover:w-1.5",
                  isLate ? "bg-red-500" : "bg-amber-500"
                )} />
                <div className="pl-4">
                   <LeadCard lead={leadData} onUpdate={updateLead} showFollowUpInfo />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#030712] pb-24 max-w-lg mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/50 px-5 py-4 mb-4">
        <div className="flex items-center justify-between">
          {!showSearch ? (
            <>
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <h1 className="text-2xl font-black text-white tracking-tight">Schedule</h1>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Strategic follow-up pipeline</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSearch(true)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
                >
                  <Search size={18} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                  <CalendarClock size={20} className="text-blue-500" />
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

      {/* Filters Tab */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <div className="flex items-center gap-2 min-w-max px-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all active:scale-95",
                activeFilter === filter.id 
                  ? filter.color + " border-transparent shadow-lg shadow-black/20" 
                  : "bg-slate-900/50 text-slate-500 border-slate-800/50 hover:border-slate-700"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800/50" />
          ))}
        </div>
      ) : filteredFollowUps.length > 0 ? (
        <>
          {renderSection("Overdue Action", sections.overdue, <AlertCircle size={18} className="text-red-400" />, "bg-red-500/10 border-red-500/20", "Immediate")}
          {renderSection("Due Today", sections.today, <Clock size={18} className="text-amber-400" />, "bg-amber-500/10 border-amber-500/20", "Active")}
          {renderSection("Future Pipeline", sections.upcoming, <CheckCircle2 size={18} className="text-blue-400" />, "bg-blue-500/10 border-blue-500/20", "Planned")}
        </>
      ) : (
          <EmptyState
            title="Pipeline Clear"
            description={searchTerm ? "No results found for your search." : "No follow-ups found for the selected filter."}
            icon={<CalendarClock size={32} className="text-slate-800" />}
          />
        )}

      <BottomNav />
    </main>
  );
}
