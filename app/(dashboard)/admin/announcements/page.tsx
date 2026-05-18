import { AnnouncementComposer } from "@/components/admin/AnnouncementComposer";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function AnnouncementsPage() {
  const { data } = await createClient().from("announcements").select("*").order("created_at", { ascending: false });
  return <div className="grid gap-5"><PokemonCard title="Broadcast Composer"><AnnouncementComposer /></PokemonCard><PokemonCard title="Broadcast History">{(data ?? []).map((item) => <article key={item.id} className="mb-3 rounded-md bg-slate-950/30 p-4"><h3 className="font-bold text-poke-yellow">{item.title}</h3><p className="text-sm text-slate-300">{item.target_role} - {new Date(item.created_at).toLocaleString()}</p></article>)}</PokemonCard></div>;
}
