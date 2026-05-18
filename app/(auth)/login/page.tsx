"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PokeballLoader } from "@/components/pokemon/PokeballLoader";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Role } from "@/types";

const roleHome: Record<Role, string> = {
  admin: "/admin",
  judge: "/judge",
  participant: "/participant",
  mentor: "/participant",
};

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@bitnbuild.com");
  const [password, setPassword] = useState("Admin@1234");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setLoading(false);
      toast.error("A wild error appeared!", { description: error?.message ?? "Could not sign in." });
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
    const role = ((profile as Profile | null)?.role ?? "participant") as Role;
    router.push(params.get("next") ?? roleHome[role]);
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border-4 border-poke-black bg-poke-red p-5 shadow-card">
          <div className="rounded-lg border-4 border-poke-black bg-bg-secondary p-6 shadow-screen">
            <p className="mb-4 font-mono text-poke-yellow">Choose your starter</p>
            <h1 className="mb-5 font-display text-xl leading-10 text-white sm:text-3xl">BITNBUILD</h1>
            <p className="max-w-xl text-lg text-slate-200">
              Trainers enter here. Gym Leaders score battles, Professors run the League, and every badge-worthy build gets tracked.
            </p>
            <div className="mt-8 flex gap-4">
              {[1, 4, 7, 25].map((id) => (
                <div key={id} className="grid h-20 w-20 place-items-center rounded-lg border border-border bg-white/10">
                  <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt="" width={72} height={72} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-6 font-display text-sm leading-7 text-poke-yellow">Trainer Login</h2>
          <label className="mb-4 block text-sm font-bold">
            Email
            <Input className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label className="mb-6 block text-sm font-bold">
            Password
            <Input className="mt-2" value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <PokeballLoader label="Entering League..." /> : "Start Battle"}
          </Button>
        </form>
      </div>
    </div>
  );
}
