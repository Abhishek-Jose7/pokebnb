"use client";

import { useEffect, useMemo, useState } from "react";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Countdown to BITNBUILD">
      {Object.entries(remaining).map(([label, value]) => (
        <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-3 text-center backdrop-blur">
          <p className="font-mono text-2xl text-poke-yellow sm:text-4xl">{String(value).padStart(2, "0")}</p>
          <p className="text-[11px] font-black uppercase text-slate-200 sm:text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}
