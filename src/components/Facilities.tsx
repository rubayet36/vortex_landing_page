"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const facilityItems = [
  {
    image: "/assets/cafe.jpg",
    fallback:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=80",
    title: "Supplement Cafe",
    description:
      "Buy supplements or take them by the scoop — fuel before and after every session.",
    tag: "Nutrition",
  },
  {
    image: "/assets/equipment.jpg",
    fallback:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    title: "Advance Equipment",
    description:
      "State-of-the-art machines for every muscle group, updated every season.",
    tag: "Training",
  },
  {
    image: "/assets/female.jpg",
    fallback:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    title: "Only Female Time Zone",
    description:
      "A private, comfortable space designed exclusively for women.",
    tag: "Exclusive",
  },
  {
    image: "/assets/Zumba.jpg",
    fallback:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80",
    title: "Arabica/Zumba CLasses for Females",
    description:
      "Zumba Class for ladies only with professional Zumba Trainer.",
    tag: "Classes",
  },
  {
    image: "/assets/sauna.jpg",
    fallback:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80",
    title: "Recovery & Sauna",
    description:
      "Infrared heat therapies, Finnish cedar saunas, and cold plunge immersion.",
    tag: "Recovery",
  },
  {
    image: "/assets/boxing.jpg",
    fallback:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&auto=format&fit=crop&q=80",
    title: "Boxing Zone",
    description:
      "Train with professional boxing trainers and equipment.",
    tag: "Training",
  },
];

export default function Facilities() {
  /* ─── refs ─────────────────────────────────────────── */
  const trackRef = useRef<HTMLDivElement>(null);   // tall scroll-track div
  const stickyRef = useRef<HTMLDivElement>(null);  // sticky viewport (100vh)
  const stripRef = useRef<HTMLDivElement>(null);   // the flex row that moves

  /* ─── GSAP horizontal scroll ───────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    const strip = stripRef.current;
    if (!track || !strip) return;

    /* Set the outer track height so the browser allocates
       enough vertical scroll room for the full horizontal travel */
    function setHeight() {
      if (!track || !strip) return;
      const travelDistance = strip.scrollWidth - window.innerWidth;
      // height = travel distance + 1 viewport so the sticky panel
      // stays pinned for the whole ride, then releases naturally
      track.style.height = `${travelDistance + window.innerHeight}px`;
    }

    setHeight();

    const ctx = gsap.context(() => {
      gsap.to(strip, {
        x: () => -(strip!.scrollWidth - window.innerWidth),
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

    // Re-measure after all images have loaded — img dimensions can
    // change the strip scrollWidth if they were still loading on mount.
    function onAllLoaded() {
      setHeight();
      ScrollTrigger.refresh();
    }

    if (document.readyState === "complete") {
      onAllLoaded();
    } else {
      window.addEventListener("load", onAllLoaded, { once: true });
    }

    window.addEventListener("resize", () => {
      setHeight();
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, []);

  /* ─── render ────────────────────────────────────────── */
  return (
    /* Outer track: tall div — gives the browser vertical scroll room */
    <div id="facilities" ref={trackRef} className="relative bg-[#0a0a0a]" style={{ overscrollBehavior: "none" }}>
      {/* Sticky viewport: stays fixed while user scrolls through the track */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Horizontal strip: translates left as user scrolls */}
        <div
          ref={stripRef}
          className="flex flex-nowrap h-full"
          style={{ width: "max-content", willChange: "transform" }}
        >
          {/* ── Intro panel ─────────────────────────────── */}
          <div
            className="flex-shrink-0 h-full flex flex-col justify-center px-16 bg-[#0a0a0a]"
            style={{ width: "42vw", minWidth: "440px" }}
          >
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF3B30] uppercase mb-4 block">
              PREMIUM AMENITIES
            </span>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
              Take A Tour<br />Of Our<br />Facilities
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs">
              World-class amenities designed to support every stage of your
              fitness journey.&nbsp; Scroll to explore →
            </p>

            {/* Step dots */}
            <div className="flex gap-2 mt-10">
              {facilityItems.map((_, i) => (
                <span
                  key={i}
                  className="block w-2 h-2 rounded-full bg-white/20"
                />
              ))}
            </div>
          </div>

          {/* ── Facility cards ───────────────────────────── */}
          {facilityItems.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-full flex items-center"
              style={{ width: "34vw", minWidth: "360px", padding: "2.5rem 1rem" }}
            >
              <div className="relative w-full h-[82%] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = item.fallback;
                  }}
                />

                {/* Dark gradient — bottom heavy */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Tag */}
                <span className="absolute top-5 left-5 text-[10px] font-bold tracking-widest uppercase bg-[#FF3B30] text-white px-3 py-1.5 rounded-full z-10">
                  {item.tag}
                </span>

                {/* Card number */}
                <span className="absolute top-3 right-5 text-white/20 font-black text-6xl leading-none select-none z-10">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                  <h3 className="text-white font-extrabold text-xl tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* ── End spacer ───────────────────────────────── */}
          <div
            className="flex-shrink-0 h-full flex items-center justify-center bg-[#0a0a0a]"
            style={{ width: "18vw", minWidth: "180px" }}
          >
            <span
              className="text-white/20 text-xs font-semibold tracking-[0.3em] uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              End of Tour
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
