import { afterEach, describe, expect, it, vi } from "vitest";
import { reveal } from "../src/utils/reveal";

function stubMatchMedia(reduced: boolean) {
  window.matchMedia = ((query: string) => ({ matches: reduced && query.includes("reduce"), media: query })) as any;
}

function stubObserver() {
  const observed: Element[] = [];
  (window as any).IntersectionObserver = class {
    constructor(public cb: IntersectionObserverCallback) {}
    observe(el: Element) {
      observed.push(el);
    }
    unobserve() {}
    disconnect() {}
  };
  return observed;
}

afterEach(() => {
  delete (window as any).IntersectionObserver;
  vi.useRealTimers();
});

describe("reveal", () => {
  it("leaves content alone without IntersectionObserver", () => {
    stubMatchMedia(false);
    const el = document.createElement("div");
    reveal(el);
    expect(el.classList.contains("aby-reveal")).toBe(false);
  });

  it("leaves content alone when the visitor asks for reduced motion", () => {
    stubMatchMedia(true);
    stubObserver();
    const el = document.createElement("div");
    reveal(el);
    expect(el.classList.contains("aby-reveal")).toBe(false);
  });

  it("animates in when the observer is available", () => {
    stubMatchMedia(false);
    const observed = stubObserver();
    const el = document.createElement("div");
    reveal(el);
    expect(el.classList.contains("aby-reveal")).toBe(true);
    expect(observed).toContain(el);
  });

  it("shows the content after 2.5s even if it never scrolls into view", () => {
    vi.useFakeTimers();
    stubMatchMedia(false);
    stubObserver();
    const el = document.createElement("div");
    reveal(el);
    expect(el.classList.contains("is-in")).toBe(false);
    vi.advanceTimersByTime(2500);
    expect(el.classList.contains("is-in")).toBe(true);
  });
});
