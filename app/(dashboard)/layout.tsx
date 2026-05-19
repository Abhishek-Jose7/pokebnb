import { redirect } from "next/navigation";
import { Providers } from "@/components/Providers";
import { PokedexSidebar } from "@/components/pokemon/PokedexSidebar";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/types";

function inferRole(email?: string | null): Role {
  if (email?.startsWith("admin")) return "admin";
  if (email?.startsWith("judge")) return "judge";
  if (email?.startsWith("mentor")) return "mentor";
  return "participant";
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const fallbackProfile: Profile = {
    id: user.id,
    email: user.email ?? "",
    full_name: user.email?.split("@")[0].replace(/[._-]+/g, " ") ?? "Trainer",
    role: inferRole(user.email),
    trainer_id: null,
    avatar_url: null,
    pokemon_sprite: null,
    team_id: null,
    is_checked_in: false,
    food_claimed: {},
    qr_token: null,
    phone: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const shellProfile = profile ?? fallbackProfile;
  const isParticipant = shellProfile.role === "participant";

  return (
    <Providers>
    <div>
      {!isParticipant ? <PokedexSidebar profile={shellProfile} /> : null}
      <main className={`min-h-screen px-4 pt-5 ${isParticipant ? "pb-8 lg:px-8" : "pb-28 lg:ml-72 lg:px-8 lg:pb-8"}`}>
        {children}
      </main>
    </div>
    </Providers>
  );
}
