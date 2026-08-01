(function () {
  "use strict";

  const VERSION = "1.0.0";
  const STATES = Object.freeze([
    Object.freeze({ id: "idle", level: 0, label: "00 / En espera", message: "CERO espera contigo." }),
    Object.freeze({ id: "focus", level: 1, label: "01 / Enfoque", message: "CERO está encontrando el criterio." }),
    Object.freeze({ id: "think", level: 2, label: "02 / Orden", message: "CERO está ordenando el flujo." }),
    Object.freeze({ id: "build", level: 3, label: "03 / Construcción", message: "CERO está dando forma a la interfaz." }),
    Object.freeze({ id: "ready", level: 4, label: "04 / Listo", message: "CERO muestra el resultado listo." })
  ]);
  const stateById = new Map(STATES.map((state) => [state.id, state]));
  const stateByLevel = new Map(STATES.map((state) => [state.level, state]));
  const config = window.CEROCOMA_CONFIG || {};
  const enabled = Boolean(config.features && config.features.mascotDemo);
  const mascot = document.querySelector("[data-cero-mascot]");
  const stateLabel = document.querySelector("[data-mascot-state-label]");
  const visibleMessage = document.querySelector("[data-compressor-result]");
  const liveStatus = document.querySelector("[data-mascot-status]");
  let currentId = mascot && stateById.has(mascot.dataset.state) ? mascot.dataset.state : "idle";

  function setState(id, options) {
    if (!enabled || !mascot || typeof id !== "string" || !stateById.has(id)) return false;

    const next = stateById.get(id);
    const settings = options && typeof options === "object" ? options : {};
    const changed = currentId !== next.id;

    mascot.dataset.state = next.id;
    if (stateLabel) stateLabel.textContent = next.label;

    if (settings.syncMessage === true) {
      if (visibleMessage) visibleMessage.textContent = next.message;
      if (settings.announce !== false && liveStatus) liveStatus.textContent = next.message;
    }

    if (!changed) return true;

    currentId = next.id;
    window.dispatchEvent(new CustomEvent("cerocoma:mascot-statechange", {
      detail: Object.freeze({
        id: next.id,
        level: next.level,
        message: next.message,
        source: typeof settings.source === "string" ? settings.source : "api"
      })
    }));
    return true;
  }

  function getState() {
    return currentId;
  }

  window.CEROCOMA_MASCOT = Object.freeze({
    version: VERSION,
    states: STATES,
    setState,
    getState
  });

  if (!enabled || !mascot) return;

  window.addEventListener("cerocoma:compressor-change", (event) => {
    const detail = event && event.detail ? event.detail : {};
    const state = stateByLevel.get(Number(detail.level));
    if (!state) return;
    setState(state.id, { announce: false, source: detail.source || "compressor" });
  });

  const range = document.querySelector("[data-compressor] input[type='range']");
  const initialState = stateByLevel.get(range ? Number(range.value) : 0) || STATES[0];
  setState(initialState.id, { announce: false, source: "initial" });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  let componentVisible = true;
  let frame = 0;
  let pointerPosition = null;

  function canTrack() {
    return componentVisible && finePointer.matches && !reducedMotion.matches;
  }

  function renderGaze() {
    frame = 0;
    if (!canTrack() || !pointerPosition) {
      mascot.style.setProperty("--gaze-x", "0px");
      mascot.style.setProperty("--gaze-y", "0px");
      return;
    }

    const bounds = mascot.getBoundingClientRect();
    const normalizedX = ((pointerPosition.x - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = ((pointerPosition.y - bounds.top) / bounds.height) * 2 - 1;
    const gazeX = Math.max(-1, Math.min(1, normalizedX)) * 7;
    const gazeY = Math.max(-1, Math.min(1, normalizedY)) * 5;
    mascot.style.setProperty("--gaze-x", `${gazeX.toFixed(2)}px`);
    mascot.style.setProperty("--gaze-y", `${gazeY.toFixed(2)}px`);
  }

  function requestGazeRender() {
    if (!frame) frame = window.requestAnimationFrame(renderGaze);
  }

  function resetGaze() {
    pointerPosition = null;
    requestGazeRender();
  }

  mascot.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !canTrack()) return;
    pointerPosition = { x: event.clientX, y: event.clientY };
    requestGazeRender();
  }, { passive: true });
  mascot.addEventListener("pointerleave", resetGaze, { passive: true });
  mascot.addEventListener("pointercancel", resetGaze, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      componentVisible = Boolean(entries[0] && entries[0].isIntersecting);
      if (!componentVisible) resetGaze();
    }, { threshold: 0.05 });
    observer.observe(mascot);
  }

  function handleMediaChange() {
    if (!canTrack()) resetGaze();
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMediaChange);
    finePointer.addEventListener("change", handleMediaChange);
  } else {
    reducedMotion.addListener(handleMediaChange);
    finePointer.addListener(handleMediaChange);
  }
})();
