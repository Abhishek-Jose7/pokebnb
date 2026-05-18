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
      className="fixed left-1/2 top-5 z-50 flex h-16 -translate-x-1/2 items-center justify-center"
      onMouseEnter={resetTimer}
      onMouseMove={resetTimer}
      onMouseLeave={resetTimer}
    >
      {/* Navbar Links container */}
      <nav 
        className={`absolute flex h-12 items-center justify-center gap-4 border-y border-white/10 bg-black/20 backdrop-blur-md px-6 shadow-xl transition-all duration-400 ease-in-out ${isOpen ? "w-[700px] opacity-100" : "w-0 overflow-hidden opacity-0 px-0 border-0"}`}
      >
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={closeNavbar} className="whitespace-nowrap font-sans text-sm font-bold text-white transition hover:text-poke-yellow">
            {label}
          </a>
        ))}
        <Link href="/login" onClick={closeNavbar} className="whitespace-nowrap rounded-full bg-poke-yellow px-4 py-1.5 font-sans text-sm font-bold text-slate-950 transition hover:bg-yellow-400">
          Dashboard
        </Link>
      </nav>

      {/* Pokeball parts wrapper */}
      <div className="relative flex h-12 w-12 items-center justify-center">
        
        {/* Left half container */}
        <button
          onClick={handleToggle}
          className={`absolute left-0 z-10 flex h-12 w-6 overflow-hidden transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? "-translate-x-[350px]" : "translate-x-0"}`}
        >
          {/* Inner image spins */}
          <div className={`absolute left-0 h-12 w-12 shrink-0 rounded-full bg-[url('/pokeball.jpg')] bg-cover bg-center transition-transform duration-400 ease-in-out ${isRotated ? "rotate-90" : "rotate-0"}`} />
        </button>

        {/* Right half container */}
        <button
          onClick={handleToggle}
          className={`absolute right-0 z-10 flex h-12 w-6 overflow-hidden transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? "translate-x-[350px]" : "translate-x-0"}`}
        >
          {/* Inner image spins */}
          <div className={`absolute right-0 h-12 w-12 shrink-0 rounded-full bg-[url('/pokeball.jpg')] bg-cover bg-center transition-transform duration-400 ease-in-out ${isRotated ? "rotate-90" : "rotate-0"}`} />
        </button>
      </div>
    </div>
  );
}
