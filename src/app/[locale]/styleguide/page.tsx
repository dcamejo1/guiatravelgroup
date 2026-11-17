import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const COLORS = [
  ["ivory", "#FAF7F2", "bg-ivory"],
  ["ocean", "#0A2A3A", "bg-ocean"],
  ["turquoise", "#2BB5B8", "bg-turquoise"],
  ["lagoon", "#0E6F74", "bg-lagoon"],
  ["sand", "#E9DCC7", "bg-sand"],
  ["coral", "#FF6B3D", "bg-coral"],
] as const;

/** Internal reference page for the design system. Not linked, not indexed. */
export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="shell space-y-16 pb-24 pt-36">
      <header>
        <p className="eyebrow text-lagoon">Design system</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">
          {t("styleguide.title")}
        </h1>
      </header>

      <section className="space-y-5">
        <h2 className="eyebrow text-muted">Colour</h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {COLORS.map(([name, hex, bg]) => (
            <li key={name}>
              <div className={`h-24 rounded-md border border-line ${bg}`} />
              <p className="mt-2 text-sm font-semibold">{name}</p>
              <p className="text-xs text-muted">{hex}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5">
        <h2 className="eyebrow text-muted">Type</h2>
        <p className="display text-7xl">Venezuela te espera.</p>
        <p className="display text-4xl">Los Roques, Canaima, Mérida</p>
        <p className="font-display text-2xl italic">A quieter, italic voice</p>
        <p className="eyebrow">Eyebrow label · 11°51′N</p>
        <p className="max-w-prose leading-relaxed text-muted">
          Body copy is set in Manrope. Árbol, niño, ¿cuándo?, Mérida, Ángel:
          accents render in both families.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="eyebrow text-muted">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/plan">{t("common.planTrip")}</ButtonLink>
          <ButtonLink href="/plan" size="lg">
            {t("common.planTrip")}
          </ButtonLink>
          <ButtonLink href="/destinations" variant="outline">
            {t("common.exploreDestinations")}
          </ButtonLink>
          <Button variant="ghost">{t("common.learnMore")}</Button>
          <Button disabled>Disabled</Button>
          <span className="rounded-full bg-ocean p-2">
            <ButtonLink href="/destinations" variant="outline-light">
              On dark
            </ButtonLink>
          </span>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="eyebrow text-muted">Tooltip</h2>
        <p className="flex items-center gap-2 text-sm">
          Transport{" "}
          <Tooltip label="More about transport">A short, quiet note.</Tooltip>
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="eyebrow text-muted">Media slots</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(
            ["los-roques.hero", "los-roques.card", "canaima.card"] as const
          ).map((key) => (
            <div
              key={key}
              className="relative aspect-[4/5] overflow-hidden rounded-md"
            >
              <MediaSlot
                slotKey={key}
                locale={locale}
                accent="#B4532A"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
