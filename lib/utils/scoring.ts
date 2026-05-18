import type { Score, Team } from "@/types";

export function sumCriteria(criteriaScores: Record<string, number>) {
  return Object.values(criteriaScores).reduce((sum, score) => sum + Number(score || 0), 0);
}

export function rankTeams(teams: Team[], scores: Score[]) {
  const totals = new Map<string, number>();
  scores.forEach((score) => totals.set(score.team_id, (totals.get(score.team_id) ?? 0) + score.total_score));
  return teams
    .map((team) => ({ ...team, total_score: totals.get(team.id) ?? team.total_score ?? 0 }))
    .sort((a, b) => b.total_score - a.total_score)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}
