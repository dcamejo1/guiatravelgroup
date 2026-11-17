import Image from "next/image";
import { media, type MediaEntry, type MediaKey } from "@/content/media";
import { site } from "@/content/site";
import type { Locale } from "@/lib/types";
import { SmartVideo } from "./SmartVideo";

/** Looks a slot up in the media manifest. Unknown keys become an empty image slot. */
export function resolveMedia(key: string): MediaEntry {
  return (
    (media as Record<string, MediaEntry>)[key] ?? {
      kind: "image",
      label: { en: key, es: key },
    }
  );
}

/**
 * Fills its (relatively positioned) parent with a photo or video from the
 * media manifest. A slot with no file yet shows a labeled placeholder in demo
 * mode, so missing media is obvious and nothing breaks.
 */
export function MediaSlot({
  slotKey,
  locale,
  accent = "#2BB5B8",
  priority,
  sizes,
  play,
  kindLabels,
}: {
  slotKey: MediaKey | (string & {});
  locale: Locale;
  /** Tints the placeholder; usually the destination's accent colour. */
  accent?: string;
  priority?: boolean;
  sizes?: string;
  play?: boolean;
  /** Localized words for "Video" and "Photo" on the placeholder. */
  kindLabels?: { video: string; image: string };
}) {
  const entry = resolveMedia(slotKey);
  const label = entry.label[locale];

  if (!entry.src) {
    return (
      <div
        role="img"
        aria-label={label}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `linear-gradient(165deg, ${accent} 0%, color-mix(in srgb, ${accent} 38%, #0a2a3a) 52%, #0a2a3a 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.22),transparent_60%)]" />
        {site.demo && (
          <p className="absolute inset-x-5 top-5 text-ivory/85">
            <span className="eyebrow block">
              {entry.kind === "video"
                ? (kindLabels?.video ?? "Video")
                : (kindLabels?.image ?? "Photo")}
            </span>
            <span className="mt-1.5 block max-w-[22ch] text-xs leading-snug text-ivory/70">
              {label}
            </span>
          </p>
        )}
      </div>
    );
  }

  if (entry.kind === "video") {
    return (
      <SmartVideo
        src={entry.src}
        srcMobile={entry.srcMobile}
        poster={entry.poster}
        label={label}
        position={entry.position}
        priority={priority}
        sizes={sizes}
        play={play}
      />
    );
  }

  return (
    <Image
      src={entry.src}
      alt={label}
      fill
      priority={priority}
      sizes={sizes ?? "100vw"}
      className="object-cover"
      style={{ objectPosition: entry.position }}
    />
  );
}
