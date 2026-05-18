import { formatDistanceToNow } from "date-fns";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function ParticipantAnnouncementsPage() {
  const { data } = await createClient().from("announcements").select("*").in("target_role", ["all", "participant"]).order("created_at", { ascending: false });
  return <PokemonCard title="League Broadcasts">{(data ?? []).map((item) => <article key={item.id} className="mb-3 rounded-md bg-slate-950/30 p-4"><h2 className="font-bold text-poke-yellow">{item.title}</h2><p className="mb-2 text-xs text-slate-400">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p><p className="whitespace-pre-wrap text-sm">{item.body}</p></article>)}</PokemonCard>;
}
