import { getTranslations } from "next-intl/server";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ButtonLink } from "@/components/ui/Button";
import type { Locale } from "@/lib/types";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-ocean text-ivory">
      <div className="absolute inset-0 -z-20 animate-drift">
        <MediaSlot slotKey="home.hero" locale={locale} priority sizes="100vw" />
      </div>
      {/* Scrims keep the header and headline legible over bright water. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(10,42,58,0.55)_0%,rgba(10,42,58,0)_26%,rgba(10,42,58,0)_42%,rgba(10,42,58,0.72)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(10,42,58,0.42)_0%,rgba(10,42,58,0)_62%)]" />

      <div className="shell pb-14 pt-40 lg:pb-20">
        <div className="max-w-4xl">
          <p className="eyebrow animate-rise text-ivory/85">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="display mt-5 animate-rise text-[clamp(3.25rem,10.5vw,9rem)] leading-[0.9] [animation-delay:120ms]">
            {t("home.hero.title")}
          </h1>
          <p className="mt-7 max-w-xl animate-rise text-base leading-relaxed text-ivory/90 [animation-delay:240ms] md:text-lg">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-9 flex animate-rise flex-wrap items-center gap-3 [animation-delay:360ms]">
            <ButtonLink href="/plan" size="lg">
              {t("common.planTrip")}
            </ButtonLink>
            <ButtonLink href="/destinations" variant="outline-light" size="lg">
              {t("common.exploreDestinations")}
            </ButtonLink>
          </div>
        </div>

        <p className="eyebrow mt-14 border-t border-ivory/25 pt-5 text-ivory/75">
          {t("home.hero.caption")}
        </p>
      </div>
    </section>
  );
}
