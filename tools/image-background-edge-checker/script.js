(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const zoomRange = document.getElementById("zoomRange");
  const zoomValue = document.getElementById("zoomValue");
  const bgSelect = document.getElementById("bgSelect");
  const previewImg = document.getElementById("previewImg");
  const previewStage = document.getElementById("previewStage");
  const statSize = document.getElementById("statSize");
  const statMode = document.getElementById("statMode");
  const statAlpha = document.getElementById("statAlpha");
  const alphaWarning = document.getElementById("alphaWarning");

  let imgNaturalWidth = 0;
  let imgNaturalHeight = 0;
  let hasAlpha = false;
  let colorMode = "—";

  function drawCheckerboard() {
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 40, 40);
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillRect(20, 20, 20, 20);
    return "url(" + canvas.toDataURL() + ")";
  }

  function applyBackground() {
    const bg = bgSelect.value;
    if (bg === "checker") {
      previewStage.style.backgroundImage = drawCheckerboard();
      previewStage.style.backgroundColor = "transparent";
    } else {
      previewStage.style.backgroundImage = "none";
      previewStage.style.backgroundColor = bg;
    }
  }

  function analyze(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imgNaturalWidth = img.naturalWidth;
        imgNaturalHeight = img.naturalHeight;
        previewImg.src = e.target.result;
        statSize.textContent = imgNaturalWidth + " × " + imgNaturalHeight + " px";

        const canvas = document.createElement("canvas");
        canvas.width = imgNaturalWidth;
        canvas.height = imgNaturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        hasAlpha = false;
        let transparentCount = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) { hasAlpha = true; transparentCount++; }
        }
        const alphaPct = ((transparentCount / (data.length / 4)) * 100).toFixed(1);
        statMode.textContent = imageData.colorSpace === "srgb" ? "sRGB" : "Unknown";
        statAlpha.textContent = hasAlpha ? alphaPct + "% transparent" : "None";

        alphaWarning.style.display = hasAlpha ? "none" : "block";
        applyBackground();
        applyZoom();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function applyZoom() {
    const zoom = parseInt(zoomRange.value, 10) / 100;
    zoomValue.textContent = zoomRange.value + "%";
    previewImg.style.width = Math.round(imgNaturalWidth * zoom) + "px";
    previewImg.style.height = "auto";
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/webp")) analyze(file);
    else if (file) window.OmniTools.showToast("Please choose a PNG or WebP image.", "error");
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) analyze(file);
  });
  bgSelect.addEventListener("change", applyBackground);
  zoomRange.addEventListener("input", applyZoom);

  applyBackground();
})();