"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

export interface DepthCarouselItem {
  image: string;
  alt?: string;
  title?: string;
  description?: string;
}

/** Public API exposed to parent via ref */
export interface DepthCarouselHandle {
  navigateTo: (index: number) => void;
  navigateBy: (step: number) => void;
  currentIndex: () => number;
  count: number;
}

export interface DepthCarouselProps {
  items?: (string | DepthCarouselItem)[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  onChange?: (index: number, item: DepthCarouselItem) => void;
  className?: string;
}

const DEFAULT_ITEMS: DepthCarouselItem[] = [
  { image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80", alt: "Slide 1" },
  { image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80", alt: "Slide 2" },
  { image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80", alt: "Slide 3" },
];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeItem = (it: string | DepthCarouselItem): DepthCarouselItem =>
  typeof it === "string" ? { image: it, alt: "" } : it;

const DepthCarousel = forwardRef<DepthCarouselHandle, DepthCarouselProps>(function DepthCarousel(
  {
    items = DEFAULT_ITEMS,
    cardWidth = 440,
    cardHeight = 560,
    radius = 28,
    tint = "#05060a",
    depth = 190,
    spread = 95,
    tilt = 16,
    tiltDirection = "right",
    perspective = 1600,
    visibleCards = 4,
    falloff = 0.16,
    blur = 4,
    duration = 600,
    ease = "power3.out",
    autoplay = false,
    autoplayDelay = 3200,
    loop = false,
    showControls = true,
    showIndicators = true,
    onChange,
    className = "",
  }: DepthCarouselProps,
  ref
) {
  const data = useMemo(() => (Array.isArray(items) ? items : []).map(normalizeItem), [items]);
  const count = data.length;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef<Record<string, any>>({});
  const onChangeRef = useRef(onChange);

  const dragRef = useRef<any>(null);
  const autoTimerRef = useRef<any>(null);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(0);

  onChangeRef.current = onChange;
  cfgRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay,
  };

  const layout = useCallback((pos: number) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === "left" ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.8;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      // Progressive opacity: front card fully opaque, back cards fade
      let opacity = 1;
      if (d < 0) {
        opacity = Math.max(0, 1 + d * 0.75);
      } else if (!shown) {
        opacity = 0;
      }

      // Aggressive brightness falloff: front=1.0, each step back is noticeably darker
      const brightness = Math.max(0.15, 1 - back * cfg.falloff * 1.6);
      // Strong blur: front card = 0px, each step back adds significant blur (max 14px)
      const blurPx = cfg.blur > 0
        ? Math.min(cfg.blur * 2.2, (back / Math.max(1, cfg.visibleCards)) * cfg.blur * 2.2)
        : 0;
      const zi = Math.round(2000 - d * 20);


      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.85).toFixed(3);
    }
  }, []);

  const notify = useCallback(
    (idx: number) => {
      setActive(idx);
      onChangeRef.current?.(idx, data[idx]);
    },
    [data]
  );

  const tweenTo = useCallback(
    (target: number, animate: boolean) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: cfg.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: () => {
          const n = cfg.count;
          if (n > 0 && cfg.loop) posRef.current = ((posRef.current % n) + n) % n;
          layout(posRef.current);
        },
      });
    },
    [layout]
  );

  const setFocus = useCallback(
    (rawIndex: number, animate = true) => {
      const cfg = cfgRef.current;
      const n = cfg.count;
      if (!n) return;
      const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
      let delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        notify(idx);
      }
    },
    [tweenTo, notify]
  );

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);
  const navigateTo = useCallback((index: number) => setFocus(index, true), [setFocus]);

  // Expose imperative handle to parent (Facilities) for wheel-hijack control
  useImperativeHandle(
    ref,
    () => ({
      navigateTo,
      navigateBy,
      currentIndex: () => focusRef.current,
      count,
    }),
    [navigateTo, navigateBy, count]
  );

  // Resize observer for responsive scaling
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 1.2 + 40;
      scaleRef.current = clamp(w / needed, 0.6, 1.0);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || count < 2) return;
    autoTimerRef.current = setInterval(() => {
      const next = loop
        ? (focusRef.current + 1) % count
        : focusRef.current < count - 1
        ? focusRef.current + 1
        : 0;
      setFocus(next, true);
    }, autoplayDelay);
    return () => clearInterval(autoTimerRef.current);
  }, [autoplay, autoplayDelay, loop, count, setFocus]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const cfg = cfgRef.current;
    if (cfg.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const cfg = cfgRef.current;
      const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 50);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.v = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout]
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 50);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateBy(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateBy(1);
      }
    },
    [navigateBy]
  );

  const onCardClick = useCallback(
    (index: number) => {
      if (dragRef.current?.moved) return;
      setFocus(index, true);
    },
    [setFocus]
  );

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    },
    []
  );

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ "--dc-perspective": `${perspective}px` } as React.CSSProperties}
      role="group"
      aria-roledescription="carousel"
      aria-label="Depth carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage" ref={stageRef}>
        {data.map((item, i) => (
          <div
            key={i}
            className="depth-carousel__card relative group"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={active !== i}
            onClick={() => onCardClick(i)}
          >
            <img
              className="depth-carousel__img"
              src={item.image}
              alt={item.alt || ""}
              draggable={false}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80";
              }}
            />
            <span
              className="depth-carousel__tint"
              ref={(el) => {
                overlayRefs.current[i] = el;
              }}
              style={{ background: tint }}
            />
            {/* Info badge: only visible on the active front card */}
            {item.title && active === i && (
              <div className="absolute bottom-5 left-5 right-5 bg-[#0F1420]/95 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-2xl z-20 pointer-events-none">
                <h3 className="text-white font-extrabold text-base sm:text-lg tracking-tight mb-1.5">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--prev"
            aria-label="Previous slide"
            onClick={(e) => {
              e.stopPropagation();
              navigateBy(-1);
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--next"
            aria-label="Next slide"
            onClick={(e) => {
              e.stopPropagation();
              navigateBy(1);
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="tablist" aria-label="Slides">
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to slide ${i + 1}`}
              className={`depth-carousel__dot${active === i ? " is-active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setFocus(i, true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default DepthCarousel;
