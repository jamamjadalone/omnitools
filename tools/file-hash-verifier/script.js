(function () {
  "use strict";

  const expectedHash = document.getElementById("expectedHash");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const progressWrap = document.getElementById("progressWrap");
  const resultEmpty = document.getElementById("resultEmpty");
  const resultBox = document.getElementById("resultBox");
  const matchAlert = document.getElementById("matchAlert");
  const computedHash = document.getElementById("computedHash");
  const copyBtn = document.getElementById("copyBtn");

  let currentHash = "";

  function readBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Could not read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  function compare() {
    if (!currentHash) return;
    const expected = expectedHash.value.trim().replace(/^sha256\s*:\s*/i, "").toLowerCase();
    if (!expected) {
      matchAlert.className = "alert alert-warning";
      matchAlert.textContent = "No expected hash provided — paste one above to compare. The computed hash is shown.";
      return;
    }
    if (expected === currentHash.toLowerCase()) {
      matchAlert.className = "alert alert-success";
      matchAlert.textContent = "Hash matches. The file is intact and authentic.";
    } else {
      matchAlert.className = "alert alert-danger";
      matchAlert.textContent = "Hash does NOT match. The file may be corrupt or tampered with.";
    }
  }

  async function verify(file) {
    if (!file) return;
    progressWrap.style.display = "block";
    resultEmpty.style.display = "none";
    resultBox.style.display = "none";
    try {
      const buf = await readBuffer(file);
      const hash = await window.OmniToolsHash.sha256(buf);
      currentHash = hash;
      computedHash.textContent = hash;
      resultBox.style.display = "block";
      progressWrap.style.display = "none";
      compare();
    } catch (err) {
      progressWrap.style.display = "none";
      window.OmniTools.showToast("Could not hash file: " + err.message, "error");
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
    if (e.dataTransfer.files[0]) verify(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) verify(fileInput.files[0]);
  });

  expectedHash.addEventListener("input", compare);

  copyBtn.addEventListener("click", () => {
    if (!currentHash) return;
    window.OmniTools.copyText(currentHash)
      .then(() => window.OmniTools.showToast("Hash copied to clipboard.", "success"))
      .catch(() => window.OmniTools.showToast("Copy failed.", "error"));
  });
})();