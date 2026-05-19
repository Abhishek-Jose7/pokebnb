"use client";

import { useState, useEffect } from "react";

const OAK_LINES = [
  "Welcome to BitnBuild 2025, a global hackathon in Mumbai!",
  "A 24-hour event full of creativity, innovation, and endless possibilities.",
  "Are you ready to compete with the best and unlock your potential?",
  "Now let's choose your starter!"
];

export function ProfOakDialogue() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const text = OAK_LINES[lineIndex];

  useEffect(() => {
    setIsTyping(true);
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i += 1;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [text]);

  function handleNext() {
    if (isTyping) {
      setDisplayed(text);
      setIsTyping(false);
    } else if (lineIndex < OAK_LINES.length - 1) {
      setLineIndex((v) => v + 1);
    }
  }

  return (
    <div 
      className="relative mb-6 w-full max-w-md cursor-pointer rounded-md border-[4px] border-poke-black bg-white p-6 shadow-xl"
      onClick={handleNext}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm font-bold uppercase text-poke-red">PROF. OAK:</p>
        <span className="animate-pulse font-mono text-xs font-bold text-slate-400">
          {lineIndex < OAK_LINES.length - 1 || isTyping ? "CLICK TO CONTINUE" : ""}
        </span>
      </div>
      <div className="mt-3 min-h-[80px] font-sans text-xl leading-relaxed text-slate-900">
        <p>{displayed}</p>
      </div>
      {/* Pointer to Oak */}
      <div className="absolute -bottom-[14px] right-12 border-t-[14px] border-l-[14px] border-r-[14px] border-t-poke-black border-l-transparent border-r-transparent">
        <div className="absolute -left-[10px] bottom-[4px] border-t-[10px] border-l-[10px] border-r-[10px] border-t-white border-l-transparent border-r-transparent" />
      </div>
      
      {!isTyping && lineIndex < OAK_LINES.length - 1 && (
        <div className="absolute bottom-2 right-4 animate-bounce text-2xl text-poke-red">
          ▼
        </div>
      )}
    </div>
  );
}
