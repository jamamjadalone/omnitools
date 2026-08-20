(function () {
  "use strict";
  const cssInput = document.getElementById("cssInput");
  const minifyBtn = document.getElementById("minifyBtn");
  const copyBtn = document.getElementById("copyBtn");
  const output = document.getElementById("cssOutput");
  const statsBox = document.getElementById("cssStats");
  const originalSize = document.getElementById("originalSize");
  const minifiedSize = document.getElementById("minifiedSize");
  const savedPercent = document.getElementById("savedPercent");

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    return (bytes / 1024).toFixed(2) + " KB";
  }

  function minifyCss(css) {
    let result = css;

    result = result.replace(/\/\*[\s\S]*?\*\//g, "");

    result = result.replace(/@(?:charset|import|namespace)[^;]*;/gi, function (m) { return m; });

    result = result.replace(/\s+/g, " ");
    result = result.replace(/\s*([{}:;,>~+])\s*/g, "$1");
    result = result.replace(/;}/g, "}");
    result = result.replace(/\s*!important/g, "!important");

    result = result.replace(/:\s*0(px|em|rem|%|pt|cm|mm|in|pc|ex|vh|vw|vmin|vmax)/g, ":0");

    result = result.replace(/\s*([{}])\s*/g, "$1");

    let inString = false;
    let stringChar = "";
    let cleaned = "";
    for (let i = 0; i < result.length; i++) {
      const ch = result[i];
      if (!inString && (ch === '"' || ch === "'")) {
        inString = true;
        stringChar = ch;
        cleaned += ch;
      } else if (inString && ch === stringChar && result[i - 1] !== "\\") {
        inString = false;
        cleaned += ch;
      } else if (!inString && ch === " ") {
        const prev = cleaned[cleaned.length - 1];
        const next = result[i + 1];
        if (prev && next && /[a-zA-Z0-9_-]/.test(prev) && /[a-zA-Z0-9_-]/.test(next)) {
          cleaned += ch;
        }
      } else {
        cleaned += ch;
      }
    }

    return cleaned.trim();
  }

  function doMinify() {
    const css = cssInput.value;
    if (!css.trim()) {
      output.textContent = "Paste some CSS first.";
      statsBox.style.display = "none";
      return;
    }

    const minified = minifyCss(css);
    output.textContent = minified;

    const origBytes = new Blob([css]).size;
    const minBytes = new Blob([minified]).size;
    const pct = origBytes > 0 ? Math.round((1 - minBytes / origBytes) * 100) : 0;

    statsBox.style.display = "block";
    originalSize.textContent = formatSize(origBytes);
    minifiedSize.textContent = formatSize(minBytes);
    savedPercent.textContent = pct + "%";
  }

  minifyBtn.addEventListener("click", doMinify);
  copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text || text === "Minified CSS will appear here.") return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });
})();
