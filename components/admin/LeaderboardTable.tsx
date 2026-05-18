"use client";

import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { HpBar } from "@/components/pokemon/HpBar";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

export function LeaderboardTable({ initialRows }: { initialRows: ReturnType<typeof useLeaderboard>["rows"] }) {
  const { rows } = useLeaderboard();
  const data = rows.length ? rows : initialRows;
  const max = Math.max(1, ...data.map((row) => row.total_score));

  return (
    <PokemonCard title="Pokemon League Leaderboard">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-poke-yellow">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Team</th>
              <th className="p-3">Type</th>
              <th className="p-3">Score HP</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.team_id} className="border-t border-border">
                <td className="p-3 font-mono text-xl">{row.rank <= 3 ? ["", "Gold", "Silver", "Bronze"][row.rank] : `#${row.rank}`}</td>
                <td className="p-3 font-bold">{row.team_name}</td>
                <td className="p-3"><TypeBadge domain={row.domain} /></td>
                <td className="p-3"><HpBar value={row.total_score} max={max} /></td>
                <td className="p-3 font-mono text-poke-yellow">{row.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PokemonCard>
  );
}
