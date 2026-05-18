import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const [{ count: trainers }, { count: teams }, { count: scores }, { data: activeRound }, { data: teamRows }, { data: logs }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "participant"),
    supabase.from("teams").select("*", { count: "exact", head: true }),
    supabase.from("scores").select("*", { count: "exact", head: true }),
    supabase.from("rounds").select("*").eq("is_active", true).maybeSingle(),
    supabase.from("teams").select("*").order("total_score", { ascending: false }),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
  ]);
  const domains = Object.entries((teamRows ?? []).reduce<Record<string, number>>((acc, team) => {
    acc[team.domain ?? "General"] = (acc[team.domain ?? "General"] ?? 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Pokemon League HQ</h1>
      <AnalyticsDashboard
        stats={[
          { label: "Total Trainers Registered", value: trainers ?? 0 },
          { label: "Total Teams", value: teams ?? 0 },
          { label: "Scores Submitted", value: scores ?? 0 },
          { label: "Active Round", value: activeRound?.round_number ?? "None" },
          { label: "Check-in Rate", value: "0%" },
        ]}
        domainData={domains}
        scoreData={(teamRows ?? []).map((team) => ({ name: team.name, score: Number(team.total_score ?? 0) }))}
      />
      <PokemonCard title="Recent Audit Log">
        <div className="grid gap-2">
          {(logs ?? []).map((log) => <p key={log.id} className="rounded-md bg-slate-950/30 p-3 font-mono text-sm">{log.action} - {new Date(log.created_at).toLocaleString()}</p>)}
        </div>
      </PokemonCard>
    </div>
  );
}
