import { addNights } from "@/lib/pricing/engine";
import { formatFactors } from "@/lib/pricing/format";
import type { Localized, QuoteDraft, QuoteResult } from "@/lib/types";

export const MAX_MESSAGE_LENGTH = 1500;

export interface MessageInput {
  draft: QuoteDraft;
  quote: QuoteResult;
  /** Destination names keyed by id. */
  destinationNames: Record<string, Localized>;
  siteUrl: string;
  demo: boolean;
}

const usd = (amount: number) =>
  `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const plural = (n: number, one: string, other: string) =>
  `${n} ${n === 1 ? one : other}`;

/** One-line, trimmed free text so user input cannot break the message layout. */
const clean = (text: string | undefined, max: number) =>
  (text ?? "").replace(/\s+/g, " ").trim().slice(0, max);

function compose(
  input: MessageInput,
  opts: { explain: boolean; maxLines: number },
): string {
  const { draft, quote, destinationNames, siteUrl, demo } = input;
  const nameOf = (id: string) => destinationNames[id]?.es ?? id;

  const dates =
    draft.startDate && !draft.flexibleDates
      ? `${formatDate(draft.startDate)} → ${formatDate(addNights(draft.startDate, quote.nights))}`
      : "Flexibles";

  const lines = quote.lines.filter((l) => !l.unavailableReason);
  const shown = lines.slice(0, opts.maxLines);
  const services = shown.map((line) => {
    const where =
      line.destinationId && draft.destinationIds.length > 1
        ? ` (${nameOf(line.destinationId)})`
        : "";
    const why = opts.explain ? formatFactors(line.factors, "es") : "";
    return `- ${line.label.es}${where}${why ? ` — ${why}` : ""} = ${usd(line.subtotalUsd)}`;
  });
  if (lines.length > shown.length) {
    services.push(`- … y ${lines.length - shown.length} servicio(s) más`);
  }

  const out: string[] = [];
  if (demo) out.push("[DEMO — precios de prueba]");
  out.push("Hola Guía Travel Group,", "Quisiera solicitar una cotización.", "");
  out.push(`Nombre: ${clean(draft.name, 60) || "—"}`);
  out.push(`Destino(s): ${draft.destinationIds.map(nameOf).join(", ") || "—"}`);
  out.push(
    `Viajeros: ${plural(draft.travelers.adults, "adulto", "adultos")}, ${plural(draft.travelers.children, "niño", "niños")}`,
  );
  out.push(`Fechas: ${dates} (${plural(quote.nights, "noche", "noches")})`);
  if (draft.destinationIds.length > 1) {
    out.push(
      `Noches por destino: ${draft.destinationIds
        .map((id) => `${nameOf(id)}: ${draft.nightsByDestination[id] ?? 0}`)
        .join(", ")}`,
    );
  }
  out.push("", "Servicios:", ...(services.length ? services : ["- —"]), "");
  out.push(`Total estimado: ${usd(quote.totalUsd)} USD`);
  out.push("(Estimado. Sujeto a confirmación del precio final.)", "");
  out.push(
    `Idioma del viajero: ${draft.locale === "es" ? "Español" : "English"}`,
  );
  out.push(`Notas: ${clean(draft.notes, 300) || "—"}`);
  out.push(`Enviado desde ${siteUrl}`);
  return out.join("\n");
}

/**
 * The Spanish message Elizabeth receives. If it would run long, the per-line
 * explanations go first, then the tail of the service list; totals always stay.
 */
export function buildWhatsAppMessage(input: MessageInput): string {
  let message = compose(input, { explain: true, maxLines: Infinity });
  if (message.length <= MAX_MESSAGE_LENGTH) return message;

  message = compose(input, { explain: false, maxLines: Infinity });
  let maxLines = input.quote.lines.length;
  while (message.length > MAX_MESSAGE_LENGTH && maxLines > 1) {
    maxLines -= 1;
    message = compose(input, { explain: false, maxLines });
  }
  return message;
}

/** Digits only, international format. Returns null when the number is unusable. */
export function normalizeWhatsAppNumber(
  raw: string | undefined,
): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/** Null when no valid number is configured, so the UI never renders a broken link. */
export function buildWhatsAppUrl(
  rawNumber: string | undefined,
  message?: string,
): string | null {
  const number = normalizeWhatsAppNumber(rawNumber);
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
