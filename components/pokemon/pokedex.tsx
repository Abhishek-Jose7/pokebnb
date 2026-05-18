"use client";

import { useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PokedexPage {
    id: string;
    label: string;        // short nav label shown in header
    title: string;        // screen header title
    content: ReactNode;
}

export interface HackPokedexProps {
    pages: PokedexPage[];
    /** Blinking indicator: "red" | "yellow" | "green" */
    status?: "red" | "yellow" | "green";
    /** Hackathon / event name shown on the left panel mini-screen */
    eventName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mod = (n: number, m: number) => ((n % m) + m) % m;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HackPokedex({
    pages,
    status = "green",
    eventName = "HACKDEX",
}: HackPokedexProps) {
    const [pageIdx, setPageIdx] = useState(0);
    const [ripple, setRipple] = useState<string | null>(null);

    const go = (dir: "left" | "right" | "up" | "down") => {
        if (dir === "right") setPageIdx((i) => mod(i + 1, pages.length));
        if (dir === "left") setPageIdx((i) => mod(i - 1, pages.length));
    };

    const press = (id: string, cb?: () => void) => {
        setRipple(id);
        setTimeout(() => setRipple(null), 250);
        cb?.();
    };

    const page = pages[pageIdx] ?? pages[0];

    const indicatorColor =
        status === "green" ? "#4ade80" : status === "yellow" ? "#facc15" : "#f87171";

    return (
        <>
            <style>{`
        @font-face {
          font-family: 'Pokemon Solid Local';
          src: url('/Pokemon Solid.ttf') format('truetype');
          font-display: swap;
        }
        @font-face {
          font-family: 'Pokemon Hollow Local';
          src: url('/Pokemon Hollow.ttf') format('truetype');
          font-display: swap;
        }

        .pdx2-root {
          --red:       #d42b2b;
          --red-hi:    #e84040;
          --red-lo:    #8b1a1a;
          --black:     #111111;
          --hinge:     #1c1c1c;
          --screen-bg: #071a0e;
          --screen-glow:#4ade80;
          --text-green:#4ade80;
          --text-dim:  #1f6b3a;
          --btn-gray:  #2a2a2a;
          --btn-mid:   #3a3a3a;
          --font-pixel:'Pokemon Solid Local', monospace;
          --font-mono: 'Pokemon Hollow Local', monospace;
          display: flex; justify-content: center; align-items: center;
          width: 100%; padding: 0; background: transparent;
          font-family: var(--font-mono);
        }

        /* ═══════════════════ DESKTOP — HORIZONTAL CLAMSHELL ═══════════════════ */

        .pdx2-shell {
          display: flex;
          flex-direction: row;
          width: 100%;
          max-width: 900px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 0 3px var(--red-lo),
            0 30px 80px rgba(0,0,0,0.8),
            0 0 60px rgba(212,43,43,0.25);
          background: var(--red);
          position: relative;
        }

        /* subtle highlight bevel on top */
        .pdx2-shell::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: inherit;
          background: linear-gradient(145deg, rgba(255,255,255,0.13) 0%, transparent 45%);
          pointer-events: none; z-index: 10;
        }

        /* ── LEFT PANEL (controls) ── */
        .pdx2-left {
          width: 260px;
          flex-shrink: 0;
          background: var(--red);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 22px 20px 18px;
          position: relative;
          border-right: 4px solid var(--red-lo);
          gap: 16px;
        }

        /* angled bottom-right cut */
        .pdx2-left::after {
          content: '';
          position: absolute;
          bottom: 0; right: -4px;
          width: 30px; height: 30px;
          background: var(--hinge);
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }

        /* top decoration row */
        .pdx2-top-deco {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pdx2-ball {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 32%, #90c9ff, #1346b5);
          border: 5px solid #0d2f7e;
          box-shadow: 0 0 0 3px #fff, 0 0 16px rgba(59,130,246,0.6);
          flex-shrink: 0;
        }

        .pdx2-dots { display: flex; flex-direction: column; gap: 5px; }
        .pdx2-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.4);
        }
        .pdx2-dot.r { background:#f87171; box-shadow:0 0 6px #ef4444; }
        .pdx2-dot.y { background:#fde68a; box-shadow:0 0 6px #fbbf24; }
        .pdx2-dot.g { background:#86efac; box-shadow:0 0 6px #4ade80; }

        /* mini label screen */
        .pdx2-label-screen {
          background: #0a2a12;
          border: 2px solid #0f3d1c;
          border-radius: 6px;
          padding: 6px 10px;
          width: 100%;
          box-shadow: inset 0 0 12px rgba(0,0,0,0.6), 0 0 8px rgba(74,222,128,0.15);
        }
        .pdx2-label-text {
          font-family: var(--font-pixel);
          font-size: 0.45rem;
          color: #4ade80;
          letter-spacing: 0.1em;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pdx2-label-bar {
          height: 4px;
          background: linear-gradient(to right, #4ade80 60%, #0a2a12 60%);
          border-radius: 2px;
          margin-top: 5px;
          animation: loadbar 3s ease-in-out infinite;
        }
        @keyframes loadbar {
          0%,100%{background: linear-gradient(to right, #4ade80 60%, #0a2a12 60%);}
          50%{background: linear-gradient(to right, #4ade80 80%, #0a2a12 80%);}
        }

        /* speaker */
        .pdx2-speaker {
          display: flex; flex-direction: column; gap: 4px;
          width: 100%;
        }
        .pdx2-speaker-line {
          height: 3px;
          background: var(--red-lo);
          border-radius: 2px;
          border: 1px solid rgba(0,0,0,0.3);
        }

        /* D-pad */
        .pdx2-dpad {
          display: grid;
          grid-template-rows: 1fr auto 1fr;
          gap: 3px;
          width: 100px;
          margin: 4px 0;
        }
        .pdx2-dpad-mid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 3px;
          align-items: center;
        }
        .pdx2-dpad-center {
          width: 26px; height: 26px;
          background: var(--black);
          border: 2px solid #000;
        }
        .pdx2-dpad-btn {
          background: var(--black);
          border: 2px solid #000;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #555; font-size: 0.65rem;
          transition: background 0.08s, transform 0.06s;
          user-select: none;
        }
        .pdx2-dpad-btn:active,
        .pdx2-dpad-btn.rip { background: #2a2a2a; transform: scale(0.9); }
        .d-up, .d-down { width: 30px; height: 36px; margin: 0 auto; border-radius: 4px 4px 0 0; }
        .d-down { border-radius: 0 0 4px 4px; }
        .d-left, .d-right { width: 36px; height: 30px; border-radius: 4px 0 0 4px; }
        .d-right { border-radius: 0 4px 4px 0; }

        /* A/B buttons */
        .pdx2-actions {
          display: flex; gap: 12px; align-items: center;
        }
        .pdx2-action-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 3px solid #000;
          font-family: var(--font-pixel);
          font-size: 0.45rem;
          font-weight: bold;
          cursor: pointer;
          color: #fff;
          transition: transform 0.08s;
        }
        .ab-a {
          background: radial-gradient(circle at 35% 35%, #f97316, #b45309);
          box-shadow: 0 5px 0 #78350f;
        }
        .ab-b {
          background: radial-gradient(circle at 35% 35%, #a78bfa, #6d28d9);
          box-shadow: 0 5px 0 #4c1d95;
        }
        .pdx2-action-btn:active,
        .pdx2-action-btn.rip { transform: translateY(4px); box-shadow: none !important; }

        /* start/select */
        .pdx2-menu-btns {
          display: flex; gap: 10px;
        }
        .pdx2-menu-btn {
          background: var(--black);
          border: 2px solid #000;
          border-radius: 20px;
          padding: 5px 12px;
          color: #555;
          font-family: var(--font-pixel);
          font-size: 0.35rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.1s, transform 0.08s;
        }
        .pdx2-menu-btn:active { background: #2a2a2a; transform: translateY(1px); }

        /* ── HINGE ── */
        .pdx2-hinge {
          width: 16px;
          flex-shrink: 0;
          background: var(--hinge);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-left: 2px solid #000;
          border-right: 2px solid #000;
        }
        .pdx2-hinge-screw {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #2a2a2a;
          border: 2px solid #111;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .pdx2-hinge-line {
          width: 2px; height: 40px;
          background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
          border-radius: 1px;
        }

        /* ── RIGHT PANEL (screen) ── */
        .pdx2-right {
          flex: 1;
          background: var(--red);
          display: flex;
          flex-direction: column;
          padding: 20px 20px 16px;
          gap: 12px;
          position: relative;
        }

        /* top nav tabs */
        .pdx2-nav-tabs {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .pdx2-nav-tab {
          background: var(--red-lo);
          border: 2px solid rgba(0,0,0,0.3);
          border-radius: 6px 6px 0 0;
          padding: 5px 10px;
          font-family: var(--font-pixel);
          font-size: 0.4rem;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 0.1s, color 0.1s;
          letter-spacing: 0.05em;
        }
        .pdx2-nav-tab.active {
          background: #0a2a12;
          color: #4ade80;
          border-bottom-color: #0a2a12;
        }
        .pdx2-nav-tab:hover:not(.active) { background: var(--red-hi); color: rgba(255,255,255,0.75); }

        /* screen frame */
        .pdx2-screen-frame {
          flex: 1;
          background: #0a2a12;
          border-radius: 0 8px 8px 8px;
          border: 3px solid #000;
          box-shadow:
            inset 0 0 40px rgba(0,0,0,0.7),
            0 0 20px rgba(74,222,128,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 320px;
        }

        /* scanlines overlay */
        .pdx2-screen-frame::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
          pointer-events: none;
          z-index: 5;
          border-radius: inherit;
        }

        .pdx2-screen-header {
          background: #050f08;
          padding: 8px 14px;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid #0f3d1c;
          flex-shrink: 0;
        }
        .pdx2-screen-nav {
          display: flex; align-items: center; gap: 8px;
        }
        .pdx2-screen-nav-arrow {
          color: var(--text-green);
          font-family: var(--font-pixel);
          font-size: 0.45rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.1s;
        }
        .pdx2-screen-nav-arrow:hover { opacity: 1; }
        .pdx2-screen-nav-title {
          color: var(--text-green);
          font-family: var(--font-pixel);
          font-size: 0.5rem;
          letter-spacing: 0.25em;
        }

        .pdx2-indicator {
          width: 8px; height: 8px; border-radius: 50%;
          background: ${indicatorColor};
          box-shadow: 0 0 8px ${indicatorColor};
          animation: blink2 2.5s ease-in-out infinite;
        }
        @keyframes blink2 { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .pdx2-screen-body {
          flex: 1;
          padding: 16px;
          color: var(--text-green);
          font-family: var(--font-mono);
          font-size: 1rem;
          line-height: 1.6;
          overflow-y: auto;
          position: relative;
          z-index: 1;
          scrollbar-width: thin;
          scrollbar-color: #0f3d1c transparent;
        }
        .pdx2-screen-body::-webkit-scrollbar { width: 4px; }
        .pdx2-screen-body::-webkit-scrollbar-thumb { background: #0f3d1c; border-radius: 2px; }

        /* corner brackets */
        .pdx2-corner {
          position: absolute;
          width: 16px; height: 16px;
          border-color: var(--text-dim);
          border-style: solid;
          opacity: 0.7;
          z-index: 2;
        }
        .pdx2-corner.tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
        .pdx2-corner.tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; }
        .pdx2-corner.bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; }
        .pdx2-corner.br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }

        /* page dots */
        .pdx2-screen-footer {
          background: #050f08;
          padding: 6px 14px;
          display: flex; align-items: center; justify-content: center;
          gap: 6px;
          border-top: 1px solid #0f3d1c;
          flex-shrink: 0;
        }
        .pdx2-page-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #0f3d1c;
          transition: background 0.2s;
        }
        .pdx2-page-dot.active { background: var(--text-green); box-shadow: 0 0 5px var(--text-green); }

        /* bottom controls row */
        .pdx2-bottom-strip {
          display: flex; align-items: center; justify-content: space-between;
        }
        .pdx2-select-start {
          display: flex; gap: 8px;
        }
        .pdx2-ss-btn {
          background: #050f08;
          border: 2px solid #000;
          border-radius: 4px;
          padding: 4px 10px;
          color: #555;
          font-family: var(--font-pixel);
          font-size: 0.35rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.1s;
        }
        .pdx2-ss-btn:active { background: #0a2a12; color: var(--text-green); }

        /* shortcut tabs */
        .pdx2-shortcuts {
          display: flex; gap: 5px;
        }
        .pdx2-sc-btn {
          width: 28px; height: 12px;
          background: var(--red-lo);
          border: 2px solid rgba(0,0,0,0.4);
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.1s, transform 0.08s;
          position: relative;
        }
        .pdx2-sc-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
          border-radius: inherit;
        }
        .pdx2-sc-btn:active, .pdx2-sc-btn.rip { background: var(--red-hi); transform: translateY(1px); }


        /* ═══════════════════ MOBILE — VERTICAL ═══════════════════ */

        @media (max-width: 700px) {
          .pdx2-shell {
            flex-direction: column;
            max-width: 360px;
            border-radius: 20px;
          }

          .pdx2-left {
            width: 100%;
            border-right: none;
            border-bottom: 4px solid var(--red-lo);
            padding: 14px 14px 16px;
            gap: 10px;
          }

          .pdx2-left::after { display: none; }

          .pdx2-top-deco { justify-content: flex-start; }
          .pdx2-ball { width: 42px; height: 42px; }
          .pdx2-dot { width: 12px; height: 12px; }

          .pdx2-speaker { flex-direction: row; width: auto; }
          .pdx2-speaker-line { width: 30px; height: 3px; }

          .pdx2-controls-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 10px;
          }

          .pdx2-dpad { width: 88px; }
          .d-up, .d-down { width: 24px; height: 30px; }
          .d-left, .d-right { width: 30px; height: 24px; }
          .pdx2-dpad-center { width: 22px; height: 22px; }
          .pdx2-action-btn { width: 38px; height: 38px; }

          .pdx2-hinge {
            width: 100%;
            height: 14px;
            flex-direction: row;
            padding: 0 14px;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            border-left: none; border-right: none;
          }
          .pdx2-hinge-line { width: 40px; height: 2px; }

          .pdx2-right { padding: 14px 14px 12px; gap: 10px; }
          .pdx2-screen-frame { min-height: 260px; }
          .pdx2-nav-tab { font-size: 0.35rem; padding: 4px 7px; }
          .pdx2-screen-nav-title { font-size: 0.4rem; }

          .pdx2-menu-btns { display: none; }
        }
      `}</style>

            <div className="pdx2-root">
                <div className="pdx2-shell">

                    {/* ══ LEFT PANEL ══ */}
                    <div className="pdx2-left">

                        {/* Top: ball + dots */}
                        <div className="pdx2-top-deco">
                            <div className="pdx2-ball" />
                            <div className="pdx2-dots">
                                <div className="pdx2-dot r" />
                                <div className="pdx2-dot y" />
                                <div className="pdx2-dot g" />
                            </div>
                        </div>

                        {/* Mini label screen */}
                        <div className="pdx2-label-screen">
                            <span className="pdx2-label-text">■ {eventName}</span>
                            <div className="pdx2-label-bar" />
                        </div>

                        {/* Speaker */}
                        <div className="pdx2-speaker">
                            {[0, 1, 2, 3, 4].map(i => <div key={i} className="pdx2-speaker-line" />)}
                        </div>

                        {/* Controls row (mobile uses flex row, desktop stacks) */}
                        <div className="pdx2-controls-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 10 }}>
                            {/* D-pad */}
                            <div className="pdx2-dpad">
                                <button className={`pdx2-dpad-btn d-up${ripple === "up" ? " rip" : ""}`} onClick={() => press("up", () => go("up"))}>▲</button>
                                <div className="pdx2-dpad-mid">
                                    <button className={`pdx2-dpad-btn d-left${ripple === "left" ? " rip" : ""}`} onClick={() => press("left", () => go("left"))}>◀</button>
                                    <div className="pdx2-dpad-center" />
                                    <button className={`pdx2-dpad-btn d-right${ripple === "right" ? " rip" : ""}`} onClick={() => press("right", () => go("right"))}>▶</button>
                                </div>
                                <button className={`pdx2-dpad-btn d-down${ripple === "down" ? " rip" : ""}`} onClick={() => press("down", () => go("down"))}>▼</button>
                            </div>

                            {/* A/B */}
                            <div className="pdx2-actions">
                                <button className={`pdx2-action-btn ab-b${ripple === "B" ? " rip" : ""}`} onClick={() => press("B", () => setPageIdx(i => mod(i - 1, pages.length)))}>B</button>
                                <button className={`pdx2-action-btn ab-a${ripple === "A" ? " rip" : ""}`} onClick={() => press("A", () => setPageIdx(i => mod(i + 1, pages.length)))}>A</button>
                            </div>
                        </div>

                        {/* Start / Select */}
                        <div className="pdx2-menu-btns">
                            <button className="pdx2-menu-btn">SELECT</button>
                            <button className="pdx2-menu-btn">START</button>
                        </div>

                    </div>

                    {/* ══ HINGE ══ */}
                    <div className="pdx2-hinge">
                        <div className="pdx2-hinge-screw" />
                        <div className="pdx2-hinge-line" />
                        <div className="pdx2-hinge-screw" />
                    </div>

                    {/* ══ RIGHT PANEL (screen) ══ */}
                    <div className="pdx2-right">

                        {/* Nav tabs */}
                        <div className="pdx2-nav-tabs">
                            {pages.map((p, i) => (
                                <button
                                    key={p.id}
                                    className={`pdx2-nav-tab${i === pageIdx ? " active" : ""}`}
                                    onClick={() => setPageIdx(i)}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Screen */}
                        <div className="pdx2-screen-frame" style={{ position: "relative" }}>
                            <div className="pdx2-corner tl" />
                            <div className="pdx2-corner tr" />
                            <div className="pdx2-corner bl" />
                            <div className="pdx2-corner br" />

                            <div className="pdx2-screen-header">
                                <div className="pdx2-screen-nav">
                                    <span className="pdx2-screen-nav-arrow" onClick={() => go("left")}>◀</span>
                                    <span className="pdx2-screen-nav-title">{page.title}</span>
                                    <span className="pdx2-screen-nav-arrow" onClick={() => go("right")}>▶</span>
                                </div>
                                <div className="pdx2-indicator" />
                            </div>

                            <div className="pdx2-screen-body">
                                {page.content}
                            </div>

                            <div className="pdx2-screen-footer">
                                {pages.map((_, i) => (
                                    <div key={i} className={`pdx2-page-dot${i === pageIdx ? " active" : ""}`} onClick={() => setPageIdx(i)} style={{ cursor: "pointer" }} />
                                ))}
                            </div>
                        </div>

                        {/* Bottom strip */}
                        <div className="pdx2-bottom-strip">
                            <div className="pdx2-select-start">
                                <button className="pdx2-ss-btn">SELECT</button>
                                <button className="pdx2-ss-btn">START</button>
                            </div>
                            <div className="pdx2-shortcuts">
                                {pages.slice(0, 4).map((_, i) => (
                                    <button key={i} className={`pdx2-sc-btn${ripple === `sc${i}` ? " rip" : ""}`} onClick={() => { press(`sc${i}`); setPageIdx(i); }} />
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
