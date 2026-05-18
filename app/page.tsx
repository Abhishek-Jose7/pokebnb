import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/landing/Countdown";
import { CutscenePreloader } from "@/components/landing/CutscenePreloader";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { PokemonCenterFAQ } from "@/components/landing/PokemonCenterFAQ";
import { RouteTimeline } from "@/components/landing/RouteTimeline";

const domains = [
  ["Web/App Dev", "Bulbasaur", "Build useful web and mobile products that people can actually use.", "/images/bulbasaur.png", "from-green-500/25"],
  ["Blockchain", "Charmander", "Create transparent, trust-first systems for ownership, identity, and exchange.", "/images/charmander.png", "from-orange-500/25"],
  ["AI/ML", "Squirtle", "Train smart tools for automation, insight, prediction, and creative workflows.", "/images/squirtle.png", "from-sky-500/25"],
];

export default function HomePage() {
  const eventStart = process.env.NEXT_PUBLIC_EVENT_START ?? "2026-09-01T09:00:00+05:30";

  return (
    <>
      <CutscenePreloader />
      <LandingNavbar />
      <main className="overflow-hidden text-xl sm:text-2xl">
        <section className="relative min-h-[92vh] border-b border-white/10 pt-16">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,203,5,.20),transparent_28rem),radial-gradient(circle_at_18%_70%,rgba(204,0,0,.28),transparent_24rem),linear-gradient(135deg,#08111b_0%,#102536_54%,#05080d_100%)]" />
          <div className="relative mx-auto grid min-h-[calc(92vh-4rem)] max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="max-w-4xl">
              <p className="mb-5 font-mono text-xl uppercase tracking-[0.28em] text-poke-yellow">Game starts soon</p>
              <h1 className="font-display text-7xl leading-tight text-white sm:text-8xl lg:text-9xl">BITNBUILD</h1>
              <p className="mt-7 max-w-3xl text-2xl leading-10 text-slate-200">
                A high-energy hackathon where teams enter as trainers, challenges become badges, and every demo is a Gym Battle.
              </p>
              <div className="mt-8 max-w-xl"><Countdown targetIso={eventStart} /></div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="inline-flex min-h-14 items-center rounded-md bg-poke-yellow px-7 text-xl font-black text-slate-950">Register Interest</a>
                <Link href="/login" className="inline-flex min-h-14 items-center rounded-md border border-white/20 bg-white/10 px-7 text-xl font-black text-white backdrop-blur hover:border-poke-yellow">Enter Dashboard</Link>
              </div>
            </div>
            <div className="relative min-h-[360px] lg:min-h-[560px]" aria-hidden="true">
              <div className="absolute left-4 top-10 h-56 w-56 rounded-full border-[18px] border-poke-black bg-[linear-gradient(to_bottom,#cc0000_0_48%,#2d2d2d_48%_54%,#fff_54%_100%)] shadow-2xl shadow-red-950/40 sm:h-72 sm:w-72" />
              <div className="absolute left-28 top-24 h-20 w-20 rounded-full border-[14px] border-poke-black bg-white sm:left-40 sm:top-36" />
              <Image className="absolute bottom-8 left-0 drop-shadow-[0_22px_24px_rgba(0,0,0,.45)]" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="" width={180} height={180} priority />
              <Image className="absolute right-10 top-4 drop-shadow-[0_22px_24px_rgba(0,0,0,.45)]" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" alt="" width={190} height={190} priority />
              <Image className="absolute bottom-0 right-4 drop-shadow-[0_22px_24px_rgba(0,0,0,.45)]" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" alt="" width={210} height={210} priority />
              <div className="absolute bottom-4 left-8 right-8 rounded-md border border-white/15 bg-slate-950/50 p-4 backdrop-blur">
                <p className="font-mono text-lg text-poke-yellow">Next unlock</p>
                <p className="font-display text-lg leading-8 text-white">Gym Badge Challenges</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#f8fbff] px-4 py-32 text-slate-950 sm:px-6">
          <div className="mx-auto grid max-w-[90rem] items-center gap-16 lg:grid-cols-[1fr_1fr]">
            <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
              <Image
                src="/images/worldmap.png.png"
                alt="Global BITNBUILD map"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain p-6"
              />
            </div>
            <div>
              <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-red">About Us</p>
              <h2 className="mt-4 font-display text-6xl leading-tight text-poke-blue lg:text-7xl">ABOUT US</h2>
              <div className="mt-8 grid gap-6 text-3xl leading-relaxed text-slate-700">
                <p>Welcome to BitnBuild 2025, a global hackathon in Mumbai! A 24-hour event full of creativity, innovation, and endless possibilities.</p>
                <p>BitnBuild is your chance to shine as a developer, designer, or innovator. Are you ready to compete with the best and unlock your potential?</p>
              </div>
            </div>
          </div>
        </section>

        <section id="domains" className="bg-[#101b27] px-4 py-28 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">Domains</p>
            <h2 className="mt-4 font-display text-5xl leading-tight lg:text-6xl">Choose your starter.</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {domains.map(([name, starter, copy, image, glow]) => (
                <article key={name} className={`rounded-lg border border-white/10 bg-gradient-to-b ${glow} to-white/[0.06] p-7 text-center`}>
                  <div className="mx-auto grid h-56 place-items-center">
                    <Image
                      src={image}
                      alt={`${starter} starter for ${name}`}
                      width={starter === "Charmander" ? 300 : 190}
                      height={starter === "Charmander" ? 300 : 190}
                      className={`${starter === "Charmander" ? "max-h-72" : "max-h-48"} w-auto object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,.35)]`}
                    />
                  </div>
                  <p className="font-mono text-lg uppercase tracking-[0.18em] text-poke-yellow">Choose your starter</p>
                  <h3 className="mt-4 text-4xl font-black text-white">{name}</h3>
                  <p className="mt-3 text-xl leading-8 text-slate-300">{copy}</p>
                  <p className="mt-5 text-2xl font-black text-poke-yellow">{starter}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RouteTimeline />

        <section id="prizes" className="bg-[#0e1722] px-4 py-28 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">Prizes</p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {["Champion Cup", "Elite Four Track Awards", "Mentor's Choice"].map((prize, index) => (
                <article key={prize} className="rounded-lg border border-white/10 bg-white/[0.06] p-7">
                  <p className="font-mono text-5xl text-poke-yellow">0{index + 1}</p>
                  <h3 className="mt-6 text-3xl font-black">{prize}</h3>
                  <p className="mt-3 text-xl leading-8 text-slate-300">Cash, credits, swag, and fast-track opportunities announced by the organizing team.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="sponsors" className="bg-white px-4 py-28 text-slate-950 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-red">Sponsors</p>
            <h2 className="mt-4 font-display text-5xl leading-tight text-poke-blue lg:text-6xl">Powered by partners who back builders.</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Title Partner", "Cloud Partner", "Community Partner", "Swag Partner"].map((sponsor) => (
                <div key={sponsor} className="grid h-36 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-2xl font-black text-slate-500">{sponsor}</div>
              ))}
            </div>
          </div>
        </section>

        <PokemonCenterFAQ />

        <section id="contact" className="bg-poke-red px-4 py-28 text-white sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.8fr]">
            <div>
              <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">Contact</p>
              <h2 className="mt-4 font-display text-5xl leading-tight lg:text-6xl">Ready to enter BITNBUILD?</h2>
              <p className="mt-5 max-w-2xl text-2xl leading-9 text-red-50">Register interest, sponsor a track, or ask the organizing team for venue and team formation details.</p>
            </div>
            <div className="rounded-lg border-4 border-poke-black bg-[#101b27] p-7 text-xl">
              <p className="text-3xl font-black text-poke-yellow">Organizer Desk</p>
              <p className="mt-4">Email: {process.env.NEXT_PUBLIC_ORGANIZER_EMAIL ?? "organizer@example.com"}</p>
              <p>Phone: {process.env.NEXT_PUBLIC_ORGANIZER_PHONE ?? "+91-XXXXXXXXXX"}</p>
              <Link href="/login" className="mt-6 inline-flex min-h-14 items-center rounded-md bg-poke-yellow px-7 text-xl font-black text-slate-950">Dashboard Login</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
