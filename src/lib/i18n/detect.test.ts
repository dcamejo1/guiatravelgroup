import { describe, expect, it } from "vitest";
import { detectLocale, fromAcceptLanguage } from "./detect";

describe("detectLocale", () => {
  it("prefers the saved choice over everything", () => {
    expect(
      detectLocale({
        cookie: "es",
        acceptLanguage: "en-US,en;q=0.9",
        country: "US",
      }),
    ).toBe("es");
  });

  it("ignores an invalid cookie", () => {
    expect(detectLocale({ cookie: "fr", acceptLanguage: "es" })).toBe("es");
  });

  it("uses the browser language before the country", () => {
    expect(
      detectLocale({ acceptLanguage: "en-GB,en;q=0.8", country: "VE" }),
    ).toBe("en");
    expect(
      detectLocale({
        acceptLanguage: "es-VE,es;q=0.9,en;q=0.8",
        country: "US",
      }),
    ).toBe("es");
  });

  it("falls back to the country when the browser language is unsupported or missing", () => {
    expect(
      detectLocale({ acceptLanguage: "fr-FR,de;q=0.8", country: "ve" }),
    ).toBe("es");
    expect(detectLocale({ country: "MX" })).toBe("es");
    expect(detectLocale({ acceptLanguage: "pt-BR", country: "BR" })).toBe("en");
  });

  it("defaults to English", () => {
    expect(detectLocale({})).toBe("en");
  });
});

describe("fromAcceptLanguage", () => {
  it("honours q-values over order", () => {
    expect(fromAcceptLanguage("en;q=0.5, es;q=0.9")).toBe("es");
    expect(fromAcceptLanguage("fr, es;q=0.4, en;q=0.6")).toBe("en");
  });

  it("skips q=0 and garbage", () => {
    expect(fromAcceptLanguage("es;q=0, en")).toBe("en");
    expect(fromAcceptLanguage("*")).toBeNull();
    expect(fromAcceptLanguage("")).toBeNull();
    expect(fromAcceptLanguage(null)).toBeNull();
  });
});
