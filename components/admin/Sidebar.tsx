"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  UserPlus, 
  BarChart3,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import Image from "next/image";

const MENU_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/telecallers", label: "Telecallers", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Database },
  { href: "/admin/assign", label: "Assign Leads", icon: UserPlus },
  { href: "/admin/performance", label: "Performance", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 p-1.5 shadow-sm">
            <img 
              src="/logo.png?v=1" 
              alt="Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">CallCRM</span>
        </div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active 
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-50">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
