(function () {
  "use strict";
  const root = document.documentElement;
  const scenes = Array.from(document.querySelectorAll("[data-story-scene]"));
  if (!scenes.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 700px)");
  const toggle = document.querySelector("[data-story-motion-toggle]");
  const active = new Set();
  const videos = Array.from(document.querySelectorAll("[data-story-video]"));
  let enabled = !reduced.matches && !(navigator.connection && navigator.connection.saveData);
  let frame = 0;
  let resizeTimer;

  function paint() {
    frame = 0;
    if (!enabled) return;
    const height = window.innerHeight;
    const updates = Array.from(active, (scene) => {
      const box = scene.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (height - box.top) / (height + box.height)));
      const opacity = Math.max(0, Math.min(1, (height - box.top) / (height * .25), box.bottom / (height * .18)));
      return { scene, opacity, mediaY: (progress - .5) * 34, copyY: (1 - opacity) * (box.top > 0 ? 20 : -20) };
    });
    updates.forEach(({ scene, opacity, mediaY, copyY }) => {
      scene.style.setProperty("--scene-opacity", String(opacity));
      scene.style.setProperty("--scene-media-y", `${mediaY}px`);
      scene.style.setProperty("--scene-copy-y", `${copyY}px`);
    });
  }
  function schedule() { if (!frame && enabled) frame = window.requestAnimationFrame(paint); }

  function syncVideo(video) {
    const box = video.closest("[data-story-scene]").getBoundingClientRect();
    if (!enabled || document.hidden || box.bottom < 0 || box.top > window.innerHeight || video.dataset.failed === "true") {
      video.pause();
      return;
    }
    const source = mobile.matches ? video.dataset.srcMobile : video.dataset.src;
    if (video.dataset.activeSrc !== source) {
      video.classList.remove("is-ready");
      video.dataset.activeSrc = source;
      video.src = source;
      video.load();
    }
    const playback = video.play();
    if (playback) playback.catch(() => video.classList.remove("is-ready"));
  }
  function syncAllVideos() { videos.forEach(syncVideo); }
  videos.forEach((video) => {
    video.addEventListener("playing", () => video.classList.add("is-ready"));
    video.addEventListener("error", () => {
      video.dataset.failed = "true";
      video.classList.remove("is-ready");
      video.pause();
    });
  });

  function syncMode() {
    root.dataset.storyMotion = enabled ? "on" : "off";
    if (toggle) {
      toggle.hidden = false;
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.querySelector("[data-story-motion-label]").textContent = enabled ? "Pausar movimiento" : "Activar movimiento";
    }
    if (!enabled) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      scenes.forEach((scene) => {
        scene.style.removeProperty("--scene-opacity");
        scene.style.removeProperty("--scene-copy-y");
        scene.style.removeProperty("--scene-media-y");
      });
    } else schedule();
    syncAllVideos();
  }
  if (toggle) toggle.addEventListener("click", () => { enabled = !enabled; syncMode(); });
  reduced.addEventListener("change", () => { enabled = !reduced.matches; syncMode(); });
  mobile.addEventListener("change", syncAllVideos);
  document.addEventListener("visibilitychange", syncAllVideos);
  window.addEventListener("pageshow", syncAllVideos);
  window.addEventListener("pagehide", () => videos.forEach((video) => video.pause()));
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => {
    schedule();
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(syncAllVideos, 120);
  }, { passive: true });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
        const video = entry.target.querySelector("[data-story-video]");
        if (video) syncVideo(video);
      });
      schedule();
    }, { threshold: [0, .08, .5, 1] });
    scenes.forEach((scene) => observer.observe(scene));
  } else scenes.forEach((scene) => active.add(scene));
  root.classList.add("js-story");
  syncMode();
})();
