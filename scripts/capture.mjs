// Store screenshots (1600×1200 JPEG, under 200 KB): each one shows a feature on a laptop and a phone, with no
// added text or logos, as Salla's listing rules ask. Also renders the template thumbnails (768×1195).
// Run `pnpm build`, serve the repo (node scripts/serve.mjs 5198), then:
//   OUT=<folder> node scripts/capture.mjs [market|thumbs|help]
// "help" writes one phone-width shot per section for the help page into <OUT>/help.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.HARNESS || "http://127.0.0.1:5198/harness/landing.html";
const OUT = process.env.OUT || ".";
const SHOWCASE = "../harness/showcase.json";

/** Opens the harness, optionally scrolls a section to the top and acts on the page, and returns a PNG. */
async function shoot(browser, { query, focus, act, mobile, viewport, landing = false, wait = 7000 }) {
  const page = await browser.newPage(viewport ? { viewport } : mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}?clean=1&filler=0&layout=none${landing ? "" : "&landing=0"}&${query}`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(wait);
  // Room under the last section so it can scroll to the top, painted in the page's own background
  await page.evaluate(() => {
    let el = document.querySelector(".aby-block"), bg = "";
    while (el && (!bg || bg === "rgba(0, 0, 0, 0)")) { bg = getComputedStyle(el).backgroundColor; el = el.parentElement; }
    if (bg) document.documentElement.style.background = document.body.style.background = bg;
    document.body.style.paddingBottom = "100vh";
  });
  if (focus) {
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-aby-section="${id}"]`);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }, focus);
    await page.waitForTimeout(1500);
  }
  if (act) await act(page);
  const png = await page.screenshot();
  await page.close();
  return png;
}

// Type a height in the fit finder, to show the suggested length
const height = async (page) => {
  await page.locator("#aby-ff-height").fill("162").catch(() => {});
  await page.waitForTimeout(800);
};
// "Reveal the code" uncovers the card the same way scratching does
const scratch = async (page) => {
  await page.locator(".aby-sc__ghost").first().click().catch(() => {});
  await page.waitForTimeout(1200);
};

const show = (only) => `template=${SHOWCASE}&only=hero,${only}`;
const T = (name, only) => `template=${name}&only=hero,${only}`;
const MARKET = [
  { file: "01-everyday-abaya", tone: "#3d3833", desk: { query: "template=daily-black" }, phone: { query: "template=daily-black" } },
  { file: "02-fit-finder", tone: "#3d3833", desk: { query: show("fit-finder"), focus: "fit", act: height }, phone: { query: show("fit-finder"), focus: "fit", act: height } },
  { file: "03-complete-the-look", tone: "#3d3833", desk: { query: show("complete-look"), focus: "look" }, phone: { query: show("complete-look"), focus: "look" } },
  { file: "04-reviews-by-height", tone: "#3d3833", desk: { query: show("reviews"), focus: "reviews" }, phone: { query: show("reviews"), focus: "reviews" } },
  { file: "05-compare", tone: "#3d3833", desk: { query: show("compare-table,custom-fit"), focus: "why" }, phone: { query: show("compare-table"), focus: "why" } },
  { file: "06-tailoring", tone: "#5e7356", desk: { query: T("embroidered-occasion", "custom-fit,delivery-eta"), focus: "tailor" }, phone: { query: T("embroidered-occasion", "custom-fit"), focus: "tailor" } },
  { file: "07-delivery", tone: "#9b7b4a", desk: { query: T("eid-edit", "delivery-eta,fit-finder"), focus: "delivery" }, phone: { query: T("eid-edit", "delivery-eta"), focus: "delivery" } },
  { file: "08-occasion-edit", tone: "#3d3833", desk: { query: show("occasion-edit"), focus: "edit" }, phone: { query: show("occasion-edit"), focus: "edit" } },
  { file: "09-scratch-coupon", tone: "#3d3833", desk: { query: show("scratch-coupon,trust-strip"), focus: "gift" }, phone: { query: show("scratch-coupon"), focus: "gift", act: scratch } },
  { file: "10-how-we-make-it", tone: "#5e7356", desk: { query: T("embroidered-occasion", "trust-strip,reviews"), focus: "trust" }, phone: { query: T("embroidered-occasion", "trust-strip"), focus: "trust" } },
];

