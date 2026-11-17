import type { Localized } from "@/lib/types";

/**
 * Media manifest. Every image or video on the site is a slot listed here.
 *
 * To add real media: drop the file in `public/media/<folder>/` and fill in
 * `src` (and `poster` for video). A slot without `src` renders a labeled
 * placeholder, so nothing breaks while media is missing.
 */
export interface MediaEntry {
  kind: "image" | "video";
  /** Describes what belongs here; doubles as alt text. */
  label: Localized;
  src?: string;
  /** Smaller video for phones. */
  srcMobile?: string;
  poster?: string;
  /** CSS object-position for cropping, e.g. "50% 70%". */
  position?: string;
}

const slot = (
  kind: MediaEntry["kind"],
  en: string,
  es: string,
  rest: Omit<MediaEntry, "kind" | "label"> = {},
): MediaEntry => ({ kind, label: { en, es }, ...rest });

export const media = {
  // Home
  "home.hero": slot(
    "video",
    "Aerial view of a white sandbar and turquoise water in Los Roques",
    "Vista aérea de un banco de arena blanca y agua turquesa en Los Roques",
    {
      src: "/media/home/hero.mp4",
      srcMobile: "/media/home/hero-720.mp4",
      poster: "/media/home/hero-poster.jpg",
      position: "50% 60%",
    },
  ),
  "home.how": slot(
    "image",
    "Wave breaking on white sand beside bright turquoise sea, Los Roques",
    "Ola rompiendo sobre arena blanca junto al mar turquesa, Los Roques",
    { src: "/media/los-roques/beach.jpg", position: "50% 75%" },
  ),
  "home.cta": slot(
    "video",
    "Boat gliding over clear green water toward a mangrove island near sunset",
    "Lancha sobre agua cristalina rumbo a un cayo de manglar al atardecer",
    {
      src: "/media/los-roques/boat.mp4",
      poster: "/media/los-roques/boat-poster.jpg",
    },
  ),
  "home.weddings": slot(
    "image",
    "Wedding ceremony on a Venezuelan beach",
    "Ceremonia de boda en una playa venezolana",
  ),

  "weddings.hero": slot(
    "image",
    "Couple at a beach wedding in Venezuela",
    "Pareja en una boda de playa en Venezuela",
  ),
  "weddings.gallery-1": slot(
    "image",
    "Ceremony set-up by the sea",
    "Montaje de ceremonia junto al mar",
  ),
  "weddings.gallery-2": slot(
    "image",
    "Wedding table details",
    "Detalles de la mesa de boda",
  ),
  "weddings.gallery-3": slot(
    "image",
    "Guests celebrating at sunset",
    "Invitados celebrando al atardecer",
  ),
  "weddings.gallery-4": slot("image", "Bouquet and rings", "Ramo y anillos"),
  "about.hero": slot(
    "image",
    "Elizabeth and the Guía Travel Group team",
    "Elizabeth y el equipo de Guía Travel Group",
  ),

  // Los Roques
  "los-roques.card": slot(
    "video",
    "Snorkeling among yellowtail fish over white sand, Los Roques",
    "Snorkel entre peces sobre arena blanca, Los Roques",
    {
      src: "/media/los-roques/snorkel.mp4",
      poster: "/media/los-roques/snorkel-poster.jpg",
    },
  ),
  "los-roques.hero": slot(
    "image",
    "Sandbar and reef seen from above, Los Roques",
    "Banco de arena y arrecife desde el aire, Los Roques",
    { src: "/media/los-roques/sandbar.jpg" },
  ),
  "los-roques.beach": slot(
    "image",
    "Swimming in calm turquoise water, Los Roques",
    "Baño en aguas turquesa y tranquilas, Los Roques",
    { src: "/media/los-roques/beach.jpg" },
  ),
  "los-roques.turtles": slot(
    "image",
    "Young green turtle at the Dos Mosquises sanctuary",
    "Tortuga verde juvenil en el santuario de Dos Mosquises",
    { src: "/media/los-roques/turtle.jpg" },
  ),
  "los-roques.reef": slot(
    "video",
    "Snorkeling over the reef, Los Roques",
    "Snorkel sobre el arrecife, Los Roques",
    {
      src: "/media/los-roques/snorkel.mp4",
      poster: "/media/los-roques/snorkel-poster.jpg",
    },
  ),

  // Canaima
  "canaima.card": slot(
    "video",
    "Angel Falls dropping from a tepui, Canaima",
    "El Salto Ángel cayendo desde un tepuy, Canaima",
  ),
  "canaima.hero": slot(
    "video",
    "Angel Falls from the river, Canaima",
    "El Salto Ángel desde el río, Canaima",
  ),
  "canaima.lagoon": slot(
    "image",
    "Canaima lagoon and its waterfalls",
    "La laguna de Canaima y sus saltos",
  ),
  "canaima.tepuis": slot(
    "image",
    "Tepuis rising over the savanna",
    "Tepuyes sobre la sabana",
  ),
  "canaima.falls": slot(
    "image",
    "Angel Falls up close",
    "El Salto Ángel de cerca",
  ),

  // Margarita
  "margarita.card": slot(
    "video",
    "Palm-lined beach on Margarita Island",
    "Playa con palmeras en la isla de Margarita",
  ),
  "margarita.hero": slot(
    "video",
    "Margarita Island coastline",
    "Costa de la isla de Margarita",
  ),
  "margarita.beach": slot(
    "image",
    "Beach day on Margarita",
    "Día de playa en Margarita",
  ),
  "margarita.town": slot(
    "image",
    "Colonial streets on Margarita",
    "Calles coloniales en Margarita",
  ),
  "margarita.sunset": slot(
    "image",
    "Sunset over the Caribbean from Margarita",
    "Atardecer sobre el Caribe desde Margarita",
  ),

  // Mérida
  "merida.card": slot(
    "video",
    "Andean peaks above Mérida",
    "Picos andinos sobre Mérida",
  ),
  "merida.hero": slot(
    "video",
    "The Andes around Mérida",
    "Los Andes alrededor de Mérida",
  ),
  "merida.cablecar": slot(
    "image",
    "Cable car climbing into the Andes",
    "Teleférico subiendo a los Andes",
  ),
  "merida.paramo": slot(
    "image",
    "Páramo landscape with frailejones",
    "Paisaje de páramo con frailejones",
  ),
  "merida.town": slot(
    "image",
    "Mountain village near Mérida",
    "Pueblo de montaña cerca de Mérida",
  ),

  // Cruises
  "cruises.card": slot(
    "video",
    "Cruise ship on the Caribbean",
    "Crucero en el Caribe",
  ),
  "cruises.hero": slot("video", "Cruise ship at sea", "Crucero en alta mar"),
  "cruises.deck": slot("image", "Ship deck at sunset", "Cubierta al atardecer"),
  "cruises.port": slot(
    "image",
    "Arriving at a Caribbean port",
    "Llegada a un puerto del Caribe",
  ),
  "cruises.cabin": slot(
    "image",
    "Cabin with ocean view",
    "Camarote con vista al mar",
  ),
} satisfies Record<string, MediaEntry>;

export type MediaKey = keyof typeof media;
