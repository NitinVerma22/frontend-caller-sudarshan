"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { 
  Plus, 
  Search, 
  Filter, 
  Database, 
  User, 
  Phone, 
  MapPin, 
  Briefcase,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Trash2,
  AlertTriangle
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { STATUS_LABELS, STATUS_COLORS } from "@/utils";

function LeadsList() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "";

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters & Search
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Update status if URL param changes
  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessName: "",
    location: "",
  });

  // Bulk Import
  const [showImportBox, setShowImportBox] = useState(false);
  const [pastedData, setPastedData] = useState("");
  const [previewLeads, setPreviewLeads] = useState<any[]>([]);

  // Bulk Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [telecallers, setTelecallers] = useState<any[]>([]);
  const [deleteTelecallerId, setDeleteTelecallerId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads", {
        params: {
          page,
          search,
          status: status || undefined,
          limit: 10
        }
      });
      setLeads(data.leads);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        const { data } = await api.get("/admin/telecallers");
        setTelecallers(data);
      } catch (err) {
        console.error("Failed to fetch telecallers", err);
      }
    };
    if (isDeleteModalOpen) {
      fetchTelecallers();
    }
  }, [isDeleteModalOpen]);

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedData(text);
    
    if (!text.trim()) {
      setPreviewLeads([]);
      return;
    }

    const rows = text.trim().split("\n");
    const parsed = rows.map(row => {
      const cols = row.split("\t");
      return {
        name: cols[0]?.trim() || "",
        phone: cols[1]?.trim() || "",
        businessName: cols[2]?.trim() || "",
        location: cols[3]?.trim() || "",
      };
    }).filter(l => l.name && l.phone);

    setPreviewLeads(parsed);
  };

  const handleBulkSubmit = async () => {
    if (previewLeads.length === 0) {
      toast.error("No valid leads to import");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/leads/bulk", { leads: previewLeads });
      toast.success(`${previewLeads.length} leads imported successfully`);
      setShowImportBox(false);
      setPastedData("");
      setPreviewLeads([]);
      fetchLeads();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Bulk import failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLeads = async () => {
    if (!confirm("Are you sure you want to delete these leads? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const { data } = await api.delete("/leads", {
        params: {
          assignedTo: deleteTelecallerId || undefined,
        }
      });
      toast.success(data.message);
      setIsDeleteModalOpen(false);
      fetchLeads();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete leads");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/leads", formData);
      toast.success("Lead added successfully");
      setIsModalOpen(false);
      setFormData({ name: "", phone: "", businessName: "", location: "" });
      fetchLeads();
    } catch (err: any) {
      toast.error(err.message || "Failed to add lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Repository</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor all system leads</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-white text-rose-600 border border-rose-100 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-rose-50 transition-all flex items-center gap-2"
          >
            <Trash2 size={18} />
            Bulk Delete
          </button>
          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className={`${showImportBox ? 'bg-slate-800' : 'bg-emerald-600'} text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center gap-2`}
          >
            <Upload size={18} />
            {showImportBox ? 'Hide Import' : 'Bulk Import'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Bulk Import Section (Inline) */}
      {showImportBox && (
        <div className="bg-white rounded-[32px] border border-emerald-100 shadow-xl shadow-emerald-500/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Quick Import Leads</h3>
                    <p className="text-sm text-slate-500">Paste your Excel data below to add multiple leads instantly</p>
                  </div>
                  <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 uppercase">Columns: Name, Phone, Business, Location</span>
                  </div>
                </div>

                <textarea
                  value={pastedData}
                  onChange={handlePaste}
                  className="w-full h-48 px-6 py-4 rounded-[24px] border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none text-sm font-mono transition-all bg-slate-50/30"
                  placeholder="Ramesh Patel	9876543210	Patel Stores	Ahmedabad..."
                />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-400">
                    {previewLeads.length} valid leads detected in your clipboard
                  </p>
                  <button
                    onClick={handleBulkSubmit}
                    disabled={isSubmitting || previewLeads.length === 0}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Upload size={18} /> Import Now</>}
                  </button>
                </div>
              </div>

              {previewLeads.length > 0 && (
                <div className="w-full lg:w-80 flex flex-col">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Data Preview</h4>
                  <div className="flex-1 max-h-[240px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-white sticky top-0 border-b border-slate-100">
                        <tr>
                          <th className="px-3 py-2 font-bold text-slate-500">Name</th>
                          <th className="px-3 py-2 font-bold text-slate-500">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewLeads.slice(0, 50).map((l, i) => (
                          <tr key={i} className="hover:bg-white transition-colors">
                            <td className="px-3 py-2 text-slate-700 font-medium">{l.name}</td>
                            <td className="px-3 py-2 text-slate-500">{l.phone}</td>
                          </tr>
                        ))}
                        {previewLeads.length > 50 && (
                          <tr>
                            <td colSpan={2} className="px-3 py-2 text-center text-slate-400 italic">
                              + {previewLeads.length - 50} more leads...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="pl-11 pr-10 py-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-medium text-slate-600 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 min-w-[160px]"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lead Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Business & Location</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-10 h-24 bg-slate-50/20"></td>
                  </tr>
                ))
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-700">{lead.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Phone size={10} />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Briefcase size={14} className="text-slate-300" />
                        {lead.businessName || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <MapPin size={10} />
                        {lead.location || "—"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]?.bg} ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]?.text}`}>
                        {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-medium text-slate-500">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-slate-700">{lead.assignedTo.name}</span>
                          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-[10px] text-blue-600 uppercase">
                            {lead.assignedTo.name.charAt(0)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Database className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400">No leads found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Manual Lead"
      >
        <form onSubmit={handleAddLead} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contact Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
              placeholder="e.g. Ramesh Patel"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
              placeholder="10 digit number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
                placeholder="Shop/Company name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
                placeholder="City/Area"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Lead Details"}
          </button>
        </form>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Bulk Delete Leads"
      >
        <div className="space-y-4 pt-2">
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <p className="text-xs text-rose-600 leading-relaxed">
              Select a filter to delete leads. If no telecaller is selected, you can delete <b>unassigned</b> leads or <b>all</b> leads based on your choice.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Filter by Telecaller</label>
            <select
              value={deleteTelecallerId}
              onChange={(e) => setDeleteTelecallerId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none text-sm"
            >
              <option value="">All Leads (System Wide)</option>
              <option value="none">Unassigned Leads Only</option>
              {telecallers.map(tc => (
                <option key={tc._id} value={tc._id}>{tc.name} ({tc.email})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDeleteLeads}
            disabled={isDeleting}
            className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={20} /> : "Permanently Delete Leads"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
      <LeadsList />
    </Suspense>
  );
}
