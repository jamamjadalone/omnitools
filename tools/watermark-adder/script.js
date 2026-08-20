(function () {
  "use strict";

  const watermarkText = document.getElementById("watermarkText");
  const positionSelect = document.getElementById("positionSelect");
  const opacityRange = document.getElementById("opacityRange");
  const opacityValue = document.getElementById("opacityValue");
  const sizeRange = document.getElementById("sizeRange");
  const sizeValue = document.getElementById("sizeValue");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const previewImg = document.getElementById("previewImg");
  const progressWrap = document.getElementById("progressWrap");

  let files = [];

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

  function drawWatermark(ctx, img) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const text = watermarkText.value.trim();
    if (!text) return;
    const size = Math.max(8, Math.round(w * (parseInt(sizeRange.value, 10) || 5) / 100));
    ctx.font = "600 " + size + "px sans-serif";
    ctx.globalAlpha = (parseInt(opacityRange.value, 10) || 60) / 100;
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = Math.max(2, Math.round(size / 8));
    ctx.fillStyle = "#ffffff";
    const pad = Math.max(8, Math.round(w * 0.03));
    const pos = positionSelect.value;
    let x, y;
    if (pos === "bottom-right") { ctx.textAlign = "right"; ctx.textBaseline = "bottom"; x = w - pad; y = h - pad; }
    else if (pos === "bottom-left") { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; x = pad; y = h - pad; }
    else if (pos === "top-right") { ctx.textAlign = "right"; ctx.textBaseline = "top"; x = w - pad; y = pad; }
    else if (pos === "top-left") { ctx.textAlign = "left"; ctx.textBaseline = "top"; x = pad; y = pad; }
    else { ctx.textAlign = "center"; ctx.textBaseline = "middle"; x = w / 2; y = h / 2; }
    ctx.fillText(text, x, y);
  }

  function renderPreview() {
    if (!files.length) return;
    loadImage(files[0]).then(({ img }) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      drawWatermark(ctx, img);
      previewImg.src = canvas.toDataURL("image/jpeg", 0.9);
    }).catch((err) => window.OmniTools.showToast(err.message, "error"));
  }

  async function downloadAll() {
    if (!files.length) return;
    progressWrap.style.display = "block";
    downloadBtn.disabled = true;
    const items = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const { img } = await loadImage(f);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        drawWatermark(ctx, img);
        const type = f.type && f.type.startsWith("image/") ? f.type : "image/jpeg";
        const blob = await new Promise((res) => canvas.toBlob((b) => res(b), type, type === "image/png" ? undefined : 0.92));
        if (blob) items.push({ name: f.name, blob });
      }
      if (!items.length) throw new Error("No images could be watermarked.");
      await window.OmniToolsZip.save(items, "watermarked-images.zip");
      window.OmniTools.showToast("ZIP download started (" + items.length + " files).", "success");
    } catch (err) {
      window.OmniTools.showToast("Failed: " + err.message, "error");
    } finally {
      progressWrap.style.display = "none";
      downloadBtn.disabled = false;
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
    if (dropped.length) { files = dropped; downloadBtn.disabled = false; renderPreview(); }
    else if ((e.dataTransfer.files || []).length) window.OmniTools.showToast("Please choose image files.", "error");
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length) {
      files = Array.from(fileInput.files).filter((f) => f.type.startsWith("image/"));
      if (files.length) { downloadBtn.disabled = false; renderPreview(); }
    }
  });

  watermarkText.addEventListener("input", renderPreview);
  positionSelect.addEventListener("change", renderPreview);
  opacityRange.addEventListener("input", () => {
    opacityValue.textContent = opacityRange.value + "%";
    renderPreview();
  });
  sizeRange.addEventListener("input", () => {
    sizeValue.textContent = sizeRange.value + "%";
    renderPreview();
  });
  downloadBtn.addEventListener("click", downloadAll);
})();