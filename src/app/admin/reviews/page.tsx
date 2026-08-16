"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Review {
  id?: number;
  quote: string;
  author: string;
  location?: string;
  loc?: string;
  initial: string;
  rating: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.warn("Supabase fetch reviews error:", err);
      setError("Failed to fetch reviews. Please ensure you executed the SQL editor script.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !author) {
      setError("Please fill in Quote and Author.");
      return;
    }

    setSaving(true);
    setError("");

    const initial = author.trim().charAt(0).toUpperCase() || "U";
    const reviewData = {
      quote,
      author,
      location,
      loc: location, // Duplicate column for safety
      initial,
      rating,
    };

    try {
      if (editingReview?.id) {
        const { error } = await supabase
          .from("reviews")
          .update(reviewData)
          .eq("id", editingReview.id);
        if (error) throw error;
        setSuccess("✅ Review updated successfully!");
      } else {
        const { error } = await supabase
          .from("reviews")
          .insert([reviewData]);
        if (error) throw error;
        setSuccess("✅ Review added successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "Failed to save review.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setError("");
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setSuccess("🗑️ Review deleted successfully!");
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "Failed to delete review.");
    } finally {
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const resetForm = () => {
    setEditingReview(null);
    setQuote("");
    setAuthor("");
    setLocation("");
    setRating(5);
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setQuote(review.quote);
    setAuthor(review.author);
    setLocation(review.location || review.loc || "");
    setRating(review.rating);
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">Client Reviews</h1>
          <p className="text-gray-400 text-xs mt-1">
            Manage the user reviews shown in the website testimonials carousel.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-5 py-3 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg self-start sm:self-center"
        >
          ＋ Add New Review
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

      {/* Reviews Table List */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Client Testimonials ({reviews.length})
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No reviews added yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {reviews.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#C4956A]/15 border border-[#C4956A]/30 flex items-center justify-center text-[#C4956A] font-bold shrink-0">
                    {item.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white text-sm font-bold">{item.author}</h4>
                      {(item.location || item.loc) && (
                        <span className="text-[10px] text-gray-500">
                          ({item.location || item.loc})
                        </span>
                      )}
                      <span className="text-yellow-500 text-[10px]">
                        {"★".repeat(item.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">
                      &quot;{item.quote}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
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
              {editingReview ? "Edit Review" : "Add New Review"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Aarav Mehta"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C4956A] outline-none text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Alipore, Kolkata"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C4956A] outline-none text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#C4956A] outline-none text-white"
                >
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <option key={stars} value={stars}>
                      {stars} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Quote
                </label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                  placeholder="Insert review text here..."
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#C4956A] outline-none text-white resize-none"
                />
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
                  disabled={saving}
                  className="flex-1 py-3 bg-[#C4956A] hover:bg-[#b38359] rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                >
                  {saving ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
