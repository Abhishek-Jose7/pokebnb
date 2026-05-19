"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HpBar } from "@/components/pokemon/HpBar";
import { createClient } from "@/lib/supabase/client";
import type { Round, Team } from "@/types";

export function ScoringForm({
  team,
  round,
  judgeId,
  initialScore,
}: {
  team: Team;
  round: Round;
  judgeId: string;
  initialScore?: { criteria_scores: Record<string, number>; remarks: string | null } | null;
}) {
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(round.scoring_criteria.map((criterion) => [criterion.name, initialScore?.criteria_scores?.[criterion.name] ?? 0])));
  const [remarks, setRemarks] = useState(initialScore?.remarks ?? "");
  const [caught, setCaught] = useState(false);
  const total = useMemo(() => Object.values(scores).reduce((sum, value) => sum + value, 0), [scores]);
  const max = round.scoring_criteria.reduce((sum, criterion) => sum + criterion.max_score, 0);

  async function submit() {
    const supabase = createClient();
    const { error } = await supabase.from("scores").upsert({
      round_id: round.id,
      team_id: team.id,
      judge_id: judgeId,
      criteria_scores: scores,
      total_score: total,
      remarks,
    }, { onConflict: "round_id,team_id,judge_id" });
    if (error) {
      toast.error("A wild error appeared!", { description: error.message });
      return;
    }
    await supabase.from("audit_logs").insert({ actor_id: judgeId, action: "score.submit", entity_type: "team", entity_id: team.id, metadata: { total } });
    setCaught(true);
    toast.success("Score submitted", { description: "The Pokeball clicked shut." });
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-border bg-slate-950/30 p-4">
        <p className="font-display text-base leading-8 text-poke-yellow">{team.name}</p>
        <p className="text-sm text-slate-200">{round.name}</p>
      </div>
      {round.scoring_criteria.map((criterion) => (
        <label key={criterion.name} className="grid gap-2 rounded-lg border border-border bg-slate-950/30 p-4">
          <span className="font-bold">{criterion.name}</span>
          {criterion.description ? <span className="text-sm text-slate-200">{criterion.description}</span> : null}
          <div className="grid grid-cols-[1fr_5rem] gap-3">
            <input type="range" min={0} max={criterion.max_score} value={scores[criterion.name]} onChange={(event) => setScores((current) => ({ ...current, [criterion.name]: Number(event.target.value) }))} />
            <input className="min-h-11 rounded-md border border-border bg-slate-950/70 px-2 font-mono text-white" type="number" min={0} max={criterion.max_score} value={scores[criterion.name]} onChange={(event) => setScores((current) => ({ ...current, [criterion.name]: Math.min(criterion.max_score, Math.max(0, Number(event.target.value))) }))} />
          </div>
        </label>
      ))}
      <div className="rounded-lg border border-border bg-slate-950/30 p-4">
        <div className="mb-2 flex justify-between font-mono text-poke-yellow"><span>Total HP</span><span>{total}/{max}</span></div>
        <HpBar value={total} max={max} />
      </div>
      <Textarea placeholder="Gym Leader remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
      <Button onClick={submit}>Submit Score</Button>
      {caught ? <motion.div initial={{ x: -160, y: -20, rotate: 0 }} animate={{ x: 0, y: 0, rotate: 720 }} className="mx-auto h-12 w-12 rounded-full border-4 border-poke-black bg-white"><div className="h-1/2 rounded-t-full bg-poke-red" /></motion.div> : null}
    </div>
  );
}
