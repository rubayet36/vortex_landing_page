"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    const mask = maskRef.current;
    const divider = dividerRef.current;
    if (!track || !mask || !divider) return;

    const ctx = gsap.context(() => {
      /* ── Shared scrub config ──────────────────── */
      const stConfig: ScrollTrigger.Vars = {
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
      };

      /* ── 1. Main wipe: clip-path from right side ── */
      gsap.fromTo(
        mask,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: stConfig }
      );

      /* ── 2. Divider line tracks the wipe edge ──── */
      gsap.fromTo(
        divider,
        { left: "0%" },
        { left: "100%", ease: "none", scrollTrigger: stConfig }
      );

      /* ── 3. Before tag fades out ─────────────── */
      gsap.to(beforeTagRef.current, {
        opacity: 0, x: -20,
        ease: "power2.in",
        scrollTrigger: {
          trigger: track,
          start: "top+=15% top",
          end: "top+=45%  top",
          scrub: 1.4,
        },
      });

      /* ── 4. After tag fades in ─────────────────── */
      gsap.fromTo(
        afterTagRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: track,
            start: "top+=30% top",
            end: "top+=65%  top",
            scrub: 1.4,
          },
        }
      );

      /* ── 5. Heading & sub slide up on entry ────── */
      gsap.fromTo(
        [headingRef.current, subRef.current],
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: track,
            start: "top 85%",
            end: "top 45%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    /* ── 300vh track → 200vh of scrub travel ── */
    <div
      ref={trackRef}
      id="journey"
      className="relative"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ══ BEFORE layer — teal bg, chubby running man ═══════════════ */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "#7ECAC5" }}
        >
          {/* Radial soft vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.22) 100%)",
            }}
          />

          <img
            src="/assets/journey-before.png"
            alt="Before — overweight man running"
            className="h-full w-full object-contain"
            style={{ maxHeight: "88vh", objectPosition: "center bottom" }}
          />
        </div>

        {/* ══ AFTER layer — cream bg, fit running man, scroll-revealed ═ */}
        <div
          ref={maskRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: "inset(0 100% 0 0)",
            willChange: "clip-path",
            background: "#F5EDDA",
          }}
        >
          {/* Radial soft vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          <img
            src="/assets/journey-after.png"
            alt="After — fit man running"
            className="h-full w-full object-contain"
            style={{ maxHeight: "88vh", objectPosition: "center bottom" }}
          />
        </div>

        {/* ══ Moving divider ══════════════════════════════════════════ */}
        <div
          ref={dividerRef}
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{
            left: "0%",
            transform: "translateX(-50%)",
            willChange: "left",
          }}
        >
          {/* Glowing line */}
          <div
            className="h-full"
            style={{
              width: "3px",
              background:
                "linear-gradient(to bottom, transparent 0%, #FF3B30 15%, #FF3B30 85%, transparent 100%)",
              boxShadow: "0 0 20px 5px rgba(255,59,48,0.6)",
            }}
          />

          {/* Handle pill */}
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
              <path d="M6 4L2 9l4 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 4l4 5-4 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ══ BEFORE tag ══════════════════════════════════════════════ */}
        <div
          ref={beforeTagRef}
          className="absolute z-20 pointer-events-none"
          style={{ top: "50%", left: "4vw", transform: "translateY(-50%)" }}
        >
          <div
            className="flex flex-col items-start gap-1"
          >
            <span
              className="text-[11px] font-black tracking-[0.28em] uppercase px-3 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.18)", color: "#fff", backdropFilter: "blur(6px)" }}
            >
              BEFORE
            </span>
            <p className="text-white/80 text-sm font-semibold mt-1 leading-snug drop-shadow-md">
              Out of breath,<br />out of shape.
            </p>
          </div>
        </div>

        {/* ══ AFTER tag ═══════════════════════════════════════════════ */}
        <div
          ref={afterTagRef}
          className="absolute z-20 pointer-events-none"
          style={{ top: "50%", right: "4vw", transform: "translateY(-50%)", opacity: 0 }}
        >
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-[11px] font-black tracking-[0.28em] uppercase px-3 py-1 rounded-full"
              style={{ background: "#FF3B30", color: "#fff", boxShadow: "0 4px 14px rgba(255,59,48,0.4)" }}
            >
              AFTER
            </span>
            <p
              className="text-right text-sm font-semibold mt-1 leading-snug"
              style={{ color: "#333" }}
            >
              Strong, lean,<br />unstoppable.
            </p>
          </div>
        </div>

        {/* ══ Top heading band ════════════════════════════════════════ */}
        <div className="absolute top-0 inset-x-0 z-20 flex flex-col items-center pt-10 pointer-events-none">
          <div ref={headingRef} style={{ opacity: 0 }}>
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
              <span style={{ WebkitTextStroke: "0px", color: "#FF3B30", WebkitTextFillColor: "#FF3B30" }}>
                To&nbsp;Fit
              </span>
              &nbsp;Journey
            </h2>
          </div>
        </div>

        {/* ══ Bottom hint ══════════════════════════════════════════════ */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(0,0,0,0.12)", backdropFilter: "blur(8px)" }}>

            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M3 8l4 4 4-4" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
