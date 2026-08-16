"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function SideBars() {
  const { scrollYProgress } = useScroll();
  
  // Spring animation lagaya hai taaki scroll scale ekdum smooth fill ho
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Left Scale Bar - Hamesha dikhne wala halka background */}
      <div className="fixed left-[20px] md:left-[30px] top-0 w-[3px] h-full bg-[#8cc63f]/10 z-[40] hidden md:block">
        {/* Scroll karne par Green color se fill hoga (Top to Bottom) */}
        <motion.div 
          style={{ scaleY, transformOrigin: "top" }}
          className="w-full h-full bg-[#8cc63f] shadow-[0_0_10px_#8cc63f]"
        />
      </div>
      
      {/* Right Scale Bar - Hamesha dikhne wala halka background */}
      <div className="fixed right-[20px] md:right-[30px] top-0 w-[3px] h-full bg-[#ffc905]/10 z-[40] hidden md:block">
        {/* Scroll karne par Yellow color se fill hoga (Top to Bottom) */}
        <motion.div 
          style={{ scaleY, transformOrigin: "top" }}
          className="w-full h-full bg-[#ffc905] shadow-[0_0_10px_#ffc905]"
        />
      </div>

      {/* Decorative Text Elements - Hamesha dikhenge aur dark kiye hain */}
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-[40] hidden lg:block opacity-70">
        <p className="text-[9px] tracking-[0.5em] uppercase text-[#1a1a1a] [writing-mode:vertical-rl] rotate-180 font-bold">
          Luxury <span className="text-[#8cc63f]">Interiors</span> Atelier
        </p>
      </div>

      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-[40] hidden lg:block opacity-70">
        <p className="text-[9px] tracking-[0.5em] uppercase text-[#1a1a1a] [writing-mode:vertical-rl] font-bold">
          Est. 2021 <span className="text-[#ffc905]">Pan India</span>
        </p>
      </div>
    </>
  );
}