"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import Navbar from "./Navbar";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let soundPlayedCycle = false;

    // Detect when video loops back to start and mute audio so sound only plays once
    const handleTimeUpdate = () => {
      if (!video) return;
      if (video.currentTime > 2) {
        soundPlayedCycle = true;
      }
      if (soundPlayedCycle && video.currentTime < 0.5) {
        video.muted = true; // Mute audio after 1st cycle completes
      }
    };

    const handleSeeked = () => {
      if (video && soundPlayedCycle && video.currentTime < 1) {
        video.muted = true;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeked", handleSeeked);

    // Attempt initial playback
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If unmuted autoplay blocked by browser, play muted and unmute once on user gesture
        video.muted = true;
        video.play().catch(() => {});

        const enableAudio = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
          }
          window.removeEventListener("click", enableAudio);
          window.removeEventListener("touchstart", enableAudio);
          window.removeEventListener("keydown", enableAudio);
        };

        window.addEventListener("click", enableAudio, { once: true });
        window.addEventListener("touchstart", enableAudio, { once: true });
        window.addEventListener("keydown", enableAudio, { once: true });
      });
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#0A0D14] rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[64px] overflow-hidden min-h-[640px] sm:min-h-[720px] lg:min-h-[840px] flex flex-col justify-between shadow-2xl">
      {/* Background Video Element with Audio */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/hero-video.mp4"
          loop
          playsInline
          autoPlay
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Vignette & Gradient Overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14]/70 via-transparent to-[#0A0D14]/80" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Sticky Top Notch Navbar: Follows scroll throughout the page */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <Navbar activePage="home" />
      </div>

      {/* Hero Content: Pushed to the Outer Sides */}
      <div className="relative z-20 w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-24 sm:pt-28 pb-12 sm:pb-16 flex-1 flex flex-col justify-between">
        {/* Top Left: 1200+ Members (No headshot images) */}
        <div className="flex items-center space-x-2.5 max-w-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-pulse inline-block flex-shrink-0" />
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug drop-shadow-md">
            Over <span className="text-[#FF3B30] font-bold">1200+ members</span> strong and growing
            <br />
            with us every day!
          </p>
        </div>

        {/* Bottom Section: Left Title + Right Community CTA pushed to the far sides */}
        <div className="pt-28 sm:pt-36 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          {/* Far Left: Headline */}
          <div className="max-w-xl xl:max-w-2xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black tracking-tight text-white leading-[1.04] drop-shadow-xl">
              Stronger Move,
              <br />
              Healthier Living
            </h1>
          </div>

          {/* Far Right: Community Description & JOIN NOW CTA */}
          <div className="max-w-md lg:ml-auto flex flex-col items-start space-y-5">
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-md">
              Join a results-driven community that empowers you to grow through shared goals,
              support, and motivation every step of the way.
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
