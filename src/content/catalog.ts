import type { CatalogItem, Localized } from "@/lib/types";
import { destinations } from "./destinations";

/**
 * DEMO CATALOG. Every item and price here is a placeholder so the quote
 * builder has something to calculate with. Replace with the agency's real
 * offering (or a database read in `src/data`) before going live.
 */
const PH: Localized = { en: " (placeholder)", es: " (ejemplo)" };
const ph = (en: string, es: string): Localized => ({
  en: en + PH.en,
  es: es + PH.es,
});
const text = (en: string, es: string): Localized => ({ en, es });

/** The one real-sounding detail we know: boat days and water sports in Los Roques. */
const activityNames: Record<string, [Localized, Localized]> = {
  "los-roques": [
    ph("Boat day trip to a cay", "Paseo en lancha a un cayo"),
    ph("Water sports session", "Sesión de deportes acuáticos"),
  ],
};

const perDestination = destinations.flatMap((d): CatalogItem[] => {
  const [groupActivity, personActivity] = activityNames[d.id] ?? [
    ph("Private guided excursion", "Excursión privada con guía"),
    ph("Guided activity", "Actividad guiada"),
  ];
  return [
    {
      id: `${d.id}-package-a`,
      category: "package",
      destinationIds: [d.id],
      name: ph(`${d.name.en} package A`, `Paquete ${d.name.es} A`),
      description: text(
        "Sample all-inclusive package priced per person, per night.",
        "Paquete todo incluido de ejemplo, con precio por persona y por noche.",
      ),
      pricing: { unit: "per_person_per_night", amountUsd: 3 },
      includes: [
        text("Lodging (placeholder)", "Alojamiento (ejemplo)"),
        text("Meals (placeholder)", "Comidas (ejemplo)"),
        text("Transfers (placeholder)", "Traslados (ejemplo)"),
      ],
      media: d.heroMedia,
      isPlaceholder: true,
    },
    {
      id: `${d.id}-package-b`,
      category: "package",
      destinationIds: [d.id],
      name: ph(`${d.name.en} package B`, `Paquete ${d.name.es} B`),
      description: text(
        "Sample fixed-price package priced per person.",
        "Paquete de ejemplo con precio fijo por persona.",
      ),
      pricing: { unit: "per_person", amountUsd: 5 },
      includes: [
        text("Lodging (placeholder)", "Alojamiento (ejemplo)"),
        text("Breakfast (placeholder)", "Desayuno (ejemplo)"),
      ],
      media: d.heroMedia,
      isPlaceholder: true,
    },
    {
      id: `${d.id}-group-activity`,
      category: "activity",
      destinationIds: [d.id],
      name: groupActivity,
      description: text(
        "Sample activity priced once for the whole group.",
        "Actividad de ejemplo con un solo precio para todo el grupo.",
      ),
      pricing: { unit: "per_group", amountUsd: 4 },
      allowQuantity: true,
      isPlaceholder: true,
    },
    {
      id: `${d.id}-person-activity`,
      category: "activity",
      destinationIds: [d.id],
      name: personActivity,
      description: text(
        "Sample activity priced per person. Not everyone has to take part.",
        "Actividad de ejemplo con precio por persona. No tienen que participar todos.",
      ),
      pricing: { unit: "per_person", amountUsd: 2 },
      allowQuantity: true,
      isPlaceholder: true,
    },
    {
      id: `${d.id}-extra-night`,
      category: "activity",
      destinationIds: [d.id],
      name: ph("Room upgrade", "Mejora de habitación"),
      description: text(
        "Sample upgrade priced per room, per night (2 people per room).",
        "Mejora de ejemplo con precio por habitación y por noche (2 personas por habitación).",
      ),
      pricing: { unit: "per_night", amountUsd: 1, capacity: 2 },
      isPlaceholder: true,
    },
  ];
});

const tripWide: CatalogItem[] = [
  {
    id: "airport-pickup",
    category: "transport",
    destinationIds: [],
    name: ph("Airport pickup", "Recogida en el aeropuerto"),
    description: text(
      "A driver meets you on arrival. Priced per vehicle (up to 4 people).",
      "Un conductor te recibe al llegar. Precio por vehículo (hasta 4 personas).",
    ),
    pricing: { unit: "per_vehicle", amountUsd: 2, capacity: 4 },
    isPlaceholder: true,
  },
  {
    id: "ground-transfer",
    category: "transport",
    destinationIds: [],
    name: ph("Private transfer", "Traslado privado"),
    description: text(
      "Door-to-door transfer between points of your trip. Priced per vehicle (up to 4 people).",
      "Traslado puerta a puerta entre puntos de tu viaje. Precio por vehículo (hasta 4 personas).",
    ),
    pricing: { unit: "per_vehicle", amountUsd: 2, capacity: 4 },
    allowQuantity: true,
    isPlaceholder: true,
  },
  {
    id: "extra-hotel-night",
    category: "extra",
    destinationIds: [],
    name: ph(
      "Hotel night near the airport",
      "Noche de hotel cerca del aeropuerto",
    ),
    description: text(
      "Useful before an early flight or after a late arrival. Priced per group.",
      "Útil antes de un vuelo temprano o tras una llegada tarde. Precio por grupo.",
    ),
    pricing: { unit: "per_group", amountUsd: 3 },
    allowQuantity: true,
    isPlaceholder: true,
  },
  {
    id: "travel-assistance",
    category: "extra",
    destinationIds: [],
    name: ph("Travel assistance", "Asistencia al viajero"),
    description: text(
      "Sample add-on priced per person.",
      "Extra de ejemplo con precio por persona.",
    ),
    pricing: { unit: "per_person", amountUsd: 1 },
    isPlaceholder: true,
  },
];

export const catalog: CatalogItem[] = [...perDestination, ...tripWide];
