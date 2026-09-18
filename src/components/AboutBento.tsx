"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Users, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── per-card magnetic tilt ──────────────────────────────────────────────
   Attach to every .bento-card on mount. On mousemove → rotateX/Y toward cursor.
   On mouseleave → spring back to flat. Red glow pulses on hover.
   ─────────────────────────────────────────────────────────────────────── */
function useMagneticTilt(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>(".bento-card");

    function onMove(e: MouseEvent, card: HTMLElement) {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);   // -1 .. 1
      const dy    = (e.clientY - cy) / (rect.height / 2);   // -1 .. 1
      const rotY  =  dx * 10;   // max ±10°
      const rotX  = -dy *  8;   // max ±8°

      gsap.to(card, {
        rotateX: rotX,
        rotateY: rotY,
        scale: 1.035,
        transformPerspective: 900,
        transformOrigin: "center center",
        ease: "power2.out",
        duration: 0.35,
        overwrite: "auto",
      });

      /* Glow follows cursor inside the card */
      const glowEl = card.querySelector<HTMLElement>(".card-glow");
      if (glowEl) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        glowEl.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,59,48,0.22) 0%, transparent 70%)`;
        gsap.to(glowEl, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
    }

    function onLeave(card: HTMLElement) {
      gsap.to(card, {
        rotateX: 0, rotateY: 0, scale: 1,
        ease: "elastic.out(1, 0.55)",
        duration: 0.8,
        overwrite: "auto",
      });
      const glowEl = card.querySelector<HTMLElement>(".card-glow");
      if (glowEl) {
        gsap.to(glowEl, { opacity: 0, duration: 0.5, overwrite: "auto" });
      }
    }

    const handlers: Array<{ card: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    cards.forEach((card) => {
      const move  = (e: MouseEvent) => onMove(e, card);
      const leave = () => onLeave(card);
      card.addEventListener("mousemove",  move);
      card.addEventListener("mouseleave", leave);
      handlers.push({ card, move, leave });
    });

    return () => {
      handlers.forEach(({ card, move, leave }) => {
        card.removeEventListener("mousemove",  move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, [containerRef]);
}

export default function AboutBento() {
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  /* ── Magnetic tilt on all cards ── */
  useMagneticTilt(gridRef as React.RefObject<HTMLElement | null>);

  /* ── Scroll-in animations ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      /* 1. Badge pops in */
      gsap.fromTo(badgeRef.current,
        { y: -20, opacity: 0, scale: 0.7 },
        {
          y: 0, opacity: 1, scale: 1,
          ease: "back.out(2)",
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 2. Heading slides up */
      gsap.fromTo(headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          ease: "power3.out",
          duration: 0.9,
          delay: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 3. Subtext fades in */
      gsap.fromTo(subRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          ease: "power2.out",
          duration: 0.7,
          delay: 0.22,
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 4. Staggered bento cards cascade in from below */
      const cards = section.querySelectorAll<HTMLElement>(".bento-card");
      gsap.fromTo(cards,
        { y: 80, opacity: 0, scale: 0.94 },
        {
          y: 0, opacity: 1, scale: 1,
          ease: "power3.out",
          duration: 0.75,
          stagger: {
            amount: 0.65,
            from: "start",
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 5. Subtle parallax — col1 slower, col3 faster as you scroll */
      const cols = section.querySelectorAll<HTMLElement>(".bento-col");
      cols.forEach((col, i) => {
        const speed = [20, 0, -20][i] ?? 0;   // col1 lags, col3 leads
        gsap.to(col, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end:   "bottom top",
            scrub: 1.5,
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16"
      style={{ perspective: "1200px" }}   /* enables 3D child transforms */
    >
      {/* ── Section Header ─────────────────────────────────────────────── */}
      <div className="mb-12">
        <div ref={badgeRef} className="inline-block text-xs font-bold tracking-widest text-slate-900 uppercase mb-3">
          + ABOUT
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15] max-w-2xl"
          >
            More Than Reps,{" "}
            <span className="relative inline-block">
              It&apos;s a Way of Life
              {/* Underline accent */}
              <span
                className="absolute left-0 bottom-0 h-[3px] w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #FF3B30, transparent)" }}
              />
            </span>
          </h2>
          <p ref={subRef} className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed">
            We help people of all levels move better, feel stronger, and live healthier — guided by
            expert trainers, dynamic programs, and a supportive community.
          </p>
        </div>
      </div>

      {/* ── Bento 3-Column Grid ────────────────────────────────────────── */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
      >
        {/* ═════════════ COLUMN 1 ═════════════ */}
        <div className="bento-col flex flex-col gap-6">

          {/* Lat Pulldown Photo */}
          <div
            className="bento-card relative h-[360px] sm:h-[400px] w-full rounded-[28px] overflow-hidden bg-slate-900 shadow-md border border-slate-100 cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="card-glow absolute inset-0 z-10 pointer-events-none rounded-[28px] opacity-0" />
            <Image
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80"
              alt="Athlete performing lat pulldown"
              fill
              className="object-cover object-center transition-transform duration-500"
            />
          </div>

          {/* Community Driven Card */}
          <div
            className="bento-card rounded-[28px] bg-[#FA4A42] p-7 sm:p-8 text-white shadow-md flex flex-col justify-between min-h-[220px] cursor-pointer relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="card-glow absolute inset-0 z-0 pointer-events-none rounded-[28px] opacity-0" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">Community Driven</h3>
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#FA4A42] shadow-sm flex-shrink-0">
                  <Users size={18} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-white/95 text-xs sm:text-sm leading-relaxed mt-4">
                Your journey is ours too, and we&apos;re with you every step of the way. We believe in
                the power of shared goals, mutual encouragement, and collective growth.
              </p>
            </div>
          </div>
        </div>

        {/* ═════════════ COLUMN 2 ═════════════ */}
        <div className="bento-col flex flex-col gap-6">

          {/* Progress Not Perfection Card */}
          <div
            className="bento-card rounded-[28px] bg-[#FDE4E1] p-7 sm:p-8 text-slate-900 shadow-sm flex flex-col justify-between min-h-[220px] cursor-pointer relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="card-glow absolute inset-0 z-0 pointer-events-none rounded-[28px] opacity-0" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Progress, Not Perfection</h3>
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-sm flex-shrink-0">
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-4">
                We believe that every small step forward is a victory worth celebrating, no matter how
                tiny it may seem in the moment. Real growth is a journey that takes patience and
                self-compassion.
              </p>
            </div>
          </div>

          {/* Outdoor Dips Photo */}
          <div
            className="bento-card relative h-[360px] sm:h-[400px] w-full rounded-[28px] overflow-hidden bg-slate-900 shadow-md border border-slate-100 cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="card-glow absolute inset-0 z-10 pointer-events-none rounded-[28px] opacity-0" />
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80"
              alt="Athlete training on parallel dip bars"
              fill
              className="object-cover object-center transition-transform duration-500"
            />
          </div>
        </div>

        {/* ═════════════ COLUMN 3 ═════════════ */}
        <div className="bento-col flex flex-col gap-6 md:col-span-2 lg:col-span-1">

          {/* Lifters Wide Photo */}
          <div
            className="bento-card relative h-[230px] sm:h-[260px] w-full rounded-[28px] overflow-hidden bg-slate-900 shadow-md border border-slate-100 cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="card-glow absolute inset-0 z-10 pointer-events-none rounded-[28px] opacity-0" />
            <Image
              src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=80"
              alt="Weightlifting athletes in gym"
              fill
              className="object-cover object-center transition-transform duration-500"
            />
          </div>

          {/* Integrity Movement Card */}
          <div
            className="bento-card rounded-[28px] bg-[#FF5B5B] p-7 sm:p-8 text-white shadow-md flex flex-col justify-between min-h-[200px] cursor-pointer relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="card-glow absolute inset-0 z-0 pointer-events-none rounded-[28px] opacity-0" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">Integrity Movement</h3>
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#FF5B5B] shadow-sm flex-shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-white/95 text-xs sm:text-sm leading-relaxed mt-4">
                We are committed to safe, effective, and empowering workouts that honor your body and
                its unique needs. Every movement is guided with care, purpose, and respect.
              </p>
            </div>
          </div>

          {/* 3 Square Detail Images */}
          <div className="grid grid-cols-3 gap-3.5">
            {[
              { src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80", alt: "Gym kettlebell" },
              { src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&auto=format&fit=crop&q=80", alt: "Athlete tying shoes" },
              { src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80", alt: "Weight barbell plates" },
            ].map(({ src, alt }) => (
              <div
                key={src}
                className="bento-card relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="card-glow absolute inset-0 z-10 pointer-events-none rounded-2xl opacity-0" />
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
