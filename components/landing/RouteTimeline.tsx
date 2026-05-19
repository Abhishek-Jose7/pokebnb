import Image from "next/image";

const routeStops = [
  ["01", "Registrations", "Teams enter the route and lock their slot.", "May 20"],
  ["02", "Starter Pick", "Select Web/App, Blockchain, or AI/ML.", "May 22"],
  ["03", "Opening", "Briefing, rules, and the build clock starts.", "May 25"],
  ["04", "Build Sprint", "Mentors, checkpoints, and overnight execution.", "24 hrs"],
  ["05", "Gym Reviews", "Judges inspect demos and score the rounds.", "Final day"],
  ["06", "Champion", "Final pitch, awards, and leaderboard reveal.", "Finale"],
];

export function RouteTimeline() {
  return (
    <section id="timeline" className="relative overflow-hidden bg-[#081f20] px-4 py-28 text-white sm:px-6">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0f2318] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0e1722] to-transparent" />
      <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute right-[-8%] bottom-20 h-80 w-80 rounded-full bg-sky-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">Timeline</p>
            <h2 className="mt-4 font-display text-5xl leading-tight lg:text-7xl">Route Map.</h2>
          </div>
          <p className="max-w-3xl text-2xl leading-9 text-cyan-50/80">
            Not a plain schedule: follow the trainer route from sign-up to champion reveal, with each checkpoint acting like a new map area.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-6 right-6 top-1/2 hidden h-1 -translate-y-1/2 bg-gradient-to-r from-poke-yellow via-white to-poke-red lg:block" />
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-poke-yellow via-white to-poke-red lg:hidden" />

          <div className="grid gap-6 lg:grid-cols-6">
            {routeStops.map(([number, title, detail, date], index) => (
              <article
                key={number}
                className={`relative rounded-[1.4rem] border border-white/15 bg-white/[0.07] p-5 shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-md transition hover:-translate-y-2 hover:bg-white/[0.1] ${
                  index % 2 ? "lg:mt-24" : "lg:mb-24"
                }`}
              >
                <div className="absolute -top-6 left-5 grid h-12 w-12 place-items-center rounded-full border-4 border-[#081f20] bg-poke-yellow font-mono text-xl font-black text-slate-950 shadow-xl">
                  {number}
                </div>
                <div className="pt-7">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-poke-yellow">{date}</p>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-white">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-cyan-50/75">{detail}</p>
                </div>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${[25, 1, 4, 7, 94, 150][index]}.png`}
                  alt=""
                  width={82}
                  height={82}
                  className="absolute -bottom-5 -right-3 h-16 w-16 object-contain opacity-90 drop-shadow-xl"
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
