import type { Faq } from "@/lib/types";

/** Only questions the site itself can answer truthfully. Travel facts live in the guide, flagged VERIFY. */
export const faqs: Faq[] = [
  {
    id: "how-booking-works",
    question: {
      en: "How does booking work?",
      es: "¿Cómo funciona la reserva?",
    },
    answer: {
      en: "Build your trip here to get an estimate, then send it to us on WhatsApp with one tap. We reply with a confirmed quote and take it from there.",
      es: "Arma tu viaje aquí para obtener un estimado y envíanoslo por WhatsApp con un toque. Te respondemos con una cotización confirmada y seguimos desde ahí.",
    },
    verify: false,
  },
  {
    id: "is-price-final",
    question: {
      en: "Is the price I see final?",
      es: "¿El precio que veo es definitivo?",
    },
    answer: {
      en: "No. It is an estimate to help you plan. The exact price is confirmed on WhatsApp and may be higher or lower depending on dates and availability.",
      es: "No. Es un estimado para ayudarte a planificar. El precio exacto se confirma por WhatsApp y puede ser mayor o menor según fechas y disponibilidad.",
    },
    verify: false,
  },
  {
    id: "what-is-included",
    question: {
      en: "What is included in a package?",
      es: "¿Qué incluye un paquete?",
    },
    answer: {
      en: "Each package lists what it includes. Details shown here are placeholders until the agency confirms them.",
      es: "Cada paquete indica lo que incluye. Los detalles que ves aquí son de ejemplo hasta que la agencia los confirme.",
    },
    verify: true,
  },
  {
    id: "secure-transport",
    question: {
      en: "Do you offer private or secure transport?",
      es: "¿Ofrecen transporte privado o de seguridad?",
    },
    answer: {
      en: "Yes. We arrange private transfers, and secure vehicle options are available on request. Ask us on WhatsApp.",
      es: "Sí. Organizamos traslados privados y contamos con opciones de vehículos de seguridad a solicitud. Pregúntanos por WhatsApp.",
    },
    verify: true,
  },
];
