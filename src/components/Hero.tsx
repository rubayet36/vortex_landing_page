"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Check if the user is on mobile, prefers reduced motion, or has data-saving enabled
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;
    const connection = (navigator as any).connection;
    const isSaveData = connection && connection.saveData;

    // Only load the 7.86MB video on desktop displays without data-saver or reduced-motion
    if (!prefersReducedMotion && !isMobile && !isSaveData) {
      setShouldLoadVideo(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    // Video must strictly remain muted as decorative background
    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => {
      // Autoplay silently handled if blocked by browser policy
    });
  }, [shouldLoadVideo]);

  return (
    <section className="relative w-full bg-[#0A0D14] rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[64px] overflow-hidden min-h-[640px] sm:min-h-[720px] lg:min-h-[840px] flex flex-col justify-between shadow-2xl">
      {/* Background Media with Lightweight Poster Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0D14]">
        {/* Poster image displayed immediately to prevent blank background & save mobile data */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: "url('/assets/hero-poster.webp')",
          }}
        />

        {/* Video only conditionally mounted on desktop devices */}
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            src="/assets/hero-video.mp4"
            poster="/assets/hero-poster.webp"
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Subtle Vignette & Gradient Overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14]/70 via-transparent to-[#0A0D14]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* Sticky Top Notch Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <Navbar activePage="home" />
      </div>

      {/* Hero Content: Pushed to the Outer Sides */}
      <div className="relative z-20 w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-24 sm:pt-28 pb-12 sm:pb-16 flex-1 flex flex-col justify-between">
        {/* Top Left: Verified Community Focus */}
        <div className="flex items-center space-x-2.5 max-w-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-pulse inline-block flex-shrink-0" />
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug drop-shadow-md">
            Dedicated training atmosphere &amp; modern facilities
            <br />
            in Banasree, Rampura
          </p>
        </div>

        {/* Bottom Section: Left Title + Right Community CTA */}
        <div className="pt-28 sm:pt-36 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          {/* Far Left: Headline */}
          <div className="max-w-xl xl:max-w-2xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black tracking-tight text-white leading-[1.04] drop-shadow-xl">
              Stronger Move,
              <br />
              Healthier Living
            </h1>
          </div>

          {/* Far Right: Description & JOIN NOW CTA */}
          <div className="max-w-md lg:ml-auto flex flex-col items-start space-y-5">
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-md">
              Join a results-driven fitness club in Banasree that empowers you to grow through expert guidance, dedicated women&apos;s hours, and premium recovery amenities.
            </p>

            <div>
              <Link
                href="/join"
                className="inline-flex items-center justify-center bg-[#FF3B30] hover:bg-[#E02E24] text-white font-black px-10 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-xl hover:shadow-red-500/40 active:scale-95 cursor-pointer"
              >
                JOIN NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
