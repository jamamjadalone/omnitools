(function () {
  "use strict";

  const columnsInput = document.getElementById("columnsInput");
  const thumbSizeInput = document.getElementById("thumbSizeInput");
  const labelsCheck = document.getElementById("labelsCheck");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const emptyState = document.getElementById("emptyState");
  const previewWrap = document.getElementById("previewWrap");
  const previewImg = document.getElementById("previewImg");
  const progressWrap = document.getElementById("progressWrap");

  const MAX_IMAGES = 50;
  const LABEL_H = 32;

  let images = [];
  let sheetCanvas = null;

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read " + file.name));
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve({ img, name: file.name });
        img.onerror = () => reject(new Error("Could not decode " + file.name));
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function loadAll(files) {
    progressWrap.style.display = "block";
    downloadBtn.disabled = true;
    const loaded = [];
    for (let i = 0; i < files.length; i++) {
      try {
        loaded.push(await loadImage(files[i]));
      } catch (err) {
        window.OmniTools.showToast(err.message, "error");
      }
    }
    images = loaded;
    buildSheet();
  }

  function drawThumb(ctx, img, x, y, tw, th) {
    const s = Math.min(tw / img.naturalWidth, th / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx.drawImage(img, x + (tw - dw) / 2, y + (th - dh) / 2, dw, dh);
  }

  function buildSheet() {
    if (!images.length) return;
    progressWrap.style.display = "block";
    downloadBtn.disabled = true;
    const cols = Math.min(8, Math.max(2, parseInt(columnsInput.value, 10) || 4));
    const thumb = Math.min(800, Math.max(100, parseInt(thumbSizeInput.value, 10) || 300));
    const withLabels = labelsCheck.checked;
    const labelH = withLabels ? LABEL_H : 0;
    const rows = Math.ceil(images.length / cols);
    const canvas = document.createElement("canvas");
    canvas.width = cols * thumb;
    canvas.height = rows * (thumb + labelH);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    images.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * thumb;
      const y = row * (thumb + labelH);
      drawThumb(ctx, item.img, x, y, thumb, thumb);
      if (withLabels) {
        let name = item.name.replace(/\.[^.]+$/, "");
        if (name.length > 24) name = name.slice(0, 23) + "…";
        ctx.fillText(name, x + thumb / 2, y + thumb + labelH / 2, thumb);
      }
    });
    sheetCanvas = canvas;
    previewImg.src = canvas.toDataURL("image/jpeg", 0.9);
    emptyState.style.display = "none";
    previewWrap.style.display = "block";
    downloadBtn.disabled = false;
    progressWrap.style.display = "none";
  }

  function downloadSheet() {
    if (!sheetCanvas) return;
    sheetCanvas.toBlob((blob) => {
      if (!blob) {
        window.OmniTools.showToast("Could not create the contact sheet.", "error");
        return;
      }
      window.OmniToolsZip.saveAs(blob, "contact-sheet.jpg");
      window.OmniTools.showToast("Download started.", "success");
    }, "image/jpeg", 0.92);
  }

  function takeFiles(list) {
    const dropped = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!dropped.length) {
      window.OmniTools.showToast("Please choose image files.", "error");
      return;
    }
    if (dropped.length > MAX_IMAGES) {
      window.OmniTools.showToast("Only the first " + MAX_IMAGES + " images will be used.", "warning");
    }
    loadAll(dropped.slice(0, MAX_IMAGES));
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length) takeFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length) takeFiles(fileInput.files);
  });

  [columnsInput, thumbSizeInput, labelsCheck].forEach((el) => {
    el.addEventListener("input", () => { if (images.length) buildSheet(); });
    el.addEventListener("change", () => { if (images.length) buildSheet(); });
  });
  downloadBtn.addEventListener("click", downloadSheet);
})();