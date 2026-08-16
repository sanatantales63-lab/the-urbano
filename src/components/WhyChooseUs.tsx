"use client";
import { motion } from "framer-motion";

const trustFactors = [
  {
    id: "01",
    title: "100+ Cities",
    desc: "Delivering beautiful homes across India with consistent quality.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
  },
  {
    id: "02",
    title: "20 Lakh+ Products",
    desc: "Endless premium choices for your home interior sourcing.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
  },
  {
    id: "03",
    title: "2,000+ Designers",
    desc: "Expert visionary designers to craft your dream space.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
  },
  {
    id: "04",
    title: "Lifetime Warranty",
    desc: "Uncompromising quality that lasts for generations.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
  },
  {
    id: "05",
    title: "45-Day Guarantee",
    desc: "Move into your new home on time, every single time.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
  },
  {
    id: "06",
    title: "146 Quality Checks",
    desc: "Zero compromises on your home's aesthetic and finish.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#fafafa] relative border-y border-gray-100 overflow-hidden" style={{ zIndex: 2, isolation: "isolate" }}>
      
      {/* Static Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-[#8cc63f]/10 to-[#ffc905]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.5em] text-[#8cc63f] uppercase font-bold">
              Our Promise
            </span>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[#1a1a1a] mt-2 font-light">
              Why Choose <span className="font-bold">The Urbano</span>
            </h2>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-gray-300 mx-6"></div>
          
          <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-500 max-w-sm text-center md:text-left">
            Delivering uncompromising quality and bespoke designs, tailored perfectly to your lifestyle.
          </p>
        </div>

        {/* Thin Pill-Shaped Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustFactors.map((factor, index) => (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-5 p-3 pr-6 rounded-full bg-white border border-gray-100 hover:border-[#8cc63f]/50 hover:shadow-[0_10px_20px_rgba(140,198,63,0.08)] transition-all duration-300 group cursor-none"
            >
              {/* Circular Icon Block */}
              <div className="w-16 h-16 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a1a] md:group-hover:text-white transition-colors duration-300 relative overflow-hidden">
                
                {/* 1. DESKTOP ANIMATION: Hover karne par fill hoga */}
                <div className="absolute inset-0 bg-[#ffc905] translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 hidden md:block"></div>

                {/* 2. MOBILE ANIMATION: Infinite Liquid Wave (Kyunki mobile me hover nahi hota) */}
                <motion.div 
                  animate={{ y: ["100%", "0%", "0%", "100%"] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    times: [0, 0.4, 0.6, 1], // Timing set ki hai taaki thodi der fill rahe
                    delay: index * 0.2 // Ek ke baad ek wave chalegi
                  }}
                  className="absolute inset-0 bg-[#ffc905] md:hidden z-0"
                ></motion.div>

                <div className="relative z-10">
                  {factor.icon}
                </div>
              </div>
              
              {/* Text Side */}
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-bold text-[#1a1a1a] leading-none mb-1 md:group-hover:text-[#8cc63f] transition-colors">
                  {factor.title}
                </h3>
                <p className="font-[family-name:var(--font-josefin)] text-[11px] text-gray-500 leading-snug line-clamp-2">
                  {factor.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}