(function () {
  "use strict";
  const input = document.getElementById("jsonInput");
  const formatBtn = document.getElementById("formatBtn");
  const minifyBtn = document.getElementById("minifyBtn");
  const errorBox = document.getElementById("jsonError");
  const output = document.getElementById("jsonOutput");
  const copyBtn = document.getElementById("copyBtn");

  function process(minify) {
    errorBox.style.display = "none";
    let parsed;
    try {
      parsed = JSON.parse(input.value);
    } catch (e) {
      errorBox.textContent = "Invalid JSON: " + e.message;
      errorBox.style.display = "flex";
      return;
    }
    output.textContent = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
  }

  formatBtn.addEventListener("click", () => process(false));
  minifyBtn.addEventListener("click", () => process(true));

  copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text || text === "Your formatted JSON will appear here.") return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });
})();
