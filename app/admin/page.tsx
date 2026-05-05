"use client";

import { useDashboardStats } from "@/hooks/useLeads";
import { useTelecallers } from "@/hooks/useTelecallers";
import { 
  Users, 
  Database, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  PhoneOff,
  UserCheck,
  AlertCircle,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { telecallers, loading: tcLoading } = useTelecallers();

  const cards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: Database,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      href: "/admin/leads",
      desc: "All leads in system"
    },
    {
      label: "Telecallers",
      value: telecallers.length,
      icon: Users,
      color: "bg-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      href: "/admin/telecallers",
      desc: "Active team members"
    },
    {
      label: "Total Converted",
      value: stats.converted,
      icon: TrendingUp,
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      href: "/admin/leads?status=converted",
      desc: "Closed deals"
    },
    {
      label: "Fresh Leads",
      value: stats.fresh,
      icon: Zap,
      color: "bg-amber-600",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
      href: "/admin/leads?status=new",
      desc: "Unprocessed"
    },
  ];

  const statusBreakdown = [
    { label: "Interested", value: stats.interested, status: "interested", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Follow Up", value: stats.follow_up, status: "follow_up", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Callback", value: stats.callback, status: "callback", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Busy", value: stats.busy, status: "busy", icon: PhoneOff, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Not Connected", value: stats.not_connected, status: "not_connected", icon: XCircle, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    { label: "Not Interested", value: stats.not_interested, status: "not_interested", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  ];

  const loading = statsLoading || tcLoading;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Console Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, Administrator</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-slate-600 text-sm font-bold">
          <Calendar size={18} className="text-blue-600" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-[32px] animate-pulse border border-slate-100" />
          ))
        ) : (
          cards.map((card, i) => (
            <Link 
              key={i} 
              href={card.href}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`w-14 h-14 ${card.lightColor} rounded-2xl flex items-center justify-center ${card.textColor} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <card.icon size={28} />
              </div>
              
              <div className="space-y-1">
                <span className="text-4xl font-black text-slate-900">{card.value}</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              </div>

              <div className="absolute top-8 right-8 text-slate-200 group-hover:text-blue-500 transition-colors">
                <ArrowUpRight size={24} />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.desc}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Status Breakdown */}
      <div>
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Status Breakdown</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />
            ))
          ) : (
            statusBreakdown.map((item, i) => (
              <Link
                key={i}
                href={`/admin/leads?status=${item.status}`}
                className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.bg, item.border)}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{item.label}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions / Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Efficient Lead Assignment</h3>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
              Distribute your latest leads among telecallers to ensure immediate follow-up and higher conversion.
            </p>
            <Link 
              href="/admin/assign" 
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              Start Assigning
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <Database className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Team Performance</h3>
            <p className="text-blue-100 leading-relaxed mb-8 max-w-sm">
              Track real-time conversion rates and call stats for every member of your calling team.
            </p>
            <Link 
              href="/admin/performance" 
              className="inline-flex items-center gap-3 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg"
            >
              View Reports
              <TrendingUp size={20} />
            </Link>
          </div>
          <Users className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
}
