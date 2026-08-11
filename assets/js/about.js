(function () {
  "use strict";

  const section = document.querySelector("[data-ody-story]");
  if (!section) return;

  const avatar = section.querySelector("[data-ody-avatar]");
  const caption = section.querySelector("[data-ody-caption]");
  const steps = Array.from(section.querySelectorAll("[data-ody-step]"));
  const route = Array.from(section.querySelectorAll("[data-ody-route] span"));
  if (!avatar || !caption || steps.length === 0) return;

  const states = ["idle", "focus", "think", "build", "ready"];
  const siteRoot = document.body.dataset.siteRoot || "./";
  const renderSrc = (state) => `${siteRoot}assets/media/mascot/ody/ody-${state}.webp`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = -1;
  let swapTimer = 0;

  steps.forEach((step) => {
    const state = step.dataset.odyState;
    if (!states.includes(state)) return;
    const image = new Image();
    image.src = renderSrc(state);
  });

  function activate(index) {
    if (index < 0 || index >= steps.length || index === activeIndex) return;
    activeIndex = index;

    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === index);
    });
    route.forEach((marker, markerIndex) => {
      marker.classList.toggle("is-active", markerIndex <= index);
    });

    const step = steps[index];
    const rawState = step.dataset.odyState || "idle";
    const state = states.includes(rawState) ? rawState : "idle";
    caption.textContent = step.dataset.odyCaption || "";

    window.clearTimeout(swapTimer);
    if (reduceMotion) {
      avatar.src = renderSrc(state);
      return;
    }

    avatar.classList.add("is-changing");
    swapTimer = window.setTimeout(() => {
      avatar.src = renderSrc(state);
      window.requestAnimationFrame(() => avatar.classList.remove("is-changing"));
    }, 120);
  }

  activate(0);
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) activate(steps.indexOf(visible[0].target));
    },
    { rootMargin: "-38% 0px -42% 0px", threshold: 0 },
  );

  steps.forEach((step) => observer.observe(step));
})();
