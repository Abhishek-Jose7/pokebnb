const { Client } = require("pg");

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // 1. Check what users exist
    const users = await client.query(`
      SELECT id, email, email_confirmed_at, 
             encrypted_password IS NOT NULL as has_password,
             raw_app_meta_data
      FROM auth.users 
      WHERE email LIKE '%@bitnbuild.com'
      ORDER BY email
    `);
    console.log("\n=== AUTH USERS ===");
    users.rows.forEach(u => {
      console.log(`  ${u.email} | id: ${u.id} | confirmed: ${u.email_confirmed_at ? 'YES' : 'NO'} | pw: ${u.has_password}`);
    });

    // 2. Check identities
    const identities = await client.query(`
      SELECT i.id, i.user_id, i.provider_id, i.provider,
             i.identity_data->>'email' as identity_email
      FROM auth.identities i
      JOIN auth.users u ON u.id = i.user_id
      WHERE u.email LIKE '%@bitnbuild.com'
      ORDER BY identity_email
    `);
    console.log("\n=== AUTH IDENTITIES ===");
    identities.rows.forEach(i => {
      console.log(`  ${i.identity_email} | provider_id: ${i.provider_id} | provider: ${i.provider} | user_id: ${i.user_id}`);
    });

    // 3. Check for common problems
    console.log("\n=== DIAGNOSTICS ===");
    
    // Check: provider_id should equal the user's id (as string) for email provider
    const mismatch = await client.query(`
      SELECT u.email, u.id as user_id, i.provider_id
      FROM auth.users u
      LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
      WHERE u.email LIKE '%@bitnbuild.com'
        AND (i.id IS NULL OR i.provider_id != u.id::text)
    `);
    
    if (mismatch.rowCount > 0) {
      console.log("  ⚠ Found users with missing or mismatched identities:");
      mismatch.rows.forEach(m => {
        console.log(`    ${m.email} | user_id: ${m.user_id} | provider_id: ${m.provider_id || 'MISSING'}`);
      });
      
      // FIX: delete and recreate identities with correct provider_id
      console.log("\n  🔧 Fixing identities...");
      await client.query(`
        DELETE FROM auth.identities 
        WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@bitnbuild.com')
      `);
      
      await client.query(`
        INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        SELECT 
          gen_random_uuid(),
          id,
          id::text,
          jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true, 'phone_verified', false),
          'email',
          NOW(),
          NOW(),
          NOW()
        FROM auth.users
        WHERE email LIKE '%@bitnbuild.com'
      `);
      console.log("  ✅ Identities recreated with correct provider_id mapping.");
    } else {
      console.log("  ✅ All identities look correct.");
    }

    // 4. Ensure email_confirmed_at is set
    const unconfirmed = await client.query(`
      UPDATE auth.users 
      SET email_confirmed_at = NOW(),
          confirmation_token = '',
          recovery_token = '',
          is_sso_user = false,
          raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', '["email"]'::jsonb)
      WHERE email LIKE '%@bitnbuild.com' 
        AND (email_confirmed_at IS NULL OR raw_app_meta_data->>'provider' IS NULL)
      RETURNING email
    `);
    if (unconfirmed.rowCount > 0) {
      console.log(`  🔧 Fixed ${unconfirmed.rowCount} unconfirmed/incomplete users:`);
      unconfirmed.rows.forEach(r => console.log(`    ${r.email}`));
    }

    // 5. Verify final state
    console.log("\n=== FINAL VERIFICATION ===");
    const verification = await client.query(`
      SELECT u.email, u.id, 
             u.email_confirmed_at IS NOT NULL as confirmed,
             i.provider_id = u.id::text as identity_ok,
             u.encrypted_password IS NOT NULL as has_pw
      FROM auth.users u
      LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
      WHERE u.email LIKE '%@bitnbuild.com'
      ORDER BY u.email
      LIMIT 5
    `);
    verification.rows.forEach(v => {
      const status = (v.confirmed && v.identity_ok && v.has_pw) ? '✅' : '❌';
      console.log(`  ${status} ${v.email} | confirmed: ${v.confirmed} | identity_ok: ${v.identity_ok} | has_pw: ${v.has_pw}`);
    });

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
