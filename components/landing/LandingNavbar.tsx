"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center justify-center">
        {/* Navbar Links container - revealed when open */}
        <nav 
          className={`absolute flex items-center justify-center gap-4 rounded-full border-4 border-poke-black bg-white px-6 py-2 shadow-xl transition-all duration-[600ms] ${open ? "max-w-[1000px] opacity-100" : "max-w-0 overflow-hidden opacity-0 px-0 border-0"}`}
        >
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="whitespace-nowrap text-lg font-bold text-slate-800 transition hover:text-poke-red">
              {label}
            </a>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="whitespace-nowrap rounded-full bg-poke-yellow px-5 py-2 text-lg font-bold text-slate-950 transition hover:bg-yellow-400">
            Dashboard
          </Link>
        </nav>

        {/* Left Hemisphere */}
        <button
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`absolute left-1/2 flex h-20 w-10 origin-right -translate-x-full overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 ${open ? "-translate-x-[450px] opacity-0" : ""}`}
        >
          <div className="h-20 w-20 rounded-full border-[6px] border-poke-black bg-[linear-gradient(to_bottom,#cc0000_0_46%,#2d2d2d_46%_54%,#fff_54%_100%)] shadow-2xl">
            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-poke-black bg-white" />
          </div>
        </button>

        {/* Right Hemisphere */}
        <button
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`absolute right-1/2 flex h-20 w-10 origin-left translate-x-full overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 ${open ? "translate-x-[450px] opacity-0" : ""}`}
        >
          <div className="h-20 w-20 -translate-x-1/2 rounded-full border-[6px] border-poke-black bg-[linear-gradient(to_bottom,#cc0000_0_46%,#2d2d2d_46%_54%,#fff_54%_100%)] shadow-2xl">
            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-poke-black bg-white" />
          </div>
        </button>
      </div>

      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} 
        onClick={() => setOpen(false)} 
      />
    </>
  );
}
