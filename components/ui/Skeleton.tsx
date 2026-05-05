"use client";

export function LeadCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-40 bg-slate-100 rounded" />
        <div className="h-3 w-28 bg-slate-100 rounded" />
      </div>
      <div className="mt-3 h-9 bg-slate-100 rounded-xl" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
      <div className="h-8 w-8 bg-slate-200 rounded-xl mb-2" />
      <div className="h-7 w-12 bg-slate-200 rounded mb-1" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}
