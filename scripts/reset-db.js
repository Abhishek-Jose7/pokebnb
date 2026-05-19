const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

function readEnv(file) {
  const envPath = path.join(process.cwd(), file);
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

async function main() {
  const env = { ...readEnv(".env.local"), ...process.env };
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is missing");

  const client = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const migration = fs.readFileSync(path.join(process.cwd(), "supabase/migrations/001_initial_schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(process.cwd(), "supabase/seed.sql"), "utf8");

  const resetSql = `
    begin;

    drop table if exists
      public.check_in_logs,
      public.audit_logs,
      public.announcements,
      public.scores,
      public.allocations,
      public.rooms,
      public.rounds,
      public.profiles,
      public.teams,
      public.problem_statements
    cascade;

    drop function if exists public.get_leaderboard() cascade;
    drop function if exists public.calculate_team_scores() cascade;
    drop function if exists public.touch_updated_at() cascade;
    drop function if exists public.my_team_id() cascade;
    drop function if exists public.is_admin() cascade;
    drop function if exists public.current_role() cascade;

    delete from auth.identities
    where user_id in (select id from auth.users where email like '%@bitnbuild.com');

    delete from auth.users
    where email like '%@bitnbuild.com';

    commit;
  `;

  await client.connect();
  try {
    console.log("Resetting public app schema and seeded BITNBUILD auth users...");
    await client.query(resetSql);
    console.log("Running migration...");
    await client.query(migration);
    console.log("Running seed...");
    await client.query(seed);
    console.log("Done.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
