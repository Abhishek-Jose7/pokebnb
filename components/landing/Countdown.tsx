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

  const segments = [
    { label: "DAYS", value: remaining.days },
    { label: "HOURS", value: remaining.hours },
    { label: "MINUTES", value: remaining.minutes },
    { label: "SECONDS", value: remaining.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Heading */}
      <p className="font-display text-base tracking-[0.3em] text-poke-yellow drop-shadow-[0_4px_12px_rgba(0,0,0,.8)] sm:text-lg">
        EVENT STARTS IN
      </p>

      {/* Segments row */}
      <div
        className="flex items-end gap-6 sm:gap-10 md:gap-14"
        aria-label="Countdown to BITNBUILD"
      >
        {segments.map(({ label, value }, i) => (
          <>
            {/* Number + label cell */}
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="font-display tabular-nums text-white leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,.9)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                {String(value).padStart(2, "0")}
              </span>
              <span className="font-display text-sm tracking-[0.25em] text-poke-yellow sm:text-base md:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                {label}
              </span>
            </div>

            {/* Colon separator — skip after last segment */}
            {i < segments.length - 1 && (
              <span
                key={`sep-${label}`}
                className="font-display text-white/60 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none pb-6 sm:pb-8 select-none"
              >
                :
              </span>
            )}
          </>
        ))}
      </div>

      {/* Date */}
      <p className="font-display text-sm tracking-widest text-white/60 sm:text-base mt-6">
        25 OCTOBER 2026
      </p>
    </div>
  );
}