import type { Allocation, Profile, Room, Round, Team } from "@/types";

export interface AllocationInput {
  round: Round;
  teams: Team[];
  judges: Profile[];
  mentors: Profile[];
  rooms: Room[];
}

function addMinutes(value: string | null, minutes: number) {
  const base = value ? new Date(value) : new Date();
  base.setMinutes(base.getMinutes() + minutes);
  return base.toISOString();
}

function pickByDomain<T extends { domain?: string | null; team_id?: string | null }>(items: T[], domain: string | null | undefined, index: number) {
  const same = items.filter((item) => item.domain === domain);
  const pool = same.length ? same : items;
  return pool[index % Math.max(1, pool.length)] ?? null;
}

export function generateAllocations({ round, teams, judges, mentors, rooms }: AllocationInput): Array<Omit<Allocation, "id" | "created_at">> {
  const slotOwners = new Set<string>();

  return teams.map((team, index) => {
    const slotIndex = Math.floor(index / Math.max(1, rooms.length || 1));
    const scheduled_time = addMinutes(round.start_time, slotIndex * 30);
    const judgePool = judges.filter((judge) => !slotOwners.has(`j:${judge.id}:${scheduled_time}`));
    const mentorPool = mentors.filter((mentor) => !slotOwners.has(`m:${mentor.id}:${scheduled_time}`));
    const judge = pickByDomain(judgePool, team.domain, index);
    const mentor = pickByDomain(mentorPool, team.domain, index);
    const room = pickByDomain(rooms, team.domain, index);

    if (judge) slotOwners.add(`j:${judge.id}:${scheduled_time}`);
    if (mentor) slotOwners.add(`m:${mentor.id}:${scheduled_time}`);

    return {
      round_id: round.id,
      team_id: team.id,
      judge_id: judge?.id ?? null,
      mentor_id: mentor?.id ?? null,
      room_id: room?.id ?? null,
      scheduled_time,
      is_published: false,
    };
  });
}
