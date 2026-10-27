import { t } from "./config";
import { getSalla, isLandingPage, landingProductId, mainButton, openCheckout, pageMode, syncCheckoutQuantity } from "./landing";

// Measured on the test store (spec section 10): cart.api.submit() redirects to pay.salla.sa by itself,
// and product options can only be sent through the cart.
export const CHECKOUT_URL_KIND = "submit" as const;
export const OPTIONS_VIA = "cart" as const;

export type BuyItem = { id: string; quantity: number; options?: Record<string, string | number>; notes?: string; max?: number };
export type BuyRequest = {
  quantity?: number;
  options?: Record<string, string | number>;
  items?: BuyItem[];
  fallbackUrl?: string;
  product?: any;
};
export type BuyResult = { kind: "fast-checkout" | "cart" | "link" | "none" | "error"; message?: string };

/** Navigation seam, so a promotion link can be followed without leaving the page in tests. */
export const nav = { go: (url: string) => window.location.assign(url) };

const hasOptions = (options?: Record<string, unknown>) => !!options && Object.keys(options).length > 0;

/** Decides what a buy button does, without doing it. */
export function buyAction(req: BuyRequest = {}): BuyResult["kind"] {
  // Demo and template previews show every button as it appears on a product page
  if (!isLandingPage()) return "fast-checkout";
  if (req.items?.length) return "cart";
  if (pageMode() === "product") {
    if (!landingProductId()) return "none";
    return hasOptions(req.options) ? "cart" : "fast-checkout";
  }
  return mainButton().url || req.fallbackUrl ? "link" : "none";
}

const TIMEOUT_MS = 15000;
let inflight: Promise<BuyResult> | null = null;

// A page restored from the back/forward cache starts again with no purchase in progress
window.addEventListener("pageshow", () => {
  inflight = null;
});

/**
 * Runs a buy button. A second press while one purchase is still running gets the same purchase back, and
 * after the cart is submitted every press keeps getting it while the browser leaves for checkout.
 */
export function buy(req: BuyRequest = {}): Promise<BuyResult> {
  if (inflight) return inflight;
  const current = withTimeout(run(req)).then((result) => {
    if (result.kind !== "cart" && inflight === current) inflight = null;
    return result;
  });
  inflight = current;
  return current;
}

function withTimeout(work: Promise<BuyResult>): Promise<BuyResult> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve({ kind: "error", message: errorMessage(null) }), TIMEOUT_MS);
    work.then(resolve, (error) => resolve({ kind: "error", message: errorMessage(error) })).finally(() => window.clearTimeout(timer));
  });
}

type CartLine = { id: number | string; product_id?: number | string; quantity: number };

function cartLines(response: any): CartLine[] {
  return response?.data?.cart?.items || response?.data?.items || [];
}

/** Puts the cart back as it was before this purchase: new lines removed, existing lines restored. */
async function rollback(cart: any, before: CartLine[], after: CartLine[]): Promise<void> {
  const previous = new Map(before.map((line) => [String(line.id), Number(line.quantity) || 0]));
  for (const line of after) {
    const had = previous.get(String(line.id)) || 0;
    if ((Number(line.quantity) || 0) <= had) continue;
    try {
      if (had) await cart.updateItem?.({ id: line.id, quantity: had });
      else await cart.deleteItem?.(line.id);
    } catch {
      // best effort: the shopper still sees the error and the cart page shows what is there
    }
  }
}

function track(req: BuyRequest, kind: BuyResult["kind"], quantity: number): void {
  const Salla = getSalla();
  try {
    const product = req.product;
    Salla?.analytics?.track("Buy Now", {
      source: "your-abaya",
      action: kind,
      product_id: product?.id ? String(product.id) : landingProductId(),
      items: req.items?.length || 1,
      quantity,
      price: product?.id ? Number(product.sale_price || product.price || 0) * quantity : null,
      currency: product?.currency || Salla?.config?.get("user.currency_code") || null,
    });
  } catch {
    // tracking must never block the purchase
  }
}

function errorMessage(error: any): string {
  return (
    error?.response?.data?.error?.message ||
    error?.message ||
    t({ ar: "تعذر إكمال الطلب، حاول مرة أخرى", en: "We couldn't complete the order, please try again" })
  );
}

async function run(req: BuyRequest): Promise<BuyResult> {
  const kind = buyAction(req);
  const quantity = Math.max(1, Number(req.quantity) || 1);
  if (kind !== "none") track(req, kind, quantity);

  if (kind === "fast-checkout") {
    if (isLandingPage()) {
      openCheckout();
      syncCheckoutQuantity(quantity);
    }
    return { kind };
  }

  if (kind === "cart") {
    const cart = getSalla()?.cart?.api;
    const items: BuyItem[] = req.items?.length
      ? req.items
      : [{ id: String(landingProductId()), quantity, options: req.options }];
    // Checked before anything is added, so a refused set never leaves half its items in the cart
    if (items.some((item) => item.max && item.quantity > item.max)) {
      return { kind: "error", message: t({ ar: "الكمية أكبر من المتاح", en: "The quantity is more than what is available" }) };
    }
    if (!cart) return { kind: "error", message: errorMessage(null) };
    let before: CartLine[] = [];
    try {
      before = cartLines(await (cart as any).details?.());
    } catch {
      // no cart yet: everything added now is new
    }
    let after = before;
    try {
      for (const item of items) {
        const lines = cartLines(await cart.addItem({ id: item.id, quantity: item.quantity, options: item.options, ...(item.notes ? { notes: item.notes } : {}) }));
        if (lines.length) after = lines;
      }
    } catch (error) {
      // A refused item must not leave the earlier ones behind, or a retry would add them twice
      await rollback(cart, before, after);
      return { kind: "error", message: errorMessage(error) };
    }
    try {
      await cart.submit();
      return { kind };
    } catch (error) {
      return { kind: "error", message: errorMessage(error) };
    }
  }

  if (kind === "link") {
    nav.go(mainButton().url || req.fallbackUrl || "");
    return { kind };
  }

  return { kind: "none" };
}
