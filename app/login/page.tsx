"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Mail, Lock, Loader2, Phone, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Authentication successful");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo and Welcome Text */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <div className="relative w-28 h-28 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-full p-2 overflow-hidden shadow-2xl">
              <img 
                src="/logo.png?v=1" 
                alt="Logo" 
                width={112} 
                height={112} 
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Sudarshan Technologies</h2>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            Welcomes you
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">Enter your credentials to access the terminal</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                  placeholder="admin@sudarshan.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <LogIn size={18} />
                  Authorize Session
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex flex-col items-center gap-4">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Technical Assistance</p>
              <a 
                href="tel:9305370277" 
                className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                  <Phone size={14} className="text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white leading-none mb-1">Contact Admin</p>
                  <p className="text-[10px] font-bold text-slate-500">9305370277</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-10 text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] animate-fade-in delay-500">
          Enterprise Lead Management System v2.0
        </p>
      </div>
    </div>
  );
}
