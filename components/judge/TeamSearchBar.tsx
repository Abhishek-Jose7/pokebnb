"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Team } from "@/types";

export function TeamSearchBar() {
  const [teams, setTeams] = useState<Team[]>([]);

  async function search(value: string) {
    if (value.length < 2) {
      setTeams([]);
      return;
    }
    const { data } = await createClient().from("teams").select("*").or(`name.ilike.%${value}%,team_code.ilike.%${value}%`).limit(8);
    setTeams(data ?? []);
  }

  return (
    <div className="grid gap-3">
      <Input placeholder="Search team or TEAM-042" onChange={(event) => search(event.target.value)} />
      {teams.map((team) => (
        <Link key={team.id} className="rounded-md border border-border bg-slate-950/50 p-4 text-base font-bold text-white sm:text-lg" href={`/judge/team/${team.id}`}>{team.name} <span className="font-mono text-poke-yellow">{team.team_code}</span></Link>
      ))}
    </div>
  );
}
