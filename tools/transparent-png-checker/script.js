(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const emptyState = document.getElementById("emptyState");
  const results = document.getElementById("results");
  const verdictAlert = document.getElementById("verdictAlert");
  const statSize = document.getElementById("statSize");
  const statTransparent = document.getElementById("statTransparent");
  const statFully = document.getElementById("statFully");
  const previewImg = document.getElementById("previewImg");

  function analyze(file) {
    if (!file || (file.type !== "image/png" && file.type !== "image/webp")) {
      window.OmniTools.showToast("Please choose a PNG or WebP image.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => window.OmniTools.showToast("Could not read the file.", "error");
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, w, h).data;
        const total = w * h;
        let transparent = 0;
        let fully = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) transparent++;
          if (data[i] === 0) fully++;
        }
        const pct = (transparent / total) * 100;
        statSize.textContent = w + " × " + h + " px";
        statTransparent.textContent = pct.toFixed(1) + "%";
        statFully.textContent = fully.toLocaleString();
        if (transparent > 0) {
          verdictAlert.className = "alert alert-success";
          verdictAlert.textContent = "Transparent PNG confirmed — " + pct.toFixed(1) + "% transparent.";
        } else {
          verdictAlert.className = "alert alert-warning";
          verdictAlert.textContent = "No transparency found — this image is fully opaque.";
        }
        previewImg.src = e.target.result;
        emptyState.style.display = "none";
        results.style.display = "block";
      };
      img.onerror = () => window.OmniTools.showToast("Could not decode the image.", "error");
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) analyze(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) analyze(fileInput.files[0]);
  });
})();