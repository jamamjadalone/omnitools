(function () {
  "use strict";
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const colorCount = document.getElementById("colorCount");
  const colorCountValue = document.getElementById("colorCountValue");
  const paletteEmpty = document.getElementById("paletteEmpty");
  const swatchGrid = document.getElementById("swatchGrid");

  let currentImage = null;

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function quantize(pixels, k) {
    // simple k-means style clustering over sampled pixels
    let centroids = [];
    for (let i = 0; i < k; i++) {
      centroids.push(pixels[Math.floor((i / k) * pixels.length)].slice());
    }
    for (let iter = 0; iter < 6; iter++) {
      const buckets = Array.from({ length: k }, () => []);
      for (const p of pixels) {
        let best = 0, bestDist = Infinity;
        for (let c = 0; c < k; c++) {
          const dx = p[0] - centroids[c][0], dy = p[1] - centroids[c][1], dz = p[2] - centroids[c][2];
          const dist = dx * dx + dy * dy + dz * dz;
          if (dist < bestDist) { bestDist = dist; best = c; }
        }
        buckets[best].push(p);
      }
      centroids = buckets.map((bucket, i) => {
        if (!bucket.length) return centroids[i];
        const sum = bucket.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]);
        return [Math.round(sum[0] / bucket.length), Math.round(sum[1] / bucket.length), Math.round(sum[2] / bucket.length)];
      });
    }
    return centroids;
  }

  function extractPalette(img, k) {
    const canvas = document.createElement("canvas");
    const maxDim = 150;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue; // skip transparent
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
    if (!pixels.length) return [];
    return quantize(pixels, Math.min(k, pixels.length));
  }

  function render() {
    if (!currentImage) return;
    const k = parseInt(colorCount.value, 10);
    const colors = extractPalette(currentImage, k);
    swatchGrid.innerHTML = colors.map(([r, g, b]) => {
      const hex = rgbToHex(r, g, b);
      return (
        '<div class="swatch" data-hex="' + hex + '" title="Click to copy ' + hex + '">' +
          '<div class="swatch-color" style="background:' + hex + ';"></div>' +
          '<div class="swatch-info">' + hex + '<br>rgb(' + r + ', ' + g + ', ' + b + ')</div>' +
        '</div>'
      );
    }).join("");
    paletteEmpty.style.display = "none";
    swatchGrid.style.display = "grid";
  }

  function openFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      window.OmniTools.showToast("Please choose a valid image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { currentImage = img; render(); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
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

  colorCount.addEventListener("input", () => {
    colorCountValue.textContent = colorCount.value;
    render();
  });

  swatchGrid.addEventListener("click", (e) => {
    const swatch = e.target.closest(".swatch");
    if (!swatch) return;
    window.OmniTools.copyText(swatch.dataset.hex).then(() => {
      window.OmniTools.showToast("Copied " + swatch.dataset.hex, "success");
    });
  });
})();
