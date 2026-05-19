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
  const [phase, setPhase] = useState<"hidden" | "idle" | "spinning-open" | "open" | "closing">("hidden");
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
      setPhase("idle");
    }, 400); // Wait for merge to finish before un-spinning
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
      className="fixed left-1/2 top-4 z-50 flex min-h-16 w-[min(94vw,820px)] -translate-x-1/2 items-center justify-center md:w-[820px]"
      onMouseEnter={resetTimer}
      onMouseMove={resetTimer}
      onMouseLeave={resetTimer}
    >
      {/* Navbar Links container */}
      <nav 
        className={`absolute flex max-h-[70vh] min-h-14 w-[92vw] flex-wrap items-center justify-center gap-2 overflow-y-auto rounded-3xl border-y border-white/10 bg-black/45 px-10 py-3 shadow-xl backdrop-blur-md transition-all duration-400 ease-in-out md:h-12 md:w-[700px] md:max-w-none md:flex-nowrap md:overflow-hidden md:rounded-none md:bg-black/20 md:px-6 md:py-0 ${isOpen ? "scale-100 opacity-100 md:w-[700px]" : "pointer-events-none scale-x-0 overflow-hidden opacity-0 px-0 border-0 md:w-0"}`}
      >
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={closeNavbar} className="min-h-10 whitespace-nowrap rounded-full px-2 py-2 font-sans text-sm font-bold text-white transition hover:bg-white/10 hover:text-poke-yellow focus:outline-none focus:ring-2 focus:ring-poke-yellow md:min-h-0 md:rounded-none md:px-0 md:py-0">
            {label}
          </a>
        ))}
        <Link href="/login" onClick={closeNavbar} className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full bg-poke-yellow px-4 py-1.5 font-sans text-sm font-bold text-slate-950 transition hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-white">
          Dashboard
        </Link>
      </nav>

      {/* Pokeball parts wrapper */}
      <div className="relative flex h-12 w-12 items-center justify-center">
        
        {/* Left half container */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className={`absolute left-0 z-10 flex h-12 w-6 overflow-hidden transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus:ring-4 focus:ring-poke-yellow/70 ${isOpen ? "-translate-x-[46vw] md:-translate-x-[350px]" : "translate-x-0"}`}
        >
          {/* Inner image spins */}
          <div className={`absolute left-0 h-12 w-12 shrink-0 rounded-full bg-[url('/pokeball.jpg')] bg-cover bg-center transition-transform duration-400 ease-in-out ${isRotated ? "rotate-90" : "rotate-0"}`} />
        </button>

        {/* Right half container */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className={`absolute right-0 z-10 flex h-12 w-6 overflow-hidden transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus:ring-4 focus:ring-poke-yellow/70 ${isOpen ? "translate-x-[46vw] md:translate-x-[350px]" : "translate-x-0"}`}
        >
          {/* Inner image spins */}
          <div className={`absolute right-0 h-12 w-12 shrink-0 rounded-full bg-[url('/pokeball.jpg')] bg-cover bg-center transition-transform duration-400 ease-in-out ${isRotated ? "rotate-90" : "rotate-0"}`} />
        </button>
      </div>
    </div>
  );
}
