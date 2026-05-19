import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { createClient } from "@/lib/supabase/server";

function parseQr(decoded: string) {
  try {
    return JSON.parse(decoded) as { qr_token?: string; trainer_id?: string; user_id?: string };
  } catch {
    return { trainer_id: decoded };
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin" && profile?.role !== "judge") return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const payload = parseQr(String(body.decoded ?? ""));
  const userId = payload.user_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.user_id) ? payload.user_id : "";

  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const result = await client.query(
      `select p.id, p.full_name, p.trainer_id, p.pokemon_sprite, p.is_checked_in, p.food_claimed,
              t.name as team_name, t.team_code, t.domain
       from public.profiles p
       left join public.teams t on t.id = p.team_id
       where (p.qr_token = $1 and $1 <> '')
          or (p.trainer_id = $2 and $2 <> '')
          or (p.id = nullif($3, '')::uuid)
       limit 1`,
      [payload.qr_token ?? "", payload.trainer_id ?? String(body.decoded ?? ""), userId],
    );
    if (!result.rows[0]) return NextResponse.json({ error: "QR not found" }, { status: 404 });
    return NextResponse.json({ profile: result.rows[0] });
  } finally {
    await client.end();
  }
}
