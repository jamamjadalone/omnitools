(function () {
  "use strict";

  const fileNameInput = document.getElementById("fileNameInput");
  const platformSelect = document.getElementById("platformSelect");
  const replacementInput = document.getElementById("replacementInput");
  const cleanBtn = document.getElementById("cleanBtn");
  const copyBtn = document.getElementById("copyBtn");
  const outputBox = document.getElementById("outputBox");
  const detailBox = document.getElementById("detailBox");

  const RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/;

  function isControl(ch) {
    const code = ch.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  }

  function forbidden(ch, platform) {
    if (platform === "mac") {
      return ch === "/" || ch === "\x00";
    }
    if (/[<>:"/\\|?*]/.test(ch)) return true;
    if (isControl(ch)) return true;
    return false;
  }

  function reservedBase(name) {
    return RESERVED.test(name.split(".")[0].toUpperCase());
  }

  function clean() {
    const name = fileNameInput.value;
    const platform = platformSelect.value;
    const repl = replacementInput.value;
    let out = "";
    const seen = new Set();
    const details = [];
    for (const ch of name) {
      if (forbidden(ch, platform)) {
        if (!seen.has(ch)) {
          seen.add(ch);
          details.push({ from: ch, to: repl });
        }
        out += repl;
      } else {
        out += ch;
      }
    }
    if ((platform === "windows" || platform === "all") && reservedBase(name)) {
      out = "_" + out;
      details.unshift({ from: "reserved name", to: "_" });
    }
    outputBox.textContent = out;
    if (!details.length) {
      detailBox.textContent = "No illegal characters found.";
      return;
    }
    detailBox.innerHTML = details.map((d) =>
      '<div class="detail-row"><code>' + window.OmniTools.escapeHtml(d.from) + "</code><span>→</span><code>" + window.OmniTools.escapeHtml(d.to) + "</code></div>"
    ).join("");
    window.OmniTools.showToast("Cleaned " + details.length + " item(s).", "success");
  }

  cleanBtn.addEventListener("click", clean);
  fileNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") clean();
  });

  copyBtn.addEventListener("click", () => {
    const out = outputBox.textContent;
    if (!out) {
      window.OmniTools.showToast("Nothing to copy yet.", "error");
      return;
    }
    window.OmniTools.copyText(out)
      .then(() => window.OmniTools.showToast("Cleaned name copied.", "success"))
      .catch(() => window.OmniTools.showToast("Copy failed.", "error"));
  });
})();