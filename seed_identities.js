const { Client } = require("pg");

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to database.\n");

    // Step 1: Nuke ALL test data cleanly in order
    console.log("=== CLEANING UP ===");
    await client.query(`DELETE FROM public.scores`);
    await client.query(`DELETE FROM public.allocations`);
    await client.query(`UPDATE public.teams SET leader_id = NULL`);
    await client.query(`DELETE FROM public.announcements`);
    await client.query(`DELETE FROM public.profiles`);
    await client.query(`DELETE FROM public.teams`);
    await client.query(`DELETE FROM auth.identities`);
    await client.query(`DELETE FROM auth.users`);
    console.log("  ✅ All old data removed.\n");

    // Step 2: Create users with gen_random_uuid() — truly random UUIDs
    console.log("=== CREATING USERS ===");
    
    const users = [
      { email: 'admin@bitnbuild.com', password: 'Admin@1234', role: 'admin', name: 'Professor Oak' },
      { email: 'judge1@bitnbuild.com', password: 'Judge@1234', role: 'judge', name: 'Brock Stone' },
      { email: 'judge2@bitnbuild.com', password: 'Judge@1234', role: 'judge', name: 'Misty Wave' },
      { email: 'judge3@bitnbuild.com', password: 'Judge@1234', role: 'judge', name: 'Lt Surge Bolt' },
      { email: 'mentor1@bitnbuild.com', password: 'Mentor@1234', role: 'mentor', name: 'Nurse Joy' },
      { email: 'mentor2@bitnbuild.com', password: 'Mentor@1234', role: 'mentor', name: 'Bill Storage' },
    ];

    // Trainers
    for (let i = 1; i <= 10; i++) {
      users.push({ email: `trainer${i}@bitnbuild.com`, password: 'Trainer@1234', role: 'participant', name: `Trainer ${i}` });
    }

    const createdUsers = [];

    for (const u of users) {
      const res = await client.query(`
        INSERT INTO auth.users (
          id, instance_id, aud, role, email, encrypted_password, 
          email_confirmed_at, created_at, updated_at, 
          confirmation_token, recovery_token, email_change_token_new,
          raw_app_meta_data, raw_user_meta_data, is_sso_user
        ) VALUES (
          gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 
          'authenticated', 'authenticated', $1, crypt($2, gen_salt('bf')), 
          NOW(), NOW(), NOW(), 
          '', '', '',
          '{"provider":"email","providers":["email"]}', '{}', false
        ) RETURNING id
      `, [u.email, u.password]);

      const userId = res.rows[0].id;
      createdUsers.push({ ...u, id: userId });
      console.log(`  ✅ ${u.email} → ${userId}`);
    }

    // Step 3: Create identities
    console.log("\n=== CREATING IDENTITIES ===");
    for (const u of createdUsers) {
      const identityData = JSON.stringify({
        sub: u.id.toString(),
        email: u.email,
        email_verified: true,
        phone_verified: false
      });
      await client.query(`
        INSERT INTO auth.identities (
          id, user_id, provider_id, identity_data, provider, 
          last_sign_in_at, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1::uuid, $2, 
          $3::jsonb, 
          'email', NOW(), NOW(), NOW()
        )
      `, [u.id, u.id.toString(), identityData]);
    }
    console.log(`  ✅ ${createdUsers.length} identities created.\n`);

    // Step 4: Create teams
    console.log("=== CREATING TEAMS ===");
    const teamResults = [];
    const teamDefs = [
      { name: 'Pikachu Pack', code: 'TEAM-001', domain: 'AI/ML' },
      { name: 'Squirtle Squad', code: 'TEAM-002', domain: 'Web3' },
      { name: 'Bulba Builders', code: 'TEAM-003', domain: 'HealthTech' },
    ];
    for (const t of teamDefs) {
      const res = await client.query(
        `INSERT INTO teams (id, name, team_code, domain) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id`,
        [t.name, t.code, t.domain]
      );
      teamResults.push({ ...t, id: res.rows[0].id });
      console.log(`  ✅ ${t.name} → ${res.rows[0].id}`);
    }

    // Step 5: Create profiles
    console.log("\n=== CREATING PROFILES ===");
    const sprites = [1,4,7,25,39,54,133,143,149,151];
    
    let trainerCounter = 1;
    for (const u of createdUsers) {
      let teamId = null;
      let sprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png';
      
      if (u.role === 'participant') {
        const num = parseInt(u.email.match(/trainer(\d+)/)?.[1] || '1');
        const teamIdx = num <= 3 ? 0 : num <= 6 ? 1 : 2;
        teamId = teamResults[teamIdx].id;
        sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sprites[num-1] || 25}.png`;
      }

      const trainerId = 'TRN-' + String(trainerCounter).padStart(4, '0');
      trainerCounter++;

      await client.query(`
        INSERT INTO profiles (id, email, full_name, role, trainer_id, pokemon_sprite, team_id, qr_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7, gen_random_uuid()::text)
      `, [
        u.id, u.email, u.name, u.role,
        trainerId,
        sprite, teamId
      ]);
    }
    console.log(`  ✅ ${createdUsers.length} profiles created.\n`);

    // Step 6: Set team leaders
    console.log("=== SETTING TEAM LEADERS ===");
    const trainer1 = createdUsers.find(u => u.email === 'trainer1@bitnbuild.com');
    const trainer4 = createdUsers.find(u => u.email === 'trainer4@bitnbuild.com');
    const trainer7 = createdUsers.find(u => u.email === 'trainer7@bitnbuild.com');
    if (trainer1) await client.query(`UPDATE teams SET leader_id = $1 WHERE team_code = 'TEAM-001'`, [trainer1.id]);
    if (trainer4) await client.query(`UPDATE teams SET leader_id = $1 WHERE team_code = 'TEAM-002'`, [trainer4.id]);
    if (trainer7) await client.query(`UPDATE teams SET leader_id = $1 WHERE team_code = 'TEAM-003'`, [trainer7.id]);
    console.log("  ✅ Leaders assigned.\n");

    // Step 7: Problem statements, rounds, rooms, announcements
    console.log("=== SEEDING REFERENCE DATA ===");
    
    await client.query(`
      INSERT INTO problem_statements (id, title, description, domain, difficulty, pdf_url) VALUES
        (gen_random_uuid(), 'Dragon Vision AI', 'Build a computer-vision assistant for event operations.', 'AI/ML', 'hard', 'https://example.com/dragon-vision.pdf'),
        (gen_random_uuid(), 'Electric Wallet Quest', 'Create a transparent Web3 sponsorship ledger.', 'Web3', 'medium', 'https://example.com/electric-wallet.pdf'),
        (gen_random_uuid(), 'Fairy Care Triage', 'Design a health support triage tool for campuses.', 'HealthTech', 'medium', 'https://example.com/fairy-care.pdf'),
        (gen_random_uuid(), 'Grass Tutor League', 'Make adaptive peer learning for first-year students.', 'EdTech', 'easy', 'https://example.com/grass-tutor.pdf'),
        (gen_random_uuid(), 'Dark Shield SOC', 'Automate incident triage for small security teams.', 'Cybersecurity', 'hard', 'https://example.com/dark-shield.pdf')
      ON CONFLICT DO NOTHING
    `);

    await client.query(`
      INSERT INTO rounds (id, name, round_number, start_time, end_time, is_active, is_published, scoring_criteria) VALUES
        (gen_random_uuid(), 'Gym Battle 1 - Bug Badge', 1, NOW() + INTERVAL '1 hour', NOW() + INTERVAL '5 hours', TRUE, TRUE, '[{"name":"Innovation","description":"Novelty and creative approach","max_score":10},{"name":"Execution","description":"Technical completeness","max_score":10},{"name":"Impact","description":"Usefulness for the target audience","max_score":10}]'),
        (gen_random_uuid(), 'Gym Battle 2 - Thunder Badge', 2, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 4 hours', FALSE, FALSE, '[{"name":"Prototype","max_score":20},{"name":"Pitch","max_score":10}]'),
        (gen_random_uuid(), 'Pokemon League Finals', 3, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours', FALSE, FALSE, '[{"name":"Product","max_score":20},{"name":"Scale","max_score":10},{"name":"Demo","max_score":20}]')
      ON CONFLICT DO NOTHING
    `);

    await client.query(`
      INSERT INTO rooms (name, capacity, location, domain) VALUES
        ('Cerulean Gym - Room 1', 8, 'Block A', 'AI/ML'),
        ('Vermilion Gym - Room 2', 8, 'Block A', 'Web3'),
        ('Celadon Gym - Room 3', 10, 'Block B', 'HealthTech'),
        ('Saffron Gym - Room 4', 12, 'Block B', 'EdTech'),
        ('Viridian Gym - Main Arena', 30, 'Auditorium', NULL)
      ON CONFLICT DO NOTHING
    `);

    const adminUser = createdUsers.find(u => u.email === 'admin@bitnbuild.com');
    await client.query(`
      INSERT INTO announcements (title, body, target_role, created_by) VALUES
        ('Welcome to BITNBUILD', 'Check in, meet your team, and prepare for Gym Battle 1.', 'all', $1),
        ('Judges Briefing', 'Gym Leaders, please review the scoring criteria before your first slot.', 'judge', $1),
        ('Problem Statement Window Open', 'Team leaders can now select one Gym Badge challenge.', 'participant', $1)
    `, [adminUser.id]);

    console.log("  ✅ Problem statements, rounds, rooms, announcements created.\n");

    // Final verification: try to query exactly like GoTrue does
    console.log("=== FINAL VERIFICATION ===");
    const verify = await client.query(`
      SELECT u.id, u.email, u.email_confirmed_at IS NOT NULL as confirmed,
             i.provider_id, i.provider,
             (i.identity_data->>'email_verified')::text as email_verified
      FROM auth.users u
      JOIN auth.identities i ON i.user_id = u.id
      WHERE u.email = 'admin@bitnbuild.com'
    `);
    verify.rows.forEach(r => {
      console.log(`  Admin: id=${r.id} confirmed=${r.confirmed} provider_id=${r.provider_id} email_verified=${r.email_verified}`);
    });

    console.log("\n🎉 Database seeded successfully! Try logging in with admin@bitnbuild.com / Admin@1234");

  } catch (err) {
    console.error("Error:", err.message);
    console.error(err.stack);
  } finally {
    await client.end();
  }
}

run();
