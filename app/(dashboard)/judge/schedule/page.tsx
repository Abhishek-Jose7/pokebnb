import Link from "next/link";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function JudgeSchedulePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data }, { data: scores }] = await Promise.all([
    supabase
      .from("allocations")
      .select("*, teams(name, team_code, domain), rounds(name, round_number), rooms(name)")
      .eq("judge_id", user?.id ?? "")
      .order("scheduled_time"),
    supabase.from("scores").select("round_id,team_id").eq("judge_id", user?.id ?? ""),
  ]);

  const scoreSet = new Set((scores ?? []).map((s: { round_id: string; team_id: string }) => `${s.round_id}-${s.team_id}`));

  return (
    <PokemonCard title="My Schedule">
      <div className="grid gap-3">
        {(data ?? []).length === 0 ? (
          <p className="text-sm text-slate-400">No schedule assigned yet.</p>
        ) : (
          (data ?? []).map((allocation: Record<string, unknown>) => {
            const isScored = scoreSet.has(`${allocation.round_id}-${allocation.team_id}`);
            const team = allocation.teams as { name: string; team_code: string; domain: string | null } | null;
            const room = allocation.rooms as { name: string } | null;
            const round = allocation.rounds as { name: string; round_number: number } | null;

            return (
              <Link
                key={allocation.id as string}
                className={`block rounded-xl border p-4 text-white transition active:scale-[0.98] ${
                  isScored
                    ? "border-green-500/30 bg-green-950/20"
                    : "border-border bg-slate-950/50 hover:bg-slate-950/70"
                }`}
                href={`/judge/team/${allocation.team_id}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isScored && <span className="text-green-400 text-xl">✓</span>}
                    <span className="text-lg font-black text-poke-yellow">{team?.name ?? "Unknown"}</span>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold">{round?.name ?? "Round"}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="font-mono text-xs text-slate-500">{team?.team_code}</span>
                  {team?.domain && <span className="rounded bg-poke-blue/20 px-1.5 py-0.5 text-xs text-poke-blue">{team.domain}</span>}
                  <span>{allocation.scheduled_time ? new Date(allocation.scheduled_time as string).toLocaleString() : "TBD"}</span>
                  <span>{room?.name ?? "Room TBD"}</span>
                </div>
                {isScored && <p className="mt-2 text-xs font-bold text-green-400">Score submitted ✓</p>}
              </Link>
            );
          })
        )}
      </div>
    </PokemonCard>
  );
}
