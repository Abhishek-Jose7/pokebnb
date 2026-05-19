"use client";

import type { CSSProperties } from "react";
import HackPokedex, { type PokedexPage } from "@/components/pokemon/pokedex";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface HackathonPokedexProps {
  trainer: {
    name: string;
    trainerId?: string | null;
    role?: string | null;
    checkedIn?: boolean | null;
    qrToken?: string | null;
  };
  team?: {
    name?: string | null;
    code?: string | null;
    domain?: string | null;
    rank?: number | null;
    totalScore?: number | null;
    selectedProblem?: string | null;
  } | null;
  members?: Array<{ name: string; trainerId?: string | null }>;
  schedule?: Array<{ label: string; time?: string | null; room?: string | null }>;
  announcements?: Array<{ title: string; body?: string | null }>;
}

function s(style: CSSProperties) {
  return style;
}

const green = "#4ade80";
const dim = "#1f6b3a";
const yellow = "#facc15";
const mono = "var(--font-body), monospace";

function ScreenLine({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div style={s({ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #0f3d1c", padding: "5px 0" })}>
      <span style={{ color: dim, fontFamily: mono }}>{label}</span>
      <span style={{ color: green, fontFamily: mono, textAlign: "right" }}>{value ?? "TBD"}</span>
    </div>
  );
}

function Overview({ trainer, team }: Pick<HackathonPokedexProps, "trainer" | "team">) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ color: yellow, fontFamily: mono, fontSize: "1.4rem", letterSpacing: "0.08em" }}>
        &gt; {trainer.name}
      </div>
      <ScreenLine label="TRAINER ID" value={trainer.trainerId} />
      <ScreenLine label="ROLE" value={trainer.role?.toUpperCase()} />
      <ScreenLine label="TEAM" value={team?.name} />
      <ScreenLine label="DOMAIN" value={team?.domain} />
      <ScreenLine label="CHECK-IN" value={trainer.checkedIn ? "CLEARED" : "PENDING"} />
      <div style={s({ marginTop: 6, padding: "8px 10px", background: "#050f08", border: "1px solid #0f3d1c", borderRadius: 4, color: green, fontFamily: mono, fontSize: "0.9rem", lineHeight: 1.6 })}>
        BITNBUILD 2025 trainer record loaded. Use left/right, A/B, or tabs to navigate.
      </div>
    </div>
  );
}

function AccountActions() {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: yellow, fontFamily: mono, fontSize: "1.1rem", letterSpacing: "0.08em" }}>ACCOUNT</div>
      <div style={s({ padding: "10px 12px", background: "#050f08", border: "1px solid #0f3d1c", borderRadius: 4, color: green, fontFamily: mono })}>
        End your trainer session from inside the Pokedex.
      </div>
      <button
        type="button"
        onClick={logout}
        style={s({ minHeight: 44, border: "2px solid #111", borderRadius: 6, background: "#facc15", color: "#111", fontFamily: mono, fontWeight: 900, cursor: "pointer" })}
      >
        LOG OUT
      </button>
    </div>
  );
}

function TeamData({ team, members = [] }: Pick<HackathonPokedexProps, "team" | "members">) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ color: yellow, fontFamily: mono, fontSize: "1rem", letterSpacing: "0.08em" }}>TEAM DATA</div>
      <ScreenLine label="NAME" value={team?.name} />
      <ScreenLine label="CODE" value={team?.code} />
      <ScreenLine label="RANK" value={team?.rank ? `#${team.rank}` : "UNRANKED"} />
      <ScreenLine label="SCORE" value={team?.totalScore ?? 0} />
      <ScreenLine label="PROBLEM" value={team?.selectedProblem ?? "NOT SELECTED"} />
      <div style={{ color: yellow, fontFamily: mono, fontSize: "0.95rem", marginTop: 8 }}>ROSTER</div>
      {members.length ? members.map((member, index) => (
        <div key={`${member.trainerId}-${member.name}`} style={s({ display: "flex", gap: 10, background: "#050f08", border: "1px solid #0f3d1c", borderRadius: 4, padding: "7px 10px" })}>
          <span style={{ color: dim, width: 22 }}>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ color: green }}>{member.name}</span>
        </div>
      )) : <div style={{ color: dim }}>No roster found.</div>}
    </div>
  );
}

