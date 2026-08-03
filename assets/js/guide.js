(function () {
  "use strict";

  const guide = document.querySelector("[data-cero-guide]");
  if (!guide) return;

  const DISMISS_KEY = "ceroGuideDismissed";
  try {
    if (window.sessionStorage.getItem(DISMISS_KEY) === "1") return;
  } catch {
    /* almacenamiento no disponible: la guía se muestra igualmente */
  }

  const avatar = guide.querySelector("[data-guide-avatar]");
  const bubble = guide.querySelector("[data-guide-bubble]");
  const close = guide.querySelector("[data-guide-close]");
  if (!avatar || !bubble || !close) return;

  const STATES = ["idle", "focus", "think", "build", "ready"];
  const renderSrc = (state) =>
    `assets/media/mascot/candidate/rendered/cero-${state}.webp`;

  STATES.forEach((state) => {
    const image = new Image();
    image.src = renderSrc(state);
  });

  guide.hidden = false;

  // Mejora progresiva: modelo 3D real de CERO en pantallas grandes.
  // En móvil, con ahorro de datos o sin WebGL se mantienen los renders WebP.
  let modelActive = false;
  (function upgradeTo3d() {
    const wantsModel =
      window.matchMedia("(min-width: 62rem)").matches &&
      !(navigator.connection && navigator.connection.saveData);
    if (!wantsModel) return;

    try {
      const canvas = document.createElement("canvas");
      if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return;
    } catch {
      return;
    }

    const loader = document.createElement("script");
    loader.type = "module";
    loader.src = "assets/vendor/model-viewer/model-viewer.min.js";
    loader.addEventListener("load", () => {
      const viewer = document.createElement("model-viewer");
      viewer.setAttribute("src", "assets/media/mascot/cero.glb");
      viewer.setAttribute("alt", "");
      viewer.setAttribute("disable-zoom", "");
      viewer.setAttribute("disable-pan", "");
      viewer.setAttribute("disable-tap", "");
      viewer.setAttribute("interaction-prompt", "none");
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("camera-orbit", "90deg 78deg 105%");
      viewer.setAttribute("field-of-view", "28deg");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("exposure", "1.2");
      viewer.setAttribute("shadow-intensity", "0");
      viewer.className = "cero-guide__model";
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        viewer.setAttribute("auto-rotate", "");
        viewer.setAttribute("auto-rotate-delay", "800");
        viewer.setAttribute("rotation-per-second", "18deg");
      }
      viewer.addEventListener("load", () => {
        avatar.replaceWith(viewer);
        modelActive = true;
      });
      const holder = avatar.parentElement;
      if (holder) holder.append(viewer);
    });
    document.head.append(loader);
  })();

  close.addEventListener("click", () => {
    guide.hidden = true;
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* sin persistencia: solo se oculta en esta página */
    }
  });

  const targets = Array.from(document.querySelectorAll("[data-guide-state]"));
  if (targets.length === 0 || !("IntersectionObserver" in window)) return;

  let currentKey = "";

  function apply(target) {
    const rawState = target.getAttribute("data-guide-state") || "idle";
    const state = STATES.includes(rawState) ? rawState : "idle";
    const text = target.getAttribute("data-guide-text") || "";
    const key = `${state}|${text}`;
    if (key === currentKey) return;
    currentKey = key;

    if (!modelActive) avatar.src = renderSrc(state);
    if (text) bubble.textContent = text;
    guide.dataset.state = state;

    guide.classList.remove("is-pop");
    void guide.offsetWidth;
    guide.classList.add("is-pop");
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
      if (visible.length > 0) apply(visible[0].target);
    },
    { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
  );

  targets.forEach((target) => observer.observe(target));
})();
