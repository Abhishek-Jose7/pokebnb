export function HpBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const fill = color ?? (pct > 50 ? "#3D7D3F" : pct >= 25 ? "#FFCB05" : "#CC0000");

  return (
    <div className="h-4 overflow-hidden rounded-full border border-poke-black bg-slate-950">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: fill }} />
    </div>
  );
}
