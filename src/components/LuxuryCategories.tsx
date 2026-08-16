"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedCategories, DEFAULT_CATEGORIES, CategoryItem } from "@/lib/categoriesData";

export default function LuxuryCategories() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const [featuredCats, setFeaturedCats] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [isMobile, setIsMobile] = useState(false);

  // Screen-size detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch categories
  useEffect(() => {
    getFeaturedCategories().then((items) => {
      if (items?.length) setFeaturedCats(items);
    });
  }, []);

  // ── Desktop scroll engine (position:fixed avoids overflow-x:hidden issue) ──
  useEffect(() => {
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    const inner   = innerRef.current;
    const track   = trackRef.current;
    if (!wrapper || !inner || !track) return;

    // Make wrapper tall enough so user scrolls through all cards
    const setHeight = () => {
      const scrollAmt = Math.max(0, track.scrollWidth - window.innerWidth);
      wrapper.style.height = `${window.innerHeight + scrollAmt}px`;
    };

    const onScroll = () => {
      const wrapperTop    = wrapper.getBoundingClientRect().top + window.scrollY;
      const wrapperHeight = wrapper.offsetHeight;
      const scrollY       = window.scrollY;
      const scrollAmt     = Math.max(1, track.scrollWidth - window.innerWidth);
      const sectionEnd    = wrapperTop + wrapperHeight - window.innerHeight;

      if (scrollY < wrapperTop) {
        // ① Above section — panel sits at top of wrapper, no slide
        inner.style.position = "absolute";
        inner.style.top = "0px";
        inner.style.left = "0px";
        track.style.transform = "translate3d(0,0,0)";

      } else if (scrollY <= sectionEnd) {
        // ② Inside section — fix to viewport, slide cards left
        inner.style.position = "fixed";
        inner.style.top = "0px";
        inner.style.left = "0px";
        const progress = scrollY - wrapperTop;
        track.style.transform = `translate3d(${-Math.min(progress, scrollAmt)}px,0,0)`;

      } else {
        // ③ Below section — panel anchored to bottom of wrapper, fully slid
        inner.style.position = "absolute";
        inner.style.top = `${wrapperHeight - window.innerHeight}px`;
        inner.style.left = "0px";
        track.style.transform = `translate3d(${-scrollAmt}px,0,0)`;
      }
    };

    setHeight();
    window.addEventListener("resize", () => { setHeight(); onScroll(); }, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial paint

    return () => {
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("scroll", onScroll);
      // Reset styles on unmount
      if (inner) { inner.style.position = ""; inner.style.top = ""; inner.style.left = ""; }
    };
  }, [isMobile, featuredCats]);

  // ── MOBILE: Native swipe row ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id="categories" className="bg-white border-t border-gray-100 py-14 px-5">
        <div className="mb-8">
          <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.5em] text-[#8cc63f] uppercase font-bold">
            Our Expertise
          </span>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-[#1a1a1a] mt-2 font-light">
            Design <span className="font-bold">Categories</span>
          </h2>
        </div>
        <div
          className="flex gap-4 pb-3 snap-x snap-mandatory"
          style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          {featuredCats.map((cat, idx) => (
            <Link
              key={cat.slug || idx}
              href={`/category/${cat.slug}`}
              className="relative w-[78vw] min-w-[78vw] h-[56vw] rounded-[1.5rem] overflow-hidden group shrink-0 block border border-gray-100 snap-center shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />
              <img src={cat.cover_image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute bottom-0 left-0 p-5 z-20">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-white font-bold">{cat.title}</h3>
                <span className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-widest text-[#8cc63f] uppercase font-bold mt-1 inline-block">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // ── DESKTOP: Fixed-panel horizontal scroll ──────────────────────────────────
  return (
    /*
     * Outer wrapper — deliberately tall so page has scroll room.
     * Height = 100vh + horizontal scroll distance (set by JS above).
     * The inner panel uses position:fixed (set by JS) to stay in viewport.
     * position:fixed bypasses overflow-x:hidden on html/body.
     */
    <div
      ref={wrapperRef}
      id="categories"
      className="relative border-t border-gray-100"
    >
      <div
        ref={innerRef}
        className="w-screen h-screen bg-white flex flex-col justify-center overflow-hidden"
        style={{ position: "absolute", top: 0, left: 0, width: "100vw" }}
      >
        {/* Section Header */}
        <div className="px-10 md:px-20 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.5em] text-[#8cc63f] uppercase font-bold">
              Our Expertise
            </span>
            <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[#1a1a1a] mt-2 font-light">
              Design <span className="font-bold">Categories</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[#888888]">
            <span className="font-[family-name:var(--font-josefin)] text-[10px] tracking-widest uppercase">Scroll to explore</span>
            <div className="w-12 h-[1px] bg-[#8cc63f]" />
          </div>
        </div>

        {/* Horizontal sliding track */}
        <div
          ref={trackRef}
          className="flex gap-8 px-10 md:px-20 w-max will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {featuredCats.map((cat, idx) => (
            <Link
              key={cat.slug || idx}
              href={`/category/${cat.slug}`}
              className="relative w-[400px] lg:w-[450px] h-[55vh] rounded-[2.5rem] overflow-hidden group shrink-0 border border-gray-100 block shadow-[0_15px_40px_rgba(0,0,0,0.07)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.14)] transition-shadow duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={cat.cover_image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 right-8 z-20 font-[family-name:var(--font-cormorant)] text-5xl text-white/25 font-bold italic">
                0{idx + 1}
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-white mb-3 tracking-wide">
                  {cat.title}
                </h3>
                <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-300 mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center gap-3 font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.3em] uppercase text-[#8cc63f] font-bold">
                  <span className="border-b border-[#8cc63f] pb-1">Explore Category</span>
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}