"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const ROOM_TYPES = [
  { name: "Living Room", icon: "🛋️", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=400&auto=format&fit=crop", desc: "Lounge & Entertain" },
  { name: "Bedroom",     icon: "🛏️", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=400&auto=format&fit=crop", desc: "Rest & Rejuvenate" },
  { name: "Kitchen",     icon: "🍳",  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&auto=format&fit=crop", desc: "Cook & Gather" },
  { name: "Dining Room", icon: "🍽️", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=400&auto=format&fit=crop", desc: "Dine in Style" },
  { name: "Bathroom",    icon: "🚿",  image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=400&auto=format&fit=crop", desc: "Spa Sanctuary" },
  { name: "Office",      icon: "💼",  image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=400&auto=format&fit=crop", desc: "Focus & Create" }
];

const DESIGN_STYLES = [
  { name: "Modern",          image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=300&auto=format&fit=crop" },
  { name: "Minimalist",      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=300&auto=format&fit=crop" },
  { name: "Scandinavian",    image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=300&auto=format&fit=crop" },
  { name: "Industrial",      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=300&auto=format&fit=crop" },
  { name: "Luxury",          image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=300&auto=format&fit=crop" },
  { name: "Japandi",         image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=300&auto=format&fit=crop" },
  { name: "Art Deco",        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=300&auto=format&fit=crop" },
  { name: "Modern Farmhouse",image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=300&auto=format&fit=crop" },
  { name: "Bohemian",        image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=300&auto=format&fit=crop" }
];

const BUDGET_OPTIONS = [
  { level: "Low Budget",     tagline: "Smart & Modular",    emoji: "💚", desc: "Modular fits, cost-effective finishes, clean simple styling." },
  { level: "Mid Range",      tagline: "Premium Finishes",   emoji: "💎", desc: "Custom cabinetry, textiles, designer brand lighting." },
  { level: "Luxury Premium", tagline: "Bespoke Masterpiece",emoji: "👑", desc: "Italian marble, brass accents, signature designer furniture." }
];

const PRICING_PLANS = [
  {
    name: "Starter", price: 49, credits: 5, emoji: "🌱", perCredit: "₹9.8/render",
    features: ["5 AI Design Credits", "All 9 design styles", "HD Download", "7-day history"],
    recommended: false
  },
  {
    name: "Pro", price: 99, credits: 15, emoji: "🚀", perCredit: "₹6.6/render",
    features: ["15 AI Design Credits", "All styles + budgets", "Priority rendering", "30-day history", "Commercial use"],
    recommended: true
  },
  {
    name: "Elite", price: 149, credits: 30, emoji: "👑", perCredit: "₹5/render",
    features: ["30 AI Design Credits", "All styles unlocked", "Fastest priority", "Lifetime history", "Commercial license"],
    recommended: false
  }
];

const genStepLabels = ["", "Uploading Asset...", "Analyzing Space Depth...", "Applying Style Magic...", "Polishing Render Quality..."];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function VisualizerPage() {
  const [user, setUser]           = useState<any>(null);
  const [session, setSession]     = useState<any>(null);
  const [authMode, setAuthMode]   = useState<"login" | "signup">("signup");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [whatsapp, setWhatsapp]   = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [selectedStyle,  setSelectedStyle]  = useState("Modern");
  const [selectedRoom,   setSelectedRoom]   = useState("Living Room");
  const [selectedBudget, setSelectedBudget] = useState("Mid Range");
  const [imagePreview,   setImagePreview]   = useState<string>("");
  const [isGenerating,   setIsGenerating]   = useState(false);
  const [genStep,        setGenStep]        = useState(0);
  const [resultImage,    setResultImage]    = useState<string>("");
  const [genError,       setGenError]       = useState<string>("");
  const [credits,        setCredits]        = useState<number>(3);
  const [history,        setHistory]        = useState<any[]>([]);

  const [showPricingModal,   setShowPricingModal]   = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [showMobileMenu,     setShowMobileMenu]     = useState(false);
  const [checkoutPlan,       setCheckoutPlan]       = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Auth / Data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Dynamically load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserStats(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserStats(session.user);
      else { setCredits(3); setHistory([]); }
    });
    return () => {
      subscription.unsubscribe();
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, []);

  const fetchUserStats = async (currentUser: any) => {
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", currentUser.id).single();
    if (profile) setCredits(profile.credits);
    else {
      const local = localStorage.getItem(`urbano_credits_${currentUser.id}`);
      setCredits(local ? parseInt(local) : 3);
    }
    const { data: vHistory } = await supabase
      .from("user_visualizations")
      .select("*")
      .eq("user_id", currentUser.id)
      .neq("generated_url", "system_registration")
      .order("created_at", { ascending: false });
    if (vHistory) setHistory(vHistory);
    else {
      const local = localStorage.getItem(`urbano_history_${currentUser.id}`);
      if (local) setHistory(JSON.parse(local));
    }
  };

  const triggerCreditsRefresh = (n: number) => {
    if (user) { localStorage.setItem(`urbano_credits_${user.id}`, n.toString()); window.dispatchEvent(new Event("urbano_credits_updated")); }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      if (authMode === "signup") {
        if (!/^[0-9]{10}$/.test(whatsapp)) {
          throw new Error("Please enter a valid 10-digit WhatsApp number.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              whatsapp: whatsapp
            }
          }
        });
        if (error) throw error;
        setAuthMode("login");
        setAuthError("✅ Account created! Please sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) { setAuthError(err.message || "Authentication error."); }
    finally { setAuthLoading(false); }
  };

  // Resize to 768px max, dimensions divisible by 64 (required by SDXL diffusion models)
  // Matches reference implementation exactly: toBlob → FileReader → data URI
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX = 768; // 768px = optimal quality/size for ControlNet
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        // Scale down to fit within 768px
        if (w > MAX || h > MAX) {
          if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
          else        { w = Math.round(w * MAX / h); h = MAX; }
        }

        // Round dimensions DOWN to nearest multiple of 64 (SDXL requirement)
        w = Math.floor(w / 64) * 64 || 64;
        h = Math.floor(h / 64) * 64 || 64;

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);

        // Use blob → FileReader pipeline (more reliable than toDataURL)
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("FileReader failed"));
        }, "image/jpeg", 0.88);
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { alert("File too large. Max 10MB."); return; }
      compressImage(file)
        .then((compressed) => { setImagePreview(compressed); setResultImage(""); setGenError(""); })
        .catch(() => {
          // Fallback to raw FileReader if canvas fails
          const reader = new FileReader();
          reader.onloadend = () => { setImagePreview(reader.result as string); setResultImage(""); };
          reader.readAsDataURL(file);
        });
    }
  };


  const handleGenerate = async () => {
    if (!imagePreview || !session) return;
    if (credits < 1) { setShowPricingModal(true); return; }
    setGenError("");
    setIsGenerating(true); setGenStep(1);
    const timers = [
      setTimeout(() => setGenStep(2), 800),
      setTimeout(() => setGenStep(3), 1800),
      setTimeout(() => setGenStep(4), 3200)
    ];
    try {
      const response = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
        body: JSON.stringify({ image: imagePreview, style: selectedStyle, roomType: selectedRoom, budget: selectedBudget })
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 403) { setShowPricingModal(true); return; }
        throw new Error(result.error || "Generation failed.");
      }
      timers.forEach(clearTimeout);
      setGenStep(4);
      setTimeout(() => {
        setResultImage(result.generatedUrl);
        setCredits(result.creditsLeft);
        triggerCreditsRefresh(result.creditsLeft);
        const newItem = { id: Date.now(), style: selectedStyle, room_type: selectedRoom, original_url: imagePreview, generated_url: result.generatedUrl, created_at: new Date().toISOString() };
        const updated = [newItem, ...history];
        setHistory(updated);
        if (user) localStorage.setItem(`urbano_history_${user.id}`, JSON.stringify(updated));
      }, 500);
    } catch (err: any) {
      timers.forEach(clearTimeout);
      // Recovery check: Query Supabase history to see if Segmind image was actually generated & saved!
      if (user) {
        try {
          const { data: latest } = await supabase
            .from("user_visualizations")
            .select("*")
            .eq("user_id", user.id)
            .neq("generated_url", "system_registration")
            .order("created_at", { ascending: false })
            .limit(1);
          if (latest && latest.length > 0) {
            const newestItem = latest[0];
            const createdTime = new Date(newestItem.created_at).getTime();
            // If created within the last 2.5 minutes
            if (Date.now() - createdTime < 150000) {
              setResultImage(newestItem.generated_url);
              fetchUserStats(user);
              setIsGenerating(false);
              setGenStep(0);
              return;
            }
          }
        } catch (e) {
          console.warn("[Recovery] Check error:", e);
        }
      }
      setGenError(err.message || "Generation failed. Please try again.");
    } finally { setIsGenerating(false); setGenStep(0); }
  };

  const drawWatermarkOnCanvas = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(imageUrl);

        // Enable maximum image rendering quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // 1. Draw generated image
        ctx.drawImage(img, 0, 0);

        // 2. Load logo
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          // Optimal crisp proportional sizing
          const logoHeight = Math.max(30, Math.min(52, Math.round(canvas.height * 0.052)));
          const aspect = logo.naturalWidth > 0 && logo.naturalHeight > 0 
            ? logo.naturalWidth / logo.naturalHeight 
            : 3.5;
          const logoWidth = Math.round(logoHeight * aspect);

          const px = Math.round(logoHeight * 0.40); // horizontal padding
          const py = Math.round(logoHeight * 0.22); // vertical padding
          const pillWidth = logoWidth + px * 2;
          const pillHeight = logoHeight + py * 2;

          const margin = Math.round(canvas.width * 0.025);
          const pillX = canvas.width - pillWidth - margin;
          const pillY = canvas.height - pillHeight - margin;
          const radius = pillHeight / 2; // fully rounded pill

          ctx.save();
          
          // Soft shadow under the white pill
          ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 3;

          // Pure white rounded pill container
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(pillX, pillY, pillWidth, pillHeight, radius);
          } else {
            ctx.rect(pillX, pillY, pillWidth, pillHeight);
          }
          ctx.fill();

          // Subtle border
          ctx.shadowColor = "transparent";
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(196, 149, 106, 0.30)";
          ctx.stroke();

          // Draw sharp clean logo image inside pill with high quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          const logoX = pillX + px;
          const logoY = pillY + py;
          ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

          ctx.restore();

          try {
            resolve(canvas.toDataURL("image/jpeg", 0.96));
          } catch {
            resolve(imageUrl);
          }
        };

        logo.onerror = () => resolve(imageUrl);
        logo.src = "/logo.png";
      };

      img.onerror = () => resolve(imageUrl);
      img.src = imageUrl;
    });
  };

  const handleDownload = async (imgUrl: string, label?: string) => {
    const filename = `TheUrbano_${label || selectedStyle}_${Date.now()}.jpg`;
    try {
      const watermarkedUrl = await drawWatermarkOnCanvas(imgUrl);
      const a = document.createElement("a");
      a.href = watermarkedUrl;
      a.download = filename;
      a.click();
    } catch {
      window.open(imgUrl, "_blank");
    }
  };

  const handleDeleteHistory = async (item: any) => {
    if (!confirm(`Delete this ${item.style} ${item.room_type} design?`)) return;
    // Remove from local state immediately (optimistic)
    const updated = history.filter((h: any) => h.id !== item.id);
    setHistory(updated);
    if (user) localStorage.setItem(`urbano_history_${user.id}`, JSON.stringify(updated));
    // Delete from Supabase DB
    try {
      await supabase.from("user_visualizations").delete().eq("id", item.id);
      // Also try to delete from Storage if it's a supabase storage URL
      if (item.generated_url && item.generated_url.includes("/storage/")) {
        const pathMatch = item.generated_url.match(/\/user-uploads\/(.+)$/);
        if (pathMatch) {
          await supabase.storage.from("user-uploads").remove([pathMatch[1]]);
        }
      }
    } catch (e) {
      console.warn("[History] Delete error:", e);
    }
  };

  const handlePurchasePlan = async (plan: typeof PRICING_PLANS[0]) => {
    setCheckoutPlan(plan.name);

    if (!(window as any).Razorpay) {
      alert("Razorpay payment gateway is still loading. Please try again in a few seconds.");
      setCheckoutPlan(null);
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_p0yE8C6dK8c8jD";

    const options = {
      key: keyId,
      amount: plan.price * 100, // paise
      currency: "INR",
      name: "The Urbano AI",
      description: `${plan.credits} AI Space Visualizer Credits`,
      image: "/logo.png",
      handler: async (response: any) => {
        if (response.razorpay_payment_id) {
          try {
            const verifyResp = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                planName: plan.name,
                price: plan.price,
                credits: plan.credits
              })
            });

            const verifyResult = await verifyResp.json();
            if (verifyResp.ok && verifyResult.success) {
              setCredits(verifyResult.newCredits);
              triggerCreditsRefresh(verifyResult.newCredits);
              alert(`🎉 Payment successful! Added ${plan.credits} credits to your account.`);
              setShowPricingModal(false);
            } else {
              alert(`Payment verification failed: ${verifyResult.error || "Please contact support."}`);
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            alert("Network error verifying payment. Please contact support.");
          }
        }
        setCheckoutPlan(null);
      },
      prefill: {
        email: user?.email || ""
      },
      theme: {
        color: "#122416"
      },
      modal: {
        ondismiss: () => {
          setCheckoutPlan(null);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTH GATE — Full screen, fixed, no scroll
  // ─────────────────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-[#0d1a10] flex" style={{ fontFamily: "var(--font-josefin,sans-serif)" }}>
        {/* Left visual panel — desktop only */}
        <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a10] via-[#122416] to-[#1a2e1c]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:"linear-gradient(#C4956A 1px,transparent 1px),linear-gradient(90deg,#C4956A 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
          {/* Room collage */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-0.5 p-0.5 opacity-25">
            {ROOM_TYPES.map(r => (
              <div key={r.name} className="overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d1a10]/70" />
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <img src="/logo.png" alt="The Urbano" className="h-8 w-auto object-contain" />
            <div>
              <span className="text-[#C4956A] text-[9px] tracking-[0.5em] uppercase font-bold block mb-4" style={{ fontFamily:"var(--font-cinzel,serif)" }}>AI-Powered Interior Design</span>
              <h2 className="text-white text-5xl font-light leading-tight mb-6" style={{ fontFamily:"var(--font-cormorant,serif)" }}>
                Transform Any Room Into A <em className="text-[#C4956A]">Masterpiece</em>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">Upload your room photo, choose a design style, and watch AI reimagine your space with professional interior design.</p>
              <div className="flex gap-8 mt-8">
                {[{v:"1240+",l:"Designs"},{v:"9",l:"Styles"},{v:"380+",l:"Clients"}].map(s=>(
                  <div key={s.l}>
                    <div className="text-[#C4956A] text-2xl font-bold" style={{ fontFamily:"var(--font-cormorant,serif)" }}>{s.v}</div>
                    <div className="text-gray-500 text-[9px] uppercase tracking-widest mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-[9px] tracking-widest uppercase" style={{ fontFamily:"var(--font-cinzel,serif)" }}>© The Urbano · Premium Interior Design</p>
          </div>
        </div>

        {/* Right auth form */}
        <div className="flex-1 flex items-center justify-center bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage:"linear-gradient(#122416 1px,transparent 1px),linear-gradient(90deg,#122416 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#C4956A]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#122416]/5 rounded-full blur-[100px]" />

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
            className="relative z-10 w-full max-w-sm px-6 sm:px-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <img src="/logo.png" alt="The Urbano" className="h-8 w-auto" />
            </div>
            <span className="text-[#C4956A] text-[9px] tracking-[0.5em] uppercase font-bold block mb-2" style={{ fontFamily:"var(--font-cinzel,serif)" }}>AI Design Studio</span>
            <h2 className="text-[#122416] text-3xl font-light mb-2" style={{ fontFamily:"var(--font-cormorant,serif)" }}>
              {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-400 text-xs mb-6">
              {authMode === "signup" ? "Sign up and get 3 free design credits instantly." : "Sign in to access your design workspace."}
            </p>

            {/* Tab */}
            <div className="flex bg-gray-50 rounded-2xl p-1 mb-5 border border-gray-100">
              {(["signup","login"] as const).map(mode => (
                <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(""); }}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${authMode===mode ? "bg-[#122416] text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                  style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                  {mode === "signup" ? "Create Account" : "Sign In"}
                </button>
              ))}
            </div>

            {authError && (
              <div className={`mb-4 p-3 rounded-xl text-xs border ${authError.startsWith("✅") ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-600"}`}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 text-sm outline-none focus:border-[#C4956A] focus:bg-white transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 text-sm outline-none focus:border-[#C4956A] focus:bg-white transition-all" />
              </div>
              {authMode === "signup" && (
                <div className="relative flex items-center">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400 text-xs">
                    <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.022-.08-.117-.162-.193-.207-.1-.059-.444-.222-.518-.247-.074-.025-.128-.037-.183.045-.054.08-.21.263-.258.318-.048.054-.096.062-.193.024-.096-.037-.406-.15-.774-.478-.285-.254-.478-.568-.534-.665-.056-.096-.006-.148.042-.196.044-.043.096-.11.144-.165.048-.055.064-.093.096-.156.032-.062.016-.118-.008-.165-.024-.047-.183-.44-.25-.601-.066-.158-.132-.136-.182-.138-.047-.002-.1-.002-.153-.002-.054 0-.142.02-.217.1-.075.08-.287.281-.287.685 0 .404.294.795.334.85.04.054.58 1.157 1.488 1.509.749.29 1.05.24 1.258.203.24-.043.518-.213.59-.42.072-.206.072-.382.05-.42zM12 2C6.477 2 2 6.477 2 12c0 2.01.593 3.882 1.611 5.45L2.05 22l4.7-.935C8.204 21.688 9.988 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.745 0-3.37-.533-4.72-1.442l-.338-.224-2.82.56.57-2.75-.246-.388A7.953 7.953 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                    <span className="text-gray-500 font-bold border-r border-gray-200 pr-2">+91</span>
                  </span>
                  <input type="tel" value={whatsapp} onChange={e=>setWhatsapp(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="WhatsApp Number" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-20 pr-5 py-3.5 text-sm outline-none focus:border-[#C4956A] focus:bg-white transition-all font-mono" />
                </div>
              )}
              <motion.button type="submit" disabled={authLoading}
                whileHover={authLoading?{}:{scale:1.02}} whileTap={authLoading?{}:{scale:0.98}}
                className="w-full py-4 mt-1 bg-[#122416] hover:bg-[#1a3020] text-white font-bold text-[10px] tracking-widest uppercase rounded-2xl transition-all cursor-pointer shadow-lg disabled:opacity-70"
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                {authLoading ? "Processing..." : authMode === "signup" ? "🎁 Get 3 Free Credits" : "Launch Designer →"}
              </motion.button>
            </form>

            {authMode === "signup" && (
              <div className="mt-5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#C4956A]/20">
                <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                  🎉 New users get <span className="font-bold text-[#122416]">3 free credits</span> — no card required.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN APP (logged in)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F6F2]" style={{ fontFamily:"var(--font-josefin,sans-serif)" }}>

      {/* ── TOP ACTION BAR ── */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
        style={{ paddingTop:"68px" }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* Desktop row */}
          <div className="hidden sm:flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <span className="text-[#C4956A] text-[8px] tracking-[0.3em] uppercase font-bold" style={{ fontFamily:"var(--font-cinzel,serif)" }}>AI Design Studio</span>
              <div className="w-px h-4 bg-gray-200" />
              <span className="text-gray-400 text-[10px] truncate max-w-[180px]">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                onClick={() => setShowPricingModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#122416] hover:bg-[#1a3020] text-white rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md"
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                <span>⚡</span>
                <span>{credits > 500 ? "Unlimited" : `${credits} Credits`}</span>
                {credits <= 3 && <span className="text-[#C4956A]">· Top Up</span>}
              </motion.button>
              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all border ${showHistorySidebar ? "bg-[#C4956A] text-white border-[#C4956A]" : "bg-white text-gray-600 border-gray-200 hover:border-[#C4956A]"}`}
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                📋 History
                {history.length > 0 && (
                  <span className="bg-[#C4956A] text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center ml-0.5">
                    {history.length > 9 ? "9+" : history.length}
                  </span>
                )}
              </motion.button>
              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleLogout}
                className="px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all border border-gray-200"
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                Logout
              </motion.button>
            </div>
          </div>

          {/* Mobile row */}
          <div className="sm:hidden flex items-center justify-between h-12">
            <div className="flex items-center gap-2">
              <motion.button whileTap={{scale:0.97}} onClick={() => setShowPricingModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#122416] text-white rounded-full text-[8px] font-bold uppercase tracking-wider cursor-pointer shadow-md"
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                ⚡ {credits > 500 ? "∞" : credits}
                {credits <= 3 && <span className="text-[#C4956A] ml-0.5">↑</span>}
              </motion.button>
              <motion.button whileTap={{scale:0.97}} onClick={() => setShowHistorySidebar(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-[8px] font-bold uppercase cursor-pointer"
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                📋
                {history.length > 0 && <span className="text-[#C4956A]">{history.length}</span>}
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[8px] truncate max-w-[100px]">{user.email?.split("@")[0]}</span>
              <motion.button whileTap={{scale:0.97}} onClick={handleLogout}
                className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 rounded-full text-[8px] font-bold uppercase cursor-pointer border border-gray-200"
                style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                Out
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative bg-[#0d1a10] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"linear-gradient(#C4956A 1px,transparent 1px),linear-gradient(90deg,#C4956A 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
            <span className="text-[#C4956A] text-[8px] sm:text-[9px] tracking-[0.4em] uppercase font-bold block mb-3"
              style={{ fontFamily:"var(--font-cinzel,serif)" }}>
              Segmind SDXL · ControlNet Depth Engine
            </span>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-3"
              style={{ fontFamily:"var(--font-cormorant,serif)" }}>
              Transform Your <em className="text-[#C4956A]">Empty Space</em> Into a Masterpiece
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">Upload a room photo · Choose style & budget · Let AI redesign it</p>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 30" className="w-full relative -mb-1" preserveAspectRatio="none">
          <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" fill="#F8F6F2"/>
        </svg>
      </div>

      {/* ── WORKSPACE ── */}
      {/* On mobile: single column. On lg+: left config + right canvas (+ history sidebar) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start">

          {/* ── LEFT CONFIG PANEL ── */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}
            className="w-full lg:flex-1 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-xl p-4 sm:p-6 md:p-8 flex flex-col gap-5">

            <div>
              <span className="text-[#C4956A] text-[7px] sm:text-[8px] tracking-[0.4em] uppercase font-bold block mb-1" style={{ fontFamily:"var(--font-cinzel,serif)" }}>Step-by-step</span>
              <h3 className="text-[#122416] text-xl sm:text-2xl font-light" style={{ fontFamily:"var(--font-cormorant,serif)" }}>Design Configuration</h3>
            </div>

            {/* 1. Budget */}
            <div>
              <label className="text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-2 sm:mb-3" style={{ fontFamily:"var(--font-cinzel,serif)" }}>1. Budget Tier</label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {BUDGET_OPTIONS.map(opt => (
                  <motion.button key={opt.level} onClick={() => setSelectedBudget(opt.level)} whileTap={{ scale:0.97 }}
                    className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all cursor-pointer ${selectedBudget===opt.level ? "border-[#C4956A] bg-[#122416] shadow-lg" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                    <span className="text-base sm:text-xl block mb-1">{opt.emoji}</span>
                    <span className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-wider block leading-tight ${selectedBudget===opt.level ? "text-[#C4956A]" : "text-[#122416]"}`}
                      style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                      {opt.level === "Luxury Premium" ? "Luxury" : opt.level}
                    </span>
                    <span className={`text-[7px] sm:text-[8px] ${selectedBudget===opt.level ? "text-gray-400" : "text-gray-400"}`}>{opt.tagline}</span>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={selectedBudget} initial={{ opacity:0, y:-5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  className="mt-2 p-2.5 sm:p-3 bg-gray-50 rounded-xl text-[9px] sm:text-[10px] text-gray-500 leading-relaxed">
                  {BUDGET_OPTIONS.find(o=>o.level===selectedBudget)?.desc}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 2. Room Type — visual cards */}
            <div>
              <label className="text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-2 sm:mb-3" style={{ fontFamily:"var(--font-cinzel,serif)" }}>2. Room Type</label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {ROOM_TYPES.map(room => (
                  <motion.button key={room.name} onClick={() => setSelectedRoom(room.name)}
                    whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:0.97 }}
                    className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedRoom===room.name ? "border-[#C4956A] shadow-lg shadow-[#C4956A]/20" : "border-gray-200 hover:border-gray-300"}`}
                    style={{ paddingBottom:"80%" }}>
                    <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-all ${selectedRoom===room.name ? "bg-[#122416]/70" : "bg-[#0d1a10]/50"}`} />
                    {selectedRoom===room.name && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                        className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#C4956A] flex items-center justify-center text-white text-[7px] sm:text-[9px] font-bold z-10">✓</motion.div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 sm:p-2 z-10">
                      <span className="text-base sm:text-xl mb-0.5 sm:mb-1">{room.icon}</span>
                      <span className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-wider text-center leading-tight ${selectedRoom===room.name ? "text-[#C4956A]" : "text-white"}`}
                        style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                        {room.name === "Living Room" ? "Living" : room.name === "Dining Room" ? "Dining" : room.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 3. Upload */}
            <div>
              <label className="text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-2 sm:mb-3" style={{ fontFamily:"var(--font-cinzel,serif)" }}>3. Upload Room Photo</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" id="room-photo-input" />
              {!imagePreview ? (
                <motion.label htmlFor="room-photo-input" whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                  className="border-2 border-dashed border-[#C4956A]/30 bg-[#FAF7F2] rounded-2xl sm:rounded-3xl h-28 sm:h-36 flex flex-col items-center justify-center cursor-pointer hover:border-[#C4956A]/60 transition-all">
                  <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:2, repeat:Infinity }}>
                    <span className="text-3xl sm:text-4xl">📸</span>
                  </motion.div>
                  <p className="text-xs font-semibold text-gray-700 mt-2 sm:mt-3">Click to upload room photo</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">PNG, JPG, JPEG · max 5MB</p>
                </motion.label>
              ) : (
                <div className="relative h-28 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#122416]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label htmlFor="room-photo-input" className="bg-white text-[#122416] px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase cursor-pointer" style={{ fontFamily:"var(--font-cinzel,serif)" }}>Change</label>
                    <button onClick={() => { setImagePreview(""); setResultImage(""); }} className="bg-white text-red-500 px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase cursor-pointer" style={{ fontFamily:"var(--font-cinzel,serif)" }}>Remove</button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Aesthetic Style — visual cards, NO max-height clipping */}
            <div>
              <label className="text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-2 sm:mb-3" style={{ fontFamily:"var(--font-cinzel,serif)" }}>4. Aesthetic Style</label>
              {/* No max-h, no overflow hidden — all 9 cards visible, proper grid */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {DESIGN_STYLES.map((style, i) => {
                  const isSel = selectedStyle === style.name;
                  return (
                    <motion.button key={style.name} onClick={() => setSelectedStyle(style.name)}
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                      whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}
                      className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${isSel ? "border-[#C4956A] shadow-lg shadow-[#C4956A]/20" : "border-gray-200 hover:border-gray-300"}`}
                      style={{ paddingBottom:"90%" }}>
                      <img src={style.image} alt={style.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute inset-0 transition-all ${isSel ? "bg-[#122416]/75" : "bg-[#0d1a10]/55"}`} />
                      {isSel && (
                        <>
                          <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                            className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#C4956A] flex items-center justify-center text-white text-[7px] sm:text-[9px] font-bold z-10">✓</motion.div>
                          <motion.div animate={{ opacity:[0.3,0.7,0.3] }} transition={{ duration:2, repeat:Infinity }}
                            className="absolute inset-0 border-2 border-[#C4956A]/50 rounded-xl sm:rounded-2xl pointer-events-none z-10" />
                        </>
                      )}
                      <div className="absolute bottom-0 inset-x-0 p-1.5 sm:p-2 z-10 bg-gradient-to-t from-black/60 to-transparent">
                        <span className={`text-[6px] sm:text-[8px] font-bold uppercase tracking-wider text-center leading-tight block ${isSel ? "text-[#C4956A]" : "text-white"}`}
                          style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                          {style.name}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Credits bar */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-500">Available Credits</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#122416]" style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                  ⚡ {credits > 500 ? "Unlimited" : `${credits} Credits`}
                </span>
                {credits < 3 && (
                  <button onClick={() => setShowPricingModal(true)}
                    className="text-[8px] sm:text-[9px] font-bold text-[#C4956A] uppercase tracking-wider cursor-pointer hover:underline"
                    style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                    Top Up →
                  </button>
                )}
              </div>
            </div>

            {/* Generate CTA */}
            <motion.button onClick={handleGenerate} disabled={!imagePreview || isGenerating}
              whileHover={!imagePreview||isGenerating?{}:{scale:1.02}} whileTap={!imagePreview||isGenerating?{}:{scale:0.98}}
              className={`w-full py-3.5 sm:py-4 rounded-full font-bold text-[9px] sm:text-xs tracking-widest uppercase flex items-center justify-center gap-2 sm:gap-3 transition-all ${!imagePreview||isGenerating ? "bg-gray-100 text-gray-400 cursor-not-allowed" : credits<1 ? "bg-[#C4956A] hover:bg-[#B5855A] text-white cursor-pointer shadow-lg" : "bg-[#122416] hover:bg-[#1a3020] text-white cursor-pointer shadow-lg shadow-[#122416]/20"}`}
              style={{ fontFamily:"var(--font-cinzel,serif)" }}>
              {isGenerating ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Rendering...</>
              ) : credits < 1 ? "🔒 Buy Credits to Generate"
                : "✨ Visualize Space · 1 Credit"}
            </motion.button>
          </motion.div>

          {/* ── RIGHT CANVAS ── */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}
            className="w-full lg:flex-1 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col"
            style={{ minHeight: "360px" }}>

            <AnimatePresence mode="wait">
              {/* Empty */}
              {!imagePreview && !isGenerating && !resultImage && !genError && (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[360px]">
                  <motion.div animate={{ y:[0,-8,0], rotate:[0,5,-5,0] }} transition={{ duration:4, repeat:Infinity }} className="text-5xl sm:text-6xl mb-4 sm:mb-6">🏺</motion.div>
                  <h4 className="text-gray-700 text-xl sm:text-2xl font-light mb-2 sm:mb-3" style={{ fontFamily:"var(--font-cormorant,serif)" }}>Workspace Canvas</h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xs">Upload your room photo on the left and configure your settings to generate an AI interior design.</p>
                  <div className="mt-6 flex flex-col gap-2">
                    {["Preserves your room layout","Budget-aware materials","9 design styles","High-res download"].map(feat=>(
                      <div key={feat} className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="text-[#C4956A]">◈</span> {feat}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Error state */}
              {genError && !isGenerating && (
                <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[360px]">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h4 className="text-gray-800 text-xl font-light mb-2" style={{ fontFamily:"var(--font-cormorant,serif)" }}>Generation Failed</h4>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 max-w-sm mb-4">
                    <p className="text-red-600 text-xs leading-relaxed">{genError}</p>
                  </div>
                  {/* Hint: if Segmind processed it, it may appear in history */}
                  <p className="text-[10px] text-gray-400 mb-4 max-w-xs leading-relaxed">
                    💡 If Segmind processed your request before the error, your design may already be saved in History.
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => { setGenError(""); }}
                      className="px-5 py-2.5 bg-[#122416] text-white rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[#1a3020] transition-all"
                      style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                      Try Again
                    </button>
                    <button onClick={() => { setGenError(""); fetchUserStats(user); setShowHistorySidebar(true); }}
                      className="px-5 py-2.5 bg-[#C4956A] text-white rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[#B5855A] transition-all"
                      style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                      📋 Check History
                    </button>
                  </div>
                </motion.div>
              )}


              {/* Preview uploaded image */}
              {imagePreview && !isGenerating && !resultImage && (
                <motion.div key="preview" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex-1 flex flex-col min-h-[360px]">
                  <div className="flex-1 relative overflow-hidden">
                    <img src={imagePreview} alt="Your room" className="w-full h-full object-cover" style={{ minHeight:"280px" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a10]/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-xs font-light mb-2">Your uploaded room</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {[selectedStyle, selectedRoom, selectedBudget === "Luxury Premium" ? "Luxury" : selectedBudget].map(tag=>(
                          <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-[8px] font-bold px-2.5 py-1 rounded-full border border-white/20" style={{ fontFamily:"var(--font-cinzel,serif)" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">Tap <strong className="text-[#122416]">Visualize Space</strong> above to generate your AI design</p>
                  </div>
                </motion.div>
              )}

              {/* Generating */}
              {isGenerating && (
                <motion.div key="generating" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="flex-1 flex flex-col items-center justify-center bg-white p-6 sm:p-8 min-h-[360px]">
                  <div className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border border-[#C4956A]/30 shadow-xl bg-[#0d1a10] relative" style={{ aspectRatio:"16/10" }}>
                    {imagePreview && <img src={imagePreview} alt="Scanning" className="w-full h-full object-cover opacity-20 grayscale" />}
                    <motion.div animate={{ y:["0%","100%","0%"] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
                      className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C4956A] to-transparent absolute z-10 shadow-[0_0_20px_#C4956A]" />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage:"linear-gradient(#C4956A 1px,transparent 1px),linear-gradient(90deg,#C4956A 1px,transparent 1px)", backgroundSize:"20px 20px" }} />
                  </div>
                  <div className="mt-6 text-center w-full max-w-xs">
                    <AnimatePresence mode="wait">
                      <motion.p key={genStep} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="text-[#C4956A] text-[8px] sm:text-[9px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                        {genStepLabels[genStep] || "Initializing..."}
                      </motion.p>
                    </AnimatePresence>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-[#122416] to-[#C4956A]"
                        animate={{ width:`${genStep*25}%` }} transition={{ duration:0.5 }} />
                    </div>
                    <p className="text-[8px] text-gray-300 mt-2 font-mono">SEGMIND SDXL CONTROLNET DEPTH v2</p>
                  </div>
                </motion.div>
              )}

              {/* Result */}
              {resultImage && !isGenerating && (
                <motion.div key="result" initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} className="flex-1 flex flex-col min-h-[360px]">
                  <div className="flex-1 relative overflow-hidden">
                    <img src={resultImage} alt="AI Design" className="w-full h-full object-cover" style={{ minHeight:"280px" }} />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {[selectedStyle, selectedRoom].map(tag=>(
                        <span key={tag} className="bg-[#122416]/90 backdrop-blur-sm text-[#F2EBE0] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#C4956A]/20" style={{ fontFamily:"var(--font-cinzel,serif)" }}>{tag}</span>
                      ))}
                    </div>
                    <motion.div initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.3 }}
                      className="absolute top-3 right-3 bg-[#C4956A] text-white text-[7px] sm:text-[8px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                      ✨ AI Generated
                    </motion.div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C4956A]/25 flex items-center pointer-events-none shadow-md">
                      <img src="/logo.png" alt="The Urbano" className="h-4 sm:h-5 w-auto object-contain" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-100 gap-2 sm:gap-0">
                    <div>
                      <span className="text-xs text-gray-400">✓ Render complete</span>
                      <p className="text-[9px] text-gray-300">{credits} credits remaining</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <motion.button onClick={() => { setResultImage(""); setImagePreview(""); }} whileHover={{ scale:1.02 }}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest border border-gray-200 text-gray-600 cursor-pointer text-center"
                        style={{ fontFamily:"var(--font-cinzel,serif)" }}>New</motion.button>
                      <motion.button onClick={() => handleDownload(resultImage)} whileHover={{ scale:1.03 }}
                        className="flex-1 sm:flex-none bg-[#122416] hover:bg-[#C4956A] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-all text-center"
                        style={{ fontFamily:"var(--font-cinzel,serif)" }}>Download</motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── HISTORY SIDEBAR (desktop inline) ── */}
          <AnimatePresence>
            {showHistorySidebar && (
              <motion.div key="history-sidebar"
                initial={{ opacity:0, x:40 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:40 }}
                transition={{ duration:0.25, ease:"easeOut" }}
                className="hidden lg:flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden shrink-0"
                style={{ width:280 }}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-[#122416] text-lg font-light" style={{ fontFamily:"var(--font-cormorant,serif)" }}>History</h4>
                    <span className="text-[9px] text-gray-400">{history.length} designs</span>
                  </div>
                  <button onClick={() => setShowHistorySidebar(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 flex items-center justify-center cursor-pointer text-sm">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2.5 max-h-[600px]">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="text-4xl mb-3">🎨</div>
                      <p className="text-xs text-gray-400 leading-relaxed px-4">Your designs will appear here.</p>
                    </div>
                  ) : history.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                      onClick={() => {
                        setResultImage(item.generated_url);
                        if (item.style) setSelectedStyle(item.style);
                        if (item.room_type) setSelectedRoom(item.room_type);
                      }}
                      className="bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#C4956A]/40 hover:shadow-lg transition-all group overflow-hidden cursor-pointer">
                      {/* Image */}
                      <div className="relative h-28 bg-gray-100 overflow-hidden">
                        <img
                          src={item.generated_url || "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=300"}
                          alt="Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=300"; }} />
                        <div className="absolute top-1.5 left-1.5">
                          <span className="bg-[#122416]/90 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ fontFamily:"var(--font-cinzel,serif)" }}>{item.style}</span>
                        </div>
                        {/* Delete button — top right on hover */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item); }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="Delete">
                          ✕
                        </button>
                      </div>
                      {/* Info */}
                      <div className="px-2.5 pt-2 pb-1 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-[#122416] truncate" style={{ fontFamily:"var(--font-cinzel,serif)" }}>{item.room_type}</p>
                          <p className="text-[8px] text-gray-400">{new Date(item.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                        </div>
                        <span className="text-[8px] text-[#C4956A] font-bold group-hover:underline">View ↗</span>
                      </div>
                      {/* Action buttons */}
                      <div className="px-2 pb-2.5 flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.generated_url, `${item.style}_${item.room_type}`);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#122416] hover:bg-[#C4956A] text-white rounded-xl text-[8px] font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                          style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                          ⬇ Download
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item); }}
                          className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[8px] font-bold cursor-pointer transition-all border border-red-100"
                          title="Delete">
                          🗑
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── HISTORY — MOBILE BOTTOM SHEET ── */}
      <AnimatePresence>
        {showHistorySidebar && (
          <motion.div key="history-mobile"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            className="lg:hidden fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistorySidebar(false)}>
            <motion.div
              initial={{ y:"100%" }}
              animate={{ y:0 }}
              exit={{ y:"100%" }}
              transition={{ duration:0.3, ease:"easeOut" }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] max-h-[80vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}>
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="px-5 pb-3 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h4 className="text-[#122416] text-xl font-light" style={{ fontFamily:"var(--font-cormorant,serif)" }}>Your History</h4>
                  <span className="text-[9px] text-gray-400">{history.length} designs generated</span>
                </div>
                <button onClick={() => setShowHistorySidebar(false)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center cursor-pointer">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
                {history.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-12">
                    <div className="text-4xl mb-3">🎨</div>
                    <p className="text-xs text-gray-400 text-center">No designs yet. Create your first!</p>
                  </div>
                ) : history.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                    onClick={() => {
                      setResultImage(item.generated_url);
                      if (item.style) setSelectedStyle(item.style);
                      if (item.room_type) setSelectedRoom(item.room_type);
                      setShowHistorySidebar(false);
                    }}
                    className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden cursor-pointer">
                    {/* Image */}
                    <div className="relative bg-gray-100" style={{ paddingBottom:"65%" }}>
                      <img
                        src={item.generated_url || "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=300"}
                        alt="Design" className="absolute inset-0 w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=300"; }} />
                      <div className="absolute top-1 left-1">
                        <span className="bg-[#122416]/90 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">{item.style}</span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="px-2.5 pt-2 pb-1">
                      <p className="text-[9px] font-bold text-[#122416] truncate">{item.room_type}</p>
                      <p className="text-[8px] text-gray-400">{new Date(item.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                    </div>
                    {/* Action buttons */}
                    <div className="px-2 pb-2.5 flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item.generated_url, `${item.style}_${item.room_type}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#122416] hover:bg-[#C4956A] text-white rounded-xl text-[8px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                        style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                        ⬇ Download
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item); }}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[8px] font-bold cursor-pointer transition-all border border-red-100"
                        title="Delete">
                        🗑
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PRICING MODAL ── */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div key="pricing-modal"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={e => { if(e.target===e.currentTarget) setShowPricingModal(false); }}>
            <motion.div
              initial={{ opacity:0, y:60 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:60 }}
              transition={{ duration:0.3, ease:"easeOut" }}
              className="bg-[#0d1a10] w-full sm:rounded-[2rem] sm:max-w-2xl md:max-w-3xl overflow-hidden shadow-2xl border-t sm:border border-[#C4956A]/20 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Handle for mobile */}
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="relative p-5 sm:p-8 pb-4 sm:pb-6 border-b border-white/10">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:"linear-gradient(#C4956A 1px,transparent 1px),linear-gradient(90deg,#C4956A 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <span className="text-[#C4956A] text-[8px] sm:text-[9px] tracking-[0.5em] uppercase font-bold block mb-1" style={{ fontFamily:"var(--font-cinzel,serif)" }}>Credit Top-Up Plans</span>
                    <h3 className="text-white text-2xl sm:text-3xl font-light" style={{ fontFamily:"var(--font-cormorant,serif)" }}>
                      {credits < 1 ? "You're Out of Credits 🔒" : "Unlock More Designs"}
                    </h3>
                    {credits > 0 && (
                      <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl inline-flex border border-white/10">
                        <span className="text-[#C4956A] text-sm">⚡</span>
                        <span className="text-white text-xs">Balance: <strong>{credits} credits</strong></span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setShowPricingModal(false)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all shrink-0 ml-3">✕</button>
                </div>
              </div>

              {/* Plans — vertical on mobile, 3 cols on md+ */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-4">
                {PRICING_PLANS.map((plan, i) => (
                  <motion.div key={plan.name}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
                    className={`relative rounded-2xl p-4 sm:p-6 border transition-all ${plan.recommended ? "bg-white border-[#C4956A]/40 shadow-xl" : "bg-white/5 border-white/10"}`}>
                    {plan.recommended && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C4956A] text-white text-[7px] sm:text-[8px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full whitespace-nowrap" style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                        Most Popular
                      </div>
                    )}
                    {/* Mobile: horizontal layout */}
                    <div className="flex md:block items-center gap-3 md:gap-0">
                      <span className="text-2xl sm:text-2xl md:mb-3 shrink-0">{plan.emoji}</span>
                      <div className="flex-1 md:block">
                        <div className="flex md:block items-baseline justify-between">
                          <h4 className={`text-lg md:text-xl font-light md:mb-1 ${plan.recommended ? "text-[#122416]" : "text-white"}`}
                            style={{ fontFamily:"var(--font-cormorant,serif)" }}>{plan.name}</h4>
                          <span className={`text-xl md:text-3xl font-bold ${plan.recommended ? "text-[#122416]" : "text-[#C4956A]"}`}
                            style={{ fontFamily:"var(--font-cormorant,serif)" }}>₹{plan.price}</span>
                        </div>
                        <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full inline-block uppercase tracking-wider mt-1 ${plan.recommended ? "bg-[#122416]/10 text-[#122416]" : "bg-white/10 text-gray-400"}`}
                          style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                          {plan.credits} credits · {plan.perCredit}
                        </div>
                      </div>
                    </div>

                    <div className={`h-px my-3 ${plan.recommended ? "bg-gray-100" : "bg-white/10"}`} />
                    <ul className="flex flex-col gap-1 mb-4">
                      {plan.features.map(f => (
                        <li key={f} className={`text-[10px] sm:text-[11px] flex items-center gap-1.5 ${plan.recommended ? "text-gray-600" : "text-gray-400"}`}>
                          <span className="text-[#C4956A] shrink-0">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <motion.button onClick={() => handlePurchasePlan(plan)} disabled={checkoutPlan!==null}
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      className={`w-full py-2.5 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-60 ${plan.recommended ? "bg-[#122416] hover:bg-[#1a3020] text-white shadow-lg" : "bg-[#C4956A] hover:bg-[#B5855A] text-white"}`}
                      style={{ fontFamily:"var(--font-cinzel,serif)" }}>
                      {checkoutPlan===plan.name ? "Processing..." : `Get ${plan.name} — ₹${plan.price}`}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 pb-5 text-center">
                <p className="text-gray-600 text-[9px] sm:text-[10px] font-mono">🔐 Secure payments via Razorpay · Integration in progress · No charges until live</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
