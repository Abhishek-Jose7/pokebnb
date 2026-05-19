import Image from "next/image";
import Link from "next/link";
import { CutscenePreloader } from "@/components/landing/CutscenePreloader";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { PokemonCenterFAQ } from "@/components/landing/PokemonCenterFAQ";
import { RouteTimeline } from "@/components/landing/RouteTimeline";

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

        <section id="about" className="relative bg-[url('/oakbg.jpg')] bg-cover bg-center px-4 pt-32 pb-40 text-slate-950 sm:px-6">
          {/* Blend Gradient into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#0f2318]" />
          
          <div className="relative z-10 mx-auto grid max-w-[80rem] items-start gap-12 lg:grid-cols-[1fr_1.3fr]">
            {/* Map Area — smaller, shifted right */}
            <div className="relative ml-auto w-full max-w-sm overflow-hidden rounded-lg border-[4px] border-poke-black bg-[#e6f0fa]/90 shadow-2xl backdrop-blur order-2 lg:order-1">
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
            <div className="flex flex-col items-center order-1 lg:order-2">
              <div className="relative mb-8 w-full rounded-md border-[4px] border-poke-black bg-white p-6 shadow-xl">
                <p className="font-mono text-sm font-bold uppercase text-poke-red">PROF. OAK:</p>
                <div className="mt-3 font-sans text-xl leading-relaxed text-slate-900">
                  <p>Welcome to BitnBuild 2025, a global hackathon in Mumbai!</p>
                  <p className="mt-4">A 24-hour event full of creativity, innovation, and endless possibilities.</p>
                  <p className="mt-4">Are you ready to compete with the best and unlock your potential?</p>
                </div>
                {/* Pointer to Oak (below pointing down) */}
                <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 border-t-[14px] border-l-[14px] border-r-[14px] border-t-poke-black border-l-transparent border-r-transparent">
                  <div className="absolute -left-[10px] bottom-[4px] border-t-[10px] border-l-[10px] border-r-[10px] border-t-white border-l-transparent border-r-transparent" />
                </div>
              </div>
              <Image src="/oak.jpg" alt="Professor Oak" width={400} height={600} className="mt-2 object-contain drop-shadow-xl" />
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

        <section id="prizes" className="bg-[#0e1722] px-4 py-28 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-center font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">Prizes</p>
            
            {/* LEGENDARY — centered top, larger, glowing */}
            <div className="mt-10 flex justify-center">
              <div className="group h-[540px] w-full max-w-md [perspective:1000px]">
                <div className="relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-[6px] ${prizes[0].borderFront} ${prizes[0].bgFront} [backface-visibility:hidden] shadow-[0_0_60px_rgba(224,184,47,0.35)] overflow-hidden`}>
                    <div className="relative h-full w-full">
                      <Image src={prizes[0].imageFront} alt={prizes[0].title} fill className="object-cover" />
                    </div>
                  </div>
                  {/* Back */}
                  <div className={`absolute inset-0 flex flex-col items-center rounded-2xl border-[6px] ${prizes[0].borderBack} ${prizes[0].bgBack} [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl overflow-hidden`}>
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
                <div key={prize.title} className="group h-[440px] [perspective:1000px]">
                  <div className="relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-[6px] ${prize.borderFront} ${prize.bgFront} [backface-visibility:hidden] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden`}>
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
                    <div className={`absolute inset-0 flex flex-col items-center rounded-2xl border-[6px] ${prize.borderBack} ${prize.bgBack} [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl overflow-hidden`}>
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
