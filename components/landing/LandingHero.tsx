"use client";

import Image from "next/image";
import { useState } from "react";

export function LandingHero() {
  const [signOpen, setSignOpen] = useState(false);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="BitnBuild hero scene"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Ambient overlay to darken a bit */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Ambient Music (Requires user to add ambient-night.mp3 in public folder) */}
      <audio autoPlay loop className="hidden">
        <source src="/ambient-night.mp3" type="audio/mpeg" />
      </audio>

      {/* Protagonist Trainer — standing center, facing the path */}
      <div className="absolute bottom-[18%] left-1/2 z-10 -translate-x-[70%] md:-translate-x-[80%]">
         <Image 
           src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png" 
           alt="Trainer protagonist" 
           width={120}
           height={120}
           className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,.7)] md:h-40 md:w-40" 
         />
      </div>

      {/* Signboard */}
      <div 
        className="group absolute bottom-[22%] left-1/2 z-20 translate-x-[10%] cursor-pointer transition-transform hover:scale-110 md:translate-x-[20%]"
        onClick={() => setSignOpen(true)}
      >
        <div className="relative flex h-20 w-24 flex-col items-center justify-end drop-shadow-xl">
          {/* Sign Board */}
          <div className="z-10 flex h-12 w-20 items-center justify-center rounded-sm border-[3px] border-[#3d2314] bg-[#8b5a2b] shadow-inner">
            <div className="h-1 w-10 bg-[#5c3a21] opacity-50" />
          </div>
          {/* Sign Post */}
          <div className="-mt-1 h-8 w-3 bg-[#5c3a21] border-x-2 border-[#3d2314]" />
        </div>
        {!signOpen && (
          <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center animate-bounce opacity-0 transition-opacity group-hover:opacity-100">
            <span className="whitespace-nowrap rounded-md border-2 border-white bg-black/80 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-lg">
              READ
            </span>
            <div className="-mt-1 h-2 w-2 rotate-45 border-b-2 border-r-2 border-white bg-black/80" />
          </div>
        )}
      </div>

      {/* Dialogue Box */}
      {signOpen && (
        <div className="absolute bottom-20 left-1/2 z-50 w-[90%] max-w-2xl -translate-x-1/2 rounded-md border-[4px] border-poke-black bg-[#f8f5eb] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <p className="font-mono text-xs font-bold uppercase text-poke-red">SIGNBOARD:</p>
          <div className="mt-3 font-sans text-lg leading-relaxed text-slate-900 md:text-xl">
            <p>Welcome to <strong>BITNBUILD 2026</strong>!</p>
            <p className="mt-2 text-sm text-slate-600 md:text-base">A high-energy hackathon where teams enter as trainers, challenges become badges, and every demo is a Gym Battle. Your journey is about to begin.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
             <a href="https://unstop.com" target="_blank" rel="noopener noreferrer" className="rounded border-2 border-poke-black bg-poke-yellow px-4 py-2 font-bold text-black hover:bg-yellow-400">
               Register on Unstop
             </a>
             <button 
               onClick={(e) => { e.stopPropagation(); setSignOpen(false); }}
               className="rounded border-2 border-poke-black bg-slate-200 px-4 py-2 font-bold text-black hover:bg-slate-300"
             >
               Close
             </button>
          </div>
          
          {/* Pointer to signboard */}
          <div className="absolute -bottom-[14px] left-[70%] border-l-[14px] border-r-[14px] border-t-[14px] border-l-transparent border-r-transparent border-t-poke-black">
            <div className="absolute -left-[10px] -top-[14px] border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#f8f5eb]" />
          </div>
        </div>
      )}

      {/* Minimal UI: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center animate-bounce opacity-80">
        <span className="mb-2 font-mono text-xs font-bold tracking-widest text-white drop-shadow-md">SCROLL TO START</span>
        <div className="h-4 w-4 rotate-45 border-b-4 border-r-4 border-white drop-shadow-md" />
      </div>
    </section>
  );
}
