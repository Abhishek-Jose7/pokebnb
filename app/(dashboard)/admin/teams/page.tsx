import { AdminManageTeams } from "@/components/admin/AdminManage";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Client } from "pg";

export default async function TeamsPage() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const { rows } = await client.query(`SELECT * FROM teams ORDER BY rank NULLS LAST, total_score DESC`);
  await client.end();

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Teams</h1>
      <PokemonCard title="Manage Teams">
        <AdminManageTeams teams={rows ?? []} />
      </PokemonCard>
    </div>
  );
}
