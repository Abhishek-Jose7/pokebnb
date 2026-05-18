import Image from "next/image";
import type { Profile, Team } from "@/types";
import { PokemonCard } from "./PokemonCard";

export function TrainerCard({ profile, team }: { profile: Profile; team?: Pick<Team, "name" | "team_code"> | null }) {
  return (
    <PokemonCard title={profile.full_name} eyebrow="Trainer Card" className="border-poke-yellow">
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-md bg-white/10">
          {profile.pokemon_sprite ? <Image src={profile.pokemon_sprite} alt="" width={72} height={72} /> : <span className="text-2xl">?</span>}
        </div>
        <dl className="grid gap-1 text-sm">
          <div><dt className="inline text-poke-yellow">ID: </dt><dd className="inline font-mono">{profile.trainer_id ?? "TRN-????"}</dd></div>
          <div><dt className="inline text-poke-yellow">Team: </dt><dd className="inline">{team?.name ?? "No team"}</dd></div>
          <div><dt className="inline text-poke-yellow">Check-in: </dt><dd className="inline">{profile.is_checked_in ? "Cleared" : "Pending"}</dd></div>
        </dl>
      </div>
    </PokemonCard>
  );
}
