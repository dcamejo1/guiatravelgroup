import { VerifyBadge } from "@/components/ui/VerifyBadge";
import type { Faq, Locale } from "@/lib/types";

export function FaqList({
  faqs,
  locale,
  verifyLabel,
}: {
  faqs: Faq[];
  locale: Locale;
  verifyLabel: string;
}) {
  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.id} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
            {faq.question[locale]}
            <span
              aria-hidden="true"
              className="text-2xl font-light transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-2xl pb-7 leading-relaxed text-muted">
            {faq.answer[locale]}
            {faq.verify && <VerifyBadge label={verifyLabel} />}
          </p>
        </details>
      ))}
    </div>
  );
}
