import Image from "next/image";
import { CutscenePreloader } from "@/components/landing/CutscenePreloader";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { PokemonCenterFAQ } from "@/components/landing/PokemonCenterFAQ";
import { RouteTimeline } from "@/components/landing/RouteTimeline";
import { Countdown } from "@/components/landing/Countdown";
import { ProfOakDialogue } from "@/components/landing/ProfOakDialogue";

const domains = [
  ["Web/App Dev", "Bulbasaur", "Build useful web and mobile products that people can actually use.", "/images/bulbasaur.png", "from-green-500/25"],
  ["Blockchain", "Charmander", "Create transparent, trust-first systems for ownership, identity, and exchange.", "/images/charmander.png", "from-orange-500/25"],
  ["AI/ML", "Squirtle", "Train smart tools for automation, insight, prediction, and creative workflows.", "/images/squirtle.png", "from-sky-500/25"],
];

const prizes = [
  {
    tier: "LEGENDARY",
    title: "Grand Prize",
    borderFront: "border-[#e0b82f]", // Gold
    borderBack: "border-[#e0b82f]",
    bgFront: "bg-gradient-to-br from-[#e0b82f]/20 to-black",
    bgBack: "bg-gradient-to-br from-[#fffcf2] to-[#fff5d6]",
    imageFront: "/gold.jpg",
    imageBack: "",
    textFront: "text-[#e0b82f]",
    textBack: "text-[#8a6e11]",
    perks: [
      "₹1,00,000 Cash Prize",
      "Guaranteed Internships",
      "Pro Credits & Cloud Access",
      "Exclusive Champion Swag Kit"
    ]
  },
  {
    tier: "EPIC",
    title: "Runner Up",
    borderFront: "border-poke-red",
    borderBack: "border-poke-red",
    bgFront: "bg-gradient-to-br from-poke-red/20 to-black",
    bgBack: "bg-gradient-to-br from-[#fef5f5] to-[#fce8e8]",
    imageFront: "/silver.jpg",
    imageBack: "",
    textFront: "text-poke-red",
    textBack: "text-red-900",
    perks: [
      "₹50,000 Cash Prize",
      "Interview Opportunities",
      "Cloud Credits",
      "Premium Swag Box"
    ]
  },
  {
    tier: "RARE",
    title: "Second Runner Up",
    borderFront: "border-[#cd7f32]", // Bronze
    borderBack: "border-[#cd7f32]",
    bgFront: "bg-gradient-to-br from-[#cd7f32]/20 to-black",
    bgBack: "bg-gradient-to-br from-[#fcf7f3] to-[#faeade]",
    imageFront: "/normal.jpg",
    imageBack: "",
    textFront: "text-[#cd7f32]",
    textBack: "text-[#7a4c1e]",
    perks: [
      "₹25,000 Cash Prize",
      "Community Shoutouts",
      "Sponsor API Credits",
      "Event Swag"
    ]
  }
];

