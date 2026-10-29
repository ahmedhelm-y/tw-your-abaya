// Template content for the three Your abaya templates. Products come from the preview store (1616473);
// the texts are written for this bundle.
import { L, opt } from "./fields.mjs";

// Sample logo for the template previews; the merchant swaps it for their own, or clears it to use the store logo
const LOGO = "https://raw.githubusercontent.com/ahmedhelm-y/tw-your-abaya/store-assets/logo/";
const logo = { logo: `${LOGO}logo.png`, logo_dark: `${LOGO}logo-dark.png` };
const sel = (value, label) => [opt(value, label)];
const product = (id, name) => [{ label: name, value: id, key: String(id) }];
const rows = (prefix, list) => list.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [`${prefix}.${k}`, v])));
const review = (name, city, rate, text, height, size, fit) => ({
  name, city, place: L("", ""), rate, text, audio_url: "", image_1: "", image_2: "", image_3: "", avatar: "", verified: false, height, size: L(size, size), fit: sel(fit, fit),
});

export const ORDER = ["page-header", "hero", "trust-strip", "fit-finder", "complete-look", "reviews", "compare-table", "custom-fit", "occasion-edit",
  "delivery-eta", "scratch-coupon", "page-footer", "sticky-buy"];

const compare = rows("rows", [
  { us: L("التفصيل على مقاسك مجاناً", "Free tailoring to your size"), them: L("التفصيل برسوم إضافية", "Tailoring costs extra") },
  { us: L("خامة لا تشف ولا تكرمش", "Opaque, crease-resistant fabric"), them: L("خامة خفيفة تبان وتتكرمش", "Thin fabric that shows and creases") },
  { us: L("6 أطوال من 52 لـ 62", "Six lengths from 52 to 62"), them: L("طول واحد للكل", "One length for everyone") },
  { us: L("استبدال سهل خلال 7 أيام", "Easy exchange within 7 days"), them: L("مفيش استبدال للمفصّل", "No exchange on tailored pieces") },
  { us: L("ترد عليك وحدة منّا على الواتساب", "One of us answers you on WhatsApp"), them: L("ردود آلية بس", "Automated replies only") },
]);

const badges = rows("badges", [
  { icon: "sicon-ruler", text: L("6 أطوال تناسب كل الطول", "Six lengths for every height") },
  { icon: "sicon-pencil-ruler", text: L("تفصيل مجاني على مقاسك", "Free tailoring to your size") },
  { icon: "sicon-shipping", text: L("شحن لكل مدن المملكة", "Shipping across the Kingdom") },
  { icon: "sicon-rotate", text: L("استبدال سهل", "Easy exchange") },
]);

const delivery = {
  times: rows("times", [
    { label: L("الجاهزة", "Ready to wear"), value: L("تُشحن خلال يوم", "Ships in a day") },
    { label: L("المفصّلة على مقاسك", "Tailored to your size"), value: L("من 7 لـ 10 أيام", "7 to 10 days") },
  ]),
  faqs: rows("faqs", [
    { q: L("لو الطول ما ناسبني؟", "What if the length doesn't fit?"), a: L("تقدرين تستبدلينها بطول ثاني خلال 7 أيام من الاستلام، بشرط ما تكون اتلبست أو اتغسلت.", "You can exchange it for another length within 7 days of delivery, as long as it was not worn or washed.") },
    { q: L("كيف أغسل العباية؟", "How do I wash the abaya?"), a: L("غسيل بارد على دورة خفيفة، أو تنظيف جاف. كوي على حرارة منخفضة من الداخل.", "Cold gentle wash or dry clean. Iron on low heat, inside out.") },
    { q: L("هل الطرحة معاها؟", "Does it come with a sheila?"), a: L("الطرحة تنباع لوحدها، وتقدرين تضيفينها من قسم أكملي اللوك.", "The sheila is sold on its own; add it from the complete the look section.") },
  ]),
};

const tailoring = rows("fields", [
  { label: L("طولك", "Your height"), unit: L("سم", "cm"), hint: L("", "") },
  { label: L("الصدر", "Chest"), unit: L("سم", "cm"), hint: L("حول أعرض جزء", "Around the fullest part") },
  { label: L("الكتف", "Shoulder"), unit: L("سم", "cm"), hint: L("من طرف الكتف للطرف", "Edge to edge") },
  { label: L("طول الكم", "Sleeve length"), unit: L("سم", "cm"), hint: L("من الكتف للرسغ", "Shoulder to wrist") },
]);

const coupon = { code: "", discount_text: L("خصم 10% على أول عباية", "10% off your first abaya") };
const footer = (about) => ({ about, show_payments: true });

