import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";

/** Stand-in for pages that are built in a later phase, so navigation works end to end. */
export async function ComingSoon({ title }: { title: string }) {
  const t = await getTranslations("comingSoon");
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-40">
      <p className="eyebrow text-lagoon">{t("eyebrow")}</p>
      <h1 className="display mt-4 text-6xl md:text-8xl">{title}</h1>
      <p className="mt-6 max-w-md leading-relaxed text-muted">{t("text")}</p>
      <div className="mt-9">
        <ButtonLink href="/" variant="outline">
          {t("back")}
        </ButtonLink>
      </div>
    </section>
  );
}
