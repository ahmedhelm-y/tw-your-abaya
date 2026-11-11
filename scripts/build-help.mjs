// Builds marketplace/help.html, the bundle's documentation page, from twilight-bundle.json: every
// section's settings come from its fields, so the page never misses one. The words for each section,
// the start steps and the FAQ live in scripts/lib/help-content.mjs. Run after build-manifest:
//   node scripts/build-help.mjs
import fs from "node:fs";
import { templates } from "./lib/templates.mjs";
import content from "./lib/help-content.mjs";

const ROOT = process.cwd();
const bundle = JSON.parse(fs.readFileSync(`${ROOT}/twilight-bundle.json`, "utf8"));
const REPO = `https://github.com/ahmedhelm-y/${content.repo}`;
const SHOTS = `https://raw.githubusercontent.com/ahmedhelm-y/${content.repo}/store-assets/help/`;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const name = bundle.name?.ar || content.repo;
const title = (n) => bundle.components.find((c) => c.name === n)?.title || n;

const fieldRow = (f) => {
  if (f.type === "static") return f.format === "description" ? `<tr class="group"><th colspan="2">${f.value.replace(/<\/?strong>/g, "")}</th></tr>` : "";
  if (/^(l|d)_/.test(f.id) || f.id === "color_scheme") return "";
  if (f.type === "collection") {
    const subs = f.fields.filter((s) => s.label?.trim()).map((s) => `${esc(s.label)}${s.description ? ` <small>(${esc(s.description)})</small>` : ""}`).join("، ");
    return `<tr><td>${esc(f.item_label)} <small>(قائمة، حتى ${f.maxLength})</small></td><td>لكل ${esc(f.item_label)}: ${subs}</td></tr>`;
  }
  const options = f.options?.length ? ` الاختيارات: ${f.options.map((o) => esc(o.label)).join("، ")}.` : "";
  return `<tr><td>${esc(f.label)}</td><td>${esc(f.description || "")}${options}</td></tr>`;
};

