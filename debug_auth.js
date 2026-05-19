async function run() {
  // Direct HTTP call to GoTrue to see the raw error
  const res = await fetch("https://xicniyywucusfushnqqs.supabase.co/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY25peXl3dWN1c2Z1c2hucXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjAwMjksImV4cCI6MjA5NDY5NjAyOX0.hHN2m5YKMT0e8qwv1EAIDOxcvVp7_Lw3YrsceMG0LWU",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: "admin@bitnbuild.com", password: "Admin@1234" })
  });
  const raw = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", raw);
  
  // Also try the health check endpoint
  const health = await fetch("https://xicniyywucusfushnqqs.supabase.co/auth/v1/health", {
    headers: {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY25peXl3dWN1c2Z1c2hucXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjAwMjksImV4cCI6MjA5NDY5NjAyOX0.hHN2m5YKMT0e8qwv1EAIDOxcvVp7_Lw3YrsceMG0LWU"
    }
  });
  const healthText = await health.text();
  console.log("\nHealth:", health.status, healthText);
}
run().catch(console.error);
