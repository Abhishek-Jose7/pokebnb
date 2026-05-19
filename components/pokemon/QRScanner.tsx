"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function QRScanner({ onScan, onError }: { onScan: (text: string) => void, onError?: (err: string) => void }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setHasPermission(true);
        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            onScan(decodedText);
            // Optionally pause or stop here
          },
          (errorMessage) => {
            onError?.(errorMessage);
          }
        ).catch((err) => {
          console.error("QR Code scanning failed", err);
          setHasPermission(false);
        });
      } else {
        setHasPermission(false);
      }
    }).catch(err => {
      console.error(err);
      setHasPermission(false);
    });

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan, onError]);

  if (hasPermission === false) {
    return <div className="text-red-500 font-bold p-4 text-center">Camera permission denied or no camera found.</div>;
  }

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border-4 border-poke-black bg-black">
      <div id="reader" className="w-full h-[300px]" />
    </div>
  );
}
