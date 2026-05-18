import Link from "next/link";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function JudgePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: allocations }, { count: submitted }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user?.id ?? "").maybeSingle(),
    supabase.from("allocations").select("*, teams(name), rooms(name)").eq("judge_id", user?.id ?? "").order("scheduled_time"),
    supabase.from("scores").select("*", { count: "exact", head: true }).eq("judge_id", user?.id ?? ""),
  ]);
  return (
    <div className="grid gap-5">
      <PokemonCard title={`Gym Leader ${profile?.full_name ?? ""}`} eyebrow="Judge Dashboard">
        <p>You have {(allocations ?? []).length} teams to evaluate. Scores submitted: {submitted ?? 0}.</p>
      </PokemonCard>
      <PokemonCard title="Today&apos;s Schedule">
        {(allocations ?? []).map((allocation) => <Link key={allocation.id} className="mb-3 block rounded-md bg-slate-950/30 p-4" href={`/judge/score/${allocation.team_id}`}><span className="font-bold">{allocation.scheduled_time ? new Date(allocation.scheduled_time).toLocaleTimeString() : "TBD"}</span> - {allocation.team_id}</Link>)}
      </PokemonCard>
    </div>
  );
}
