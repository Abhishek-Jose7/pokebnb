"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const links = [
  ["About", "#about"],
  ["Domains", "#domains"],
  ["Timeline", "#timeline"],
  ["Prizes", "#prizes"],
  ["Sponsors", "#sponsors"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
];

export function LandingNavbar() {
  const [phase, setPhase] = useState<"hidden" | "idle" | "spinning-open" | "open" | "closing" | "spinning-closed">("hidden");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleDone = () => setPhase("idle");
    window.addEventListener("preloader-done", handleDone);
    const fallback = setTimeout(handleDone, 4000); // 4 seconds max
    return () => {
      window.removeEventListener("preloader-done", handleDone);
      clearTimeout(fallback);
    };
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (phase === "open") {
      timeoutRef.current = window.setTimeout(() => {
        closeNavbar();
      }, 5000);
    }
  }, [phase]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetTimer]);

  if (phase === "hidden") return null;

  const isOpen = phase === "open";
  // The image should be rotated if it's spinning open, fully open, or closing (but not yet spinning closed).
  const isRotated = phase === "spinning-open" || phase === "open" || phase === "closing";
  
  const openNavbar = () => {
    setPhase("spinning-open");
    setTimeout(() => {
      setPhase("open");
    }, 400); // Wait for spin to finish before splitting
  };

  const closeNavbar = () => {
    setPhase("closing");
    setTimeout(() => {
      setPhase("spinning-closed");
      setTimeout(() => {
        setPhase("idle");
      }, 400); // Wait for un-spin to finish
    }, 700); // Wait for merge to finish (duration-700) before un-spinning
  };

  const handleToggle = () => {
    if (phase === "idle") {
      openNavbar();
    } else if (phase === "open") {
      closeNavbar();
    }
  };

  return (
    <div
      className="fixed left-1/2 top-4 z-50 flex min-h-16 w-[min(94vw,820px)] -translate-x-1/2 items-center justify-center md:w-[900px]"
      onMouseEnter={resetTimer}
      onMouseMove={resetTimer}
      onMouseLeave={resetTimer}
    >
      {/* Navbar Links container */}
      <nav 
        className={`absolute flex max-h-[70vh] min-h-10 w-[92vw] flex-wrap items-center justify-center gap-2 overflow-y-auto rounded-3xl border-y border-white/10 bg-black/45 px-10 py-2 shadow-xl backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-10 md:w-[800px] md:max-w-none md:flex-nowrap md:justify-around md:overflow-hidden md:rounded-full md:bg-black/30 md:px-12 md:py-0 ${isOpen ? "scale-100 opacity-100 md:w-[800px]" : "pointer-events-none scale-x-0 overflow-hidden opacity-0 px-0 border-0 md:w-0"}`}
      >
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={closeNavbar} className="min-h-8 whitespace-nowrap rounded-full px-2 py-1 font-sans text-xs font-bold text-white transition hover:bg-white/10 hover:text-poke-yellow focus:outline-none md:min-h-0 md:rounded-none md:px-0 md:py-0 md:text-sm">
            {label}
          </a>
        ))}
        <Link href="/login" onClick={closeNavbar} className="inline-flex min-h-8 items-center whitespace-nowrap rounded-full bg-poke-yellow px-4 py-1 font-sans text-xs font-bold text-slate-950 transition hover:bg-yellow-400 focus:outline-none md:ml-4 md:text-sm">
          Dashboard
        </Link>
      </nav>

      {/* Pokeball parts wrapper */}
      <div className="relative flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
        
        {/* Left half container */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className={`absolute left-0 z-10 flex h-10 w-5 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none md:h-12 md:w-6 ${isOpen ? "-translate-x-[46vw] md:-translate-x-[400px]" : "translate-x-0"}`}
        >
          {/* Inner image */}
          <div className={`absolute left-0 h-10 w-10 shrink-0 rounded-full bg-[url('/pokeball.jpg')] bg-cover bg-center md:h-12 md:w-12 transition-transform duration-400 ease-in-out ${isRotated ? "rotate-90" : "rotate-0"}`} />
        </button>

        {/* Right half container */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className={`absolute right-0 z-10 flex h-10 w-5 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none md:h-12 md:w-6 ${isOpen ? "translate-x-[46vw] md:translate-x-[400px]" : "translate-x-0"}`}
        >
          {/* Inner image */}
          <div className={`absolute right-0 h-10 w-10 shrink-0 rounded-full bg-[url('/pokeball.jpg')] bg-cover bg-center md:h-12 md:w-12 transition-transform duration-400 ease-in-out ${isRotated ? "rotate-90" : "rotate-0"}`} />
        </button>
      </div>
    </div>
  );
}
