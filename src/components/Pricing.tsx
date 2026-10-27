"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONFIG, MembershipPlan } from "@/lib/business-config";
import { getPackagesData } from "@/lib/supabase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  const [plans, setPlans] = useState<MembershipPlan[]>(SITE_CONFIG.plans);

  useEffect(() => {
    // Attempt dynamic fetch from database; fall back seamlessly to SITE_CONFIG
    getPackagesData().then((data) => {
      if (data && data.length > 0) {
        const mapped: MembershipPlan[] = data.map((d) => ({
          id: d.id as any,
          name: d.name,
          duration: d.duration,
          months: d.id === "starter" ? 1 : d.id === "growth" ? 3 : d.id === "advance" ? 6 : 12,
          tagline: d.tagline,
          priceBDT: Number(d.price),
          features: d.features,
        }));
        setPlans(mapped);
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Enable pinned interactive stack animation on both mobile and desktop
    setIsPinned(!prefersReducedMotion);

    const handleResize = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsPinned(!reduced);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isPinned) return;
    const pinSection = pinSectionRef.current;
    const fill = fillRef.current;
    if (!pinSection) return;

    const totalPlans = plans.length;

    if (fill) {
      gsap.set(fill, {
        scaleY: 1 / totalPlans,
        transformOrigin: "top left",
      });
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinSection,
        start: "top top",
        end: "+=" + totalPlans * 90 + "%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (fill) {
            const fillScale = 1 / totalPlans + progress * (1 - 1 / totalPlans);
            gsap.set(fill, { scaleY: fillScale });
          }

          const rawIdx = Math.floor(progress * totalPlans);
          const currentIdx = Math.min(Math.max(0, rawIdx), totalPlans - 1);
          setActiveIndex(currentIdx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isPinned, plans.length]);

  useEffect(() => {
    if (!isPinned) return;
    slidesRef.current.forEach((slide, idx) => {
      if (!slide) return;
      if (idx === activeIndex) {
        gsap.to(slide, {
          autoAlpha: 1,
          scale: 1,
          zIndex: 20,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(slide, {
          autoAlpha: 0,
          scale: 0.95,
          zIndex: 1,
          duration: 0.35,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
    });
  }, [activeIndex, isPinned]);

  const scrollToPlan = (index: number) => {
    setActiveIndex(index);
    if (!pinSectionRef.current) return;
    const st = ScrollTrigger.getAll().find((t) => t.trigger === pinSectionRef.current);
    if (st) {
      const totalScroll = st.end - st.start;
      const targetScroll = st.start + (index / (plans.length - 1)) * (totalScroll * 0.9);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative z-20 bg-[#050505] text-white w-full overflow-hidden py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold tracking-[0.25em] text-[#FF3B30] uppercase block mb-3">
            MEMBERSHIP PACKAGES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Invest in Your Health
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Choose a training plan aligned with your lifestyle. All memberships grant access to our facilities in Banasree.
          </p>
        </div>

        {/* ── PINNED INTERACTIVE VIEW (Mobile & Desktop) ── */}
        {isPinned ? (
          <div
            ref={pinSectionRef}
            className="pin-section min-h-screen w-full flex items-center justify-center py-8 sm:py-12"
          >
            <div className="content w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-24 relative">
              {/* Mobile Package Indicator Pills */}
              <div className="flex lg:hidden flex-wrap items-center justify-center gap-2 w-full max-w-sm pb-1">
                {plans.map((plan, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => scrollToPlan(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-[#FF3B30] text-white shadow-lg shadow-[#FF3B30]/30 scale-105"
                          : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
                      }`}
                    >
                      <span>{plan.name}</span>
                      <span className={`text-[10px] ${isActive ? "text-white/80 font-semibold" : "text-slate-400"}`}>
                        ({plan.duration})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop Package Names & Progress Line */}
              <div className="hidden lg:block relative pl-6 flex-shrink-0">
                <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-slate-800" />
                <div
                  ref={fillRef}
                  className="fill absolute top-0 left-0 w-[2px] h-full bg-[#FF3B30] origin-top-left"
                />

                <ul className="list space-y-8 select-none">
                  {plans.map((plan, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <li
                        key={plan.id}
                        onClick={() => scrollToPlan(idx)}
                        className="cursor-pointer transition-all duration-300 flex flex-col group"
                      >
                        <span
                          className={`text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight transition-colors duration-300 ${
                            isActive ? "text-[#FF3B30]" : "text-[#fffce1] hover:text-white"
                          }`}
                        >
                          {plan.name}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-medium tracking-widest uppercase mt-1 transition-colors duration-300 ${
                            isActive
                              ? "text-[#FF3B30]/80"
                              : "text-slate-500 group-hover:text-slate-400"
                          }`}
                        >
                          {plan.duration}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Pricing Cards Stack */}
              <div className="right relative w-full max-w-[340px] sm:max-w-[390px] h-[490px] sm:h-[540px] flex items-center justify-center flex-shrink-0">
                {plans.map((plan, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <div
                      key={plan.id}
                      ref={(el) => {
                        slidesRef.current[idx] = el;
                      }}
                      className="slide center absolute inset-0 w-full h-full rounded-[28px] sm:rounded-[32px] bg-white p-6 sm:p-8 flex flex-col justify-between text-left shadow-2xl border border-slate-100 text-slate-900 transition-shadow duration-300"
                      style={{
                        opacity: idx === 0 ? 1 : 0,
                        zIndex: idx === 0 ? 20 : 1,
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          {plan.name} Plan
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                          {plan.tagline}
                        </p>

                        <div className="mt-4 sm:mt-5 mb-4 sm:mb-5 flex items-baseline">
                          <span className="text-base sm:text-lg font-bold text-slate-400 mr-0.5">৳</span>
                          <span className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                            {plan.priceBDT.toLocaleString()}
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-slate-500 ml-1.5 uppercase">
                            BDT / {plan.duration}
                          </span>
                        </div>

                        <Link
                          href={`/join?plan=${plan.id}`}
                          className="w-full block text-center py-3 sm:py-3.5 px-4 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 bg-slate-100 hover:bg-[#FF3B30] hover:text-white transition-all duration-200 shadow-sm"
                        >
                          Select {plan.name}
                        </Link>
                      </div>

                      {/* Verified Gym Benefits */}
                      <div className="bg-[#F8F9FA] rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 space-y-2 sm:space-y-2.5 mt-3 sm:mt-4">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                          Included Facilities
                        </span>
                        {plan.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center gap-2 sm:gap-2.5 text-xs font-medium text-slate-700"
                          >
                            <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-700 flex-shrink-0">
                              ✓
                            </span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── REDUCED-MOTION ACCESSIBILITY GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="w-full rounded-[28px] bg-white p-6 sm:p-8 flex flex-col justify-between text-left shadow-xl border border-slate-100 text-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {plan.name} Plan
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {plan.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    {plan.tagline}
                  </p>

                  <div className="mb-5 flex items-baseline">
                    <span className="text-base font-bold text-slate-400 mr-0.5">৳</span>
                    <span className="text-4xl font-black text-slate-950 tracking-tight">
                      {plan.priceBDT.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5 uppercase">
                      BDT
                    </span>
                  </div>

                  <Link
                    href={`/join?plan=${plan.id}`}
                    className="w-full block text-center py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#FF3B30] hover:bg-[#E02E24] transition-all shadow-md"
                  >
                    Select Plan
                  </Link>
                </div>

                <div className="bg-[#F8F9FA] rounded-[20px] p-4 sm:p-5 space-y-2 mt-6">
                  {plan.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-700 flex-shrink-0">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
