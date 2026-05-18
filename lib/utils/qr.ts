import QRCode from "qrcode";

export function createQrPayload(user: { id: string; qr_token: string | null; trainer_id: string | null }) {
  return JSON.stringify({
    user_id: user.id,
    qr_token: user.qr_token,
    trainer_id: user.trainer_id,
  });
}

export function newQrToken() {
  return crypto.randomUUID();
}

export async function qrDataUrl(payload: string) {
  return QRCode.toDataURL(payload, {
    width: 512,
    margin: 2,
    color: {
      dark: "#2D2D2D",
      light: "#FFFFFF",
    },
  });
}
