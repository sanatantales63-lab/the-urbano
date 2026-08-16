"use client";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/settingsData";

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const vals = await getSettings(
          ["footer_address", "footer_phone", "footer_email"],
          {
            footer_address: "The Urbano, 4th Floor, Premium Block, Sector V, Salt Lake, Kolkata, WB 700091",
            footer_phone: "+91 9583529847 / +91 9123787492",
            footer_email: "theurbano.interior@gmail.com",
          }
        );
        setAddress(vals.footer_address);
        setPhone(vals.footer_phone);
        setEmail(vals.footer_email);
      } catch (err) {
        setError("Failed to load settings from Supabase.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateSettings({
        footer_address: address,
        footer_phone: phone,
        footer_email: email,
      });
      setSuccess("✅ Footer contact info saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError("Failed to save contact settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm p-4">Loading Footer Settings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">Footer Info</h1>
        <p className="text-gray-400 text-xs mt-1">
          Manage contact details, email addresses, phone numbers, and physical showroom coordinates shown in the footer of your website.
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#111111] border border-white/5 p-6 md:p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold tracking-widest text-[#C4956A] uppercase font-[family-name:var(--font-cinzel)] border-b border-white/5 pb-3">
            Footer Contact Details
          </h2>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
              Physical Showroom Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="e.g. The Urbano, 4th Floor, Premium Block, Sector V, Salt Lake, Kolkata, WB 700091"
              required
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C4956A] outline-none text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Phone Contact Number(s)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9583529847 / +91 9123787492"
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C4956A] outline-none text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Design Inquiry Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. theurbano.interior@gmail.com"
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C4956A] outline-none text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#C4956A] hover:bg-[#b38359] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
          >
            {saving ? "Saving settings..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
