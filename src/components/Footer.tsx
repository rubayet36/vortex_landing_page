"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/business-config";
import logoImg from "@/assets/logo.png";

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
            stroke="#FF3B30"
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
            stroke="#FF3B30"
            strokeWidth="1"
          />
        </svg>

        {/* ── TOP / CENTER BRAND HERO ─────────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center mb-16 lg:mb-20">
          {/* Logo Symbol */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 flex items-center justify-center relative">
            <div className="w-full h-full rounded-[22.5%] overflow-hidden bg-black shadow-2xl shadow-red-500/25 border border-white/10 flex items-center justify-center">
              <Image
                src={logoImg}
                alt={`${SITE_CONFIG.name} Logo`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Large Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
            {SITE_CONFIG.name}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-300 font-serif italic text-base sm:text-xl font-light mb-8">
            Where fitness meets lifestyle
          </p>

          {/* Pill CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/join"
              className="bg-[#FF3B30] text-white font-extrabold px-7 py-3.5 rounded-full hover:bg-[#E02E24] transition-all duration-300 shadow-lg shadow-[#FF3B30]/30 flex items-center gap-2 text-sm sm:text-base group"
            >
              <span>Join the Club</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="#pricing"
              className="bg-[#1a0c0b] text-white border border-[#FF3B30]/50 font-semibold px-7 py-3.5 rounded-full hover:bg-[#2e1412] hover:border-[#FF3B30] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base group"
            >
              <span>View Packages</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM SECTION: CONTACT & QUICK LINKS ─────────────────── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-slate-800/80 items-end">
          {/* LEFT: Confirmed Location & Google Maps Link */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Location &amp; Directions</h3>
              <p className="text-slate-200 text-sm font-semibold leading-relaxed">
                {SITE_CONFIG.contact.address.street}, {SITE_CONFIG.contact.address.neighborhood}, {SITE_CONFIG.contact.address.locality}, {SITE_CONFIG.contact.address.city} {SITE_CONFIG.contact.address.postalCode}
              </p>
              
              <div className="mt-3">
                <a
                  href={SITE_CONFIG.googleBusinessProfile.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#FF3B30] hover:text-[#E02E24] hover:underline transition-colors tracking-wide uppercase"
                >
                  <span>Find us on Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Neighborhood Directions to our Banasree facility */}
            <div className="bg-[#1c1f20] border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Getting to our Banasree Club
              </span>
              <p className="leading-relaxed">
                • <strong className="text-white">From Rampura:</strong> Cross Rampura Bridge onto Banasree Main Road and turn into Block E, Road 2.
              </p>
              <p className="leading-relaxed">
                • <strong className="text-white">From South Banasree:</strong> Head north along Banasree Main Road directly toward Block E.
              </p>
              <p className="leading-relaxed">
                • <strong className="text-white">From Aftabnagar:</strong> Cross the connecting bridge into Banasree Block E in 5–10 minutes.
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Single dedicated facility in Banasree. Consultation appointments and workout sessions available daily.
            </p>
          </div>

          {/* RIGHT: Quick Navigation */}
          <div className="lg:col-span-6 flex flex-col justify-start lg:items-end">
            <div className="w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/#about" className="hover:text-[#FF3B30] transition-colors">
                      About Club
                    </Link>
                  </li>
                  <li>
                    <Link href="/#facilities" className="hover:text-[#FF3B30] transition-colors">
                      Facilities
                    </Link>
                  </li>
                  <li>
                    <Link href="/#journey" className="hover:text-[#FF3B30] transition-colors">
                      Transformation
                    </Link>
                  </li>
                </ul>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/#pricing" className="hover:text-[#FF3B30] transition-colors">
                      Membership Plans
                    </Link>
                  </li>
                  <li>
                    <Link href="/join" className="hover:text-[#FF3B30] transition-colors">
                      Join Online
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" className="hover:text-[#FF3B30] transition-colors">
                      Location
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SUB-FOOTER BAR: CREATOR ATTRIBUTION & COPYRIGHT ─── */}
        <div className="relative z-10 mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400">
          {/* Gym Copyright Badge */}
          <div className="bg-[#fffce1] text-slate-900 rounded-full px-5 py-2 inline-flex items-center gap-2.5 text-xs font-bold shadow-md">
            <span>© {new Date().getFullYear()} {SITE_CONFIG.shortName}</span>
            <span className="opacity-40">·</span>
            <span>Banasree, Rampura, Dhaka</span>
          </div>

          {/* Professional Developer Attribution */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs">
            <span className="text-slate-400 font-medium">All rights reserved to</span>
            <a
              href="https://rubayetkhan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 hover:border-white/20 text-white font-semibold transition-all duration-200 group shadow-sm cursor-pointer"
            >
              <span className="text-white group-hover:text-[#FF3B30] transition-colors">Rubayet Khan</span>
              <span className="text-slate-400 text-[11px] font-normal group-hover:text-slate-200 transition-colors">(rubayetkhan.com)</span>
              <span className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[10px]">↗</span>
            </a>
           
          </div>
        </div>
      </div>
    </footer>
  );
}
