import { LeaderboardTable } from "@/components/admin/LeaderboardTable";

export default async function JudgeLeaderboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/leaderboard`, { cache: "no-store" }).catch(() => null);
  const json = res ? ((await res.json()) as { rows: [] }) : { rows: [] };
  return <LeaderboardTable initialRows={json.rows} />;
}
