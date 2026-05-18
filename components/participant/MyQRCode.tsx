"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createQrPayload, qrDataUrl } from "@/lib/utils/qr";
import type { Profile, Team } from "@/types";

export function MyQRCode({ profile, team }: { profile: Profile; team?: Team | null }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    void qrDataUrl(createQrPayload(profile)).then(setSrc);
  }, [profile]);

  return (
    <div className="mx-auto max-w-md rounded-xl border-4 border-poke-yellow bg-card p-5 text-center shadow-card">
      <p className="font-display text-sm leading-7 text-poke-yellow">Trainer Pass</p>
      {src ? <Image className="mx-auto my-5 rounded-lg bg-white p-3" src={src} alt="My QR code" width={280} height={280} /> : null}
      <p className="font-bold">{profile.full_name}</p>
      <p className="font-mono text-poke-yellow">{profile.trainer_id}</p>
      <p className="mb-4 text-sm text-slate-300">{team?.name ?? "No team assigned"}</p>
      <Button onClick={() => src && Object.assign(document.createElement("a"), { href: src, download: `${profile.trainer_id}.png` }).click()}>Download QR</Button>
    </div>
  );
}
