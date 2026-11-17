import { z } from "zod";

const localized = z.object({ en: z.string().min(1), es: z.string().min(1) });

export const pricingSchema = z
  .object({
    unit: z.enum([
      "per_person",
      "per_group",
      "per_vehicle",
      "per_night",
      "per_person_per_night",
    ]),
    amountUsd: z.number().nonnegative(),
    capacity: z.number().int().positive().optional(),
    minTravelers: z.number().int().positive().optional(),
    maxTravelers: z.number().int().positive().optional(),
  })
  .refine((p) => p.unit !== "per_vehicle" || p.capacity !== undefined, {
    message: "per_vehicle items need a capacity",
  })
  .refine(
    (p) =>
      p.minTravelers === undefined ||
      p.maxTravelers === undefined ||
      p.minTravelers <= p.maxTravelers,
    { message: "minTravelers must not exceed maxTravelers" },
  );

export const catalogItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(["package", "activity", "transport", "extra"]),
  destinationIds: z.array(z.string()),
  name: localized,
  description: localized,
  pricing: pricingSchema,
  allowQuantity: z.boolean().optional(),
  includes: z.array(localized).optional(),
  media: z.string().optional(),
  isPlaceholder: z.boolean(),
});

export const destinationSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: localized,
  name: localized,
  kicker: localized,
  tagline: localized,
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  atAGlance: z.array(
    z.object({ label: localized, value: localized, verify: z.boolean() }),
  ),
  highlights: z.array(
    z.object({ title: localized, text: localized, media: z.string() }),
  ),
  faqIds: z.array(z.string()),
  heroMedia: z.string(),
  cardMedia: z.string(),
});
