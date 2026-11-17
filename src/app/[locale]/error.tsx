"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("error");
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-40">
      <h1 className="display max-w-3xl text-5xl md:text-7xl">{t("title")}</h1>
      <p className="mt-6 max-w-md leading-relaxed text-muted">{t("text")}</p>
      <div className="mt-9">
        <Button onClick={reset}>{t("retry")}</Button>
      </div>
    </section>
  );
}
