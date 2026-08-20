(function () {
  "use strict";

  const formatSelect = document.getElementById("formatSelect");
  const qualityWrap = document.getElementById("qualityWrap");
  const qualityRange = document.getElementById("qualityRange");
  const qualityValue = document.getElementById("qualityValue");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const progressWrap = document.getElementById("progressWrap");
  const progressText = document.getElementById("progressText");
  const logBox = document.getElementById("logBox");

  let files = [];

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function baseOf(name) {
    const dot = name.lastIndexOf(".");
    return dot > 0 ? name.slice(0, dot) : name;
  }

  function extFor(type) {
    return type === "image/jpeg" ? "jpg" : type.split("/")[1];
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

  function convertFile(file) {
    return loadImage(file).then(({ img }) => {
      const type = formatSelect.value;
      const quality = parseInt(qualityRange.value, 10) / 100;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) reject(new Error("Could not convert " + file.name));
          else resolve({ name: baseOf(file.name) + "." + extFor(type), original: file.size, blob });
        }, type, type === "image/png" ? undefined : quality);
      });
    });
  }

  async function processAll(andDownload) {
    if (!files.length) return;
    progressWrap.style.display = "block";
    progressText.textContent = "Converting…";
    downloadBtn.disabled = true;
    const lines = [];
    const out = [];
    for (let i = 0; i < files.length; i++) {
      progressText.textContent = "Converting " + (i + 1) + " of " + files.length + "…";
      try {
        const r = await convertFile(files[i]);
        out.push(r);
        lines.push(files[i].name + " → " + r.name + " (" + fmtBytes(r.original) + " → " + fmtBytes(r.blob.size) + ")");
      } catch (err) {
        lines.push(files[i].name + " → " + err.message);
        window.OmniTools.showToast(err.message, "error");
      }
    }
    logBox.textContent = lines.join("\n") || "No images could be converted.";
    downloadBtn.disabled = !out.length;
    progressWrap.style.display = "none";
    if (andDownload && out.length) {
      try {
        await window.OmniToolsZip.save(out, "converted-images.zip");
        window.OmniTools.showToast("ZIP download started (" + out.length + " files).", "success");
      } catch (err) {
        window.OmniTools.showToast("Failed to create ZIP: " + err.message, "error");
      }
    } else if (!andDownload && out.length) {
      window.OmniTools.showToast("Converted " + out.length + " image(s).", "success");
    }
  }

  function syncQuality() {
    qualityValue.textContent = qualityRange.value + "%";
    qualityWrap.style.display = formatSelect.value === "image/png" ? "none" : "block";
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const dropped = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (dropped.length) { files = dropped; processAll(false); }
    else if ((e.dataTransfer.files || []).length) window.OmniTools.showToast("Please choose image files.", "error");
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length) {
      files = Array.from(fileInput.files).filter((f) => f.type.startsWith("image/"));
      if (files.length) processAll(false);
    }
  });

  qualityRange.addEventListener("input", syncQuality);
  formatSelect.addEventListener("change", syncQuality);
  downloadBtn.addEventListener("click", () => processAll(true));

  syncQuality();
})();