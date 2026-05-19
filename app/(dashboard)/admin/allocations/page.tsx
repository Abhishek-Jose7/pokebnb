import { AllocationEngine } from "@/components/admin/AllocationEngine";
import { JudgeAllocation } from "@/components/admin/JudgeAllocation";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function AllocationsPage() {
  const supabase = createClient();
  const [{ data: rounds }, { data: judges }, { data: teams }, { data: allocations }, { data: scores }] = await Promise.all([
    supabase.from("rounds").select("id,name").order("round_number"),
    supabase.from("profiles").select("id,full_name,specialty").eq("role", "judge").order("full_name"),
    supabase.from("teams").select("id,name,team_code,domain,selected_ps_id").order("name"),
    supabase.from("allocations").select("id,round_id,team_id,judge_id,teams(name),profiles!allocations_judge_id_fkey(full_name),rounds(name)").order("created_at"),
    supabase.from("scores").select("round_id,team_id,judge_id"),
  ]);

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
