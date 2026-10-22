"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * FloatingButtons
 * Fixed bottom-right stack:
 *   [AI orb]        — expands card (absolutely positioned so orb never moves)
 *   [WhatsApp orb]  — links to wa.me
 *
 * Brand palette: dark green #0d1a10, gold #C4956A / #E5BA8F
 */
export default function AIFloatingBadge() {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible]   = useState(false);

  // Fade in → auto-expand once → auto-collapse
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),  1400);
    const t2 = setTimeout(() => setExpanded(true),  4500);
    const t3 = setTimeout(() => setExpanded(false), 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // WhatsApp number
  const WA_NUMBER = "919583529847";
  const WA_MSG    = encodeURIComponent("Hello! I'm interested in your interior design services.");
  const WA_HREF   = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

  if (!visible) return null;

  // Orb size
  const ORB = 56;
  const RIGHT = "clamp(14px, 3vw, 32px)";
  const BOTTOM_WA = "clamp(20px, 4vw, 36px)";
  // AI orb sits directly above WhatsApp orb
  const BOTTOM_AI = `calc(${BOTTOM_WA} + ${ORB}px + 12px)`;

  return (
    <>
      {/* ══════════════════════════════════════════
          AI EXPANDED CARD — absolutely positioned
          independently so the AI orb NEVER moves
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="ai-card"
            initial={{ opacity: 0, y: 10, scale: 0.94, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" }}
            exit={{    opacity: 0, y: 8,  scale: 0.95, filter: "blur(3px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[800] flex flex-col gap-2.5 px-4 py-4 rounded-2xl overflow-hidden"
            style={{
              // Anchored so its bottom aligns with bottom of AI orb
              bottom: `calc(${BOTTOM_AI} + ${ORB}px + 8px)`,
              right: RIGHT,
              width: "min(240px, calc(100vw - 80px))",
              // Brand palette: very dark green card with gold accents
              background: "linear-gradient(150deg, #0f1e12 0%, #122416 60%, #0d1a10 100%)",
              border: "1px solid rgba(196,149,106,0.30)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.55), 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(229,186,143,0.12)",
              pointerEvents: "auto",
            }}
          >
            {/* shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(110deg, transparent 20%, rgba(196,149,106,0.06) 50%, transparent 80%)" }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
            />

            {/* header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px]"
                  style={{
                    background: "linear-gradient(135deg, #C4956A, #E5BA8F)",
                    boxShadow: "0 2px 8px rgba(196,149,106,0.40)",
                    color: "#0d1a10",
                  }}
                >✦</div>
                <span
                  className="text-[9px] tracking-[.38em] uppercase font-bold font-[family-name:var(--font-cinzel)]"
                  style={{ color: "#E5BA8F" }}
                >
                  AI Studio
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ background: "#C4956A", boxShadow: "0 0 6px rgba(196,149,106,0.9)" }}
                  animate={{ opacity: [1, .25, 1], scale: [1, .8, 1] }}
                  transition={{ duration: 1.3, repeat: Infinity }}
                />
                <span
                  className="text-[7px] tracking-[.25em] uppercase font-[family-name:var(--font-josefin)]"
                  style={{ color: "rgba(196,149,106,0.80)" }}
                >Live</span>
              </div>
            </div>

            {/* divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(196,149,106,0.35), transparent)" }} />

            {/* desc */}
            <p
              className="text-[11px] leading-[1.70] font-[family-name:var(--font-josefin)]"
              style={{ color: "rgba(242,235,224,0.75)", letterSpacing: ".03em" }}
            >
              Upload your room photo — our AI will redesign it as a luxury interior in seconds.
            </p>

            {/* CTA */}
            <Link
              href="/visualizer"
              className="flex items-center justify-between px-4 py-[9px] rounded-xl"
              style={{
                background: "linear-gradient(90deg, #C4956A, #E5BA8F)",
                boxShadow: "0 4px 16px rgba(196,149,106,0.35)",
              }}
              onClick={() => setExpanded(false)}
            >
              <span
                className="text-[9px] tracking-[.35em] uppercase font-bold font-[family-name:var(--font-cinzel)]"
                style={{ color: "#0d1a10" }}
              >Try it free</span>
              <motion.span
                className="text-sm font-bold"
                style={{ color: "rgba(13,26,16,0.80)" }}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >→</motion.span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          AI ORB — fixed, NEVER moves on expand
      ══════════════════════════════════════════ */}
      <AIOrb
        expanded={expanded}
        onToggle={() => setExpanded(v => !v)}
        bottom={BOTTOM_AI}
        right={RIGHT}
        size={ORB}
      />

      {/* ══════════════════════════════════════════
          WHATSAPP ORB
      ══════════════════════════════════════════ */}
      <WhatsAppOrb href={WA_HREF} bottom={BOTTOM_WA} right={RIGHT} size={ORB} />
    </>
  );
}

