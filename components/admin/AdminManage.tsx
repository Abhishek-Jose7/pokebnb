"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
  trainer_id: string | null;
  team_id: string | null;
  specialty: string | null;
  is_checked_in: boolean;
  pokemon_sprite: string | null;
  teams?: { name: string } | null;
}

interface TeamRow {
  id: string;
  name: string;
  team_code: string;
  domain: string | null;
  leader_id: string | null;
  total_score: number;
  rank: number | null;
}

export function AdminManageUsers({
  profiles,
  teams,
}: {
  profiles: ProfileRow[];
  teams: TeamRow[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProfileRow>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: "", email: "", team_code: "" });

  const filtered = profiles.filter((p) => {
    if (roleFilter !== "all" && p.role !== roleFilter) return false;
    if (specialtyFilter !== "all" && p.specialty !== specialtyFilter) return false;
    if (filter && !p.full_name.toLowerCase().includes(filter.toLowerCase()) && !p.email.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  async function deleteProfile(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("User deleted");
    router.refresh();
  }

  async function saveEdit() {
    if (!editingId) return;
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({
      full_name: editForm.full_name,
      role: editForm.role,
      team_id: editForm.team_id || null,
      specialty: editForm.specialty || null,
    }).eq("id", editingId);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
    setEditingId(null);
    router.refresh();
  }

  async function addUser() {
    if (!newUser.full_name || !newUser.email) { toast.error("Name and email are required"); return; }
    const csvContent = `full_name,email,team_code\n"${newUser.full_name}","${newUser.email}","${newUser.team_code}"`;
    const file = new File([csvContent], "single_user.csv", { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload-csv", { method: "POST", body: formData });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error || "Failed to add user"); return; }
    if (json.errors?.length > 0) { toast.error(json.errors[0]); return; }
    
    toast.success(`User added! Password: ${json.generatedUsers[0].password}`, { duration: 10000 });
    setShowAdd(false);
    setNewUser({ full_name: "", email: "", team_code: "" });
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-h-11 flex-1 rounded-md border border-border bg-slate-950/40 px-3 text-sm text-white placeholder:text-slate-500"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="min-h-11 rounded-md border border-border bg-slate-950/40 px-3 text-sm text-white">
          <option value="all">All Roles</option>
          <option value="participant">Participant</option>
          <option value="judge">Judge</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
        <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} className="min-h-11 rounded-md border border-border bg-slate-950/40 px-3 text-sm text-white">
          <option value="all">All Specialties</option>
          <option value="webdev">Web Dev</option>
          <option value="blockchain">Blockchain</option>
          <option value="aiml">AI/ML</option>
        </select>
        <button onClick={() => setShowAdd(!showAdd)} className="min-h-11 rounded-md bg-poke-yellow px-4 font-bold text-black transition hover:bg-yellow-300">
          + Add User
        </button>
      </div>

      {showAdd && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-slate-950/30 p-3">
          <input placeholder="Full Name" value={newUser.full_name} onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} className="min-h-10 flex-1 rounded border border-border bg-slate-950/60 px-2 text-sm text-white" />
          <input placeholder="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="min-h-10 flex-1 rounded border border-border bg-slate-950/60 px-2 text-sm text-white" />
          <input placeholder="Team Code (Optional)" value={newUser.team_code} onChange={(e) => setNewUser({...newUser, team_code: e.target.value})} className="min-h-10 w-40 rounded border border-border bg-slate-950/60 px-2 text-sm text-white" />
          <button onClick={addUser} className="rounded bg-green-600 px-3 py-1.5 text-xs font-bold text-white">Create</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-poke-yellow">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Team</th>
              <th className="p-3">Specialty</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                {editingId === p.id ? (
                  <>
                    <td className="p-2"><input className="w-full rounded border border-border bg-slate-950/60 px-2 py-1 text-sm text-white" value={editForm.full_name ?? ""} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} /></td>
                    <td className="p-2 text-sm text-slate-400">{p.email}</td>
                    <td className="p-2">
                      <select className="rounded border border-border bg-slate-950/60 px-2 py-1 text-sm text-white" value={editForm.role ?? ""} onChange={(e) => setEditForm({...editForm, role: e.target.value})}>
                        <option value="participant">Participant</option>
                        <option value="judge">Judge</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select className="rounded border border-border bg-slate-950/60 px-2 py-1 text-sm text-white" value={editForm.team_id ?? ""} onChange={(e) => setEditForm({...editForm, team_id: e.target.value})}>
                        <option value="">No Team</option>
                        {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </td>
                    <td className="p-2">
                      <select className="rounded border border-border bg-slate-950/60 px-2 py-1 text-sm text-white" value={editForm.specialty ?? ""} onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}>
                        <option value="">None</option>
                        <option value="webdev">Web Dev</option>
                        <option value="blockchain">Blockchain</option>
                        <option value="aiml">AI/ML</option>
                      </select>
                    </td>
                    <td className="flex gap-2 p-2">
                      <button onClick={saveEdit} className="rounded bg-green-600 px-2 py-1 text-xs font-bold text-white">Save</button>
                      <button onClick={() => setEditingId(null)} className="rounded bg-slate-600 px-2 py-1 text-xs font-bold text-white">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-bold">{p.full_name}</td>
                    <td className="p-3 font-mono text-xs text-slate-400">{p.email}</td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.role === "admin" ? "bg-poke-red/20 text-poke-red" : p.role === "judge" ? "bg-poke-blue/20 text-poke-blue" : "bg-poke-yellow/20 text-poke-yellow"}`}>{p.role}</span></td>
                    <td className="p-3 text-sm">{p.teams?.name ?? "—"}</td>
                    <td className="p-3 text-sm text-slate-400">{p.specialty ?? "—"}</td>
                    <td className="flex gap-2 p-3">
                      <button onClick={() => { setEditingId(p.id); setEditForm({ full_name: p.full_name, role: p.role, team_id: p.team_id, specialty: p.specialty }); }} className="rounded bg-poke-blue px-2 py-1 text-xs font-bold text-white">Edit</button>
                      <button onClick={() => deleteProfile(p.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">Del</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-400">Showing {filtered.length} of {profiles.length} users</p>
    </div>
  );
}

export function AdminManageTeams({ teams }: { teams: TeamRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamRow>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", team_code: "", domain: "" });

  async function addTeam() {
    if (!newTeam.name || !newTeam.team_code) { toast.error("Name and code are required"); return; }
    const supabase = createClient();
    const { error } = await supabase.from("teams").insert({ name: newTeam.name, team_code: newTeam.team_code, domain: newTeam.domain || null });
    if (error) { toast.error(error.message); return; }
    toast.success("Team created");
    setShowAdd(false);
    setNewTeam({ name: "", team_code: "", domain: "" });
    router.refresh();
  }

  async function saveTeamEdit() {
    if (!editingId) return;
    const supabase = createClient();
    const { error } = await supabase.from("teams").update({ name: editForm.name, domain: editForm.domain || null }).eq("id", editingId);
    if (error) { toast.error(error.message); return; }
    toast.success("Team updated");
    setEditingId(null);
    router.refresh();
  }

  async function deleteTeam(id: string) {
    if (!confirm("Delete this team? Members will be unassigned.")) return;
    const supabase = createClient();
    // Unassign members first
    await supabase.from("profiles").update({ team_id: null }).eq("team_id", id);
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Team deleted");
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{teams.length} teams</p>
        <button onClick={() => setShowAdd(!showAdd)} className="rounded bg-poke-yellow px-3 py-1.5 text-xs font-bold text-black">+ Add Team</button>
      </div>

      {showAdd && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-slate-950/30 p-3">
          <input placeholder="Team Name" value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} className="min-h-10 flex-1 rounded border border-border bg-slate-950/60 px-2 text-sm text-white" />
          <input placeholder="Team Code" value={newTeam.team_code} onChange={(e) => setNewTeam({...newTeam, team_code: e.target.value})} className="min-h-10 w-32 rounded border border-border bg-slate-950/60 px-2 text-sm text-white" />
          <select value={newTeam.domain} onChange={(e) => setNewTeam({...newTeam, domain: e.target.value})} className="min-h-10 rounded border border-border bg-slate-950/60 px-2 text-sm text-white">
            <option value="">Domain</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Web3">Blockchain</option>
            <option value="HealthTech">HealthTech</option>
            <option value="EdTech">EdTech</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
          <button onClick={addTeam} className="rounded bg-green-600 px-3 py-1.5 text-xs font-bold text-white">Create</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-poke-yellow"><tr><th className="p-3">Name</th><th className="p-3">Code</th><th className="p-3">Domain</th><th className="p-3">Score</th><th className="p-3">Rank</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id} className="border-t border-border">
                {editingId === t.id ? (
                  <>
                    <td className="p-2"><input className="w-full rounded border border-border bg-slate-950/60 px-2 py-1 text-sm text-white" value={editForm.name ?? ""} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /></td>
                    <td className="p-2 font-mono text-xs">{t.team_code}</td>
                    <td className="p-2"><select className="rounded border border-border bg-slate-950/60 px-2 py-1 text-sm text-white" value={editForm.domain ?? ""} onChange={(e) => setEditForm({...editForm, domain: e.target.value})}><option value="">None</option><option value="AI/ML">AI/ML</option><option value="Web3">Blockchain</option><option value="HealthTech">HealthTech</option></select></td>
                    <td className="p-2">{Number(t.total_score)}</td>
                    <td className="p-2">{t.rank ?? "—"}</td>
                    <td className="flex gap-2 p-2">
                      <button onClick={saveTeamEdit} className="rounded bg-green-600 px-2 py-1 text-xs font-bold text-white">Save</button>
                      <button onClick={() => setEditingId(null)} className="rounded bg-slate-600 px-2 py-1 text-xs font-bold text-white">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-bold">{t.name}</td>
                    <td className="p-3 font-mono text-xs text-poke-yellow">{t.team_code}</td>
                    <td className="p-3 text-sm">{t.domain ?? "—"}</td>
                    <td className="p-3">{Number(t.total_score)}</td>
                    <td className="p-3">{t.rank ? `#${t.rank}` : "—"}</td>
                    <td className="flex gap-2 p-3">
                      <button onClick={() => { setEditingId(t.id); setEditForm({ name: t.name, domain: t.domain }); }} className="rounded bg-poke-blue px-2 py-1 text-xs font-bold text-white">Edit</button>
                      <button onClick={() => deleteTeam(t.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">Del</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
