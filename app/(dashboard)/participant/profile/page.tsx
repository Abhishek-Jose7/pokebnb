import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TrainerCard } from "@/components/pokemon/TrainerCard";
import { createClient } from "@/lib/supabase/server";

export default async function ParticipantProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id ?? "").maybeSingle();
  const { data: team } = profile?.team_id ? await supabase.from("teams").select("*").eq("id", profile.team_id).maybeSingle() : { data: null };
  const { data: members } = team ? await supabase.from("profiles").select("full_name,trainer_id").eq("team_id", team.id) : { data: [] };
  return profile ? <div className="grid gap-5"><TrainerCard profile={profile} team={team} /><PokemonCard title="Team Members">{(members ?? []).map((member) => <p key={member.trainer_id} className="mb-2 rounded-md bg-slate-950/30 p-3">{member.full_name} - <span className="font-mono text-poke-yellow">{member.trainer_id}</span></p>)}</PokemonCard></div> : null;
}
