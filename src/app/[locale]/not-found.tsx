import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-40">
      <p className="eyebrow text-lagoon">{t("eyebrow")}</p>
      <h1 className="display mt-4 max-w-3xl text-5xl md:text-7xl">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-muted">{t("text")}</p>
      <div className="mt-9">
        <ButtonLink href="/">{t("back")}</ButtonLink>
      </div>
    </section>
  );
}
