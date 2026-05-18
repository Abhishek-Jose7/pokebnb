import Link from "next/link";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function JudgeSchedulePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("allocations").select("*").eq("judge_id", user?.id ?? "").order("scheduled_time");
  return <PokemonCard title="My Schedule">{(data ?? []).map((allocation) => <Link key={allocation.id} className="mb-3 block rounded-md bg-slate-950/30 p-4" href={`/judge/score/${allocation.team_id}`}>{allocation.scheduled_time ? new Date(allocation.scheduled_time).toLocaleString() : "TBD"} - {allocation.team_id}</Link>)}</PokemonCard>;
}
