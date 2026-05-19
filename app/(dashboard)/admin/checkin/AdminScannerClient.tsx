"use client";

import { QRScanner } from "@/components/admin/QRScanner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AdminScannerClient() {
  async function mark(profile: { id: string; full_name: string } | null | undefined, type: string) {
    if (!profile) return;
    const res = await fetch("/api/admin/checkin-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: profile.id, type }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error("Check-in blocked", { description: json.error ?? "Try again" });
      return;
    }
    toast.success("Logged", { description: `${profile.full_name} - ${type}` });
  }

  return (
    <QRScanner 
      renderActions={(profile) => (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {["Attendance", "Breakfast", "Lunch", "Dinner", "Snacks"].map((label) => (
            <Button key={label} variant="secondary" onClick={() => mark(profile, label.toLowerCase())}>
              {label}
            </Button>
          ))}
        </div>
      )}
    />
  );
}
