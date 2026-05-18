"use client";

import { useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLeaderboardStore } from "@/store/leaderboardStore";

export function useLeaderboard() {
  const rows = useLeaderboardStore((state) => state.rows);
  const setRows = useLeaderboardStore((state) => state.setRows);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/leaderboard", { cache: "no-store" });
    const json = (await res.json()) as { rows: typeof rows };
    setRows(json.rows ?? []);
  }, [setRows]);

  useEffect(() => {
    const supabase = createClient();
    refresh();
    const channel = supabase.channel("scores-live").on("postgres_changes", { event: "*", schema: "public", table: "scores" }, refresh).subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { rows, refresh };
}
