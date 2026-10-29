import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buy, buyAction, nav, cartPageUrl, checkout, checkoutTiming } from "../src/utils/buy";

type Settings = Record<string, any>;

function setupSalla(opts: { landing?: boolean; settings?: Settings } = {}) {
  const config: Record<string, any> = {
    "page.is_landing_page": opts.landing ?? true,
    "theme.settings": opts.settings ?? {},
  };
  const salla = {
    config: { get: (key: string) => config[key] },
    cart: { api: { addItem: vi.fn(async () => ({ data: {} })), submit: vi.fn(async () => ({})) } },
    analytics: { track: vi.fn() },
    onReady: async () => {},
  };
  (window as any).Salla = salla;
  return salla;
}

const productPage = (id: string | null = "1456761697") => ({
  page_for_product: [{ value: "product" }],
  product: { value: id ? [id] : [] },
});
const promotionPage = (url = "") => ({ page_for_product: [{ value: "promotion" }], main_btn_url: url });

let events: string[] = [];
const onDrawer = () => events.push("open-checkout-drawer");

beforeEach(() => {
  checkoutTiming.ms = 5;
  vi.spyOn(nav, "go").mockImplementation(() => {});
  // A page shown again (back button) starts with no purchase in progress
  window.dispatchEvent(new Event("pageshow"));
  events = [];
  window.addEventListener("open-checkout-drawer", onDrawer);
  document.body.innerHTML = "";
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
});

afterEach(() => {
  window.removeEventListener("open-checkout-drawer", onDrawer);
  vi.restoreAllMocks();
  delete (window as any).Salla;
});

describe("buyAction", () => {
  it("sends several products to the cart", () => {
    setupSalla({ settings: productPage() });
    expect(buyAction({ items: [{ id: "1", quantity: 1 }, { id: "2", quantity: 1 }] })).toBe("cart");
  });

  it("uses fast checkout on a product page without options", () => {
    setupSalla({ settings: productPage() });
    expect(buyAction({ quantity: 2 })).toBe("fast-checkout");
  });

  it("uses the cart when an option is chosen on a product page", () => {
    setupSalla({ settings: productPage() });
    expect(buyAction({ options: { 11: 22 } })).toBe("cart");
  });

  it("follows the main button link on a promotion page", () => {
    setupSalla({ settings: promotionPage("https://x/offers") });
    expect(buyAction()).toBe("link");
  });

  it("does nothing on a promotion page without any link", () => {
    setupSalla({ settings: promotionPage("") });
    expect(buyAction()).toBe("none");
  });

  it("does nothing on a product page with no product chosen", () => {
    setupSalla({ settings: productPage(null) });
    expect(buyAction({ quantity: 1 })).toBe("none");
  });

  it("acts like a product page outside a real landing page", () => {
    setupSalla({ landing: false });
    expect(buyAction()).toBe("fast-checkout");
  });
});

