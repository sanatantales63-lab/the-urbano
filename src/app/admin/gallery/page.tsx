"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUploadDetailed, UploadResult } from "@/lib/cloudinary";

interface GalleryItem {
  id?: number;
  title: string;
  category: string;
  category_label: string;
  description?: string;
  image_url: string;
  aspect: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("residential");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [aspect, setAspect] = useState("aspect-[4/3]");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadResult | null>(null);

  const categories = [
    { id: "residential", label: "Residential" },
    { id: "pantry", label: "Pantry Section" },
    { id: "kitchen", label: "Modular Kitchen" },
    { id: "gym_salon", label: "Gym & Unisex Salon" },
  ];

  const aspectRatios = [
    { id: "aspect-[4/3]", label: "Standard (4:3)" },
    { id: "aspect-[3/4]", label: "Portrait (3:4)" },
    { id: "aspect-[16/10]", label: "Landscape (16:10)" },
    { id: "aspect-[4/5]", label: "Tall Portrait (4:5)" },
  ];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.warn("Supabase fetch gallery error:", err);
      setError("Failed to fetch gallery. Make sure to run the SQL editor script.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setUploadStats(null);
    try {
      const stats = await compressAndUploadDetailed(file);
      setImageUrl(stats.url);
      setUploadStats(stats);
      setSuccess("⚡ Gallery image compressed and uploaded to Cloudinary!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setError("Please fill in the title and upload an image.");
      return;
    }

    setSaving(true);
    setError("");

    const categoryLabel = categories.find((c) => c.id === category)?.label || category;
    const galleryData = {
      title,
      category,
      category_label: categoryLabel,
      description,
      image_url: imageUrl,
      aspect,
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from("gallery")
          .update(galleryData)
          .eq("id", editingItem.id);
        if (error) throw error;
        setSuccess("✅ Gallery item updated successfully!");
      } else {
        const { error } = await supabase
          .from("gallery")
          .insert([galleryData]);
        if (error) throw error;
        setSuccess("✅ Gallery item added successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchGallery();
    } catch (err: any) {
      setError(err.message || "Failed to save gallery item.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    setError("");
    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setSuccess("🗑️ Gallery item deleted successfully!");
      fetchGallery();
    } catch (err: any) {
      setError(err.message || "Failed to delete item.");
    } finally {
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("residential");
    setDescription("");
    setImageUrl("");
    setAspect("aspect-[4/3]");
    setUploadStats(null);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description || "");
    setImageUrl(item.image_url);
    setAspect(item.aspect);
    setUploadStats(null);
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">Gallery Section</h1>
          <p className="text-gray-400 text-xs mt-1">
            Manage finished luxury projects displayed in the home page masonry grid.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-5 py-3 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg self-start sm:self-center"
        >
          ＋ Add New Image
        </button>
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

      {/* Grid of gallery items */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading gallery masterpieces...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm bg-[#111111] rounded-3xl border border-white/5">
          No custom gallery photos found. Setup database to manage.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="aspect-[4/3] relative w-full bg-gray-900 border-b border-white/5 overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C4956A] text-white text-[8px] font-bold uppercase tracking-wider rounded-md">
                  {item.category_label}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-white text-sm font-bold truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{item.description || "No description provided."}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                  <span className="text-[9px] text-[#8cc63f] font-mono">{item.aspect}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[9px] font-bold uppercase rounded-lg transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="px-2.5 py-1 bg-red-950/20 hover:bg-red-900/40 text-red-400 text-[9px] font-bold uppercase rounded-lg transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#C4956A]/30 w-full max-w-lg rounded-3xl p-6 md:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-white mb-6">
              {editingItem ? "Edit Photo Details" : "Add New Gallery Photo"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Living Room"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C4956A] outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                    Design Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#C4956A] outline-none text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                    Aspect Ratio (Grid layout)
                  </label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#C4956A] outline-none text-white"
                  >
                    {aspectRatios.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Photo Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Tell something about this luxury space..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#C4956A] outline-none text-white resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Photo (Cloudinary Auto-Compress Uploader)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C4956A]/20 file:text-[#C4956A] hover:file:bg-[#C4956A]/30 file:cursor-pointer"
                  />
                  {uploading && <span className="text-xs text-[#C4956A] animate-pulse">Processing...</span>}
                </div>

                {uploadStats && (
                  <div className="text-[9px] bg-[#8cc63f]/10 border border-[#8cc63f]/30 p-2.5 rounded-xl flex flex-col gap-0.5 font-mono text-[#8cc63f] mt-3">
                    <div>⚡ Status: {uploadStats.didCompress ? "COMPRESSED" : "ORIGINAL"}</div>
                    <div>📉 Original Size: {uploadStats.originalSizeKB} KB</div>
                    <div>📉 Compressed Size: {uploadStats.compressedSizeKB} KB</div>
                    <div>📈 Space Savings: {Math.max(0, uploadStats.originalSizeKB - uploadStats.compressedSizeKB)} KB ({Math.round(((uploadStats.originalSizeKB - uploadStats.compressedSizeKB) / uploadStats.originalSizeKB) * 100)}% smaller)</div>
                  </div>
                )}

                {imageUrl && (
                  <div className="mt-3 w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-gray-900">
                    <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 bg-[#C4956A] hover:bg-[#b38359] rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                >
                  {saving ? "Saving..." : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
