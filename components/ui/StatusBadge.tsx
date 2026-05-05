"use client";

import { STATUS_COLORS, STATUS_LABELS } from "@/utils";
import type { LeadStatus } from "@/types";

interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.fresh;
  const label = STATUS_LABELS[status] || status;
  
  const sizeClasses = size === "sm" 
    ? "px-2.5 py-0.5 text-[10px]" 
    : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border shadow-sm ${c.bg} ${c.text} ${c.border} ${sizeClasses} transition-all duration-300 hover:scale-105`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${c.dot} animate-pulse`} />
      {label}
    </span>
  );
}
