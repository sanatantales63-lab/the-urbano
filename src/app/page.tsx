"use client";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import AIVisualizer from "../components/AIVisualizer";
import SideBars from "../components/SideBars";
import WhyChooseUs from "../components/WhyChooseUs";
import LuxuryCategories from "../components/LuxuryCategories";
import MaterialPalette from "../components/MaterialPalette";
import DesignProcess from "../components/DesignProcess";
import Testimonials from "../components/Testimonials";
import ContactFooter from "../components/ContactFooter";
import Gallery from "../components/Gallery";

import { getSettings } from "@/lib/settingsData";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [heroBgImage, setHeroBgImage] = useState("https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1800&q=90&auto=format&fit=crop");
  const [heroOverlayImage, setHeroOverlayImage] = useState("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90&auto=format&fit=crop");

  // Fetch dynamic settings from database
  useEffect(() => {
    getSettings(
      ["hero_bg_image", "hero_overlay_image"],
      {
        hero_bg_image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1800&q=90&auto=format&fit=crop",
        hero_overlay_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90&auto=format&fit=crop",
      }
    ).then((vals) => {
      setHeroBgImage(vals.hero_bg_image);
      setHeroOverlayImage(vals.hero_overlay_image);
    });
  }, []);

  // After 2 seconds of hero being visible, trigger the cinematic reveal
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setRevealed(true), 2000);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  return (
    <main className="w-full min-h-screen relative bg-white">
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="pt-[80px]">

          <SideBars />

          {/* ═══════════════════════════════════════════════════
              CINEMATIC HERO SECTION
              Phase 1 (0-2s): Dark luxury interior
              Phase 2 (2s+): Interior curtain drops, building
                             behind is revealed — THE URBANO
                             looks like a rooftop banner
          ═══════════════════════════════════════════════════ */}
          <div className="relative w-full min-h-[100vh] flex flex-col justify-end px-6 md:px-24 pb-20 md:pb-32 overflow-hidden bg-[#0d1a10] -mt-[80px]">

            {/* ── LAYER 0 (base): Single building exterior — one iconic building, banner feel ── */}
            <div className="absolute inset-0 z-0 bg-[#0d1a10]">
              {/* Single tall building — viewed from below looking up at the facade/rooftop */}
              <img
                src={heroBgImage}
                alt="The Urbano"
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(0.55) saturate(0.55) contrast(1.1)",
                  objectPosition: "center 35%",
                }}
              />
              {/* Deep green atmospheric gradients — NO black, brand palette only */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a10]/20 via-transparent to-[#0d1a10]/90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a10]/90 via-[#122416]/30 to-transparent" />
            </div>

            {/* ── LAYER 1: Interior overlay panel that slides DOWN to reveal building ── */}
            <motion.div
              className="absolute inset-0 z-[5]"
              initial={{ y: 0 }}
              animate={revealed ? { y: "100%" } : { y: 0 }}
              transition={{ duration: 2.0, ease: [0.76, 0, 0.24, 1] }}
            >
              <img
                src={heroOverlayImage}
                alt="Luxury Interior"
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                style={{ filter: "brightness(0.4) saturate(0.5)" }}
              />
              {/* Deep green overlays — brand palette, no black */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#122416] via-[#1a3020]/70 to-[#122416]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#122416] via-[#1a3020]/50 to-transparent" />
            </motion.div>

            {/* ── LAYER 2: Cinematic golden scan line sweeps down as curtain drops ── */}
            {revealed && (
              <motion.div
                className="absolute left-0 right-0 h-[2px] z-[6] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(196,149,106,0.35) 15%, rgba(255,210,90,0.95) 50%, rgba(196,149,106,0.35) 85%, transparent 100%)",
                  boxShadow: "0 0 18px rgba(255,215,100,0.6), 0 0 40px rgba(255,215,100,0.2)",
                }}
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2.0, ease: [0.76, 0, 0.24, 1] }}
              />
            )}

            {/* ── Architectural corner markers (z-10) ── */}
            <div className="hidden md:block absolute top-[18vh] left-[64px] w-7 h-7 border-[#C4956A]/80 border-t border-l z-10" />
            <div className="hidden md:block absolute top-[18vh] right-[64px] w-7 h-7 border-[#C4956A]/80 border-t border-r z-10" />
            <div className="hidden md:block absolute bottom-[18vh] left-[64px] w-7 h-7 border-[#C4956A]/80 border-b border-l z-10" />
            <div className="hidden md:block absolute bottom-[18vh] right-[64px] w-7 h-7 border-[#C4956A]/80 border-b border-r z-10" />

            {/* ── HUD labels ── */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="hidden md:block absolute top-[calc(18vh+14px)] left-[108px] text-[8px] tracking-[0.3em] text-[#C4956A]/85 z-10 font-[family-name:var(--font-josefin)] uppercase"
            >
              Kolkata · WB
            </motion.div>

            {/* Top-right label: changes from stats to "rooftop signage" after reveal */}
            <div className="hidden md:block absolute top-[calc(18vh+14px)] right-[108px] z-10 overflow-hidden">
              <motion.span
                className="block text-[8px] tracking-[0.3em] text-[#C4956A]/85 font-[family-name:var(--font-josefin)] uppercase text-right"
                initial={{ y: 0 }}
                animate={revealed ? { y: "-120%" } : { y: 0 }}
                transition={{ duration: 0.6, delay: 1.8, ease: "easeInOut" }}
              >
                4.9★ · 230 PROJECTS
              </motion.span>
              <motion.span
                className="block text-[8px] tracking-[0.3em] text-[#C4956A]/85 font-[family-name:var(--font-josefin)] uppercase text-right"
                initial={{ y: "120%" }}
                animate={revealed ? { y: 0 } : { y: "120%" }}
                transition={{ duration: 0.6, delay: 2.2, ease: "easeInOut" }}
              >
                ROOFTOP · 42 FLOORS
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="hidden md:block absolute bottom-[calc(18vh+14px)] right-[108px] text-[8px] tracking-[0.3em] text-[#C4956A]/85 z-10 font-[family-name:var(--font-josefin)] text-right uppercase"
            >
              SPACE 001
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="hidden md:block absolute right-[38px] bottom-[90px] text-[8px] tracking-[0.55em] uppercase text-[#F2EBE0]/75 z-10 [writing-mode:vertical-rl] font-[family-name:var(--font-josefin)]"
            >
              Kolkata · West Bengal · By Appointment
            </motion.div>

            {/* ══════════════════════════════════════════════
                MAIN CONTENT — ALWAYS FIXED
                Like a massive rooftop banner/hoarding on
                a skyscraper — text never moves, world
                behind it transforms
            ══════════════════════════════════════════════ */}
            <div className="relative z-10 max-w-7xl">

              {/* Eyebrow / atelier label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex items-center gap-4 text-[9px] tracking-[0.55em] uppercase text-[#E5BA8F] mb-6 font-[family-name:var(--font-cinzel)]"
              >
                <div className="w-9 h-[1px] bg-gradient-to-r from-[#88A492] to-[#E5BA8F]" />
                Kolkata&apos;s Premier Design Atelier
              </motion.div>

              {/* THE URBANO — rooftop signage typography */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="font-[family-name:var(--font-cormorant)] text-[clamp(58px,10.5vw,155px)] leading-[0.85] uppercase tracking-[-0.01em] font-light"
              >
                {/* "THE" — lighter secondary word, like the bracket on a sign */}
                <span className="block text-[#F2EBE0]">THE</span>

                {/* "URBANO" — hollow stroke, like cut-metal letters on a building facade.
                    After the building reveal, glows golden like an illuminated sign */}
                <motion.div
                  className="block mt-2 md:mt-4"
                  animate={revealed ? {
                    filter: "drop-shadow(0 0 28px rgba(196,149,106,0.50))",
                  } : {
                    filter: "drop-shadow(0 0 0px rgba(196,149,106,0))",
                  }}
                  transition={{ delay: 2.5, duration: 1.8, ease: "easeOut" }}
                >
                  <span
                    style={{
                      WebkitTextStroke: "1.8px #E5BA8F",
                      color: "transparent",
                      display: "block",
                    }}
                  >
                    URBANO
                  </span>
                </motion.div>
              </motion.h1>

              {/* Horizontal rule */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
                transition={{ delay: 1.6, duration: 1 }}
                className="h-[1px] bg-gradient-to-r from-[#88A492] via-[#E5BA8F] to-transparent my-6 md:my-8"
              />

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="flex flex-wrap items-center gap-6 md:gap-10"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl text-[#F2EBE0] font-normal">230</span>
                  <span className="text-[8px] tracking-[0.45em] uppercase text-[#F2EBE0]/70 font-[family-name:var(--font-josefin)]">Projects</span>
                </div>
                <div className="w-[1px] h-8 bg-[#C4956A]/60 hidden md:block" />
                <div className="flex flex-col gap-1">
                  <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl text-[#F2EBE0] font-normal">4.9★</span>
                  <span className="text-[8px] tracking-[0.45em] uppercase text-[#F2EBE0]/70 font-[family-name:var(--font-josefin)]">Google Rating</span>
                </div>
                <div className="w-[1px] h-8 bg-[#C4956A]/60 hidden md:block" />
                <div className="flex flex-col gap-1">
                  <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl text-[#F2EBE0] font-normal">50K</span>
                  <span className="text-[8px] tracking-[0.45em] uppercase text-[#F2EBE0]/70 font-[family-name:var(--font-josefin)]">Sq Ft Designed</span>
                </div>
              </motion.div>

            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
              <div className="w-[1px] h-12 bg-[#C4956A]/50 relative overflow-hidden">
                <motion.div
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-full h-full bg-[#C4956A]"
                />
              </div>
              <span className="text-[7px] tracking-[0.5em] uppercase text-[#F2EBE0]/70 font-[family-name:var(--font-josefin)]">Explore</span>
            </motion.div>

          </div>

          {/* ── Rest of page sections ── */}
          <LuxuryCategories />
          <MaterialPalette />
          <WhyChooseUs />
          <DesignProcess />
          <AIVisualizer />
          <Gallery />
          <Testimonials />
          <ContactFooter />

        </div>
      )}
    </main>
  );
}