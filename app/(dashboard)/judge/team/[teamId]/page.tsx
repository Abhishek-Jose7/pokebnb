import { notFound, redirect } from "next/navigation";
import { ScoringForm } from "@/components/judge/ScoringForm";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { createClient } from "@/lib/supabase/server";
import type { Round, Score } from "@/types";

export default async function JudgeTeamDetailsPage({ params }: { params: { teamId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: team }, { data: members }, { data: rounds }, { data: scores }, { data: ps }] = await Promise.all([
    supabase.from("teams").select("*").eq("id", params.teamId).maybeSingle(),
    supabase.from("profiles").select("full_name, trainer_id, pokemon_sprite").eq("team_id", params.teamId).order("full_name"),
    supabase.from("rounds").select("*").in("round_number", [1, 2]).order("round_number"),
    supabase.from("scores").select("*").eq("team_id", params.teamId).eq("judge_id", user.id),
    supabase.from("teams").select("problem_statements(title,domain,difficulty,pdf_url)").eq("id", params.teamId).maybeSingle(),
  ]);

  if (!team) notFound();
  const scoreByRound = new Map((scores ?? []).map((score: Score) => [score.round_id, score]));
  const problem = Array.isArray(ps?.problem_statements) ? ps?.problem_statements[0] : ps?.problem_statements;

  return (
    <div className="mx-auto grid max-w-5xl gap-5">
      <PokemonCard title={team.name} eyebrow="Team Details" className="p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_.8fr]">
          <div className="grid gap-3 text-base sm:text-lg">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-poke-yellow">{team.team_code}</span>
              <TypeBadge domain={team.domain} />
            </div>
            <p className="text-slate-100">Selected problem: <span className="font-bold text-poke-yellow">{problem?.title ?? "Not selected yet"}</span></p>
            <p className="text-slate-200">Total leaderboard HP: <span className="font-mono text-poke-yellow">{Number(team.total_score ?? 0)}</span></p>
          </div>
          <div className="rounded-lg border border-border bg-slate-950/40 p-4">
            <p className="mb-3 font-bold text-poke-yellow">Members</p>
            <div className="grid gap-2">
              {(members ?? []).map((member) => (
                <div key={member.trainer_id ?? member.full_name} className="flex items-center justify-between gap-3 rounded-md bg-white/5 px-3 py-2 text-sm">
                  <span>{member.full_name}</span>
                  <span className="font-mono text-poke-yellow">{member.trainer_id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PokemonCard>

      <div className="grid gap-5 lg:grid-cols-2">
        {(rounds as Round[] | null ?? []).map((round) => (
          <PokemonCard key={round.id} title={`Score ${round.name}`} eyebrow={`Round ${round.round_number}`} className="p-4 sm:p-6">
            <ScoringForm
              team={team}
              round={round}
              judgeId={user.id}
              initialScore={scoreByRound.get(round.id) ?? null}
            />
          </PokemonCard>
        ))}
      </div>
    </div>
  );
}
