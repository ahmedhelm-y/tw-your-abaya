// Renders template thumbnails (768×1195) and marketplace screenshots (1600×1200, under 200 KB) with headless
// Chrome from the harness. Run `pnpm build` and `node scripts/serve.mjs 5191` first, then: node scripts/capture.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.HARNESS || "http://127.0.0.1:5191/harness/landing.html";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "abaya-capture-"));

function shoot(query, width, height) {
  const png = path.join(TMP, `${Date.now()}-${Math.random().toString(36).slice(2)}.png`);
  const profile = fs.mkdtempSync(path.join(TMP, "profile-"));
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--user-data-dir=${profile}`, `--window-size=${width},${height}`, "--virtual-time-budget=25000",
    `--screenshot=${png}`, `${BASE}?clean=1&filler=0&layout=none&${query}`,
  ], { stdio: "ignore", timeout: 120000 });
  return png;
}

/** JPEG at the highest quality that stays under the byte limit. */
async function toJpeg(png, out, width, height, limit) {
  for (let quality = 86; quality >= 40; quality -= 6) {
    const buffer = await sharp(png).resize(width, height, { fit: "cover", position: "top" }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (!limit || buffer.length <= limit || quality <= 40) {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, buffer);
      console.log(`${out}  ${Math.round(buffer.length / 1024)} KB  q${quality}`);
      return;
    }
  }
}

const THUMBS = ["daily-black", "embroidered-occasion", "eid-edit"];
const MARKET = [
  ["01-daily-hero", "template=daily-black"],
  ["02-occasion-hero", "template=embroidered-occasion"],
  ["03-eid-edit", "template=eid-edit&only=page-header,hero,occasion-edit"],
  ["04-fit-finder", "template=daily-black&only=page-header,fit-finder"],
  ["05-reviews-fit", "template=daily-black&only=page-header,reviews"],
  ["06-look-and-delivery", "template=embroidered-occasion&only=page-header,complete-look,delivery-eta"],
];

const only = process.argv[2];
if (!only || only === "thumbs") {
  for (const name of THUMBS) await toJpeg(shoot(`template=${name}`, 768, 1195), `templates-thumbs/${name}.jpg`, 768, 1195, 0);
}
if (!only || only === "market") {
  for (const [file, query] of MARKET) await toJpeg(shoot(query, 1600, 1200), `marketplace/${file}.jpg`, 1600, 1200, 200 * 1024);
}
fs.rmSync(TMP, { recursive: true, force: true });
