import { describe, expect, it } from "vitest";
import type { CatalogItem, Pricing, QuoteDraft } from "@/lib/types";
import {
  addNights,
  addSelection,
  availability,
  calculateQuote,
  emptyDraft,
  removeSelection,
  totalNights,
} from "./engine";
import { estimateBucket, formatFactors, formatUsd } from "./format";

const item = (
  id: string,
  pricing: Pricing,
  rest: Partial<CatalogItem> = {},
): CatalogItem => ({
  id,
  category: "activity",
  destinationIds: ["a"],
  name: { en: id, es: id },
  description: { en: id, es: id },
  pricing,
  allowQuantity: true,
  isPlaceholder: true,
  ...rest,
});

const draft = (over: Partial<QuoteDraft> = {}): QuoteDraft => ({
  ...emptyDraft("en"),
  travelers: { adults: 2, children: 1 }, // 3 travelers
  destinationIds: ["a", "b"],
  nightsByDestination: { a: 3, b: 2 },
  ...over,
});

const quoteOne = (
  pricing: Pricing,
  selection: Partial<QuoteDraft["selections"][number]> = {},
  over: Partial<QuoteDraft> = {},
  rest: Partial<CatalogItem> = {},
) => {
  const it = item("x", pricing, rest);
  const d = draft({
    selections: [
      { itemId: "x", destinationId: "a", quantity: 1, ...selection },
    ],
    ...over,
  });
  return calculateQuote(d, [it]);
};

describe("pricing units", () => {
  it("per_person: amount × participants × quantity", () => {
    expect(quoteOne({ unit: "per_person", amountUsd: 10 }).totalUsd).toBe(30);
    expect(
      quoteOne({ unit: "per_person", amountUsd: 10 }, { quantity: 2 }).totalUsd,
    ).toBe(60);
  });

  it("per_person: participants can be lowered but never exceed travelers", () => {
    expect(
      quoteOne({ unit: "per_person", amountUsd: 10 }, { participants: 2 })
        .totalUsd,
    ).toBe(20);
    expect(
      quoteOne({ unit: "per_person", amountUsd: 10 }, { participants: 99 })
        .totalUsd,
    ).toBe(30);
    expect(
      quoteOne({ unit: "per_person", amountUsd: 10 }, { participants: 0 })
        .totalUsd,
    ).toBe(10);
  });

  it("per_group: amount × quantity, whatever the group size", () => {
    expect(quoteOne({ unit: "per_group", amountUsd: 50 }).totalUsd).toBe(50);
    expect(
      quoteOne({ unit: "per_group", amountUsd: 50 }, { quantity: 3 }).totalUsd,
    ).toBe(150);
  });

  it.each([
    [1, 1],
    [4, 1],
    [5, 2],
    [8, 2],
    [9, 3],
  ])("per_vehicle: %i travelers with 4 seats need %i vehicle(s)", (n, cars) => {
    const q = quoteOne(
      { unit: "per_vehicle", amountUsd: 20, capacity: 4 },
      {},
      { travelers: { adults: n, children: 0 } },
    );
    expect(q.totalUsd).toBe(20 * cars);
    expect(q.lines[0].factors).toMatchObject({
      units: cars,
      unitKind: "vehicle",
    });
  });

  it.each([
    [1, 1],
    [4, 1],
    [5, 2],
    [8, 2],
    [9, 3],
  ])("per_night with capacity: %i travelers need %i room(s)", (n, rooms) => {
    const q = quoteOne(
      { unit: "per_night", amountUsd: 100, capacity: 4 },
      {},
      { travelers: { adults: n, children: 0 } },
    );
    expect(q.totalUsd).toBe(100 * 3 * rooms);
  });

  it("per_night without capacity is one unit for the group", () => {
    expect(
      quoteOne(
        { unit: "per_night", amountUsd: 100 },
        {},
        { travelers: { adults: 9, children: 0 } },
      ).totalUsd,
    ).toBe(300);
  });

  it("per_person_per_night: amount × travelers × nights × quantity", () => {
    expect(
      quoteOne({ unit: "per_person_per_night", amountUsd: 10 }).totalUsd,
    ).toBe(90);
  });

  it("ignores quantity when the item does not allow it", () => {
    expect(
      quoteOne(
        { unit: "per_group", amountUsd: 50 },
        { quantity: 5 },
        {},
        { allowQuantity: false },
      ).totalUsd,
    ).toBe(50);
  });
});

