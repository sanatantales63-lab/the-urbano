"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Initial hidden states ─────────────────────────────────────────────
    gsap.set("#ld-logo",          { opacity: 0, scale: 0.88, filter: "blur(6px)" });
    gsap.set("#ld-tagline",       { opacity: 0, letterSpacing: "0.1em", y: 8 });
    gsap.set("#ld-bar-fill",      { scaleX: 0, transformOrigin: "left center" });
    gsap.set("#ld-bar-glow",      { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".ld-corner-tl",     { x: -16, y: -16, opacity: 0 });
    gsap.set(".ld-corner-tr",     { x: 16,  y: -16, opacity: 0 });
    gsap.set(".ld-corner-bl",     { x: -16, y: 16,  opacity: 0 });
    gsap.set(".ld-corner-br",     { x: 16,  y: 16,  opacity: 0 });
    gsap.set(".ld-h-line",        { scaleX: 0, transformOrigin: "center center" });
    gsap.set("#ld-pct",           { opacity: 0 });
    gsap.set("#ld-foot",          { opacity: 0, y: 10 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Exit — slide panels out left+right, reveal site
        const exitTl = gsap.timeline({ onComplete: onComplete });
        exitTl
          .to("#ld-panel-left",  { x: "-100%", duration: 0.75, ease: "power4.inOut" }, 0)
          .to("#ld-panel-right", { x: "100%",  duration: 0.75, ease: "power4.inOut" }, 0)
          .to("#ld-logo, #ld-tagline, #ld-bar-wrap, #ld-pct, #ld-foot, .ld-corner-tl, .ld-corner-tr, .ld-corner-bl, .ld-corner-br, .ld-h-line",
            { opacity: 0, duration: 0.25 }, 0);
      },
    });

    // ── Animate in ────────────────────────────────────────────────────────
    tl
      // Horizontal accent lines sweep in
      .to(".ld-h-line",      { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "power2.inOut" }, 0)
      // Corner brackets snap in
      .to([".ld-corner-tl", ".ld-corner-tr", ".ld-corner-bl", ".ld-corner-br"],
          { x: 0, y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "back.out(2)" }, 0.15)
      // Logo unfurls
      .to("#ld-logo",        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }, 0.3)
      // Tagline
      .to("#ld-tagline",     { opacity: 1, letterSpacing: "0.55em", y: 0, duration: 0.8, ease: "power2.out" }, 0.75)
      // Progress bar fills
      .to("#ld-bar-fill",    { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.9)
      .to("#ld-bar-glow",    { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.9)
      // Percentage counter
      .to("#ld-pct",         { opacity: 1, duration: 0.3 }, 0.9)
      // Foot note
      .to("#ld-foot",        { opacity: 1, y: 0, duration: 0.5 }, 1.1)
      // Hold at 100% briefly before exit
      .to({},                { duration: 0.8 });

    // Animate percentage number
    const pctEl = document.getElementById("ld-pct");
    let pct = 0;
    const pctInterval = setInterval(() => {
      pct = Math.min(100, pct + Math.floor(Math.random() * 8) + 2);
      if (pctEl) pctEl.textContent = pct + "%";
      if (pct >= 100) clearInterval(pctInterval);
    }, 55);

  }, { scope: loaderRef });

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">

      {/* ── Two-panel split background ── */}
      <div
        id="ld-panel-left"
        className="absolute inset-y-0 left-0 w-1/2 bg-[#0c1810]"
        style={{ zIndex: 2 }}
      />
      <div
        id="ld-panel-right"
        className="absolute inset-y-0 right-0 w-1/2 bg-[#0c1810]"
        style={{ zIndex: 2 }}
      />

      {/* ── Content sits above panels ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 3 }}>

        {/* Thin horizontal accent lines */}
        <div className="ld-h-line absolute top-[28%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4956A]/25 to-transparent" />
        <div className="ld-h-line absolute top-[72%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4956A]/25 to-transparent" />

        {/* Corner brackets */}
        <div className="ld-corner-tl absolute top-8 left-8 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#C4956A]/60" />
        <div className="ld-corner-tr absolute top-8 right-8 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-[#C4956A]/60" />
        <div className="ld-corner-bl absolute bottom-8 left-8 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-[#C4956A]/60" />
        <div className="ld-corner-br absolute bottom-8 right-8 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#C4956A]/60" />

        {/* Logo — original colours on white rounded pill */}
        <div id="ld-logo" className="mb-7">
          <div className="bg-white rounded-2xl px-7 py-4 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
            <img
              src="/logo.png"
              alt="The Urbano"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>
        </div>

        {/* Tagline */}
        <div
          id="ld-tagline"
          className="font-[family-name:var(--font-cinzel)] text-[8px] sm:text-[10px] text-[#C4956A] uppercase tracking-[0.55em] mb-10"
        >
          Interior Design · Kolkata
        </div>

        {/* Progress bar */}
        <div id="ld-bar-wrap" className="relative w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-visible mb-3">
          {/* Glow layer */}
          <div
            id="ld-bar-glow"
            className="absolute inset-y-0 left-0 w-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #8cc63f, #C4956A)",
              filter: "blur(4px)",
              transform: "scaleY(2.5)",
            }}
          />
          {/* Crisp fill */}
          <div
            id="ld-bar-fill"
            className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #8cc63f, #C4956A)" }}
          />
        </div>

        {/* Percentage */}
        <div
          id="ld-pct"
          className="font-[family-name:var(--font-josefin)] text-[10px] text-white/40 tracking-[0.3em]"
        >
          0%
        </div>

        {/* Footer text */}
        <div
          id="ld-foot"
          className="absolute bottom-8 font-[family-name:var(--font-cinzel)] text-[8px] text-white/25 tracking-[0.35em] uppercase"
        >
          Est. 2021 · Premium Atelier
        </div>

      </div>
    </div>
  );
}