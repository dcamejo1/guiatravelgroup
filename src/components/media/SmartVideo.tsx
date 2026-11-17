"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping background video that costs nothing until it is needed:
 * the poster shows first, the file loads only when the video is on screen,
 * it pauses off screen, and it never plays for visitors who prefer reduced
 * motion.
 */
export function SmartVideo({
  src,
  srcMobile,
  poster,
  label,
  position,
  play,
  priority,
  sizes = "100vw",
}: {
  src: string;
  srcMobile?: string;
  poster?: string;
  label: string;
  position?: string;
  /** Extra condition from the parent (e.g. "card is hovered"). Defaults to on-screen autoplay. */
  play?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = !reduced && inView && (play ?? true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shouldPlay) {
      if (!el.getAttribute("src")) {
        const small = window.matchMedia("(max-width: 767px)").matches;
        el.src = small && srcMobile ? srcMobile : src;
      }
      el.play().catch(() => {
        /* Autoplay can be blocked (e.g. low-power mode); the poster stays. */
      });
    } else {
      el.pause();
    }
  }, [shouldPlay, src, srcMobile]);

  return (
    <>
      {poster && (
        <Image
          src={poster}
          alt={label}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      )}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition: position }}
      />
    </>
  );
}
