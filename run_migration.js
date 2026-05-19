const { Client } = require("pg");
async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  await c.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT");
  console.log("Added specialty column");
  await c.query("UPDATE profiles SET specialty='aiml' WHERE email LIKE 'judge1%'");
  await c.query("UPDATE profiles SET specialty='blockchain' WHERE email LIKE 'judge2%'");
  await c.query("UPDATE profiles SET specialty='webdev' WHERE email LIKE 'judge3%'");
  console.log("Set judge specialties");
  await c.end();
}
run().catch(console.error);
