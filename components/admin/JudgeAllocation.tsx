"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Judge {
  id: string;
  full_name: string;
  specialty: string | null;
}

interface TeamWithPS {
  id: string;
  name: string;
  team_code: string;
  domain: string | null;
  selected_ps_id: string | null;
  problem_statement_title?: string | null;
}

interface Round {
  id: string;
  name: string;
}

interface ExistingAllocation {
  id: string;
  round_id: string;
  team_id: string;
  judge_id: string | null;
  team_name?: string;
  judge_name?: string;
  round_name?: string;
  scored?: boolean;
}

export function JudgeAllocation({
  judges,
  teams,
  rounds,
  existingAllocations,
}: {
  judges: Judge[];
  teams: TeamWithPS[];
  rounds: Round[];
  existingAllocations: ExistingAllocation[];
}) {
  const router = useRouter();
  const [roundId, setRoundId] = useState(rounds[0]?.id ?? "");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedJudge, setSelectedJudge] = useState("");
  const [teamDomainFilter, setTeamDomainFilter] = useState("all");
  const [judgeSpecFilter, setJudgeSpecFilter] = useState("all");

  const filteredTeams = teams.filter((t) => teamDomainFilter === "all" || t.domain === teamDomainFilter);
  const filteredJudges = judges.filter((j) => judgeSpecFilter === "all" || j.specialty === judgeSpecFilter);
  const currentAllocs = existingAllocations.filter((a) => a.round_id === roundId);

  async function allocate() {
    if (!roundId || !selectedTeam || !selectedJudge) { toast.error("Select round, team, and judge"); return; }
    const supabase = createClient();
    const { error } = await supabase.from("allocations").upsert({
      round_id: roundId,
      team_id: selectedTeam,
      judge_id: selectedJudge,
      is_published: true,
    }, { onConflict: "round_id,team_id" });
    if (error) { toast.error(error.message); return; }
    toast.success("Judge allocated to team");
    router.refresh();
  }

  async function removeAllocation(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("allocations").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Allocation removed");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      {/* Allocation Form */}
      <div className="rounded-lg border border-border bg-slate-950/30 p-4">
        <h3 className="mb-3 font-bold text-poke-yellow">Assign Judge to Team</h3>
        <div className="flex flex-wrap gap-3">
          <select value={roundId} onChange={(e) => setRoundId(e.target.value)} className="min-h-11 rounded-md border border-border bg-slate-950/40 px-3 text-sm text-white">
            {rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          <div className="flex flex-col gap-1">
            <select value={teamDomainFilter} onChange={(e) => setTeamDomainFilter(e.target.value)} className="min-h-8 rounded border border-border bg-slate-950/40 px-2 text-xs text-white">
              <option value="all">All Domains</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Web3">Blockchain</option>
              <option value="HealthTech">HealthTech</option>
              <option value="EdTech">EdTech</option>
            </select>
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="min-h-11 rounded-md border border-border bg-slate-950/40 px-3 text-sm text-white">
              <option value="">Select Team</option>
              {filteredTeams.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.domain ?? "General"})</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <select value={judgeSpecFilter} onChange={(e) => setJudgeSpecFilter(e.target.value)} className="min-h-8 rounded border border-border bg-slate-950/40 px-2 text-xs text-white">
              <option value="all">All Specialties</option>
              <option value="webdev">Web Dev</option>
              <option value="blockchain">Blockchain</option>
              <option value="aiml">AI/ML</option>
            </select>
            <select value={selectedJudge} onChange={(e) => setSelectedJudge(e.target.value)} className="min-h-11 rounded-md border border-border bg-slate-950/40 px-3 text-sm text-white">
              <option value="">Select Judge</option>
              {filteredJudges.map((j) => <option key={j.id} value={j.id}>{j.full_name} ({j.specialty ?? "General"})</option>)}
            </select>
          </div>

          <button onClick={allocate} className="min-h-11 self-end rounded-md bg-poke-yellow px-5 font-bold text-black transition hover:bg-yellow-300">
            Allocate
          </button>
        </div>
      </div>

      {/* Current Allocations */}
      <div className="rounded-lg border border-border bg-slate-950/30 p-4">
        <h3 className="mb-3 font-bold text-poke-yellow">Current Allocations — {rounds.find((r) => r.id === roundId)?.name}</h3>
        {currentAllocs.length === 0 ? (
          <p className="text-sm text-slate-400">No allocations for this round yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-poke-yellow"><tr><th className="p-2">Team</th><th className="p-2">Judge</th><th className="p-2">Scored?</th><th className="p-2">Action</th></tr></thead>
              <tbody>
                {currentAllocs.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-2 font-bold">{a.team_name ?? a.team_id.slice(0, 8)}</td>
                    <td className="p-2">{a.judge_name ?? a.judge_id?.slice(0, 8) ?? "Unassigned"}</td>
                    <td className="p-2">{a.scored ? <span className="text-green-400">✓</span> : <span className="text-slate-500">—</span>}</td>
                    <td className="p-2"><button onClick={() => removeAllocation(a.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
