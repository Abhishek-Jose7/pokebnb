import { AllocationEngine } from "@/components/admin/AllocationEngine";
import { JudgeAllocation } from "@/components/admin/JudgeAllocation";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Client } from "pg";

export default async function AllocationsPage() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const [roundsRes, judgesRes, teamsRes, allocationsRes, scoresRes] = await Promise.all([
    client.query(`SELECT id, name FROM rounds ORDER BY round_number`),
    client.query(`SELECT id, full_name, specialty FROM profiles WHERE role = 'judge' ORDER BY full_name`),
    client.query(`SELECT id, name, team_code, domain, selected_ps_id FROM teams ORDER BY name`),
    client.query(`
      SELECT a.id, a.round_id, a.team_id, a.judge_id, a.created_at,
             t.name as team_name, p.full_name as judge_name, r.name as round_name
      FROM allocations a
      LEFT JOIN teams t ON a.team_id = t.id
      LEFT JOIN profiles p ON a.judge_id = p.id
      LEFT JOIN rounds r ON a.round_id = r.id
      ORDER BY a.created_at
    `),
    client.query(`SELECT round_id, team_id, judge_id FROM scores`),
  ]);

  await client.end();

  const rounds = roundsRes.rows;
  const judges = judgesRes.rows;
  const teams = teamsRes.rows;
  const allocations = allocationsRes.rows.map(row => ({
    ...row,
    teams: row.team_name ? { name: row.team_name } : null,
    profiles: row.judge_name ? { full_name: row.judge_name } : null,
    rounds: row.round_name ? { name: row.round_name } : null
  }));
  const scores = scoresRes.rows;

  // Build allocation view with scored status
  const scoreSet = new Set((scores ?? []).map((s: { round_id: string; team_id: string; judge_id: string }) => `${s.round_id}-${s.team_id}-${s.judge_id}`));
  const enrichedAllocations = (allocations ?? []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    round_id: a.round_id as string,
    team_id: a.team_id as string,
    judge_id: a.judge_id as string | null,
    team_name: (a.teams as { name: string } | null)?.name,
    judge_name: (a.profiles as { full_name: string } | null)?.full_name,
    round_name: (a.rounds as { name: string } | null)?.name,
    scored: a.judge_id ? scoreSet.has(`${a.round_id}-${a.team_id}-${a.judge_id}`) : false,
  }));

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Judge Allocations</h1>
      <PokemonCard title="Assign Judges">
        <JudgeAllocation
          judges={judges ?? []}
          teams={teams ?? []}
          rounds={rounds ?? []}
          existingAllocations={enrichedAllocations}
        />
      </PokemonCard>
      <AllocationEngine rounds={rounds ?? []} />
    </div>
  );
}
