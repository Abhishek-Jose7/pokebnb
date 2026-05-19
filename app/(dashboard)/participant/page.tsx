import HackathonPage from "@/components/pokemon/hackathonpage";
import { createClient } from "@/lib/supabase/server";

export default async function ParticipantHomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id ?? "").maybeSingle();
  const [{ data: team }, { data: announcements }, { data: round }, { data: allocation }, { data: members }] = await Promise.all([
    profile?.team_id ? supabase.from("teams").select("*").eq("id", profile.team_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("announcements").select("*").in("target_role", ["all", "participant"]).order("created_at", { ascending: false }).limit(3),
    supabase.from("rounds").select("*").eq("is_active", true).maybeSingle(),
    profile?.team_id ? supabase.from("allocations").select("*").eq("team_id", profile.team_id).eq("is_published", true).order("scheduled_time").limit(1).maybeSingle() : Promise.resolve({ data: null }),
    profile?.team_id ? supabase.from("profiles").select("full_name,trainer_id").eq("team_id", profile.team_id).order("full_name") : Promise.resolve({ data: [] }),
  ]);
  if (!profile) return null;
  return (
    <div className="mx-auto grid max-w-7xl gap-5" style={{ minHeight: "100vh" }}>
      <HackathonPage
        trainer={{
          name: profile.full_name,
          trainerId: profile.trainer_id,
          role: profile.role,
          checkedIn: profile.is_checked_in,
          qrToken: profile.qr_token,
        }}
        team={team ? {
          name: team.name,
          code: team.team_code,
          domain: team.domain,
          rank: team.rank,
          totalScore: Number(team.total_score ?? 0),
          selectedProblem: team.selected_ps_id ? "Selected" : "Not selected",
        } : null}
        members={(members ?? []).map((member) => ({ name: member.full_name, trainerId: member.trainer_id }))}
        schedule={allocation ? [{
          label: round?.name ?? "Gym Battle",
          time: allocation.scheduled_time ? new Date(allocation.scheduled_time).toLocaleString() : null,
          room: allocation.room_id,
        }] : []}
        announcements={(announcements ?? []).map((item) => ({ title: item.title, body: item.body }))}
      />
    </div>
  );
}
