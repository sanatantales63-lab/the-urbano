"use client";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/settingsData";
import { compressAndUploadDetailed, UploadResult } from "@/lib/cloudinary";

export default function AdminMaterialsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [images, setImages] = useState({
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
  });

  const [uploadStats, setUploadStats] = useState<Record<string, UploadResult>>({});
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const vals = await getSettings(
          ["materials_img_1", "materials_img_2", "materials_img_3", "materials_img_4", "materials_img_5"],
          {
            materials_img_1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop",
            materials_img_2: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=85&auto=format&fit=crop",
            materials_img_3: "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600&q=85&auto=format&fit=crop",
            materials_img_4: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600&q=85&auto=format&fit=crop",
            materials_img_5: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&q=85&auto=format&fit=crop"
          }
        );
        setImages({
          img1: vals.materials_img_1,
          img2: vals.materials_img_2,
          img3: vals.materials_img_3,
          img4: vals.materials_img_4,
          img5: vals.materials_img_5,
        });
      } catch (err) {
        setError("Failed to load materials grid config.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(prev => ({ ...prev, [key]: true }));
    setError("");
    try {
      const stats = await compressAndUploadDetailed(file);
      setImages(prev => ({ ...prev, [key]: stats.url }));
      setUploadStats(prev => ({ ...prev, [key]: stats }));
      setSuccess(`⚡ Grid photo uploaded & compressed successfully!`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload photo.");
    } finally {
      setUploadingState(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateSettings({
        materials_img_1: images.img1,
        materials_img_2: images.img2,
        materials_img_3: images.img3,
        materials_img_4: images.img4,
        materials_img_5: images.img5,
      });
      setSuccess("✅ Materials palette grid saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError("Failed to save materials grid config.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm p-4">Loading Materials Config...</div>;
  }

  const gridItems = [
    { key: "img1", label: "Main Large Image (2x2)", desc: "Warm Wood & Travertine (Large)" },
    { key: "img2", label: "Small Photo 1", desc: "Aged Brass Details (Top Right)" },
    { key: "img3", label: "Small Photo 2", desc: "Handwoven Textiles (Top Center)" },
    { key: "img4", label: "Small Photo 3", desc: "Carrara Marble Texture (Bottom Right)" },
    { key: "img5", label: "Small Photo 4", desc: "Sage & Botanicals (Bottom Center)" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">Materials Grid</h1>
        <p className="text-gray-400 text-xs mt-1">
          Manage the 5 gallery grid images shown in &quot;The Palette We Speak&quot; section on the home page.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridItems.map((item) => {
            const currentImg = images[item.key as keyof typeof images];
            const isUploading = uploadingState[item.key] || false;
            const stats = uploadStats[item.key];

            return (
              <div key={item.key} className="bg-[#111111] border border-white/5 p-5 rounded-3xl flex flex-col gap-3">
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-[#C4956A] uppercase font-[family-name:var(--font-cinzel)]">
                    {item.label}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>

                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 relative">
                  <img src={currentImg} alt={item.label} className="w-full h-full object-cover" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs text-[#C4956A] animate-pulse">
                      Uploading to Cloudinary...
                    </div>
                  )}
                </div>

                {stats && (
                  <div className="text-[9px] bg-white/5 border border-white/10 p-2.5 rounded-xl flex flex-col gap-0.5 font-mono text-[#8cc63f]">
                    <div>⚡ Status: {stats.didCompress ? "COMPRESSED" : "ORIGINAL"}</div>
                    <div>📉 Original: {stats.originalSizeKB} KB</div>
                    <div>📉 Compressed: {stats.compressedSizeKB} KB</div>
                  </div>
                )}

                <label className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-center border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors block text-white mt-1">
                  {isUploading ? "Uploading..." : "✏️ Upload Photo"}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(item.key, e)} disabled={isUploading} className="hidden" />
                </label>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving || Object.values(uploadingState).some(Boolean)}
            className="px-8 py-3.5 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
          >
            {saving ? "Saving grid images..." : "Save Materials Grid"}
          </button>
        </div>
      </form>
    </div>
  );
}
