import { NextResponse } from "next/server";
import { generateAllocations } from "@/lib/utils/allocation";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { round_id?: string };
  if (!body.round_id) return NextResponse.json({ error: "round_id is required" }, { status: 400 });
  const supabase = createServiceClient();
  const [{ data: round }, { data: teams }, { data: judges }, { data: mentors }, { data: rooms }] = await Promise.all([
    supabase.from("rounds").select("*").eq("id", body.round_id).maybeSingle(),
    supabase.from("teams").select("*").order("domain"),
    supabase.from("profiles").select("*").eq("role", "judge"),
    supabase.from("profiles").select("*").eq("role", "mentor"),
    supabase.from("rooms").select("*").eq("is_available", true),
  ]);
  if (!round) return NextResponse.json({ error: "Round not found" }, { status: 404 });
  const allocations = generateAllocations({ round, teams: teams ?? [], judges: judges ?? [], mentors: mentors ?? [], rooms: rooms ?? [] });
  const { data, error } = await supabase.from("allocations").upsert(allocations, { onConflict: "round_id,team_id" }).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from("audit_logs").insert({ action: "allocation.generate", entity_type: "round", entity_id: round.id, metadata: { count: data?.length ?? 0 } });
  return NextResponse.json({ allocations: data ?? [], success: true });
}
