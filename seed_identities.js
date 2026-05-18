const { Client } = require("pg");
const fs = require("fs");

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:abhilovesscarl100@db.xicniyywucusfushnqqs.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    
    await client.query(`DELETE FROM auth.identities WHERE identity_data->>'email' LIKE '%@bitnbuild.com';`);
    await client.query(`DELETE FROM public.scores;`);
    await client.query(`DELETE FROM public.allocations;`);
    await client.query(`UPDATE public.teams SET leader_id = NULL;`);
    await client.query(`DELETE FROM public.announcements;`);
    await client.query(`DELETE FROM public.profiles WHERE email LIKE '%@bitnbuild.com';`);
    await client.query(`DELETE FROM public.teams;`);
    await client.query(`DELETE FROM auth.users WHERE email LIKE '%@bitnbuild.com';`);
    await client.query(`DELETE FROM auth.users WHERE email LIKE '%@bitnbuild.com';`);
    
    const seedSql = fs.readFileSync("supabase/seed.sql", "utf8");
    await client.query(seedSql);

    console.log("Successfully seeded database with valid v4 UUIDs.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
