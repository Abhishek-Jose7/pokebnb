import { AdminManageUsers } from "@/components/admin/AdminManage";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Client } from "pg";

export default async function UsersPage() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const profilesRes = await client.query(`
    SELECT p.*, t.name as team_name 
    FROM profiles p 
    LEFT JOIN teams t ON p.team_id = t.id 
    ORDER BY p.created_at DESC
  `);
  
  const teamsRes = await client.query(`SELECT * FROM teams ORDER BY name`);
  await client.end();

  const profiles = profilesRes.rows.map(row => ({
    ...row,
    teams: row.team_name ? { name: row.team_name } : null
  }));
  const teams = teamsRes.rows;
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-lg leading-9 text-poke-yellow">Trainer Registry</h1>
      <PokemonCard title="Manage Trainers">
        <AdminManageUsers profiles={profiles ?? []} teams={teams ?? []} />
      </PokemonCard>
    </div>
  );
}
