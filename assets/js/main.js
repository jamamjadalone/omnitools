/* =========================================================================
   OmniTools — core script
   Loaded on every page. Injects header/footer, wires theme + search + nav,
   and exposes small shared helpers (toast, tools data) on window.OmniTools.
   ========================================================================= */
(function () {
  "use strict";

  const ROOT = document.documentElement.getAttribute("data-root") || "./";
  const html = document.documentElement;

  /* ---------- Theme ---------- */
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("omnitools-theme"); } catch (e) {}
    let prefersLight = false;
    try {
      prefersLight = typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: light)").matches;
    } catch (e) {}
    const preferred = saved || (prefersLight ? "light" : "dark");
    html.setAttribute("data-theme", preferred);
  }
  function toggleTheme() {
    const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("omnitools-theme", next); } catch (e) {}
  }
  initTheme();

  /* ---------- Toasts ---------- */
  function ensureToastStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    return stack;
  }
  function showToast(message, type) {
    const stack = ensureToastStack();
    const toast = document.createElement("div");
    toast.className = "toast" + (type ? " toast-" + type : "");
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity .3s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  /* ---------- Data loading ---------- */
  let toolsDataPromise = null;
  function loadToolsData() {
    if (!toolsDataPromise) {
      toolsDataPromise = fetch(ROOT + "data/tools.json")
        .then((r) => r.json())
        .catch((err) => {
          console.error("Failed to load tools.json", err);
          return { tools: [], categories: [] };
        });
    }
    return toolsDataPromise;
  }

  /* ---------- Header / Footer injection ---------- */
  function injectPartial(selector, url) {
    const target = document.querySelector(selector);
    if (!target) return Promise.resolve();
    return fetch(url)
      .then((r) => r.text())
      .then((text) => {
        target.innerHTML = text.split("{{ROOT}}").join(ROOT);
      })
      .catch((err) => console.error("Failed to load partial", url, err));
  }

  function wireHeader() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    // Mark active nav link
    const path = window.location.pathname;
    document.querySelectorAll(".main-nav a").forEach((a) => {
      try {
        const url = new URL(a.href);
        if (path.endsWith(url.pathname.split("/").slice(-2).join("/"))) {
          a.classList.add("active");
        }
      } catch (e) {}
    });
  }

  function wireFooter() {
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Site-wide search ---------- */
  function wireSearch(inputEl, resultsEl) {
    if (!inputEl || !resultsEl) return;
    loadToolsData().then((data) => {
      const tools = data.tools || [];
      function render(query) {
        const q = query.trim().toLowerCase();
        if (!q) {
          resultsEl.classList.remove("open");
          resultsEl.innerHTML = "";
          return;
        }
        const matches = tools.filter((t) => {
          const hay = [t.name, t.description, ...(t.keywords || [])].join(" ").toLowerCase();
          return hay.includes(q);
        }).slice(0, 8);

        if (matches.length === 0) {
          resultsEl.innerHTML = '<div class="search-empty">No tools found for &ldquo;' + escapeHtml(query) + '&rdquo;</div>';
        } else {
          resultsEl.innerHTML = matches.map((t) => (
            '<a href="' + ROOT + "tools/" + t.slug + '/index.html">' +
              '<span class="result-icon">' + t.icon + '</span>' +
              '<span><strong>' + t.name + '</strong><br><span style="color:var(--text-faint);font-size:.8rem;">' + t.description + '</span></span>' +
            '</a>'
          )).join("");
        }
        resultsEl.classList.add("open");
      }
      inputEl.addEventListener("input", (e) => render(e.target.value));
      inputEl.addEventListener("focus", (e) => { if (e.target.value) render(e.target.value); });
      document.addEventListener("click", (e) => {
        if (!resultsEl.contains(e.target) && e.target !== inputEl) {
          resultsEl.classList.remove("open");
        }
      });
      document.addEventListener("keydown", (e) => {
        if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          inputEl.focus();
        }
        if (e.key === "Escape") resultsEl.classList.remove("open");
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- FAQ accordion ---------- */
  function wireFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!btn || !answer) return;
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".faq-answer").style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !isOpen);
        answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function wireReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => obs.observe(el));
  }

  /* ---------- Copy-to-clipboard helper ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return Promise.resolve();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const headerReady = injectPartial("#site-header", ROOT + "components/header.html").then(wireHeader);
    injectPartial("#site-footer", ROOT + "components/footer.html").then(wireFooter);

    headerReady.then(() => {
      // header search box, if present on this page
      wireSearch(document.getElementById("headerSearchInput"), document.getElementById("headerSearchResults"));
    });

    wireSearch(document.getElementById("heroSearchInput"), document.getElementById("heroSearchResults"));
    wireFaq();
    wireReveal();

    const newsletterForm = document.querySelector(".newsletter form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Thanks for subscribing! (demo only, no email sent)", "success");
        newsletterForm.reset();
      });
    }
  });

  window.OmniTools = {
    ROOT,
    loadToolsData,
    showToast,
    copyText,
    escapeHtml,
  };
})();
