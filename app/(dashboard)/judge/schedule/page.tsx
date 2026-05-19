import Link from "next/link";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function JudgeSchedulePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("allocations")
    .select("*, teams(name, team_code, domain), rounds(name, round_number), rooms(name)")
    .eq("judge_id", user?.id ?? "")
    .order("scheduled_time");
  return (
    <PokemonCard title="My Schedule">
      <div className="grid gap-3">
        {(data ?? []).map((allocation) => (
          <Link key={allocation.id} className="block rounded-md border border-border bg-slate-950/50 p-4 text-white" href={`/judge/team/${allocation.team_id}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-lg font-black text-poke-yellow">{allocation.teams?.name ?? allocation.team_id}</span>
              <span className="font-mono text-sm">{allocation.rounds?.name ?? "Round"}</span>
            </div>
            <p className="mt-2 text-sm text-slate-200">{allocation.scheduled_time ? new Date(allocation.scheduled_time).toLocaleString() : "TBD"} - {allocation.rooms?.name ?? "Room TBD"}</p>
          </Link>
        ))}
      </div>
    </PokemonCard>
  );
}
