import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-md border border-border bg-slate-950/40 px-3 py-2 text-white outline-none transition placeholder:text-slate-400 focus:border-poke-yellow",
        props.className,
      )}
    />
  );
}
