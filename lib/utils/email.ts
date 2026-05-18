import { Resend } from "resend";

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function emailFrom() {
  return process.env.EMAIL_FROM ?? "bitnbuild@example.com";
}
