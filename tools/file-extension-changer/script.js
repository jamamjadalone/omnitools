(function () {
  "use strict";

  const newExtSelect = document.getElementById("newExtSelect");
  const customExtWrap = document.getElementById("customExtWrap");
  const customExtInput = document.getElementById("customExtInput");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const processBtn = document.getElementById("processBtn");
  const clearBtn = document.getElementById("clearBtn");
  const downloadZipBtn = document.getElementById("downloadZipBtn");
  const fileListWrap = document.getElementById("fileListWrap");
  const fileCount = document.getElementById("fileCount");

  let loadedFiles = [];
  let convertedFiles = [];

  newExtSelect.addEventListener("change", () => {
    if (newExtSelect.value === "custom") {
      customExtWrap.style.display = "block";
      customExtInput.focus();
    } else {
      customExtWrap.style.display = "none";
    }
  });

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
      handleFiles(fileInput.files);
    }
  });

  function getTargetExt() {
    if (newExtSelect.value === "custom") {
      return (customExtInput.value.trim() || "bin").replace(/^\./, "");
    }
    return newExtSelect.value;
  }

  function handleFiles(incoming) {
    for (let i = 0; i < incoming.length; i++) {
      loadedFiles.push(incoming[i]);
    }
    updateList();
  }

  function updateList() {
    fileCount.textContent = loadedFiles.length;
    if (loadedFiles.length === 0) {
      fileListWrap.innerHTML = "No files selected yet. Drop files on the left to get started.";
      processBtn.disabled = true;
      clearBtn.disabled = true;
      downloadZipBtn.disabled = true;
      return;
    }

    processBtn.disabled = false;
    clearBtn.disabled = false;

    const targetExt = getTargetExt();
    let html = '<div style="display:flex;flex-direction:column;gap:8px;">';
    loadedFiles.forEach((file, index) => {
      const originalName = file.name;
      const dotIndex = originalName.lastIndexOf(".");
      const baseName = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
      const newName = `${baseName}.${targetExt}`;
      const sizeStr = (file.size / 1024).toFixed(1) + " KB";

      html += `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);padding:8px 12px;border-radius:6px;border:1px solid var(--border);">
          <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:10px;">
            <span style="color:var(--text);">${originalName}</span>
            <span style="color:var(--text-dim);margin:0 6px;">&rarr;</span>
            <span style="color:var(--accent);font-weight:600;">${newName}</span>
            <span style="font-size:0.75rem;color:var(--text-dim);margin-left:8px;">(${sizeStr})</span>
          </div>
          <button class="btn btn-secondary btn-sm single-dl" data-index="${index}" style="padding:4px 8px;font-size:0.8rem;">Save</button>
        </div>
      `;
    });
    html += '</div>';
    fileListWrap.innerHTML = html;

    document.querySelectorAll(".single-dl").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
        downloadSingle(idx);
      });
    });
  }

  function downloadSingle(index) {
    const file = loadedFiles[index];
    const targetExt = getTargetExt();
    const originalName = file.name;
    const dotIndex = originalName.lastIndexOf(".");
    const baseName = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
    const newName = `${baseName}.${targetExt}`;

    const blob = new Blob([file], { type: file.type || "application/octet-stream" });
    if (window.saveAs) {
      window.saveAs(blob, newName);
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = newName;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  }

  processBtn.addEventListener("click", () => {
    updateList();
    downloadZipBtn.disabled = false;
    processBtn.textContent = "Extensions Updated! ✔";
    setTimeout(() => {
      processBtn.textContent = "Change Extensions";
    }, 2000);
  });

  clearBtn.addEventListener("click", () => {
    loadedFiles = [];
    convertedFiles = [];
    fileInput.value = "";
    updateList();
  });

  downloadZipBtn.addEventListener("click", async () => {
    if (!loadedFiles.length) return;
    if (typeof JSZip === "undefined") {
      alert("ZIP library is loading, please try again in a moment.");
      return;
    }

    downloadZipBtn.disabled = true;
    downloadZipBtn.textContent = "Building ZIP...";

    const zip = new JSZip();
    const targetExt = getTargetExt();

    loadedFiles.forEach((file) => {
      const originalName = file.name;
      const dotIndex = originalName.lastIndexOf(".");
      const baseName = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
      const newName = `${baseName}.${targetExt}`;
      zip.file(newName, file);
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      if (window.saveAs) {
        window.saveAs(content, "changed_files.zip");
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "changed_files.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch (err) {
      alert("Error generating ZIP: " + err.message);
    } finally {
      downloadZipBtn.disabled = false;
      downloadZipBtn.textContent = "Download All (ZIP)";
    }
  });
})();
