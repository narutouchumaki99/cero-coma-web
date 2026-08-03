/* Demo gratuita de Tu carta: flujo completo simulado en el navegador con
   archivos de ejemplo y resultados precalculados. No hay IA en vivo ni
   llamadas de red: nada sale del navegador del visitante. */
(function () {
  "use strict";

  const root = document.querySelector("[data-carta-demo]");
  if (!root) return;

  const panels = root.querySelector("[data-carta-panels]");
  const stepper = Array.from(root.querySelectorAll("[data-carta-stepper] li"));
  const status = root.querySelector("[data-carta-status]");
  if (!panels || stepper.length !== 5) return;

  const config = window.CEROCOMA_CONFIG || {};
  const appUrl = (config.app && config.app.url) || "";

  const SAMPLES = [
    {
      id: "bar",
      name: "Bar La Plana",
      note: "Carta breve de bar: tapas, raciones y bebidas.",
      file: "../assets/media/demo/carta-bar.svg",
      categories: [
        {
          name: "Tapas",
          products: [
            { name: "Tortilla de patatas", price: "3,50" },
            { name: "Croquetas caseras (6 uds)", price: "6,00", flag: "Precio dudoso en la foto" },
            { name: "Ensaladilla rusa", price: "4,50" },
          ],
        },
        {
          name: "Raciones",
          products: [
            { name: "Calamares a la andaluza", price: "9,80" },
            { name: "Patatas bravas", price: "5,50" },
            { name: "Queso curado en aceite", price: "7,20", flag: "Nombre incompleto en la lectura" },
          ],
        },
        {
          name: "Bebidas",
          products: [
            { name: "Caña", price: "1,80" },
            { name: "Vino de la casa (copa)", price: "2,20" },
          ],
        },
      ],
    },
    {
      id: "cafeteria",
      name: "Cafetería Aurora",
      note: "Desayunos, cafés y dulces con formato cuidado.",
      file: "../assets/media/demo/carta-cafeteria.svg",
      categories: [
        {
          name: "Desayunos",
          products: [
            { name: "Tostada con tomate y aceite", price: "2,80" },
            { name: "Croissant a la plancha", price: "3,20" },
            { name: "Bowl de yogur y fruta", price: "5,90" },
          ],
        },
        {
          name: "Cafés",
          products: [
            { name: "Espresso", price: "1,60" },
            { name: "Flat white", price: "2,90" },
            { name: "Cappuccino con avena", price: "3,10", flag: "Revisar tipo de leche" },
          ],
        },
        {
          name: "Dulces",
          products: [{ name: "Tarta de zanahoria", price: "4,50" }],
        },
      ],
    },
  ];

  const STEP_LABELS = ["Archivo", "Procesar", "Revisar", "Editar", "Publicar"];
  const state = { step: 0, sample: null, data: null, confirmed: new Set() };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function announce(message) {
    if (status) status.textContent = message;
  }

  function setStep(step) {
    state.step = step;
    stepper.forEach((item, index) => {
      item.dataset.active = String(index === step);
      item.dataset.done = String(index < step);
      if (index === step) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    render();
    announce(`Paso ${step + 1} de 5: ${STEP_LABELS[step]}.`);
  }

  function navButtons(options) {
    const nav = el("div", "carta-demo__nav");
    if (options.back) {
      const back = el("button", "button button--ghost", options.backLabel || "Volver");
      back.type = "button";
      back.addEventListener("click", options.back);
      nav.append(back);
    }
    if (options.next) {
      const next = el("button", "button button--dark", options.nextLabel || "Continuar");
      next.type = "button";
      if (options.nextDisabled) next.disabled = true;
      next.addEventListener("click", options.next);
      nav.append(next);
      options.nextRef?.(next);
    }
    return nav;
  }

  function cloneSample(sample) {
    return {
      name: sample.name,
      categories: sample.categories.map((category) => ({
        name: category.name,
        products: category.products.map((product) => ({ ...product })),
      })),
    };
  }

  /* Paso 0 — elegir archivo de prueba */
  function renderPick() {
    panels.replaceChildren();
    const intro = el("p", "carta-demo__hint",
      "Elige un archivo de prueba. Son cartas de ejemplo con resultados precalculados: la demo no usa IA en vivo y no envía nada fuera de tu navegador.");
    const grid = el("div", "carta-demo__files");
    SAMPLES.forEach((sample) => {
      const card = el("button", "carta-demo__file");
      card.type = "button";
      const img = el("img");
      img.src = sample.file;
      img.alt = `Vista del archivo de ejemplo: ${sample.name}`;
      img.width = 200;
      img.height = 280;
      img.loading = "lazy";
      card.append(img, el("strong", null, sample.name), el("span", null, sample.note));
      card.addEventListener("click", () => {
        state.sample = sample;
        state.data = cloneSample(sample);
        state.confirmed = new Set();
        setStep(1);
        runProcessing();
      });
      grid.append(card);
    });
    panels.append(intro, grid);
  }

  /* Paso 1 — procesamiento simulado */
  function renderProcessing() {
    panels.replaceChildren();
    panels.append(el("p", "carta-demo__hint",
      `Procesando «${state.sample.name}» (simulación local, resultado precalculado).`));
    const stack = el("div", "process-stack");
    const lines = ["Preparar páginas", "Extraer contenido", "Validar estructura"].map((label) => {
      const line = el("div", "process-line");
      line.append(el("span", "carta-demo__dot"), el("span", null, label), el("span", null, "…"));
      stack.append(line);
      return line;
    });
    panels.append(stack);
    return lines;
  }

  function runProcessing() {
    const lines = renderProcessing();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : 650;
    lines.forEach((line, index) => {
      window.setTimeout(() => {
        line.lastChild.textContent = "Listo";
        line.classList.add("is-done");
        if (index === lines.length - 1) {
          window.setTimeout(() => setStep(2), reduced ? 0 : 450);
        }
      }, delay * (index + 1));
    });
  }

  /* Paso 2 — revisión humana */
  function renderReview() {
    panels.replaceChildren();
    panels.append(el("p", "carta-demo__hint",
      "La extracción nunca se publica sola: confirma cada resultado. Los avisos señalan lecturas dudosas, igual que en la app real."));

    let nextButton = null;
    const total = state.data.categories.reduce((sum, c) => sum + c.products.length, 0);

    const refreshNext = () => {
      if (nextButton) nextButton.disabled = state.confirmed.size < total;
    };

    const list = el("div", "carta-demo__review");
    state.data.categories.forEach((category, ci) => {
      list.append(el("h3", "carta-demo__category", category.name));
      category.products.forEach((product, pi) => {
        const key = `${ci}:${pi}`;
        const row = el("div", "carta-demo__row");
        const main = el("div", "carta-demo__row-main");
        main.append(el("strong", null, product.name), el("span", null, `${product.price} €`));
        if (product.flag) main.append(el("em", "carta-demo__flag", `⚠ ${product.flag}`));
        const confirm = el("button", "button button--ghost carta-demo__confirm",
          state.confirmed.has(key) ? "Confirmado" : "Confirmar");
        confirm.type = "button";
        confirm.addEventListener("click", () => {
          if (state.confirmed.has(key)) state.confirmed.delete(key);
          else state.confirmed.add(key);
          confirm.textContent = state.confirmed.has(key) ? "Confirmado" : "Confirmar";
          confirm.classList.toggle("is-confirmed", state.confirmed.has(key));
          refreshNext();
        });
        confirm.classList.toggle("is-confirmed", state.confirmed.has(key));
        row.append(main, confirm);
        list.append(row);
      });
    });
    panels.append(list);

    const all = el("button", "button button--ghost", "Confirmar todo");
    all.type = "button";
    all.addEventListener("click", () => {
      state.data.categories.forEach((category, ci) =>
        category.products.forEach((_, pi) => state.confirmed.add(`${ci}:${pi}`)));
      renderReview();
      announce("Todos los resultados confirmados.");
    });
    panels.append(all, navButtons({
      back: () => { state.confirmed = new Set(); setStep(0); },
      backLabel: "Elegir otro archivo",
      next: () => setStep(3),
      nextLabel: "Pasar a editar",
      nextDisabled: state.confirmed.size < total,
      nextRef: (button) => { nextButton = button; },
    }));
  }

  /* Paso 3 — edición */
  function renderEdit() {
    panels.replaceChildren();
    panels.append(el("p", "carta-demo__hint",
      "Ajusta nombres y precios como harías en el editor real. Los cambios pasan a la carta publicada del siguiente paso."));

    const list = el("div", "carta-demo__editor");
    state.data.categories.forEach((category) => {
      list.append(el("h3", "carta-demo__category", category.name));
      category.products.forEach((product) => {
        const row = el("div", "carta-demo__row carta-demo__row--edit");
        const name = el("input");
        name.type = "text";
        name.value = product.name;
        name.maxLength = 60;
        name.setAttribute("aria-label", `Nombre de ${product.name}`);
        name.addEventListener("input", () => { product.name = name.value; });
        const price = el("input");
        price.type = "text";
        price.value = product.price;
        price.inputMode = "decimal";
        price.maxLength = 8;
        price.setAttribute("aria-label", `Precio de ${product.name}`);
        price.addEventListener("input", () => { product.price = price.value; });
        row.append(name, price);
        list.append(row);
      });
    });
    panels.append(list, navButtons({
      back: () => setStep(2),
      next: () => setStep(4),
      nextLabel: "Publicar la carta",
    }));
  }

  /* Paso 4 — carta publicada + siguiente paso real */
  function renderPublish() {
    panels.replaceChildren();
    panels.append(el("p", "carta-demo__hint",
      "Así queda la carta pública. En la app real recibe una URL y un QR permanentes: publicar nuevas versiones nunca cambia el código impreso."));

    const preview = el("div", "public-preview");
    const hero = el("div", "public-preview__hero");
    hero.append(el("strong", null, state.data.name), el("span", null, "Carta actualizada · Ejemplo"));
    const body = el("div", "public-preview__body");
    state.data.categories.forEach((category) => {
      body.append(el("h4", "carta-demo__preview-category", category.name));
      category.products.forEach((product) => {
        const line = el("p");
        line.append(el("span", null, product.name || "—"),
          el("span", null, product.price ? `${product.price} €` : "—"));
        body.append(line);
      });
    });
    preview.append(hero, body);
    panels.append(preview);

    const cta = el("div", "carta-demo__cta");
    cta.append(el("strong", null, "¿Te encaja el flujo?"));
    if (appUrl) {
      const link = el("a", "button button--dark", "Continuar en la app");
      link.href = appUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      cta.append(el("p", null, "El siguiente paso es hacerlo con tu carta real desde el móvil."), link);
    } else {
      cta.append(el("p", null,
        "El acceso a la app se abrirá con el piloto controlado. Cuando haya un canal de contacto público, aparecerá en esta web."));
    }
    panels.append(cta, navButtons({
      back: () => setStep(3),
      backLabel: "Seguir editando",
      next: () => { state.sample = null; state.data = null; state.confirmed = new Set(); setStep(0); },
      nextLabel: "Probar con otro archivo",
    }));
  }

  function render() {
    if (state.step === 0) renderPick();
    else if (state.step === 1) { /* runProcessing pinta este paso */ }
    else if (state.step === 2) renderReview();
    else if (state.step === 3) renderEdit();
    else renderPublish();
  }

  setStep(0);
})();
