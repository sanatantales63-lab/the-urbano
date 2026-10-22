"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set("#ld-logo",    { opacity: 0, scale: 0.82 });
    gsap.set("#ld-tagline", { opacity: 0, y: 10 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    tl
      .to("#ld-logo", {
        opacity: 1,
        scale: 1.04,
        duration: 0.55,
        ease: "power3.out",
      }, 0.15)
      .to("#ld-logo", {
        scale: 1,
        duration: 0.35,
        ease: "power2.inOut",
      }, 0.70)
      .to("#ld-tagline", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, 0.80)
      .to({}, { duration: 0.9 });

  }, { scope: loaderRef });

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
    >
      <div id="ld-logo" className="mb-5">
        <img
          src="/logo.png"
          alt="The Urbano"
          className="h-16 sm:h-20 md:h-24 w-auto object-contain"
          draggable={false}
        />
      </div>
      <div
        id="ld-tagline"
        className="font-[family-name:var(--font-cinzel)] font-bold text-[10px] sm:text-[13px] uppercase tracking-[0.48em] text-[#999]"
      >
        Interior  Design  Studio
      </div>
    </div>
  );
}