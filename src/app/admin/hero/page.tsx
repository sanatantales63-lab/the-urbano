"use client";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/settingsData";
import { compressAndUploadDetailed, UploadResult } from "@/lib/cloudinary";

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [bgImage, setBgImage] = useState("");
  const [overlayImage, setOverlayImage] = useState("");

  // Compression stats
  const [bgUploadStats, setBgUploadStats] = useState<UploadResult | null>(null);
  const [overlayUploadStats, setOverlayUploadStats] = useState<UploadResult | null>(null);

  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingOverlay, setUploadingOverlay] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const vals = await getSettings(
          ["hero_bg_image", "hero_overlay_image"],
          {
            hero_bg_image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1800&q=90&auto=format&fit=crop",
            hero_overlay_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90&auto=format&fit=crop",
          }
        );
        setBgImage(vals.hero_bg_image);
        setOverlayImage(vals.hero_overlay_image);
      } catch (err) {
        setError("Failed to load hero configurations.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBg(true);
    setError("");
    try {
      const stats = await compressAndUploadDetailed(file);
      setBgImage(stats.url);
      setBgUploadStats(stats);
      setSuccess("⚡ Hero background image uploaded & compressed successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload background image.");
    } finally {
      setUploadingBg(false);
    }
  };

  const handleOverlayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOverlay(true);
    setError("");
    try {
      const stats = await compressAndUploadDetailed(file);
      setOverlayImage(stats.url);
      setOverlayUploadStats(stats);
      setSuccess("⚡ Hero interior overlay image uploaded & compressed successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload overlay image.");
    } finally {
      setUploadingOverlay(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateSettings({
        hero_bg_image: bgImage,
        hero_overlay_image: overlayImage,
      });
      setSuccess("✅ Hero section images saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError("Failed to save hero section images.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm p-4">Loading Hero Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">Hero Section</h1>
        <p className="text-gray-400 text-xs mt-1">
          Manage the two layered banner images for the landing cinematic reveal effect.
        </p>
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

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Background Building Image Card */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest text-[#C4956A] uppercase font-[family-name:var(--font-cinzel)]">
              Layer 0: Building Exterior
            </h3>
            <p className="text-xs text-gray-400">
              This is the base image of the iconic building shown after the curtain drop reveal.
            </p>

            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 relative">
              <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover" />
              {uploadingBg && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs text-[#C4956A] animate-pulse">
                  Uploading to Cloudinary...
                </div>
              )}
            </div>

            {bgUploadStats && (
              <div className="text-[10px] bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1 font-mono text-[#8cc63f]">
                <div>⚡ Compression status: {bgUploadStats.didCompress ? "COMPRESSED" : "ORIGINAL"}</div>
                <div>📉 Original: {bgUploadStats.originalSizeKB} KB</div>
                <div>📉 Compressed: {bgUploadStats.compressedSizeKB} KB</div>
                <div>📈 Savings: {Math.max(0, bgUploadStats.originalSizeKB - bgUploadStats.compressedSizeKB)} KB ({Math.round(((bgUploadStats.originalSizeKB - bgUploadStats.compressedSizeKB) / bgUploadStats.originalSizeKB) * 100)}% smaller)</div>
              </div>
            )}

            <label className="w-full py-3 bg-white/5 hover:bg-white/10 text-center border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors block text-white">
              {uploadingBg ? "Uploading..." : "✏️ Upload New Photo"}
              <input type="file" accept="image/*" onChange={handleBgUpload} disabled={uploadingBg} className="hidden" />
            </label>
          </div>

          {/* Foreground Overlay Image Card */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest text-[#C4956A] uppercase font-[family-name:var(--font-cinzel)]">
              Layer 1: Interior Overlay
            </h3>
            <p className="text-xs text-gray-400">
              The dark luxury interior image that slides down initially.
            </p>

            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 relative">
              <img src={overlayImage} alt="Hero Overlay" className="w-full h-full object-cover" />
              {uploadingOverlay && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs text-[#C4956A] animate-pulse">
                  Uploading to Cloudinary...
                </div>
              )}
            </div>

            {overlayUploadStats && (
              <div className="text-[10px] bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1 font-mono text-[#8cc63f]">
                <div>⚡ Compression status: {overlayUploadStats.didCompress ? "COMPRESSED" : "ORIGINAL"}</div>
                <div>📉 Original: {overlayUploadStats.originalSizeKB} KB</div>
                <div>📉 Compressed: {overlayUploadStats.compressedSizeKB} KB</div>
                <div>📈 Savings: {Math.max(0, overlayUploadStats.originalSizeKB - overlayUploadStats.compressedSizeKB)} KB ({Math.round(((overlayUploadStats.originalSizeKB - overlayUploadStats.compressedSizeKB) / overlayUploadStats.originalSizeKB) * 100)}% smaller)</div>
              </div>
            )}

            <label className="w-full py-3 bg-white/5 hover:bg-white/10 text-center border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors block text-white">
              {uploadingOverlay ? "Uploading..." : "✏️ Upload New Photo"}
              <input type="file" accept="image/*" onChange={handleOverlayUpload} disabled={uploadingOverlay} className="hidden" />
            </label>
          </div>

        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving || uploadingBg || uploadingOverlay}
            className="px-8 py-3.5 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
          >
            {saving ? "Saving changes..." : "Save Configured Images"}
          </button>
        </div>
      </form>
    </div>
  );
}
