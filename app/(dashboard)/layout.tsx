import { redirect } from "next/navigation";
import { Providers } from "@/components/Providers";
import { PokedexSidebar } from "@/components/pokemon/PokedexSidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/login");

  return (
    <Providers>
    <div>
      <PokedexSidebar profile={profile} />
      <main className="min-h-screen px-4 pb-24 pt-5 lg:ml-72 lg:px-8 lg:pb-8">
        {children}
      </main>
    </div>
    </Providers>
  );
}
