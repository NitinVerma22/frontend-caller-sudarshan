"use client";

import { useState } from "react";
import {
  Phone,
  Building2,
  User,
  ChevronRight,
  MapPin,
  MessageCircle,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import UpdateStatusModal from "@/components/leads/UpdateStatusModal";
import { formatDistanceToNow } from "date-fns";
import type { Lead, UpdateLeadPayload } from "@/types";
import { cn } from "@/utils";

interface LeadCardProps {
  lead: Lead;
  onUpdate: (id: string, payload: UpdateLeadPayload) => Promise<void>;
  showFollowUpInfo?: boolean;
}

export default function LeadCard({
  lead,
  onUpdate,
  showFollowUpInfo = false,
}: LeadCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const lastContacted = lead.updatedAt ? formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true }) : null;

  // Clean phone for WhatsApp: remove non-numeric
  const cleanPhone = lead.phone.replace(/\D/g, "");
  // If it doesn't start with a country code, you might want to add one. 
  // Assuming Indian numbers if 10 digits without code.
  const whatsappPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <>
      <div className="bg-[#0f172a] border border-slate-800/40 rounded-xl p-3 shadow-lg hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden mb-3">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-12 -mt-12 pointer-events-none" />
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
              <User size={16} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-white truncate leading-tight">
                {lead.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <Building2 size={9} className="text-slate-500" />
                  <span className="text-[9px] font-semibold text-slate-500 truncate uppercase tracking-wider">
                    {lead.businessName || "Direct Inquiry"}
                  </span>
                </div>
                {lead.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={9} className="text-rose-500/70" />
                    <span className="text-[9px] font-semibold text-slate-500 truncate uppercase tracking-wider">
                      {lead.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <StatusBadge status={lead.status} size="sm" />
        </div>

        {/* Mid Row: Info */}
        <div className="flex items-center gap-3 mb-3 px-0.5">
          <div className="flex items-center gap-1">
            <Phone size={10} className="text-slate-500" />
            <span className="text-[10px] text-slate-400 font-medium">{lead.phone}</span>
          </div>
          {lastContacted && (
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-1 h-1 rounded-full bg-blue-500/40" />
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{lastContacted}</span>
            </div>
          )}
        </div>

        {/* Note Preview (Optional) */}
        {(lead.followUpNote || lead.notes) && (
          <div className="mb-3 py-1.5 px-2.5 rounded-lg bg-slate-800/30 border border-slate-700/20">
            <p className="text-[9px] text-slate-500 leading-tight line-clamp-1 italic">
              "{lead.followUpNote || lead.notes}"
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${lead.phone}`;
              setModalOpen(true);
            }}
            className="flex-1 h-8 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg flex items-center justify-center gap-1.5 text-slate-300 text-[10px] font-bold transition-all"
          >
            <Phone size={11} />
            Call
          </button>
          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-8 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-1.5 text-emerald-400 text-[10px] font-bold transition-all"
          >
            <MessageCircle size={11} />
            WhatsApp
          </a>
          <button
            onClick={() => setModalOpen(true)}
            className="flex-[1.2] h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-1 text-white text-[10px] font-black transition-all shadow-lg shadow-blue-900/20"
          >
            Update
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <UpdateStatusModal
        lead={lead}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
}
