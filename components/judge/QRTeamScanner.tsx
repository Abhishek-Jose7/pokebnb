"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";

export function QRTeamScanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [team, setTeam] = useState<{ team_id: string; name: string; team_code: string } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scanner = new Html5QrcodeScanner("judge-team-scanner", { fps: 10, qrbox: { width: 280, height: 280 } }, false);
    scanner.render(async (decodedText) => {
      const res = await fetch("/api/judge/qr-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decoded: decodedText }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("A wild QR error appeared!", { description: json.error ?? "Could not identify team" });
        return;
      }
      setTeam(json.team);
      toast.success("Team found", { description: json.team.name });
    }, () => undefined);
    return () => {
      void scanner.clear();
    };
  }, []);

  return (
    <div className="grid gap-4">
      <div id="judge-team-scanner" ref={ref} className="overflow-hidden rounded-lg border border-border bg-slate-950/60" />
      {team ? (
        <Link href={`/judge/team/${team.team_id}`} className="rounded-md border border-poke-yellow bg-poke-yellow px-4 py-3 text-center text-lg font-black text-slate-950">
          Open {team.name} ({team.team_code})
        </Link>
      ) : null}
    </div>
  );
}
