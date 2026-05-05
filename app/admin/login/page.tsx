"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Admin access granted");
    } catch (error: any) {
      toast.error(error.message || "Invalid Admin Credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-slate-50 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-10">
          <div className="relative w-24 h-24 group">
            <div className="absolute inset-0 bg-blue-600/20 rounded-[32px] blur-2xl group-hover:bg-blue-600/30 transition-all duration-500" />
            <div className="relative w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-200/50 border border-slate-100 overflow-hidden p-3 transition-transform duration-500 group-hover:scale-105">
              <img 
                src="/logo.png?v=1" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 text-center">Admin Portal</h1>
            <p className="text-slate-400 text-sm text-center mt-2">Enter your credentials to access the console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-slate-700"
                  placeholder="admin@crm.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
