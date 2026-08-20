(function () {
  "use strict";

  const ratioSelect = document.getElementById("ratioSelect");
  const formatSelect = document.getElementById("formatSelect");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const emptyState = document.getElementById("emptyState");
  const cropWrap = document.getElementById("cropWrap");
  const cropStage = document.getElementById("cropStage");
  const sourceCanvas = document.getElementById("sourceCanvas");
  const cropOverlay = document.getElementById("cropOverlay");

  const STAGE_MAX_W = 560;
  const STAGE_MAX_H = 420;

  let previewDataUrl = "";
  let naturalWidth = 0;
  let naturalHeight = 0;
  let stageScale = 1;
  let crop = { x: 0, y: 0, w: 0, h: 0 };
  let dragging = false;
  let dragStart = { x: 0, y: 0 };
  let cropStart = { x: 0, y: 0 };

  function ratioFor() {
    const v = ratioSelect.value;
    if (v === "free") return null;
    const parts = v.split(":").map(Number);
    return parts[0] / parts[1];
  }

  function loadImage(file) {
    if (!file || !file.type.startsWith("image/")) {
      window.OmniTools.showToast("Please choose an image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => window.OmniTools.showToast("Could not read the file.", "error");
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        naturalWidth = img.naturalWidth;
        naturalHeight = img.naturalHeight;
        sourceCanvas.width = naturalWidth;
        sourceCanvas.height = naturalHeight;
        const sctx = sourceCanvas.getContext("2d");
        sctx.drawImage(img, 0, 0);
        previewDataUrl = e.target.result;
        setupStage();
      };
      img.onerror = () => window.OmniTools.showToast("Could not decode the image.", "error");
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function setupStage() {
    const scale = Math.min(STAGE_MAX_W / naturalWidth, STAGE_MAX_H / naturalHeight, 1);
    stageScale = scale;
    const stageW = Math.max(1, Math.round(naturalWidth * scale));
    const stageH = Math.max(1, Math.round(naturalHeight * scale));
    cropStage.style.width = stageW + "px";
    cropStage.style.height = stageH + "px";
    cropStage.style.backgroundImage = "url(" + previewDataUrl + ")";
    cropStage.style.backgroundSize = stageW + "px " + stageH + "px";

    const ratio = ratioFor();
    let cw, ch;
    if (ratio === null) {
      cw = stageW;
      ch = stageH;
    } else if (ratio >= stageW / stageH) {
      cw = stageW;
      ch = Math.max(1, Math.round(stageW / ratio));
    } else {
      ch = stageH;
      cw = Math.max(1, Math.round(stageH * ratio));
    }
    crop = { x: Math.round((stageW - cw) / 2), y: Math.round((stageH - ch) / 2), w: cw, h: ch };
    renderOverlay();
    emptyState.style.display = "none";
    cropWrap.style.display = "block";
    downloadBtn.disabled = false;
  }

  function renderOverlay() {
    cropOverlay.style.width = crop.w + "px";
    cropOverlay.style.height = crop.h + "px";
    cropOverlay.style.transform = "translate(" + crop.x + "px," + crop.y + "px)";
  }

  function downloadCrop() {
    if (!naturalWidth) return;
    const sx = crop.x / stageScale;
    const sy = crop.y / stageScale;
    const cw = Math.max(1, Math.round(crop.w / stageScale));
    const ch = Math.max(1, Math.round(crop.h / stageScale));
    const cx = Math.min(Math.max(0, Math.round(sx)), naturalWidth - cw);
    const cy = Math.min(Math.max(0, Math.round(sy)), naturalHeight - ch);
    const out = document.createElement("canvas");
    out.width = cw;
    out.height = ch;
    const octx = out.getContext("2d");
    octx.drawImage(sourceCanvas, cx, cy, cw, ch, 0, 0, cw, ch);
    const type = formatSelect.value;
    out.toBlob((blob) => {
      if (!blob) {
        window.OmniTools.showToast("Could not create the cropped image.", "error");
        return;
      }
      const ext = type === "image/jpeg" ? "jpg" : type.split("/")[1];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "crop." + ext;
      a.click();
      window.OmniTools.showToast("Download started.", "success");
    }, type, type === "image/png" ? undefined : 0.92);
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) loadImage(fileInput.files[0]);
  });

  cropStage.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    cropStart = { x: crop.x, y: crop.y };
    e.preventDefault();
    try { cropStage.setPointerCapture(e.pointerId); } catch (err) {}
  });
  cropStage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const stageW = cropStage.clientWidth;
    const stageH = cropStage.clientHeight;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    crop.x = Math.min(Math.max(cropStart.x + dx, 0), Math.max(0, stageW - crop.w));
    crop.y = Math.min(Math.max(cropStart.y + dy, 0), Math.max(0, stageH - crop.h));
    renderOverlay();
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { if (cropStage.hasPointerCapture(e.pointerId)) cropStage.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  cropStage.addEventListener("pointerup", endDrag);
  cropStage.addEventListener("pointercancel", endDrag);

  ratioSelect.addEventListener("change", () => { if (naturalWidth) setupStage(); });
  downloadBtn.addEventListener("click", downloadCrop);
})();