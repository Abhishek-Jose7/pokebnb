import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { createClient } from "@/lib/supabase/server";

const allowed = new Set(["attendance", "breakfast", "lunch", "dinner", "snacks"]);

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const targetUserId = String(body.user_id ?? "");
  const type = String(body.type ?? "").toLowerCase();
  if (!allowed.has(type)) return NextResponse.json({ error: "Invalid check-in type" }, { status: 400 });

  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const duplicate = await client.query(
      `select id from public.check_in_logs
       where user_id = $1 and type = $2 and scanned_at::date = now()::date
       limit 1`,
      [targetUserId, type],
    );
    if (duplicate.rows[0]) return NextResponse.json({ error: "Already claimed today" }, { status: 409 });

    if (type === "attendance") {
      await client.query("update public.profiles set is_checked_in = true where id = $1", [targetUserId]);
    } else {
      await client.query("update public.profiles set food_claimed = coalesce(food_claimed, '{}'::jsonb) || jsonb_build_object($2::text, true) where id = $1", [targetUserId, type]);
    }
    await client.query("insert into public.check_in_logs (user_id, scanned_by, type) values ($1, $2, $3)", [targetUserId, user.id, type]);
    return NextResponse.json({ ok: true });
  } finally {
    await client.end();
  }
}
