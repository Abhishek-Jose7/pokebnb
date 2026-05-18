import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { createClient } from "@/lib/supabase/server";

export default async function TeamsPage() {
  const { data } = await createClient().from("teams").select("*").order("rank");
  return <PokemonCard title="Teams">{(data ?? []).map((team) => <div key={team.id} className="mb-3 flex items-center justify-between rounded-md bg-slate-950/30 p-4"><div><p className="font-bold">{team.name}</p><p className="font-mono text-sm text-poke-yellow">{team.team_code}</p></div><TypeBadge domain={team.domain} /></div>)}</PokemonCard>;
}
