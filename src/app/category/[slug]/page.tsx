"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import ContactFooter from "@/components/ContactFooter";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_CATEGORY_PHOTOS, 
  CategoryItem, 
  CategoryPhoto 
} from "@/lib/categoriesData";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [category, setCategory] = useState<CategoryItem | null>(null);
  const [photos, setPhotos] = useState<CategoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<CategoryPhoto | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // 1. Fetch category metadata from Supabase
      try {
        const { data: catData, error: catError } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", slug)
          .single();

        if (!catError && catData) {
          setCategory(catData);
        } else {
          // Fallback to default
          const found = DEFAULT_CATEGORIES.find((c) => c.slug === slug);
          setCategory(found || {
            slug,
            title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            description: "Curated architectural interiors crafted with timeless luxury and precision.",
            cover_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
          });
        }
      } catch (e) {
        console.warn("Category fetch fallback:", e);
      }

      // 2. Fetch category gallery photos from Supabase
      try {
        const { data: photoData, error: photoError } = await supabase
          .from("category_images")
          .select("*")
          .eq("category_slug", slug)
          .order("created_at", { ascending: false });

        if (!photoError && photoData && photoData.length > 0) {
          setPhotos(photoData);
        } else {
          // Fallback photos
          const defaultPhotos = DEFAULT_CATEGORY_PHOTOS[slug] || DEFAULT_CATEGORY_PHOTOS["residential"] || [];
          setPhotos(defaultPhotos);
        }
      } catch (e) {
        console.warn("Photo fetch fallback:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1a10] flex items-center justify-center text-[#C4956A] font-[family-name:var(--font-cinzel)] tracking-widest uppercase text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C4956A]/20 border-t-[#C4956A] rounded-full animate-spin"></div>
          <span>Unveiling Vision...</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-[#0d1a10] flex flex-col justify-between">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl text-white mb-4">
            Category Not Found
          </h1>
          <p className="font-[family-name:var(--font-josefin)] text-gray-400 text-sm mb-8">
            The design category you requested does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#C4956A] text-white rounded-full font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase font-bold"
          >
            ← Back to Home
          </Link>
        </div>
        <ContactFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col">

      {/* ── Dynamic Hero Section ── */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex flex-col justify-end px-6 md:px-24 pb-16 overflow-hidden bg-[#0d1a10] shrink-0">
        
        {/* Cover image background */}
        <div className="absolute inset-0 z-0">
          <img
            src={category.cover_image}
            alt={category.title}
            className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a10] via-[#0d1a10]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a10]/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.3em] text-[#C4956A] uppercase font-bold mb-4 hover:text-white transition-colors"
            >
              ← Back to Overview
            </Link>
            
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-8xl text-white font-light uppercase tracking-tight leading-none mb-4">
              {category.title}
            </h1>
            
            <p className="font-[family-name:var(--font-josefin)] text-sm md:text-lg text-gray-300 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Photo Gallery Grid Section ── */}
      <section className="py-20 md:py-28 px-6 md:px-24 flex-1">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.5em] text-[#C4956A] uppercase font-bold">
                Portfolio Showcase
              </span>
              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[#203a27] mt-2 font-light">
                Finished <span className="font-bold text-[#C4956A]">Projects</span> ({photos.length})
              </h2>
            </div>
            <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-500 max-w-sm">
              Click any photo to expand and view high-resolution details.
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-gray-700 font-bold mb-2">
                No Photos Uploaded Yet
              </h3>
              <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-400">
                The atelier owner can add photos to this category from the Admin Panel.
              </p>
            </div>
          ) : (
            <motion.div 
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]"
            >
              {photos.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => setSelectedPhoto(item)}
                  className="break-inside-avoid mb-6 relative rounded-[2rem] overflow-hidden group border border-[#C4956A]/15 bg-white cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(196,149,106,0.15)] hover:border-[#C4956A]/50 transition-all duration-500"
                >
                  <div className="relative w-full overflow-hidden min-h-[260px]">
                    <img
                      src={item.image_url}
                      alt={item.title || category.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  </div>

                  <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-widest text-[#C4956A] uppercase font-bold block mb-1">
                        {category.title}
                      </span>
                      <h4 className="font-[family-name:var(--font-cormorant)] text-xl font-bold text-[#17261a]">
                        {item.title || "Luxury Space Design"}
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#C4956A] group-hover:text-[#C4956A] transition-all">
                      ↗
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* ── iOS Lightbox Modal ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-[#0d1a10]/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[85vh] border border-[#C4956A]/20"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all"
              >
                ✕
              </button>

              <div className="w-full md:w-[65%] h-[40vh] md:h-[80vh] relative bg-black">
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title || category.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-[35%] p-8 flex flex-col justify-between bg-white overflow-y-auto">
                <div>
                  <span className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.3em] text-[#C4956A] uppercase font-bold">
                    {category.title}
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-bold text-[#17261a] mt-2 mb-4">
                    {selectedPhoto.title || category.title}
                  </h3>
                  <div className="w-12 h-[1px] bg-[#C4956A] mb-6" />
                  <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-600 leading-relaxed mb-6">
                    {selectedPhoto.description || category.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <a
                    href={selectedPhoto.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-5 py-2.5 bg-[#17261a] hover:bg-[#C4956A] text-white rounded-full font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest uppercase font-bold transition-colors"
                  >
                    View Original HD Photo ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ContactFooter />
    </main>
  );
}