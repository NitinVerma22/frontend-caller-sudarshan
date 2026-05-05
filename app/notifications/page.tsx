"use client";

import { useNotifications, useLeads } from "@/hooks/useLeads";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import { Bell, ChevronDown, Clock, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import NotificationCard from "@/components/ui/NotificationCard";
import { formatDistanceToNow, format } from "date-fns";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function Notifications() {
  const { todayFollowUps, overdueFollowUps, loading, refetch } = useNotifications();

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/followups/mark-read/${id}`);
      toast.success("Alert cleared");
      refetch();
    } catch (err) {
      toast.error("Failed to clear alert");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Clear all active alerts?")) return;
    try {
      await api.post("/followups/clear-all");
      toast.success("All alerts cleared");
      refetch();
    } catch (err) {
      toast.error("Failed to clear alerts");
    }
  };

  // Sort today's follow-ups by scheduled time
  const sortedToday = [...todayFollowUps].sort((a, b) => 
    new Date(a.nextFollowUpDate).getTime() - new Date(b.nextFollowUpDate).getTime()
  );

  const totalAlerts = todayFollowUps.length + overdueFollowUps.length;

  return (
    <main className="min-h-screen bg-[#030712] pb-32 max-w-lg mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/50 px-5 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Alerts</h1>
            <p className="text-slate-500 text-[11px] font-bold mt-1 uppercase tracking-[0.15em]">Strategic Pulse Monitor</p>
          </div>
          <div className="flex items-center gap-3">
            {totalAlerts > 0 && (
              <button
                onClick={handleClearAll}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-all shadow-xl"
                title="Clear all alerts"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-blue-500/10 relative">
              <Bell size={20} className="text-blue-500" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-[#030712]">
                  {totalAlerts}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Real Overdue Notifications */}
        {overdueFollowUps.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-2">
              <AlertTriangle size={12} />
              Immediate Action Required
            </h3>
            {overdueFollowUps.map((item: any) => (
              <NotificationCard
                key={item._id}
                type="overdue"
                title={`Missed Callback: ${item.leadId?.name || "Unknown"}`}
                description={`Scheduled for ${format(new Date(item.nextFollowUpDate), 'hh:mm a')}. Call now to avoid losing this lead.`}
                time={formatDistanceToNow(new Date(item.nextFollowUpDate), { addSuffix: true })}
                onRead={() => handleMarkRead(item._id)}
              />
            ))}
          </div>
        )}

        {/* Real Today Notifications */}
        {sortedToday.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Clock size={12} />
              Scheduled for Today
            </h3>
            {sortedToday.map((item: any) => (
              <NotificationCard
                key={item._id}
                type="due_soon"
                title={`Upcoming: ${item.leadId?.name || "Unknown"}`}
                description={`Follow-up scheduled at ${format(new Date(item.nextFollowUpDate), 'hh:mm a')}. Note: ${item.note || "N/A"}`}
                time={formatDistanceToNow(new Date(item.nextFollowUpDate), { addSuffix: true })}
                onRead={() => handleMarkRead(item._id)}
              />
            ))}
          </div>
        )}

        {/* Mocked Notifications for system updates */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <CheckCircle2 size={12} />
            System Updates
          </h3>
          <NotificationCard
            type="new_leads"
            title="Leads Queue Refreshed"
            description="Your manager has added new leads to your repository. Check your Fresh Leads section."
            time="2 hours ago"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 opacity-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-900 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        )}

        {!loading && totalAlerts === 0 && (
          <EmptyState
            title="Strategic Silence"
            description="No pending callbacks or alerts for today. Your pipeline is up to date."
            icon={<CheckCircle2 size={32} className="text-slate-800" />}
          />
        )}
      </div>

      <BottomNav />
    </main>
  );
}
