import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { destinations } from "./destinations";
import { faqs } from "./faq";
import { guideArticles } from "./guide";
import { media } from "./media";
import { catalogItemSchema, destinationSchema } from "./schema";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("catalog", () => {
  it("every item is valid", () => {
    for (const item of catalog) {
      expect(() => catalogItemSchema.parse(item), item.id).not.toThrow();
    }
  });

  it("ids are unique and destinations exist", () => {
    expect(unique(catalog.map((i) => i.id))).toBe(true);
    const ids = new Set(destinations.map((d) => d.id));
    for (const item of catalog) {
      for (const id of item.destinationIds)
        expect(ids.has(id), item.id).toBe(true);
    }
  });

  it("is all placeholder data in the demo", () => {
    expect(catalog.every((i) => i.isPlaceholder)).toBe(true);
  });

  it("each destination has two packages and three activities", () => {
    for (const d of destinations) {
      const own = catalog.filter((i) => i.destinationIds.includes(d.id));
      expect(own.filter((i) => i.category === "package")).toHaveLength(2);
      expect(own.filter((i) => i.category === "activity")).toHaveLength(3);
    }
  });
});

describe("destinations", () => {
  it("are valid, with unique ids and slugs", () => {
    for (const d of destinations) {
      expect(() => destinationSchema.parse(d), d.id).not.toThrow();
    }
    expect(unique(destinations.map((d) => d.id))).toBe(true);
    expect(unique(destinations.map((d) => d.slug.en))).toBe(true);
    expect(unique(destinations.map((d) => d.slug.es))).toBe(true);
  });

  it("reference media slots and FAQs that exist", () => {
    const faqIds = new Set(faqs.map((f) => f.id));
    for (const d of destinations) {
      for (const key of [
        d.heroMedia,
        d.cardMedia,
        ...d.highlights.map((h) => h.media),
      ]) {
        expect(key in media, `${d.id}: ${key}`).toBe(true);
      }
      for (const id of d.faqIds)
        expect(faqIds.has(id), `${d.id}: ${id}`).toBe(true);
    }
  });
});

describe("guide", () => {
  it("has unique slugs per language and flags unwritten content", () => {
    expect(unique(guideArticles.map((a) => a.slug.en))).toBe(true);
    expect(unique(guideArticles.map((a) => a.slug.es))).toBe(true);
    for (const a of guideArticles) {
      expect(a.sections.every((s) => s.verify)).toBe(true);
    }
  });
});
