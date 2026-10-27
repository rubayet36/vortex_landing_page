import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Vortex Fitness Club",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <header className="w-full max-w-5xl flex justify-center py-4 relative z-10">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-[#FF3B30] font-black text-lg select-none">|</span>
          <span className="font-black tracking-tight text-white text-base sm:text-lg uppercase">
            VORTEX FITNESS CLUB
          </span>
          <span className="text-[#FF3B30] font-black text-lg select-none">|</span>
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md my-auto py-12">
        <span className="inline-block text-xs font-bold tracking-widest text-[#FF3B30] uppercase mb-4 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
          Error 404
        </span>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track with your workout routine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF3B30] hover:bg-[#E02E24] text-white font-bold text-xs uppercase px-7 py-3.5 rounded-full transition-all shadow-lg shadow-red-500/30"
          >
            <Home size={16} /> Back to Home
          </Link>
          <Link
            href="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase px-7 py-3.5 rounded-full border border-white/20 transition-all"
          >
            Join the Club
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500">
        <p>© 2026 Vortex Fitness Club. House 48 (2nd floor), Road 2, Block E, Banasree, Rampura, Dhaka.</p>
      </footer>
    </main>
  );
}

