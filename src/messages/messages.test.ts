import { describe, expect, it } from "vitest";
import en from "./en.json";
import es from "./es.json";

const keys = (value: unknown, prefix = ""): string[] =>
  value && typeof value === "object"
    ? Object.entries(value).flatMap(([k, v]) => keys(v, `${prefix}${k}.`))
    : [prefix.slice(0, -1)];

describe("messages", () => {
  it("English and Spanish have exactly the same keys", () => {
    expect(keys(es).sort()).toEqual(keys(en).sort());
  });
});
