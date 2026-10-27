"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONFIG } from "@/lib/business-config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Facilities() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [isDesktopPinned, setIsDesktopPinned] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.innerWidth >= 1024;

    if (!prefersReducedMotion && isDesktop) {
      setIsDesktopPinned(true);
    } else {
      setIsDesktopPinned(false);
    }

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsDesktopPinned(desktop && !reduced);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktopPinned) return;
    const track = trackRef.current;
    const strip = stripRef.current;
    if (!track || !strip) return;

    function setHeight() {
      if (!track || !strip) return;
      const travelDistance = strip.scrollWidth - window.innerWidth;
      track.style.height = `${travelDistance + window.innerHeight}px`;
    }

    setHeight();

    const ctx = gsap.context(() => {
      gsap.to(strip, {
        x: () => -(strip.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        },
      });
    });

    const onAllLoaded = () => {
      setHeight();
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      onAllLoaded();
    } else {
      window.addEventListener("load", onAllLoaded, { once: true });
    }

    return () => {
      ctx.revert();
      if (track) track.style.height = "auto";
    };
  }, [isDesktopPinned]);

  return (
    <div
      id="facilities"
      ref={trackRef}
      className={`relative bg-[#0a0a0a] ${
        isDesktopPinned ? "" : "py-16 sm:py-20"
      }`}
      style={{ overscrollBehavior: "none" }}
    >
      <div
        className={
          isDesktopPinned
            ? "sticky top-0 h-screen overflow-hidden"
            : "w-full overflow-hidden"
        }
      >
        <div
          ref={stripRef}
          className={
            isDesktopPinned
              ? "flex flex-nowrap h-full will-change-transform"
              : "flex flex-col lg:flex-row gap-8 px-4 sm:px-8 max-w-7xl mx-auto"
          }
          style={{
            width: isDesktopPinned ? "max-content" : "100%",
          }}
        >
          {/* ── Intro panel ─────────────────────────────── */}
          <div
            className={`flex-shrink-0 flex flex-col justify-center bg-[#0a0a0a] ${
              isDesktopPinned
                ? "h-full px-16"
                : "w-full mb-6 px-2 text-center sm:text-left"
            }`}
            style={
              isDesktopPinned
                ? { width: "40vw", minWidth: "420px" }
                : undefined
            }
          >
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF3B30] uppercase mb-4 block">
              PREMIUM AMENITIES
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
              Take A Tour
              <br />
              Of Our
              <br />
              Facilities
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm">
              World-class amenities designed to support every stage of your fitness journey in Banasree, Rampura.
            </p>

            {isDesktopPinned && (
              <div className="flex gap-2 mt-10">
                {SITE_CONFIG.facilities.map((_, i) => (
                  <span
                    key={i}
                    className="block w-2 h-2 rounded-full bg-white/20"
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Facility Cards ───────────────────────────── */}
          <div
            className={
              isDesktopPinned
                ? "flex flex-nowrap h-full"
                : "grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
            }
          >
            {SITE_CONFIG.facilities.map((item, i) => (
              <div
                key={item.title}
                className={
                  isDesktopPinned
                    ? "flex-shrink-0 h-full flex items-center p-6"
                    : "w-full"
                }
                style={
                  isDesktopPinned
                    ? { width: "34vw", minWidth: "360px" }
                    : undefined
                }
              >
                <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[82%] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-slate-900 border border-slate-800/60">
                  {/* Next.js Optimized Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Tag */}
                  <span className="absolute top-5 left-5 text-[10px] font-bold tracking-widest uppercase bg-[#FF3B30] text-white px-3 py-1.5 rounded-full z-10 shadow-md">
                    {item.tag}
                  </span>

                  {/* Card number */}
                  <span className="absolute top-3 right-5 text-white/20 font-black text-6xl leading-none select-none z-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 z-10">
                    <h3 className="text-white font-extrabold text-xl tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── End spacer (Desktop only) ─────────────────── */}
          {isDesktopPinned && (
            <div
              className="flex-shrink-0 h-full flex items-center justify-center bg-[#0a0a0a]"
              style={{ width: "16vw", minWidth: "160px" }}
            >
              <span
                className="text-white/20 text-xs font-semibold tracking-[0.3em] uppercase"
                style={{ writingMode: "vertical-rl" }}
              >
                End of Tour
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
