"use client";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/settingsData";
import {
  uploadMediaToCloudinary,
  isVideoUrl,
  applyCloudinaryVideoTransform,
  VideoCropGravity,
  UploadResult,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_PRESET,
} from "@/lib/cloudinary";

const MAX_SLIDES = 8;

const FALLBACK_SLIDES = [
  "https://res.cloudinary.com/suabdqxg/video/upload/c_fill,ar_16:9/g_auto/q_auto/v1790838690/iwlxvxru4xojth52ro9r.mp4",
  "https://res.cloudinary.com/suabdqxg/video/upload/c_fill,ar_16:9/g_auto/q_auto/v1790838692/wunmzuosfqgmsc2kjtex.mp4",
  "https://res.cloudinary.com/suabdqxg/video/upload/c_fill,ar_16:9/g_auto/q_auto/v1790838693/yttxfnnifl5wjmrg0ja6.mp4",
  "https://res.cloudinary.com/suabdqxg/video/upload/c_fill,ar_16:9/g_auto/q_auto/v1790838695/hetexrhsmrirqailszhm.mp4",
];

const LOCAL_PRESET_SLIDES = [
  "/hero/hero-1.mp4",
  "/hero/hero-2.mp4",
  "/hero/hero-3.mp4",
  "/hero/hero-4.mp4",
];

function getGravityFromUrl(url: string): VideoCropGravity {
  if (url.includes("/g_north/")) return "north";
  if (url.includes("/g_center/")) return "center";
  if (url.includes("/g_south/")) return "south";
  if (url.includes("/g_auto/")) return "auto";
  if (url.includes("/q_auto,f_auto/") || url.includes("/v1")) return "none";
  return "auto";
}

const CROP_OPTIONS: { label: string; value: VideoCropGravity; desc: string }[] = [
  { label: "🎯 AI Smart Crop (16:9)", value: "auto", desc: "Auto-centers main subject" },
  { label: "⬆️ Top Area (16:9)", value: "north", desc: "Focuses upper / ceiling" },
  { label: "⏺️ Center (16:9)", value: "center", desc: "Crops middle portion" },
  { label: "⬇️ Bottom Area (16:9)", value: "south", desc: "Focuses lower / floor" },
  { label: "📐 Full Uncropped", value: "none", desc: "Full aspect ratio" },
];

