/**
 * "Add to basket" ka chhota jadoo: product ki tasveer ek arc mein basket button tak udti hai aur
 * basket uchhalta hai. Sirf dikhawa — DOM clone, Web Animations API; reduced motion par kuch nahi.
 * Basket buttons par `data-basket-target` hota hai; pehla dikhne wala target chuna jata hai.
 */
export function flyToBasket(source: Element | null | undefined): void {
  if (typeof window === "undefined" || !source) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const image = source.querySelector("img") ?? source;
  const target = Array.from(document.querySelectorAll<HTMLElement>("[data-basket-target]")).find((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
  });
  if (!target || typeof image.animate !== "function") return;

  const from = image.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = Math.min(from.width, from.height, 160);
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const dx = to.left + to.width / 2 - (startX + size / 2);
  const dy = to.top + to.height / 2 - (startY + size / 2);

  // Bahar wala X par seedha chalta hai, andar wala Y par pehle upar phir neeche — milkar arc
  const carrier = document.createElement("div");
  Object.assign(carrier.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${size}px`,
    height: `${size}px`,
    zIndex: "9999",
    pointerEvents: "none",
  });
  const flyer = image.cloneNode(true) as HTMLElement;
  flyer.removeAttribute("id");
  Object.assign(flyer.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: "drop-shadow(0 16px 18px rgb(12 26 20 / 0.3))",
  });
  carrier.appendChild(flyer);
  document.body.appendChild(carrier);

  const duration = 850;
  carrier.animate([{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }], {
    duration,
    easing: "cubic-bezier(0.45, 0, 0.55, 1)",
    fill: "forwards",
  });
  const flight = flyer.animate(
    [
      { transform: "translateY(0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translateY(${dy}px) scale(0.16) rotate(-28deg)`, opacity: 0.5 },
    ],
    { duration, easing: "cubic-bezier(0.55, -0.55, 0.75, 0.95)", fill: "forwards" },
  );
  flight.onfinish = () => {
    carrier.remove();
    target.animate([{ scale: "1" }, { scale: "1.22" }, { scale: "1" }], {
      duration: 460,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    });
  };
}
