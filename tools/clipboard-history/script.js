(function () {
  "use strict";
  var input = document.getElementById("clipInput");
  var addBtn = document.getElementById("addBtn");
  var pasteBtn = document.getElementById("pasteBtn");
  var clearAllBtn = document.getElementById("clearAllBtn");
  var exportBtn = document.getElementById("exportBtn");
  var historyEl = document.getElementById("clipHistory");
  var countEl = document.getElementById("entryCount");
  var STORAGE_KEY = "omnitools_clipboard_history";
  var MAX_ENTRIES = 50;

  function getEntries() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function render() {
    var entries = getEntries();
    countEl.textContent = entries.length;
    historyEl.innerHTML = "";
    if (entries.length === 0) {
      historyEl.innerHTML = '<p style="color:var(--text-dim);padding:12px;">No saved entries yet.</p>';
      return;
    }
    entries.forEach(function (entry, i) {
      var div = document.createElement("div");
      div.className = "clip-entry";
      div.innerHTML = '<div class="clip-entry-text">' + escHtml(entry.text) + '</div>' +
        '<div class="clip-entry-time">' + entry.time + '</div>' +
        '<button class="clip-entry-del" title="Delete">×</button>';
      div.addEventListener("click", function (e) {
        if (e.target.classList.contains("clip-entry-del")) {
          entries.splice(i, 1);
          saveEntries(entries);
          render();
          return;
        }
        window.OmniTools.copyText(entry.text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
      });
      historyEl.appendChild(div);
    });
  }

  function escHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function addEntry() {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text.", "error"); return; }
    var entries = getEntries();
    entries.unshift({ text: text, time: new Date().toLocaleString() });
    if (entries.length > MAX_ENTRIES) entries = entries.slice(0, MAX_ENTRIES);
    saveEntries(entries);
    input.value = "";
    render();
  }

  addBtn.addEventListener("click", addEntry);
  pasteBtn.addEventListener("click", function () {
    navigator.clipboard.readText().then(function (text) {
      input.value = text;
      addEntry();
    }).catch(function () {
      window.OmniTools.showToast("Could not read clipboard.", "error");
    });
  });
  clearAllBtn.addEventListener("click", function () {
    if (confirm("Clear all saved entries?")) {
      saveEntries([]);
      render();
    }
  });
  exportBtn.addEventListener("click", function () {
    var entries = getEntries();
    if (entries.length === 0) { window.OmniTools.showToast("No entries to export.", "error"); return; }
    var text = entries.map(function (e) { return "[" + e.time + "]\n" + e.text; }).join("\n\n---\n\n");
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Exported to clipboard!", "success"); });
  });
  render();
})();
