"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 active:scale-95",
  secondary:
    "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm active:scale-95",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-600 active:scale-95",
  danger:
    "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-95",
  success:
    "bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200 active:scale-95",
};

const SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
