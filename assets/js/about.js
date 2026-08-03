(function () {
  "use strict";

  const section = document.querySelector("[data-about-story]");
  if (!section) return;

  const story = section.querySelector(".about-story");
  const avatar = section.querySelector("[data-about-avatar]");
  const caption = section.querySelector("[data-about-caption]");
  const steps = Array.from(section.querySelectorAll("[data-about-step]"));
  const route = Array.from(section.querySelectorAll("[data-about-route] span"));
  if (!story || !avatar || !caption || !steps.length) return;

  const states = ["idle", "focus", "think", "build", "ready"];
  const renderSrc = (state) =>
    `assets/media/mascot/candidate/rendered/cero-${state}.webp`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = -1;
  let swapTimer = 0;

  steps.forEach((step) => {
    const state = step.dataset.aboutState;
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
    const rawState = step.dataset.aboutState || "idle";
    const state = states.includes(rawState) ? rawState : "idle";
    caption.textContent = step.dataset.aboutCaption || "";

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

  story.classList.add("is-enhanced");
  activate(0);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) activate(steps.indexOf(visible[0].target));
    },
    { rootMargin: "-38% 0px -42% 0px", threshold: 0 },
  );

  steps.forEach((step) => observer.observe(step));

})();
