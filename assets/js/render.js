/* =========================================================================
   OmniTools — render.js
   Turns data/tools.json into tool cards, category cards, ticker chips, etc.
   Depends on main.js having set window.OmniTools already.
   ========================================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function toolCardHtml(tool, root) {
    const badge = tool.isNew ? '<span class="badge">New</span>' : "";
    return (
      '<a class="tool-card reveal" href="' + root + "tools/" + tool.slug + '/index.html">' +
        '<span class="card-icon" aria-hidden="true">' + tool.icon + "</span>" +
        "<h3>" + tool.name + " " + badge + "</h3>" +
        "<p>" + tool.description + "</p>" +
        '<span class="card-tag">' + categoryLabel(tool.category) + "</span>" +
      "</a>"
    );
  }

  function categoryCardHtml(cat, root, count) {
    return (
      '<a class="category-card reveal" href="' + root + "categories/" + cat.id + '.html">' +
        '<span class="cat-icon" aria-hidden="true">' + cat.icon + "</span>" +
        "<h3>" + cat.name + "</h3>" +
        "<p>" + cat.description + "</p>" +
        '<span class="cat-count">' + count + " tool" + (count === 1 ? "" : "s") + "</span>" +
      "</a>"
    );
  }

  let CATS_BY_ID = {};
  function categoryLabel(id) {
    return (CATS_BY_ID[id] && CATS_BY_ID[id].name) || id;
  }

  function renderInto(selector, items, mapFn) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = items.map(mapFn).join("") || '<p style="color:var(--text-faint);">Nothing to show yet — check back soon.</p>';
  }

  function revealNewElements() {
    var items = document.querySelectorAll(".reveal:not(.in-view)");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { obs.observe(el); });
  }

  ready(function () {
    if (!window.OmniTools) return;
    window.OmniTools.loadToolsData().then(function (data) {
      var root = window.OmniTools.ROOT;
      var tools = data.tools || [];
      var categories = data.categories || [];
      CATS_BY_ID = {};
      categories.forEach(function (c) { CATS_BY_ID[c.id] = c; });

      // Homepage: popular tools (featured), latest tools (isNew first), categories
      renderInto("#popularToolsGrid", tools.filter(function (t) { return t.featured; }), function (t) { return toolCardHtml(t, root); });
      renderInto("#latestToolsGrid", tools.slice().sort(function (a, b) { return (b.isNew === true) - (a.isNew === true); }).slice(0, 8), function (t) { return toolCardHtml(t, root); });
      renderInto("#categoriesGrid", categories, function (c) { return categoryCardHtml(c, root, tools.filter(function (t) { return t.category === c.id; }).length); });

      // Full "all tools" grid (categories index or a dedicated tools page)
      renderInto("#allToolsGrid", tools, function (t) { return toolCardHtml(t, root); });

      // Live tool count on the homepage hero
      var toolsLive = document.getElementById("toolsLiveStat");
      if (toolsLive) toolsLive.textContent = tools.length;

      // Ticker on homepage hero
      var ticker = document.getElementById("tickerTrack");
      if (ticker) {
        var chips = tools.map(function (t) { return '<span class="ticker-chip"><span aria-hidden="true">' + t.icon + "</span>" + t.name + "</span>"; }).join("");
        ticker.innerHTML = chips + chips;
      }

      // Category landing pages: read data-category attribute on <body>
      var catId = document.body.getAttribute("data-category");
      if (catId) {
        var cat = CATS_BY_ID[catId];
        var filtered = tools.filter(function (t) { return t.category === catId; });
        var titleEl = document.getElementById("categoryTitle");
        var descEl = document.getElementById("categoryDesc");
        if (titleEl && cat) titleEl.textContent = cat.icon + " " + cat.name;
        if (descEl && cat) descEl.textContent = cat.description;
        renderInto("#categoryToolsGrid", filtered, function (t) { return toolCardHtml(t, root); });
      }

      // Related tools on a tool page: read data-tool + data-category on <body>
      var currentToolId = document.body.getAttribute("data-tool");
      var currentCategory = document.body.getAttribute("data-category-of-tool");
      if (currentToolId && currentCategory) {
        var related = tools.filter(function (t) { return t.category === currentCategory && t.id !== currentToolId; }).slice(0, 4);
        renderInto("#relatedToolsGrid", related, function (t) { return toolCardHtml(t, root); });
      }

      // Make all dynamically rendered .reveal elements visible
      revealNewElements();
    });
  });
})();
