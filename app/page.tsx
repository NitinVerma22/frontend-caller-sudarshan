"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats, useLeads } from "@/hooks/useLeads";
import {
  Users,
  PhoneCall,
  Star,
  TrendingUp,
  ArrowRight,
  Loader2,
  LogOut,
  Target,
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/utils";

import Image from "next/image";

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const cards = [
    {
      label: "Fresh Leads",
      value: stats.fresh,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      href: "/fresh-leads",
    },
    {
      label: "Calls Today",
      value: stats.callsToday,
      icon: PhoneCall,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      href: "/fresh-leads",
    },
    {
      label: "Interested",
      value: stats.interestedToday,
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      href: "/fresh-leads",
    },
    {
      label: "Converted",
      value: stats.converted,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      href: "/fresh-leads",
    },
  ];

  return (
    <main className="min-h-screen pb-24 bg-[#030712] text-slate-300">
      {/* Premium Top Bar */}
      <div className="bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800/50 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg p-1.5 overflow-hidden">
              <img 
                src="/logo.png?v=1" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight leading-none">CallFlow</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{user.name} • Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Welcome Section */}
        <div className="mb-4 animate-fade-in px-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Performance</h2>
          <p className="text-slate-500 text-sm font-medium mt-0.5 uppercase tracking-wider text-[10px]">Real-time analytics engine</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statsLoading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-slate-900/50 rounded-2xl border border-slate-800/50 animate-pulse" />
              ))
            : cards.map((card, i) => (
                <Link
                  key={i}
                  href={card.href}
                  className="bg-slate-900/40 p-4 rounded-[22px] border border-slate-800/50 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 animate-fade-in group flex flex-col relative overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110", card.bg, card.border)}>
                    <card.icon size={16} className={card.color} />
                  </div>
                  <span className="text-xl font-black text-white tabular-nums tracking-tight">{card.value}</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">{card.label}</span>
                    <ArrowRight size={12} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                  </div>
                  {/* Subtle Glow */}
                  <div className={cn("absolute -bottom-4 -right-4 w-10 h-10 blur-2xl opacity-10", card.bg)} />
                </Link>
              ))}
        </div>

        {/* Strategic Insight */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden animate-slide-up">
          <div className="relative z-10">
            <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-5 border border-white/10">
              Strategic Insight
            </div>
            <h3 className="text-xl font-bold mb-2">Maximize Reach</h3>
            <p className="text-blue-100/70 text-sm leading-relaxed mb-8 max-w-[80%]">
              High-priority leads respond best between <span className="text-white font-black">10 AM — 12 PM</span>. Plan your callbacks accordingly.
            </p>
            <Link href="/follow-ups" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
              View Schedule
              <ArrowRight size={14} />
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
