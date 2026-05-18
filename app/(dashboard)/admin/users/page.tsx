import Image from "next/image";
import { BulkUserUpload } from "@/components/admin/BulkUserUpload";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  const { data: profiles } = await createClient().from("profiles").select("*, teams(name)").order("created_at", { ascending: false });
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Trainers</h1>
      <PokemonCard title="Bulk Create Trainers"><BulkUserUpload /></PokemonCard>
      <PokemonCard title="Trainer Registry">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-poke-yellow"><tr><th className="p-3">Sprite</th><th className="p-3">Trainer ID</th><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Check-in</th></tr></thead>
            <tbody>{(profiles ?? []).map((profile) => <tr key={profile.id} className="border-t border-border"><td className="p-3">{profile.pokemon_sprite ? <Image src={profile.pokemon_sprite} alt="" width={48} height={48} /> : null}</td><td className="p-3 font-mono">{profile.trainer_id}</td><td className="p-3 font-bold">{profile.full_name}</td><td className="p-3">{profile.role}</td><td className="p-3">{profile.is_checked_in ? "Cleared" : "Pending"}</td></tr>)}</tbody>
          </table>
        </div>
      </PokemonCard>
    </div>
  );
}
