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
    <div className="flex flex-col items-center gap-3">
      <p className="font-display text-base tracking-[0.3em] text-poke-yellow drop-shadow-[0_4px_12px_rgba(0,0,0,.8)] sm:text-lg">
        EVENT STARTS IN
      </p>
      <div className="flex items-center gap-2 sm:gap-4" aria-label="Countdown to BITNBUILD">
        {Object.entries(remaining).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-display text-4xl tabular-nums text-white drop-shadow-[0_4px_16px_rgba(0,0,0,.9)] sm:text-5xl md:text-6xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-1 font-display text-[0.55rem] tracking-[0.2em] text-poke-yellow/80 sm:text-xs">
              {label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
      <p className="font-display text-sm tracking-widest text-white/60 sm:text-base">
        25 OCTOBER 2026
      </p>
    </div>
  );
}
