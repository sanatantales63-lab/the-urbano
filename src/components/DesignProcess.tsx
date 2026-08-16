"use client";
import { useRef, useEffect, useState } from "react";

const steps = [
  { 
    num: "01", 
    title: "Discovery", 
    desc: "A deep conversation to understand your lifestyle, aspirations, and the emotions you want your home to hold.",
    img: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800&auto=format&fit=crop"
  },
  { 
    num: "02", 
    title: "Concept Design", 
    desc: "Space plans, mood boards, and 3D renders crafted exclusively for your home's unique story.",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop"
  },
  { 
    num: "03", 
    title: "Material Curation", 
    desc: "We source and sample materials from global artisans — every finish and fixture considered with obsessive care.",
    img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
  },
  { 
    num: "04", 
    title: "The Creation", 
    desc: "Our master craftsmen and certified contractors bring every render to life — supervised, precise, and breathtaking.",
    img: "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?q=80&w=800&auto=format&fit=crop"
  }
];

export default function DesignProcess() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Screen-size detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Desktop scroll engine (same approach as LuxuryCategories — position:fixed) ──
  useEffect(() => {
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    const track = trackRef.current;
    if (!wrapper || !inner || !track) return;

    // Make wrapper tall enough so user scrolls through all cards
    const getScrollAmt = () => {
      const trackParent = track.parentElement;
      if (!trackParent) return 0;
      return Math.max(0, track.scrollWidth - trackParent.offsetWidth);
    };

    const setHeight = () => {
      const scrollAmt = getScrollAmt();
      wrapper.style.height = `${window.innerHeight + scrollAmt}px`;
    };

    const onScroll = () => {
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const wrapperHeight = wrapper.offsetHeight;
      const scrollY = window.scrollY;
      const scrollAmt = Math.max(1, getScrollAmt());
      const sectionEnd = wrapperTop + wrapperHeight - window.innerHeight;

      if (scrollY < wrapperTop) {
        // ① Above section — panel sits at top of wrapper, no slide
        inner.style.position = "absolute";
        inner.style.top = "0px";
        inner.style.left = "0px";
        track.style.transform = "translate3d(0,0,0)";
        if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";

      } else if (scrollY <= sectionEnd) {
        // ② Inside section — fix to viewport, slide cards left
        inner.style.position = "fixed";
        inner.style.top = "0px";
        inner.style.left = "0px";
        const progress = scrollY - wrapperTop;
        const progressPct = Math.min(progress / scrollAmt, 1);
        track.style.transform = `translate3d(${-Math.min(progress, scrollAmt)}px,0,0)`;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progressPct})`;

      } else {
        // ③ Below section — panel anchored to bottom of wrapper, fully slid
        inner.style.position = "absolute";
        inner.style.top = `${wrapperHeight - window.innerHeight}px`;
        inner.style.left = "0px";
        track.style.transform = `translate3d(${-scrollAmt}px,0,0)`;
        if (progressRef.current) progressRef.current.style.transform = "scaleX(1)";
      }
    };

    setHeight();
    const resizeHandler = () => { setHeight(); onScroll(); };
    window.addEventListener("resize", resizeHandler, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial paint

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("scroll", onScroll);
      if (inner) { inner.style.position = ""; inner.style.top = ""; inner.style.left = ""; }
    };
  }, [isMobile]);

  // ── MOBILE: Vertical stacked cards ──
  if (isMobile) {
    return (
      <section
        className="bg-[#fafafa] border-t border-gray-100 px-5 pt-14 pb-16"
        id="packages"
      >
        <div className="mb-10">
          <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.45em] text-[#C4956A] uppercase font-bold">
            The Artisan Process
          </span>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-[#203a27] mt-3 font-light leading-tight">
            How We <span className="font-bold text-[#C4956A]">Design</span>
          </h2>
          <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-500 mt-4 leading-relaxed">
            From first conversation to final handover, we design spaces that resonate with your identity and comfort.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative w-full h-[260px] rounded-[2rem] overflow-hidden border border-[#C4956A]/20 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="absolute inset-0 z-0">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/45 z-[1]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-[2]"></div>
              </div>
              <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-[#C4956A] font-bold">Process</span>
                  <span className="font-[family-name:var(--font-cormorant)] text-4xl font-bold italic leading-none text-white/40">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-white font-medium mb-2">{step.title}</h3>
                  <p className="font-[family-name:var(--font-josefin)] text-[11px] text-gray-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── DESKTOP: Fixed-panel horizontal scroll (same pattern as LuxuryCategories) ──
  return (
    <div
      ref={wrapperRef}
      id="packages"
      className="relative border-t border-gray-100"
    >
      <div
        ref={innerRef}
        className="w-screen h-screen bg-[#fafafa] flex items-center overflow-hidden"
        style={{ position: "absolute", top: 0, left: 0, width: "100vw" }}
      >
        {/* Layout: Left header + Right sliding cards */}
        <div className="w-full h-full flex flex-row items-center justify-between px-24 py-16">
          
          {/* Left Pinned Header */}
          <div className="w-[30%] pr-12 flex flex-col justify-center shrink-0">
            <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.5em] text-[#C4956A] uppercase font-bold drop-shadow-sm">
              The Artisan Process
            </span>
            <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[#203a27] mt-3 font-light leading-tight">
              How We <br /><span className="font-bold text-[#C4956A]">Design</span>
            </h2>
            <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-500 mt-6 leading-relaxed">
              From first conversation to final handover, we design spaces that resonate with your identity and comfort.
            </p>
          </div>

          {/* Right Slider Section */}
          <div className="w-[65%] h-[65vh] flex items-center overflow-hidden relative">
            <div 
              ref={trackRef} 
              className="flex gap-8 pr-24 py-4 will-change-transform"
              style={{ transform: "translate3d(0, 0, 0)" }}
            >
              {steps.map((step) => (
                <div 
                  key={step.num} 
                  className="relative w-[380px] h-[55vh] rounded-[2.5rem] overflow-hidden group border border-[#C4956A]/20 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:border-[#C4956A]/50 hover:shadow-[0_25px_60px_rgba(196,149,106,0.12)] transition-all duration-500 shrink-0 cursor-grab active:cursor-grabbing will-change-transform"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                >
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform" 
                    />
                    <div className="absolute inset-0 bg-black/45 z-[1]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-[2]"></div>
                  </div>

                  <div className="relative z-10 h-full p-10 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.3em] uppercase text-[#C4956A] font-bold">
                        Process
                      </span>
                      <span className="font-[family-name:var(--font-cormorant)] text-5xl font-bold italic leading-none opacity-40 group-hover:opacity-100 group-hover:text-[#C4956A] transition-all duration-500">
                        {step.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-3xl text-white font-medium mb-3 group-hover:text-[#C4956A] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-10 left-24 right-24 h-[2px] bg-[#C4956A]/10">
          <div 
            ref={progressRef}
            className="h-full bg-gradient-to-r from-[#203a27] to-[#C4956A] origin-left will-change-transform" 
            style={{ transform: 'scaleX(0)' }}
          ></div>
        </div>
      </div>
    </div>
  );
}