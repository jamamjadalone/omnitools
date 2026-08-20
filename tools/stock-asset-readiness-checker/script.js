(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const platformSelect = document.getElementById("platformSelect");
  const presetNoteWrap = document.getElementById("presetNoteWrap");
  const presetNote = document.getElementById("presetNote");
  const resultsEmpty = document.getElementById("resultsEmpty");
  const results = document.getElementById("results");
  const statResolution = document.getElementById("statResolution");
  const statAspect = document.getElementById("statAspect");
  const statSize = document.getElementById("statSize");
  const statScore = document.getElementById("statScore");
  const autoChecks = document.getElementById("autoChecks");
  const manualChecklist = document.getElementById("manualChecklist");
  const summaryNote = document.getElementById("summaryNote");

  const PLATFORMS = {
    adobe: {
      name: "Adobe Stock",
      minW: 0, minH: 0, minMP: 4, maxMP: 45, maxMB: 20,
      formats: ["image/jpeg", "image/png"],
      transparent: "warn",
      note: "Adobe Stock requires at least 4MP (max 45MP), under 20MB, JPEG or PNG. Transparent backgrounds need an approved template.",
    },
    shutterstock: {
      name: "Shutterstock",
      minW: 0, minH: 0, minMP: 4, maxMP: null, maxMB: 10,
      formats: ["image/jpeg"],
      transparent: "ok",
      note: "Shutterstock requires at least 4MP, under 10MB, JPEG only. No transparency issues.",
    },
    freepik: {
      name: "Freepik",
      minW: 1000, minH: 0, minMP: 0, maxMP: null, maxMB: null,
      formats: ["image/jpeg", "image/png", "image/webp"],
      transparent: "ok",
      note: "Freepik asks for at least 1000px on the longest side. JPG, PNG or WebP accepted.",
    },
    envato: {
      name: "Envato",
      minW: 0, minH: 0, minMP: 4, maxMP: null, maxMB: null,
      formats: ["image/jpeg", "image/png"],
      transparent: "warn",
      note: "Envato requires at least 4MP, JPG or PNG. Transparency allowed only for graphic items.",
    },
  };

  function fmtBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function checkRow(label, status, detail) {
    const icons = { pass: "✅", warn: "⚠️", fail: "❌" };
    const colors = { pass: "var(--success)", warn: "var(--warning)", fail: "var(--danger)" };
    return '<div class="alert alert-' + (status === "pass" ? "success" : status === "warn" ? "warning" : "danger") + '">' +
      '<span aria-hidden="true">' + icons[status] + "</span>" +
      "<div><strong style='color:" + colors[status] + ";'>" + label + "</strong><br><span style='color:var(--text-dim);font-size:.85rem;'>" + detail + "</span></div>" +
      "</div>";
  }

  function mp(w, h) {
    return ((w * h) / 1000000).toFixed(2);
  }

  function analyze(file) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const platform = PLATFORMS[platformSelect.value];
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const megapixels = (w * h) / 1000000;
        const bytes = file.size;

        const checks = [];
        let fails = 0, warns = 0;

        // Resolution check
        const minMP = platform.minMP;
        const maxMP = platform.maxMP;
        const minPx = platform.minW || platform.minH;
        let resStatus = "pass", resDetail = w + " × " + h + " px (" + megapixels.toFixed(2) + " MP)";
        if (minMP && megapixels < minMP) { resStatus = "fail"; fails++; resDetail += " — below " + minMP + " MP minimum"; }
        if (maxMP && megapixels > maxMP) { resStatus = "fail"; fails++; resDetail += " — above " + maxMP + " MP maximum"; }
        if (!resStatus && minPx && Math.max(w, h) < minPx) { resStatus = "fail"; fails++; resDetail += " — longest side under " + minPx + " px"; }
        checks.push(checkRow("Resolution " + (platform.name), resStatus, resDetail));

        // Format check
        const formatOk = platform.formats.includes(file.type);
        checks.push(checkRow("File format", formatOk ? "pass" : "fail",
          (file.type || "unknown") + " — " + platform.name + " expects " + platform.formats.map((f) => f.replace("image/", "").toUpperCase()).join(" / ")));

        // Aspect ratio check (common stock acceptance)
        const ratio = (w / h).toFixed(3);
        const extreme = parseFloat(ratio) < 0.35 || parseFloat(ratio) > 2.9;
        checks.push(checkRow("Aspect ratio", extreme ? "warn" : "pass",
          ratio + ":1 (" + w + ":" + h + ") — extremely wide or tall crops may be reviewed more strictly"));

        // Transparency check
        let hasAlpha = false;
        if (file.type === "image/png") {
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          try {
            const data = ctx.getImageData(0, 0, w, h).data;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] < 255) { hasAlpha = true; break; }
            }
          } catch (err) { hasAlpha = false; }
        }
        if (hasAlpha) {
          if (platform.transparent === "warn") { checks.push(checkRow("Transparency", "warn", "Image has transparent pixels — " + platform.name + " may reject unless you have an approved template.")); warns++; }
          else checks.push(checkRow("Transparency", "pass", "Transparency detected and allowed for " + platform.name + "."));
        } else {
          checks.push(checkRow("Transparency", "pass", "No transparency — standard for " + platform.name + " photos."));
        }

        // File size check
        const maxMB = platform.maxMB;
        let sizeStatus = "pass", sizeDetail = fmtBytes(bytes);
        if (maxMB && bytes > maxMB * 1024 * 1024) { sizeStatus = "fail"; fails++; sizeDetail += " — exceeds " + maxMB + " MB limit"; }
        else if (maxMB && bytes > maxMB * 1024 * 1024 * 0.8) { sizeStatus = "warn"; warns++; sizeDetail += " — close to the " + maxMB + " MB limit"; }
        checks.push(checkRow("File size", sizeStatus, sizeDetail));

        // Score
        const total = 5;
        const score = Math.max(0, total - fails - warns * 0.5);
        statResolution.textContent = w + "×" + h;
        statAspect.textContent = ratio + ":1";
        statSize.textContent = fmtBytes(bytes);
        statScore.textContent = Math.round(score) + "/5";

        autoChecks.innerHTML = checks.join("");

        // Manual checklist
        const manual = [
          "No visible watermarks, signatures or text overlays",
          "No logos, trademarks or branded content",
          "No recognizable faces or property without model/property releases",
          "Subject is in focus and properly exposed",
          "No noise, banding or compression artifacts at 100% zoom",
          "No cloned/stamped areas or messy background removal edges",
        ];
        manualChecklist.innerHTML = manual.map((m) =>
          '<label class="checkbox-field"><input type="checkbox"> ' + m + "</label>").join("");

        // Summary
        let note = "";
        if (fails === 0 && warns === 0) {
          note = '<strong style="color:var(--success);">✓ Ready to submit</strong> — every automatic check passed. Confirm the manual checklist and upload.';
        } else {
          note = "<strong style='color:" + (fails ? "var(--danger);" : "var(--warning);") + "'>" + (fails ? fails + " check(s) failing, " : "") + (warns ? warns + " warning(s)" : "") + "</strong> — review the flagged items above before submitting.";
        }
        summaryNote.className = "alert " + (fails ? "alert-danger" : warns ? "alert-warning" : "alert-success");
        summaryNote.innerHTML = note;

        resultsEmpty.style.display = "none";
        results.style.display = "block";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function openFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      window.OmniTools.showToast("Please choose a valid image file.", "error");
      return;
    }
    analyze(file);
  }

  function showPresetNote() {
    const p = PLATFORMS[platformSelect.value];
    presetNote.textContent = p.note;
    presetNoteWrap.style.display = "block";
    if (results.style.display === "block") {
      const file = fileInput.files[0];
      if (file) analyze(file);
    }
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) openFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", (e) => { if (e.target.files[0]) openFile(e.target.files[0]); });
  platformSelect.addEventListener("change", showPresetNote);

  showPresetNote();
})();