"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Track mouse coordinates
    const mouse = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Inner dot tracks coordinates instantly
      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    // Smooth outer ring follows with lerp latency via GSAP ticker
    const tick = () => {
      const dt = 0.14; // Lerping physics coefficient
      ringPos.x += (mouse.x - ringPos.x) * dt;
      ringPos.y += (mouse.y - ringPos.y) * dt;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    gsap.ticker.add(tick);

    // Hover interactive triggers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive = target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer, iframe");
      const isExploreCard = target.closest("#categories .group, #gallery .group, .relative.group");

      if (isInteractive) {
        gsap.to(ring, {
          scale: 1.5,
          borderColor: "#203a27",
          backgroundColor: "rgba(32, 58, 39, 0.05)",
          duration: 0.3,
        });
        gsap.to(dot, {
          scale: 0.5,
          backgroundColor: "#203a27",
          duration: 0.3,
        });
      } else if (isExploreCard) {
        gsap.to(ring, {
          scale: 2.2,
          borderColor: "#C4956A",
          backgroundColor: "rgba(196, 149, 106, 0.12)",
          duration: 0.3,
        });
        const badge = ring.querySelector(".cursor-badge");
        if (badge) {
          gsap.to(badge, { opacity: 1, scale: 1, duration: 0.3 });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive = target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer, iframe");
      const isExploreCard = target.closest("#categories .group, #gallery .group, .relative.group");

      if (isInteractive || isExploreCard) {
        gsap.to(ring, {
          scale: 1,
          borderColor: "#C4956A",
          backgroundColor: "transparent",
          duration: 0.3,
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "#C4956A",
          duration: 0.3,
        });
        const badge = ring.querySelector(".cursor-badge");
        if (badge) {
          gsap.to(badge, { opacity: 0, scale: 0.8, duration: 0.3 });
        }
      }
    };

    // Click interactive bounce triggers
    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1 });
      gsap.to(dot, { scale: 1.4, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.2 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tick);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {/* Inner Dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#C4956A] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
      {/* Outer Ring with interactive badge */}
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#C4956A]/60 rounded-full pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 hidden md:block flex items-center justify-center"
      >
        <span 
          className="cursor-badge font-[family-name:var(--font-cinzel)] text-[7px] tracking-widest text-[#C4956A] font-bold opacity-0 scale-75 transition-all duration-300"
        >
          VIEW
        </span>
      </div>
    </>
  );
}