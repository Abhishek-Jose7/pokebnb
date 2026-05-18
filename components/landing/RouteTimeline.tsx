const routeStops = [
  ["Route 01", "Registrations Open", "Teams enter the map, claim their slot, and get ready for the first checkpoint."],
  ["Route 02", "Starter Domain Selection", "Choose Web/App Dev, Blockchain, or AI/ML and prepare your problem path."],
  ["Route 03", "Opening Cutscene", "The event begins with the main briefing, rules, and team setup."],
  ["Route 04", "Build Sprint", "Move through forests, lakes, bridges, and towns while mentors help unblock builds."],
  ["Route 05", "Gym Battle Reviews", "Judges visit teams, score progress, and unlock leaderboard movement."],
  ["Route 06", "Final Town", "Pitches, demos, prizes, and the champion reveal."],
];

export function RouteTimeline() {
  return (
    <section id="timeline" className="relative bg-[#fff7db] px-4 py-28 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-5 z-10 mb-12 inline-block rounded-lg border-4 border-poke-black bg-white px-5 py-4 shadow-lg">
          <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-red">Timeline</p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-poke-blue lg:text-5xl">A Route Through BITNBUILD.</h2>
        </div>

        <div className="relative mx-auto min-h-[1180px] max-w-5xl">
          <div className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2 rounded-full bg-[repeating-linear-gradient(to_bottom,#7a5230_0_22px,#5b3a20_22px_34px)] shadow-inner" />
          <div className="absolute left-[12%] top-12 h-28 w-28 rounded-sm bg-green-700 shadow-[42px_28px_0_#166534,82px_-8px_0_#15803d]" />
          <div className="absolute right-[10%] top-[22%] h-36 w-44 rounded-[45%] bg-sky-300/80 shadow-[0_0_0_10px_#38bdf8]" />
          <div className="absolute left-[8%] top-[48%] h-10 w-64 rotate-[-8deg] rounded bg-[#8b5a2b] shadow-[0_12px_0_#5b3a20]" />
          <div className="absolute right-[9%] bottom-[15%] grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-10 w-10 rounded-sm bg-[#cc0000] shadow-[inset_0_-8px_0_rgba(0,0,0,.25)]" />)}
          </div>

          {routeStops.map(([route, event, details], index) => {
            const left = index % 2 === 0;
            return (
              <article
                key={route}
                className={`relative z-10 mb-14 grid items-center gap-5 md:grid-cols-[1fr_7rem_1fr] ${left ? "" : "md:[&>*:first-child]:col-start-3"}`}
              >
                <div className={`rounded-lg border-4 border-poke-black bg-white p-5 shadow-lg ${left ? "md:col-start-1" : "md:col-start-3"}`}>
                  <p className="font-mono text-2xl text-poke-red">{route}</p>
                  <h3 className="mt-2 text-3xl font-black text-poke-blue">{event}</h3>
                  <p className="mt-3 text-xl leading-8 text-slate-700">{details}</p>
                </div>
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-poke-black bg-poke-yellow font-mono text-2xl text-slate-950 md:col-start-2">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
