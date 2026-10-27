// Source of truth for the section schemas in twilight-bundle.json and the templates/*.json files.
// Run from the repo root: node scripts/build-manifest.mjs
import fs from "node:fs";
import { templates } from "./lib/templates.mjs";
import { L, area, checks, collection, color, colorFields, drop, icon, image, line, num, products, sectionBase, sw, text, url, datetime } from "./lib/fields.mjs";

const ROOT = process.cwd();

const components = [
  {
    title: "رأس الصفحة",
    icon: "sicon-store",
    name: "page-header",
    key: "2291caf1-b361-42ad-96b4-6f475173aa54",
    image: "",
    props: { "min-height": "76px" },
    fields: [
      image("logo", "الشعار", "", "اتركه فارغاً لاستخدام شعار متجرك"),
      image("logo_dark", "شعار الوضع الداكن", "", "يظهر في الوضع الداكن وفوق الصور في الرأس الشفاف، وبدونه يظهر شعارك باللون الأبيض"),
      num("logo_height", "ارتفاع الشعار (px)", 56, 24, 140),
      drop("align", "مكان الشعار", [["center", "الوسط"], ["start", "البداية"]], "center"),
      line("hd-line-1"),
      sw("sticky", "تثبيت الرأس أعلى الصفحة عند التمرير", true),
      sw("transparent", "رأس شفاف فوق القسم الأول", false, "يظهر فوق صورة القسم الأول، وتظهر خلفيته عند التمرير"),
      sw("show_shadow", "خط سفلي للرأس", true),
      line("hd-line-2", "روابط أقسام الصفحة"),
      collection("nav", "رابط", [
        text("label", "النص", L("", "")),
        text("target", "معرّف القسم", "", { multilang: false, desc: "نفس المعرّف المكتوب في إعدادات القسم" }),
      ], [], 0, 6),
      line("hd-line-3", "زر الشراء"),
      sw("show_buy", "إظهار زر الشراء", true),
      text("buy_text", "نص الزر", L("اشتري الآن", "Buy now")),
      line("hd-line-4", "ألوان الصفحة"),
      color("brand_color", "لون البراند", "", "لون واحد تُبنى منه ألوان الصفحة كلها في الوضع الفاتح والداكن. اتركه فارغاً لاستخدام ألوان متجرك"),
      sw("show_mode_toggle", "زر التبديل بين الوضع الفاتح والداكن", true, "يتذكر اختيار العميل"),
      drop("default_mode", "الوضع الافتراضي للصفحة", [["light", "فاتح"], ["dark", "داكن"], ["system", "حسب جهاز الزائر"]], "light"),
      // Here the colors adjust the whole page palette, so the header has no scheme of its own
      ...colorFields({ scheme: false }),
    ],
  },
  {
    title: "القسم الافتتاحي",
    icon: "sicon-image",
    name: "hero",
    key: "9c3f0386-4b79-4830-b4db-7c23c1abf87c",
    image: "",
    props: { "min-height": "480px" },
    fields: [
      drop("layout", "الشكل", [["overlay", "النص فوق الصورة"], ["split", "النص بجانب الصورة"]], "overlay"),
      drop("media", "نوع الخلفية", [["image", "صورة"], ["video", "فيديو"]], "image"),
      image("image", "صورة الكمبيوتر", "", "المقاس المقترح 1920×1080. اتركها فارغة لاستخدام صورة المنتج"),
      image("image_mobile", "صورة الجوال", "", "المقاس المقترح 900×1200"),
      url("video_url", "رابط فيديو الكمبيوتر (MP4)", ""),
      url("video_url_mobile", "رابط فيديو الجوال (MP4)", ""),
      image("poster", "صورة تظهر قبل تشغيل الفيديو", ""),
      num("overlay", "قوة الطبقة الداكنة فوق الصورة (%)", 35, 0, 80, "في شكل النص فوق الصورة فقط"),
      num("height", "الارتفاع (% من الشاشة)", 85, 50, 100),
      drop("content_align", "مكان النص", [["center", "الوسط"], ["start", "البداية"]], "center"),
      line("hero-line-1", "النصوص والزر"),
      text("badge", "شارة صغيرة فوق العنوان", L("إصدار جديد", "New release")),
      text("title", "العنوان", L("عباية تليق بحضورك", "An abaya made for your presence"), { max: 120 }),
      area("subtitle", "الوصف", L("قصّة مريحة وخامة لا تشف، بطول يناسبك", "An easy cut in an opaque fabric, in the length that fits you")),
      text("buy_text", "نص الزر", L("اشتري الآن", "Buy now")),
      sw("show_price", "إظهار السعر بجانب الزر", true),
      products("product", "المنتج في صفحات العروض والمعاينة", "صفحة المنتج تعرض منتجها تلقائياً"),
      sectionBase().find((f) => f.id === "section_id"),
      ...colorFields(),
    ],
  },
  {
    title: "مستشار الطول والمقاس",
    icon: "sicon-ruler",
    name: "fit-finder",
    key: "9ee18450-20ac-4437-b5f1-d60ebfb6d964",
    image: "",
    props: { "min-height": "420px" },
    fields: [
      ...sectionBase(L("اختاري مقاسك وطولك", "Pick your size and length"), L("اكتبي طولك ونختار لك طول العباية المناسب", "Type your height and we'll pick the right abaya length"), "fit"),
      products("product", "العباية في صفحات العروض والمعاينة", "صفحة المنتج تعرض منتجها تلقائياً"),
      line("ff-line-1", "جدول الطول"),
      text("advisor_title", "عنوان المستشار", L("اعرفي طولك المناسب", "Find your length")),
      collection("lengths", "طول", [
        text("length", "طول العباية", "", { multilang: false, desc: "نفس الرقم المكتوب في خيار الطول بالمنتج، مثل 56" }),
        num("min", "من طول (سم)", 150, 100, 220),
        num("max", "إلى طول (سم)", 155, 100, 220),
      ], [
        { length: "52", min: 140, max: 152 }, { length: "54", min: 153, max: 158 }, { length: "56", min: 159, max: 164 },
        { length: "58", min: 165, max: 170 }, { length: "60", min: 171, max: 176 }, { length: "62", min: 177, max: 190 },
      ], 0, 10),
      sw("show_heels", "خيار \"هلبسها مع كعب\" (يزود طول واحد)", true),
      image("size_chart", "صورة جدول المقاسات (اختياري)", "", "تظهر في نافذة عند الضغط على \"جدول المقاسات\""),
      line("ff-line-2", "الكمية المتبقية"),
      num("stock_threshold", "اعرض \"باقي X قطع\" لما الكمية تقل عن", 5, 1, 50, "يظهر الرقم الحقيقي فقط لو فعّلت إظهار الكمية المتبقية في المنتج"),
      text("stock_text", "شارة بديلة", L("", ""), { desc: "مثل \"كمية محدودة\". تظهر لو المتجر مش بيعرض الكمية" }),
      text("buy_text", "نص الزر", L("اشتري الآن", "Buy now")),
      ...colorFields(),
    ],
  },
  {
    title: "أكملي اللوك",
    icon: "sicon-clothes-hanger",
    name: "complete-look",
    key: "b746fced-cd7f-41e3-a998-adbfe4fb6c97",
    image: "",
    props: { "min-height": "420px" },
    fields: [
      ...sectionBase(L("أكملي اللوك", "Complete the look"), L("الطرحة والفستان اللي تحت العباية، كلهم للسلة بضغطة", "The sheila and the under-dress, all to the cart in one tap"), "look"),
      sw("include_main", "العباية نفسها أول قطعة في اللوك", true, "في صفحة المنتج تظهر عباية الصفحة، وفي صفحات العروض المنتج المختار تحت"),
      products("main_product", "العباية في صفحات العروض والمعاينة", "صفحة المنتج تعرض منتجها تلقائياً"),
      products("products", "قطع اللوك", "حتى 5 قطع: طرحة، فستان تحت العباية، شنطة...", true),
      sw("preselect", "كل القطع مختارة من البداية", false, "العباية نفسها مختارة دائماً"),
      text("offer_text", "نص العرض", L("", ""), { desc: "مثل خصم 10% عند شراء 3. فعّل الخصم نفسه من العروض الخاصة في سلة" }),
      text("buy_text", "نص الزر", L("أضيفي اللوك للسلة", "Add the look")),
      ...colorFields(),
    ],
  },
  {
    title: "إحنا ولا غيرنا",
    icon: "sicon-list",
    name: "compare-table",
    key: "f4560232-b312-46c2-8ce2-8fad103c8786",
    image: "",
    props: { "min-height": "320px" },
    fields: [
      ...sectionBase(L("ليه تختاري عبايتنا؟", "Why choose our abaya?"), L("", ""), "why"),
      text("us_label", "عنوان عمودنا", L("عندنا", "With us")),
      text("them_label", "عنوان العمود التاني", L("عند غيرنا", "Elsewhere")),
      collection("rows", "سطر", [text("us", "ميزتنا", L("", "")), text("them", "عند غيرنا", L("", ""))], [], 0, 10),
      ...colorFields(),
    ],
  },
  {
    title: "التفصيل على مقاسك",
    icon: "sicon-edit",
    name: "custom-fit",
    key: "2ce8edaf-8ede-4724-b79c-24e7b07504e0",
    image: "",
    props: { "min-height": "360px" },
    fields: [
      ...sectionBase(L("نفصّلها على مقاسك", "Tailored to your size"), L("اكتبي مقاساتك ونفصّل العباية عليها", "Enter your measurements and we'll tailor the abaya"), "tailor"),
      text("free_text", "شارة", L("التفصيل مجاني", "Free tailoring")),
      image("image", "صورة جنب الفورم (مثل رسمة المقاسات)", ""),
      collection("fields", "مقاس", [
        text("label", "اسم المقاس", L("", "")),
        text("unit", "الوحدة", L("سم", "cm")),
        text("hint", "توضيح صغير", L("", "")),
      ], [], 0, 8),
      text("notes_placeholder", "النص داخل خانة الملاحظات", L("", "")),
      line("cf-line-1", "إرسال المقاسات"),
      drop("send_via", "طريقة الإرسال", [["cart", "مع الطلب في السلة (لو المنتج يسمح بالملاحظات)"], ["whatsapp", "على الواتساب فقط"]], "cart",
        "مع الطلب يحتاج تفعيل \"إضافة ملاحظة\" على المنتج في سلة، ومنتج بدون خيارات إجبارية"),
      products("product", "المنتج", "صفحة المنتج تستخدم منتجها تلقائياً"),
      text("whatsapp", "رقم الواتساب", "", { multilang: false, placeholder: "9665XXXXXXXX" }),
      text("buy_text", "نص الزر", L("أضيفي للسلة بمقاساتي", "Add to cart with my measurements")),
      ...colorFields(),
    ],
  },
  {
    title: "هتوصلك امتى",
    icon: "sicon-time",
    name: "delivery-eta",
    key: "569bd0da-3d4a-4c1d-a15a-d0a1b5343821",
    image: "",
    props: { "min-height": "280px" },
    fields: [
      ...sectionBase(L("هتوصلك امتى؟", "When will it arrive?"), L("", ""), "delivery"),
      text("lead", "النص فوق العداد", L("اطلبي خلال", "Order within")),
      num("cutoff_hour", "آخر ساعة للطلب في اليوم (0 – 24)", 13, 0, 24, "بتوقيت المتجر. بعدها يبدأ التجهيز من يوم العمل التالي"),
      num("prep_days", "أيام التجهيز", 1, 0, 30),
      num("ship_days", "أيام الشحن", 2, 0, 30),
      checks("off_days", "أيام الإجازة", [["0", "الأحد"], ["1", "الاثنين"], ["2", "الثلاثاء"], ["3", "الأربعاء"], ["4", "الخميس"], ["5", "الجمعة"], ["6", "السبت"]], ["5"]),
      num("tz_offset", "فرق التوقيت عن UTC", 3, -12, 14, "السعودية +3"),
      collection("times", "مدة", [text("label", "النوع", L("", "")), text("value", "المدة", L("", ""))], [], 0, 4),
      collection("faqs", "سؤال", [text("q", "السؤال", L("", "")), area("a", "الإجابة", L("", ""))], [], 0, 6),
      ...colorFields(),
    ],
  },
  {
    title: "شريط الثقة",
    icon: "sicon-shield-check",
    name: "trust-strip",
    key: "01bf40c3-3a1d-402d-8351-9d6a6bd19cc0",
    image: "",
    props: { "min-height": "120px" },
    fields: [
      ...sectionBase(L("", ""), L("", ""), "trust"),
      drop("layout", "الشكل", [["compact", "شريط صغير"], ["full", "قسم كامل"]], "compact", "الشريط الصغير يخفي العنوان، ويظهر لو مفيش خطوات"),
      collection("badges", "ميزة", [icon("icon", "الأيقونة", "sicon-check"), text("text", "النص", L("", ""))], [], 0, 6),
      line("ts-line-1", "إزاي بنعملها (اختياري)"),
      collection("steps", "خطوة", [text("title", "العنوان", L("", "")), area("text", "الوصف", L("", "")), image("image", "صورة", "")], [], 0, 4),
      ...colorFields(),
    ],
  },
  {
    title: "تشكيلة المناسبة",
    icon: "sicon-gift",
    name: "occasion-edit",
    key: "0cd97f0d-327f-420f-b101-53c72ceddc92",
    image: "",
    props: { "min-height": "480px" },
    fields: [
      ...sectionBase(L("تشكيلة العيد", "The Eid edit"), L("اختاري لونك، وكل عباية بمقاسها للسلة على طول", "Pick your color, and each abaya goes to the cart in your size"), "edit"),
      products("products", "عبايات التشكيلة", "حتى 12 منتج. الألوان بتتجمع من خيار اللون في المنتجات", true),
      num("columns", "عدد الأعمدة على الكمبيوتر", 3, 2, 4),
      text("buy_text", "نص الزر", L("أضيفي للسلة", "Add to cart")),
      ...colorFields(),
    ],
  },
  {
    title: "آراء العملاء",
    icon: "sicon-chat-bubbles",
    name: "reviews",
    key: "e03b5992-2340-46fb-8094-0f1ee0693d03",
    image: "",
    props: { "min-height": "420px" },
    fields: [
      ...sectionBase(L("وش قالوا عنها", "What they said"), L("آراء بطول كل عميلة ومقاسها", "Reviews with each buyer's height and size"), "reviews"),
      sw("show_summary", "إظهار ملخص التقييمات", true),
      area("summary_text", "ملخص آراء العملاء", L("", "")),
      collection("questions", "سؤال", [text("q", "السؤال", L("", "")), area("a", "الإجابة", L("", ""))], [], 0, 6),
      line("rv-line-1", "الآراء: نص، أو تسجيل صوتي، أو صور، أو كلها معاً"),
      collection("items", "رأي", [
        text("name", "اسم العميل", L("", "")),
        text("city", "المدينة", L("", "")),
        text("place", "أين قيل الرأي", L("", ""), { desc: "مثل في العرس أو في الدوام" }),
        num("rate", "التقييم من 5", 5, 1, 5),
        area("text", "الرأي", L("", "")),
        url("audio_url", "رابط التسجيل الصوتي (MP3)", "", "ارفع الملف في أي مكان وضع رابطه هنا. يفضّل أقل من 30 ثانية"),
        image("image_1", "صورة 1", ""),
        image("image_2", "صورة 2", ""),
        image("image_3", "صورة 3", ""),
        image("avatar", "صورة العميل", "", "اختياري، تظهر الأحرف الأولى عند عدم رفع صورة"),
        sw("verified", "عميل مؤكد", false, "فعّله فقط لعميل اشترى المنتج فعلاً"),
        line("rv-item-line", "المقاس"),
        num("height", "طول العميلة (سم)", 0, 0, 220, "اتركه 0 لإخفائه"),
        text("size", "المقاس والطول اللي أخدته", L("", ""), { desc: "مثل M / 56" }),
        drop("fit", "المقاس جه", [["", "لا يظهر"], ["true", "مظبوط"], ["small", "صغير"], ["large", "واسع"]], ""),
      ], [
        // Filled per template
      ], 0, 12),
      ...colorFields(),
    ],
  },
  {
    title: "كارت الخصم",
    icon: "sicon-discount-coupon",
    name: "scratch-coupon",
    key: "61b31b21-0f0a-403a-9910-60c5ce870ee1",
    image: "",
    props: { "min-height": "320px" },
    fields: [
      ...sectionBase(L("هدية لك", "A gift for you"), L("اكشطي الكارت واكتشفي خصمك", "Scratch the card to find your discount"), "gift"),
      text("code", "كود الخصم", "", { multilang: false, desc: "أنشئ الكوبون أولاً من التسويق > كوبونات التخفيض في سلة" }),
      text("discount_text", "نص العرض", L("خصم 15% على طلبك", "15% off your order")),
      text("hint", "نص فوق الغطاء", L("اكشطي هنا لتكشفي الكود", "Scratch here to reveal the code")),
      color("cover_color", "لون الغطاء", "", "اتركه فارغاً لاستخدام لون الأزرار"),
      image("cover_image", "صورة الغطاء (اختياري)", ""),
      num("reveal_percent", "نسبة الكشط لإظهار الكود (%)", 50, 30, 80),
      datetime("expires", "ينتهي في (اختياري)", "", "بعد هذا الوقت يختفي القسم من الصفحة"),
      text("buy_text", "نص الزر", L("اشتري الآن", "Buy now")),
      ...colorFields(),
    ],
  },
  {
    title: "تذييل الصفحة",
    icon: "sicon-window-layout",
    name: "page-footer",
    key: "c04cbf23-2613-43cf-bc3b-9a893889ca45",
    image: "",
    props: { "min-height": "160px" },
    fields: [
      image("logo", "الشعار", "", "اتركه فارغاً لاستخدام شعار متجرك"),
      image("logo_dark", "شعار الوضع الداكن", ""),
      area("about", "نبذة قصيرة", L("", "")),
      line("ft-line-1", "التواصل"),
      text("phone", "رقم الجوال", "", { multilang: false, placeholder: "+966500000000" }),
      text("whatsapp", "رقم واتساب", "", { multilang: false, placeholder: "966500000000" }),
      text("email", "البريد الإلكتروني", "", { multilang: false }),
      collection("social", "حساب", [icon("icon", "الأيقونة", "sicon-instagram"), url("url", "الرابط", "")], [], 0, 6),
      line("ft-line-2"),
      sw("show_payments", "إظهار وسائل الدفع المفعلة في المتجر", true),
      text("copyright", "نص الحقوق", L("© {year} {store}", "© {year} {store}"), { desc: "{year} تصبح السنة الحالية و{store} اسم متجرك" }),
      ...colorFields(),
    ],
  },
  {
    title: "شريط الشراء الثابت",
    icon: "sicon-shopping-bag",
    name: "sticky-buy",
    key: "c848b9df-ce0f-4abe-a36d-11c68e7aeb96",
    image: "",
    props: { "min-height": "64px" },
    fields: [
      line("sb-line-1", "يظهر أسفل الشاشة بعد تجاوز القسم الأول، ويختفي عند ظهور الشراء السريع"),
      drop("show_on", "يظهر على", [["both", "الجوال والكمبيوتر"], ["mobile", "الجوال فقط"], ["desktop", "الكمبيوتر فقط"]], "both"),
      sw("show_price", "إظهار اسم المنتج والسعر", true),
      sw("show_quantity", "إظهار الكمية", true, "الكمية المختارة تنتقل للشراء السريع"),
      text("buy_text", "نص الزر", L("اشتري الآن", "Buy now"), { desc: "في صفحة العروض يظهر نص الزر الرئيسي للصفحة إذا تركته فارغاً" }),
      ...colorFields(),
    ],
  },
];


