(function () {
  "use strict";

  const descInput = document.getElementById("descInput");
  const contextSelect = document.getElementById("contextSelect");
  const generateBtn = document.getElementById("generateBtn");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");

  function capFirst(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function clean(desc) {
    return desc.trim().replace(/[.!?]+$/, "").replace(/\s+/g, " ");
  }

  function fit(text) {
    if (text.length <= 125) return text;
    return text.slice(0, 122).replace(/\s+\S*$/, "") + "...";
  }

  function generate() {
    const raw = clean(descInput.value);
    if (!raw) {
      outputBox.textContent = "Describe the image above, then generate alt text.";
      window.OmniTools.showToast("Describe the image first.", "error");
      return;
    }
    const ctx = contextSelect.value;
    if (ctx === "decorative") {
      outputBox.textContent = 'This image is decorative — use empty alt text (alt="") so screen readers skip it.';
      return;
    }
    let text;
    if (ctx === "product") {
      text = "Product photo of " + raw + ".";
    } else if (ctx === "tutorial") {
      text = "Screenshot or diagram of " + raw + ".";
    } else {
      text = "Photograph of " + raw + ".";
    }
    outputBox.textContent = fit(capFirst(text));
  }

  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", function () {
    const text = outputBox.textContent;
    if (!text || text.indexOf("Describe the image") === 0) {
      window.OmniTools.showToast("Nothing to copy yet.", "error");
      return;
    }
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Alt text copied to clipboard.", "success");
    });
  });
})();