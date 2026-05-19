import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const decoded = typeof body.decoded === "string" ? body.decoded : "";
  let payload: { qr_token?: string; trainer_id?: string; user_id?: string } = {};
  try {
    payload = JSON.parse(decoded);
  } catch {
    payload = { trainer_id: decoded };
  }
  const userId = payload.user_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.user_id)
    ? payload.user_id
    : "";

  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const result = await client.query(
      `select p.team_id, t.name, t.team_code
       from public.profiles p
       join public.teams t on t.id = p.team_id
       where (p.qr_token = $1 and $1 <> '')
          or (p.trainer_id = $2 and $2 <> '')
          or (p.id = nullif($3, '')::uuid)
       limit 1`,
      [payload.qr_token ?? "", payload.trainer_id ?? decoded, userId],
    );
    const team = result.rows[0];
    if (!team) return NextResponse.json({ error: "No team found for this QR" }, { status: 404 });
    return NextResponse.json({ team });
  } finally {
    await client.end();
  }
}
