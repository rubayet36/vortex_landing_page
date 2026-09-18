"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#050505] text-white pt-10 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Outer Card Container with Rounded Corners */}
      <div className="max-w-[1360px] mx-auto bg-[#161819] rounded-[36px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16 relative overflow-hidden border border-slate-800/80 shadow-2xl">
        
        {/* Topographic Line Art Background SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 100 Q 200 400 600 100 T 1300 200"
            fill="none"
            stroke="#0ae448"
            strokeWidth="1.5"
          />
          <path
            d="M -50 200 Q 300 500 700 200 T 1400 300"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
          />
          <path
            d="M 100 -50 Q 500 300 900 -50 T 1500 100"
            fill="none"
            stroke="#0ae448"
            strokeWidth="1"
          />
        </svg>

        {/* ── TOP / CENTER BRAND HERO ─────────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center mb-16 lg:mb-20">
          
          {/* Green Asterisk / Topography Logo Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#0ae448]">
              <path
                fill="currentColor"
                d="M45,5 L55,5 L55,35 L76,14 L83,21 L62,42 L92,42 L92,52 L62,52 L83,73 L76,80 L55,59 L55,89 L45,89 L45,59 L24,80 L17,73 L38,52 L8,52 L8,42 L38,42 L17,21 L24,14 L45,35 Z"
              />
            </svg>
          </div>

          {/* Large Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
            Vortex Fitness Club
          </h2>

          {/* Subtitle */}
          <p className="text-slate-300 font-serif italic text-base sm:text-xl font-light mb-8">
            Where fitness meets lifestyle
          </p>

          {/* Pill CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#pricing"
              className="bg-[#0ae448] text-black font-extrabold px-7 py-3.5 rounded-full hover:bg-[#08c73e] transition-all duration-300 shadow-lg shadow-[#0ae448]/20 flex items-center gap-2 text-sm sm:text-base group"
            >
              <span>Book a Session</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="#pricing"
              className="bg-[#0d3822] text-white border border-[#0ae448]/40 font-semibold px-7 py-3.5 rounded-full hover:bg-[#124a2d] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base group"
            >
              <span>Become a Member</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM SECTION: CONTACT & QUICK LINKS ─────────────────── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-slate-800/80 items-end">
          
          {/* LEFT: Contact Information & Socials */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Contact</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                House 48 (2nd floor), Road 2, Block E<br />
                Banasree, Rampura, Dhaka, Bangladesh<br />
                <span className="text-slate-400 font-mono text-xs">+880 1700-000000</span><br />
                <a href="mailto:info@vortexfitness.com" className="text-slate-300 hover:text-[#0ae448] transition-colors">
                  info@vortexfitness.com
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
              <a href="#" className="hover:text-[#0ae448] transition-colors flex items-center gap-1">
                Facebook <span className="text-xs">↗</span>
              </a>
              <a href="#" className="hover:text-[#0ae448] transition-colors flex items-center gap-1">
                Instagram <span className="text-xs">↗</span>
              </a>
              <a href="#" className="hover:text-[#0ae448] transition-colors flex items-center gap-1">
                LinkedIn <span className="text-xs">↗</span>
              </a>
            </div>

            {/* Rating Pill */}
            <div className="flex items-center gap-3 pt-2">
              <span className="bg-[#0ae448] text-black text-xs font-bold px-2.5 py-1 rounded-full">
                4.9 ★
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Community & Athlete Score
              </span>
            </div>
          </div>

          {/* RIGHT: Quick Links & Legal Pill */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 lg:items-end">
            
            {/* Links Columns */}
            <div className="w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                <ul className="space-y-2.5">
                  <li><Link href="#about" className="hover:text-[#0ae448] transition-colors">Our Club</Link></li>
                  <li><Link href="#facilities" className="hover:text-[#0ae448] transition-colors">For Guests</Link></li>
                  <li><Link href="#journey" className="hover:text-[#0ae448] transition-colors">Beginner Guide</Link></li>
                </ul>
                <ul className="space-y-2.5">
                  <li><Link href="#facilities" className="hover:text-[#0ae448] transition-colors">Facilities</Link></li>
                  <li><Link href="#pricing" className="hover:text-[#0ae448] transition-colors">Events & Packages</Link></li>
                  <li><Link href="#contact" className="hover:text-[#0ae448] transition-colors">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Policy Pill matching mockup */}
            <div className="bg-[#fffce1] text-slate-900 rounded-full px-5 py-2.5 inline-flex items-center gap-4 text-xs font-bold shadow-md">
              <a href="#" className="hover:underline">Cookies policy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy policy</a>
              <span>·</span>
              <span>©2026 VORTEX</span>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
