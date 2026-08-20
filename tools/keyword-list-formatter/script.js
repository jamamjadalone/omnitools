(function () {
  "use strict";

  const inputArea = document.getElementById("inputArea");
  const outputFormat = document.getElementById("outputFormat");
  const dedupeCheck = document.getElementById("dedupeCheck");
  const sortCheck = document.getElementById("sortCheck");
  const lowerCheck = document.getElementById("lowerCheck");
  const formatBtn = document.getElementById("formatBtn");
  const countBadge = document.getElementById("countBadge");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  function parse() {
    let items = inputArea.value
      .split(/[,;\n\t]+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    if (lowerCheck.checked) {
      items = items.map(function (s) { return s.toLowerCase(); });
    }
    if (dedupeCheck.checked) {
      const seen = {};
      items = items.filter(function (s) {
        const key = s.toLowerCase();
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
    }
    if (sortCheck.checked) {
      items.sort(function (a, b) { return a.localeCompare(b); });
    }
    return items;
  }

  function format(items) {
    const fmt = outputFormat.value;
    if (fmt === "lines") return items.join("\n");
    if (fmt === "quoted") return items.map(function (s) { return '"' + s + '"'; }).join(", ");
    if (fmt === "csv") return items.join("\n");
    return items.join(", ");
  }

  function render() {
    const items = parse();
    countBadge.textContent = String(items.length);
    outputBox.textContent = format(items) || "Your formatted keywords will appear here.";
  }

  function download() {
    const items = parse();
    if (!items.length) {
      window.OmniTools.showToast("Nothing to download yet.", "error");
      return;
    }
    const content = format(items);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keywords.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
    window.OmniTools.showToast("Keywords downloaded.", "success");
  }

  formatBtn.addEventListener("click", render);

  copyBtn.addEventListener("click", function () {
    const text = outputBox.textContent;
    if (!text || text.indexOf("Your formatted") === 0) {
      window.OmniTools.showToast("Nothing to copy yet.", "error");
      return;
    }
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Keywords copied to clipboard.", "success");
    });
  });

  downloadBtn.addEventListener("click", download);
  render();
})();