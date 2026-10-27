import type { Metadata } from "next";
import Link from "next/link";
import JoinForm from "@/components/JoinForm";

export const metadata: Metadata = {
  title: "Membership Registration",
  description:
    "Apply for your Vortex Fitness Club membership in Banasree, Rampura. Select your preferred training package and start your fitness journey.",
  alternates: {
    canonical: "/join",
  },
  openGraph: {
    title: "Membership Registration | Vortex Fitness Club",
    description:
      "Apply for your Vortex Fitness Club membership in Banasree, Rampura. Select your preferred training package and start your fitness journey.",
    url: "https://vortexfitnessclub.xyz/join",
  },
};

export default function JoinPage() {
  return (
    <main className="min-h-screen relative flex flex-col justify-between bg-slate-50 overflow-hidden">
      {/* Ambient Gym Background & Red Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/50 via-slate-100/40 to-slate-50" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Join Page Navbar */}
      <header className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-50">
        <nav className="flex items-center justify-between py-2 px-4 sm:px-8 bg-white/95 backdrop-blur-md rounded-full shadow-sm border border-slate-100">
          {/* Logo with 3 vertical bars */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center space-x-0.5">
              <span className="w-1 h-4 rounded-full bg-[#FF3B30] inline-block" />
              <span className="w-1 h-5 rounded-full bg-[#FF3B30] inline-block" />
              <span className="w-1 h-4 rounded-full bg-[#FF3B30] inline-block" />
            </div>
            <span className="font-black tracking-tight text-slate-950 text-base sm:text-lg uppercase">
              VORTEX FITNESS CLUB
            </span>
          </Link>

          {/* Right Links & Join Button */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
            >
              About
            </Link>
            <Link
              href="/#facilities"
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
            >
              Facilities
            </Link>
            <Link
              href="/#contact"
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/join"
              className="bg-[#FF3B30] hover:bg-[#E02E24] text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider transition-all duration-200 shadow-sm"
            >
              JOIN NOW
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Area - Server Rendered Heading & Intro */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-lg mx-auto">
          {/* Header Badge & Title rendered in initial HTML */}
          <div className="text-center mb-8">
            <div className="inline-block border border-[#FF3B30] text-[#FF3B30] text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded-full mb-4">
              MEMBERSHIP REGISTRATION
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight uppercase leading-tight mb-3">
              START YOUR FITNESS JOURNEY
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Select your membership package and complete your details to reserve your club spot at Vortex Fitness Club.
            </p>
          </div>

          {/* Client-Side Form with Server Rendered Shell */}
          <JoinForm />

          {/* Back Link and Copyright */}
          <div className="text-center mt-6 space-y-2">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#FF3B30] transition-colors"
              >
                ← Back to main website
              </Link>
            </div>
            <p className="text-[11px] text-slate-400">
              © 2026 Vortex Fitness Club. All Rights Reserved. Banasree, Rampura, Dhaka.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
