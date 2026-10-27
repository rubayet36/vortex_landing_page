"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { saveRegistration, getPackagesData, PackageData } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/business-config";

// Isolated micro-component to read search params without de-opting the entire form from SSR
function PlanQueryReader({ onPlanDetected }: { onPlanDetected: (plan: string) => void }) {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const callbackRef = useRef(onPlanDetected);

  useEffect(() => {
    callbackRef.current = onPlanDetected;
  });

  useEffect(() => {
    if (plan) {
      callbackRef.current(plan.toLowerCase());
    }
  }, [plan]);

  return null;
}

export default function JoinForm() {
  const [dbPackages, setDbPackages] = useState<PackageData[]>(
    SITE_CONFIG.plans.map((p) => ({
      id: p.id,
      name: p.name,
      duration: p.duration,
      tagline: p.tagline,
      price: p.priceBDT,
      features: p.features,
    }))
  );

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    package: "starter",
    agreedToTerms: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getPackagesData().then((pkgs) => {
      if (pkgs && pkgs.length > 0) {
        setDbPackages(pkgs);
      }
    });
  }, []);

  const handlePlanDetected = useCallback((detectedPlan: string) => {
    const valid = ["starter", "growth", "advance", "professional"];
    if (valid.includes(detectedPlan)) {
      setFormData((prev) => {
        if (prev.package === detectedPlan) return prev;
        return { ...prev, package: detectedPlan };
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.userName || !formData.email || !formData.phone) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (formData.phone.length !== 11) {
      setErrorMsg("Phone number must be exactly 11 digits (e.g. 01712345678).");
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMsg("Please confirm your agreement to membership terms to proceed.");
      return;
    }

    setIsSubmitting(true);
    const result = await saveRegistration({
      user_name: formData.userName,
      email: formData.email,
      phone: formData.phone,
      package: formData.package,
    });
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(result.error || "Submission failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Search param listener isolated inside minimal Suspense boundary */}
      <Suspense fallback={null}>
        <PlanQueryReader onPlanDetected={handlePlanDetected} />
      </Suspense>

      <div className="bg-white rounded-[28px] p-6 sm:p-10 shadow-xl border border-slate-100 relative">
        {isSubmitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#FF3B30] flex items-center justify-center mb-4">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              APPLICATION RECEIVED!
            </h3>
            <p className="text-slate-600 text-sm max-w-xs mb-6">
              Welcome to Vortex Fitness Club,{" "}
              <span className="font-semibold text-slate-900">
                {formData.userName}
              </span>
              ! We have recorded your registration and will contact you via phone to confirm your membership card and welcome session.
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
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
                    onChange={(e) =>
                      setFormData({ ...formData, package: e.target.value })
                    }
                    className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all cursor-pointer pr-10 font-medium"
                  >
                    {dbPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id.toLowerCase()}>
                        {pkg.name} Plan ({pkg.duration} - ৳{pkg.price.toLocaleString()} BDT)
                      </option>
                    ))}
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
                      setFormData({
                        ...formData,
                        agreedToTerms: e.target.checked,
                      })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#FF3B30] focus:ring-[#FF3B30] accent-[#FF3B30] cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    I confirm that the details provided are accurate and I agree to the Vortex Fitness Club club rules and membership guidelines.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF3B30] hover:bg-[#E02E24] disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-500/25 active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? "PROCESSING..." : "SUBMIT APPLICATION"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

