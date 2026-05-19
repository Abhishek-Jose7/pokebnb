"use client";

import { useEffect, useRef, useState } from "react";

export function CutscenePreloader() {
  const [phase, setPhase] = useState<"intro" | "flash" | "done">("intro");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (phase !== "flash") return;
    const flash = window.setTimeout(() => {
      setPhase("done");
      window.dispatchEvent(new Event("preloader-done"));
    }, 620);
    return () => window.clearTimeout(flash);
  }, [phase]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => undefined);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 grid place-items-center transition-opacity duration-300 ${phase === "flash" ? "bg-white" : "bg-black"}`}
    >
      {phase === "intro" ? (
        <>
        <div className="flex h-full w-full items-center justify-center bg-black">
          <video
            ref={videoRef}
            className="h-full w-full scale-[1.1] sm:scale-125 object-contain"
            src="/bitnbuild-cutscene.mp4"
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={() => setPhase("flash")}
            onError={() => setPhase("flash")}
          />
        </div>
          <button
            className="absolute bottom-6 right-6 rounded-md border border-white/30 bg-black/60 px-5 py-3 text-lg font-bold text-white backdrop-blur"
            onClick={() => setPhase("flash")}
            type="button"
          >
            Skip intro
          </button>
        </>
      ) : null}
    </div>
  );
}
