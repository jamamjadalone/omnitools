(function () {
  "use strict";

  const limitInput = document.getElementById("limitInput");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const totalCount = document.getElementById("totalCount");
  const overCount = document.getElementById("overCount");
  const totalSize = document.getElementById("totalSize");
  const fileList = document.getElementById("fileList");

  let files = [];

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function limitBytes() {
    const mb = parseFloat(limitInput.value);
    return isNaN(mb) || mb <= 0 ? 0 : mb * 1024 * 1024;
  }

  function csvCell(value) {
    const s = String(value);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function renderList() {
    const sorted = files.slice().sort((a, b) => b.size - a.size);
    const limit = limitBytes();
    const over = sorted.filter((f) => limit > 0 && f.size > limit);
    let total = 0;
    sorted.forEach((f) => { total += f.size; });
    totalCount.textContent = sorted.length;
    overCount.textContent = over.length;
    totalSize.textContent = fmtBytes(total);
    downloadBtn.disabled = !sorted.length;
    if (!sorted.length) {
      fileList.textContent = "No files loaded yet.";
      return;
    }
    fileList.innerHTML = sorted.map((f) => {
      const isOver = limit > 0 && f.size > limit;
      return '<div class="size-row' + (isOver ? " over-limit" : "") + '">' +
        '<span class="sr-name">' + window.OmniTools.escapeHtml(f.name) + "</span>" +
        '<span class="sr-size">' + fmtBytes(f.size) + (isOver ? " — over limit" : "") + "</span></div>";
    }).join("");
  }

  function downloadCsv() {
    if (!files.length) return;
    const sorted = files.slice().sort((a, b) => b.size - a.size);
    const limit = limitBytes();
    const lines = ["file,size_bytes,size_mb,over_limit"];
    sorted.forEach((f) => {
      lines.push([
        csvCell(f.name),
        f.size,
        (f.size / (1024 * 1024)).toFixed(6),
        limit > 0 && f.size > limit ? "true" : "false"
      ].join(","));
    });
    const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "file-size-report.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 500);
    window.OmniTools.showToast("CSV report downloaded (" + sorted.length + " rows).", "success");
  }

  function handleFiles(fileListObj) {
    const selected = Array.from(fileListObj);
    if (!selected.length) return;
    files = selected;
    renderList();
    window.OmniTools.showToast("Loaded " + files.length + " file(s).", "success");
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
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) handleFiles(fileInput.files);
  });

  limitInput.addEventListener("input", renderList);
  downloadBtn.addEventListener("click", downloadCsv);
})();