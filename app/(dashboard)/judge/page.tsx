import Link from "next/link";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function JudgePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: allocations }, { data: scores }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user?.id ?? "").maybeSingle(),
    supabase.from("allocations").select("*, teams(name, team_code, domain), rooms(name), rounds(name, round_number)").eq("judge_id", user?.id ?? "").order("scheduled_time"),
    supabase.from("scores").select("round_id,team_id").eq("judge_id", user?.id ?? ""),
  ]);

  const scoreSet = new Set((scores ?? []).map((s: { round_id: string; team_id: string }) => `${s.round_id}-${s.team_id}`));

  return (
    <div className="grid gap-4 pb-8">
      <PokemonCard title={`Gym Leader ${profile?.full_name ?? ""}`} eyebrow="Judge Dashboard">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="rounded-lg bg-slate-950/30 px-4 py-2">
            <p className="text-poke-yellow font-bold">{(allocations ?? []).length}</p>
            <p className="text-slate-400">Teams Assigned</p>
          </div>
          <div className="rounded-lg bg-slate-950/30 px-4 py-2">
            <p className="text-green-400 font-bold">{(scores ?? []).length}</p>
            <p className="text-slate-400">Scores Submitted</p>
          </div>
        </div>
      </PokemonCard>

      <PokemonCard title="My Schedule">
        <div className="grid gap-3">
          {(allocations ?? []).length === 0 ? (
            <p className="text-sm text-slate-400">No teams assigned yet. Awaiting admin allocation.</p>
          ) : (
            (allocations ?? []).map((allocation: Record<string, unknown>) => {
              const isScored = scoreSet.has(`${allocation.round_id}-${allocation.team_id}`);
              const team = allocation.teams as { name: string; team_code: string; domain: string | null } | null;
              const room = allocation.rooms as { name: string } | null;
              const round = allocation.rounds as { name: string; round_number: number } | null;

              return (
                <Link
                  key={allocation.id as string}
                  href={`/judge/team/${allocation.team_id}`}
                  className={`block rounded-xl border p-4 transition active:scale-[0.98] ${
                    isScored
                      ? "border-green-500/30 bg-green-950/20"
                      : "border-border bg-slate-950/50 hover:bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isScored && <span className="text-green-400 text-lg">✓</span>}
                      <span className="text-lg font-black text-poke-yellow">{team?.name ?? "Unknown Team"}</span>
                    </div>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">{round?.name ?? "Round"}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="font-mono text-xs text-slate-500">{team?.team_code}</span>
                    {team?.domain && <span className="rounded bg-poke-blue/20 px-1.5 py-0.5 text-xs text-poke-blue">{team.domain}</span>}
                    <span>{allocation.scheduled_time ? new Date(allocation.scheduled_time as string).toLocaleString() : "TBD"}</span>
                    <span>{room?.name ?? "Room TBD"}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </PokemonCard>

      <div className="flex gap-3">
        <Link href="/judge/schedule" className="flex-1 rounded-lg border border-border bg-slate-950/30 p-4 text-center text-sm font-bold text-poke-yellow transition hover:bg-slate-950/50">
          Full Schedule
        </Link>
        <Link href="/judge/leaderboard" className="flex-1 rounded-lg border border-border bg-slate-950/30 p-4 text-center text-sm font-bold text-poke-yellow transition hover:bg-slate-950/50">
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
