"use client";

import { useAdminPerformance } from "@/hooks/useAdmin";
import { 
  Users, 
  TrendingUp, 
  PhoneCall, 
  Star, 
  CheckCircle2, 
  BarChart2,
  Award,
  ArrowUpRight
} from "lucide-react";

export default function PerformancePage() {
  const { performance, loading } = useAdminPerformance();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Performance Tracking</h1>
          <p className="text-slate-500 text-sm mt-1">Analyze telecaller efficiency and conversion funnels</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <BarChart2 size={16} />
          Real-time Stats
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Telecaller</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Assigned</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Conversions</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Conv. Rate</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8 h-20 bg-slate-50/10"></td>
                  </tr>
                ))
              ) : performance.length > 0 ? (
                performance.map((tp) => {
                  const convRate = tp.totalLeads > 0 
                    ? Math.round((tp.conversions / tp.totalLeads) * 100) 
                    : 0;
                  
                  return (
                    <tr key={tp._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {tp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{tp.name}</div>
                            <div className="text-xs text-slate-400">{tp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-bold text-slate-600">{tp.totalLeads}</td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                          <CheckCircle2 size={14} />
                          {tp.conversions}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-black text-slate-800">{convRate}%</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${convRate > 50 ? 'bg-green-500' : convRate > 20 ? 'bg-blue-500' : 'bg-slate-300'}`}
                              style={{ width: `${convRate}%` }}
                            />
                          </div>
                          {convRate > 40 && <Award size={18} className="text-amber-400" />}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    No performance data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={32} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global conversion</h4>
            <p className="text-2xl font-black text-slate-800">12.5% Average</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={32} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Team</h4>
            <p className="text-2xl font-black text-slate-800">{performance.length} Telecallers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
