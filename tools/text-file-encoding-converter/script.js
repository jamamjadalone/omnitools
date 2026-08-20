(function () {
  "use strict";

  const fileInput = document.getElementById("fileInput");
  const sourceEncoding = document.getElementById("sourceEncoding");
  const targetEncoding = document.getElementById("targetEncoding");
  const bomCheck = document.getElementById("bomCheck");
  const outNameInput = document.getElementById("outNameInput");
  const convertBtn = document.getElementById("convertBtn");
  const previewBox = document.getElementById("previewBox");

  let buffer = null;

  function readBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Could not read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  function detectBom(bytes) {
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return "utf-8";
    if (bytes[0] === 0xff && bytes[1] === 0xfe) return "utf-16le";
    if (bytes[0] === 0xfe && bytes[1] === 0xff) return "utf-16be";
    return null;
  }

  function decodeText() {
    const enc = sourceEncoding.value === "latin1" ? "iso-8859-1" : sourceEncoding.value;
    return new TextDecoder(enc, { ignoreBOM: false }).decode(buffer);
  }

  function showPreview(text) {
    const limited = text.length > 10000 ? text.slice(0, 10000) + "\n… (preview truncated)" : text;
    previewBox.textContent = limited;
  }

  async function loadFile(file) {
    if (!file) return;
    try {
      buffer = await readBuffer(file);
      const bytes = new Uint8Array(buffer);
      const bom = detectBom(bytes);
      if (bom) sourceEncoding.value = bom;
      showPreview(decodeText());
      convertBtn.disabled = false;
      window.OmniTools.showToast("Loaded " + file.name + " — " + (bom ? "detected " + bom.toUpperCase() : "no BOM, using selected encoding") + ".", "success");
    } catch (err) {
      buffer = null;
      convertBtn.disabled = true;
      window.OmniTools.showToast("Could not read file: " + err.message, "error");
    }
  }

  function encodeText(text) {
    const target = targetEncoding.value;
    const withBom = bomCheck.checked;
    if (target === "utf-8") {
      const bytes = new TextEncoder().encode(text);
      if (!withBom) return bytes;
      const out = new Uint8Array(bytes.length + 3);
      out[0] = 0xef;
      out[1] = 0xbb;
      out[2] = 0xbf;
      out.set(bytes, 3);
      return out;
    }
    const little = target === "utf-16le";
    const view = new DataView(new ArrayBuffer(text.length * 2));
    for (let i = 0; i < text.length; i++) {
      view.setUint16(i * 2, text.charCodeAt(i), little);
    }
    const bytes = new Uint8Array(view.buffer);
    if (!withBom) return bytes;
    const out = new Uint8Array(bytes.length + 2);
    out[0] = little ? 0xff : 0xfe;
    out[1] = little ? 0xfe : 0xff;
    out.set(bytes, 2);
    return out;
  }

  function convert() {
    if (!buffer) return;
    try {
      const text = decodeText();
      const bytes = encodeText(text);
      const blob = new Blob([bytes], { type: "text/plain" });
      let name = outNameInput.value.trim() || "converted.txt";
      if (!/\.[a-z0-9]+$/i.test(name)) name += ".txt";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }, 500);
      window.OmniTools.showToast("Converted to " + targetEncoding.value + " and downloaded.", "success");
    } catch (err) {
      window.OmniTools.showToast("Conversion failed: " + err.message, "error");
    }
  }

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) loadFile(fileInput.files[0]);
  });

  sourceEncoding.addEventListener("change", () => {
    if (buffer) showPreview(decodeText());
  });

  convertBtn.addEventListener("click", convert);
})();