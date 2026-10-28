"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlexCarousel = dynamic(() => import("./FlexCarousel"), { ssr: false }) as React.ComponentType<Record<string, any>>;

const GYM_IMAGES = [
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Balanced%20lighting%20across%20the%20gym%20floor-1.png",
    alt: "Balanced lighting across the gym floor",
    title: "Training Floor",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Balanced%20light%20in%20a%20modern%20gym-2.png",
    alt: "Balanced light in a modern gym",
    title: "Modern Gym",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Refined%20gym%20interior%20with%20red%20accents-3.png",
    alt: "Refined gym interior with red accents",
    title: "Red Accents",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Refined%20gym%20interior-4.png",
    alt: "Refined gym interior",
    title: "The Interior",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Natural%20light%2C%20authentic%20gym%20interior-5.png",
    alt: "Natural light, authentic gym interior",
    title: "Natural Light",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Balanced%20light%20in%20a%20modern%20gym-6.png",
    alt: "Balanced light in a modern gym",
    title: "Open Floor",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Refined%20gym%20interior%20with%20balanced%20lighting-7.png",
    alt: "Refined gym interior with balanced lighting",
    title: "Balanced Space",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Balanced%20light%20in%20a%20professional%20gym-8.png",
    alt: "Balanced light in a professional gym",
    title: "Pro Facility",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Refined%20gym%20interior%20with%20red%20accents-9.png",
    alt: "Refined gym interior with red accents",
    title: "Signature Red",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Refined%20Gym%20Interior%20in%20Natural%20Light-10.png",
    alt: "Refined gym interior in natural light",
    title: "Natural Light",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Balanced%20Gym%20Interior%20Light-11.png",
    alt: "Balanced gym interior lighting",
    title: "Premium Setup",
  },
  {
    src: "https://pub-b81698486cb3441aaac2d6789999813d.r2.dev/images/Professionally%20refined%20gym%20interior-12.png",
    alt: "Professionally refined gym interior",
    title: "Vortex Fitness",
  },
];

export default function GalleryCarousel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="gallery"
      className="w-full bg-white py-12 sm:py-20 lg:py-24"
      aria-label="Gym Gallery"
    >
      {/* Section Header */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF3B30] mb-3">
          Our Space
        </p>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A0D14] leading-tight">
          Inside Vortex
          <br />
          <span className="text-slate-400 font-light italic">Fitness Club</span>
        </h2>
        <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl">
          Drag, scroll, or click any card to explore our premium facilities —
          from heavy iron to recovery and everything in between.
        </p>
      </div>

      {/* Carousel — height is responsive: 380px mobile / scales up to 520px desktop */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: isMobile ? "380px" : "clamp(380px, 45vw, 520px)" }}
      >
        <FlexCarousel
          items={GYM_IMAGES}
          preset="liquid"
          intro="rise"
          cardHeight={isMobile ? 0.62 : 0.72}
          gap={isMobile ? 8 : 14}
          radius={isMobile ? 12 : 18}
          squeeze={0.18}
          focusOnClick
          captions
        />
      </div>
    </section>
  );
}
