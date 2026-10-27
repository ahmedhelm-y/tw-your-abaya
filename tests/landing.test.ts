import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProduct } from "../src/utils/landing";

function setup(pageProduct: string) {
  const config: Record<string, any> = {
    "page.is_landing_page": true,
    "theme.settings": { page_for_product: [{ value: "product" }], product: { value: [pageProduct] } },
    "store.id": 99,
  };
  const getDetails = vi.fn(async (id: string) => ({ data: { id, options: [] } }));
  (window as any).Salla = { config: { get: (k: string) => config[k] }, product: { api: { getDetails } }, onReady: async () => {} };
  return getDetails;
}

afterEach(() => {
  delete (window as any).Salla;
  vi.unstubAllGlobals();
});

describe("fetchProduct on a landing page", () => {
  it("loads the page's own product through Salla", async () => {
    const getDetails = setup("7");
    await fetchProduct("7");
    expect(getDetails).toHaveBeenCalledTimes(1);
  });

  it("loads other products quietly, so a missing one never pops an error notice", async () => {
    const getDetails = setup("7");
    const fetchMock = vi.fn(async () => ({ json: async () => ({ data: null }) }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchProduct("123")).toBeNull();
    expect(getDetails).not.toHaveBeenCalled();
    expect(String((fetchMock.mock.calls[0] as any[])[1].headers["store-identifier"])).toBe("99");
  });
});
