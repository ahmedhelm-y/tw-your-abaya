// Order-by countdown and arrival date, in the store's own time zone (Saudi time by default).

export type EtaSettings = { cutoffHour: number; prepDays: number; shipDays: number; offDays: number[]; tzOffset: number };

const DAY = 86400000;

/** The clock as the store sees it: a Date whose UTC fields read as the store's local time. */
function storeClock(now: Date, tzOffset: number): Date {
  return new Date(now.getTime() + tzOffset * 3600000);
}

function isWorking(day: Date, offDays: number[]): boolean {
  return !offDays.includes(day.getUTCDay());
}

function startOfDay(day: Date): Date {
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
}

/** Moves forward to a working day (today counts), then adds the given number of working days. */
function addWorkingDays(from: Date, days: number, offDays: number[]): Date {
  let day = startOfDay(from);
  // A week with every day off would never end; such settings count every day as working
  const off = offDays.length >= 7 ? [] : offDays;
  while (!isWorking(day, off)) day = new Date(day.getTime() + DAY);
  for (let left = Math.max(0, Math.round(days)); left > 0; ) {
    day = new Date(day.getTime() + DAY);
    if (isWorking(day, off)) left--;
  }
  return day;
}

/**
 * The next order-by moment and the arrival day for an order placed now. Before the cut-off on a working
 * day the order is prepared from today; otherwise from the next working day.
 */
export function eta(now: Date, s: EtaSettings): { cutoff: Date; arrival: Date; msLeft: number } {
  const clock = storeClock(now, s.tzOffset);
  const off = s.offDays.length >= 7 ? [] : s.offDays;
  const hour = Math.min(Math.max(Math.round(s.cutoffHour), 0), 24);
  const todayCut = new Date(startOfDay(clock).getTime() + hour * 3600000);
  const startToday = isWorking(clock, off) && clock.getTime() < todayCut.getTime();
  const start = startToday ? startOfDay(clock) : addWorkingDays(new Date(startOfDay(clock).getTime() + DAY), 0, off);
  const cutoffLocal = new Date(start.getTime() + hour * 3600000);
  const arrival = addWorkingDays(start, s.prepDays + s.shipDays, off);
  const cutoff = new Date(cutoffLocal.getTime() - s.tzOffset * 3600000);
  return { cutoff, arrival, msLeft: Math.max(0, cutoff.getTime() - now.getTime()) };
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** "الخميس 30 أكتوبر" for a day from eta(), whose UTC fields hold the store's date. */
export function formatDay(day: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ar-SA-u-nu-latn-ca-gregory", {
      weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
    }).format(day);
  } catch {
    return day.toISOString().slice(0, 10);
  }
}
