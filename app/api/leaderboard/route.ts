import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardRow, Score, Team } from "@/types";

export async function GET() {
  const supabase = createClient();
  const { data: rpcRows } = await supabase.rpc("get_leaderboard", {});
  if (rpcRows) return NextResponse.json({ rows: rpcRows });

  const [{ data: teams }, { data: scores }, { data: rounds }] = await Promise.all([
    supabase.from("teams").select("*"),
    supabase.from("scores").select("*"),
    supabase.from("rounds").select("id,name"),
  ]);
  const roundNames = new Map((rounds ?? []).map((round) => [round.id, round.name]));
  const rows: LeaderboardRow[] = (teams ?? [])
    .map((team: Team) => {
      const teamScores = (scores ?? []).filter((score: Score) => score.team_id === team.id);
      const round_scores = teamScores.reduce<Record<string, number>>((acc, score) => {
        const key = roundNames.get(score.round_id) ?? score.round_id;
        acc[key] = (acc[key] ?? 0) + score.total_score;
        return acc;
      }, {});
      const total_score = Object.values(round_scores).reduce((sum, score) => sum + score, 0);
      return { rank: 0, team_id: team.id, team_name: team.name, domain: team.domain, total_score, round_scores };
    })
    .sort((a, b) => b.total_score - a.total_score)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return NextResponse.json({ rows });
}
