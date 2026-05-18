export function GymBadge({ label, active = true }: { label: string; active?: boolean }) {
  return (
    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-poke-black text-xs font-black ${active ? "bg-poke-yellow text-slate-950" : "bg-slate-700 text-slate-300"}`} title={label}>
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}
