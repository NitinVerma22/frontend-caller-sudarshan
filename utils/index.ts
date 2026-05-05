import type { LeadStatus } from "@/types";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Fresh",
  fresh: "Fresh",
  connected: "Connected",
  not_connected: "No Answer",
  busy: "Busy",
  interested: "Interested",
  not_interested: "Not Interested",
  converted: "Converted",
  callback: "Callback",
  follow_up: "Need Follow",
};

export const STATUS_COLORS: Record<
  LeadStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  new: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  fresh: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  connected: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  not_connected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  busy: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  interested: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  not_interested: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  converted: {
    bg: "bg-green-900",
    text: "text-white",
    border: "border-green-800",
    dot: "bg-green-400",
  },
  callback: {
    bg: "bg-rose-100",
    text: "text-rose-800",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  follow_up: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

export const STATUSES: LeadStatus[] = [
  "interested",
  "not_interested",
  "converted",
  "follow_up",
  "callback",
  "busy",
  "not_connected",
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
