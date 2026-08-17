"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUploadToCloudinary } from "@/lib/cloudinary";
import { DEFAULT_CATEGORIES, CategoryItem, CategoryPhoto } from "@/lib/categoriesData";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Category Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Photo Gallery Management Modal state
  const [selectedCatForPhotos, setSelectedCatForPhotos] = useState<CategoryItem | null>(null);
  const [catPhotos, setCatPhotos] = useState<CategoryPhoto[]>([]);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (err) {
      console.warn("Using default categories:", err);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  // Image Upload handler with Inbuilt Compression + Cloudinary
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await compressAndUploadToCloudinary(file);
      setCoverImage(url);
      setSuccess("⚡ Cover image compressed and uploaded to Cloudinary!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !coverImage) {
      setError("Please fill in Title, Slug, and upload a Cover Image.");
      return;
    }

    setUploading(true);
    setError("");

    const categoryData: CategoryItem = {
      slug,
      title,
      description,
      cover_image: coverImage,
      is_featured: isFeatured,
    };

    try {
      if (editingCategory) {
        // Update existing category in Supabase by slug
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("slug", editingCategory.slug);
        if (error) throw error;
      } else {
        // Insert new category in Supabase
        const { error } = await supabase.from("categories").insert([categoryData]);
        if (error) throw error;
      }

      setSuccess(`✅ Category "${title}" saved successfully!`);
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      console.warn("Supabase category save fallback:", err);
      // Local state update fallback
      if (editingCategory) {
        setCategories(categories.map((c) => (c.slug === editingCategory.slug ? categoryData : c)));
      } else {
        setCategories([...categories, categoryData]);
      }
      setSuccess(`✅ Saved locally: "${title}"`);
      setShowModal(false);
      resetForm();
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  const toggleFeatured = async (cat: CategoryItem) => {
    const featuredCount = categories.filter((c) => c.is_featured && c.slug !== cat.slug).length;

    if (!cat.is_featured && featuredCount >= 6) {
      alert("Maximum 6 categories can be featured on the homepage. Uncheck another category first.");
      return;
    }

    const updatedStatus = !cat.is_featured;
    try {
      await supabase.from("categories").update({ is_featured: updatedStatus }).eq("slug", cat.slug);
    } catch (e) {
      console.warn("Featured toggle Supabase update failed:", e);
    }

    setCategories(categories.map((c) => (c.slug === cat.slug ? { ...c, is_featured: updatedStatus } : c)));
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category "${cat.title}"?`)) return;

    try {
      await supabase.from("categories").delete().eq("slug", cat.slug);
    } catch (e) {
      console.warn("Delete Supabase update failed:", e);
    }
    setCategories(categories.filter((c) => c.slug !== cat.slug));
    setSuccess(`Deleted "${cat.title}"`);
    setTimeout(() => setSuccess(""), 3000);
  };

  // ── PHOTO GALLERY MANAGEMENT ──
  const openPhotoManager = async (cat: CategoryItem) => {
    setSelectedCatForPhotos(cat);
    setPhotoTitle("");
    try {
      const { data } = await supabase
        .from("category_images")
        .select("*")
        .eq("category_slug", cat.slug)
        .order("created_at", { ascending: false });

      if (data) setCatPhotos(data);
      else setCatPhotos([]);
    } catch {
      setCatPhotos([]);
    }
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCatForPhotos) return;

    setPhotoUploading(true);
    try {
      const imageUrl = await compressAndUploadToCloudinary(file);
      const newPhoto: CategoryPhoto = {
        category_slug: selectedCatForPhotos.slug,
        image_url: imageUrl,
        title: photoTitle || selectedCatForPhotos.title,
      };

      try {
        const { data, error } = await supabase
          .from("category_images")
          .insert([newPhoto])
          .select()
          .single();
        if (!error && data) {
          setCatPhotos([data, ...catPhotos]);
        } else {
          setCatPhotos([newPhoto, ...catPhotos]);
        }
      } catch {
        setCatPhotos([newPhoto, ...catPhotos]);
      }

      setPhotoTitle("");
      setSuccess("⚡ Photo uploaded to Cloudinary!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert("Photo upload failed: " + err.message);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: CategoryPhoto) => {
    if (!confirm("Delete this photo from category gallery?")) return;
    try {
      if (photo.id) {
        await supabase.from("category_images").delete().eq("id", photo.id);
      }
    } catch {}
    setCatPhotos(catPhotos.filter((p) => p.image_url !== photo.image_url));
  };

  const resetForm = () => {
    setEditingCategory(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setCoverImage("");
    setIsFeatured(false);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setSlug(cat.slug);
    setDescription(cat.description);
    setCoverImage(cat.cover_image);
    setIsFeatured(cat.is_featured || false);
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">
            Category Management
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Create categories, upload Cloudinary photos, and choose 4 featured categories for the homepage.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-5 py-3 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
        >
          <span>＋</span> Add New Category
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs rounded-2xl flex items-center justify-between">
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800/50 text-red-400 text-xs rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Categories Grid Table */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              All Categories ({categories.length})
            </span>
            <span className="px-3 py-1 bg-[#8cc63f]/10 border border-[#8cc63f]/30 text-[#8cc63f] text-[9px] rounded-full font-bold">
              {categories.filter((c) => c.is_featured).length} Featured on Homepage
            </span>
          </div>
          <span className="text-[10px] text-gray-500">
            Cloudinary: <code className="text-[#C4956A]">suabdqxg</code> | Preset: <code className="text-[#C4956A]">the-urbano</code>
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading categories...</div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Info & Cover */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-900 border border-white/10 shrink-0">
                    <img src={cat.cover_image} alt={cat.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white text-lg font-bold font-[family-name:var(--font-cormorant)]">
                        {cat.title}
                      </h3>
                      <code className="text-[9px] text-[#C4956A] bg-[#C4956A]/10 px-2 py-0.5 rounded-md">
                        /category/{cat.slug}
                      </code>
                      {cat.is_featured && (
                        <span className="bg-[#8cc63f]/20 border border-[#8cc63f]/40 text-[#8cc63f] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ⭐ Homepage Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">{cat.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleFeatured(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      cat.is_featured
                        ? "bg-[#8cc63f]/10 text-[#8cc63f] border-[#8cc63f]/30 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/30"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {cat.is_featured ? "Featured ★" : "Feature on Homepage"}
                  </button>

                  <button
                    onClick={() => openPhotoManager(cat)}
                    className="px-3.5 py-1.5 bg-[#C4956A]/15 border border-[#C4956A]/30 text-[#C4956A] hover:bg-[#C4956A]/25 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    🖼️ Manage Photos
                  </button>

                  <button
                    onClick={() => openEditModal(cat)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="px-3 py-1.5 bg-red-950/20 hover:bg-red-900/40 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT CATEGORY MODAL ── */}
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
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Category Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Luxury Penthouse"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C4956A] outline-none text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-[#C4956A] focus:border-[#C4956A] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe this design category..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#C4956A] outline-none text-white resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Cover Image (Cloudinary Auto-Compress Upload)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploading}
                    className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C4956A]/20 file:text-[#C4956A] hover:file:bg-[#C4956A]/30 file:cursor-pointer"
                  />
                  {uploading && <span className="text-xs text-[#C4956A] animate-pulse">Compressing & Uploading...</span>}
                </div>
                {coverImage && (
                  <div className="mt-3 w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-gray-900">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#C4956A]"
                />
                <label htmlFor="feat" className="text-xs text-gray-300 font-medium">
                  Feature on Homepage (Max 4 categories)
                </label>
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
                  disabled={uploading}
                  className="flex-1 py-3 bg-[#C4956A] hover:bg-[#b38359] rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MANAGE CATEGORY PHOTOS MODAL ── */}
      {selectedCatForPhotos && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#C4956A]/30 w-full max-w-3xl rounded-3xl p-6 md:p-8 text-white relative shadow-2xl max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedCatForPhotos(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-[9px] text-[#C4956A] font-bold uppercase tracking-widest">
                Category Portfolio Gallery
              </span>
              <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-white">
                {selectedCatForPhotos.title} Photos ({catPhotos.length})
              </h2>
            </div>

            {/* Upload form for photos */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row items-center gap-3">
              <input
                type="text"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="Photo Title / Caption (optional)"
                className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-[#C4956A] outline-none flex-1 w-full"
              />

              <label className="px-5 py-2.5 bg-[#C4956A] hover:bg-[#b38359] text-white text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer shrink-0 transition-all">
                {photoUploading ? "Uploading..." : "＋ Upload Photo to Cloudinary"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddPhoto}
                  disabled={photoUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photos Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 pr-1">
              {catPhotos.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 text-xs">
                  No photos uploaded for this category yet. Upload your first Cloudinary photo above!
                </div>
              ) : (
                catPhotos.map((photo, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden bg-gray-900 border border-white/10 h-36">
                    <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <p className="text-[10px] text-white font-bold truncate">{photo.title || "Untitled"}</p>
                      <button
                        onClick={() => handleDeletePhoto(photo)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-[9px] font-bold self-end"
                      >
                        Delete 🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedCatForPhotos(null)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
