"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Projects", value: "230+", icon: "🏗️", color: "from-blue-500/20 to-blue-500/0", border: "border-blue-500/20" },
    { title: "Design Categories", value: "4", icon: "📂", color: "from-[#C4956A]/20 to-[#C4956A]/0", border: "border-[#C4956A]/20" },
    { title: "Material Swatches", value: "7", icon: "🎨", color: "from-emerald-500/20 to-emerald-500/0", border: "border-emerald-500/20" },
    { title: "Gallery Masterpieces", value: "12", icon: "🖼️", color: "from-purple-500/20 to-purple-500/0", border: "border-purple-500/20" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm">Manage all sections of your website from one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} bg-[#111111] p-6 rounded-2xl border ${stat.border} relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-gray-400 text-xs tracking-widest uppercase">{stat.title}</h3>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="font-[family-name:var(--font-cormorant)] text-5xl text-white relative z-10">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/categories" className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C4956A]/40 rounded-xl text-left transition-colors flex flex-col gap-2 group">
            <span className="text-[#C4956A] text-xl">📂</span>
            <span className="text-white text-sm font-bold group-hover:text-[#C4956A] transition-colors">Manage Categories</span>
            <span className="text-xs text-gray-500">Add new categories & upload Cloudinary photos</span>
          </Link>
          <Link href="/admin/hero" className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C4956A]/40 rounded-xl text-left transition-colors flex flex-col gap-2 group">
            <span className="text-[#C4956A] text-xl">🖼️</span>
            <span className="text-white text-sm font-bold group-hover:text-[#C4956A] transition-colors">Change Hero Section</span>
            <span className="text-xs text-gray-500">Update main homepage banner & text</span>
          </Link>
          <Link href="/admin/gallery" className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C4956A]/40 rounded-xl text-left transition-colors flex flex-col gap-2 group">
            <span className="text-[#C4956A] text-xl">🖼️</span>
            <span className="text-white text-sm font-bold group-hover:text-[#C4956A] transition-colors">Manage Gallery</span>
            <span className="text-xs text-gray-500">Add, edit and manage home page gallery images</span>
          </Link>
        </div>
      </div>
    </div>
  );
}