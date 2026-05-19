"use client";

import { useEffect, useState } from "react";

const npcs = [
  {
    name: "PROF. BYTE",
    role: "About BitnBuild",
    position: "left-[13%] top-[24%]",
    lines: [
      "BitnBuild is CRCE's flagship hackathon where builders create innovative projects within limited time constraints.",
      "This edition is a 24-hour global hackathon in Mumbai focused on creativity, execution, and demo-ready ideas.",
    ],
  },
  {
    name: "SHOPKEEPER",
    role: "Registration",
    position: "left-[27%] top-[50%]",
    lines: [
      "Register from the main desk, keep your team details ready, and watch official announcements for slot updates.",
      "Teams should pick a starter domain before the build sprint begins.",
    ],
  },
  {
    name: "ENGINEER",
    role: "Tech Stack",
    position: "right-[16%] top-[24%]",
    lines: [
      "Bring whatever stack helps you build fastest: web, app, AI/ML, blockchain, hardware prototypes, or hybrid tools.",
      "Judges care about clarity, execution, impact, and how confidently you can demo the result.",
    ],
  },
  {
    name: "NURSE NODE",
    role: "Rules & Support",
    position: "left-1/2 top-[30%] -translate-x-1/2",
    lines: [
      "Need help? Visit the support counter for schedule, food, room, or mentor guidance.",
      "Respect teams, use permitted resources, and keep submissions original.",
    ],
  },
  {
    name: "GUARD",
    role: "Eligibility",
    position: "left-1/2 top-[57%] -translate-x-1/2",
    lines: [
      "Students, developers, designers, and innovators can enter if they follow team and event guidelines.",
      "Carry your ID and use your dashboard QR wherever check-in is required.",
    ],
  },
  {
    name: "RIVAL",
    role: "Prizes",
    position: "right-[25%] top-[59%]",
    lines: [
      "Prizes go to teams that combine strong ideas with working execution and a crisp pitch.",
      "Track awards, sponsor awards, and special mentions may unlock along the way.",
    ],
  },
];

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i += 1;
      if (i > text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}

export function PokemonCenterFAQ() {
  const [active, setActive] = useState<number | null>(null);
  const [line, setLine] = useState(0);

  function choose(index: number) {
    setActive(index);
    setLine(0);
  }

  function nextLine() {
    if (active === null) return;
    setLine((value) => (value + 1) % npcs[active].lines.length);
  }

  return (
    <section id="faq" className="bg-[#101b27] px-4 pt-32 pb-24 sm:px-6 sm:pt-40 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-left sm:mb-10">
          <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">FAQ</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Talk To The NPCs.
          </h2>
          <p className="mt-4 max-w-3xl text-xl leading-8 text-slate-300 sm:text-2xl sm:leading-9">
            Tap a question mark in the Pokemon Center to ask questions about the hackathon.
          </p>
        </div>

        {/* Mobile View: Stacked NPCs */}
        <div className="mt-8 flex flex-col gap-4 sm:hidden">
          {npcs.map((person, index) => (
            <div key={person.name} className="flex flex-col rounded-md border-[3px] border-poke-black bg-[#f8f5eb] p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-poke-black bg-poke-yellow text-center text-2xl font-black leading-none text-poke-red shadow-[0_3px_0_rgba(0,0,0,.35)]">
                  ?
                </div>
                <div>
                  <p className="font-mono text-sm font-bold tracking-widest text-poke-red">
                    {person.name}
                  </p>
                  <p className="font-mono text-[10px] font-black uppercase text-slate-500">
                    {person.role}
                  </p>
                </div>
              </div>
              <div className="mt-3 font-sans text-sm leading-relaxed text-slate-900">
                <p>{person.lines.join(" ")}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Interactive Image Map */}
        <div className="relative mx-auto mt-10 hidden h-[520px] w-full max-w-5xl overflow-hidden rounded-lg border-4 border-poke-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:block sm:h-[620px]">
          <div className="absolute inset-0 bg-[url('/faq.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#ffaa00]/10 mix-blend-color-burn" />

          {npcs.map((person, index) => {
            const isHigh = parseInt(person.position.match(/top-\[(\d+)%\]/)?.[1] || "50") < 33;
            const bubblePosition = isHigh ? "top-full mt-2" : "bottom-full mb-2";
            const pointerClass = isHigh
              ? "absolute -top-[10px] left-1/2 -translate-x-1/2 border-b-[10px] border-l-[10px] border-r-[10px] border-b-poke-black border-l-transparent border-r-transparent"
              : "absolute -bottom-[10px] left-1/2 -translate-x-1/2 border-t-[10px] border-l-[10px] border-r-[10px] border-t-poke-black border-l-transparent border-r-transparent";
            const pointerInnerClass = isHigh
              ? "absolute -left-[6px] -bottom-[11px] border-b-[6px] border-l-[6px] border-r-[6px] border-b-[#f8f5eb] border-l-transparent border-r-transparent"
              : "absolute -left-[6px] -top-[11px] border-t-[6px] border-l-[6px] border-r-[6px] border-t-[#f8f5eb] border-l-transparent border-r-transparent";

            return (
              <div key={person.name} className={`absolute z-10 flex flex-col items-center justify-start ${person.position}`}>
                {active === index && (
                  <div className={`absolute z-20 w-[min(82vw,20rem)] left-1/2 -translate-x-1/2 ${bubblePosition}`}>
                    <div className="relative flex flex-col rounded-md border-[3px] border-poke-black bg-[#f8f5eb] p-3 shadow-lg sm:p-4">
                      <p className="font-mono text-xs font-bold tracking-widest text-poke-red sm:text-sm">
                        {person.name}
                      </p>
                      <div className="mt-1 min-h-[60px] font-sans text-sm leading-relaxed text-slate-900 sm:text-base">
                        <TypewriterText text={person.lines[line]} />
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          nextLine();
                        }}
                        className="mt-3 min-h-10 self-end rounded-sm border-2 border-poke-black bg-poke-red px-3 py-1 font-mono text-[10px] font-black text-white transition hover:bg-red-700 sm:text-xs"
                      >
                        NEXT
                      </button>
                      <div className={pointerClass}>
                        <div className={pointerInnerClass} />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => choose(index)}
                  className="group flex h-16 w-16 cursor-pointer flex-col items-center justify-center transition-transform hover:-translate-y-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-poke-yellow/70 sm:h-20 sm:w-20"
                  aria-label={`Talk to ${person.name}`}
                >
                  <div className={`grid h-9 w-9 place-items-center rounded-full border-[3px] border-poke-black bg-poke-yellow pb-1 text-center text-3xl font-black leading-none text-poke-red shadow-[0_5px_0_rgba(0,0,0,.35)] transition group-hover:scale-110 sm:h-11 sm:w-11 sm:text-4xl ${active === index ? "animate-bounce" : ""}`}>
                    ?
                  </div>
                  <span className={`mt-2 max-w-28 rounded bg-white/95 px-2 py-1 text-center font-mono text-[9px] font-black uppercase text-poke-red shadow transition ${active === index ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                    {person.role}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
