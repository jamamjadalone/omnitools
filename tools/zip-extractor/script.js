(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const extractAllBtn = document.getElementById("extractAllBtn");
  const extractSelectedBtn = document.getElementById("extractSelectedBtn");
  const fileList = document.getElementById("fileList");

  let zip = null;
  let zipName = "archive.zip";
  let entries = [];

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function readBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Could not read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  async function openZip(file) {
    if (!/\.zip$/i.test(file.name)) {
      window.OmniTools.showToast("Please drop a .zip file.", "error");
      return;
    }
    try {
      const buf = await readBuffer(file);
      zip = await window.JSZip.loadAsync(buf);
      zipName = file.name;
      entries = [];
      zip.forEach((relativePath, entry) => {
        if (!entry.dir) {
          entries.push({
            name: relativePath,
            size: (entry._data && entry._data.uncompressedSize) || entry.size || 0
          });
        }
      });
      extractAllBtn.disabled = !entries.length;
      extractSelectedBtn.disabled = !entries.length;
      renderList();
      if (!entries.length) {
        fileList.textContent = "This archive contains no files.";
        window.OmniTools.showToast("No files found in this ZIP.", "error");
        return;
      }
      window.OmniTools.showToast("Opened ZIP with " + entries.length + " file(s).", "success");
    } catch (err) {
      zip = null;
      entries = [];
      extractAllBtn.disabled = true;
      extractSelectedBtn.disabled = true;
      fileList.textContent = "Could not open that ZIP file.";
      window.OmniTools.showToast("Could not open ZIP: " + err.message, "error");
    }
  }

  function renderList() {
    fileList.textContent = "";
    entries.forEach((entry) => {
      const label = document.createElement("label");
      label.className = "zip-entry";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      cb.dataset.path = entry.name;
      const span = document.createElement("span");
      span.textContent = entry.name;
      const size = document.createElement("em");
      size.textContent = fmtBytes(entry.size);
      label.appendChild(cb);
      label.appendChild(span);
      label.appendChild(size);
      fileList.appendChild(label);
    });
  }

  function selectedNames() {
    return Array.from(fileList.querySelectorAll('input[type="checkbox"]:checked')).map((cb) => cb.dataset.path);
  }

  async function blobsFor(names) {
    const items = [];
    for (const name of names) {
      const entry = zip.file(name);
      if (!entry) continue;
      const blob = await entry.async("blob");
      items.push({ name: name, blob: blob });
    }
    return items;
  }

  async function extractAll() {
    if (!zip || !entries.length) return;
    try {
      const items = await blobsFor(entries.map((e) => e.name));
      if (!items.length) return;
      const name = zipName.replace(/\.zip$/i, "") + "-extracted.zip";
      await window.OmniToolsZip.save(items, name);
      window.OmniTools.showToast("Extracted " + items.length + " file(s) to a ZIP.", "success");
    } catch (err) {
      window.OmniTools.showToast("Extraction failed: " + err.message, "error");
    }
  }

  async function extractSelected() {
    if (!zip) return;
    const names = selectedNames();
    if (!names.length) {
      window.OmniTools.showToast("Select at least one file to download.", "error");
      return;
    }
    try {
      if (names.length === 1) {
        const entry = zip.file(names[0]);
        if (!entry) return;
        const blob = await entry.async("blob");
        window.OmniToolsZip.saveAs(blob, names[0]);
        window.OmniTools.showToast("Download started.", "success");
        return;
      }
      const items = await blobsFor(names);
      if (!items.length) return;
      const base = zipName.replace(/\.zip$/i, "");
      await window.OmniToolsZip.save(items, base + "-selected.zip");
      window.OmniTools.showToast("Downloading " + items.length + " selected file(s).", "success");
    } catch (err) {
      window.OmniTools.showToast("Download failed: " + err.message, "error");
    }
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) openZip(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) openZip(fileInput.files[0]);
  });

  extractAllBtn.addEventListener("click", extractAll);
  extractSelectedBtn.addEventListener("click", extractSelected);
})();