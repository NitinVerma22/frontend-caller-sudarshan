"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/utils";
import type { Lead, LeadStatus, UpdateLeadPayload } from "@/types";
import { CheckCircle2, XCircle, PhoneCall, Calendar, MessageSquare } from "lucide-react";

interface UpdateStatusModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateLeadPayload) => Promise<void>;
}

export default function UpdateStatusModal({
  lead,
  open,
  onClose,
  onUpdate,
}: UpdateStatusModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<LeadStatus>("connected");
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setStep(1);
      setNote("");
      setFollowUpDate("");
      setStatus("connected");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!lead) return;
    setLoading(true);
    try {
      const payload: UpdateLeadPayload = {
        status,
        followUpNote: note.trim() || undefined,
        followUpDate: followUpDate || undefined,
      };
      await onUpdate(lead._id, payload);
      toast.success(`Result logged: ${STATUS_LABELS[status]}`);
      onClose();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={step === 1 ? "Call Verification" : `Log Outcome — ${lead?.name ?? ""}`}
    >
      {step === 1 ? (
        <div className="py-2 animate-fade-in">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
              <PhoneCall className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-black text-white">Did they answer?</h3>
            <p className="text-slate-500 text-[11px] mt-1 font-medium uppercase tracking-widest">Select the initial call result</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => {
                setStatus("connected");
                setStep(2);
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-sm">Yes, Connected</span>
                <span className="text-[10px] text-slate-500">Call was successful</span>
              </div>
            </button>

            <button
              onClick={() => {
                setStatus("busy");
                setStep(2);
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-sm">Busy / Call Later</span>
                <span className="text-[10px] text-slate-500">Will stay in queue</span>
              </div>
            </button>

            <button
              onClick={() => {
                setStatus("not_connected");
                setStep(2);
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <XCircle size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-sm">No Answer</span>
                <span className="text-[10px] text-slate-500">Unreachable right now</span>
              </div>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-2 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="animate-slide-up">
          {/* Status selection */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
              Final Outcome
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const c = STATUS_COLORS[s];
                const selected = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black border transition-all h-10
                      ${selected ? `${c.bg} ${c.text} ${c.border} shadow-lg scale-[1.02]` : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected ? c.dot : "bg-slate-700"}`} />
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow-up note */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
              Interaction Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Brief summary..."
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Follow-up date */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
              Follow-up Schedule
            </label>
            <input
              type="datetime-local"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="h-12 px-5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs hover:bg-slate-700 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Processing..." : "Complete Log"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