export default function HomePage() {
  return (
    <>
      <CutscenePreloader />
      <LandingNavbar />
      <main className="overflow-hidden text-xl sm:text-2xl">
        <LandingHero />

        {/* Transition image between hero and about — with countdown overlay */}
        <div className="relative w-full overflow-hidden block">
          <Image
            src="/merge.jpg"
            alt="Route Transition"
            width={1920}
            height={600}
            className="w-full h-auto object-contain block"
            priority
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Countdown targetIso="2026-10-25T09:00:00+05:30" />
          </div>
        </div>

        <section id="about" className="relative bg-[url('/oakbg.jpg')] bg-cover bg-center px-4 pt-32 pb-40 text-slate-950 sm:px-6">
          {/* Blend Gradient into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#0f2318]" />

          <div className="relative z-10 mx-auto grid max-w-[80rem] items-center gap-12 lg:grid-cols-[1fr_1fr]">
            {/* Map Area — smaller, shifted right */}
            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg border-[4px] border-poke-black bg-[#e6f0fa]/90 shadow-2xl backdrop-blur order-2 lg:order-1 lg:ml-auto lg:mr-0 lg:translate-x-12">
              <div className="aspect-video relative">
                <Image
                  src="/images/worldmap.png.png"
                  alt="Global BITNBUILD map"
                  fill
                  sizes="(min-width: 1024px) 35vw, 90vw"
                  className="object-contain p-4"
                />
              </div>
            </div>

            {/* Oak's Dialogue Area — dialogue on top, Oak bigger and below */}
            <div className="flex flex-col items-center order-1 lg:order-2 lg:translate-y-12">
              <ProfOakDialogue />
              <Image src="/oak.jpg" alt="Professor Oak" width={480} height={720} className="object-contain drop-shadow-xl" />
            </div>
          </div>
        </section>

        <section id="domains" className="bg-[#0f2318] px-4 py-28 sm:px-6">
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

        <section id="prizes" className="relative overflow-hidden bg-gradient-to-b from-[#081f20] via-[#0b1b1f] to-[#0e1722] px-4 py-28 sm:px-6">
          <Image
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png"
            alt=""
            width={360}
            height={360}
            className="pointer-events-none absolute -right-20 top-20 h-52 w-52 rotate-6 object-contain opacity-35 blur-[1px] sm:h-72 sm:w-72 lg:right-4 lg:opacity-55 lg:blur-0"
          />
          <Image
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
            alt=""
            width={320}
            height={320}
            className="pointer-events-none absolute -left-16 top-[36%] h-48 w-48 -rotate-12 object-contain opacity-35 blur-[1px] sm:h-64 sm:w-64 lg:left-4 lg:opacity-50 lg:blur-0"
          />
          <Image
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
            alt=""
            width={300}
            height={300}
            className="pointer-events-none absolute bottom-16 right-4 h-44 w-44 object-contain opacity-30 sm:h-56 sm:w-56 lg:opacity-45"
          />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-center font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">Prizes</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-5xl leading-tight text-white lg:text-6xl">Champion Rewards Await.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-xl leading-8 text-slate-300">Flip each reward tile to reveal the loot waiting at the end of the route.</p>

            {/* LEGENDARY — centered top, larger, glowing */}
            <div className="mt-10 flex justify-center">
              <div tabIndex={0} className="group h-[540px] w-full max-w-md cursor-pointer [perspective:1000px] focus:outline-none">
                <div className="relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
                  <Image
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                    alt=""
                    width={120}
                    height={120}
                    className="absolute -right-7 -top-8 z-30 h-24 w-24 object-contain drop-shadow-xl"
                  />
                  {/* Front */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl ${prizes[0].bgFront} [backface-visibility:hidden] shadow-[0_0_60px_rgba(224,184,47,0.35)] overflow-hidden`}>
                    <div className="relative h-full w-full">
                      <Image src={prizes[0].imageFront} alt={prizes[0].title} fill className="object-cover" />
                    </div>
                  </div>
                  {/* Back */}
                  <div className={`absolute inset-0 flex flex-col items-center rounded-2xl ${prizes[0].bgBack} [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl overflow-hidden`}>
                    <div className="p-8 w-full h-full flex flex-col items-center">
                      <h3 className={`mt-4 text-center font-display text-5xl leading-tight ${prizes[0].textBack}`}>{prizes[0].title}</h3>
                      <div className="my-6 h-1 w-16 rounded-full bg-slate-300" />
                      <ul className="w-full space-y-4 font-mono text-lg font-bold text-slate-800">
                        {prizes[0].perks.map((perk, i) => (
                          <li key={i} className="flex items-start">
                            <span className={`mr-2 mt-1 ${prizes[0].textBack}`}>▶</span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EPIC + RARE — side by side below */}
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              {prizes.slice(1).map((prize) => (
                <div key={prize.title} tabIndex={0} className="group h-[440px] cursor-pointer [perspective:1000px] focus:outline-none">
                  <div className="relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${prize.title === "Runner Up" ? 59 : 131}.png`}
                      alt=""
                      width={110}
                      height={110}
                      className="absolute -right-5 -top-7 z-30 h-20 w-20 object-contain drop-shadow-xl sm:h-24 sm:w-24"
                    />
                    {/* Front */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl ${prize.bgFront} [backface-visibility:hidden] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden`}>
                      {prize.imageFront ? (
                        <div className="relative h-full w-full">
                          <Image src={prize.imageFront} alt={prize.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="p-6 w-full h-full flex flex-col items-center justify-center">
                          <p className={`font-mono text-2xl font-bold tracking-[0.2em] ${prize.textFront}`}>{prize.tier}</p>
                          <div className={`mt-10 h-40 w-40 flex items-center justify-center rounded-full border-4 ${prize.borderFront} ${prize.bgFront} shadow-inner`}>
                            <div className={`h-28 w-28 rounded-full border-2 border-dashed ${prize.borderFront} opacity-50`} />
                          </div>
                          <p className="mt-10 font-sans text-sm font-bold tracking-widest text-white/40">HOVER TO REVEAL</p>
                        </div>
                      )}
                    </div>
                    {/* Back */}
                    <div className={`absolute inset-0 flex flex-col items-center rounded-2xl ${prize.bgBack} [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl overflow-hidden`}>
                      <div className="p-8 w-full h-full flex flex-col items-center">
                        <h3 className={`mt-4 text-center font-display text-4xl leading-tight ${prize.textBack}`}>{prize.title}</h3>
                        <div className="my-6 h-1 w-16 rounded-full bg-slate-300" />
                        <ul className="w-full space-y-4 font-mono text-lg font-bold text-slate-800">
                          {prize.perks.map((perk, i) => (
                            <li key={i} className="flex items-start">
                              <span className={`mr-2 mt-1 ${prize.textBack}`}>▶</span>
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border-4 border-poke-black bg-[#101b27] p-6 flex flex-col items-center text-center transition hover:-translate-y-2">
                <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png" alt="Arceus" width={140} height={140} className="object-contain drop-shadow-xl h-28 w-28 mb-3" />
                <p className="font-display text-2xl text-poke-yellow">Abhishek Jose</p>
                <p className="text-slate-300 font-mono text-xs uppercase tracking-widest mt-1">Lead Organizer</p>
                <p className="text-sm mt-3 text-slate-400">contact@bitnbuild.com</p>
              </div>
              <div className="rounded-lg border-4 border-poke-black bg-[#101b27] p-6 flex flex-col items-center text-center transition hover:-translate-y-2">
                <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" alt="Rayquaza" width={140} height={140} className="object-contain drop-shadow-xl h-28 w-28 mb-3" />
                <p className="font-display text-2xl text-poke-yellow">Chris Lopers</p>
                <p className="text-slate-300 font-mono text-xs uppercase tracking-widest mt-1">Co-Organizer</p>
                <p className="text-sm mt-3 text-slate-400">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-poke-black py-10 px-4 sm:px-6 text-center text-slate-400 border-t border-white/10">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between">
            <p className="font-mono text-sm tracking-widest text-poke-yellow">© 2026 BITNBUILD. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 font-mono text-sm">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
