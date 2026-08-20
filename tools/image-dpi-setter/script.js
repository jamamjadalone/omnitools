(function () {
  "use strict";

  const dpiInput = document.getElementById("dpiInput");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const emptyState = document.getElementById("emptyState");
  const results = document.getElementById("results");
  const statSize = document.getElementById("statSize");
  const statOldDpi = document.getElementById("statOldDpi");
  const statNewDpi = document.getElementById("statNewDpi");
  const statPrint = document.getElementById("statPrint");
  const previewImg = document.getElementById("previewImg");

  let baseBlob = null;
  let outputBlob = null;
  let naturalWidth = 0;
  let naturalHeight = 0;
  let warned = false;

  function isJpeg(file) {
    return file && (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name));
  }

  function findJfif(bytes) {
    for (let i = 0; i + 4 < bytes.length; i++) {
      if (bytes[i] === 0x4a && bytes[i + 1] === 0x46 && bytes[i + 2] === 0x49 && bytes[i + 3] === 0x46) return i;
    }
    return -1;
  }

  function readJfifDpi(buffer) {
    const bytes = new Uint8Array(buffer);
    const idx = findJfif(bytes);
    if (idx < 0) return null;
    if (bytes[idx + 7] !== 1) return null;
    return (bytes[idx + 8] << 8) | bytes[idx + 9];
  }

  function patchDpi(buffer, dpi) {
    const bytes = new Uint8Array(buffer);
    const idx = findJfif(bytes);
    if (idx < 0) return null;
    bytes[idx + 7] = 1;
    bytes[idx + 8] = (dpi >> 8) & 0xff;
    bytes[idx + 9] = dpi & 0xff;
    bytes[idx + 10] = (dpi >> 8) & 0xff;
    bytes[idx + 11] = dpi & 0xff;
    return new Blob([bytes], { type: "image/jpeg" });
  }

  function applyDpi() {
    if (!baseBlob) return;
    const dpi = Math.max(1, Math.round(parseInt(dpiInput.value, 10) || 300));
    baseBlob.arrayBuffer().then((b) => {
      const patchedBlob = patchDpi(b, dpi);
      if (patchedBlob) {
        outputBlob = patchedBlob;
      } else {
        outputBlob = baseBlob;
        if (!warned) {
          warned = true;
          window.OmniTools.showToast("Could not patch DPI header — using standard re-encode.", "warning");
        }
      }
      statNewDpi.textContent = dpi + " DPI";
      statPrint.textContent = (naturalWidth / dpi).toFixed(2) + " × " + (naturalHeight / dpi).toFixed(2) + " in";
    }).catch(() => {
      window.OmniTools.showToast("Could not patch DPI header.", "error");
    });
  }

  function process(file) {
    if (!isJpeg(file)) {
      window.OmniTools.showToast("Please choose a JPEG image.", "error");
      return;
    }
    statOldDpi.textContent = "—";
    warned = false;
    file.arrayBuffer().then((buf) => {
      const oldDpi = readJfifDpi(buf);
      statOldDpi.textContent = oldDpi ? oldDpi + " DPI" : "—";
    }).catch(() => {
      statOldDpi.textContent = "—";
    });

    const reader = new FileReader();
    reader.onerror = () => window.OmniTools.showToast("Could not read the file.", "error");
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        naturalWidth = img.naturalWidth;
        naturalHeight = img.naturalHeight;
        previewImg.src = e.target.result;
        statSize.textContent = naturalWidth + " × " + naturalHeight + " px";
        const canvas = document.createElement("canvas");
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            window.OmniTools.showToast("Could not re-encode the image.", "error");
            return;
          }
          baseBlob = blob;
          applyDpi();
          emptyState.style.display = "none";
          results.style.display = "block";
          downloadBtn.disabled = false;
        }, "image/jpeg", 0.95);
      };
      img.onerror = () => window.OmniTools.showToast("Could not decode the image.", "error");
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function download() {
    if (!outputBlob) return;
    const dpi = Math.max(1, Math.round(parseInt(dpiInput.value, 10) || 300));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(outputBlob);
    a.download = "dpi-" + dpi + ".jpg";
    a.click();
    window.OmniTools.showToast("Download started.", "success");
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) process(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) process(fileInput.files[0]);
  });

  dpiInput.addEventListener("change", applyDpi);
  dpiInput.addEventListener("input", applyDpi);
  downloadBtn.addEventListener("click", download);
})();