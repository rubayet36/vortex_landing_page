"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { saveRegistration, getPackagesData, PackageData } from "@/lib/supabase";

function JoinFormContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan");

  const [dbPackages, setDbPackages] = useState<PackageData[]>([]);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    package: initialPlan ? initialPlan.toLowerCase() : "starter",
    agreedToTerms: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getPackagesData().then((pkgs) => {
      setDbPackages(pkgs);
      if (initialPlan) {
        setFormData((prev) => ({
          ...prev,
          package: initialPlan.toLowerCase(),
        }));
      } else if (pkgs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          package: pkgs[0].id.toLowerCase(),
        }));
      }
    });
  }, [initialPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.email || !formData.phone) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (formData.phone.length !== 11) {
      setErrorMsg("Phone number must be exactly 11 digits (e.g. 01712345678).");
      return;
    }
    if (!formData.agreedToTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setErrorMsg("");
    await saveRegistration({
      user_name: formData.userName,
      email: formData.email,
      phone: formData.phone,
      package: formData.package,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header Badge & Title */}
      <div className="text-center mb-8">
        <div className="inline-block border border-[#FF3B30] text-[#FF3B30] text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded-full mb-4">
          MEMBERSHIP REGISTRATION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight uppercase leading-tight mb-3">
          START YOUR FITNESS JOURNEY
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
          Unlock 24/7 access, expert training, and premium amenities. Fill out the details below to
          claim your exclusive club access.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[28px] p-6 sm:p-10 shadow-xl border border-slate-100 relative">
        {isSubmitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#FF3B30] flex items-center justify-center mb-4">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">APPLICATION RECEIVED!</h3>
            <p className="text-slate-600 text-sm max-w-xs mb-6">
              Welcome to Vortex Fitness Club, <span className="font-semibold text-slate-900">{formData.userName}</span>! We have sent a confirmation packet to <span className="font-semibold text-slate-900">{formData.email}</span>.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-slate-800 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to main website
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                Create Your Account
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Complete the quick registration form to get started.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-[#FF3B30] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USER NAME */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                  USER NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              {/* EMAIL ADDRESS */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 uppercase mb-1.5 flex justify-between items-center">
                  <span>PHONE NUMBER (11 DIGITS)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {formData.phone.length}/11 digits
                  </span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setFormData({ ...formData, phone: onlyNums });
                  }}
                  className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all placeholder:text-slate-400 font-mono tracking-wider"
                />
              </div>

              {/* DESIRED PACKAGE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                  DESIRED PACKAGE
                </label>
                <div className="relative">
                  <select
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all cursor-pointer pr-10 font-medium"
                  >
                    {dbPackages.length > 0 ? (
                      dbPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id.toLowerCase()}>
                          {pkg.name} Plan ({pkg.duration} - ৳{pkg.price.toLocaleString()} BDT)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="starter">Starter Plan (1 Month - ৳2,900 BDT)</option>
                        <option value="growth">Growth Plan (3 Months - ৳7,900 BDT)</option>
                        <option value="advance">Advance Plan (6 Months - ৳14,900 BDT)</option>
                        <option value="professional">Professional Plan (12 Months - ৳24,900 BDT)</option>
                      </>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreedToTerms: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#FF3B30] focus:ring-[#FF3B30] accent-[#FF3B30] cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="underline font-semibold text-slate-800 hover:text-black">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline font-semibold text-slate-800 hover:text-black">
                      Privacy Policy
                    </a>
                    , including automatic renewal terms.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF3B30] hover:bg-[#E02E24] text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-500/25 active:scale-[0.99] cursor-pointer"
                >
                  SUBMIT APPLICATION
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Back Link and Copyright */}
      <div className="text-center mt-6 space-y-2">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#FF3B30] transition-colors"
          >
            <ArrowLeft size={14} /> Back to main website
          </Link>
        </div>
        <p className="text-[11px] text-slate-400">
          © 2026 Vortex Fitness Club. All Rights Reserved. Clean atmosphere, intense focus.
        </p>
      </div>
    </div>
  );
}

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

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading form...</div>}>
          <JoinFormContent />
        </Suspense>
      </div>
    </main>
  );
}
