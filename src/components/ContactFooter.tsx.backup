"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSettings } from "@/lib/settingsData";

export default function ContactFooter() {
  const [address, setAddress] = useState("The Urbano, 4th Floor, Premium Block, Sector V, Salt Lake, Kolkata, WB 700091");
  const [phone, setPhone] = useState("+91 9583529847 / +91 9123787492");
  const [email, setEmail] = useState("theurbano.interior@gmail.com");

  useEffect(() => {
    getSettings(
      ["footer_address", "footer_phone", "footer_email"],
      {
        footer_address: "The Urbano, 4th Floor, Premium Block, Sector V, Salt Lake, Kolkata, WB 700091",
        footer_phone: "+91 9583529847 / +91 9123787492",
        footer_email: "theurbano.interior@gmail.com"
      }
    ).then((vals) => {
      setAddress(vals.footer_address);
      setPhone(vals.footer_phone);
      setEmail(vals.footer_email);
    });
  }, []);

  return (
    <section className="bg-[#0b0a0c] relative overflow-hidden" id="contact">
      
      {/* Premium Dark Glows */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#C4956A]/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#203a27]/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Main consultation wrapper */}
      <div className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Coordinates & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-[0.5em] text-[#C4956A] uppercase font-bold drop-shadow-sm mb-4 block">
                Consultation Atelier
              </span>
              <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-white font-light leading-tight mb-6">
                Begin Your <br /><span className="font-bold text-[#C4956A]">Design Journey</span>
              </h2>
              <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-400 leading-relaxed mb-8 max-w-md">
                Every transformed home begins with a single conversation. Schedule a private consultation with our principal designers in our Kolkata studio or request a home visit.
              </p>
            </div>

            {/* Studio Info Blocks */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span className="text-xl text-[#C4956A] mt-1">📍</span>
                <div>
                  <h4 className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest text-[#C4956A] uppercase font-bold mb-1">Our Showroom</h4>
                  <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-300 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-xl text-[#C4956A] mt-1">📞</span>
                <div>
                  <h4 className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest text-[#C4956A] uppercase font-bold mb-1">Direct Call</h4>
                  <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-300 leading-relaxed">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-xl text-[#C4956A] mt-1">✉️</span>
                <div>
                  <h4 className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest text-[#C4956A] uppercase font-bold mb-1">Design Inquiry</h4>
                  <p className="font-[family-name:var(--font-josefin)] text-xs text-gray-300 leading-relaxed">
                    {email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form Grid */}
          <div className="lg:col-span-7">
            <motion.form 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col justify-between h-full"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.4em] uppercase text-[#C4956A] font-bold">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="bg-transparent border-b border-white/10 pb-3 text-white text-sm font-[family-name:var(--font-josefin)] outline-none focus:border-[#C4956A] transition-colors placeholder-gray-700" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.4em] uppercase text-[#C4956A] font-bold">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000" 
                    className="bg-transparent border-b border-white/10 pb-3 text-white text-sm font-[family-name:var(--font-josefin)] outline-none focus:border-[#C4956A] transition-colors placeholder-gray-700" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.4em] uppercase text-[#C4956A] font-bold">Property Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1200 Sq Ft, 3 BHK" 
                    className="bg-transparent border-b border-white/10 pb-3 text-white text-sm font-[family-name:var(--font-josefin)] outline-none focus:border-[#C4956A] transition-colors placeholder-gray-700" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.4em] uppercase text-[#C4956A] font-bold">Project Type</label>
                  <select 
                    className="bg-transparent border-b border-white/10 pb-3 text-white text-sm font-[family-name:var(--font-josefin)] outline-none focus:border-[#C4956A] transition-colors appearance-none cursor-pointer"
                  >
                    <option className="bg-[#111111] text-white">Full Home Interior</option>
                    <option className="bg-[#111111] text-white">Luxury Villa / Penthouse</option>
                    <option className="bg-[#111111] text-white">Modular Kitchen</option>
                    <option className="bg-[#111111] text-white">Commercial Space</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="w-full py-4 mt-4 bg-gradient-to-r from-[#203a27] to-[#17261a] hover:from-[#C4956A] hover:to-[#B5855A] text-white border border-[#C4956A]/30 font-[family-name:var(--font-cinzel)] text-[9px] tracking-[0.3em] uppercase font-bold rounded-full transition-all duration-500 shadow-[0_10px_35px_rgba(32,58,39,0.15)] hover:shadow-[0_15px_40px_rgba(196,149,106,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Enquiry — We'll Call Within 24 Hours
              </button>
            </motion.form>
          </div>

        </div>
      </div>

      {/* Footer Strip */}
      <div className="border-t border-white/5 bg-[#080709] py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3 className="font-[family-name:var(--font-cormorant)] text-3xl text-white mb-2 tracking-wide font-light">The <span className="font-bold text-[#C4956A]">Urbano</span></h3>
            <p className="font-[family-name:var(--font-josefin)] text-sm text-gray-500 italic">"We don't decorate spaces. We compose lives."</p>
          </div>
          <div className="font-[family-name:var(--font-josefin)] text-xs text-gray-400 leading-relaxed md:pl-10">
            Kolkata, West Bengal, India<br/>
            +91 9583529847 / +91 9123787492<br/>
            theurbano.interior@gmail.com
          </div>
          <div className="flex justify-center md:justify-end gap-6 items-center">
            <a href="#" className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest text-gray-400 hover:text-[#C4956A] transition-colors uppercase font-bold">Instagram</a>
            <a href="#" className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest text-gray-400 hover:text-[#C4956A] transition-colors uppercase font-bold">Houzz</a>
            <a href="#" className="font-[family-name:var(--font-cinzel)] text-[9px] tracking-widest text-gray-400 hover:text-[#C4956A] transition-colors uppercase font-bold">WhatsApp</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-[family-name:var(--font-josefin)] text-[10px] text-gray-600 tracking-wider">© 2026 The Urbano — All rights reserved.</span>
          <span className="font-[family-name:var(--font-josefin)] text-[10px] text-gray-600 tracking-wider">Designed with passion in Kolkata</span>
        </div>
      </div>
    </section>
  );
}