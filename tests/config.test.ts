import { afterEach, describe, expect, it } from "vitest";
import { anchorId, getCollectionItems, getConfig, resolveText, unwrapValue, webUrl } from "../src/utils/config";

function setLang(lang: string) {
  document.documentElement.lang = lang;
}

afterEach(() => setLang(""));

describe("resolveText", () => {
  it("falls back to Arabic when the English value is empty", () => {
    setLang("en");
    expect(resolveText({ ar: "عطر", en: "" })).toBe("عطر");
  });

  it("falls back to English when the Arabic value is empty", () => {
    setLang("ar");
    expect(resolveText({ ar: "", en: "Perfume" })).toBe("Perfume");
  });

  it("uses the active locale when it has a value", () => {
    setLang("en");
    expect(resolveText({ ar: "عطر", en: "Perfume" })).toBe("Perfume");
  });
});

describe("getConfig", () => {
  it("unwraps the landing renderer's component wrapper", () => {
    expect(getConfig({ component: { a: 1 }, key: "k" })).toEqual({ a: 1 });
  });

  it("keeps the flat demo shape", () => {
    expect(getConfig({ a: 1 })).toEqual({ a: 1 });
  });

  it("returns an empty object for missing config", () => {
    expect(getConfig(null)).toEqual({});
  });
});

describe("unwrapValue", () => {
  it("reads the first value of a dropdown list", () => {
    expect(unwrapValue([{ value: "dark" }])).toBe("dark");
  });
});

describe("getCollectionItems", () => {
  it("strips the collection prefix from field keys", () => {
    expect(getCollectionItems([{ "items.title": "x" }], "items")).toEqual([{ title: "x" }]);
  });
});

describe("anchorId", () => {
  it("drops a leading # the merchant typed", () => {
    expect(anchorId("#reviews ")).toBe("reviews");
    expect(anchorId("notes")).toBe("notes");
  });
});

describe("webUrl", () => {
  it("adds https to a bare domain", () => {
    expect(webUrl("instagram.com/your-abaya")).toBe("https://instagram.com/your-abaya");
  });

  it("keeps web, mail and phone links", () => {
    expect(webUrl("https://x.com/a")).toBe("https://x.com/a");
    expect(webUrl("mailto:a@b.sa")).toBe("mailto:a@b.sa");
  });

  it("refuses script links", () => {
    expect(webUrl("javascript:alert(1)")).toBe("");
  });
});
