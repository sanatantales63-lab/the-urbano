"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AIVisualizer() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState("Modern");
  const styles = ["Modern", "Minimalist", "Scandinavian", "Industrial", "Luxury"];

  const handleRedirect = () => {
    router.push(`/visualizer?style=${selectedStyle}`);
  };

  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden border-t border-[#8cc63f]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Luxury Header */}
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.5em] text-[#8cc63f] uppercase mb-4 display-block font-bold">
            AI-Powered Space Redesign
          </span>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl font-light text-[#1a1a1a] mb-4 mt-4 drop-shadow-sm">
            Visualize Your <span className="text-[#8cc63f]">Space</span>
          </h2>
          <div className="w-16 h-[1px] bg-[#8cc63f] mx-auto mb-6"></div>
          <p className="text-sm font-[family-name:var(--font-josefin)] text-[#666666] max-w-2xl mx-auto tracking-wide">
            Upload a photo of your room, pick an aesthetic style, and watch our artificial intelligence redesign it in real time while keeping the exact layout.
          </p>
          <div className="mt-4">
            <span className="inline-block bg-[#8cc63f]/10 text-[#8cc63f] text-[10px] font-bold font-[family-name:var(--font-cinzel)] tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#8cc63f]/25">
              🎁 New: Get 3 Free Credits on Signup
            </span>
          </div>
        </div>

        {/* Teaser Workspace Box */}
        <div className="bg-white border border-[#8cc63f]/20 rounded-[2rem] p-6 md:p-10 shadow-[0_10px_40px_rgba(140,198,63,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Controls Teaser */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl mb-4 text-[#1a1a1a]">1. Choose a Style</h3>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button 
                      key={style} 
                      onClick={() => setSelectedStyle(style)}
                      className={`px-6 py-2 rounded-full text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase transition-all border cursor-pointer ${
                        selectedStyle === style 
                          ? "bg-[#8cc63f] text-white border-[#8cc63f] shadow-md" 
                          : "bg-transparent text-[#666666] border-gray-200 hover:border-[#8cc63f]/50 hover:text-[#8cc63f]"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl mb-4 text-[#1a1a1a]">2. Upload Room Photo</h3>
                <div 
                  onClick={handleRedirect}
                  className="border-[1.5px] border-dashed border-[#8cc63f]/40 bg-[#f5f9f0] rounded-2xl h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-[#8cc63f]/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full border border-[#8cc63f] flex items-center justify-center mb-4 text-[#8cc63f] group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="font-[family-name:var(--font-josefin)] text-[#1a1a1a] tracking-wide text-sm font-semibold">Click to upload raw room photo</p>
                  <p className="font-[family-name:var(--font-josefin)] text-gray-500 text-xs mt-1">Supports PNG, JPG, JPEG</p>
                </div>
              </div>

              <button 
                onClick={handleRedirect}
                className="w-full py-4 rounded-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] shadow-lg font-[family-name:var(--font-cinzel)] font-bold text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                Sign Up & Generate Design
              </button>
            </div>

            {/* Right Display Teaser */}
            <div 
              onClick={handleRedirect}
              className="bg-[#fafafa] rounded-[1.5rem] border border-gray-200 flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[380px] cursor-pointer group"
            >
              {/* Split screen preview before / after */}
              <div className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop')" }}></div>
              <div className="absolute inset-0 bg-[#122416]/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-none flex flex-col items-center justify-center">
                <div className="bg-white/95 text-[#122416] font-[family-name:var(--font-cinzel)] font-bold text-[10px] tracking-[0.25em] uppercase px-6 py-3 rounded-full shadow-xl border border-[#C4956A]/20 transform group-hover:scale-110 transition-transform">
                  Launch Space Visualizer Dashboard →
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}