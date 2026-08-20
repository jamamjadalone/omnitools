(function () {
  "use strict";
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const controls = document.getElementById("controls");
  const qualityRange = document.getElementById("qualityRange");
  const qualityValue = document.getElementById("qualityValue");
  const formatSelect = document.getElementById("formatSelect");
  const downloadBtn = document.getElementById("downloadBtn");
  const resetBtn = document.getElementById("resetBtn");
  const previewEmpty = document.getElementById("previewEmpty");
  const previewResult = document.getElementById("previewResult");
  const previewImg = document.getElementById("previewImg");
  const originalSizeEl = document.getElementById("originalSize");
  const compressedSizeEl = document.getElementById("compressedSize");
  const savingsPctEl = document.getElementById("savingsPct");

  let originalBytes = 0;
  let sourceImage = null;
  let currentBlob = null;

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function openFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      window.OmniTools.showToast("Please choose a valid image file.", "error");
      return;
    }
    originalBytes = file.size;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        sourceImage = img;
        controls.style.display = "block";
        compress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function compress() {
    if (!sourceImage) return;
    const canvas = document.createElement("canvas");
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(sourceImage, 0, 0);
    const quality = parseInt(qualityRange.value, 10) / 100;
    const type = formatSelect.value;
    canvas.toBlob((blob) => {
      if (!blob) return;
      currentBlob = blob;
      previewImg.src = URL.createObjectURL(blob);
      previewEmpty.style.display = "none";
      previewResult.style.display = "flex";
      originalSizeEl.textContent = fmtBytes(originalBytes);
      compressedSizeEl.textContent = fmtBytes(blob.size);
      const saved = Math.max(0, Math.round((1 - blob.size / originalBytes) * 100));
      savingsPctEl.textContent = saved + "%";
    }, type, type === "image/png" ? undefined : quality);
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") fileInput.click(); });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) openFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", (e) => { if (e.target.files[0]) openFile(e.target.files[0]); });

  qualityRange.addEventListener("input", () => {
    qualityValue.textContent = qualityRange.value + "%";
    compress();
  });
  formatSelect.addEventListener("change", compress);

  downloadBtn.addEventListener("click", () => {
    if (!currentBlob) return;
    const ext = formatSelect.value.split("/")[1];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(currentBlob);
    a.download = "compressed." + ext;
    a.click();
    window.OmniTools.showToast("Download started.", "success");
  });

  resetBtn.addEventListener("click", () => {
    sourceImage = null;
    currentBlob = null;
    controls.style.display = "none";
    previewResult.style.display = "none";
    previewEmpty.style.display = "block";
    fileInput.value = "";
  });
})();
