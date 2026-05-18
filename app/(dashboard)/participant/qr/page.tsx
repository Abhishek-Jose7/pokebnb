import { MyQRCode } from "@/components/participant/MyQRCode";
import { createClient } from "@/lib/supabase/server";

export default async function ParticipantQrPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id ?? "").maybeSingle();
  const { data: team } = profile?.team_id ? await supabase.from("teams").select("*").eq("id", profile.team_id).maybeSingle() : { data: null };
  return profile ? <MyQRCode profile={profile} team={team} /> : null;
}
