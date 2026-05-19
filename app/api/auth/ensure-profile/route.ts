import { NextResponse } from "next/server";
import { Client } from "pg";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types";

function inferRole(email: string): Role {
  if (email.startsWith("admin")) return "admin";
  if (email.startsWith("judge")) return "judge";
  if (email.startsWith("mentor")) return "mentor";
  return "participant";
}

function trainerIdFromUserId(userId: string) {
  return `TRN-${userId.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

export async function POST(request: Request) {
  const supabase = createClient();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { data: { user }, error } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser();

  if (error || !user?.email) {
    return NextResponse.json({ error: error?.message ?? "Not authenticated" }, { status: 401 });
  }

  const role = inferRole(user.email);
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json({ role, warning: "DATABASE_URL missing; profile was not created" });
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    const fullName =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      user.email.split("@")[0].replace(/[._-]+/g, " ");

    await client.query(
      `
        insert into public.profiles (id, email, full_name, role, trainer_id, pokemon_sprite, qr_token)
        values ($1, $2, $3, $4, $5, $6, gen_random_uuid()::text)
        on conflict (id) do update
        set email = excluded.email,
            full_name = coalesce(public.profiles.full_name, excluded.full_name),
            role = coalesce(public.profiles.role, excluded.role),
            trainer_id = coalesce(public.profiles.trainer_id, excluded.trainer_id),
            pokemon_sprite = coalesce(public.profiles.pokemon_sprite, excluded.pokemon_sprite),
            qr_token = coalesce(public.profiles.qr_token, excluded.qr_token)
      `,
      [
        user.id,
        user.email,
        fullName,
        role,
        trainerIdFromUserId(user.id),
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      ],
    );

    return NextResponse.json({ role });
  } finally {
    await client.end();
  }
}
