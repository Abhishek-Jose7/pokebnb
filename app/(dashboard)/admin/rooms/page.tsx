import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { createClient } from "@/lib/supabase/server";

export default async function RoomsPage() {
  const { data } = await createClient().from("rooms").select("*").order("name");
  return <PokemonCard title="Cerulean Gym Rooms">{(data ?? []).map((room) => <div key={room.id} className="mb-3 flex items-center justify-between rounded-md bg-slate-950/30 p-4"><div><p className="font-bold">{room.name}</p><p className="text-sm text-slate-300">{room.location} - Cap {room.capacity}</p></div><TypeBadge domain={room.domain} /></div>)}</PokemonCard>;
}
