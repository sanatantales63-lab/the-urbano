"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  // Custom Cursor Logic
  useEffect(() => {
    const reticle = document.getElementById("reticle");
    const moveCursor = (e: MouseEvent) => {
      if (reticle) {
        reticle.style.left = e.clientX + "px";
        reticle.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  // GSAP Blueprint Animation
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          clipPath: "circle(0% at 50% 50%)",
          duration: 0.95,
          ease: "power4.inOut",
          onComplete: onComplete
        });
      }
    });

    gsap.set(".ld-bp-h", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".ld-bp-v", { scaleY: 0, transformOrigin: "top center" });
    gsap.set(".ld-corner", { scale: 0, opacity: 0 });
    gsap.set("#ld-title", { clipPath: "inset(0 100% 0 0)" });
    gsap.set("#ld-rule", { width: 0 });
    gsap.set("#ld-sub", { opacity: 0, y: 14 });
    gsap.set(".ld-spec", { opacity: 0 });
    gsap.set("#ld-scan", { x: -90, opacity: 0 });

    tl.to(".ld-bp-h", { scaleX: 1, duration: 0.8, stagger: 0.12, ease: "power2.inOut" }, 0.05)
      .to(".ld-bp-v", { scaleY: 1, duration: 0.8, stagger: 0.12, ease: "power2.inOut" }, 0.12)
      .to(".ld-corner", { scale: 1, opacity: 1, duration: 0.5, stagger: 0.07, ease: "back.out(2)" }, 0.55)
      .to("#ld-scan", { opacity: 1, duration: 0.2 }, 0.9)
      .to("#ld-scan", { x: "calc(100vw + 90px)", duration: 1.2, ease: "power2.inOut" }, 0.95)
      .to("#ld-title", { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power2.inOut" }, 0.95)
      .to("#ld-rule", { width: 200, duration: 0.7, ease: "power2.out" }, 1.55)
      .to("#ld-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 1.65)
      .to(".ld-spec", { opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 1.75)
      .to({}, { duration: 0.85 }); // hold
  }, { scope: loaderRef });

  return (
    <>
    
      {/* Blueprint Loader Full Screen */}
      <div ref={loaderRef} className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center font-[family-name:var(--font-josefin)] text-[#1a1a1a]" style={{ clipPath: "circle(150% at 50% 50%)" }}>
        {/* Horizontal Lines */}
        <div className="absolute h-[1px] w-full left-0 top-[20%] bg-[#8cc63f] opacity-20 ld-bp-h"></div>
        <div className="absolute h-[1px] w-full left-0 top-[40%] bg-[#8cc63f] opacity-20 ld-bp-h"></div>
        <div className="absolute h-[1px] w-full left-0 top-[60%] bg-[#8cc63f] opacity-20 ld-bp-h"></div>
        <div className="absolute h-[1px] w-full left-0 top-[80%] bg-[#8cc63f] opacity-20 ld-bp-h"></div>
        {/* Vertical Lines */}
        <div className="absolute w-[1px] h-full top-0 left-[20%] bg-[#8cc63f] opacity-20 ld-bp-v"></div>
        <div className="absolute w-[1px] h-full top-0 left-[40%] bg-[#8cc63f] opacity-20 ld-bp-v"></div>
        <div className="absolute w-[1px] h-full top-0 left-[60%] bg-[#8cc63f] opacity-20 ld-bp-v"></div>
        <div className="absolute w-[1px] h-full top-0 left-[80%] bg-[#8cc63f] opacity-20 ld-bp-v"></div>
        
        {/* Corners */}
        <div className="absolute w-5 h-5 md:w-7 md:h-7 border-[#ffc905] border-t-[1.5px] border-l-[1.5px] top-4 left-4 md:top-7 md:left-7 ld-corner"></div>
        <div className="absolute w-5 h-5 md:w-7 md:h-7 border-[#ffc905] border-t-[1.5px] border-r-[1.5px] top-4 right-4 md:top-7 md:right-7 ld-corner"></div>
        <div className="absolute w-5 h-5 md:w-7 md:h-7 border-[#ffc905] border-b-[1.5px] border-l-[1.5px] bottom-4 left-4 md:bottom-7 md:left-7 ld-corner"></div>
        <div className="absolute w-5 h-5 md:w-7 md:h-7 border-[#ffc905] border-b-[1.5px] border-r-[1.5px] bottom-4 right-4 md:bottom-7 md:right-7 ld-corner"></div>

       {/* Center Text */}
        <div className="relative text-center z-10 px-4 max-w-[100vw] overflow-hidden">
          <div className="relative overflow-visible flex justify-center">
            <div id="ld-scan" className="absolute top-[-20%] left-[-80px] w-[80px] h-[140%] bg-gradient-to-r from-transparent via-[#8cc63f] to-transparent opacity-50 z-[2] pointer-events-none"></div>
            <div id="ld-title" className="z-[1] relative flex justify-center items-center">
              <img src="/logo.png" alt="The Urbano" className="h-10 sm:h-14 md:h-20 w-auto object-contain" />
            </div>
          </div>
          <div id="ld-rule" className="h-[1px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#8cc63f] to-transparent"></div>
          <div id="ld-sub" className="font-[family-name:var(--font-cinzel)] text-[7px] md:text-[11px] tracking-[0.3em] md:tracking-[0.65em] text-[#8cc63f] uppercase mt-4">
            Interior Design · Kolkata
          </div>
        </div>

        {/* Small Specifications Text (Mobile pe hide kiya hai - hidden md:block) */}
        <div className="hidden md:block absolute bottom-7 right-10 text-right font-[family-name:var(--font-josefin)] text-[8.5px] tracking-[0.22em] text-[#8cc63f] opacity-70 ld-spec">SCALE 1:100 · REV. 01</div>
        <div className="hidden md:block absolute bottom-7 left-10 font-[family-name:var(--font-josefin)] text-[8.5px] tracking-[0.22em] text-[#8cc63f] opacity-70 ld-spec">DRAWN FOR YOU · 2026</div>
        <div className="hidden md:block absolute top-7 right-10 text-right font-[family-name:var(--font-josefin)] text-[8.5px] tracking-[0.22em] text-[#8cc63f] opacity-70 ld-spec">PROJECT INITIALIZATION</div>
      </div>
    </>
  );
}