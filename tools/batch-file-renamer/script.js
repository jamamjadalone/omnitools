(function () {
  "use strict";

  const modeSelect = document.getElementById("modeSelect");
  const extWrap = document.getElementById("extWrap");
  const patternWrap = document.getElementById("patternWrap");
  const findReplaceWrap = document.getElementById("findReplaceWrap");
  const newExtInput = document.getElementById("newExtInput");
  const patternInput = document.getElementById("patternInput");
  const findInput = document.getElementById("findInput");
  const replaceInput = document.getElementById("replaceInput");
  const keepExtCheck = document.getElementById("keepExtCheck");
  const caseCheck = document.getElementById("caseCheck");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const fileCount = document.getElementById("fileCount");
  const fileList = document.getElementById("fileList");

  let files = [];

  function extOf(name) {
    const dot = name.lastIndexOf(".");
    return dot > 0 && dot < name.length - 1 ? name.slice(dot + 1) : "";
  }

  function baseOf(name) {
    const dot = name.lastIndexOf(".");
    return dot > 0 ? name.slice(0, dot) : name;
  }

  function buildNewName(file, index) {
    const original = file.name;
    const ext = extOf(original);
    const base = baseOf(original);
    const mode = modeSelect.value;
    let newName = original;

    if (mode === "extension") {
      const targetExt = newExtInput.value.trim().replace(/^\./, "");
      if (!targetExt) return original;
      newName = (keepExtCheck.checked ? original : base) + "." + targetExt;
    } else if (mode === "pattern") {
      let pattern = patternInput.value;
      const numbered = pattern.includes("{n}");
      let seq = pattern;
      const padMatch = pattern.match(/\{n(\d*)\}/);
      const pad = padMatch && padMatch[1] ? parseInt(padMatch[1], 10) : 0;
      let seqNum = String(index + 1).padStart(pad || String(files.length).length, "0");
      if (numbered) {
        seq = pattern.replace(/\{n\d*\}/g, seqNum);
      } else {
        seq = pattern + seqNum;
      }
      newName = seq + (keepExtCheck.checked ? "" : "") + (keepExtCheck.checked ? (ext ? "." + ext : "") : "");
      if (!keepExtCheck.checked && ext) newName = seq + "." + ext;
      else newName = seq + (ext ? "." + ext : "");
    } else if (mode === "findreplace") {
      const find = findInput.value;
      const repl = replaceInput.value;
      const namePart = keepExtCheck.checked ? original : base;
      const replaced = namePart.split(find).join(repl);
      newName = keepExtCheck.checked ? replaced : replaced + (ext ? "." + ext : "");
    }

    if (caseCheck.checked) newName = newName.toLowerCase();

    // dedupe
    const seen = {};
    const uniq = (n) => {
      if (seen[n]) {
        const dot = n.lastIndexOf(".");
        const b = dot > 0 ? n.slice(0, dot) : n;
        const e = dot > 0 ? n.slice(dot) : "";
        let c = 1;
        let candidate = b + "_" + c + e;
        while (seen[candidate]) { c++; candidate = b + "_" + c + e; }
        seen[candidate] = true;
        return candidate;
      }
      seen[n] = true;
      return n;
    };
    return uniq(newName);
  }

  function renderList() {
    fileCount.textContent = files.length;
    if (!files.length) {
      fileList.textContent = "No files selected yet.";
      downloadBtn.disabled = true;
      return;
    }
    const rows = files.map((f, i) => {
      const oldName = f.name;
      const newName = buildNewName(f, i);
      const changed = oldName !== newName;
      return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--border-soft);font-size:.82rem;">' +
        '<span style="color:var(--text-dim);text-decoration:line-through;">' + window.OmniTools.escapeHtml(oldName) + "</span>" +
        '<span aria-hidden="true">→</span>' +
        "<strong>" + window.OmniTools.escapeHtml(newName) + "</strong></div>";
    }).join("");
    fileList.innerHTML = rows;
    downloadBtn.disabled = false;
  }

  function syncModeUI() {
    const mode = modeSelect.value;
    extWrap.style.display = mode === "extension" ? "block" : "none";
    patternWrap.style.display = mode === "pattern" ? "block" : "none";
    findReplaceWrap.style.display = mode === "findreplace" ? "block" : "none";
    renderList();
  }

  async function downloadAll() {
    if (!files.length) return;
    const items = files.map((f, i) => ({ name: buildNewName(f, i), blob: f }));
    try {
      await window.OmniToolsZip.save(items, "renamed-files.zip");
      window.OmniTools.showToast("ZIP download started (" + items.length + " files).", "success");
    } catch (err) {
      window.OmniTools.showToast("Failed to create ZIP: " + err.message, "error");
    }
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) { files = dropped; renderList(); }
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length) {
      files = Array.from(fileInput.files);
      renderList();
    }
  });

  modeSelect.addEventListener("change", syncModeUI);
  [newExtInput, patternInput, findInput, replaceInput, keepExtCheck, caseCheck].forEach((el) => {
    el.addEventListener("input", renderList);
    el.addEventListener("change", renderList);
  });
  downloadBtn.addEventListener("click", downloadAll);

  syncModeUI();
})();