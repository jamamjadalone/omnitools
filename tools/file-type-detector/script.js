(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const emptyState = document.getElementById("emptyState");
  const results = document.getElementById("results");

  function extOf(name) {
    const dot = name.lastIndexOf(".");
    return dot > 0 && dot < name.length - 1 ? name.slice(dot + 1).toLowerCase() : "";
  }

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function readBytes(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  async function inspectFile(file) {
    const bytes = await readBytes(file);
    const detected = window.OmniToolsMagicBytes.detect(bytes);
    const ext = extOf(file.name);
    const extUpper = ext.toUpperCase() || "(none)";

    const ok = detected.ext.split("|").includes(ext) || detected.ext === ext;
    const hex = Array.from(bytes.slice(0, 16)).map((b) => b.toString(16).padStart(2, "0")).join(" ").toUpperCase();

    let status = ok ? "pass" : "warn";
    let statusIcon = ok ? "✅" : "⚠️";
    let statusText = ok ? "Extension matches" : "Extension mismatch";
    if (!ext) { status = "info"; statusIcon = "ℹ️"; statusText = "No extension"; }

    const alertClass = status === "pass" ? "alert-success" : status === "warn" ? "alert-warning" : "alert-danger";

    return '<div class="alert ' + alertClass + '">' +
      "<div><strong>" + window.OmniTools.escapeHtml(file.name) + " <span style='font-size:.78rem;color:var(--text-faint);'>(" + fmtBytes(file.size) + ")</span></strong>" +
      "<br><span style='font-family:var(--font-mono);'>" + statusIcon + " Detected: <b>" + window.OmniTools.escapeHtml(detected.type) + "</b> — " + statusText + " (" + extUpper + ")</span>" +
      "<br><span style='font-size:.78rem;color:var(--text-faint);'>Magic bytes: " + hex + "</span>" +
      "</div></div>";
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList);
    if (!files.length) return;
    emptyState.style.display = "none";
    results.style.display = "grid";
    results.innerHTML = '<div class="spinner" style="margin:20px auto;"></div>';
    try {
      const items = await Promise.all(files.map(inspectFile));
      results.innerHTML = items.join("");
      window.OmniTools.showToast(files.length + " file(s) inspected.", "success");
    } catch (err) {
      results.innerHTML = '<p class="alert alert-danger">Could not read files: ' + window.OmniTools.escapeHtml(err.message) + "</p>";
    }
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
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
})();