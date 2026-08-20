(function () {
  "use strict";
  var input = document.getElementById("jsonInput");
  var output = document.getElementById("treeOutput");
  var viewBtn = document.getElementById("viewBtn");
  var expandAllBtn = document.getElementById("expandAllBtn");
  var collapseAllBtn = document.getElementById("collapseAllBtn");

  function renderValue(val, key, depth) {
    if (val === null) return '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-null">null</span>';
    if (typeof val === "boolean") return '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-boolean">' + val + '</span>';
    if (typeof val === "number") return '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-number">' + val + '</span>';
    if (typeof val === "string") return '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-string">"' + escHtml(val) + '"</span>';
    return "";
  }

  function escHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function buildTree(data, key, depth) {
    var div = document.createElement("div");
    div.className = "tree-node";

    if (Array.isArray(data)) {
      var header = document.createElement("div");
      header.className = "tree-toggle";
      var items = data.length;
      var preview = items === 0 ? "[]" : "[" + items + " item" + (items === 1 ? "" : "s") + "]";
      header.innerHTML = '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-bracket">[</span> <span class="tree-preview">' + preview + '</span>';
      header.dataset.treeTarget = "";
      div.appendChild(header);

      var children = document.createElement("div");
      children.className = "tree-children";
      children.style.display = depth < 1 ? "block" : "none";
      data.forEach(function (item, i) {
        children.appendChild(buildTree(item, String(i), depth + 1));
      });
      var closing = document.createElement("div");
      closing.className = "tree-bracket";
      closing.textContent = "]";
      children.appendChild(closing);
      div.appendChild(children);

      header.addEventListener("click", function () {
        children.style.display = children.style.display === "none" ? "block" : "none";
        var isOpen = children.style.display !== "none";
        header.innerHTML = '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-bracket">[</span> <span class="tree-preview">' + (isOpen ? "" : preview) + '</span>';
      });
    } else if (typeof data === "object" && data !== null) {
      var keys = Object.keys(data);
      var h2 = document.createElement("div");
      h2.className = "tree-toggle";
      var preview2 = keys.length === 0 ? "{}" : "{" + keys.length + " key" + (keys.length === 1 ? "" : "s") + "}";
      h2.innerHTML = '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-bracket">{</span> <span class="tree-preview">' + preview2 + '</span>';
      div.appendChild(h2);

      var ch2 = document.createElement("div");
      ch2.className = "tree-children";
      ch2.style.display = depth < 1 ? "block" : "none";
      keys.forEach(function (k) {
        ch2.appendChild(buildTree(data[k], k, depth + 1));
      });
      var cl2 = document.createElement("div");
      cl2.className = "tree-bracket";
      cl2.textContent = "}";
      ch2.appendChild(cl2);
      div.appendChild(ch2);

      h2.addEventListener("click", function () {
        ch2.style.display = ch2.style.display === "none" ? "block" : "none";
        var isOpen = ch2.style.display !== "none";
        h2.innerHTML = '<span class="tree-key">' + escHtml(key) + '</span>: <span class="tree-bracket">{</span> <span class="tree-preview">' + (isOpen ? "" : preview2) + '</span>';
      });
    } else {
      div.innerHTML = renderValue(data, key, depth);
    }
    return div;
  }

  function parseAndRender() {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter JSON first.", "error"); return; }
    try {
      var data = JSON.parse(text);
      output.innerHTML = "";
      output.appendChild(buildTree(data, "root", 0));
    } catch (e) {
      output.innerHTML = '<p style="color:#e74c3c;">JSON parse error: ' + escHtml(e.message) + '</p>';
    }
  }

  function setAll(state) {
    var nodes = output.querySelectorAll(".tree-children");
    nodes.forEach(function (n) { n.style.display = state ? "block" : "none"; });
    var toggles = output.querySelectorAll(".tree-toggle");
    toggles.forEach(function (t) {
      var span = t.querySelector(".tree-preview");
      if (span) span.textContent = "";
    });
  }

  viewBtn.addEventListener("click", parseAndRender);
  expandAllBtn.addEventListener("click", function () { setAll(true); });
  collapseAllBtn.addEventListener("click", function () { setAll(false); });
})();
