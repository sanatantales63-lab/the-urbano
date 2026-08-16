"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; // Supabase client import kiya

// Interface banayi taaki TypeScript ko pata chale data kaisa hai
interface Review {
  id: number;
  quote: string;
  author: string;
  location?: string;
  loc?: string;
  initial: string;
  rating: number;
}

// Fallback reviews in case database fetch fails
const fallbackReviews: Review[] = [
  {
    id: 1,
    quote: "The Urbano transformed our penthouse into a luxurious haven. Their attention to detail, material selection, and execution were absolutely flawless.",
    author: "Aarav Mehta",
    location: "Alipore, Kolkata",
    loc: "Alipore, Kolkata",
    initial: "A",
    rating: 5
  },
  {
    id: 2,
    quote: "Exceptional design sensibility. They turned our modular kitchen and living room into a functional work of art. Highly recommended for turnkey luxury interiors.",
    author: "Priya Sen",
    location: "Salt Lake, Kolkata",
    loc: "Salt Lake, Kolkata",
    initial: "P",
    rating: 5
  },
  {
    id: 3,
    quote: "From first render to final delivery, the team was professional, creative, and extremely precise. The material palette selection is truly world-class.",
    author: "Rajesh Singhania",
    location: "Ballygunge, Kolkata",
    loc: "Ballygunge, Kolkata",
    initial: "R",
    rating: 5
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [stories, setStories] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase se Data fetch karne ka function
  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setStories(data);
        } else {
          setStories(fallbackReviews);
        }
      } catch (error) {
        console.warn("Supabase fetch failed, loading fallback reviews:", error);
        setStories(fallbackReviews);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleNext = () => {
    if (current < stories.length - 1) setCurrent(current + 1);
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-[family-name:var(--font-cinzel)] text-[10px] tracking-widest text-[#C4956A] uppercase animate-pulse">
        Fetching Stories...
      </div>
    );
  }

  // Agar koi review na mile toh section dikhao hi mat
  if (stories.length === 0) return null;

  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden" id="stories">
      {/* Decorative Glows */}
      <div className="absolute top-[20%] left-[-10vw] w-[40vw] h-[40vw] bg-[#C4956A]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10vw] w-[40vw] h-[40vw] bg-[#203a27]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and summary */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.5em] text-[#C4956A] uppercase font-bold drop-shadow-sm mb-4">
              Client Diaries
            </span>
            <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[#203a27] font-light leading-tight">
              Our Happy <br className="hidden lg:block" /><span className="font-bold text-[#C4956A]">Clients</span>
            </h2>
            
            {/* Trust rating box */}
            <div className="mt-8 p-6 bg-white rounded-[2rem] border border-[#C4956A]/15 shadow-[0_15px_40px_rgba(0,0,0,0.02)] max-w-sm">
              <div className="flex items-center gap-1.5 text-[#C4956A] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">★</span>
                ))}
                <span className="font-[family-name:var(--font-cinzel)] text-[11px] tracking-widest text-[#203a27] font-bold ml-2">4.9 / 5</span>
              </div>
              <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-500 leading-relaxed">
                Trusted by 230+ homeowners across India. Curating luxury experiences and timeless details.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button 
                onClick={handlePrev}
                disabled={current === 0}
                className="w-12 h-12 rounded-full border border-[#C4956A]/30 flex items-center justify-center text-gray-500 hover:border-[#C4956A] hover:text-[#C4956A] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 hover:scale-105 active:scale-95"
              >
                ←
              </button>
              <button 
                onClick={handleNext}
                disabled={current === stories.length - 1}
                className="w-12 h-12 rounded-full border border-[#C4956A]/30 flex items-center justify-center text-gray-500 hover:border-[#C4956A] hover:text-[#C4956A] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 hover:scale-105 active:scale-95"
              >
                →
              </button>
              
              {/* Pagination Dots status */}
              <span className="font-[family-name:var(--font-josefin)] text-xs text-gray-400 ml-4">
                {current + 1} / {stories.length}
              </span>
            </div>
          </div>

          {/* Right Column: Carousel Card */}
          <div className="lg:col-span-7 relative flex justify-center items-center w-full min-h-[380px]">
            <AnimatePresence mode="wait">
              {stories.length > 0 && (
                <motion.div
                  key={stories[current].id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#C4956A]/20 shadow-[0_20px_50px_rgba(196,149,106,0.06)] relative overflow-hidden flex flex-col justify-between min-h-[340px]"
                >
                  {/* Decorative giant quote mark inside card */}
                  <div className="absolute top-4 right-10 font-[family-name:var(--font-cormorant)] text-[12rem] text-[#C4956A]/5 font-bold italic leading-none pointer-events-none select-none">
                    ”
                  </div>

                  <div>
                    {/* Stars inside the card */}
                    <div className="flex gap-0.5 mb-6 text-[#C4956A] text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < stories[current].rating ? "opacity-100" : "opacity-25"}>★</span>
                      ))}
                    </div>

                    <p className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl italic text-gray-800 leading-relaxed mb-8 font-light relative z-10">
                      "{stories[current].quote}"
                    </p>
                  </div>

                  {/* Profile section */}
                  <div className="flex items-center gap-4 relative z-10 border-t border-[#C4956A]/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#203a27] to-[#17261a] flex items-center justify-center font-[family-name:var(--font-cormorant)] text-lg font-bold text-white border border-[#C4956A]/30 uppercase">
                      {stories[current].initial}
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.2em] uppercase text-gray-800 font-bold">
                        {stories[current].author}
                      </h4>
                      <p className="font-[family-name:var(--font-josefin)] text-[9px] text-[#C4956A] mt-0.5 tracking-widest uppercase">
                        {stories[current].loc || stories[current].location || ""}
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}