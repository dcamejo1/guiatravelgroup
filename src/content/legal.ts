import type { Localized } from "@/lib/types";

/**
 * Plain-language DRAFTS of the legal pages. They describe how the demo site
 * behaves today and must be reviewed by the agency (and ideally a lawyer)
 * before launch.
 */
export interface LegalPage {
  title: Localized;
  sections: { heading: Localized; body: Localized }[];
}

export const legal: Record<"privacy" | "terms", LegalPage> = {
  privacy: {
    title: { en: "Privacy", es: "Privacidad" },
    sections: [
      {
        heading: {
          en: "What this site collects",
          es: "Qué recopila este sitio",
        },
        body: {
          en: "You do not need an account to use this site. The trip you build is kept in your own browser so it is still there if you refresh the page, and it is cleared when you close the tab.",
          es: "No necesitas una cuenta para usar este sitio. El viaje que armas se guarda en tu propio navegador para que siga ahí si recargas la página, y se borra al cerrar la pestaña.",
        },
      },
      {
        heading: { en: "When you contact us", es: "Cuando nos contactas" },
        body: {
          en: "Nothing is sent to us until you press send in WhatsApp. The message contains what you chose to include: your trip, group size, dates, and any name or notes you typed.",
          es: "No recibimos nada hasta que pulsas enviar en WhatsApp. El mensaje contiene lo que decidiste incluir: tu viaje, el tamaño del grupo, las fechas y el nombre o las notas que hayas escrito.",
        },
      },
      {
        heading: { en: "Analytics", es: "Analítica" },
        body: {
          en: "We may measure how the site is used (for example, which pages are visited and whether the trip builder is completed) without cookies and without recording your name, notes or exact quote.",
          es: "Podemos medir cómo se usa el sitio (por ejemplo, qué páginas se visitan y si se completa el planificador) sin cookies y sin registrar tu nombre, tus notas ni tu cotización exacta.",
        },
      },
    ],
  },
  terms: {
    title: { en: "Terms", es: "Términos" },
    sections: [
      {
        heading: {
          en: "Estimates are not final prices",
          es: "Los estimados no son precios finales",
        },
        body: {
          en: "Prices shown on this site are estimates to help you plan. The final price is confirmed by the agency on WhatsApp and may be higher or lower depending on dates and availability.",
          es: "Los precios que muestra este sitio son estimados para ayudarte a planificar. La agencia confirma el precio final por WhatsApp y puede ser mayor o menor según fechas y disponibilidad.",
        },
      },
      {
        heading: {
          en: "Nothing is booked on this site",
          es: "En este sitio no se reserva nada",
        },
        body: {
          en: "Sending a trip request does not create a booking. A trip is only booked once the agency confirms it with you directly.",
          es: "Enviar una solicitud no crea una reserva. Un viaje solo queda reservado cuando la agencia lo confirma contigo directamente.",
        },
      },
      {
        heading: { en: "Booking conditions", es: "Condiciones de reserva" },
        body: {
          en: "Payment, cancellation and change conditions will be published here once the agency confirms them.",
          es: "Las condiciones de pago, cancelación y cambios se publicarán aquí cuando la agencia las confirme.",
        },
      },
    ],
  },
};
