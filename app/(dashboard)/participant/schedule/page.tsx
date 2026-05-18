import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function ParticipantSchedulePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user?.id ?? "").maybeSingle();
  const { data } = profile?.team_id ? await supabase.from("allocations").select("*").eq("team_id", profile.team_id).eq("is_published", true).order("scheduled_time") : { data: [] };
  return <PokemonCard title="Team Schedule">{(data ?? []).map((allocation) => <div key={allocation.id} className="mb-3 rounded-md bg-slate-950/30 p-4"><p className="font-bold">{allocation.scheduled_time ? new Date(allocation.scheduled_time).toLocaleString() : "TBD"}</p><p className="text-sm text-slate-300">Room {allocation.room_id ?? "TBD"} - Judge {allocation.judge_id ?? "TBD"}</p></div>)}</PokemonCard>;
}
