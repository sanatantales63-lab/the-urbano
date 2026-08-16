"use client";
import { motion } from "framer-motion";
import Image from "next/image"; // Next.js ka optimized image tag

// Yeh data baad mein Admin Panel (Database) se aayega
const categoriesData = [
  {
    id: 1,
    title: "Modular Interiors",
    desc: "Functional kitchen, wardrobe and storage",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Full Home Interiors",
    desc: "Turnkey interior solutions for your home",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Luxury Interiors",
    desc: "Tailored interiors that redefine elegance",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Renovations",
    desc: "Expert solutions to upgrade your home",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function CategoriesGrid() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            One-stop shop for all things interiors
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Be it end-to-end interiors, renovation or modular solutions, we have it all for your home or office.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-[400px]"
            >
              {/* Image with Zoom */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              
              {/* Premium Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Text Content Floating on Image */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#8cc63f] transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {category.desc}
                </p>
                
                {/* Modern Arrow Indicator */}
                <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:text-[#8cc63f] transition-colors">
                  <span>Explore</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}