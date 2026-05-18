import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { emailFrom, getResend } from "@/lib/utils/email";

export async function POST(request: Request) {
  const { announcement_id } = (await request.json()) as { announcement_id?: string };
  if (!announcement_id) return NextResponse.json({ error: "announcement_id is required" }, { status: 400 });
  const supabase = createServiceClient();
  const { data: announcement } = await supabase.from("announcements").select("*").eq("id", announcement_id).maybeSingle();
  if (!announcement) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  let query = supabase.from("profiles").select("email,full_name");
  if (announcement.target_role !== "all") query = query.eq("role", announcement.target_role);
  const { data: users } = await query;
  const resend = getResend();
  if (resend && users?.length) {
    for (let i = 0; i < users.length; i += 100) {
      await resend.batch.send(users.slice(i, i + 100).map((user) => ({
        from: emailFrom(),
        to: user.email,
        subject: `[BITNBUILD] ${announcement.title}`,
        html: `<h1>${announcement.title}</h1><div>${announcement.body}</div>`,
      })));
    }
  }
  await supabase.from("announcements").update({ is_email_sent: true, sent_at: new Date().toISOString() }).eq("id", announcement.id);
  await supabase.from("audit_logs").insert({ action: "announcement.send", entity_type: "announcement", entity_id: announcement.id, metadata: { recipients: users?.length ?? 0 } });
  return NextResponse.json({ success: true, recipients: users?.length ?? 0, dry_run: !resend });
}
