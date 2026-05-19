"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Trophy, Megaphone, QrCode, Calendar, ClipboardList, DoorOpen, LogOut, Moon, Sun, Search, UserRound, MapPinned } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import type { Profile, Role } from "@/types";

const nav = {
  admin: [
    [Home, "Pokemon League HQ", "/admin"],
    [Users, "Trainers", "/admin/users"],
    [Users, "Teams", "/admin/teams"],
    [ClipboardList, "Gym Battles", "/admin/rounds"],
    [MapPinned, "Allocations", "/admin/allocations"],
    [Trophy, "Leaderboard", "/admin/leaderboard"],
    [Megaphone, "Announcements", "/admin/announcements"],
    [QrCode, "Check-In", "/admin/checkin"],
    [ClipboardList, "Problem Statements", "/admin/problem-statements"],
    [DoorOpen, "Rooms", "/admin/rooms"],
    [Users, "Upload CSV", "/admin/upload-csv"],
  ],
  judge: [
    [Home, "Dashboard", "/judge"],
    [Search, "Scan QR", "/judge/scan"],
    [Calendar, "My Schedule", "/judge/schedule"],
    [Trophy, "Leaderboard", "/judge/leaderboard"],
  ],
  participant: [
    [Home, "Home", "/participant"],
    [QrCode, "My QR", "/participant/qr"],
    [Megaphone, "Announcements", "/participant/announcements"],
    [Calendar, "Schedule", "/participant/schedule"],
    [ClipboardList, "PS Selection", "/participant/ps-selection"],
    [UserRound, "Profile", "/participant/profile"],
  ],
  mentor: [
    [Home, "Home", "/participant"],
    [Calendar, "Schedule", "/participant/schedule"],
  ],
} satisfies Record<Role, Array<[typeof Home, string, string]>>;

export function PokedexSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const items = nav[profile.role];

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r-4 border-poke-black bg-poke-red p-4 lg:block">
        <div className="mb-5 rounded-lg border-4 border-poke-black bg-bg-secondary p-4 shadow-screen">
          <p className="font-display text-sm leading-7 text-poke-yellow">BITNBUILD</p>
          <p className="text-xs text-slate-200">Pokedex Control Screen</p>
        </div>
        <nav className="grid gap-2">
          {items.map(([Icon, label, href]) => (
            <Link key={href} href={href} className={cn("flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-extrabold text-white transition hover:bg-black/20", pathname === href && "bg-poke-yellow text-slate-950")}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border-4 border-poke-black bg-bg-secondary p-3">
          <p className="truncate font-bold">{profile.full_name}</p>
          <p className="mb-3 text-xs uppercase text-poke-yellow">{profile.role}</p>
          <div className="flex gap-2">
            <button aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid h-11 w-11 place-items-center rounded-md bg-white/10">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button aria-label="Logout" onClick={logout} className="grid h-11 flex-1 place-items-center rounded-md bg-poke-red text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 overflow-x-auto border-t-2 border-poke-black bg-poke-red p-1 lg:hidden">
        {items.map(([Icon, label, href]) => (
          <Link key={href} href={href} className={cn("flex min-h-12 min-w-16 flex-col items-center justify-center rounded px-1 text-center text-[9px] font-bold text-white", pathname === href && "bg-poke-yellow text-slate-950")}>
            <Icon className="mb-0.5 h-4 w-4 shrink-0" />
            <span className="max-w-[60px] truncate">{label.split(" ")[0]}</span>
          </Link>
        ))}
        {(profile.role === "admin" || profile.role === "judge") && (
          <button onClick={logout} className="flex min-h-12 min-w-16 flex-col items-center justify-center rounded px-1 text-center text-[9px] font-bold text-white hover:bg-black/20">
            <LogOut className="mb-0.5 h-4 w-4 shrink-0" />
            <span className="max-w-[60px] truncate">Logout</span>
          </button>
        )}
      </nav>
    </>
  );
}
