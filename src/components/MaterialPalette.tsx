"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSettings } from "@/lib/settingsData";

const palettes = [
  { id: "linen", name: "Linen", color: "#D4C5B0", text: "#1a1a1a" },
  { id: "teak", name: "Teak", color: "#8B6343", text: "#ffffff" },
  { id: "travertine", name: "Travertine", color: "#E4DDD4", text: "#1a1a1a" },
  { id: "brass", name: "Brass", color: "#C4956A", text: "#1a1a1a" },
  { id: "sage", name: "Sage", color: "#88A492", text: "#ffffff" },
  { id: "charcoal", name: "Charcoal", color: "#3A3430", text: "#ffffff" },
  { id: "terracotta", name: "Terracotta", color: "#9E6052", text: "#ffffff" },
];

export default function MaterialPalette() {
  const [activePalette, setActivePalette] = useState(palettes[5]);
  const [images, setImages] = useState({
    img1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=85&auto=format&fit=crop",
    img3: "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600&q=85&auto=format&fit=crop",
    img4: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600&q=85&auto=format&fit=crop",
    img5: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&q=85&auto=format&fit=crop"
  });

  useEffect(() => {
    getSettings(
      ["materials_img_1", "materials_img_2", "materials_img_3", "materials_img_4", "materials_img_5"],
      {
        materials_img_1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop",
        materials_img_2: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=85&auto=format&fit=crop",
        materials_img_3: "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600&q=85&auto=format&fit=crop",
        materials_img_4: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600&q=85&auto=format&fit=crop",
        materials_img_5: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&q=85&auto=format&fit=crop"
      }
    ).then((vals) => {
      setImages({
        img1: vals.materials_img_1,
        img2: vals.materials_img_2,
        img3: vals.materials_img_3,
        img4: vals.materials_img_4,
        img5: vals.materials_img_5
      });
    });
  }, []);

  return (
    <motion.section 
      animate={{ backgroundColor: activePalette.color, color: activePalette.text }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="py-16 md:py-24 relative overflow-hidden" 
      id="materials"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Dynamic Header */}
        <div className="text-center mb-10 md:mb-16">
          <span 
            className="font-[family-name:var(--font-cinzel)] text-[8px] md:text-[10px] tracking-[0.5em] uppercase font-bold transition-opacity"
            style={{ opacity: 0.7 }}
          >
            Material Language
          </span>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-7xl mt-2 md:mt-3 font-light tracking-tight">
            The <span className="font-bold">Palette</span> We Speak
          </h2>
        </div>

        {/* COMPACT AESTHETIC GRID (Mobile aur Desktop dono par ek jaisa layout) */}
        <div className="grid grid-cols-4 grid-rows-2 gap-1 md:gap-1.5 h-[280px] sm:h-[400px] md:h-[500px] mb-12 md:mb-16">
          
          {/* Main Large Image (2x2) */}
          <div className="col-span-2 row-span-2 relative overflow-hidden group cursor-none">
            <img src={images.img1} alt="Living room" className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
            <span className="absolute bottom-3 left-3 md:bottom-6 md:left-6 font-[family-name:var(--font-cinzel)] text-[6px] md:text-[9px] tracking-[0.2em] md:tracking-[0.35em] uppercase text-white/90 drop-shadow-md z-10">Warm Wood & Travertine</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Small Grid Image 1 */}
          <div className="col-span-1 row-span-1 relative overflow-hidden group cursor-none">
            <img src={images.img2} alt="Detail" className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
            <span className="hidden md:block absolute bottom-4 left-4 font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-white/90 drop-shadow-md z-10">Aged Brass</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Small Grid Image 2 */}
          <div className="col-span-1 row-span-1 relative overflow-hidden group cursor-none">
            <img src={images.img3} alt="Texture" className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
            <span className="hidden md:block absolute bottom-4 left-4 font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-white/90 drop-shadow-md z-10">Handwoven Textiles</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Small Grid Image 3 */}
          <div className="col-span-1 row-span-1 relative overflow-hidden group cursor-none">
            <img src={images.img4} alt="Marble" className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
            <span className="hidden md:block absolute bottom-4 left-4 font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-white/90 drop-shadow-md z-10">Carrara Marble</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Small Grid Image 4 */}
          <div className="col-span-1 row-span-1 relative overflow-hidden group cursor-none">
            <img src={images.img5} alt="Greenery" className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
            <span className="hidden md:block absolute bottom-4 left-4 font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-white/90 drop-shadow-md z-10">Sage & Botanicals</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          </div>

        </div>

        {/* Theme Color Selectors (Interactive Swatches) */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-10">
          {palettes.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setActivePalette(mat)}
              className="group flex flex-col items-center gap-2 md:gap-4 cursor-none outline-none"
            >
              <div 
                className="w-8 h-8 md:w-16 md:h-16 rounded-[4px] transition-transform duration-300 relative"
                style={{ 
                  backgroundColor: mat.color,
                  transform: activePalette.id === mat.id ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
                  boxShadow: activePalette.id === mat.id ? '0 10px 25px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.1)',
                  border: `1.5px solid ${activePalette.id === mat.id ? activePalette.text : 'transparent'}`
                }}
              >
                {activePalette.id === mat.id && (
                  <div 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" 
                    style={{ backgroundColor: activePalette.text }} 
                  />
                )}
              </div>

              <span 
                className="font-[family-name:var(--font-cinzel)] text-[6px] md:text-[9px] tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-300"
                style={{ 
                  opacity: activePalette.id === mat.id ? 1 : 0.6,
                  fontWeight: activePalette.id === mat.id ? 700 : 400
                }}
              >
                {mat.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </motion.section>
  );
}