/* ─────────────────────────────────────
   AI Orb sub-component
   Brand: deep dark + gold palette
───────────────────────────────────── */
function AIOrb({
  expanded, onToggle, bottom, right, size,
}: {
  expanded: boolean;
  onToggle: () => void;
  bottom: string;
  right: string;
  size: number;
}) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed z-[800] flex items-center justify-center rounded-full shrink-0 cursor-pointer border-none outline-none"
      style={{
        bottom,
        right,
        width: size,
        height: size,
        // Brand: dark green body with gold ring feel
        background: "radial-gradient(circle at 35% 32%, #1e3a22 0%, #122416 45%, #0d1a10 100%)",
        boxShadow: expanded
          ? "0 0 0 1.5px rgba(196,149,106,0.70), 0 8px 32px rgba(196,149,106,0.30), inset 0 1px 0 rgba(229,186,143,0.20)"
          : "0 0 0 1.5px rgba(196,149,106,0.30), 0 10px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(229,186,143,0.15)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, boxShadow: "0 0 0 1.5px rgba(196,149,106,0.70), 0 12px 36px rgba(196,149,106,0.25), inset 0 1px 0 rgba(229,186,143,0.20)" }}
      whileTap={{ scale: 0.94 }}
      title="AI Design Studio"
    >
      {/* rotating dashed gold ring */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: -9,
          borderRadius: "50%",
          border: "1.5px dashed rgba(196,149,106,0.40)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      {/* pulse 1 — gold */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ inset: 0, borderRadius: "50%", border: "1.5px solid rgba(196,149,106,0.55)" }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.65, 0, 0.65] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* pulse 2 — gold, delayed */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ inset: 0, borderRadius: "50%", border: "1px solid rgba(196,149,106,0.28)" }}
        animate={{ scale: [1, 2.1, 1], opacity: [0.40, 0, 0.40] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      {/* icon */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-[3px]">
        <motion.div
          className="text-[15px] leading-none"
          style={{ color: "#E5BA8F", filter: "drop-shadow(0 0 6px rgba(196,149,106,0.6))" }}
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.10, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >✦</motion.div>
        <span
          className="text-[7px] tracking-[.22em] uppercase font-bold leading-none font-[family-name:var(--font-cinzel)]"
          style={{ color: "rgba(229,186,143,0.90)" }}
        >AI</span>
      </div>

      {/* subtle glass highlight */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 38% 28%, rgba(229,186,143,0.12) 0%, transparent 60%)" }}
      />
    </motion.button>
  );
}

/* ─────────────────────────────────────
   WhatsApp Orb sub-component
───────────────────────────────────── */
function WhatsAppOrb({ href, bottom, right, size }: { href: string; bottom: string; right: string; size: number }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-[800] flex items-center justify-center rounded-full shrink-0 cursor-pointer"
      style={{
        bottom,
        right,
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 32%, #43d854 0%, #25d366 45%, #1aab52 100%)",
        boxShadow: "0 0 0 2px rgba(37,211,102,.28), 0 10px 32px rgba(37,211,102,.42), inset 0 1px 0 rgba(255,255,255,.30)",
        textDecoration: "none",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.91 }}
      title="Chat on WhatsApp"
    >
      {/* rotating dashed ring */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ inset: -9, borderRadius: "50%", border: "1.5px dashed rgba(37,211,102,.50)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      {/* pulse 1 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ inset: 0, borderRadius: "50%", border: "2px solid rgba(37,211,102,.65)" }}
        animate={{ scale: [1, 1.65, 1], opacity: [.70, 0, .70] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {/* pulse 2 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ inset: 0, borderRadius: "50%", border: "1px solid rgba(37,211,102,.30)" }}
        animate={{ scale: [1, 2.1, 1], opacity: [.40, 0, .40] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.85 }}
      />

      {/* Official WhatsApp SVG logo */}
      <div className="relative z-10 w-[30px] h-[30px]">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M16.002 2C8.27 2 2 8.268 2 15.998c0 2.49.652 4.83 1.792 6.858L2 30l7.338-1.766A13.945 13.945 0 0 0 16.002 30C23.73 30 30 23.732 30 16.002 30 8.27 23.73 2 16.002 2z"
            fill="#fff"
          />
          <path
            d="M16.002 4.4c6.398 0 11.6 5.2 11.6 11.602 0 6.398-5.202 11.598-11.6 11.598a11.56 11.56 0 0 1-5.892-1.61l-.422-.25-4.354 1.048 1.078-4.24-.276-.438A11.54 11.54 0 0 1 4.4 16.002c0-6.4 5.202-11.602 11.602-11.602z"
            fill="#25D366"
          />
          <path
            d="M12.016 10.4c-.26-.58-.534-.592-.782-.602-.202-.008-.434-.008-.666-.008-.232 0-.608.088-.926.44-.318.35-1.214 1.186-1.214 2.89s1.242 3.352 1.416 3.584c.174.232 2.408 3.84 5.944 5.228 2.942 1.16 3.538.928 4.176.87.638-.058 2.058-.842 2.348-1.656.29-.814.29-1.512.202-1.656-.086-.144-.318-.232-.666-.406-.348-.174-2.058-1.016-2.378-1.132-.318-.116-.55-.174-.782.174-.232.348-.898 1.132-1.1 1.364-.202.232-.404.26-.752.086-.348-.174-1.468-.542-2.796-1.724-1.034-.92-1.732-2.056-1.936-2.404-.202-.348-.022-.536.152-.708.156-.156.348-.406.522-.608.174-.202.232-.348.348-.58.116-.232.058-.436-.028-.608-.088-.174-.76-1.886-1.05-2.578z"
            fill="#fff"
          />
        </svg>
      </div>

      {/* glass highlight */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 38% 28%, rgba(255,255,255,.25) 0%, transparent 60%)" }}
      />
    </motion.a>
  );
}
