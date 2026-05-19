"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function QRScanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState<string>("");
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    trainer_id: string;
    team_name: string | null;
    team_code: string | null;
    domain: string | null;
  } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scanner = new Html5QrcodeScanner("bitnbuild-scanner", { fps: 10, qrbox: { width: 280, height: 280 } }, false);
    scanner.render(async (decodedText) => {
      setLast(decodedText);
      const res = await fetch("/api/admin/qr-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decoded: decodedText }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("A wild QR error appeared!", { description: json.error ?? "Invalid QR" });
        return;
      }
      setProfile(json.profile);
      toast.success("Trainer QR found", { description: json.profile.full_name });
    }, () => undefined);
    return () => {
      void scanner.clear();
    };
  }, []);

  async function mark(type: string) {
    if (!profile) return;
    const res = await fetch("/api/admin/checkin-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: profile.id, type }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error("Check-in blocked", { description: json.error ?? "Try again" });
      return;
    }
    toast.success("Logged", { description: `${profile.full_name} - ${type}` });
  }

  return (
    <div className="grid gap-4">
      <div id="bitnbuild-scanner" ref={ref} className="overflow-hidden rounded-lg border border-border bg-slate-950/40" />
      {profile ? (
        <div className="rounded-lg border border-poke-yellow bg-slate-950/60 p-4 text-white">
          <p className="text-xl font-black text-poke-yellow">{profile.full_name}</p>
          <p className="font-mono text-sm">{profile.trainer_id}</p>
          <p className="mt-2 text-sm text-slate-200">{profile.team_name ?? "No team"} {profile.team_code ? `(${profile.team_code})` : ""} - {profile.domain ?? "Domain TBD"}</p>
        </div>
      ) : last ? <pre className="overflow-auto rounded-md bg-slate-950/60 p-3 text-xs text-white">{last}</pre> : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {["Attendance", "Breakfast", "Lunch", "Dinner", "Snacks"].map((label) => <Button key={label} variant="secondary" disabled={!profile} onClick={() => mark(label.toLowerCase())}>{label}</Button>)}
      </div>
    </div>
  );
}
