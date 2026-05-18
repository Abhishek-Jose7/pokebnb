"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { createClient } from "@/lib/supabase/client";
import type { ProblemStatement, Team } from "@/types";

export function PSSelector({ problems, team, isLeader }: { problems: ProblemStatement[]; team: Team | null; isLeader: boolean }) {
  async function select(problem: ProblemStatement) {
    if (!team || !confirm(`Select ${problem.title}? This finalizes your Gym Badge choice.`)) return;
    const { error } = await createClient().from("teams").update({ selected_ps_id: problem.id, ps_submitted_at: new Date().toISOString() }).eq("id", team.id);
    if (error) toast.error("Selection failed", { description: error.message });
    else toast.success("Gym Badge earned");
  }

  if (!isLeader) {
    return <PokemonCard title="Leader Action Required"><p>Only your team leader can select the Problem Statement.</p></PokemonCard>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {problems.map((problem) => (
        <PokemonCard key={problem.id} title={problem.title} eyebrow={`${problem.difficulty ?? "medium"} difficulty`}>
          <div className="mb-3"><TypeBadge domain={problem.domain} /></div>
          <p className="mb-4 line-clamp-4 text-sm text-slate-300">{problem.description}</p>
          <div className="flex flex-wrap gap-2">
            {problem.pdf_url ? <a className="inline-flex min-h-12 items-center rounded-md bg-white/10 px-4 font-bold" href={problem.pdf_url} target="_blank">View PDF</a> : null}
            <Button disabled={Boolean(team?.selected_ps_id)} onClick={() => select(problem)}>Select this PS</Button>
          </div>
        </PokemonCard>
      ))}
    </div>
  );
}
