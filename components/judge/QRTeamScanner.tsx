"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { QRScanner } from "@/components/admin/QRScanner";

export function QRTeamScanner() {
  return (
    <QRScanner 
      renderActions={(profile) => {
        if (!profile.team_id) {
            return <div className="p-3 bg-red-900 text-white rounded font-bold">Trainer does not have a team.</div>;
        }
        return (
          <Link href={`/judge/team/${profile.team_id}`} className="rounded-md border border-poke-yellow bg-poke-yellow px-4 py-3 text-center text-lg font-black text-slate-950 block w-full mt-4">
            Open {profile.team_name} ({profile.team_code})
          </Link>
        );
      }}
    />
  );
}
