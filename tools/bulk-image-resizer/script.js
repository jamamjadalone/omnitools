(function () {
  "use strict";

  const modeSelect = document.getElementById("modeSelect");
  const dimWrap = document.getElementById("dimWrap");
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const scaleWrap = document.getElementById("scaleWrap");
  const scaleInput = document.getElementById("scaleInput");
  const filesizeWrap = document.getElementById("filesizeWrap");
  const targetKBInput = document.getElementById("targetKBInput");
  const keepAspect = document.getElementById("keepAspect");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const progressWrap = document.getElementById("progressWrap");
  const progressText = document.getElementById("progressText");
  const logBox = document.getElementById("logBox");

  let files = [];
  let results = [];

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function baseOf(name) {
    const dot = name.lastIndexOf(".");
    return dot > 0 ? name.slice(0, dot) : name;
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read " + file.name));
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve({ file, img });
        img.onerror = () => reject(new Error("Could not decode " + file.name));
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function encodeToTarget(canvas, targetBytes) {
    return new Promise((resolve) => {
      const qualities = [0.92, 0.85, 0.75, 0.65, 0.55, 0.5];
      let index = 0;
      let best = null;
      const tryNext = () => {
        if (index >= qualities.length) { resolve(best); return; }
        canvas.toBlob((b) => {
          if (!b) { resolve(best); return; }
          best = b;
          if (b.size <= targetBytes) { resolve(b); return; }
          index++;
          tryNext();
        }, "image/jpeg", qualities[index]);
      };
      tryNext();
    });
  }

  function syncModeUI() {
    const mode = modeSelect.value;
    dimWrap.style.display = mode === "dimensions" ? "block" : "none";
    scaleWrap.style.display = mode === "scale" ? "block" : "none";
    filesizeWrap.style.display = mode === "filesize" ? "block" : "none";
    if (files.length) process();
  }

  async function process() {
    if (!files.length) return;
    progressWrap.style.display = "block";
    progressText.textContent = "Resizing…";
    downloadBtn.disabled = true;
    logBox.textContent = "";
    const lines = [];
    const out = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      progressText.textContent = "Resizing " + (i + 1) + " of " + files.length + "…";
      let entry;
      try {
        entry = await loadImage(f);
      } catch (err) {
        window.OmniTools.showToast(err.message, "error");
        continue;
      }
      const mode = modeSelect.value;
      const naturalW = entry.img.naturalWidth;
      const naturalH = entry.img.naturalHeight;
      const type = mode === "filesize" ? "image/jpeg" : (entry.file.type && entry.file.type.startsWith("image/") ? entry.file.type : "image/jpeg");
      let w = naturalW;
      let h = naturalH;
      if (mode === "dimensions") {
        const mw = Math.max(1, parseInt(widthInput.value, 10) || naturalW);
        const mh = Math.max(1, parseInt(heightInput.value, 10) || naturalH);
        if (keepAspect.checked) {
          const s = Math.min(mw / w, mh / h, 1);
          w = Math.max(1, Math.round(w * s));
          h = Math.max(1, Math.round(h * s));
        } else {
          w = mw;
          h = mh;
        }
      } else if (mode === "scale") {
        const s = (parseInt(scaleInput.value, 10) || 100) / 100;
        w = Math.max(1, Math.round(w * s));
        h = Math.max(1, Math.round(h * s));
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(entry.img, 0, 0, w, h);
      let blob = null;
      if (mode === "filesize") {
        const target = Math.max(1, parseInt(targetKBInput.value, 10) || 200) * 1024;
        blob = await encodeToTarget(canvas, target);
      } else {
        blob = await new Promise((res) => canvas.toBlob((b) => res(b), type, 0.92));
      }
      if (!blob) {
        window.OmniTools.showToast("Could not encode " + f.name, "error");
        continue;
      }
      const ext = type === "image/jpeg" ? "jpg" : type.split("/")[1];
      out.push({ name: baseOf(f.name) + "." + ext, blob });
      lines.push(f.name + " (" + w + " × " + h + ") → " + fmtBytes(blob.size));
    }
    progressWrap.style.display = "none";
    results = out;
    logBox.textContent = lines.join("\n") || "No images could be processed.";
    downloadBtn.disabled = !results.length;
    if (results.length) window.OmniTools.showToast("Processed " + results.length + " image(s).", "success");
  }

  async function downloadAll() {
    if (!results.length) return;
    try {
      await window.OmniToolsZip.save(results, "resized-images.zip");
      window.OmniTools.showToast("ZIP download started (" + results.length + " files).", "success");
    } catch (err) {
      window.OmniTools.showToast("Failed to create ZIP: " + err.message, "error");
    }
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const dropped = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (dropped.length) { files = dropped; process(); }
    else if ((e.dataTransfer.files || []).length) window.OmniTools.showToast("Please choose image files.", "error");
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length) {
      files = Array.from(fileInput.files).filter((f) => f.type.startsWith("image/"));
      if (files.length) process();
    }
  });

  modeSelect.addEventListener("change", syncModeUI);
  [widthInput, heightInput, scaleInput, targetKBInput, keepAspect].forEach((el) => {
    el.addEventListener("input", () => { if (files.length) process(); });
  });
  downloadBtn.addEventListener("click", downloadAll);

  syncModeUI();
})();