CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE problem_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  pdf_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  team_code TEXT UNIQUE NOT NULL,
  leader_id UUID,
  domain TEXT,
  selected_ps_id UUID REFERENCES problem_statements(id),
  ps_submitted_at TIMESTAMPTZ,
  total_score NUMERIC DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'judge', 'participant', 'mentor')),
  trainer_id TEXT UNIQUE,
  avatar_url TEXT,
  pokemon_sprite TEXT,
  team_id UUID REFERENCES teams(id),
  is_checked_in BOOLEAN DEFAULT FALSE,
  food_claimed JSONB DEFAULT '{}',
  qr_token TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teams ADD CONSTRAINT teams_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES profiles(id);

CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  scoring_criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  location TEXT,
  domain TEXT,
  is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES profiles(id),
  mentor_id UUID REFERENCES profiles(id),
  room_id UUID REFERENCES rooms(id),
  scheduled_time TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(round_id, team_id)
);

CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES profiles(id),
  criteria_scores JSONB NOT NULL,
  total_score NUMERIC NOT NULL,
  remarks TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(round_id, team_id, judge_id)
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_role TEXT DEFAULT 'all',
  is_email_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE check_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  scanned_by UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('attendance', 'breakfast', 'lunch', 'dinner', 'snacks')),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX check_in_once_per_day_idx ON check_in_logs(user_id, type, ((scanned_at AT TIME ZONE 'UTC')::date));

CREATE OR REPLACE FUNCTION public.current_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_role() = 'admin', FALSE)
$$;

CREATE OR REPLACE FUNCTION public.my_team_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER teams_touch_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER scores_touch_updated_at BEFORE UPDATE ON scores FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE OR REPLACE FUNCTION public.calculate_team_scores()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH totals AS (
    SELECT team_id, COALESCE(SUM(total_score), 0) AS total
    FROM scores
    GROUP BY team_id
  ), ranked AS (
    SELECT t.id, COALESCE(totals.total, 0) AS total, RANK() OVER (ORDER BY COALESCE(totals.total, 0) DESC) AS rank
    FROM teams t
    LEFT JOIN totals ON totals.team_id = t.id
  )
  UPDATE teams
  SET total_score = ranked.total, rank = ranked.rank
  FROM ranked
  WHERE teams.id = ranked.id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER scores_recalculate_team_scores AFTER INSERT OR UPDATE OR DELETE ON scores FOR EACH ROW EXECUTE FUNCTION calculate_team_scores();

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  rank INTEGER,
  team_id UUID,
  team_name TEXT,
  domain TEXT,
  total_score NUMERIC,
  round_scores JSONB
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(t.rank, RANK() OVER (ORDER BY t.total_score DESC))::INTEGER AS rank,
    t.id AS team_id,
    t.name AS team_name,
    t.domain,
    COALESCE(t.total_score, 0) AS total_score,
    COALESCE(jsonb_object_agg(r.name, rs.score) FILTER (WHERE r.id IS NOT NULL), '{}'::jsonb) AS round_scores
  FROM teams t
  LEFT JOIN (
    SELECT round_id, team_id, SUM(total_score) AS score
    FROM scores
    GROUP BY round_id, team_id
  ) rs ON rs.team_id = t.id
  LEFT JOIN rounds r ON r.id = rs.round_id
  GROUP BY t.id
  ORDER BY total_score DESC, t.name ASC;
$$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_read_self_or_admin ON profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY profiles_insert_admin ON profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY profiles_update_self_limited_or_admin ON profiles FOR UPDATE USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY profiles_delete_admin ON profiles FOR DELETE USING (public.is_admin());

CREATE POLICY teams_read_member_or_staff ON teams FOR SELECT USING (public.is_admin() OR id = public.my_team_id() OR public.current_role() IN ('judge','mentor'));
CREATE POLICY teams_insert_admin ON teams FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY teams_update_admin_or_leader_ps ON teams FOR UPDATE USING (public.is_admin() OR leader_id = auth.uid()) WITH CHECK (public.is_admin() OR leader_id = auth.uid());
CREATE POLICY teams_delete_admin ON teams FOR DELETE USING (public.is_admin());

CREATE POLICY problem_statements_read_authenticated ON problem_statements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY problem_statements_write_admin ON problem_statements FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY rounds_read_authenticated ON rounds FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY rounds_write_admin ON rounds FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY rooms_read_authenticated ON rooms FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY rooms_write_admin ON rooms FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY allocations_read_by_role ON allocations FOR SELECT USING (
  public.is_admin()
  OR judge_id = auth.uid()
  OR mentor_id = auth.uid()
  OR (is_published AND team_id = public.my_team_id())
);
CREATE POLICY allocations_write_admin ON allocations FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY scores_read_visible ON scores FOR SELECT USING (
  public.is_admin()
  OR judge_id = auth.uid()
  OR team_id = public.my_team_id()
);
CREATE POLICY scores_judges_insert_own ON scores FOR INSERT WITH CHECK (public.current_role() = 'judge' AND judge_id = auth.uid());
CREATE POLICY scores_judges_update_own ON scores FOR UPDATE USING (judge_id = auth.uid()) WITH CHECK (judge_id = auth.uid());
CREATE POLICY scores_judges_delete_own_or_admin ON scores FOR DELETE USING (judge_id = auth.uid() OR public.is_admin());

CREATE POLICY announcements_read_authenticated ON announcements FOR SELECT USING (
  auth.uid() IS NOT NULL
  AND (target_role = 'all' OR target_role = public.current_role() OR public.is_admin())
);
CREATE POLICY announcements_write_admin ON announcements FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY audit_logs_read_admin ON audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY audit_logs_insert_authenticated ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY check_in_logs_read_admin_self ON check_in_logs FOR SELECT USING (public.is_admin() OR user_id = auth.uid() OR scanned_by = auth.uid());
CREATE POLICY check_in_logs_insert_admin ON check_in_logs FOR INSERT WITH CHECK (public.is_admin());

ALTER PUBLICATION supabase_realtime ADD TABLE scores;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE check_in_logs;
