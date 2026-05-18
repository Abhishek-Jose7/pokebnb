import { PSSelector } from "@/components/participant/PSSelector";
import { PSViewer } from "@/components/participant/PSViewer";
import { createClient } from "@/lib/supabase/server";

export default async function PsSelectionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id ?? "").maybeSingle();
  const { data: team } = profile?.team_id ? await supabase.from("teams").select("*").eq("id", profile.team_id).maybeSingle() : { data: null };
  const { data: selected } = team?.selected_ps_id ? await supabase.from("problem_statements").select("*").eq("id", team.selected_ps_id).maybeSingle() : { data: null };
  const { data: problems } = await supabase.from("problem_statements").select("*").eq("is_active", true).order("created_at", { ascending: false });
  return selected ? <PSViewer problem={selected} /> : <PSSelector problems={problems ?? []} team={team} isLeader={team?.leader_id === user?.id} />;
}
