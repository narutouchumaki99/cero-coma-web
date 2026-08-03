(function () {
  "use strict";

  const config = window.CEROCOMA_CONFIG || {};
  const projects = Array.isArray(window.CEROCOMA_PROJECTS)
    ? window.CEROCOMA_PROJECTS.filter((project) => project.visibility === "public")
    : [];

  const root = document.querySelector("[data-project-explorer]");
  if (!root) return;

  const list = root.querySelector("[data-project-list]");
  const fallback = root.querySelector("[data-project-fallback]");
  const filters = root.querySelector("[data-project-filters]");
  const search = root.querySelector("[data-project-search]");
  const count = root.querySelector("[data-project-count]");
  const tools = root.querySelector("[data-project-tools]");
  const dialog = document.querySelector("[data-project-dialog]");
  const dialogBody = dialog && dialog.querySelector("[data-project-dialog-body]");
  const dialogClose = dialog && dialog.querySelector("[data-project-dialog-close]");
  const pageRoot = document.body.dataset.siteRoot || "../";
  let currentCategory = "Todos";
  let currentTrigger = null;
  let syncingHistory = false;

  if (!list || !filters || !search || !count || !dialog || !dialogBody || !dialogClose) return;

  if (fallback) fallback.hidden = true;
  if (tools) tools.hidden = false;
  list.hidden = false;

  function normalise(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es");
  }

  function projectUrl(project) {
    return project.publicRoute ? `${pageRoot}${project.publicRoute}` : "";
  }

  function createButton(label, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    return button;
  }

  function renderFilters() {
    const categories = ["Todos", ...new Set(projects.map((project) => project.category))];
    filters.replaceChildren();

    categories.forEach((category) => {
      const button = createButton(category, "filter-button");
      button.setAttribute("aria-pressed", String(category === currentCategory));
      button.addEventListener("click", () => {
        currentCategory = category;
        filters.querySelectorAll("button").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });
        renderProjects();
      });
      filters.append(button);
    });
  }

  function createProjectCard(project) {
    const article = document.createElement("article");
    article.className = "project-card";
    article.dataset.projectId = project.id;

    const meta = document.createElement("div");
    meta.className = "project-card__meta";

    const category = document.createElement("span");
    category.className = "project-card__category";
    category.textContent = project.category;

    const status = document.createElement("span");
    status.className = "status-pill";
    status.textContent = project.status;
    meta.append(category, status);

    const heading = document.createElement("h2");
    heading.textContent = project.name;

    const summary = document.createElement("p");
    summary.textContent = project.summary;

    const actions = document.createElement("div");
    actions.className = "project-card__actions";

    const detail = createButton("Ver detalle", "button button--ghost");
    detail.setAttribute("aria-haspopup", "dialog");
    detail.addEventListener("click", () => openProject(project.id, detail, true));
    actions.append(detail);

    const url = projectUrl(project);
    if (url) {
      const link = document.createElement("a");
      link.className = "button button--light";
      link.href = url;
      link.textContent = "Abrir proyecto";
      actions.append(link);
    }

    // La app desplegada solo cubre el producto principal: el resto de proyectos
    // no debe mostrar un acceso que no les corresponde.
    const appUrl = (config.app && config.app.url) || "";
    if (appUrl && project.id === "tu-carta") {
      const appLink = document.createElement("a");
      appLink.className = "button button--ghost";
      appLink.href = appUrl;
      appLink.target = "_blank";
      appLink.rel = "noreferrer";
      appLink.textContent = "Entrar en la app ↗";
      actions.append(appLink);
    }

    article.append(meta, heading, summary, actions);
    return article;
  }

  function filteredProjects() {
    const query = normalise(search.value.trim());
    return projects.filter((project) => {
      const categoryMatch = currentCategory === "Todos" || project.category === currentCategory;
      const haystack = normalise([
        project.name,
        project.category,
        project.status,
        project.summary,
        project.problem,
        project.audience
      ].join(" "));
      return categoryMatch && (!query || haystack.includes(query));
    });
  }

  function renderProjects() {
    const matches = filteredProjects();
    list.replaceChildren();

    matches.forEach((project) => list.append(createProjectCard(project)));

    if (!matches.length) {
      const empty = document.createElement("section");
      empty.className = "project-empty";
      const heading = document.createElement("h2");
      heading.textContent = "No hay coincidencias";
      const text = document.createElement("p");
      text.textContent = "Prueba con otro término o vuelve a mostrar todos los proyectos.";
      const reset = createButton("Restablecer búsqueda", "button button--dark");
      reset.addEventListener("click", () => {
        search.value = "";
        currentCategory = "Todos";
        renderFilters();
        renderProjects();
        search.focus();
      });
      empty.append(heading, text, reset);
      list.append(empty);
    }

    count.textContent = `${matches.length} ${matches.length === 1 ? "proyecto" : "proyectos"}`;
  }

  function listBlock(title, items) {
    if (!Array.isArray(items) || !items.length) return null;
    const section = document.createElement("section");
    section.className = "project-dialog__block";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const ul = document.createElement("ul");
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.append(li);
    });
    section.append(heading, ul);
    return section;
  }

  function textBlock(title, value) {
    const section = document.createElement("section");
    section.className = "project-dialog__block";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const text = document.createElement("p");
    text.textContent = value;
    section.append(heading, text);
    return section;
  }

  function renderDialog(project) {
    dialogBody.replaceChildren();

    const head = document.createElement("header");
    head.className = "project-dialog__head";
    const meta = document.createElement("p");
    meta.className = "eyebrow";
    meta.textContent = `${project.category} · ${project.status}`;
    const heading = document.createElement("h2");
    heading.id = "project-dialog-title";
    heading.textContent = project.name;
    const summary = document.createElement("p");
    summary.className = "project-dialog__summary";
    summary.textContent = project.summary;
    head.append(meta, heading, summary);

    const grid = document.createElement("div");
    grid.className = "project-dialog__grid";
    [
      textBlock("Problema", project.problem),
      textBlock("Para quién", project.audience),
      textBlock("Estado comprobado", project.currentState),
      listBlock("Ya operativo", project.workingFeatures),
      listBlock("Demostrado en esta web", project.simulatedFeatures),
      textBlock("Siguiente hito", project.nextMilestone),
      listBlock("Pendiente", project.blockers)
    ].filter(Boolean).forEach((block) => grid.append(block));

    const foot = document.createElement("div");
    foot.className = "project-dialog__foot";
    const url = projectUrl(project);
    if (url) {
      const link = document.createElement("a");
      link.className = "button button--dark";
      link.href = url;
      link.textContent = "Ver página del proyecto";
      foot.append(link);
    }
    const close = createButton("Cerrar detalle", "button button--ghost");
    close.addEventListener("click", closeProject);
    foot.append(close);

    dialogBody.append(head, grid, foot);
  }

  function projectIdFromHash() {
    const match = window.location.hash.match(/^#proyecto=([a-z0-9-]+)$/);
    return match ? match[1] : "";
  }

  function openProject(id, trigger, updateHash) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    currentTrigger = trigger || document.querySelector("[data-project-search]");
    renderDialog(project);
    if (!dialog.open) dialog.showModal();

    if (updateHash) {
      const nextHash = `#proyecto=${project.id}`;
      if (window.location.hash !== nextHash) {
        history.pushState({ project: project.id }, "", nextHash);
      }
    }

    window.setTimeout(() => dialogClose.focus(), 0);
  }

  function closeProject() {
    if (projectIdFromHash()) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    dialog.close();
  }

  function syncWithHash() {
    const id = projectIdFromHash();
    const project = projects.find((item) => item.id === id);
    syncingHistory = true;
    if (project) {
      openProject(project.id, null, false);
    } else if (dialog.open) {
      dialog.close();
    }
    syncingHistory = false;
  }

  dialogClose.addEventListener("click", closeProject);
  dialog.addEventListener("close", () => {
    if (!syncingHistory && projectIdFromHash()) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    if (currentTrigger && typeof currentTrigger.focus === "function") currentTrigger.focus();
    currentTrigger = null;
  });

  search.addEventListener("input", renderProjects);
  window.addEventListener("popstate", syncWithHash);
  window.addEventListener("hashchange", syncWithHash);

  renderFilters();
  renderProjects();
  syncWithHash();
})();
