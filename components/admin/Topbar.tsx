"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96 border border-slate-100">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search leads, telecallers..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{user?.name || "Admin"}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {user?.role || "Administrator"}
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
