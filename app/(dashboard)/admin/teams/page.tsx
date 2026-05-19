import { AdminManageTeams } from "@/components/admin/AdminManage";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function TeamsPage() {
  const { data } = await createClient().from("teams").select("*").order("rank");
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Teams</h1>
      <PokemonCard title="Manage Teams">
        <AdminManageTeams teams={data ?? []} />
      </PokemonCard>
    </div>
  );
}
