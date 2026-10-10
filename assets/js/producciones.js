(function () {
  "use strict";

  const hero = document.querySelector("[data-prod-hero]");
  const video = document.querySelector("[data-prod-video]");
  if (!hero || !video) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const landscape = window.matchMedia("(orientation: landscape)");
  let heroVisible = true;
  let videoFailed = false;

  function shouldPlay() {
    return !reducedMotion.matches && heroVisible && !document.hidden && !videoFailed;
  }

  function pauseVideo() {
    video.pause();
  }

  function playVideo() {
    if (!shouldPlay()) {
      pauseVideo();
      return;
    }

    const playback = video.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {
        video.classList.remove("is-ready");
      });
    }
  }

  function unloadVideo() {
    pauseVideo();
    video.classList.remove("is-ready");
    video.removeAttribute("src");
    delete video.dataset.activeSrc;
    video.load();
  }

  function loadVideo() {
    if (reducedMotion.matches) {
      unloadVideo();
      return;
    }

    const source = landscape.matches
      ? video.dataset.srcLandscape
      : video.dataset.srcPortrait;

    if (!source) return;
    if (video.dataset.activeSrc === source) {
      playVideo();
      return;
    }

    pauseVideo();
    video.classList.remove("is-ready");
    videoFailed = false;
    video.dataset.activeSrc = source;
    video.src = source;
    video.load();
    playVideo();
  }

  video.addEventListener("playing", () => {
    if (!reducedMotion.matches && !videoFailed) {
      video.classList.add("is-ready");
    }
  });

  video.addEventListener("error", () => {
    videoFailed = true;
    video.classList.remove("is-ready");
    pauseVideo();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseVideo();
    else playVideo();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) playVideo();
        else pauseVideo();
      });
    }, { threshold: 0.05 });
    observer.observe(hero);
  }

  landscape.addEventListener("change", loadVideo);
  reducedMotion.addEventListener("change", loadVideo);
  loadVideo();
})();
