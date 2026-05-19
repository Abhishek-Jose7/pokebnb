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

      <div className="absolute left-4 top-24 z-10 flex max-w-4xl flex-col items-start gap-6 sm:left-8 sm:top-28 lg:left-14">
        <Image
          src="/logo.jpg"
          alt="BITNBUILD Logo"
          width={760}
          height={240}
          className="h-auto w-[min(88vw,760px)] rounded-lg object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,.9)]"
          priority
        />
        <a
          href="https://unstop.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-10 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-poke-black bg-poke-yellow px-7 py-2 text-lg font-black uppercase tracking-wide text-slate-950 shadow-[0_7px_0_rgba(0,0,0,.42)] transition hover:-translate-y-1 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-white/70 sm:ml-24 sm:min-h-12 sm:px-9 sm:text-xl lg:ml-40"
        >
          Register
        </a>
      </div>

      <div className="absolute bottom-[14%] left-1/2 z-10 -translate-x-[70%] sm:bottom-[15%] md:-translate-x-[80%]">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png"
          alt="Greninja guide"
          width={160}
          height={160}
          className="h-28 w-28 object-contain drop-shadow-[0_10px_26px_rgba(0,0,0,.7)] sm:h-36 sm:w-36 md:h-44 md:w-44"
        />
      </div>
    </section>
  );
}