/** A laptop and a phone on a soft background in the template's color; no words, no logos. */
function mockup(desk, phone, tone, dark) {
  const bg = dark
    ? `radial-gradient(70% 80% at 85% 10%, color-mix(in srgb, ${tone} 35%, #14110d), transparent 70%), radial-gradient(60% 70% at 10% 95%, color-mix(in srgb, ${tone} 22%, #14110d), transparent 70%), #14110d`
    : `radial-gradient(70% 80% at 85% 10%, color-mix(in srgb, ${tone} 22%, #fff), transparent 70%), radial-gradient(60% 70% at 10% 95%, color-mix(in srgb, ${tone} 14%, #fff), transparent 70%), #f7f4f2`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1600px;height:1200px;overflow:hidden;background:${bg}}
.laptop{position:absolute;left:70px;top:150px;width:1130px}
.lid{background:#1b1b1d;border-radius:28px 28px 10px 10px;padding:22px 22px 26px;box-shadow:0 40px 80px -30px rgb(0 0 0/.45)}
.lid img{display:block;width:100%;border-radius:6px}
.deck{height:26px;margin:0 -60px;background:linear-gradient(#d9d9dd,#a9a9ae);border-radius:0 0 26px 26px;position:relative}
.deck::before{content:"";position:absolute;left:50%;top:0;width:180px;height:10px;margin-left:-90px;background:#8e8e93;border-radius:0 0 10px 10px}
.phone{position:absolute;right:90px;top:250px;width:330px;padding:14px;background:#111;border-radius:56px;box-shadow:0 40px 80px -24px rgb(0 0 0/.55),inset 0 0 0 2px #333}
.phone img{display:block;width:100%;border-radius:44px}
.phone::before{content:"";position:absolute;left:50%;top:26px;width:96px;height:28px;margin-left:-48px;background:#111;border-radius:20px;z-index:2}
</style></head><body>
<div class="laptop"><div class="lid"><img src="data:image/png;base64,${desk.toString("base64")}"></div><div class="deck"></div></div>
<div class="phone"><img src="data:image/png;base64,${phone.toString("base64")}"></div>
</body></html>`;
}

/** JPEG at the highest quality that stays under the byte limit. */
async function toJpeg(png, out, width, height, limit) {
  for (let quality = 88; quality >= 40; quality -= 4) {
    const buffer = await sharp(png).resize(width, height, { fit: "cover", position: "top" }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (!limit || buffer.length <= limit || quality <= 40) {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, buffer);
      console.log(`${out}  ${Math.round(buffer.length / 1024)} KB  q${quality}`);
      return;
    }
  }
}

const only = process.argv[2];
const pick = process.argv[3]?.split(",");
const browser = await chromium.launch();
if (!only || only === "market") {
  for (const spec of MARKET.filter((s) => !pick || pick.some((p) => s.file.startsWith(p)))) {
    const [desk, phone] = await Promise.all([shoot(browser, spec.desk), shoot(browser, { ...spec.phone, mobile: true })]);
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
    await page.setContent(mockup(desk, phone, spec.tone, spec.dark), { waitUntil: "load" });
    const png = await page.screenshot();
    await page.close();
    await toJpeg(png, path.join(OUT, "marketplace", `${spec.file}.jpg`), 1600, 1200, 200 * 1024);
  }
}
if (!only || only === "thumbs") {
  for (const name of ["daily-black", "embroidered-occasion", "eid-edit"]) {
    const png = await shoot(browser, { query: `template=${name}`, viewport: { width: 768, height: 1195 }, wait: 8000 });
    await toJpeg(png, path.join(OUT, "templates-thumbs", `${name}.jpg`), 768, 1195, 0);
  }
}
if (only === "help") {
  const sections = [["hero", ""], ["fit-finder", "fit"], ["complete-look", "look"], ["compare-table", "why"], ["custom-fit", "tailor"], ["delivery-eta", "delivery"],
    ["occasion-edit", "edit"], ["scratch-coupon", "gift"], ["trust-strip", "trust"], ["reviews", "reviews"], ["sticky-buy", ""]];
  const showBar = async (page) => {
    await page.evaluate(() => document.querySelector(".aby-sb")?.scrollIntoView({ block: "end" }));
    await page.waitForTimeout(800);
  };
  for (const [name, focus] of sections) {
    const query = name === "sticky-buy" ? `${show("reviews,sticky-buy")}&cards=1` : name === "hero" ? `template=${SHOWCASE}&only=hero` : show(name);
    const png = await shoot(browser, { query, focus: focus || undefined, mobile: true, act: name === "sticky-buy" ? showBar : name === "fit-finder" ? height : undefined });
    const out = path.join(OUT, "help", `${name}.jpg`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(png).resize(390).jpeg({ quality: 78, mozjpeg: true }).toFile(out);
    console.log(out);
  }
}
await browser.close();
