"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Announcement } from "@/types";

export function useAnnouncements(role?: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      let query = supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (role) query = query.in("target_role", ["all", role]);
      const { data } = await query;
      setAnnouncements(data ?? []);
    };
    void load();
    const channel = supabase.channel("announcements-live").on("postgres_changes", { event: "INSERT", schema: "public", table: "announcements" }, (payload) => {
      const next = payload.new as Announcement;
      if (!role || next.target_role === "all" || next.target_role === role) {
        setAnnouncements((current) => [next, ...current]);
        toast(next.title, { description: "A new League broadcast arrived." });
      }
    }).subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [role]);

  return announcements;
}
