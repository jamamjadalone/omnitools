(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const progressWrap = document.getElementById("progressWrap");
  const progressText = document.getElementById("progressText");
  const totalCount = document.getElementById("totalCount");
  const dupCount = document.getElementById("dupCount");
  const savable = document.getElementById("savable");
  const resultsBox = document.getElementById("resultsBox");

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

  async function scan(fileListObj) {
    const files = Array.from(fileListObj);
    if (!files.length) return;
    progressWrap.style.display = "block";
    resultsBox.textContent = "";
    totalCount.textContent = "0";
    dupCount.textContent = "0";
    savable.textContent = "0 B";
    const results = [];
    try {
      for (let i = 0; i < files.length; i++) {
        progressText.textContent = "Hashing file " + (i + 1) + " of " + files.length + "…";
        const buf = await readBuffer(files[i]);
        const hash = await window.OmniToolsHash.sha256(buf);
        results.push({ file: files[i], hash: hash });
      }
    } catch (err) {
      progressWrap.style.display = "none";
      resultsBox.textContent = "Could not scan files.";
      window.OmniTools.showToast("Error reading files: " + err.message, "error");
      return;
    }
    progressWrap.style.display = "none";

    const groups = {};
    results.forEach((r) => {
      (groups[r.hash] = groups[r.hash] || []).push(r);
    });
    const dupGroups = Object.values(groups).filter((g) => g.length > 1);

    totalCount.textContent = results.length;
    let dupFiles = 0;
    let freed = 0;
    dupGroups.forEach((g) => {
      dupFiles += g.length;
      g.forEach((r, idx) => {
        if (idx > 0) freed += r.file.size;
      });
    });
    dupCount.textContent = dupFiles;
    savable.textContent = fmtBytes(freed);

    if (!dupGroups.length) {
      resultsBox.textContent = "No duplicates found — all " + results.length + " file(s) are unique.";
      window.OmniTools.showToast("No duplicates found.", "success");
      return;
    }

    resultsBox.innerHTML = dupGroups.map((g) => {
      const shortHash = g[0].hash.slice(0, 12);
      const items = g.map((r) =>
        '<div class="dup-file"><span>' + window.OmniTools.escapeHtml(r.file.name) + "</span><span>" + fmtBytes(r.file.size) + "</span></div>"
      ).join("");
      return '<div class="dup-group">' +
        '<div class="dup-head"><strong>' + g.length + " files</strong><code>" + shortHash + "</code></div>" +
        items + "</div>";
    }).join("");
    window.OmniTools.showToast("Found " + dupGroups.length + " duplicate group(s).", "success");
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
    if (e.dataTransfer.files.length) scan(e.dataTransfer.files);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) scan(fileInput.files);
  });
})();