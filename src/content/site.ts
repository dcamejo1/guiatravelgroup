/**
 * Brand and contact settings. The public name is tentative: change it here
 * and nowhere else.
 */
export const site = {
  name: "Exploring Venezuela",
  operator: "Guía Travel Group",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  demo: process.env.NEXT_PUBLIC_DEMO !== "false",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  /** Placeholder: add real profiles once confirmed with the agency. */
  social: { instagram: "" },
} as const;
