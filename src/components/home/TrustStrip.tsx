import { getTranslations } from "next-intl/server";

const ITEMS = [
  "local",
  "bilingual",
  "transfers",
  "tailored",
  "whatsapp",
] as const;

export async function TrustStrip() {
  const t = await getTranslations("home.trust");
  return (
    <section aria-label={t("label")} className="border-b border-line">
      <ul className="shell grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-5 md:gap-x-0 md:py-12">
        {ITEMS.map((key, i) => (
          <li
            key={key}
            className={`md:px-6 ${i > 0 ? "md:border-l md:border-line" : "md:pl-0"} ${i === ITEMS.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
          >
            <p className="font-display text-lg italic leading-tight text-ocean">
              {t(`items.${key}.title`)}
            </p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
              {t(`items.${key}.text`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
