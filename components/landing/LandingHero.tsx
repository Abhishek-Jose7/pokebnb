"use client";

import Image from "next/image";

export function LandingHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black px-4 py-28">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="BitnBuild hero scene"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/82 via-black/18 to-black/50" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fly {
          0% { transform: translateX(-20vw) translateY(0) scaleX(-1); }
          45% { transform: translateX(120vw) translateY(-10vh) scaleX(-1); }
          50% { transform: translateX(120vw) translateY(-10vh) scaleX(1); }
          95% { transform: translateX(-20vw) translateY(10vh) scaleX(1); }
          100% { transform: translateX(-20vw) translateY(0) scaleX(-1); }
        }
        .animate-fly {
          animation: fly 35s linear infinite;
        }
      `}} />

      {/* Ho-Oh flying animation */}
      <div className="absolute top-[10%] left-0 z-20 animate-fly">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/250.gif"
          alt="Ho-Oh"
          width={100}
          height={100}
          className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] opacity-60 w-24 h-24 sm:w-32 sm:h-32"
          unoptimized
        />
      </div>

      {/* Logo — centered vertically in the middle-upper area */}
      <div className="absolute left-1/2 top-[35%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 w-full px-2">
        <Image
          src="/logo.jpg"
          alt="BITNBUILD Logo"
          width={760}
          height={240}
          className="h-auto w-[96vw] max-w-[760px] rounded-lg object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,.9)] sm:w-[88vw]"
          priority
        />
      </div>

      {/* Greninja guide sprite */}
      <div className="absolute bottom-[14%] left-1/2 z-10 -translate-x-[70%] sm:bottom-[15%] md:-translate-x-[80%]">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png"
          alt="Greninja guide"
          width={160}
          height={160}
          className="h-28 w-28 object-contain drop-shadow-[0_10px_26px_rgba(0,0,0,.7)] sm:h-36 sm:w-36 md:h-44 md:w-44"
        />
      </div>

      {/* Register button — bottom center */}
      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
        <a
          href="https://unstop.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-full border-[3px] border-poke-black bg-poke-yellow px-8 py-2 font-display text-lg font-black uppercase tracking-wider text-slate-950 shadow-[0_5px_0_rgba(0,0,0,.42)] transition hover:-translate-y-1 hover:bg-yellow-300 focus:outline-none sm:min-h-14 sm:px-14 sm:py-3 sm:text-2xl sm:shadow-[0_7px_0_rgba(0,0,0,.42)]"
        >
          Register Now
        </a>
      </div>
    </section>
  );
}
