"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Allocation } from "@/types";

export function useAllocations(teamId?: string, ownerId?: string) {
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let query = supabase.from("allocations").select("*").order("scheduled_time", { ascending: true });
    if (teamId) query = query.eq("team_id", teamId);
    if (ownerId) query = query.or(`judge_id.eq.${ownerId},mentor_id.eq.${ownerId}`);
    query.then(({ data }) => setAllocations(data ?? []));
  }, [ownerId, teamId]);

  return allocations;
}
