/* =================================================================
   PORTFOLIO INTERACTIONS
   1. Main tabs (About Me / Projects)
   2. Project category tabs (Data / Consulting / Research)
   3. Certification card -> expandable section
   4. Certification items -> accordion (one open at a time)
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. MAIN TABS ------------------------------------- */
  const tabs   = document.querySelectorAll(".tab");
  const panels = {
    about:    document.getElementById("panel-about"),
    projects: document.getElementById("panel-projects"),
    additional: document.getElementById("panel-additional"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      Object.values(panels).forEach((p) => p.classList.remove("is-active"));
      panels[tab.dataset.tab].classList.add("is-active");
    });
  });

  /* ---------- 2. PROJECT CATEGORY TABS ------------------------- */
  const subtabs = document.querySelectorAll(".subtab");
  const groups  = document.querySelectorAll(".project-group");

  subtabs.forEach((sub) => {
    sub.addEventListener("click", () => {
      subtabs.forEach((s) => s.classList.remove("is-active"));
      sub.classList.add("is-active");

      groups.forEach((g) => {
        g.classList.toggle("is-active", g.dataset.group === sub.dataset.cat);
      });
    });
  });

  /* ---------- 3. AWARDS / CERTIFICATION POP-OUT SECTIONS ------- */
  /* Two toggle cards, each controls one pop-out section.
     Only one pop-out may be open at a time (mutual exclusion). */
  const toggleCards = document.querySelectorAll(".toggle-card");
  const popouts     = document.querySelectorAll(".popout");

  function sizePopout(popout) {
    // recompute the wrapper height so it always fits its content
    popout.style.maxHeight = popout.scrollHeight + "px";
  }

  function closePopout(popout) {
    popout.classList.remove("is-open");
    popout.style.maxHeight = null;
    closeAllItems(popout);                 // collapse inner items too
    const card = document.querySelector('.toggle-card[data-panel="' + popout.dataset.section + '"]');
    if (card) card.setAttribute("aria-expanded", "false");
  }

  function openPopout(popout, card) {
    // close every other pop-out first (only one open at a time)
    popouts.forEach((p) => { if (p !== popout) closePopout(p); });
    popout.classList.add("is-open");
    sizePopout(popout);
    card.setAttribute("aria-expanded", "true");
  }

  toggleCards.forEach((card) => {
    const popout = document.getElementById("panel-" + card.dataset.panel);

    function toggle() {
      const isOpen = card.getAttribute("aria-expanded") === "true";
      if (isOpen) closePopout(popout);
      else openPopout(popout, card);
    }

    card.addEventListener("click", toggle);
    // keyboard support (Enter / Space) — the card acts as a button
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- 4. ACCORDION ITEMS (inside each pop-out) --------- */
  /* Within a section, only one item can be expanded at a time. */
  function closeAllItems(scope) {
    scope.querySelectorAll(".accordion-item").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".accordion-head").setAttribute("aria-expanded", "false");
      item.querySelector(".accordion-body").style.maxHeight = null;
    });
  }

  document.querySelectorAll(".accordion-item").forEach((item) => {
    const head   = item.querySelector(".accordion-head");
    const body   = item.querySelector(".accordion-body");
    const popout = item.closest(".popout");

    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      closeAllItems(popout);               // collapse siblings first

      if (!isOpen) {
        item.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }

      // the pop-out grew/shrank — recompute its height (now + after anim)
      if (popout.classList.contains("is-open")) {
        requestAnimationFrame(() => sizePopout(popout));
        setTimeout(() => {
          if (popout.classList.contains("is-open")) sizePopout(popout);
        }, 420);
      }
    });
  });

  /* keep heights correct if the window is resized while things are open */
  window.addEventListener("resize", () => {
    const openItem = document.querySelector(".accordion-item.is-open");
    if (openItem) {
      const body = openItem.querySelector(".accordion-body");
      body.style.maxHeight = body.scrollHeight + "px";
    }
    document.querySelectorAll(".popout.is-open").forEach(sizePopout);
  });
});
