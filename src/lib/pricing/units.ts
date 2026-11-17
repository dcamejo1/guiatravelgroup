import type { Pricing } from "@/lib/types";

/** Message key (in the `units` namespace) and count that describe how an item is priced. */
export function unitMessage(pricing: Pricing): {
  key:
    | "per_person"
    | "per_group"
    | "per_vehicle"
    | "per_night"
    | "per_night_room"
    | "per_person_per_night";
  count: number;
} {
  if (pricing.unit === "per_night" && pricing.capacity) {
    return { key: "per_night_room", count: pricing.capacity };
  }
  return { key: pricing.unit, count: pricing.capacity ?? 0 };
}