export const templates = [
  {
    name: "daily-black",
    id: "594627ba-503a-40f4-bb58-515e4d648611",
    // الأزياء
    category_id: "814202285",
    is_default: true,
    order: ORDER,
    values: {
      "page-header": { ...logo, brand_color: "#3d3833", default_mode: sel("light", "فاتح"), sticky: true,
        nav: rows("nav", [{ label: L("المقاس", "Fit"), target: "fit" }, { label: L("الآراء", "Reviews"), target: "reviews" }, { label: L("التوصيل", "Delivery"), target: "delivery" }]) },
      hero: { layout: sel("split", "النص بجانب الصورة"), badge: L("الأكثر طلباً", "Most ordered"),
        title: L("عباية كل يوم", "The everyday abaya"), subtitle: L("سوداء بقصّة مريحة وطبقات ناعمة، تمشي معك من الدوام للمشوار", "Black, easy cut and soft tiers, from work to errands"),
        product: product(1627464171, "عباية كل يوم") },
      "trust-strip": { badges },
      "fit-finder": { product: product(1627464171, "عباية كل يوم"), stock_text: L("كمية محدودة", "Limited stock") },
      "complete-look": { main_product: product(1627464171, "عباية كل يوم"),
        products: [...product(1769567998, "بلوزة تحت العباية"), ...product(1303857404, "جاكيت خفيف")] },
      reviews: { items: rows("items", [
        review(L("نوف", "Nouf"), L("الرياض", "Riyadh"), 5, L("طولي 158 وأخدت 54، جات على الكعب بالضبط. الخامة ثقيلة ما تبان", "I'm 158 and took 54, it hits right at the heel. Heavy fabric, nothing shows"), 158, "M / 54", "true"),
        review(L("هيا", "Haya"), L("جدة", "Jeddah"), 5, L("ألبسها كل يوم للدوام، ما تتكرمش في السيارة", "I wear it to work daily, no creases from the car"), 166, "L / 58", "true"),
        review(L("العنود", "Alanoud"), L("الخبر", "Khobar"), 4, L("حلوة بس الكتف واسع شوي، المرة الجاية بطلب تفصيل", "Lovely, but the shoulder is a bit wide; next time I'll get it tailored"), 152, "S / 52", "large"),
      ]) },
      "compare-table": { rows: compare },
      "custom-fit": { fields: tailoring, product: product(1627464171, "عباية كل يوم") },
      "occasion-edit": { title: L("نفس القصّة بألوان ثانية", "The same cut in other colors"),
        products: [...product(1627464171, "عباية كل يوم"), ...product(1728697337, "عباية الحزام"), ...product(994547199, "عباية الطبقات")] },
      "delivery-eta": delivery,
      "scratch-coupon": coupon,
      "page-footer": footer(L("عبايات يومية بقصّات مريحة وأطوال تناسبك", "Everyday abayas in easy cuts and lengths that fit you")),
    },
  },
  {
    name: "embroidered-occasion",
    id: "a4c8701f-7fa0-4fc5-8558-61ad0e5a80dc",
    category_id: "814202285",
    is_default: false,
    order: ORDER,
    values: {
      "page-header": { ...logo, brand_color: "#5e7356", default_mode: sel("light", "فاتح"), sticky: true,
        nav: rows("nav", [{ label: L("المقاس", "Fit"), target: "fit" }, { label: L("التفصيل", "Tailoring"), target: "tailor" }, { label: L("الآراء", "Reviews"), target: "reviews" }]) },
      hero: { layout: sel("split", "النص بجانب الصورة"), badge: L("إصدار المناسبات", "Occasion edition"),
        title: L("تطريز يحكي ذوقك", "Embroidery that speaks your taste"), subtitle: L("أكمام مطرّزة يدوياً على قماش منسدل، لعزايم العيد والزواجات", "Hand-embroidered sleeves on a flowing fabric, for Eid gatherings and weddings"),
        product: product(45289979, "عباية مطرزة") },
      "trust-strip": { badges, layout: sel("full", "قسم كامل"), title: L("كيف نشتغل عليها", "How we make it"),
        steps: rows("steps", [
          { title: L("نختار القماش", "We pick the fabric"), text: L("قماش منسدل لا يشف، نجرّبه قبل القص", "A flowing, opaque fabric we test before cutting"), image: "" },
          { title: L("نطرّز يدوياً", "We embroider by hand"), text: L("كل كم ياخذ يوم شغل كامل", "Each sleeve takes a full day of work"), image: "" },
          { title: L("نفصّل على مقاسك", "We tailor to your size"), text: L("لو كتبتي مقاساتك، نعدّل عليها", "If you share your measurements, we adjust to them"), image: "" },
          { title: L("نراجع ونغلّف", "We check and wrap"), text: L("مراجعة لكل غرزة وتغليف هدية", "Every stitch checked, gift wrapped"), image: "" },
        ]) },
      "fit-finder": { product: product(45289979, "عباية مطرزة"), title: L("اختاري مقاسك وطولك", "Pick your size and length") },
      "complete-look": { main_product: product(45289979, "عباية مطرزة"), title: L("كمّلي إطلالة المناسبة", "Complete the occasion look"),
        products: [...product(2052836592, "بلوزة ناعمة"), ...product(1303857404, "جاكيت مطبّع")] },
      reviews: { title: L("لبسوها في مناسباتهم", "Worn at their occasions"), items: rows("items", [
        review(L("ريم", "Reem"), L("الرياض", "Riyadh"), 5, L("لبستها في زواج أختي والكل سألني عنها. التطريز أحلى من الصور", "Wore it at my sister's wedding and everyone asked. The embroidery beats the photos"), 163, "M / 56", "true"),
        review(L("لمى", "Lama"), L("المدينة", "Madinah"), 5, L("فصّلتها على مقاسي ووصلت في 8 أيام، مضبوطة", "Tailored to my size and arrived in 8 days, perfect"), 170, "L / 58", "true"),
        review(L("جود", "Joud"), L("أبها", "Abha"), 4, L("الأكمام شوي قصيرة علي، بس الجودة ممتازة", "Sleeves a little short on me, but excellent quality"), 175, "L / 60", "small"),
      ]) },
      "compare-table": { rows: compare },
      "custom-fit": { fields: tailoring, product: product(45289979, "عباية مطرزة") },
      "occasion-edit": { title: L("تشكيلة المناسبات", "The occasion edit"), columns: 4,
        products: [...product(45289979, "عباية مطرزة"), ...product(530339837, "عباية الأكمام المنفوخة"), ...product(388236010, "عباية الكشكش"), ...product(819393274, "عباية الورد")] },
      "delivery-eta": { ...delivery, prep_days: 2 },
      "scratch-coupon": coupon,
      "page-footer": footer(L("عبايات مطرّزة للمناسبات، تُفصّل على مقاسك", "Embroidered occasion abayas, tailored to your size")),
    },
  },
  {
    name: "eid-edit",
    id: "3214ec38-7234-4d56-98a8-308d185c9b79",
    category_id: "814202285",
    is_default: false,
    order: ["page-header", "hero", "occasion-edit", "delivery-eta", "trust-strip", "fit-finder", "complete-look", "reviews", "compare-table",
      "custom-fit", "scratch-coupon", "page-footer", "sticky-buy"],
    values: {
      "page-header": { ...logo, brand_color: "#9b7b4a", default_mode: sel("light", "فاتح"), sticky: true,
        nav: rows("nav", [{ label: L("التشكيلة", "The edit"), target: "edit" }, { label: L("التوصيل", "Delivery"), target: "delivery" }, { label: L("الآراء", "Reviews"), target: "reviews" }]) },
      hero: { layout: sel("split", "النص بجانب الصورة"), badge: L("تشكيلة العيد", "The Eid edit"),
        title: L("عيدك بعباية جديدة", "A new abaya for your Eid"), subtitle: L("ألوان فاتحة وكسرات ناعمة، وتوصلك قبل العيد", "Light colors and soft pleats, delivered before Eid"),
        product: product(1802683624, "عباية الكسرات") },
      "occasion-edit": { title: L("اختاري عباية العيد", "Pick your Eid abaya"),
        products: [...product(1802683624, "عباية الكسرات"), ...product(1728697337, "عباية الحزام"), ...product(1627464171, "عباية الطبقات"), ...product(994547199, "عباية واسعة"), ...product(819393274, "عباية الورد"), ...product(530339837, "عباية الأكمام المنفوخة")] },
      "delivery-eta": { ...delivery, title: L("توصلك قبل العيد", "Arrives before Eid") },
      "trust-strip": { badges },
      "fit-finder": { product: product(1802683624, "عباية الكسرات") },
      "complete-look": { main_product: product(1802683624, "عباية الكسرات"), products: [...product(1769567998, "بلوزة بيضاء"), ...product(2052836592, "بلوزة ناعمة")] },
      reviews: { items: rows("items", [
        review(L("سارة", "Sara"), L("الدمام", "Dammam"), 5, L("طلبتها قبل العيد بأسبوع ووصلت في 3 أيام", "Ordered a week before Eid and it arrived in 3 days"), 160, "M / 56", "true"),
        review(L("دانة", "Dana"), L("الرياض", "Riyadh"), 5, L("اللون البيج يجنن، والكسرات ما تروح بعد الغسيل", "The beige is gorgeous and the pleats hold after washing"), 155, "S / 54", "true"),
        review(L("مها", "Maha"), L("الطائف", "Taif"), 4, L("مقاسها جا واسع شوي، خذي مقاس أصغر", "It runs a bit large, size down"), 168, "L / 58", "large"),
      ]) },
      "compare-table": { rows: compare },
      "custom-fit": { fields: tailoring, product: product(1802683624, "عباية الكسرات") },
      "scratch-coupon": { ...coupon, discount_text: L("خصم العيد 15%", "15% off for Eid") },
      "page-footer": footer(L("تشكيلات عبايات للعيد والمناسبات", "Abaya edits for Eid and occasions")),
    },
  },
];
