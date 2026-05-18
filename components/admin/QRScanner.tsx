"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function QRScanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState<string>("");

  useEffect(() => {
    if (!ref.current) return;
    const scanner = new Html5QrcodeScanner("bitnbuild-scanner", { fps: 10, qrbox: { width: 280, height: 280 } }, false);
    scanner.render((decodedText) => {
      setLast(decodedText);
      toast.success("Trainer QR found");
    }, () => undefined);
    return () => {
      void scanner.clear();
    };
  }, []);

  return (
    <div className="grid gap-4">
      <div id="bitnbuild-scanner" ref={ref} className="overflow-hidden rounded-lg border border-border bg-slate-950/40" />
      {last ? <pre className="overflow-auto rounded-md bg-slate-950/60 p-3 text-xs">{last}</pre> : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {["Attendance", "Breakfast", "Lunch", "Dinner", "Snacks"].map((label) => <Button key={label} variant="secondary">{label}</Button>)}
      </div>
    </div>
  );
}
