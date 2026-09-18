"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getPackagesData, PackageData } from "@/lib/supabase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_PLANS: PackageData[] = [
  {
    id: "starter",
    name: "Starter",
    duration: "1 Month",
    tagline: "Ideal for small businesses & beginners",
    price: 29,
    features: [
      "Unified dashboard",
      "Finance management module",
      "Inventory control",
      "Basic reporting and analytics",
      "10 user accounts",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    duration: "3 Months",
    tagline: "Perfect for growing teams & athletes",
    price: 79,
    features: [
      "All Basic Plan features",
      "Advanced analytics & insights",
      "Custom workflow automation",
      "Priority email & chat support",
      "25 user accounts",
    ],
  },
  {
    id: "advance",
    name: "Advance",
    duration: "6 Months",
    tagline: "Designed for scaling enterprises",
    price: 149,
    features: [
      "All Growth Plan features",
      "Dedicated account manager",
      "Custom API integrations",
      "24/7 SLA uptime guarantee",
      "50 user accounts",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    duration: "12 Months",
    tagline: "Full power for large organizations",
    price: 249,
    features: [
      "Unlimited user accounts",
      "Custom infrastructure setup",
      "Dedicated strategy sessions",
      "White-glove onboarding",
      "Unlimited data retention",
    ],
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [plans, setPlans] = useState<PackageData[]>(() =>
    [...DEFAULT_PLANS].sort((a, b) => Number(a.price) - Number(b.price))
  );

  useEffect(() => {
    getPackagesData().then((data) => {
      if (data && data.length > 0) {
        const sorted = [...data].sort((a, b) => Number(a.price) - Number(b.price));
        setPlans(sorted);
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const pinSection = pinSectionRef.current;
      const fill = fillRef.current;

      if (!pinSection) return;

      const totalPlans = plans.length;

      // Initialize fill line
      if (fill) {
        gsap.set(fill, {
          scaleY: 1 / totalPlans,
          transformOrigin: "top left",
        });
      }

      // ScrollTrigger instance for pinning
      const st = ScrollTrigger.create({
        trigger: pinSection,
        start: "top top",
        end: "+=" + totalPlans * 90 + "%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Progress goes from 0.0 to 1.0
          const progress = self.progress;

          // Scale green fill line smoothly
          if (fill) {
            const fillScale = (1 / totalPlans) + progress * (1 - 1 / totalPlans);
            gsap.set(fill, { scaleY: fillScale });
          }

          // Compute active plan index cleanly (0, 1, 2, 3)
          const rawIdx = Math.floor(progress * totalPlans);
          const currentIdx = Math.min(Math.max(0, rawIdx), totalPlans - 1);
          setActiveIndex(currentIdx);
        },
      });

      return () => {
        st.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Update card animations when activeIndex changes
  useEffect(() => {
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
  }, [activeIndex]);

  // Click on list item to jump directly to plan
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
    <section ref={sectionRef} id="pricing" className="relative z-20 bg-[#050505] text-white w-full overflow-hidden">
      <div
        ref={pinSectionRef}
        className="pin-section min-h-screen w-full flex items-center justify-center py-12 px-6 sm:px-12 max-w-7xl mx-auto"
      >
        <div className="content w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 relative">
          
          {/* ── LEFT SIDE: Package Names & Durations ── */}
          <div className="relative pl-6 flex-shrink-0">
            {/* Background line */}
            <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-slate-800" />

            {/* Green progress fill line */}
            <div
              ref={fillRef}
              className="fill absolute top-0 left-0 w-[2px] h-full bg-[#0ae448] origin-top-left"
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
                        isActive ? "text-[#0ae448]" : "text-[#fffce1] hover:text-white"
                      }`}
                    >
                      {plan.name}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium tracking-widest uppercase mt-1 transition-colors duration-300 ${
                        isActive ? "text-[#0ae448]/80" : "text-slate-500 group-hover:text-slate-400"
                      }`}
                    >
                      {plan.duration}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── RIGHT SIDE: Pricing Cards ── */}
          <div className="right relative w-[340px] sm:w-[380px] h-[520px] sm:h-[540px] flex items-center justify-center flex-shrink-0">
            {plans.map((plan, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div
                  key={plan.id}
                  ref={(el) => {
                    slidesRef.current[idx] = el;
                  }}
                  className="slide center absolute inset-0 w-full h-full rounded-[32px] bg-white p-7 sm:p-8 flex flex-col justify-between text-left shadow-2xl border border-slate-100 text-slate-900 transition-shadow duration-300"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    zIndex: idx === 0 ? 20 : 1,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div>
                    {/* Plan Name & Tagline */}
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {plan.name} Plan
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      {plan.tagline}
                    </p>

                    {/* Price Row */}
                    <div className="mt-6 mb-6 flex items-baseline">
                      <span className="text-lg font-bold text-slate-400 mr-0.5">৳</span>
                      <span className="text-5xl sm:text-6xl font-extrabold text-slate-950 tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-sm font-bold text-slate-500 ml-1.5 uppercase">
                        BDT
                      </span>
                    </div>

                    {/* Select Plan Button */}
                    <Link
                      href={`/join?plan=${plan.id}`}
                      className="w-full block text-center py-3.5 px-4 rounded-full text-sm font-semibold text-slate-800 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 shadow-sm"
                    >
                      Select Plan
                    </Link>
                  </div>

                  {/* Bottom Grey Features Box */}
                  <div className="bg-[#EFEFEF] rounded-[22px] p-5 sm:p-6 space-y-3.5 mt-6">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-sm flex-shrink-0">
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
    </section>
  );
}
