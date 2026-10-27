/**
 * Fades a block in as it scrolls into view. Content is never hidden without JavaScript, observers or
 * motion, and a failsafe shows it after 2.5s even if the observer never fires.
 */
export function reveal(root: Element): void {
  if (typeof IntersectionObserver === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  root.classList.add("aby-reveal");
  const show = () => {
    root.classList.add("is-in");
    observer.disconnect();
    window.clearTimeout(failsafe);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) show();
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  const failsafe = window.setTimeout(show, 2500);
  observer.observe(root);
}

export const revealCss = `
.aby-reveal { transition: opacity .6s ease, transform .6s ease; }
.aby-reveal:not(.is-in) { opacity: 0; transform: translateY(16px); }
@media (prefers-reduced-motion: reduce) { .aby-reveal, .aby-reveal:not(.is-in) { opacity: 1; transform: none; transition: none; } }
`;
