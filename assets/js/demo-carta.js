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
  const THEMES = [
    { id: "clasico", label: "Clásico" },
    { id: "nocturno", label: "Nocturno" },
    { id: "bodega", label: "Bodega" },
    { id: "oliva", label: "Oliva" },
  ];
  const FONTS = [
    { id: "moderna", label: "Moderna" },
    { id: "editorial", label: "Editorial" },
  ];
  const SIZES = [
    { id: "movil", label: "Móvil" },
    { id: "amplia", label: "Amplia" },
  ];
  const state = {
    step: 0,
    sample: null,
    data: null,
    confirmed: new Set(),
    view: { theme: "clasico", font: "moderna", size: "movil" },
  };

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
        products: category.products.map((product) => ({
          ...product,
          featured: false,
          soldOut: false,
        })),
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
      "Ajusta nombres y precios, destaca platos (★) o márcalos como agotados. Todo pasa a la carta publicada del siguiente paso."));

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

        const featured = el("button", "carta-demo__toggle", "★");
        featured.type = "button";
        featured.title = "Destacar plato";
        featured.setAttribute("aria-label", `Destacar ${product.name}`);
        featured.setAttribute("aria-pressed", String(product.featured));
        featured.classList.toggle("is-on", product.featured);
        featured.addEventListener("click", () => {
          product.featured = !product.featured;
          featured.classList.toggle("is-on", product.featured);
          featured.setAttribute("aria-pressed", String(product.featured));
        });

        const soldOut = el("button", "carta-demo__toggle carta-demo__toggle--out", "Agotado");
        soldOut.type = "button";
        soldOut.setAttribute("aria-label", `Marcar ${product.name} como agotado`);
        soldOut.setAttribute("aria-pressed", String(product.soldOut));
        soldOut.classList.toggle("is-on", product.soldOut);
        soldOut.addEventListener("click", () => {
          product.soldOut = !product.soldOut;
          soldOut.classList.toggle("is-on", product.soldOut);
          soldOut.setAttribute("aria-pressed", String(product.soldOut));
        });

        row.append(name, price, featured, soldOut);
        list.append(row);
      });
    });
    panels.append(list, navButtons({
      back: () => setStep(2),
      next: () => setStep(4),
      nextLabel: "Publicar la carta",
    }));
  }

  /* QR decorativo determinista: solo indica dónde iría el QR real. */
  function makeFakeQr(seedText) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 21 21");
    svg.setAttribute("class", "carta-demo__qr");
    svg.setAttribute("aria-hidden", "true");
    let seed = 0;
    for (const char of seedText) seed = (seed * 31 + char.charCodeAt(0)) % 65521;
    const finders = [[0, 0], [14, 0], [0, 14]];
    const inFinder = (x, y) =>
      finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
    for (let y = 0; y < 21; y += 1) {
      for (let x = 0; x < 21; x += 1) {
        let dark;
        if (inFinder(x, y)) {
          const finder = finders.find(([gx, gy]) => x >= gx && x < gx + 7 && y >= gy && y < gy + 7);
          const ring = Math.max(Math.abs(x - finder[0] - 3), Math.abs(y - finder[1] - 3));
          dark = ring !== 2;
        } else {
          seed = (seed * 75 + 74) % 65537;
          dark = seed % 3 === 0;
        }
        if (dark) {
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", String(x));
          rect.setAttribute("y", String(y));
          rect.setAttribute("width", "1");
          rect.setAttribute("height", "1");
          svg.append(rect);
        }
      }
    }
    return svg;
  }

  function buildPreview() {
    const preview = el("div", "public-preview");
    preview.dataset.theme = state.view.theme;
    preview.dataset.font = state.view.font;
    preview.dataset.size = state.view.size;

    const hero = el("div", "public-preview__hero");
    hero.append(el("strong", null, state.data.name), el("span", null, "Carta actualizada · Ejemplo"));
    const body = el("div", "public-preview__body");
    state.data.categories.forEach((category) => {
      body.append(el("h4", "carta-demo__preview-category", category.name));
      category.products.forEach((product) => {
        const line = el("p");
        if (product.soldOut) line.classList.add("is-sold-out");
        const nameCell = el("span", "carta-demo__preview-name");
        if (product.featured) {
          const star = el("span", "carta-demo__preview-star", "★");
          star.setAttribute("aria-hidden", "true");
          nameCell.append(star, " ");
        }
        nameCell.append(product.name || "—");
        if (product.soldOut) nameCell.append(el("em", "carta-demo__preview-out", " · agotado"));
        line.append(nameCell,
          el("span", null, product.price ? `${product.price} €` : "—"));
        body.append(line);
      });
    });

    const foot = el("div", "carta-demo__preview-foot");
    foot.append(makeFakeQr(state.data.name),
      el("span", null, "QR de ejemplo. En la app real, la URL y el QR son permanentes entre versiones."));
    preview.append(hero, body, foot);
    return preview;
  }

  function optionGroup(labelText, options, current, onPick) {
    const group = el("div", "carta-demo__optgroup");
    group.append(el("span", "carta-demo__optlabel", labelText));
    const buttons = el("div", "carta-demo__optbuttons");
    buttons.setAttribute("role", "group");
    buttons.setAttribute("aria-label", labelText);
    options.forEach((option) => {
      const button = el("button", "carta-demo__opt", option.label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(option.id === current));
      button.classList.toggle("is-on", option.id === current);
      button.addEventListener("click", () => onPick(option.id));
      buttons.append(button);
    });
    group.append(buttons);
    return group;
  }

  /* Paso 4 — carta publicada + opciones de visualización + siguiente paso */
  function renderPublish() {
    panels.replaceChildren();
    panels.append(el("p", "carta-demo__hint",
      "Así queda la carta pública. Prueba los temas y estilos: en la app real la personalización funciona igual, sin CSS libre, y publicar nuevas versiones nunca cambia el QR impreso."));

    const options = el("div", "carta-demo__options");
    const rebuild = () => {
      renderPublish();
      announce(`Vista actualizada: tema ${state.view.theme}, letra ${state.view.font}, tamaño ${state.view.size}.`);
    };
    options.append(
      optionGroup("Tema", THEMES, state.view.theme, (id) => { state.view.theme = id; rebuild(); }),
      optionGroup("Letra", FONTS, state.view.font, (id) => { state.view.font = id; rebuild(); }),
      optionGroup("Vista", SIZES, state.view.size, (id) => { state.view.size = id; rebuild(); }),
    );
    panels.append(options, buildPreview());

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
