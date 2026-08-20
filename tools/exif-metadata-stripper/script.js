(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
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

  function isJpeg(file) {
    return file && (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name));
  }

  function strip(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read " + file.name));
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) reject(new Error("Could not re-encode " + file.name));
            else resolve({ name: baseOf(file.name) + ".jpg", original: file.size, blob });
          }, "image/jpeg", 0.92);
        };
        img.onerror = () => reject(new Error("Could not decode " + file.name));
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function processAll() {
    if (!files.length) return;
    downloadBtn.disabled = true;
    logBox.textContent = "";
    const lines = [];
    const out = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const r = await strip(f);
        out.push(r);
        lines.push(f.name + " → metadata removed, " + fmtBytes(r.original) + " → " + fmtBytes(r.blob.size));
      } catch (err) {
        lines.push(f.name + " → " + err.message);
        window.OmniTools.showToast(err.message, "error");
      }
    }
    results = out;
    logBox.textContent = lines.join("\n") || "No images could be processed.";
    downloadBtn.disabled = !results.length;
    if (results.length) window.OmniTools.showToast("Cleaned " + results.length + " image(s).", "success");
  }

  async function downloadAll() {
    if (!results.length) return;
    try {
      await window.OmniToolsZip.save(results, "cleaned-images.zip");
      window.OmniTools.showToast("ZIP download started (" + results.length + " files).", "success");
    } catch (err) {
      window.OmniTools.showToast("Failed to create ZIP: " + err.message, "error");
    }
  }

  function takeFiles(list) {
    const dropped = Array.from(list).filter(isJpeg);
    if (dropped.length) {
      files = dropped;
      processAll();
    } else {
      window.OmniTools.showToast("Please choose JPEG images.", "error");
    }
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

  downloadBtn.addEventListener("click", downloadAll);
})();