function QrData({ trainer }: Pick<HackathonPokedexProps, "trainer">) {
  const qrData = encodeURIComponent(JSON.stringify({ trainer_id: trainer.trainerId, qr_token: trainer.qrToken }));
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${qrData}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8 }}>
      <div style={{ color: yellow, fontFamily: mono, fontSize: "1rem", letterSpacing: "0.08em" }}>TRAINER QR</div>
      <div style={s({ padding: 8, background: "#fff", borderRadius: 6, border: "2px solid #0f3d1c" })}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc} alt="Trainer QR" width={130} height={130} />
      </div>
      <div style={{ color: green, fontFamily: mono, fontSize: "0.85rem", textAlign: "center" }}>
        SHOW THIS AT CHECK-IN
      </div>
      <div style={{ color: dim, fontFamily: mono, fontSize: "0.8rem" }}>{trainer.trainerId}</div>
    </div>
  );
}

function ScheduleData({ schedule = [] }: Pick<HackathonPokedexProps, "schedule">) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ color: yellow, fontFamily: mono, fontSize: "1rem", letterSpacing: "0.08em", marginBottom: 4 }}>SCHEDULE</div>
      {schedule.length ? schedule.map((event) => (
        <div key={`${event.label}-${event.time}`} style={s({ display: "flex", flexDirection: "column", background: "#050f08", border: "1px solid #0f3d1c", borderRadius: 4, padding: "7px 10px" })}>
          <span style={{ color: yellow }}>{event.time ?? "TBD"}</span>
          <span style={{ color: green }}>{event.label}</span>
          <span style={{ color: dim }}>{event.room ?? "Room TBD"}</span>
        </div>
      )) : <div style={{ color: dim }}>No published slots yet.</div>}
    </div>
  );
}

function Broadcasts({ announcements = [] }: Pick<HackathonPokedexProps, "announcements">) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ color: yellow, fontFamily: mono, fontSize: "1rem", letterSpacing: "0.08em", marginBottom: 4 }}>BROADCASTS</div>
      {announcements.length ? announcements.map((item) => (
        <div key={item.title} style={s({ background: "#050f08", border: "1px solid #0f3d1c", borderRadius: 4, padding: "7px 10px" })}>
          <div style={{ color: green, fontFamily: mono, fontSize: "1rem" }}>{item.title}</div>
          <div style={{ color: dim, fontFamily: mono, fontSize: "0.85rem" }}>{item.body}</div>
        </div>
      )) : <div style={{ color: dim }}>No broadcasts yet.</div>}
    </div>
  );
}

export default function HackathonPage({ trainer, team, members, schedule, announcements }: HackathonPokedexProps) {
  const pages: PokedexPage[] = [
    { id: "overview", label: "HOME", title: "TRAINER", content: <Overview trainer={trainer} team={team} /> },
    { id: "team", label: "TEAM", title: "TEAM DATA", content: <TeamData team={team} members={members} /> },
    { id: "qr", label: "QR", title: "QR CODE", content: <QrData trainer={trainer} /> },
    { id: "schedule", label: "SCHED", title: "SCHEDULE", content: <ScheduleData schedule={schedule} /> },
    { id: "news", label: "NEWS", title: "BROADCASTS", content: <Broadcasts announcements={announcements} /> },
    { id: "account", label: "EXIT", title: "ACCOUNT", content: <AccountActions /> },
  ];

  return (
    <section className="flex w-full min-h-[calc(100vh-6rem)] items-center justify-center px-2 py-4 lg:px-0 lg:py-10">
      <div className="flex w-full max-w-[1280px] items-center justify-center origin-center transform lg:scale-[1.3] xl:scale-[1.4]">
        <div className="w-full">
          <HackPokedex pages={pages} status={trainer.checkedIn ? "green" : "yellow"} eventName="BITNBUILD 2025" />
        </div>
      </div>
    </section>
  );
}
