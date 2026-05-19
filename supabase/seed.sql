INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data
)
VALUES
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@bitnbuild.com', crypt('Admin@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}'),
  ('00000000-0000-4000-8000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'judge1@bitnbuild.com', crypt('Judge@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}'),
  ('00000000-0000-4000-8000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'judge2@bitnbuild.com', crypt('Judge@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}'),
  ('00000000-0000-4000-8000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'judge3@bitnbuild.com', crypt('Judge@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}'),
  ('00000000-0000-4000-8000-000000000021', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mentor1@bitnbuild.com', crypt('Mentor@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}'),
  ('00000000-0000-4000-8000-000000000022', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mentor2@bitnbuild.com', crypt('Mentor@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data
)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'trainer' || gs || '@bitnbuild.com', crypt('Trainer@1234', gen_salt('bf', 10)), NOW(), '', '', '', '', NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"email_verified":true}'
FROM generate_series(1, 10) gs
ON CONFLICT DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, id::text, jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW()
FROM auth.users
WHERE email LIKE '%@bitnbuild.com'
ON CONFLICT DO NOTHING;

INSERT INTO problem_statements (id, title, description, domain, difficulty, pdf_url) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Dragon Vision AI', 'Build a computer-vision assistant for event operations.', 'AI/ML', 'hard', 'https://example.com/dragon-vision.pdf'),
  ('10000000-0000-0000-0000-000000000002', 'Electric Wallet Quest', 'Create a transparent Web3 sponsorship ledger.', 'Web3', 'medium', 'https://example.com/electric-wallet.pdf'),
  ('10000000-0000-0000-0000-000000000003', 'Fairy Care Triage', 'Design a health support triage tool for campuses.', 'HealthTech', 'medium', 'https://example.com/fairy-care.pdf'),
  ('10000000-0000-0000-0000-000000000004', 'Grass Tutor League', 'Make adaptive peer learning for first-year students.', 'EdTech', 'easy', 'https://example.com/grass-tutor.pdf'),
  ('10000000-0000-0000-0000-000000000005', 'Dark Shield SOC', 'Automate incident triage for small security teams.', 'Cybersecurity', 'hard', 'https://example.com/dark-shield.pdf')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teams (id, name, team_code, domain) VALUES
  ('20000000-0000-4000-8000-000000000001', 'Pikachu Pack', 'TEAM-001', 'AI/ML'),
  ('20000000-0000-4000-8000-000000000002', 'Squirtle Squad', 'TEAM-002', 'Web3'),
  ('20000000-0000-4000-8000-000000000003', 'Bulba Builders', 'TEAM-003', 'HealthTech')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role, trainer_id, pokemon_sprite, team_id, qr_token) VALUES
  ('00000000-0000-4000-8000-000000000001', 'admin@bitnbuild.com', 'Professor Oak', 'admin', 'TRN-0001', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', NULL, gen_random_uuid()::text),
  ('00000000-0000-4000-8000-000000000011', 'judge1@bitnbuild.com', 'Brock Stone', 'judge', 'TRN-0011', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png', NULL, gen_random_uuid()::text),
  ('00000000-0000-4000-8000-000000000012', 'judge2@bitnbuild.com', 'Misty Wave', 'judge', 'TRN-0012', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png', NULL, gen_random_uuid()::text),
  ('00000000-0000-4000-8000-000000000013', 'judge3@bitnbuild.com', 'Lt Surge Bolt', 'judge', 'TRN-0013', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png', NULL, gen_random_uuid()::text),
  ('00000000-0000-4000-8000-000000000021', 'mentor1@bitnbuild.com', 'Nurse Joy', 'mentor', 'TRN-0021', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png', NULL, gen_random_uuid()::text),
  ('00000000-0000-4000-8000-000000000022', 'mentor2@bitnbuild.com', 'Bill Storage', 'mentor', 'TRN-0022', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png', NULL, gen_random_uuid()::text)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role, trainer_id, pokemon_sprite, team_id, qr_token)
SELECT id, email, 'Trainer ' || row_number() OVER (ORDER BY email), 'participant', 'TRN-' || lpad((30 + row_number() OVER (ORDER BY email))::text, 4, '0'),
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' || (ARRAY[1,4,7,25,39,54,133,143,149,151])[row_number() OVER (ORDER BY email)] || '.png',
  (ARRAY['20000000-0000-4000-8000-000000000001'::uuid,'20000000-0000-4000-8000-000000000001'::uuid,'20000000-0000-4000-8000-000000000001'::uuid,'20000000-0000-4000-8000-000000000002'::uuid,'20000000-0000-4000-8000-000000000002'::uuid,'20000000-0000-4000-8000-000000000002'::uuid,'20000000-0000-4000-8000-000000000003'::uuid,'20000000-0000-4000-8000-000000000003'::uuid,'20000000-0000-4000-8000-000000000003'::uuid,'20000000-0000-4000-8000-000000000003'::uuid])[row_number() OVER (ORDER BY email)],
  gen_random_uuid()::text
FROM auth.users
WHERE email LIKE 'trainer%@bitnbuild.com'
ON CONFLICT (id) DO NOTHING;

UPDATE teams SET leader_id = (SELECT id FROM profiles WHERE email = 'trainer1@bitnbuild.com') WHERE team_code = 'TEAM-001';
UPDATE teams SET leader_id = (SELECT id FROM profiles WHERE email = 'trainer4@bitnbuild.com') WHERE team_code = 'TEAM-002';
UPDATE teams SET leader_id = (SELECT id FROM profiles WHERE email = 'trainer7@bitnbuild.com') WHERE team_code = 'TEAM-003';

INSERT INTO rounds (id, name, round_number, start_time, end_time, is_active, is_published, scoring_criteria) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Gym Battle 1 - Bug Badge', 1, NOW() + INTERVAL '1 hour', NOW() + INTERVAL '5 hours', TRUE, TRUE, '[{"name":"Innovation","description":"Novelty and creative approach","max_score":10},{"name":"Execution","description":"Technical completeness","max_score":10},{"name":"Impact","description":"Usefulness for the target audience","max_score":10}]'),
  ('30000000-0000-0000-0000-000000000002', 'Gym Battle 2 - Thunder Badge', 2, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 4 hours', TRUE, TRUE, '[{"name":"Innovation","description":"Originality and problem fit","max_score":10},{"name":"Scalability","description":"Can the solution grow beyond the demo?","max_score":10},{"name":"Execution","description":"Quality, reliability, and completeness","max_score":10},{"name":"Presentation","description":"Clarity of demo and storytelling","max_score":10}]'),
  ('30000000-0000-0000-0000-000000000003', 'Pokemon League Finals', 3, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours', FALSE, FALSE, '[{"name":"Product","max_score":20},{"name":"Scale","max_score":10},{"name":"Demo","max_score":20}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (name, capacity, location, domain) VALUES
  ('Cerulean Gym - Room 1', 8, 'Block A', 'AI/ML'),
  ('Vermilion Gym - Room 2', 8, 'Block A', 'Web3'),
  ('Celadon Gym - Room 3', 10, 'Block B', 'HealthTech'),
  ('Saffron Gym - Room 4', 12, 'Block B', 'EdTech'),
  ('Viridian Gym - Main Arena', 30, 'Auditorium', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO announcements (title, body, target_role, created_by) VALUES
  ('Welcome to BITNBUILD', 'Check in, meet your team, and prepare for Gym Battle 1.', 'all', '00000000-0000-4000-8000-000000000001'),
  ('Judges Briefing', 'Gym Leaders, please review the scoring criteria before your first slot.', 'judge', '00000000-0000-4000-8000-000000000001'),
  ('Problem Statement Window Open', 'Team leaders can now select one Gym Badge challenge.', 'participant', '00000000-0000-4000-8000-000000000001');

INSERT INTO allocations (round_id, team_id, judge_id, mentor_id, room_id, scheduled_time, is_published)
SELECT r.id, t.id, j.id, m.id, room.id,
  NOW() + ((r.round_number * 60 + row_number() OVER (PARTITION BY r.id ORDER BY t.team_code) * 30) || ' minutes')::interval,
  TRUE
FROM rounds r
CROSS JOIN teams t
JOIN profiles j ON j.email = 'judge1@bitnbuild.com'
LEFT JOIN profiles m ON m.email = 'mentor1@bitnbuild.com'
LEFT JOIN rooms room ON room.domain = t.domain OR room.name = 'Viridian Gym - Main Arena'
WHERE r.round_number IN (1, 2)
  AND room.id = (
    SELECT id FROM rooms rr
    WHERE rr.domain = t.domain OR rr.name = 'Viridian Gym - Main Arena'
    ORDER BY rr.domain NULLS LAST
    LIMIT 1
  )
ON CONFLICT (round_id, team_id) DO UPDATE
SET judge_id = EXCLUDED.judge_id,
    mentor_id = EXCLUDED.mentor_id,
    room_id = EXCLUDED.room_id,
    scheduled_time = EXCLUDED.scheduled_time,
    is_published = TRUE;