interface SlideState {
  url: string;
  uploading: boolean;
  stats: UploadResult | null;
  cropGravity: VideoCropGravity;
}

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [slides, setSlides] = useState<SlideState[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const vals = await getSettings(
          ["hero_slides", "hero_bg_image", "hero_overlay_image"],
          {
            hero_slides: "",
            hero_bg_image: FALLBACK_SLIDES[0],
            hero_overlay_image: FALLBACK_SLIDES[1],
          }
        );

        let urls: string[] = [];

        if (vals.hero_slides) {
          try {
            const parsed = JSON.parse(vals.hero_slides) as string[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              urls = parsed;
            }
          } catch { /* fall through */ }
        }

        // Backwards compat: if no hero_slides, use the 2 old settings
        if (urls.length === 0) {
          urls = [vals.hero_bg_image, vals.hero_overlay_image].filter(Boolean);
        }

        if (urls.length === 0) urls = [...FALLBACK_SLIDES];

        setSlides(
          urls.map((url) => ({
            url,
            uploading: false,
            stats: null,
            cropGravity: getGravityFromUrl(url),
          }))
        );
      } catch (err) {
        setError("Failed to load hero configurations.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith("video/");
    setSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, uploading: true } : s))
    );
    setError("");
    try {
      const stats = await uploadMediaToCloudinary(file, "auto");
      setSlides((prev) =>
        prev.map((s, i) =>
          i === idx
            ? {
                ...s,
                url: stats.url,
                uploading: false,
                stats,
                cropGravity: "auto",
              }
            : s
        )
      );
      setSuccess(`⚡ Slide ${idx + 1} (${isVid ? "Video" : "Photo"}) uploaded & compressed successfully!`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || `Failed to upload slide ${idx + 1}.`);
      setSlides((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, uploading: false } : s))
      );
    }
    // Reset file input so same file can be re-selected
    e.target.value = "";
  };

  const handleCropChange = (idx: number, gravity: VideoCropGravity) => {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const newUrl = applyCloudinaryVideoTransform(s.url, gravity);
        return { ...s, url: newUrl, cropGravity: gravity };
      })
    );
  };

  const handleUrlChange = (idx: number, newUrl: string) => {
    setSlides((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              url: newUrl,
              cropGravity: getGravityFromUrl(newUrl),
            }
          : s
      )
    );
  };

  const handleLoadLocalPresets = () => {
    setSlides(
      LOCAL_PRESET_SLIDES.map((url) => ({
        url,
        uploading: false,
        stats: null,
        cropGravity: "none",
      }))
    );
    setSuccess("Loaded 4 local hero videos (/hero/hero-1.mp4 to 4). Click Save Slides to apply!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleLoadCloudinaryPresets = () => {
    setSlides(
      FALLBACK_SLIDES.map((url) => ({
        url,
        uploading: false,
        stats: null,
        cropGravity: getGravityFromUrl(url),
      }))
    );
    setSuccess("Loaded 4 Cloudinary luxury videos. Click Save Slides to apply!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleAddSlide = () => {
    if (slides.length >= MAX_SLIDES) return;
    const nextFallback = FALLBACK_SLIDES[slides.length % FALLBACK_SLIDES.length];
    setSlides((prev) => [
      ...prev,
      {
        url: nextFallback,
        uploading: false,
        stats: null,
        cropGravity: getGravityFromUrl(nextFallback),
      },
    ]);
  };

  const handleRemoveSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx === slides.length - 1) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const urls = slides.map((s) => s.url).filter(Boolean);
      await updateSettings({
        hero_slides: JSON.stringify(urls),
        // Keep legacy keys in sync for backwards compat
        hero_bg_image: urls[0] ?? FALLBACK_SLIDES[0],
        hero_overlay_image: urls[1] ?? FALLBACK_SLIDES[1],
      });
      setSuccess("✅ Hero slides saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError("Failed to save hero slides.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm p-4">Loading Hero Settings...</div>;
  }

  const anyUploading = slides.some((s) => s.uploading);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">Hero Section</h1>
            <span className="bg-[#8cc63f]/10 text-[#8cc63f] border border-[#8cc63f]/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Video & Photo Support
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
            Manage the slideshow videos and photos for the hero banner. Supports high-resolution videos, automatic Cloudinary compression &amp; 9:16 $\rightarrow$ 16:9 crop adjustments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-mono">
            Cloudinary: <span className="text-[#8cc63f]">{CLOUDINARY_CLOUD_NAME}</span>
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {slides.length} / {MAX_SLIDES} slides
          </span>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs rounded-2xl">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800/50 text-red-400 text-xs rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* Playlist loop notice & quick actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0d1a10] border border-[#8cc63f]/20 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔁</span>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">Continuous Playlist Loop Active</div>
              <div className="text-[11px] text-gray-400">
                Videos play one after another (1 → 2 → ... → {slides.length}). Jab aakhri video khatam hogi, wapas Slide 1 se start hoga loop mein!
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadLocalPresets}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-gray-300 font-medium transition-all"
              title="Loads 4 high-speed local videos (/hero/hero-1.mp4 to 4)"
            >
              ⚡ Load 4 Local Videos
            </button>
            <button
              type="button"
              onClick={handleLoadCloudinaryPresets}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-gray-300 font-medium transition-all"
              title="Loads 4 Cloudinary CDN luxury videos"
            >
              ☁️ Load 4 Cloudinary Videos
            </button>
          </div>
        </div>

        {/* Slide cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, idx) => {
            const isVid = isVideoUrl(slide.url);
            return (
              <div
                key={idx}
                className="bg-[#111111] border border-white/5 p-5 rounded-3xl flex flex-col gap-4 relative"
              >
                {/* Slide number badge & controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-widest text-[#C4956A] uppercase font-[family-name:var(--font-cinzel)]">
                      Slide {idx + 1}
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
                      {isVid ? "🎥 Video" : "🖼️ Photo"}
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] text-[#88A492] normal-case tracking-wider font-[family-name:var(--font-josefin)]">
                        (First shown)
                      </span>
                    )}
                  </div>

                  {/* Reorder + delete controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      title="Move up"
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-25 transition-all text-xs"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === slides.length - 1}
                      title="Move down"
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-25 transition-all text-xs"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      disabled={slides.length <= 1}
                      title="Remove slide"
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-red-950/30 hover:bg-red-900/50 text-red-500 hover:text-red-300 disabled:opacity-25 transition-all text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 16:9 Media Preview */}
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-white/10 relative group">
                  {isVid ? (
                    <video
                      key={slide.url}
                      src={slide.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={slide.url}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* 16:9 badge */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-gray-300 font-mono">
                    16:9 Frame
                  </div>

                  {slide.uploading && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 text-xs text-[#C4956A] animate-pulse">
                      <div className="w-6 h-6 border-2 border-[#C4956A] border-t-transparent rounded-full animate-spin"></div>
                      <span>Compressing &amp; Uploading to Cloudinary...</span>
                    </div>
                  )}
                </div>

                {/* Direct Media URL Input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400 font-mono">🔗 Video / Image URL or Local Path:</span>
                    <span className="text-[#C4956A] text-[9px] font-mono">
                      {isVid ? "MP4 / WebM / Cloudinary" : "Image / WebP"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={slide.url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /hero/hero-1.mp4"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 hover:border-white/20 focus:border-[#C4956A] rounded-xl text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Video 16:9 Crop / Gravity Selector (visible for videos) */}
                {isVid && (
                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                        ✂️ 16:9 Crop &amp; Framing:
                      </span>
                      <span className="text-[10px] text-[#8cc63f] font-mono">
                        {CROP_OPTIONS.find((c) => c.value === slide.cropGravity)?.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {CROP_OPTIONS.map((opt) => {
                        const active = slide.cropGravity === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleCropChange(idx, opt.value)}
                            className={`px-2 py-1.5 rounded-xl text-[10px] font-medium text-left transition-all ${
                              active
                                ? "bg-[#C4956A] text-white shadow-md font-bold"
                                : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                            }`}
                            title={opt.desc}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 italic mt-0.5">
                      💡 9:16 vertical videos ko 16:9 ratio mein adjust karne ke liye upper buttons se focus area chun sakte hain.
                    </p>
                  </div>
                )}

                {/* Compression stats */}
                {slide.stats && (
                  <div className="text-[10px] bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1 font-mono text-[#8cc63f]">
                    <div>⚡ {slide.stats.didCompress ? "COMPRESSED & OPTIMIZED" : "ORIGINAL"}</div>
                    <div>📉 {slide.stats.originalSizeKB} KB → {slide.stats.compressedSizeKB} KB</div>
                    <div>
                      📈 Saved {Math.max(0, slide.stats.originalSizeKB - slide.stats.compressedSizeKB)} KB (
                      {Math.round(((slide.stats.originalSizeKB - slide.stats.compressedSizeKB) / slide.stats.originalSizeKB) * 100)}
                      % smaller)
                    </div>
                  </div>
                )}

                {/* Upload button */}
                <label className="w-full py-3 bg-white/5 hover:bg-white/10 text-center border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors block text-white">
                  {slide.uploading ? "Uploading..." : isVid ? "📹 Replace Video / Photo" : "🖼️ Replace Photo / Video"}
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={(e) => handleUpload(e, idx)}
                    disabled={slide.uploading}
                    className="hidden"
                  />
                </label>
              </div>
            );
          })}

          {/* Add slide card */}
          {slides.length < MAX_SLIDES && (
            <button
              type="button"
              onClick={handleAddSlide}
              className="bg-[#0d1a10] border border-dashed border-[#C4956A]/30 hover:border-[#C4956A]/70 rounded-3xl flex flex-col items-center justify-center gap-3 min-h-[220px] transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-[#C4956A]/40 group-hover:border-[#C4956A] flex items-center justify-center text-[#C4956A] text-2xl transition-all">
                +
              </div>
              <span className="text-[10px] tracking-widest uppercase text-[#C4956A]/60 group-hover:text-[#C4956A] font-[family-name:var(--font-josefin)] transition-all">
                Add Slide
              </span>
            </button>
          )}
        </div>

        {/* Info note */}
        <div className="p-4 bg-white/3 border border-white/5 rounded-2xl text-[11px] text-gray-500 leading-relaxed space-y-1">
          <div>
            <span className="text-[#C4956A]">🔁 Hero Continuous Video Loop:</span> Jitne bhi videos aap yahan add karenge, woh sab homepage ke hero section mein playlist loop mein chalenge (1 → 2 → 3 → ... → {slides.length}). Har video poori complete hone par next video play hogi, aur aakhri video khatam hote hi wapas 1st video se restart hokar continuous loop chalta rahega!
          </div>
          <div>
            <span className="text-[#8cc63f]">⚡ Video Optimization &amp; Direct URLs:</span> Cloudinary compression enabled. Aap file upload kar sakte hain, ya direct URL / local path (`/hero/hero-1.mp4`) paste kar sakte hain.
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving || anyUploading}
            className="px-8 py-3.5 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : `Save ${slides.length} Slide${slides.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </form>
    </div>
  );
}
