import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-poke-yellow text-slate-950 hover:bg-yellow-300",
    secondary: "bg-poke-blue text-white hover:bg-blue-800",
    ghost: "bg-white/5 text-white hover:bg-white/10",
    danger: "bg-poke-red text-white hover:bg-red-700",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
