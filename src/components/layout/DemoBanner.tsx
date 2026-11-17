"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { initAnalytics } from "@/lib/analytics/track";

/** Small dismissible notice shown while the site runs on placeholder data. */
export function DemoBanner({ show }: { show: boolean }) {
  const t = useTranslations("demo");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    initAnalytics();
  }, []);

  if (!show || dismissed) return null;
  return (
    <aside
      data-demo-pill
      aria-label={`${t("label")}. ${t("text")}`}
      className="fixed bottom-4 right-4 z-40 max-lg:[body:has([data-bottom-bar])_&]:bottom-24 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-ivory/15 bg-ocean/95 py-2 pl-4 pr-2 text-xs text-ivory shadow-lg backdrop-blur"
    >
      <span className="eyebrow text-turquoise">{t("label")}</span>
      <span className="hidden text-ivory/80 sm:inline">{t("text")}</span>
      <button
        type="button"
        aria-label={t("dismiss")}
        onClick={() => setDismissed(true)}
        className="grid size-7 shrink-0 place-items-center rounded-full text-base leading-none text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-ivory"
      >
        ×
      </button>
    </aside>
  );
}
