"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = sessionStorage.getItem("urbano_admin_token");
    if (token === "admin-auth-secure-session-2026") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        sessionStorage.setItem("urbano_admin_token", result.token);
        setIsAuthenticated(true);
      } else {
        setError(result.error || "Invalid password");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // ── ADMIN LOGIN GATE (DARK LUXURY THEME) ──
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-[#070d09] items-center justify-center px-6 font-[family-name:var(--font-josefin)] text-white">
        <div className="w-full max-w-sm bg-[#0d1610] border border-[#C4956A]/20 p-8 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
          {/* Subtle gold glow behind card */}
          <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-[#C4956A]/5 blur-[70px] rounded-full pointer-events-none"></div>

          <h2 className="font-[family-name:var(--font-cinzel)] text-xs tracking-[0.4em] text-[#C4956A] uppercase font-bold mb-3">
            The Urbano
          </h2>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-white mb-6">
            Admin Authentication
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-900/50 text-red-400 text-xs rounded-xl text-left font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-gray-500 font-bold pl-2">
                Control Panel Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#111f15] border border-white/10 rounded-full px-5 py-3 text-sm focus:border-[#C4956A] focus:bg-[#15271a] outline-none transition-all text-white placeholder-gray-700"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-3 bg-gradient-to-r from-[#203a27] to-[#122416] hover:from-[#C4956A] hover:to-[#B5855A] text-white font-[family-name:var(--font-cinzel)] font-bold text-xs tracking-widest uppercase rounded-full shadow-lg transition-all duration-500 cursor-pointer border border-[#C4956A]/20"
            >
              {loading ? "Verifying..." : "Access Control Panel"}
            </button>
          </form>

          <Link href="/" className="inline-block mt-8 text-xs text-gray-500 hover:text-[#C4956A] transition-colors tracking-wide font-medium">
            ← Return to Live Website
          </Link>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED ADMIN DASHBOARD SIDEBAR & PANEL ──

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Hero Section", path: "/admin/hero", icon: "🖼️" },
    { name: "Categories", path: "/admin/categories", icon: "📂" },
    { name: "Materials", path: "/admin/materials", icon: "🎨" },
    { name: "Gallery Section", path: "/admin/gallery", icon: "🖼️" },
    { name: "Client Reviews", path: "/admin/reviews", icon: "⭐" },
    { name: "Footer Info", path: "/admin/footer", icon: "📞" },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-xs tracking-widest text-[#C4956A] uppercase font-bold">
            The Urbano
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Control Panel</p>
        </div>
        {/* Close button for mobile */}
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden text-gray-400 hover:text-white text-lg p-1"
        >
          ✕
        </button>
      </div>
      
      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive ? 'bg-[#C4956A]/10 text-[#C4956A] border border-[#C4956A]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <button 
          onClick={() => {
            sessionStorage.removeItem("urbano_admin_token");
            setIsAuthenticated(false);
            setMobileMenuOpen(false);
          }}
          className="flex items-center justify-center gap-2 w-full py-3 bg-red-950/20 hover:bg-red-900/35 border border-red-900/20 text-xs tracking-widest uppercase text-red-400 rounded-xl transition-all cursor-pointer font-bold"
        >
          🚪 Logout Admin
        </button>
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-xs tracking-widest uppercase text-gray-300 rounded-xl transition-all">
          🌐 View Live Site
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#070d09] text-white font-[family-name:var(--font-josefin)] overflow-hidden relative">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0d1610] border-r border-white/5 flex flex-col hidden md:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-out menu) */}
      <div className={`fixed inset-0 z-[1000] bg-black/75 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
        <aside 
          className={`w-64 h-full bg-[#0d1610] border-r border-white/5 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-0'}`} 
          style={{ transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0d1610] flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex flex-col justify-center items-center gap-[4px] w-8 h-8 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="w-5 h-[1.5px] bg-white"></span>
              <span className="w-5 h-[1.5px] bg-white"></span>
              <span className="w-5 h-[1.5px] bg-white"></span>
            </button>
            <h1 className="font-[family-name:var(--font-cormorant)] text-xl text-white">Welcome, Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                sessionStorage.removeItem("urbano_admin_token");
                setIsAuthenticated(false);
              }}
              className="hidden sm:inline text-xs text-red-400 hover:underline"
            >
              Logout
            </button>
            <div className="w-8 h-8 rounded-full bg-[#C4956A]/20 border border-[#C4956A]/50 flex items-center justify-center text-[#C4956A] font-bold font-[family-name:var(--font-cinzel)] text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#070d09]">
          {children}
        </div>
      </main>

    </div>
  );
}