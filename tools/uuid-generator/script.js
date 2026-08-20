(function () {
  "use strict";
  const countInput = document.getElementById("uuidCount");
  const generateBtn = document.getElementById("generateBtn");
  const output = document.getElementById("uuidOutput");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  let current = [];

  function makeUuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0,4).join("")}-${hex.slice(4,6).join("")}-${hex.slice(6,8).join("")}-${hex.slice(8,10).join("")}-${hex.slice(10,16).join("")}`;
  }

  function generate() {
    const count = Math.max(1, Math.min(100, parseInt(countInput.value, 10) || 1));
    current = Array.from({ length: count }, makeUuid);
    output.textContent = current.join("\n");
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    if (!current.length) return;
    window.OmniTools.copyText(current.join("\n")).then(() => window.OmniTools.showToast("Copied " + current.length + " UUID(s).", "success"));
  });
  downloadBtn.addEventListener("click", () => {
    if (!current.length) return;
    const blob = new Blob([current.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "uuids.txt";
    a.click();
  });

  generate();
})();
