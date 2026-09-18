"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  activePage?: "home" | "about" | "classes" | "contact";
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full flex justify-center pointer-events-none">
      {/* Sticky Top Notch */}
      <nav className="pointer-events-auto relative flex items-center justify-between gap-8 sm:gap-12 py-2.5 sm:py-3 px-6 sm:px-12 bg-white/95 backdrop-blur-md rounded-b-[22px] sm:rounded-b-[26px] shadow-lg border-x border-b border-slate-200/80">
        {/* Left Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors hover:text-[#FF3B30] ${
              activePage === "home" ? "text-slate-950 font-bold" : "text-slate-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/#about"
            className={`text-sm font-semibold transition-colors hover:text-[#FF3B30] ${
              activePage === "about" ? "text-slate-950 font-bold" : "text-slate-600"
            }`}
          >
            About
          </Link>
        </div>

        {/* Center Brand Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2.5 group">
          <span className="text-[#FF3B30] font-black text-lg select-none">|</span>
          <span className="font-black tracking-tight text-slate-950 text-base sm:text-lg uppercase whitespace-nowrap">
            VORTEX FITNESS CLUB
          </span>
          <span className="text-[#FF3B30] font-black text-lg select-none">|</span>
        </Link>

        {/* Right Navigation Links & Join CTA */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/#facilities"
            className={`text-sm font-semibold transition-colors hover:text-[#FF3B30] ${
              activePage === "classes" ? "text-slate-950 font-bold" : "text-slate-600"
            }`}
          >
            Classes
          </Link>
          <Link
            href="/#contact"
            className={`text-sm font-semibold transition-colors hover:text-[#FF3B30] ${
              activePage === "contact" ? "text-slate-950 font-bold" : "text-slate-600"
            }`}
          >
            Contact
          </Link>
          <Link
            href="/join"
            className="bg-[#FF3B30] hover:bg-[#E02E24] text-white text-xs font-extrabold px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-md hover:shadow-red-500/30"
          >
            JOIN NOW
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-[#FF3B30] py-1"
            >
              Home
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-[#FF3B30] py-1"
            >
              About
            </Link>
            <Link
              href="/#facilities"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-[#FF3B30] py-1"
            >
              Classes
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-[#FF3B30] py-1"
            >
              Contact
            </Link>
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#FF3B30] text-white text-center text-xs font-bold py-3 rounded-full uppercase tracking-wider"
            >
              Join Now
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