describe("nights", () => {
  it("uses the nights of the destination the item was added under", () => {
    const pricing: Pricing = { unit: "per_person_per_night", amountUsd: 10 };
    expect(quoteOne(pricing, { destinationId: "a" }).totalUsd).toBe(90); // 3 × 3
    expect(quoteOne(pricing, { destinationId: "b" }).totalUsd).toBe(60); // 3 × 2
  });

  it("uses total trip nights for trip-wide items", () => {
    const q = quoteOne(
      { unit: "per_night", amountUsd: 10 },
      { destinationId: undefined },
    );
    expect(q.totalUsd).toBe(50);
    expect(q.nights).toBe(5);
  });

  it("only counts selected destinations", () => {
    expect(
      totalNights({
        destinationIds: ["a"],
        nightsByDestination: { a: 3, b: 2 },
      }),
    ).toBe(3);
  });

  it("prices per-night items at zero when nights are missing", () => {
    expect(
      quoteOne(
        { unit: "per_night", amountUsd: 10 },
        {},
        { nightsByDestination: {} },
      ).totalUsd,
    ).toBe(0);
  });

  it("adds nights with date-only arithmetic", () => {
    expect(addNights("2026-12-30", 3)).toBe("2027-01-02");
    expect(addNights("2028-02-27", 3)).toBe("2028-03-01");
  });
});

describe("quote", () => {
  it("is empty for an empty selection", () => {
    const q = calculateQuote(draft(), []);
    expect(q).toMatchObject({
      lines: [],
      totalUsd: 0,
      travelers: 3,
      nights: 5,
    });
  });

  it("total equals the sum of lines and rounds to cents", () => {
    const items = [
      item("p", { unit: "per_person", amountUsd: 19.99 }),
      item("g", { unit: "per_group", amountUsd: 0.1 }),
      item("n", { unit: "per_person_per_night", amountUsd: 33.335 }),
    ];
    const q = calculateQuote(
      draft({
        selections: items.map((i) => ({
          itemId: i.id,
          destinationId: "a",
          quantity: 1,
        })),
      }),
      items,
    );
    const sum = q.lines.reduce((s, l) => s + l.subtotalUsd, 0);
    expect(q.totalUsd).toBeCloseTo(sum, 2);
    expect(q.lines.map((l) => l.subtotalUsd)).toEqual([59.97, 0.1, 300.02]);
  });

  it("skips unknown items", () => {
    const q = calculateQuote(
      draft({ selections: [{ itemId: "gone", quantity: 1 }] }),
      [],
    );
    expect(q.lines).toHaveLength(0);
  });

  it("flags items outside the allowed group size and excludes them from the total", () => {
    const tooFew = quoteOne({
      unit: "per_group",
      amountUsd: 50,
      minTravelers: 4,
    });
    expect(tooFew.lines[0].unavailableReason).toBe("min_travelers");
    expect(tooFew.totalUsd).toBe(0);
    const tooMany = quoteOne({
      unit: "per_group",
      amountUsd: 50,
      maxTravelers: 2,
    });
    expect(tooMany.lines[0].unavailableReason).toBe("max_travelers");
    expect(
      availability(
        item("ok", {
          unit: "per_group",
          amountUsd: 1,
          minTravelers: 3,
          maxTravelers: 3,
        }),
        3,
      ),
    ).toBeUndefined();
  });
});

describe("selections", () => {
  const pkgA = item(
    "pkg-a",
    { unit: "per_person", amountUsd: 1 },
    { category: "package" },
  );
  const pkgB = item(
    "pkg-b",
    { unit: "per_person", amountUsd: 1 },
    { category: "package" },
  );
  const act = item("act", { unit: "per_person", amountUsd: 1 });
  const all = [pkgA, pkgB, act];

  it("a second package for the same destination replaces the first", () => {
    let d = addSelection(draft(), pkgA, "a", all);
    d = addSelection(d, act, "a", all);
    d = addSelection(d, pkgB, "a", all);
    expect(d.selections.map((s) => s.itemId)).toEqual(["act", "pkg-b"]);
  });

  it("packages for different destinations coexist", () => {
    let d = addSelection(draft(), pkgA, "a", all);
    d = addSelection(d, pkgB, "b", all);
    expect(d.selections).toHaveLength(2);
  });

  it("adding twice is a no-op, and items can be removed", () => {
    let d = addSelection(draft(), act, "a", all);
    expect(addSelection(d, act, "a", all)).toBe(d);
    d = removeSelection(d, "act", "a");
    expect(d.selections).toHaveLength(0);
  });
});

describe("formatting", () => {
  it("explains factors in both languages", () => {
    expect(formatFactors({ travelers: 2, nights: 4 }, "en")).toBe(
      "2 travelers × 4 nights",
    );
    expect(formatFactors({ travelers: 1, nights: 1 }, "es")).toBe(
      "1 viajero × 1 noche",
    );
    expect(
      formatFactors({ units: 2, unitKind: "vehicle", quantity: 2 }, "es"),
    ).toBe("2 vehículos × 2");
    expect(formatFactors({ nights: 3, units: 2, unitKind: "room" }, "en")).toBe(
      "2 rooms × 3 nights",
    );
    expect(formatFactors({}, "en")).toBe("");
  });

  it("formats whole dollars without cents", () => {
    expect(formatUsd(1200, "en")).toBe("$1,200");
    expect(formatUsd(12.5, "en")).toBe("$12.50");
  });

  it("buckets estimates coarsely", () => {
    expect(estimateBucket(10)).toBe("<500");
    expect(estimateBucket(500)).toBe("500-1000");
    expect(estimateBucket(9000)).toBe("5000+");
  });
});
