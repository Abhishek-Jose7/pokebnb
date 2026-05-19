export type Role = "admin" | "judge" | "participant" | "mentor";
export type Difficulty = "easy" | "medium" | "hard";
export type CheckInType = "attendance" | "breakfast" | "lunch" | "dinner" | "snacks";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  trainer_id: string | null;
  avatar_url: string | null;
  pokemon_sprite: string | null;
  team_id: string | null;
  is_checked_in: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  food_claimed: Record<string, boolean>;
  qr_token: string | null;
  phone: string | null;
  specialty: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  team_code: string;
  leader_id: string | null;
  domain: string | null;
  selected_ps_id: string | null;
  ps_submitted_at: string | null;
  total_score: number;
  rank: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  difficulty: Difficulty | null;
  pdf_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Round {
  id: string;
  name: string;
  round_number: number;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  is_published: boolean;
  scoring_criteria: ScoringCriterion[];
  created_at: string;
}

export interface ScoringCriterion {
  name: string;
  description?: string;
  max_score: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string | null;
  domain: string | null;
  is_available: boolean;
}

export interface Allocation {
  id: string;
  round_id: string;
  team_id: string;
  judge_id: string | null;
  mentor_id: string | null;
  room_id: string | null;
  scheduled_time: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Score {
  id: string;
  round_id: string;
  team_id: string;
  judge_id: string;
  criteria_scores: Record<string, number>;
  total_score: number;
  remarks: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  target_role: Role | "all";
  is_email_sent: boolean;
  sent_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface LeaderboardRow {
  rank: number;
  team_id: string;
  team_name: string;
  domain: string | null;
  total_score: number;
  round_scores: Record<string, number>;
}

type DbTable<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: DbTable<Profile, Partial<Profile> & Pick<Profile, "id" | "email" | "full_name" | "role">, Partial<Profile>>;
      teams: DbTable<Team, Partial<Team> & Pick<Team, "name" | "team_code">, Partial<Team>>;
      problem_statements: DbTable<ProblemStatement, Partial<ProblemStatement> & Pick<ProblemStatement, "title" | "domain">, Partial<ProblemStatement>>;
      rounds: DbTable<Round, Partial<Round> & Pick<Round, "name" | "round_number" | "scoring_criteria">, Partial<Round>>;
      rooms: DbTable<Room, Partial<Room> & Pick<Room, "name" | "capacity">, Partial<Room>>;
      allocations: DbTable<Allocation, Partial<Allocation> & Pick<Allocation, "round_id" | "team_id">, Partial<Allocation>>;
      scores: DbTable<Score, Partial<Score> & Pick<Score, "round_id" | "team_id" | "judge_id" | "criteria_scores" | "total_score">, Partial<Score>>;
      announcements: DbTable<Announcement, Partial<Announcement> & Pick<Announcement, "title" | "body">, Partial<Announcement>>;
      audit_logs: DbTable<{ id: string; actor_id: string | null; action: string; entity_type: string | null; entity_id: string | null; metadata: Json; created_at: string }, { actor_id?: string | null; action: string; entity_type?: string | null; entity_id?: string | null; metadata?: Json }, never>;
      check_in_logs: DbTable<{ id: string; user_id: string | null; scanned_by: string | null; type: CheckInType; scanned_at: string }, { user_id?: string | null; scanned_by?: string | null; type: CheckInType }, never>;
    };
    Views: Record<string, never>;
    Functions: {
      get_leaderboard: { Args: Record<string, never>; Returns: LeaderboardRow[] };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
