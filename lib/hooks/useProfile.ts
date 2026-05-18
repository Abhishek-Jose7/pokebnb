"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: row } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
        setProfile(row ?? null);
      }
      setLoading(false);
    });
  }, []);

  return { profile, loading };
}
