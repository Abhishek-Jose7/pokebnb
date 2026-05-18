"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function AnnouncementComposer() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("League broadcast:");
  const [targetRole, setTargetRole] = useState("all");

  async function submit(sendEmail: boolean) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("announcements").insert({ title, body, target_role: targetRole, created_by: user?.id }).select().single();
    if (error || !data) {
      toast.error("Could not post broadcast", { description: error?.message });
      return;
    }
    if (sendEmail) await fetch("/api/announcements/send-email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ announcement_id: data.id }) });
    toast.success("Broadcast posted");
    setTitle("");
    setBody("");
  }

  return (
    <div className="grid gap-4">
      <Input placeholder="Broadcast title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <select value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className="min-h-12 rounded-md border border-border bg-slate-950/40 px-3">
        <option value="all">All</option>
        <option value="participant">Participants</option>
        <option value="judge">Judges</option>
        <option value="mentor">Mentors</option>
      </select>
      <div data-color-mode="dark"><MDEditor value={body} onChange={(value) => setBody(value ?? "")} /></div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => submit(false)}>Post</Button>
        <Button variant="secondary" onClick={() => submit(true)}>Send Email Broadcast</Button>
      </div>
    </div>
  );
}
