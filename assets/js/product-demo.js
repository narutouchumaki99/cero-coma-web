(function () {
  "use strict";

  const tablist = document.querySelector("[data-demo-tabs]");
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll("[role='tab']"));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const status = document.querySelector("[data-demo-status]");

  function activateTab(index, moveFocus, announce) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (panels[tabIndex]) panels[tabIndex].hidden = !selected;
    });

    if (moveFocus) tabs[index].focus();
    if (announce && status) status.textContent = `Paso mostrado: ${tabs[index].textContent.trim()}.`;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(index, false, true));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;

      event.preventDefault();
      activateTab(next, true, true);
    });
  });

  activateTab(0, false, false);
})();

