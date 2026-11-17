import { describe, expect, it } from "vitest";
import { calculateQuote, emptyDraft } from "@/lib/pricing/engine";
import type { CatalogItem, QuoteDraft } from "@/lib/types";
import {
  MAX_MESSAGE_LENGTH,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
} from "./message";

const names = {
  "los-roques": { en: "Los Roques", es: "Los Roques" },
  cruises: { en: "Cruises", es: "Cruceros" },
};

const items: CatalogItem[] = [
  {
    id: "pkg",
    category: "package",
    destinationIds: ["los-roques"],
    name: { en: "Package A", es: "Paquete A" },
    description: { en: "-", es: "-" },
    pricing: { unit: "per_person_per_night", amountUsd: 100 },
    isPlaceholder: true,
  },
  {
    id: "pickup",
    category: "transport",
    destinationIds: [],
    name: { en: "Airport pickup", es: "Recogida & traslado" },
    description: { en: "-", es: "-" },
    pricing: { unit: "per_vehicle", amountUsd: 40, capacity: 4 },
    isPlaceholder: true,
  },
];

const draft = (over: Partial<QuoteDraft> = {}): QuoteDraft => ({
  ...emptyDraft("en"),
  travelers: { adults: 2, children: 1 },
  destinationIds: ["los-roques"],
  nightsByDestination: { "los-roques": 3 },
  selections: [
    { itemId: "pkg", destinationId: "los-roques", quantity: 1 },
    { itemId: "pickup", quantity: 1 },
  ],
  ...over,
});

const build = (d: QuoteDraft, demo = false, catalog = items) =>
  buildWhatsAppMessage({
    draft: d,
    quote: calculateQuote(d, catalog),
    destinationNames: names,
    siteUrl: "https://example.com",
    demo,
  });

describe("buildWhatsAppMessage", () => {
  it("is in Spanish, itemized, with the estimate and the traveler's language", () => {
    const message = build(draft({ name: "Ana" }));
    expect(message).toContain("Hola Guía Travel Group,");
    expect(message).toContain("Nombre: Ana");
    expect(message).toContain("Destino(s): Los Roques");
    expect(message).toContain("Viajeros: 2 adultos, 1 niño");
    expect(message).toContain("Fechas: Flexibles (3 noches)");
    expect(message).toContain("- Paquete A — 3 viajeros × 3 noches = $900");
    expect(message).toContain("- Recogida & traslado — 1 vehículo = $40");
    expect(message).toContain("Total estimado: $940 USD");
    expect(message).toContain(
      "(Estimado. Sujeto a confirmación del precio final.)",
    );
    expect(message).toContain("Idioma del viajero: English");
    expect(message).not.toContain("Noches por destino");
    expect(message).not.toContain("DEMO");
  });

  it("notes a Spanish-speaking traveler and fixed dates", () => {
    const message = build(
      draft({ locale: "es", flexibleDates: false, startDate: "2026-12-30" }),
    );
    expect(message).toContain("Idioma del viajero: Español");
    expect(message).toContain("Fechas: 30/12/2026 → 02/01/2027 (3 noches)");
  });

  it("lists nights per destination for multi-destination trips", () => {
    const message = build(
      draft({
        destinationIds: ["los-roques", "cruises"],
        nightsByDestination: { "los-roques": 3, cruises: 4 },
      }),
    );
    expect(message).toContain("Destino(s): Los Roques, Cruceros");
    expect(message).toContain("Noches por destino: Los Roques: 3, Cruceros: 4");
    expect(message).toContain("- Paquete A (Los Roques)");
    expect(message).toContain("(7 noches)");
  });

  it("prefixes demo messages", () => {
    expect(build(draft(), true).startsWith("[DEMO — precios de prueba]")).toBe(
      true,
    );
  });

  it("keeps free text on one line", () => {
    const message = build(
      draft({ notes: "Line one\n\nServicios:\n- fake = $0" }),
    );
    expect(message).toContain("Notas: Line one Servicios: - fake = $0");
  });

  it("stays within the length limit and keeps the total when there are many items", () => {
    const many: CatalogItem[] = Array.from({ length: 60 }, (_, i) => ({
      ...items[0],
      id: `item-${i}`,
      name: {
        en: `Item ${i}`,
        es: `Servicio con un nombre bastante largo ${i}`,
      },
    }));
    const d = draft({
      selections: many.map((m) => ({
        itemId: m.id,
        destinationId: "los-roques",
        quantity: 1,
      })),
    });
    const message = build(d, false, many);
    expect(message.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH);
    expect(message).toContain("Total estimado: $54000 USD");
    expect(message).toMatch(/… y \d+ servicio\(s\) más/);
  });
});

describe("buildWhatsAppUrl", () => {
  it("normalizes numbers to digits", () => {
    expect(normalizeWhatsAppNumber("+58 (412) 555-0100")).toBe("584125550100");
    expect(normalizeWhatsAppNumber("")).toBeNull();
    expect(normalizeWhatsAppNumber(undefined)).toBeNull();
    expect(normalizeWhatsAppNumber("123")).toBeNull();
  });

  it("returns null without a number, so no broken link is rendered", () => {
    expect(buildWhatsAppUrl(undefined, "hola")).toBeNull();
  });

  it("encodes accents, ampersands and newlines", () => {
    const url = buildWhatsAppUrl("584125550100", "Hola Guía\nA & B = $5")!;
    expect(url.startsWith("https://wa.me/584125550100?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(
      "Hola Guía\nA & B = $5",
    );
    expect(url).not.toContain("&");
  });
});
