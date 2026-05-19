import { AdminManageUsers } from "@/components/admin/AdminManage";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export default async function UsersPage() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const [{ data: profiles }, { data: teams }] = await Promise.all([
    supabase.from("profiles").select("*, teams(name)").order("created_at", { ascending: false }),
    supabase.from("teams").select("*").order("name"),
  ]);
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Trainer Registry</h1>
      <PokemonCard title="Manage Trainers">
        <AdminManageUsers profiles={profiles ?? []} teams={teams ?? []} />
      </PokemonCard>
    </div>
  );
}