const applyValues = (component, values = {}) => {
  const copy = structuredClone(component);
  for (const field of copy.fields || []) {
    if (!(field.id in values)) continue;
    field.value = values[field.id];
    if (field.format === "dropdown-list" || field.format === "switch") field.selected = values[field.id];
  }
  return copy;
};

const file = `${ROOT}/twilight-bundle.json`;
const bundle = JSON.parse(fs.readFileSync(file, "utf8"));
bundle.components = components;
const previous = new Map((bundle.templates || []).map((t) => [t.path, t]));
bundle.templates = templates.map((t) => ({
  id: t.id,
  path: `templates.${t.name}`,
  category_id: t.category_id,
  primary_color: "",
  // RESET_THUMBS=1 points back at the local thumbnails so tw-preview uploads the new ones
  thumbnail: (!process.env.RESET_THUMBS && previous.get(`templates.${t.name}`)?.thumbnail) || `templates-thumbs/${t.name}.jpg`,
  is_default: t.is_default,
  ...(previous.get(`templates.${t.name}`)?.public_preview_url ? { public_preview_url: previous.get(`templates.${t.name}`).public_preview_url } : {}),
}));
fs.writeFileSync(file, JSON.stringify(bundle, null, 4) + "\n");

if (templates.length) fs.mkdirSync(`${ROOT}/templates`, { recursive: true });
for (const t of templates) {
  const unknown = t.order.filter((name) => !components.some((c) => c.name === name));
  if (unknown.length) throw new Error(`unknown component in ${t.name}: ${unknown.join(", ")}`);
  const list = t.order.map((name) => applyValues(components.find((c) => c.name === name), t.values[name]));
  fs.writeFileSync(`${ROOT}/templates/${t.name}.json`, JSON.stringify({ id: t.id, components: list }, null, 2) + "\n");
}
console.log("components:", components.map((c) => c.name).join(", ") || "(none)");
console.log("templates:", templates.map((t) => `${t.name}(${t.order.length})`).join(", ") || "(none)");