describe("buy", () => {
  it("removes items it already added when a later one fails", async () => {
    const salla: any = setupSalla({ settings: productPage() });
    salla.cart.api.details = vi.fn(async () => ({ data: { cart: { items: [] } } }));
    salla.cart.api.deleteItem = vi.fn(async () => ({}));
    salla.cart.api.updateItem = vi.fn(async () => ({}));
    salla.cart.api.addItem
      .mockResolvedValueOnce({ data: { cart: { items: [{ id: 11, product_id: 1, quantity: 1 }] } } })
      .mockRejectedValueOnce(new Error("out of stock"));
    const result = await buy({ items: [{ id: "1", quantity: 1 }, { id: "2", quantity: 1 }] });
    expect(result.kind).toBe("error");
    expect(salla.cart.api.deleteItem).toHaveBeenCalledWith(11);
    expect(salla.cart.api.submit).not.toHaveBeenCalled();
  });

  it("restores the quantity of a product the shopper already had in the cart", async () => {
    const salla: any = setupSalla({ settings: productPage() });
    salla.cart.api.details = vi.fn(async () => ({ data: { cart: { items: [{ id: 11, product_id: 1, quantity: 2 }] } } }));
    salla.cart.api.deleteItem = vi.fn(async () => ({}));
    salla.cart.api.updateItem = vi.fn(async () => ({}));
    salla.cart.api.addItem
      .mockResolvedValueOnce({ data: { cart: { items: [{ id: 11, product_id: 1, quantity: 3 }] } } })
      .mockRejectedValueOnce(new Error("unavailable"));
    await buy({ items: [{ id: "1", quantity: 1 }, { id: "2", quantity: 1 }] });
    expect(salla.cart.api.updateItem).toHaveBeenCalledWith({ id: 11, quantity: 2 });
    expect(salla.cart.api.deleteItem).not.toHaveBeenCalled();
  });

  it("does not add the set again while the page is leaving for checkout", async () => {
    const salla = setupSalla({ settings: productPage() });
    await buy({ items: [{ id: "1", quantity: 1 }] });
    await buy({ items: [{ id: "1", quantity: 1 }] });
    expect(salla.cart.api.addItem).toHaveBeenCalledTimes(1);
    expect(salla.cart.api.submit).toHaveBeenCalledTimes(1);
  });

  it("gives up on a stalled cart after 15 seconds", async () => {
    vi.useFakeTimers();
    const salla = setupSalla({ settings: productPage() });
    salla.cart.api.addItem.mockImplementation(() => new Promise(() => {}));
    const pending = buy({ items: [{ id: "1", quantity: 1 }] });
    await vi.advanceTimersByTimeAsync(15000);
    expect((await pending).kind).toBe("error");
    vi.useRealTimers();
  });

  it("adds every product in order, then submits the cart", async () => {
    const salla = setupSalla({ settings: productPage() });
    const result = await buy({ items: [{ id: "1", quantity: 1 }, { id: "2", quantity: 3, options: { 5: 6 } }] });
    expect(result.kind).toBe("cart");
    expect(salla.cart.api.addItem.mock.calls.map((c: any[]) => c[0])).toEqual([
      { id: "1", quantity: 1, options: undefined },
      { id: "2", quantity: 3, options: { 5: 6 } },
    ]);
    expect(salla.cart.api.submit).toHaveBeenCalledTimes(1);
  });

  it("adds the page product with its option when buying through the cart", async () => {
    const salla = setupSalla({ settings: productPage("77") });
    await buy({ quantity: 2, options: { 11: 22 } });
    expect(salla.cart.api.addItem).toHaveBeenCalledWith({ id: "77", quantity: 2, options: { 11: 22 } });
  });

  it("opens the checkout drawer on phones", async () => {
    setupSalla({ settings: productPage() });
    const result = await buy({ quantity: 1 });
    expect(result.kind).toBe("fast-checkout");
    expect(events).toEqual(["open-checkout-drawer"]);
  });

  it("navigates to the promotion link", async () => {
    setupSalla({ settings: promotionPage("https://x/offers") });
    const go = vi.spyOn(nav, "go").mockImplementation(() => {});
    const result = await buy();
    expect(result.kind).toBe("link");
    expect(go).toHaveBeenCalledWith("https://x/offers");
  });

  it("returns the store's message when adding to the cart fails", async () => {
    const salla = setupSalla({ settings: productPage() });
    salla.cart.api.addItem.mockRejectedValueOnce({ response: { data: { error: { message: "حقول غير صالحة" } } } });
    const result = await buy({ items: [{ id: "1", quantity: 1 }] });
    expect(result).toEqual({ kind: "error", message: "حقول غير صالحة" });
    expect(salla.cart.api.submit).not.toHaveBeenCalled();
  });

  it("refuses a quantity above the product's maximum before touching the cart", async () => {
    const salla = setupSalla({ settings: productPage() });
    const result = await buy({ items: [{ id: "1", quantity: 3, max: 2 }] });
    expect(result.kind).toBe("error");
    expect(salla.cart.api.addItem).not.toHaveBeenCalled();
  });

  it("runs one purchase when the button is pressed twice", async () => {
    const salla = setupSalla({ settings: productPage() });
    const first = buy({ items: [{ id: "1", quantity: 1 }, { id: "2", quantity: 1 }] });
    const second = buy({ items: [{ id: "1", quantity: 1 }, { id: "2", quantity: 1 }] });
    expect(second).toBe(first);
    await first;
    expect(salla.cart.api.addItem).toHaveBeenCalledTimes(2);
  });

  it("does nothing outside a real landing page", async () => {
    setupSalla({ landing: false });
    const result = await buy({ quantity: 1 });
    expect(result.kind).toBe("fast-checkout");
    expect(events).toEqual([]);
  });

  it("tracks the purchase with the bundle source", async () => {
    const salla = setupSalla({ settings: productPage() });
    await buy({ quantity: 1 });
    expect(salla.analytics.track).toHaveBeenCalledWith("Buy Now", expect.objectContaining({ source: "your-abaya", quantity: 1 }));
  });
});

describe("checkout", () => {
  const withCart = (submit: () => unknown, extra: Record<string, unknown> = {}) => {
    const listeners: Record<string, (() => void)[]> = {};
    (window as any).Salla = {
      config: { get: (key: string) => (key === "store.url" ? "https://shop.sa/" : undefined) },
      cart: { api: { submit: vi.fn(submit) } },
      event: { on: (name: string, fn: () => void) => (listeners[name] ||= []).push(fn), off: () => {} },
      ...extra,
    };
    return listeners;
  };

  it("goes to the store's cart page when submit does nothing", async () => {
    withCart(async () => {});
    const go = vi.spyOn(nav, "go").mockImplementation(() => {});
    expect(await checkout()).toBe(true);
    expect(go).toHaveBeenCalledWith("https://shop.sa/cart");
  });

  it("goes to the cart page when submit fails", async () => {
    withCart(async () => { throw new Error("boom"); });
    const go = vi.spyOn(nav, "go").mockImplementation(() => {});
    await checkout();
    expect(go).toHaveBeenCalledWith("https://shop.sa/cart");
  });

  it("stays when Salla opens its login window on the page", async () => {
    document.body.innerHTML = "<salla-login-modal></salla-login-modal>";
    const listeners = withCart(async () => listeners["login::open"]?.forEach((fn) => fn()));
    const go = vi.spyOn(nav, "go").mockImplementation(() => {});
    await checkout();
    expect(go).not.toHaveBeenCalled();
  });

  it("still falls back when login is asked for but the page has no login window", async () => {
    const listeners = withCart(async () => listeners["login::open"]?.forEach((fn) => fn()));
    const go = vi.spyOn(nav, "go").mockImplementation(() => {});
    await checkout();
    expect(go).toHaveBeenCalledWith("https://shop.sa/cart");
  });

  it("prefers Salla's own cart address", () => {
    withCart(async () => {}, { url: { get: () => "https://shop.sa/ar/cart" } });
    expect(cartPageUrl()).toBe("https://shop.sa/ar/cart");
  });
});
