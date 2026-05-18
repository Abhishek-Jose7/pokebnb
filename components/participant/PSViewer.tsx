import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { ProblemStatement } from "@/types";

export function PSViewer({ problem }: { problem: ProblemStatement }) {
  return (
    <PokemonCard title={problem.title} eyebrow="Gym Badge Earned">
      <div className="mb-3"><TypeBadge domain={problem.domain} /></div>
      <p className="mb-4 text-sm text-slate-300">{problem.description}</p>
      {problem.pdf_url ? <a className="font-bold text-poke-yellow underline" href={problem.pdf_url} target="_blank">View PDF</a> : null}
    </PokemonCard>
  );
}
