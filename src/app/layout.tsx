import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Josefin_Sans, Cinzel } from "next/font/google";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["300", "400", "600"], variable: '--font-josefin' });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600"], style: ['normal', 'italic'], variable: '--font-cormorant' });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: "The Urbano | Premium Interior Design",
  description: "Kolkata's premier luxury interior design atelier.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${josefin.variable} ${cormorant.variable} ${cinzel.variable} font-sans antialiased bg-white text-[#1a1a1a]`}>
        <SmoothScroll />
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}