"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

export function QRScanner({ renderActions }: { renderActions?: (profile: Record<string, unknown>) => React.ReactNode }) {
  const [last, setLast] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    trainer_id: string;
    team_name: string | null;
    team_code: string | null;
    domain: string | null;
  } | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setHasPermission(true);
        html5QrCode = new Html5Qrcode("bitnbuild-scanner");
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 280, height: 280 } },
          async (decodedText) => {
            if (decodedText === last) return; // Prevent duplicate rapid scans
            setLast(decodedText);
            
            // Temporary pause scan
            if (html5QrCode.isScanning) {
               html5QrCode.pause();
            }

            const res = await fetch("/api/admin/qr-lookup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ decoded: decodedText }),
            });
            const json = await res.json();
            
            if (html5QrCode.isScanning) {
                html5QrCode.resume();
            }

            if (!res.ok) {
              toast.error("A wild QR error appeared!", { description: json.error ?? "Invalid QR" });
              return;
            }
            setProfile(json.profile);
            toast.success("Trainer QR found", { description: json.profile.full_name });
          },
          () => undefined
        ).catch((err) => {
          console.error("QR Code scanning failed", err);
          setHasPermission(false);
        });
      } else {
        setHasPermission(false);
      }
    }).catch(err => {
      console.error(err);
      setHasPermission(false);
    });

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [last]);



  return (
    <div className="grid gap-4">
      {hasPermission === false ? (
        <div className="text-red-500 font-bold p-4 text-center">Camera permission denied or no camera found.</div>
      ) : (
        <div id="bitnbuild-scanner" className="overflow-hidden rounded-lg border border-border bg-slate-950/40 w-full min-h-[300px]" />
      )}
      {profile ? (
        <div className="rounded-lg border border-poke-yellow bg-slate-950/60 p-4 text-white">
          <p className="text-xl font-black text-poke-yellow">{profile.full_name}</p>
          <p className="font-mono text-sm">{profile.trainer_id}</p>
          <p className="mt-2 text-sm text-slate-200">{profile.team_name ?? "No team"} {profile.team_code ? `(${profile.team_code})` : ""} - {profile.domain ?? "Domain TBD"}</p>
        </div>
      ) : last ? <pre className="overflow-auto rounded-md bg-slate-950/60 p-3 text-xs text-white">{last}</pre> : null}
      {profile && renderActions && renderActions(profile)}
    </div>
  );
}
