"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function JourneyMask() {
  const trackRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const beforeTagRef = useRef<HTMLDivElement>(null);
  const afterTagRef = useRef<HTMLDivElement>(null);

  const [isInteractiveWipe, setIsInteractiveWipe] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.innerWidth >= 1024;

    setIsInteractiveWipe(!prefersReducedMotion && isDesktop);

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsInteractiveWipe(desktop && !reduced);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isInteractiveWipe) return;
    const track = trackRef.current;
    const mask = maskRef.current;
    const divider = dividerRef.current;
    if (!track || !mask || !divider) return;

    const ctx = gsap.context(() => {
      const stConfig: ScrollTrigger.Vars = {
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
      };

      gsap.fromTo(
        mask,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: stConfig }
      );

      gsap.fromTo(
        divider,
        { left: "0%" },
        { left: "100%", ease: "none", scrollTrigger: stConfig }
      );

      if (beforeTagRef.current) {
        gsap.to(beforeTagRef.current, {
          opacity: 0,
          x: -20,
          ease: "power2.in",
          scrollTrigger: {
            trigger: track,
            start: "top+=15% top",
            end: "top+=45%  top",
            scrub: 1.4,
          },
        });
      }

      if (afterTagRef.current) {
        gsap.fromTo(
          afterTagRef.current,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: track,
              start: "top+=30% top",
              end: "top+=65%  top",
              scrub: 1.4,
            },
          }
        );
      }

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: track,
              start: "top 85%",
              end: "top 45%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [isInteractiveWipe]);

  return (
    <div
      ref={trackRef}
      id="journey"
      className="relative"
      style={{ height: isInteractiveWipe ? "300vh" : "auto" }}
    >
      {isInteractiveWipe ? (
        /* ── DESKTOP INTERACTIVE WIPE VIEW ── */
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* BEFORE layer */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#7ECAC5" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.22) 100%)",
              }}
            />
            <div className="relative h-full w-full max-h-[88vh] flex items-end justify-center">
              <Image
                src="/assets/journey-before.png"
                alt="Before fitness transformation - starting workout routine"
                width={600}
                height={800}
                priority={false}
                className="h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>

          {/* AFTER layer */}
          <div
            ref={maskRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: "inset(0 100% 0 0)",
              willChange: "clip-path",
              background: "#F5EDDA",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 100%)",
              }}
            />
            <div className="relative h-full w-full max-h-[88vh] flex items-end justify-center">
              <Image
                src="/assets/journey-after.png"
                alt="After fitness transformation - conditioned physique"
                width={600}
                height={800}
                priority={false}
                className="h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>

          {/* Moving divider line */}
          <div
            ref={dividerRef}
            className="absolute top-0 bottom-0 z-30 pointer-events-none"
            style={{
              left: "0%",
              transform: "translateX(-50%)",
              willChange: "left",
            }}
          >
            <div
              className="h-full"
              style={{
                width: "3px",
                background:
                  "linear-gradient(to bottom, transparent 0%, #FF3B30 15%, #FF3B30 85%, transparent 100%)",
                boxShadow: "0 0 20px 5px rgba(255,59,48,0.6)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center gap-1 px-3"
              style={{
                height: 40,
                minWidth: 40,
                background: "#FF3B30",
                boxShadow: "0 4px 28px rgba(255,59,48,0.55)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M6 4L2 9l4 5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 4l4 5-4 5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* BEFORE tag */}
          <div
            ref={beforeTagRef}
            className="absolute z-20 pointer-events-none"
            style={{ top: "50%", left: "4vw", transform: "translateY(-50%)" }}
          >
            <div className="flex flex-col items-start gap-1">
              <span
                className="text-[11px] font-black tracking-[0.28em] uppercase px-3 py-1 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.18)",
                  color: "#fff",
                  backdropFilter: "blur(6px)",
                }}
              >
                BEFORE
              </span>
              <p className="text-white/80 text-sm font-semibold mt-1 leading-snug drop-shadow-md">
                Starting out,<br />building consistency.
              </p>
            </div>
          </div>

          {/* AFTER tag */}
          <div
            ref={afterTagRef}
            className="absolute z-20 pointer-events-none"
            style={{ top: "50%", right: "4vw", transform: "translateY(-50%)", opacity: 0 }}
          >
            <div className="flex flex-col items-end gap-1">
              <span
                className="text-[11px] font-black tracking-[0.28em] uppercase px-3 py-1 rounded-full"
                style={{
                  background: "#FF3B30",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(255,59,48,0.4)",
                }}
              >
                AFTER
              </span>
              <p
                className="text-right text-sm font-semibold mt-1 leading-snug"
                style={{ color: "#333" }}
              >
                Strong, conditioned,<br />empowered.
              </p>
            </div>
          </div>

          {/* Heading - Opacity is naturally 1 in SSR to preserve crawler indexing */}
          <div className="absolute top-0 inset-x-0 z-20 flex flex-col items-center pt-10 pointer-events-none">
            <div ref={headingRef}>
              <span
                className="block text-[11px] font-black tracking-[0.3em] uppercase text-center mb-3"
                style={{ color: "#FF3B30" }}
              >
                The Transformation
              </span>
              <h2
                className="text-center font-black uppercase leading-none"
                style={{
                  fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)",
                  letterSpacing: "-0.02em",
                  WebkitTextStroke: "2px #1a1a1a",
                  color: "transparent",
                  paintOrder: "stroke fill",
                }}
              >
                Fat&nbsp;
                <span
                  style={{
                    WebkitTextStroke: "0px",
                    color: "#FF3B30",
                    WebkitTextFillColor: "#FF3B30",
                  }}
                >
                  To&nbsp;Fit
                </span>
                &nbsp;Journey
              </h2>
            </div>
          </div>
        </div>
      ) : (
        /* ── MOBILE / REDUCED-MOTION RESPONSIVE COMPARISON ── */
        <div className="py-16 sm:py-20 px-6 sm:px-12 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <span className="text-xs font-bold tracking-[0.25em] text-[#FF3B30] uppercase block mb-3">
              The Transformation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
              Fat To Fit Journey
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Real commitment leads to sustainable health, improved endurance, and strength.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Before Card */}
            <div className="rounded-3xl p-6 flex flex-col items-center text-center bg-[#7ECAC5] text-slate-900 shadow-xl">
              <span className="text-[11px] font-black tracking-widest uppercase bg-black/20 text-white px-3.5 py-1 rounded-full mb-4">
                BEFORE
              </span>
              <div className="relative h-64 w-full flex items-center justify-center">
                <Image
                  src="/assets/journey-before.png"
                  alt="Before workout routine"
                  width={300}
                  height={400}
                  className="h-full w-auto object-contain object-bottom"
                />
              </div>
              <p className="font-semibold text-sm mt-4 text-slate-800">
                Starting out, building consistency.
              </p>
            </div>

            {/* After Card */}
            <div className="rounded-3xl p-6 flex flex-col items-center text-center bg-[#F5EDDA] text-slate-900 shadow-xl">
              <span className="text-[11px] font-black tracking-widest uppercase bg-[#FF3B30] text-white px-3.5 py-1 rounded-full mb-4">
                AFTER
              </span>
              <div className="relative h-64 w-full flex items-center justify-center">
                <Image
                  src="/assets/journey-after.png"
                  alt="Conditioned physique"
                  width={300}
                  height={400}
                  className="h-full w-auto object-contain object-bottom"
                />
              </div>
              <p className="font-semibold text-sm mt-4 text-slate-800">
                Strong, conditioned, empowered.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
