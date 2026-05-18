"use client";

import { useState } from "react";

const npcs = [
  {
    name: "PROF. BYTE",
    role: "About BitnBuild",
    position: "left-[12%] top-[22%]",
    color: "bg-poke-yellow text-slate-950",
    lines: [
      "BitnBuild is CRCE's flagship hackathon where builders create innovative projects within limited time constraints.",
      "This edition is a 24-hour global hackathon in Mumbai focused on creativity, execution, and demo-ready ideas.",
    ],
  },
  {
    name: "SHOPKEEPER",
    role: "Registration",
    position: "left-[42%] top-[18%]",
    color: "bg-green-400 text-slate-950",
    lines: [
      "Register from the main desk, keep your team details ready, and watch official announcements for slot updates.",
      "Teams should pick a starter domain before the build sprint begins.",
    ],
  },
  {
    name: "ENGINEER",
    role: "Tech Stack",
    position: "right-[13%] top-[25%]",
    color: "bg-sky-400 text-slate-950",
    lines: [
      "Bring whatever stack helps you build fastest: web, app, AI/ML, blockchain, hardware prototypes, or hybrid tools.",
      "Judges care about clarity, execution, impact, and how confidently you can demo the result.",
    ],
  },
  {
    name: "NURSE NODE",
    role: "Rules & Support",
    position: "left-[24%] bottom-[22%]",
    color: "bg-pink-300 text-slate-950",
    lines: [
      "Need help? Visit the support counter for schedule, food, room, or mentor guidance.",
      "Respect teams, use permitted resources, and keep submissions original.",
    ],
  },
  {
    name: "GUARD",
    role: "Eligibility",
    position: "right-[28%] bottom-[20%]",
    color: "bg-slate-800 text-white",
    lines: [
      "Students, developers, designers, and innovators can enter if they follow team and event guidelines.",
      "Carry your ID and use your dashboard QR wherever check-in is required.",
    ],
  },
  {
    name: "RIVAL",
    role: "Prizes",
    position: "right-[8%] bottom-[42%]",
    color: "bg-orange-400 text-slate-950",
    lines: [
      "Prizes go to teams that combine strong ideas with working execution and a crisp pitch.",
      "Track awards, sponsor awards, and special mentions may unlock along the way.",
    ],
  },
];

export function PokemonCenterFAQ() {
  const [active, setActive] = useState(0);
  const [line, setLine] = useState(0);
  const npc = npcs[active];

  function choose(index: number) {
    setActive(index);
    setLine(0);
  }

  function nextLine() {
    setLine((value) => (value + 1) % npc.lines.length);
  }

  return (
    <section id="faq" className="bg-[#101b27] px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xl uppercase tracking-[0.24em] text-poke-yellow">FAQ</p>
        <h2 className="mt-3 font-display text-4xl leading-tight text-white lg:text-5xl">Talk To The NPCs.</h2>
        <p className="mt-5 max-w-3xl text-2xl leading-9 text-slate-300">Walk into the Pokemon Center help desk. Each counter answers a different part of the event.</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_.55fr]">
          <div className="relative min-h-[640px] overflow-hidden rounded-lg border-4 border-poke-black bg-[#f7e8c7] p-5 shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-24 bg-poke-red" />
            <div className="absolute left-1/2 top-14 h-16 w-72 -translate-x-1/2 rounded-b-full border-4 border-poke-black bg-white" />
            <div className="absolute left-1/2 top-20 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-poke-black bg-white" />
            <div className="absolute inset-x-10 bottom-10 top-32 rounded-lg bg-[linear-gradient(45deg,#d9c08f_25%,transparent_25%),linear-gradient(-45deg,#d9c08f_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#d9c08f_75%),linear-gradient(-45deg,transparent_75%,#d9c08f_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0px]" />
            {npcs.map((person, index) => (
              <button
                key={person.name}
                type="button"
                onClick={() => choose(index)}
                className={`absolute z-10 min-h-16 rounded-md border-4 border-poke-black px-4 py-2 text-left text-sm font-black shadow-lg transition hover:scale-105 ${person.position} ${person.color} ${active === index ? "ring-4 ring-poke-yellow" : ""}`}
              >
                <span className="block text-lg">{person.name}</span>
                <span className="block text-xs">{person.role}</span>
              </button>
            ))}
          </div>

          <aside className="self-end rounded-lg border-4 border-poke-black bg-white p-5 text-slate-950 shadow-2xl">
            <p className="font-mono text-2xl text-poke-red">{npc.name}:</p>
            <p className="mt-4 min-h-40 text-3xl font-black leading-10">{npc.lines[line]}</p>
            <button type="button" onClick={nextLine} className="mt-5 min-h-14 rounded-md bg-poke-yellow px-6 text-xl font-black text-slate-950">
              Next
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
