(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const root = document.documentElement;
  root.classList.add("js-motion");

  function setupReveals() {
    document.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
        child.style.setProperty("--reveal-delay", `${index * 90}ms`);
      });
    });

    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach((item) => {
      const box = item.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.9 && box.bottom > 0) {
        item.classList.add("is-revealed");
      } else {
        observer.observe(item);
      }
    });
  }

  function setupPageFade() {
    // Con View Transitions entre documentos el navegador ya difumina la navegación.
    if ("onpagereveal" in window) return;

    root.classList.add("page-enter");

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) root.classList.remove("page-leave");
    });

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (destination.origin !== window.location.origin) return;
      const samePage = destination.pathname === window.location.pathname && destination.search === window.location.search;
      if (samePage && destination.hash) return;

      event.preventDefault();
      root.classList.add("page-leave");
      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 250);
    });
  }

  function setupRecorrido() {
    const region = document.querySelector("[data-recorrido]");
    if (!region || !("IntersectionObserver" in window)) return;

    const chapters = Array.from(region.querySelectorAll("[data-recorrido-chapter]"));
    const counter = region.querySelector("[data-recorrido-counter]");
    const label = region.querySelector("[data-recorrido-label]");
    const progress = region.querySelector("[data-recorrido-progress]");
    if (!chapters.length || !counter || !label || !progress) return;

    function activate(index) {
      chapters.forEach((chapter, chapterIndex) => {
        chapter.classList.toggle("is-active", chapterIndex === index);
      });
      counter.textContent = String(index).padStart(2, "0");
      label.textContent = chapters[index].dataset.chapterLabel || "";
      progress.style.width = `${((index + 1) / chapters.length) * 100}%`;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activate(chapters.indexOf(entry.target));
      });
    }, { rootMargin: "-40% 0px -45% 0px", threshold: 0 });

    chapters.forEach((chapter) => observer.observe(chapter));
    activate(0);
  }

  setupReveals();
  setupPageFade();
  setupRecorrido();
})();
