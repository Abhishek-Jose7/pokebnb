import { notFound, redirect } from "next/navigation";
import { ScoringForm } from "@/components/judge/ScoringForm";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function JudgeScorePage({ params }: { params: { teamId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: team }, { data: round }] = await Promise.all([
    supabase.from("teams").select("*").eq("id", params.teamId).maybeSingle(),
    supabase.from("rounds").select("*").eq("is_active", true).maybeSingle(),
  ]);
  if (!team) notFound();
  if (!round) return <PokemonCard title="No Active Gym Battle"><p>Ask the League Champion to activate a round.</p></PokemonCard>;
  return <PokemonCard title="Scoring Form" eyebrow="Gym Battle"><ScoringForm team={team} round={round} judgeId={user.id} /></PokemonCard>;
}
