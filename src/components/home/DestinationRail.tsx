"use client";

import { useEffect, useState } from "react";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/types";

export interface RailCard {
  id: string;
  slug: string;
  name: string;
  kicker: string;
  tagline: string;
  accent: string;
  media: string;
}

/** True on devices with a real pointer and room for the expanding row. */
function useHoverLayout() {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    const update = () => setHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return hover;
}

/**
 * The destination showcase. With a mouse, the row behaves like an accordion:
 * the card you point at opens up and its video plays. On touch screens it is
 * a swipeable rail where videos play as they come into view and a tap goes
 * straight to the destination.
 */
export function DestinationRail({
  cards,
  locale,
  exploreLabel,
  kindLabels,
}: {
  cards: RailCard[];
  locale: Locale;
  exploreLabel: string;
  kindLabels: { video: string; image: string };
}) {
  const [active, setActive] = useState(0);
  const hoverLayout = useHoverLayout();

  return (
    <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] pb-2 lg:h-[min(76vh,46rem)] lg:min-h-[32rem] lg:snap-none lg:gap-2.5 lg:overflow-visible">
      {cards.map((card, i) => {
        const isActive = hoverLayout && active === i;
        return (
          <li
            key={card.id}
            onMouseEnter={() => setActive(i)}
            className={`relative h-[68svh] max-h-[36rem] min-h-[26rem] w-[78vw] max-w-sm shrink-0 snap-center overflow-hidden rounded-md bg-ocean text-ivory transition-[flex-grow] duration-700 ease-soft lg:h-auto lg:max-h-none lg:min-h-0 lg:w-auto lg:max-w-none lg:shrink lg:basis-0 ${
              isActive ? "lg:grow-[2.8]" : "lg:grow"
            }`}
          >
            <Link
              href={{
                pathname: "/destinations/[slug]",
                params: { slug: card.slug },
              }}
              onFocus={() => setActive(i)}
              className="group absolute inset-0 block focus-visible:outline-offset-[-4px]"
            >
              <div
                className={`absolute inset-0 transition-transform duration-[1400ms] ease-soft ${isActive ? "scale-100" : "lg:scale-[1.04]"}`}
              >
                <MediaSlot
                  slotKey={card.media}
                  locale={locale}
                  accent={card.accent}
                  sizes="(min-width: 1024px) 45vw, 78vw"
                  play={hoverLayout ? isActive : undefined}
                  kindLabels={kindLabels}
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,42,58,0.82)_0%,rgba(10,42,58,0.15)_48%,rgba(10,42,58,0)_70%)]" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="eyebrow text-ivory/80">{card.kicker}</p>
                <h3
                  className={`display mt-2 whitespace-nowrap text-4xl transition-[font-size] duration-700 ease-soft ${
                    hoverLayout && !isActive
                      ? "lg:text-[clamp(1.2rem,1.85vw,1.7rem)]"
                      : "lg:text-[2.5rem]"
                  }`}
                >
                  {card.name}
                </h3>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-700 ease-soft ${
                    hoverLayout
                      ? isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      : "grid-rows-[1fr] opacity-100"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/85 lg:w-[22rem]">
                      {card.tagline}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 border-b border-ivory/60 pb-0.5 text-sm font-semibold">
                      {exploreLabel}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
