import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { GymBadge } from "@/components/pokemon/GymBadge";
import { createClient } from "@/lib/supabase/server";

export default async function RoundsPage() {
  const { data } = await createClient().from("rounds").select("*").order("round_number");
  return <PokemonCard title="Gym Battles">{(data ?? []).map((round) => <div key={round.id} className="mb-3 flex items-center gap-4 rounded-md bg-slate-950/30 p-4"><GymBadge label={`${round.round_number}`} active={round.is_active} /><div><p className="font-bold">{round.name}</p><p className="text-sm text-slate-300">{round.is_published ? "Published" : "Draft"}</p></div></div>)}</PokemonCard>;
}
