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

  ready(function () {
    if (!window.OmniTools) return;
    window.OmniTools.loadToolsData().then((data) => {
      const root = window.OmniTools.ROOT;
      const tools = data.tools || [];
      const categories = data.categories || [];
      CATS_BY_ID = {};
      categories.forEach((c) => (CATS_BY_ID[c.id] = c));

      // Homepage: popular tools (featured), latest tools (isNew first), categories
      renderInto("#popularToolsGrid", tools.filter((t) => t.featured), (t) => toolCardHtml(t, root));
      renderInto("#latestToolsGrid", [...tools].sort((a, b) => (b.isNew === true) - (a.isNew === true)).slice(0, 8), (t) => toolCardHtml(t, root));
      renderInto("#categoriesGrid", categories, (c) => categoryCardHtml(c, root, tools.filter((t) => t.category === c.id).length));

      // Full "all tools" grid (categories index or a dedicated tools page)
      renderInto("#allToolsGrid", tools, (t) => toolCardHtml(t, root));

      // Ticker on homepage hero
      const ticker = document.getElementById("tickerTrack");
      if (ticker) {
        const chips = tools.map((t) => '<span class="ticker-chip"><span aria-hidden="true">' + t.icon + "</span>" + t.name + "</span>").join("");
        ticker.innerHTML = chips + chips; // duplicate for seamless loop
      }

      // Category landing pages: read data-category attribute on <body>
      const catId = document.body.getAttribute("data-category");
      if (catId) {
        const cat = CATS_BY_ID[catId];
        const filtered = tools.filter((t) => t.category === catId);
        const titleEl = document.getElementById("categoryTitle");
        const descEl = document.getElementById("categoryDesc");
        if (titleEl && cat) titleEl.textContent = cat.icon + " " + cat.name;
        if (descEl && cat) descEl.textContent = cat.description;
        renderInto("#categoryToolsGrid", filtered, (t) => toolCardHtml(t, root));
      }

      // Related tools on a tool page: read data-tool + data-category on <body>
      const currentToolId = document.body.getAttribute("data-tool");
      const currentCategory = document.body.getAttribute("data-category-of-tool");
      if (currentToolId && currentCategory) {
        const related = tools.filter((t) => t.category === currentCategory && t.id !== currentToolId).slice(0, 4);
        renderInto("#relatedToolsGrid", related, (t) => toolCardHtml(t, root));
      }
    });
  });
})();
