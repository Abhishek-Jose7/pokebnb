import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { randomBytes } from "crypto";

// Helper to generate a random 8-character password
function generatePassword() {
  return randomBytes(4).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    let successCount = 0;
    const errors: string[] = [];

    // Begin transaction
    await client.query("BEGIN");

    for (const row of data) {
      const { full_name, email, team_name, is_leader, domain } = row;

      if (!email || !full_name) {
        errors.push(`Row missing email or full_name: ${JSON.stringify(row)}`);
        continue;
      }

      try {
        // Generate random UUIDs
        const userIdRes = await client.query("SELECT gen_random_uuid() as id");
        const userId = userIdRes.rows[0].id;
        const password = generatePassword();

        // 1. Create auth.user
        // Crypt hash logic usually used by GoTrue (cost 10)
        await client.query(`
          INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
          VALUES ($1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, crypt($3, gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}')
        `, [userId, email, password]);

        // 2. Create auth.identity
        await client.query(`
          INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
          VALUES (gen_random_uuid(), $1, $1, $2, 'email', NOW(), NOW(), NOW())
        `, [userId, JSON.stringify({ sub: userId, email: email })]);

        // 3. Handle Team logic (simplified: if team_name provided, create or get team)
        let teamId = null;
        if (team_name) {
          const teamRes = await client.query("SELECT id FROM public.teams WHERE name = $1", [team_name]);
          if (teamRes.rowCount && teamRes.rowCount > 0) {
            teamId = teamRes.rows[0].id;
          } else {
            const newTeamRes = await client.query(`
              INSERT INTO public.teams (name, team_code, domain)
              VALUES ($1, $2, $3) RETURNING id
            `, [team_name, `TEAM-${randomBytes(2).toString("hex").toUpperCase()}`, domain || null]);
            teamId = newTeamRes.rows[0].id;
          }
        }

        // 4. Create public.profile
        await client.query(`
          INSERT INTO public.profiles (id, email, full_name, role, team_id, qr_token)
          VALUES ($1, $2, $3, 'participant', $4, gen_random_uuid()::text)
        `, [userId, email, full_name, teamId]);

        // 5. Update team leader if necessary
        if (teamId && String(is_leader).toLowerCase() === "true") {
          await client.query("UPDATE public.teams SET leader_id = $1 WHERE id = $2", [userId, teamId]);
        }

        successCount++;

        // Note: In a real system, you would queue an email to be sent to the user with their password.
        // For now, they are generated and the admin can export them or they are just securely saved.
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === "23505") { // Unique constraint violation (e.g. duplicate email)
          errors.push(`Email already exists: ${email}`);
        } else {
          errors.push(`Error creating user ${email}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    await client.query("COMMIT");
    await client.end();

    return NextResponse.json({ successCount, errors });
  } catch (error: unknown) {
    console.error("CSV Upload error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
