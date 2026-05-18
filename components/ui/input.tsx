import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-12 w-full rounded-md border border-border bg-slate-950/40 px-3 text-white outline-none transition placeholder:text-slate-400 focus:border-poke-yellow",
        props.className,
      )}
    />
  );
}
