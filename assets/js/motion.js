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
        child.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 60}ms`);
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
    // Con transiciones de vista el navegador funde la navegación por su cuenta.
    if ("onpagereveal" in window) return;

    // Respaldo: solo se funde la entrada. Interceptar el clic para animar la
    // salida obligaba a esperar antes de navegar, y esa espera se nota.
    root.classList.add("page-enter");
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
