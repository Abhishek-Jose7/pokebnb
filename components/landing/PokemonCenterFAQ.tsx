"use client";

import { useState, useEffect } from "react";

const npcs = [
  {
    name: "PROF. BYTE",
    role: "About BitnBuild",
    position: "left-[15%] top-[25%]",
    align: "left",
    lines: [
      "BitnBuild is CRCE's flagship hackathon where builders create innovative projects within limited time constraints.",
      "This edition is a 24-hour global hackathon in Mumbai focused on creativity, execution, and demo-ready ideas.",
    ],
  },
  {
    name: "SHOPKEEPER",
    role: "Registration",
    position: "left-[25%] top-[50%]",
    align: "left",
    lines: [
      "Register from the main desk, keep your team details ready, and watch official announcements for slot updates.",
      "Teams should pick a starter domain before the build sprint begins.",
    ],
  },
  {
    name: "ENGINEER",
    role: "Tech Stack",
    position: "right-[15%] top-[25%]",
    align: "right",
    lines: [
      "Bring whatever stack helps you build fastest: web, app, AI/ML, blockchain, hardware prototypes, or hybrid tools.",
      "Judges care about clarity, execution, impact, and how confidently you can demo the result.",
    ],
  },
  {
    name: "NURSE NODE",
    role: "Rules & Support",
    position: "left-1/2 top-[28%] -translate-x-1/2",
    align: "center",
    lines: [
      "Need help? Visit the support counter for schedule, food, room, or mentor guidance.",
      "Respect teams, use permitted resources, and keep submissions original.",
    ],
  },
  {
    name: "GUARD",
    role: "Eligibility",
    position: "left-1/2 top-[55%] -translate-x-1/2",
    align: "center",
    lines: [
      "Students, developers, designers, and innovators can enter if they follow team and event guidelines.",
      "Carry your ID and use your dashboard QR wherever check-in is required.",
    ],
  },
  {
    name: "RIVAL",
    role: "Prizes",
    position: "right-[25%] top-[58%]",
    align: "right",
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
      i++;
      if (i > text.length) clearInterval(interval);
    }, 25);
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
    <section id="faq" className="bg-[#101b27] px-4 pt-40 pb-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">FAQ</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-white lg:text-5xl">Talk To The NPCs.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-slate-300">Click on any character in the Pokémon Center to ask questions about the hackathon.</p>
        </div>

        <div className="relative mx-auto h-[500px] w-full max-w-4xl overflow-hidden rounded-lg border-4 border-poke-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:h-[600px]">
          {/* Background image with evening lighting overlay */}
          <div className="absolute inset-0 bg-[url('/faq.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#ffaa00]/10 mix-blend-color-burn" />

          {/* NPCs and Dialogue Bubbles */}
          {npcs.map((person, index) => {
            // Determine vertical placement based on character's top %
            const isHigh = parseInt(person.position.match(/top-\[(\d+)%\]/)?.[1] || "50") < 30;
            const bubblePosition = isHigh ? "top-full mt-2" : "bottom-full mb-2";

            const pointerClass = isHigh
              ? "absolute -top-[10px] left-1/2 -translate-x-1/2 border-b-[10px] border-l-[10px] border-r-[10px] border-b-poke-black border-l-transparent border-r-transparent"
              : "absolute -bottom-[10px] left-1/2 -translate-x-1/2 border-t-[10px] border-l-[10px] border-r-[10px] border-t-poke-black border-l-transparent border-r-transparent";

            const pointerInnerClass = isHigh
              ? "absolute -left-[6px] -bottom-[11px] border-b-[6px] border-l-[6px] border-r-[6px] border-b-[#f8f5eb] border-l-transparent border-r-transparent"
              : "absolute -left-[6px] -top-[11px] border-t-[6px] border-l-[6px] border-r-[6px] border-t-[#f8f5eb] border-l-transparent border-r-transparent";

            return (
              <div key={person.name} className={`absolute z-10 flex flex-col items-center justify-start ${person.position}`}>
                {/* Dialogue Bubble */}
                {active === index && (
                  <div className={`absolute z-20 w-64 md:w-80 left-1/2 -translate-x-1/2 ${bubblePosition}`}>
                    <div className="relative flex flex-col rounded-md border-[3px] border-poke-black bg-[#f8f5eb] p-3 shadow-lg md:p-4">
                      <p className="font-mono text-xs font-bold tracking-widest text-poke-red md:text-sm">
                        {person.name}
                      </p>
                      <div className="mt-1 min-h-[60px] font-sans text-sm leading-relaxed text-slate-900 md:text-base">
                        <TypewriterText text={person.lines[line]} />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextLine();
                        }}
                        className="mt-3 self-end rounded-sm border-2 border-poke-black bg-poke-red px-3 py-1 font-mono text-[10px] font-black text-white transition hover:bg-red-700 md:text-xs"
                      >
                        NEXT ▼
                      </button>
                      
                      {/* Speech bubble pointer */}
                      <div className={pointerClass}>
                        <div className={pointerInnerClass} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Clickable NPC Hitbox */}
                <button
                  type="button"
                  onClick={() => choose(index)}
                  className="group flex h-24 w-20 cursor-pointer flex-col items-center justify-start transition-transform hover:-translate-y-2"
                  aria-label={`Talk to ${person.name}`}
                >
                  {active !== index && (
                    <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-poke-black bg-white font-display text-sm text-poke-red shadow-lg md:h-8 md:w-8 md:text-lg">
                        ?
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
