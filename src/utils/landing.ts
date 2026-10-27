// Mirrors the landing renderer (theme-landing-page): page mode, the page's product and its fast checkout.

type SallaGlobal = {
  config?: { get: (key: string, fallback?: unknown) => any };
  analytics?: { track: (event: string, props: Record<string, unknown>) => void };
  money?: (amount: number) => string;
  product?: { api: { getDetails: (id: string | number, withItems?: string[]) => Promise<{ data: any }> } };
  cart?: { api: { addItem: (item: Record<string, unknown>) => Promise<any>; submit: () => Promise<any> } };
  onReady?: () => Promise<void>;
};

export function getSalla(): SallaGlobal | undefined {
  return (window as any).Salla;
}

export function landingSettings(): Record<string, any> {
  return getSalla()?.config?.get("theme.settings") || {};
}

export function isLandingPage(): boolean {
  return getSalla()?.config?.get("page.is_landing_page") === true;
}

/** Handles the boolean, string and radio-list formats the dashboard has saved over time. */
export function pageMode(): "product" | "promotion" {
  const value = landingSettings().page_for_product;
  if (typeof value === "boolean" || value === undefined || value === null) {
    return value === false ? "promotion" : "product";
  }
  if (typeof value === "string") return value === "promotion" ? "promotion" : "product";
  return Array.isArray(value) && value[0]?.value === "promotion" ? "promotion" : "product";
}

/** The product the page sells, which is also the one fast checkout buys. */
export function landingProductId(): string | null {
  if (!isLandingPage() || pageMode() !== "product") return null;
  const id = landingSettings().product?.value?.[0];
  return id ? String(id) : null;
}

export function mainButton(): { text: string; url: string } {
  const settings = landingSettings();
  return { text: String(settings.main_btn_text || ""), url: String(settings.main_btn_url || "") };
}

// Template demo products live in a preview store; the demo and public preview pages run on another store.
// Your abaya preview store, whose products the templates and previews show
const PREVIEW_STORE_ID = "1616473";
const DETAILS_WITH = ["images", "rating", "sold_quantity", "options"];

// Plain fetch: Salla's API helper pops an error notice when a demo product is missing from the current store.
async function fetchFromStore(id: string | number, storeId: string): Promise<any | null> {
  try {
    const query = DETAILS_WITH.map((item) => `with[]=${item}`).join("&");
    const res = await fetch(`https://api.salla.dev/store/v1/products/${id}/details?${query}`, {
      headers: { "store-identifier": storeId, "accept-language": document.documentElement.lang === "en" ? "en" : "ar" },
    });
    const json = await res.json();
    return json?.data?.id ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchProduct(id: string | number | null | undefined): Promise<any | null> {
  const Salla = getSalla();
  if (!id) return null;
  await Salla?.onReady?.();
  const storeId = String(Salla?.config?.get("store.id") || "");
  if (isLandingPage()) {
    // Only the page's own product goes through Salla's helper; any other product (a template sample or a
    // set member) loads quietly, because the helper shows an error notice when a product is missing
    if (String(id) !== landingProductId()) return storeId ? fetchFromStore(id, storeId) : null;
    try {
      const res = await Salla?.product?.api.getDetails(id, DETAILS_WITH);
      return res?.data?.id ? res.data : null;
    } catch {
      return null;
    }
  }
  return (storeId && (await fetchFromStore(id, storeId))) || fetchFromStore(id, PREVIEW_STORE_ID);
}

/** Opens the page's own checkout: the drawer on phones and in the drawer layout, otherwise scrolls to it. */
export function openCheckout(): void {
  const checkout = document.querySelector(".s-block--fast-checkout");
  const layout = checkout?.getAttribute("data-layout");
  if (window.innerWidth < 1024 || layout === "side-drawer" || !checkout) {
    window.dispatchEvent(new CustomEvent("open-checkout-drawer"));
    return;
  }
  checkout.scrollIntoView({ behavior: "smooth", block: "center" });
}

/** Carries the quantity picked in a section into the page's checkout, which owns its own quantity input. */
export function syncCheckoutQuantity(quantity: number, tries = 20): void {
  if (quantity <= 1) return;
  const input = document.querySelector<any>(
    ".s-block--fast-checkout salla-quantity-input, .s-block--fast-checkout-main salla-quantity-input"
  );
  if (input?.setValue) {
    input.setValue(quantity);
    return;
  }
  // The drawer layout mounts its checkout only after it opens
  if (tries > 0) window.setTimeout(() => syncCheckoutQuantity(quantity, tries - 1), 100);
}

export function money(amount: number): string {
  const Salla = getSalla();
  return Salla?.money ? Salla.money(amount) : String(amount);
}
