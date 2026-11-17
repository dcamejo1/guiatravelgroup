import type { GuideArticle, Localized } from "@/lib/types";

/**
 * Guide outlines. Bodies are intentionally placeholders flagged VERIFY: entry
 * rules, flights, money and safety must be written from official sources and
 * the agency's experience, never invented.
 */
const PENDING: Localized = {
  en: "Content pending. To be written and verified with the agency against official sources.",
  es: "Contenido pendiente. Se redactará y verificará con la agencia y fuentes oficiales.",
};

const section = (en: string, es: string) => ({
  heading: { en, es },
  body: PENDING,
  verify: true,
});

export const guideArticles: GuideArticle[] = [
  {
    id: "getting-there",
    slug: { en: "getting-there", es: "como-llegar" },
    title: { en: "Getting there", es: "Cómo llegar" },
    summary: {
      en: "Flights, entry requirements and what happens when you land.",
      es: "Vuelos, requisitos de entrada y qué pasa al aterrizar.",
    },
    sections: [
      section("Flights into Venezuela", "Vuelos a Venezuela"),
      section("Entry requirements", "Requisitos de entrada"),
      section("Arriving at the airport", "Llegada al aeropuerto"),
    ],
  },
  {
    id: "money",
    slug: { en: "money", es: "dinero" },
    title: { en: "Money", es: "Dinero" },
    summary: {
      en: "What to bring, how to pay and what things cost.",
      es: "Qué llevar, cómo pagar y cuánto cuestan las cosas.",
    },
    sections: [
      section("Currency and cash", "Moneda y efectivo"),
      section("Paying for your trip", "Cómo pagar tu viaje"),
      section("Tipping and daily costs", "Propinas y gastos diarios"),
    ],
  },
  {
    id: "getting-around",
    slug: { en: "getting-around", es: "moverse" },
    title: { en: "Getting around", es: "Cómo moverse" },
    summary: {
      en: "Transfers, domestic flights and travelling with peace of mind.",
      es: "Traslados, vuelos internos y cómo viajar con tranquilidad.",
    },
    sections: [
      section("Airport pickups and transfers", "Recogidas y traslados"),
      section("Domestic flights", "Vuelos internos"),
      section("Safety and peace of mind", "Seguridad y tranquilidad"),
      section("Staying connected", "Conectividad"),
    ],
  },
  {
    id: "when-to-go",
    slug: { en: "when-to-go", es: "cuando-ir" },
    title: { en: "When to go", es: "Cuándo ir" },
    summary: {
      en: "Seasons and the best months for each destination.",
      es: "Temporadas y los mejores meses para cada destino.",
    },
    sections: [
      section("Seasons at a glance", "Las temporadas"),
      section("Best months by destination", "Mejores meses por destino"),
      section("What to pack", "Qué empacar"),
    ],
  },
];
