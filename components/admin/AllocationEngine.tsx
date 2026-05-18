"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import type { Allocation } from "@/types";

export function AllocationEngine({ rounds }: { rounds: Array<{ id: string; name: string }> }) {
  const [roundId, setRoundId] = useState(rounds[0]?.id ?? "");
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/allocations/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ round_id: roundId }),
    });
    const json = (await res.json()) as { allocations?: Allocation[]; error?: string };
    setLoading(false);
    if (!res.ok) {
      toast.error("A wild error appeared!", { description: json.error });
      return;
    }
    setAllocations(json.allocations ?? []);
    toast.success("Allocations generated", { description: "Draft Gym Battle schedule is ready." });
  }

  return (
    <PokemonCard title="Round Allocation Engine" eyebrow="Professor Oak Console">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <select value={roundId} onChange={(event) => setRoundId(event.target.value)} className="min-h-12 rounded-md border border-border bg-slate-950/40 px-3">
          {rounds.map((round) => <option key={round.id} value={round.id}>{round.name}</option>)}
        </select>
        <Button onClick={generate} disabled={!roundId || loading}>{loading ? "Generating..." : "Generate"}</Button>
        <a className="inline-flex min-h-12 items-center justify-center rounded-md bg-white/10 px-4 font-bold" href={`/api/allocations/export-pdf?round_id=${roundId}`}>Export PDF</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-poke-yellow"><tr><th className="p-3">Team</th><th className="p-3">Judge</th><th className="p-3">Mentor</th><th className="p-3">Room</th><th className="p-3">Time</th></tr></thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr key={`${allocation.round_id}-${allocation.team_id}`} className="border-t border-border">
                <td className="p-3 font-mono">{allocation.team_id.slice(0, 8)}</td>
                <td className="p-3">{allocation.judge_id?.slice(0, 8) ?? "Open"}</td>
                <td className="p-3">{allocation.mentor_id?.slice(0, 8) ?? "Open"}</td>
                <td className="p-3">{allocation.room_id?.slice(0, 8) ?? "Open"}</td>
                <td className="p-3">{allocation.scheduled_time ? new Date(allocation.scheduled_time).toLocaleString() : "TBD"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PokemonCard>
  );
}
