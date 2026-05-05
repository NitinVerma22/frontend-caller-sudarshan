"use client";

import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Nothing here yet",
  description = "No items to display",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        {icon || <InboxIcon size={28} />}
      </div>
      <h3 className="text-base font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs">{description}</p>
    </div>
  );
}
