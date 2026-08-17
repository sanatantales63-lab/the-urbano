"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  desc: string;
  img: string;
  aspect: string; // Tailwind aspect class for masonry variations
}

const categories = [
  { id: "all", label: "All Masterpieces" },
  { id: "residential", label: "Residential" },
  { id: "pantry", label: "Pantry Section" },
  { id: "kitchen", label: "Modular Kitchen" },
  { id: "gym", label: "Gym" },
  { id: "salon", label: "Unisex Salon" }
];

const galleryImages: GalleryImage[] = [
  // 1. Residential (Living Room & Bedroom combined)
  {
    id: 1,
    title: "Neoclassical Living Suite",
    category: "residential",
    categoryLabel: "Residential",
    desc: "A spacious lounge balancing rich wood accents, warm ambient lighting, and luxurious velvet seating.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[4/3]"
  },
  {
    id: 2,
    title: "Minimalist Japandi Sanctuary",
    category: "residential",
    categoryLabel: "Residential",
    desc: "A low-profile bed accented by custom fluted wood panels and serene, earthy lighting.",
    img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[3/4]"
  },
  {
    id: 3,
    title: "Sun-Drenched Velvet Lounge",
    category: "residential",
    categoryLabel: "Residential",
    desc: "Chic double-height windows illuminating a curated collection of brass ornaments and custom rugs.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[3/4]"
  },
  {
    id: 4,
    title: "Bohemian Master Retreat",
    category: "residential",
    categoryLabel: "Residential",
    desc: "Warm oak finishes, linen curtains, and layered textures forming a perfect cozy sanctuary.",
    img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[16/10]"
  },
  {
    id: 5,
    title: "Contemporary Art-Deco Living Room",
    category: "residential",
    categoryLabel: "Residential",
    desc: "Curved velvet sofas surrounding an asymmetric copper fireplace mantle.",
    img: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[16/10]"
  },
  {
    id: 6,
    title: "Plush Bouclé Bedroom Suite",
    category: "residential",
    categoryLabel: "Residential",
    desc: "Neutral tones elevated with cozy bouclé headboards and brass reading sconces.",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-square"
  },

  // 2. Pantry Section
  {
    id: 7,
    title: "Bespoke Butler's Pantry",
    category: "pantry",
    categoryLabel: "Pantry Section",
    desc: "Custom oak cabinetry with concealed storage, marble splashback, and integrated warm strip lighting.",
    img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[4/5]"
  },
  {
    id: 8,
    title: "Travertine Coffee & Pantry Vault",
    category: "pantry",
    categoryLabel: "Pantry Section",
    desc: "Soft directional lighting accentuating raw travertine counters and open timber shelves.",
    img: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-square"
  },
  {
    id: 9,
    title: "Artisanal Spice & Pantry Lounge",
    category: "pantry",
    categoryLabel: "Pantry Section",
    desc: "Floor-to-ceiling glass-front cabinetry with brass inlays and organized culinary storage.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[3/4]"
  },

  // 3. Modular Kitchen
  {
    id: 10,
    title: "Urban Emerald Culinary Hub",
    category: "kitchen",
    categoryLabel: "Modular Kitchen",
    desc: "Deep forest green cabinetry paired with luxurious gold handles and quartz countertops.",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[16/9]"
  },
  {
    id: 11,
    title: "Matte Charcoal & Oak Kitchen",
    category: "kitchen",
    categoryLabel: "Modular Kitchen",
    desc: "Sleek handleless drawers, integrated smart appliances, and custom breakfast bar.",
    img: "https://images.unsplash.com/photo-1556909212-d5b604d7c99d?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[3/4]"
  },
  {
    id: 12,
    title: "Monolithic Quartz Island Suite",
    category: "kitchen",
    categoryLabel: "Modular Kitchen",
    desc: "A massive statement island piece serving as the center social hub of the kitchen space.",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[4/3]"
  },

  // 4. Gym
  {
    id: 13,
    title: "Private Luxury Fitness Studio",
    category: "gym",
    categoryLabel: "Gym",
    desc: "State-of-the-art fitness space with acoustic wood slatting, mirror walls, and ambient LED lights.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[4/5]"
  },
  {
    id: 14,
    title: "High-Performance Athletic Studio",
    category: "gym",
    categoryLabel: "Gym",
    desc: "Custom rubberized flooring, integrated cardio stations, and sleek ambient cove lighting.",
    img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[4/3]"
  },

  // 5. Unisex Salon
  {
    id: 15,
    title: "High-End Unisex Styling Salon",
    category: "salon",
    categoryLabel: "Unisex Salon",
    desc: "Custom vanity stations with illuminated arch mirrors, gold metallic accents, and plush hydraulic chairs.",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[3/4]"
  },
  {
    id: 16,
    title: "Bespoke Grooming & Wellness Lounge",
    category: "salon",
    categoryLabel: "Unisex Salon",
    desc: "Sophisticated unisex salon lounge featuring marble wash stations, fluted glass partitions, and mood lighting.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop",
    aspect: "aspect-[16/10]"
  }
];

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imagesList, setImagesList] = useState<GalleryImage[]>(galleryImages);

  useEffect(() => {
    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((item: any) => {
            let cat = item.category;
            let catLabel = item.category_label || item.category;

            // Backwards compatibility for legacy gym_salon category
            if (cat === "gym_salon") {
              const fullText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
              const isSalon = fullText.includes("salon") || fullText.includes("grooming") || fullText.includes("hair") || fullText.includes("styling");
              cat = isSalon ? "salon" : "gym";
              catLabel = isSalon ? "Unisex Salon" : "Gym";
            }

            return {
              id: item.id,
              title: item.title,
              category: cat,
              categoryLabel: catLabel,
              desc: item.description || "",
              img: item.image_url,
              aspect: item.aspect || "aspect-[4/3]"
            };
          });
          setImagesList(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch gallery, using static fallback:", err);
      }
    }
    loadGallery();
  }, []);

  const filteredImages = activeTab === "all"
    ? imagesList
    : imagesList.filter((img) => img.category === activeTab);

  // Lightbox carousel state: images in the same filter category (or all if activeTab is all)
  const relativeImages = activeTab === "all"
    ? imagesList
    : imagesList.filter((img) => img.category === activeTab);

  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden" id="gallery">
      {/* Decorative Blur Background element */}
      <div className="absolute top-[20%] left-[-10vw] w-[40vw] h-[40vw] bg-[#C4956A]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10vw] w-[40vw] h-[40vw] bg-[#203a27]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.5em] text-[#C4956A] uppercase font-bold drop-shadow-sm">
            Visual Inspiration
          </span>
          <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[#203a27] mt-3 font-light">
            Design <span className="font-bold text-[#C4956A]">Gallery</span>
          </h2>
          <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-500 max-w-md mx-auto mt-4 leading-relaxed">
            Browse through our puzzle of finished luxury projects. Filter by space and click to view full architectural details.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex justify-center items-center mb-12 flex-wrap gap-2 sm:gap-3">
          <div className="flex bg-white p-1.5 rounded-full border border-[#C4956A]/10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative px-6 py-2.5 rounded-full font-[family-name:var(--font-cinzel)] text-[9px] sm:text-[10px] tracking-widest uppercase transition-all duration-300 font-bold ${
                    isActive ? "text-white" : "text-gray-500 hover:text-[#203a27]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGalleryTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#203a27] to-[#17261a] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Puzzle Staggered Masonry Grid */}
        <motion.div 
          layout
          className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-6 [column-fill:_balance] box-border w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layoutId={`card-container-${image.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedImage(image)}
                className="break-inside-avoid mb-3 sm:mb-6 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden group border border-[#C4956A]/10 bg-white cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-[#C4956A]/40 hover:shadow-[0_20px_50px_rgba(196,149,106,0.1)] transition-all duration-500 will-change-transform"
              >
                {/* Image Wrap */}
                <div className={`relative w-full ${image.aspect} overflow-hidden`}>
                  <img
                    src={image.img}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10"></div>
                </div>

                {/* Info Overlay (Fades in on hover) */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end">
                  <span className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-widest text-[#C4956A] uppercase font-bold mb-1">
                    {image.categoryLabel}
                  </span>
                  <h4 className="font-[family-name:var(--font-cormorant)] text-xl font-bold leading-tight mb-2">
                    {image.title}
                  </h4>
                  <p className="font-[family-name:var(--font-josefin)] text-[10px] text-gray-300 leading-relaxed line-clamp-2">
                    {image.desc}
                  </p>
                </div>

                {/* Static indicator for Mobile/Non-hover states (Clean Minimal Bar) */}
                <div className="p-3 sm:p-5 border-t border-gray-50 flex items-center justify-between group-hover:bg-[#203a27]/5 transition-colors duration-500">
                  <div>
                    <span className="font-[family-name:var(--font-cinzel)] text-[7px] sm:text-[8px] tracking-widest text-[#C4956A] uppercase font-bold">
                      {image.categoryLabel}
                    </span>
                    <h4 className="font-[family-name:var(--font-cormorant)] text-xs sm:text-base font-bold text-gray-800 leading-tight">
                      {image.title}
                    </h4>
                  </div>
                  <div className="hidden sm:flex w-8 h-8 rounded-full border border-gray-100 items-center justify-center text-gray-400 group-hover:border-[#C4956A] group-hover:text-[#C4956A] transition-all shrink-0 ml-2">
                    →
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* iOS-Style Expanding Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-[#122416]/85 backdrop-blur-md"
            />

            {/* Expanding Card */}
            <motion.div
              layoutId={`card-container-${selectedImage.id}`}
              className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.3)] z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] border border-[#C4956A]/20"
            >
              {/* Close Button (Floating) */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all border border-gray-200/50 hover:scale-105 active:scale-95"
              >
                ✕
              </button>

              {/* Left Side: Large image display */}
              <div className="w-full md:w-[60%] h-[35vh] md:h-[85vh] relative bg-[#fafafa]">
                <motion.img
                  key={selectedImage.img}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={selectedImage.img}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Floating label on Image */}
                <div className="absolute bottom-6 left-8 text-white">
                  <span className="px-3 py-1 bg-[#C4956A] rounded-full font-[family-name:var(--font-cinzel)] text-[8px] tracking-widest uppercase font-bold shadow-sm">
                    {selectedImage.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Right Side: Details & Other Images carousel */}
              <div className="w-full md:w-[40%] p-8 md:p-10 flex flex-col justify-between bg-white overflow-y-auto">
                <div>
                  <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.3em] text-[#C4956A] uppercase font-bold">
                    Project File
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-bold text-[#203a27] mt-2 mb-4 leading-tight">
                    {selectedImage.title}
                  </h3>
                  <div className="w-12 h-[1px] bg-[#C4956A] mb-6"></div>
                  <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-500 leading-relaxed mb-8">
                    {selectedImage.desc}
                  </p>
                </div>

                {/* iPhone style Thumbnail Tray: Click to switch image */}
                <div>
                  <h5 className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.35em] text-gray-400 uppercase font-bold mb-4">
                    Other Inspirations ({relativeImages.length})
                  </h5>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none mask-right">
                    {relativeImages.map((relImg) => {
                      const isCurrent = relImg.id === selectedImage.id;
                      return (
                        <div
                          key={relImg.id}
                          onClick={() => setSelectedImage(relImg)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 transition-all duration-300 ${
                            isCurrent
                              ? "border-[#C4956A] scale-95 shadow-md shadow-[#C4956A]/20"
                              : "border-transparent opacity-60 hover:opacity-100 hover:scale-95"
                          }`}
                        >
                          <img
                            src={relImg.img}
                            alt={relImg.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
