import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createQrPayload, newQrToken, qrDataUrl } from "@/lib/utils/qr";

export async function POST(request: Request) {
  const body = (await request.json()) as { user_id?: string };
  if (!body.user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  const supabase = createServiceClient();
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", body.user_id).maybeSingle();
  if (error || !profile) return NextResponse.json({ error: error?.message ?? "Trainer not found" }, { status: 404 });
  const qr_token = profile.qr_token ?? newQrToken();
  const updated = { ...profile, qr_token };
  if (!profile.qr_token) await supabase.from("profiles").update({ qr_token }).eq("id", profile.id);
  const qr_image_base64 = await qrDataUrl(createQrPayload(updated));
  return NextResponse.json({ qr_image_base64, qr_token });
}
