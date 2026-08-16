"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { getCategories, CategoryItem } from "@/lib/categoriesData";

export default function Navbar() {
  const pathname = usePathname();

  // Hide website navbar inside the admin panel
  if (pathname?.startsWith("/admin")) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobMenuOpen, setMobMenuOpen] = useState(false);
  const [mobCatExpand, setMobCatExpand] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(3);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const catDropTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll handler to change background opacity
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories & user credits
  useEffect(() => {
    getCategories().then((data) => setCategoriesList(data));

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCredits(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCredits(session.user.id);
      }
    });

    const handleCreditsUpdate = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchCredits(session.user.id);
        }
      });
    };
    window.addEventListener("urbano_credits_updated", handleCreditsUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("urbano_credits_updated", handleCreditsUpdate);
    };
  }, []);

  const fetchCredits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setCredits(data.credits);
      } else {
        const localCredits = localStorage.getItem(`urbano_credits_${userId}`);
        if (localCredits) {
          setCredits(parseInt(localCredits));
        }
      }
    } catch (e) {
      console.warn("Could not fetch credits in navbar:", e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Main Floating Navbar (Pill Shape) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[900] whitespace-nowrap transition-all duration-500">
        <div className={`flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full border transition-all duration-500 ${isScrolled ? 'bg-white border-[#C4956A]/30 shadow-[0_4px_40px_rgba(0,0,0,0.08)]' : 'bg-white border-[#C4956A]/20'}`}>
          
          {/* Brand Logo Image */}
          <Link href="/" className="px-3 sm:px-4 py-1 border-r border-gray-300 mr-1 shrink-0 flex items-center">
            <img src="/logo.png" alt="The Urbano" className="h-6 sm:h-7 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-0.5 list-none m-0 p-0 relative">
            <li>
              <Link href="/" className="inline-flex items-center text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] text-[#666666] uppercase px-3 py-2 rounded-full transition-all hover:text-[#203a27] hover:bg-[#C4956A]/10 font-bold leading-none">
                Home
              </Link>
            </li>

            {/* CATEGORIES WITH DROPDOWN SUBMENU — React state hover so menu never disappears */}
            <li
              className="relative"
              onMouseEnter={() => {
                if (catDropTimer.current) clearTimeout(catDropTimer.current);
                setCatDropOpen(true);
              }}
              onMouseLeave={() => {
                catDropTimer.current = setTimeout(() => setCatDropOpen(false), 120);
              }}
            >
              <Link
                href="/#categories"
                className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] text-[#666666] uppercase px-3 py-2 rounded-full transition-all hover:text-[#203a27] hover:bg-[#C4956A]/10 font-bold leading-none"
              >
                Categories
                <span className={`text-[8px] transition-transform duration-300 ${catDropOpen ? 'rotate-180' : ''}`}>▾</span>
              </Link>

              {/* Dropdown — controlled by React state, so moving into dropdown keeps it open */}
              <div
                className={`absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-64 transition-all duration-200 z-[901] ${catDropOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              >
                <div className="bg-[#122416]/97 backdrop-blur-xl border border-[#C4956A]/30 p-2.5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex flex-col gap-1">
                  <div className="px-3 py-1.5 border-b border-[#C4956A]/20">
                    <span className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] text-[#C4956A] uppercase font-bold">
                      Design Portfolios
                    </span>
                  </div>
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCatDropOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-xs font-[family-name:var(--font-josefin)] text-gray-200 hover:text-white hover:bg-[#C4956A]/20 transition-all flex items-center justify-between"
                    >
                      <span className="font-medium">{cat.title}</span>
                      <span className="text-[10px] text-[#C4956A]">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {['Materials', 'Services', 'Packages', 'Stories'].map((item) => (
              <li key={item}>
                <Link href={`/#${item.toLowerCase()}`} className="inline-flex items-center text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] text-[#666666] uppercase px-3 py-2 rounded-full transition-all hover:text-[#203a27] hover:bg-[#C4956A]/10 font-bold leading-none">
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Dynamic Auth CTA Controls */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Link href="/visualizer" className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.2em] px-4 py-2 bg-[#8cc63f]/10 border border-[#8cc63f]/25 text-[#8cc63f] uppercase rounded-full font-bold transition-all hover:bg-[#8cc63f]/15 shadow-[0_0_10px_rgba(140,198,63,0.08)]">
                ⚡ {credits > 500 ? "Unlimited" : `${credits} Credits`}
              </Link>
              <button 
                onClick={handleLogout}
                className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.2em] px-3.5 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 uppercase rounded-full font-bold transition-all cursor-pointer border border-gray-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/visualizer" className="hidden sm:inline-block font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.25em] px-5 py-2.5 bg-gradient-to-r from-[#0d1710] to-[#17261a] border border-[#C4956A]/40 text-white uppercase rounded-full font-bold ml-2 transition-all hover:border-[#C4956A] shadow-[0_0_15px_rgba(196,149,106,0.1)] hover:shadow-[0_0_20px_rgba(196,149,106,0.3)]">
              Begin Design
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button onClick={() => setMobMenuOpen(!mobMenuOpen)} className="lg:hidden flex flex-col justify-center items-center gap-[4px] w-8 h-8 ml-2 border-none bg-transparent outline-none cursor-pointer">
            <span className={`w-5 h-[1.5px] bg-[#17261a] transition-all duration-300 ${mobMenuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`}></span>
            <span className={`w-5 h-[1.5px] bg-[#17261a] transition-all duration-300 ${mobMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-[1.5px] bg-[#17261a] transition-all duration-300 ${mobMenuOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      <div className={`fixed inset-0 z-[899] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-5 transition-opacity duration-500 overflow-y-auto py-12 px-6 ${mobMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <Link href="/" onClick={() => setMobMenuOpen(false)} className="font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.08em] text-[#17261a] uppercase transition-colors hover:text-[#8cc63f] font-light">
          Home
        </Link>

        {/* Mobile Accordion for Categories */}
        <div className="flex flex-col items-center w-full max-w-xs">
          <button
            onClick={() => setMobCatExpand(!mobCatExpand)}
            className="font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.08em] text-[#17261a] uppercase transition-colors hover:text-[#8cc63f] font-light flex items-center gap-2"
          >
            Categories
            <span className={`text-sm transition-transform duration-300 ${mobCatExpand ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {mobCatExpand && (
            <div className="mt-3 flex flex-col items-center gap-2 bg-[#122416]/5 p-4 rounded-2xl w-full">
              {categoriesList.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobMenuOpen(false)}
                  className="font-[family-name:var(--font-josefin)] text-sm text-[#203a27] font-semibold tracking-wide hover:text-[#C4956A]"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {['Materials', 'Services', 'Packages', 'Stories'].map((item) => (
          <Link key={item} href={`/#${item.toLowerCase()}`} onClick={() => setMobMenuOpen(false)} className="font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.08em] text-[#17261a] uppercase transition-colors hover:text-[#8cc63f] font-light">
            {item}
          </Link>
        ))}

        {user ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link href="/visualizer" onClick={() => setMobMenuOpen(false)} className="font-[family-name:var(--font-cinzel)] text-xs tracking-[0.2em] px-6 py-2.5 bg-[#8cc63f]/10 border border-[#8cc63f]/25 text-[#8cc63f] uppercase rounded-full font-bold">
              ⚡ {credits > 500 ? "Unlimited" : `${credits} Credits`}
            </Link>
            <button 
              onClick={handleLogout}
              className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.2em] px-5 py-2.5 bg-gray-100 text-gray-500 uppercase rounded-full font-bold cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/visualizer" onClick={() => setMobMenuOpen(false)} className="font-[family-name:var(--font-cinzel)] text-xs tracking-[0.25em] px-6 py-3 bg-[#17261a] text-white uppercase rounded-full font-bold mt-4 shadow-md">
            Begin Design
          </Link>
        )}
      </div>
    </>
  );
}