const section = (c) => {
  const g = content.guide[c.name] || { what: "", how: [], tips: [] };
  const hasColors = c.fields.some((f) => f.id === "l_bg");
  return `<section class="comp" id="${c.name}">
  <h2>${esc(c.title)}</h2>
  <div class="comp__top">
    <img src="${SHOTS}${c.name}.jpg" alt="${esc(c.title)} على الجوال" loading="lazy" width="390" height="844">
    <div>
      <h3>إيه ده؟</h3><p>${esc(g.what)}</p>
      <h3>إزاي تستخدمه</h3><ol>${g.how.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      ${g.tips?.length ? `<h3>نصايح</h3><ul>${g.tips.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
    </div>
  </div>
  <details><summary>كل إعدادات القسم</summary>
    <table><tbody>${c.fields.map(fieldRow).join("")}${hasColors ? `<tr><td>ألوان الوضع الفاتح والداكن</td><td>خلفية القسم والبطاقات والعناوين والنصوص والأزرار. الفاضي بيتبع ألوان الصفحة.</td></tr><tr><td>وضع الألوان</td><td>حسب وضع الصفحة، أو فاتح دائماً، أو داكن دائماً.</td></tr>` : ""}</tbody></table>
  </details>
</section>`;
};

const blocks = content.blocks || [];
const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>دليل ${esc(name)}</title>
<meta name="description" content="دليل استخدام مجموعة عناصر ${esc(name)} لصفحات الهبوط في سلة: القوالب، وكل قسم وإعداداته، والأسئلة.">
<style>
:root { --bg: #fbf8f6; --card: #fff; --text: #3d3631; --title: #1a1714; --accent: ${content.accent}; --line: #ebe3dc; --soft: #f6f0ec; }
@media (prefers-color-scheme: dark) { :root { --bg: #141210; --card: #1f1b18; --text: #c9bfb4; --title: #f5efe8; --accent: ${content.accentDark || "#e8c48a"}; --line: #34302b; --soft: #26201d; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui, "Segoe UI", Tahoma, sans-serif; line-height: 1.85; }
main { max-width: 60rem; margin: 0 auto; padding: 2.5rem 16px 5rem; }
h1 { margin: 0 0 .25rem; color: var(--title); font-size: 2.25rem; line-height: 1.3; }
h2 { margin: 0 0 1rem; color: var(--title); font-size: 1.5rem; }
h3 { margin: 1rem 0 .25rem; color: var(--title); font-size: 1.0625rem; }
a { color: var(--accent); }
.lead { font-size: 1.0625rem; }
nav.toc { margin: 1.5rem 0 2.5rem; padding: 1rem 1.25rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--card); }
nav.toc ol { columns: 2; column-gap: 2rem; margin: .5rem 0 0; padding-inline-start: 1.25rem; }
@media (max-width: 640px) { nav.toc ol { columns: 1; } }
.block, .comp { margin: 0 0 2rem; padding: 1.5rem; border: 1px solid var(--line); border-radius: 1.25rem; background: var(--card); scroll-margin-top: 1rem; }
.comp__top { display: grid; gap: 1.5rem; }
@media (min-width: 760px) { .comp__top { grid-template-columns: 15rem 1fr; align-items: start; } }
.comp__top img { width: 100%; max-width: 15rem; height: auto; justify-self: center; border-radius: 1.25rem; border: 6px solid #1b1b1d; background: var(--soft); }
.comp__top h3:first-child { margin-top: 0; }
ol, ul { padding-inline-start: 1.25rem; margin: .25rem 0; }
details { margin-top: 1.25rem; }
summary { cursor: pointer; font-weight: 700; color: var(--title); }
table { width: 100%; margin-top: .75rem; border-collapse: collapse; font-size: .9375rem; }
td, th { padding: .5rem .625rem; border-bottom: 1px solid var(--line); vertical-align: top; text-align: start; }
td:first-child { width: 34%; font-weight: 600; color: var(--title); }
tr.group th { padding-top: 1rem; color: var(--accent); font-size: .875rem; }
small { opacity: .8; }
.tpl { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.tpl div { padding: 1rem; border-radius: 1rem; background: var(--soft); }
.tpl b { color: var(--title); }
code { padding: .1rem .35rem; border-radius: .375rem; background: var(--soft); font-size: .9em; }
.note { padding: .875rem 1rem; border-radius: .875rem; background: var(--soft); }
</style>
</head>
<body>
<main>
<h1>${esc(name)}</h1>
<p class="lead">${esc(content.lead)}</p>

<nav class="toc" aria-label="المحتويات"><b>المحتويات</b><ol>
  <li><a href="#start">البداية في ${content.start.length} خطوات</a></li>
  <li><a href="#templates">القوالب الثلاثة</a></li>
  <li><a href="#shared">إعدادات موجودة في كل قسم</a></li>
  ${blocks.map((b) => `<li><a href="#${b.id}">${esc(b.title)}</a></li>`).join("\n  ")}
  ${bundle.components.map((c) => `<li><a href="#${c.name}">${esc(c.title)}</a></li>`).join("\n  ")}
  <li><a href="#faq">أسئلة ومشاكل شائعة</a></li>
  <li><a href="#support">الدعم وسجل التحديثات</a></li>
</ol></nav>

<section class="block" id="start">
<h2>البداية في ${content.start.length} خطوات</h2>
<ol>${content.start.map((s) => `<li>${s}</li>`).join("\n  ")}</ol>
<p class="note">كل نص في الصفحة بالعربي والإنجليزي، وبيظهر حسب لغة العميل. الأقسام اللي تسيب نصوصها فاضية بتظهر بنص جاهز. وكل قسم بيشتغل لوحده، فتقدر تحطه في أي صفحة هبوط.</p>
</section>

<section class="block" id="templates">
<h2>القوالب الثلاثة</h2>
<p>كل قالب ليه هدف واحد، وفيه الأقسام اللي بتخدم الهدف ده بس. باقي الأقسام موجودة في المحرر وتقدر تضيفها لأي قالب.</p>
<div class="tpl">
${templates.map((t) => `<div><b>${esc(content.templates[t.name]?.[0] || t.name)}</b><p>${esc(content.templates[t.name]?.[1] || "")}</p><small>الأقسام: ${t.order.map((n) => esc(title(n))).join(" ← ")}</small></div>`).join("\n")}
</div>
</section>

<section class="block" id="shared">
<h2>إعدادات موجودة في كل قسم</h2>
<ul>
  <li><b>العنوان والوصف:</b> فوق القسم. لو سبتهم فاضيين بيختفوا.</li>
  <li><b>معرّف القسم:</b> كلمة إنجليزية بدون مسافات. الأزرار اللي بتنزل لقسم معيّن بتكتب المعرّف ده.</li>
  ${content.cta ? `<li><b>زرار الشراء المتكرر:</b> ${esc(content.cta)}</li>` : ""}
  <li><b>الألوان:</b> لكل قسم ألوان للوضع الفاتح والداكن. الفاضي بيتبع لون البراند من ${esc(title(content.themeFrom))}، ولو مفيش لون براند بيتبع ألوان متجرك.</li>
  <li><b>وضع الألوان:</b> القسم يتبع وضع الصفحة، أو يفضل فاتح أو داكن دائماً.</li>
</ul>
</section>

${blocks.map((b) => `<section class="block" id="${b.id}">\n<h2>${esc(b.title)}</h2>\n${b.html}\n</section>`).join("\n\n")}

${bundle.components.map(section).join("\n\n")}

<section class="block" id="faq">
<h2>أسئلة ومشاكل شائعة</h2>
${content.faq.map(([q, a]) => `<h3>${esc(q)}</h3>\n<p>${esc(a)}</p>`).join("\n")}
</section>

<section class="block" id="support">
<h2>الدعم وسجل التحديثات</h2>
<p>لأي سؤال أو مشكلة ابعت على <a href="mailto:${esc(bundle.author_email)}">${esc(bundle.author_email)}</a>، وبنرد خلال يومي عمل بالكتير.</p>
<p>كل التحديثات والإصلاحات مكتوبة في <a href="${REPO}/blob/${content.branch || "main"}/CHANGELOG.md">سجل التحديثات</a>.</p>
</section>
</main>
</body>
</html>
`;

fs.writeFileSync(`${ROOT}/marketplace/help.html`, html);
console.log("marketplace/help.html", Math.round(html.length / 1024), "KB,", bundle.components.length, "sections");
