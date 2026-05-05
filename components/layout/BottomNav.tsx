"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  ShieldCheck,
  Bell,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/fresh-leads", label: "Leads", icon: Users },
    { href: "/follow-ups", label: "Follow Ups", icon: CalendarClock },
    { href: "/notifications", label: "Alerts", icon: Bell },
  ];

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: "Admin", icon: ShieldCheck });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/90 backdrop-blur-2xl border-t border-slate-800/50 shadow-2xl">
      <div className="max-w-lg mx-auto flex justify-around p-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center gap-1 flex-1 py-2 px-1 transition-all duration-300
                ${active 
                  ? "text-blue-400" 
                  : "text-slate-500 hover:text-slate-300"}
              `}
            >
              <Icon size={18} className={active ? "scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "scale-100"} />
              <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
