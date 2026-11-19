import type { AtAGlanceFact, Destination } from "@/lib/types";

/**
 * Destination content. Descriptive copy is a draft; anything factual and
 * practical (season, length of stay, how to get there) stays a VERIFY
 * placeholder until the agency confirms it.
 */
const TBC = { en: "To be confirmed", es: "Por confirmar" };

const atAGlance = (): AtAGlanceFact[] => [
  {
    label: { en: "Best time to go", es: "Mejor época" },
    value: TBC,
    verify: true,
  },
  {
    label: { en: "Typical stay", es: "Estadía típica" },
    value: TBC,
    verify: true,
  },
  {
    label: { en: "Getting there", es: "Cómo llegar" },
    value: TBC,
    verify: true,
  },
];

export const destinations: Destination[] = [
  {
    id: "los-roques",
    slug: { en: "los-roques", es: "los-roques" },
    name: { en: "Los Roques", es: "Los Roques" },
    kicker: { en: "Caribbean archipelago", es: "Archipiélago caribeño" },
    tagline: {
      en: "White sandbars, water in every shade of blue, and days that move at the pace of the boat.",
      es: "Bancos de arena blanca, agua en todos los tonos de azul y días al ritmo de la lancha.",
    },
    accent: "#2BB5B8",
    atAGlance: atAGlance(),
    highlights: [
      {
        title: {
          en: "Island-hopping by boat",
          es: "De cayo en cayo en lancha",
        },
        text: {
          en: "Spend the day on a cay of your own, with shade, lunch and the sea to yourself.",
          es: "Pasa el día en un cayo para ti, con sombra, almuerzo y el mar a tu alcance.",
        },
        media: "los-roques.beach",
      },
      {
        title: { en: "Snorkeling the reef", es: "Snorkel en el arrecife" },
        text: {
          en: "Clear, shallow water and schools of fish a few strokes from the boat.",
          es: "Agua clara y poco profunda, con cardúmenes a pocas brazadas de la lancha.",
        },
        media: "los-roques.reef",
      },
      {
        title: {
          en: "Dos Mosquises turtles",
          es: "Las tortugas de Dos Mosquises",
        },
        text: {
          en: "Visit the sanctuary where young sea turtles are raised before returning to the sea.",
          es: "Visita el santuario donde crían tortugas marinas antes de devolverlas al mar.",
        },
        media: "los-roques.turtles",
      },
    ],
    faqIds: ["what-is-included", "how-booking-works", "is-price-final"],
    heroMedia: "los-roques.hero",
    cardMedia: "los-roques.card",
  },
  {
    id: "canaima",
    slug: { en: "canaima", es: "canaima" },
    name: { en: "Canaima", es: "Canaima" },
    kicker: { en: "Angel Falls & the tepuis", es: "Salto Ángel y los tepuyes" },
    tagline: {
      en: "Table-top mountains, rust-coloured rivers and the tallest waterfall on Earth.",
      es: "Montañas de cima plana, ríos color ámbar y la cascada más alta del planeta.",
    },
    accent: "#B4532A",
    atAGlance: atAGlance(),
    highlights: [
      {
        title: { en: "Angel Falls", es: "Salto Ángel" },
        text: {
          en: "Travel upriver to stand beneath a waterfall that drops from the clouds.",
          es: "Remonta el río hasta el pie de una cascada que cae desde las nubes.",
        },
        media: "canaima.falls",
      },
      {
        title: { en: "Canaima lagoon", es: "Laguna de Canaima" },
        text: {
          en: "A wide lagoon ringed by waterfalls, with pink sand at its edge.",
          es: "Una laguna amplia rodeada de saltos, con arena rosada en la orilla.",
        },
        media: "canaima.lagoon",
      },
      {
        title: { en: "The tepuis", es: "Los tepuyes" },
        text: {
          en: "Some of the oldest landscapes on the planet, rising straight out of the savanna.",
          es: "Algunos de los paisajes más antiguos del planeta, alzándose sobre la sabana.",
        },
        media: "canaima.tepuis",
      },
      {
        title: { en: "Arriving by river", es: "La llegada por el río" },
        text: {
          en: "There are no roads to Canaima. The last stretch in is by boat, along jungle channels that open onto the lagoon.",
          es: "No hay carreteras hasta Canaima. El último tramo se hace en lancha, por canales de selva que desembocan en la laguna.",
        },
        media: "canaima.river",
      },
    ],
    faqIds: ["what-is-included", "how-booking-works", "is-price-final"],
    heroMedia: "canaima.hero",
    cardMedia: "canaima.card",
  },
  {
    id: "margarita",
    slug: { en: "margarita", es: "margarita" },
    name: { en: "Margarita", es: "Margarita" },
    kicker: { en: "Island life", es: "Vida de isla" },
    tagline: {
      en: "Long beaches, warm evenings and an island that knows how to host.",
      es: "Playas largas, noches cálidas y una isla que sabe recibir.",
    },
    accent: "#E0913A",
    atAGlance: atAGlance(),
    highlights: [
      {
        title: { en: "Beach days", es: "Días de playa" },
        text: {
          en: "From calm coves to breezy shores, a different beach for every mood.",
          es: "De ensenadas tranquilas a costas con brisa: una playa para cada ánimo.",
        },
        media: "margarita.beach",
      },
      {
        title: { en: "Towns and flavours", es: "Pueblos y sabores" },
        text: {
          en: "Colonial streets, fresh fish and empanadas eaten by the sea.",
          es: "Calles coloniales, pescado fresco y empanadas frente al mar.",
        },
        media: "margarita.town",
      },
      {
        title: { en: "Caribbean sunsets", es: "Atardeceres caribeños" },
        text: {
          en: "End the day watching the sun go down over the water.",
          es: "Termina el día viendo caer el sol sobre el agua.",
        },
        media: "margarita.sunset",
      },
    ],
    faqIds: ["what-is-included", "how-booking-works", "is-price-final"],
    heroMedia: "margarita.hero",
    cardMedia: "margarita.card",
  },
  {
    id: "merida",
    slug: { en: "merida", es: "merida" },
    name: { en: "Mérida", es: "Mérida" },
    kicker: { en: "The Venezuelan Andes", es: "Los Andes venezolanos" },
    tagline: {
      en: "Cool mountain air, páramo trails and villages tucked between the peaks.",
      es: "Aire fresco de montaña, senderos de páramo y pueblos entre los picos.",
    },
    accent: "#4C7A5A",
    atAGlance: atAGlance(),
    highlights: [
      {
        title: {
          en: "Into the Andes by cable car",
          es: "A los Andes en teleférico",
        },
        text: {
          en: "Rise from the city into the high peaks in a single ride.",
          es: "Sube de la ciudad a los picos más altos en un solo trayecto.",
        },
        media: "merida.cablecar",
      },
      {
        title: { en: "The páramo", es: "El páramo" },
        text: {
          en: "High-altitude landscapes of lagoons and frailejones.",
          es: "Paisajes de altura con lagunas y frailejones.",
        },
        media: "merida.paramo",
      },
      {
        title: { en: "Mountain villages", es: "Pueblos de montaña" },
        text: {
          en: "Stone streets, hot chocolate and a slower way of life.",
          es: "Calles de piedra, chocolate caliente y un ritmo más pausado.",
        },
        media: "merida.town",
      },
    ],
    faqIds: ["what-is-included", "how-booking-works", "is-price-final"],
    heroMedia: "merida.hero",
    cardMedia: "merida.card",
  },
  {
    id: "cruises",
    slug: { en: "cruises", es: "cruceros" },
    name: { en: "Cruises", es: "Cruceros" },
    kicker: { en: "The Caribbean by sea", es: "El Caribe por mar" },
    tagline: {
      en: "Unpack once and wake up somewhere new, with every detail arranged for you.",
      es: "Desempaca una vez y despierta en un lugar nuevo, con cada detalle resuelto.",
    },
    accent: "#2F5D8A",
    atAGlance: atAGlance(),
    highlights: [
      {
        title: { en: "Life on board", es: "La vida a bordo" },
        text: {
          en: "Open decks, sea air and nothing to organise.",
          es: "Cubiertas abiertas, brisa marina y nada que organizar.",
        },
        media: "cruises.deck",
      },
      {
        title: { en: "New ports", es: "Nuevos puertos" },
        text: {
          en: "Step ashore somewhere different along the way.",
          es: "Baja a tierra en un lugar distinto en cada parada.",
        },
        media: "cruises.port",
      },
      {
        title: { en: "Your cabin", es: "Tu camarote" },
        text: {
          en: "We help you choose the right cabin for your group.",
          es: "Te ayudamos a elegir el camarote ideal para tu grupo.",
        },
        media: "cruises.cabin",
      },
    ],
    faqIds: ["what-is-included", "how-booking-works", "is-price-final"],
    heroMedia: "cruises.hero",
    cardMedia: "cruises.card",
  },
];
