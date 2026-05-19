const { Client } = require("pg");
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf8");
const dbUrlMatch = env.match(/DATABASE_URL="?([^"\n]+)"?/);
if (!dbUrlMatch) throw new Error("No db URL");

async function run() {
  const client = new Client({ connectionString: dbUrlMatch[1] });
  await client.connect();
  await client.query(`
    ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS breakfast BOOLEAN DEFAULT false, 
    ADD COLUMN IF NOT EXISTS lunch BOOLEAN DEFAULT false, 
    ADD COLUMN IF NOT EXISTS dinner BOOLEAN DEFAULT false;
  `);
  console.log("Added columns");
  await client.end();
}

run();
