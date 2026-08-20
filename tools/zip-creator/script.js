(function () {
  "use strict";

  const zipNameInput = document.getElementById("zipNameInput");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const createBtn = document.getElementById("createBtn");
  const fileCount = document.getElementById("fileCount");
  const fileList = document.getElementById("fileList");

  let files = [];

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function relPath(f) {
    return f.webkitRelativePath || f.name;
  }

  function renderList() {
    fileCount.textContent = files.length;
    createBtn.disabled = !files.length;
    if (!files.length) {
      fileList.textContent = "No files added yet.";
      return;
    }
    fileList.innerHTML = files.map((f) =>
      '<div class="zip-row"><span>' + window.OmniTools.escapeHtml(relPath(f)) + "</span><span>" + fmtBytes(f.size) + "</span></div>"
    ).join("");
  }

  async function createZip() {
    if (!files.length) return;
    createBtn.disabled = true;
    try {
      const items = files.map((f) => ({ name: relPath(f), blob: f }));
      let name = zipNameInput.value.trim();
      if (!name) name = "my-archive.zip";
      if (!/\.zip$/i.test(name)) name += ".zip";
      await window.OmniToolsZip.save(items, name);
      window.OmniTools.showToast("ZIP created with " + files.length + " file(s).", "success");
    } catch (err) {
      window.OmniTools.showToast("Failed to create ZIP: " + err.message, "error");
    } finally {
      createBtn.disabled = false;
    }
  }

  function handleFiles(fileListObj) {
    const selected = Array.from(fileListObj);
    if (!selected.length) return;
    files = selected;
    renderList();
    window.OmniTools.showToast("Added " + files.length + " file(s).", "success");
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

  createBtn.addEventListener("click", createZip);
})();