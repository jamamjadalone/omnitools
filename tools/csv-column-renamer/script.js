(function () {
  "use strict";

  const csvInput = document.getElementById("csvInput");
  const hasHeader = document.getElementById("hasHeader");
  const trimCheck = document.getElementById("trimCheck");
  const applyBtn = document.getElementById("applyBtn");
  const colCount = document.getElementById("colCount");
  const columnEditor = document.getElementById("columnEditor");
  const previewBox = document.getElementById("previewBox");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  let delim = ",";
  let parsed = [];
  let order = [];
  let names = [];
  let outputText = "";

  function detectDelim(text) {
    const counts = { ",": 0, ";": 0, "\t": 0 };
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') i++;
          else inQuotes = false;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c in counts) {
        counts[c]++;
      }
    }
    let best = ",";
    if (counts[";"] > counts[best]) best = ";";
    if (counts["\t"] > counts[best]) best = "\t";
    return best;
  }

  function parseCSV(text, d) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    let endedWithDelim = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      endedWithDelim = false;
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === d) {
        row.push(field);
        field = "";
        endedWithDelim = true;
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    if (field.length > 0 || row.length > 0 || endedWithDelim) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function escapeCell(value) {
    const s = value == null ? "" : String(value);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function apply() {
    const text = csvInput.value;
    if (!text.trim()) {
      window.OmniTools.showToast("Paste some CSV data first.", "error");
      return;
    }
    delim = detectDelim(text);
    parsed = parseCSV(text, delim);
    parsed = parsed.filter((r) => r.some((c) => c !== ""));
    if (trimCheck.checked) {
      parsed = parsed.map((row) => row.map((c) => c.trim()));
    }
    if (!parsed.length) {
      window.OmniTools.showToast("Could not parse any CSV rows.", "error");
      return;
    }
    const colCountVal = Math.max.apply(null, parsed.map((r) => r.length));
    names = [];
    if (hasHeader.checked) {
      for (let i = 0; i < colCountVal; i++) {
        names.push(parsed[0][i] == null || parsed[0][i] === "" ? "Column " + (i + 1) : parsed[0][i]);
      }
    } else {
      for (let i = 0; i < colCountVal; i++) names.push("Column " + (i + 1));
    }
    order = [];
    for (let i = 0; i < colCountVal; i++) order.push(i);
    colCount.textContent = "(" + colCountVal + ")";
    buildEditor();
    buildPreview();
    window.OmniTools.showToast("Parsed " + parsed.length + " row(s), " + colCountVal + " column(s).", "success");
  }

  function buildEditor() {
    columnEditor.innerHTML = "";
    order.forEach((colIdx, pos) => {
      const row = document.createElement("div");
      row.className = "col-editor-row";
      const label = document.createElement("span");
      label.className = "col-label";
      label.textContent = (pos + 1) + ".";
      const input = document.createElement("input");
      input.type = "text";
      input.value = names[colIdx];
      input.setAttribute("aria-label", "New name for column " + (pos + 1));
      input.addEventListener("input", () => {
        names[colIdx] = input.value;
        buildPreview();
      });
      const up = document.createElement("button");
      up.type = "button";
      up.className = "btn-icon btn-sm col-move";
      up.setAttribute("aria-label", "Move column up");
      up.textContent = "↑";
      up.disabled = pos === 0;
      up.addEventListener("click", () => {
        order.splice(pos - 1, 0, order.splice(pos, 1)[0]);
        buildEditor();
      });
      const down = document.createElement("button");
      down.type = "button";
      down.className = "btn-icon btn-sm col-move";
      down.setAttribute("aria-label", "Move column down");
      down.textContent = "↓";
      down.disabled = pos === order.length - 1;
      down.addEventListener("click", () => {
        order.splice(pos + 1, 0, order.splice(pos, 1)[0]);
        buildEditor();
      });
      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(up);
      row.appendChild(down);
      columnEditor.appendChild(row);
    });
  }

  function buildOutput() {
    const keep = order.filter((colIdx) => names[colIdx] && names[colIdx].trim() !== "");
    const header = keep.map((colIdx) => names[colIdx].trim());
    const dataStart = hasHeader.checked ? 1 : 0;
    const lines = [];
    if (hasHeader.checked) lines.push(header);
    for (let r = dataStart; r < parsed.length; r++) {
      const row = parsed[r];
      lines.push(keep.map((colIdx) => (row[colIdx] == null ? "" : row[colIdx])));
    }
    return lines.map((line) => line.map(escapeCell).join(delim)).join("\r\n");
  }

  function buildPreview() {
    outputText = buildOutput();
    const keep = order.filter((colIdx) => names[colIdx] && names[colIdx].trim() !== "");
    const header = keep.map((colIdx) => names[colIdx].trim());
    const dataStart = hasHeader.checked ? 1 : 0;
    const previewRows = [];
    if (hasHeader.checked) previewRows.push(header);
    const max = Math.min(parsed.length, dataStart + 5);
    for (let r = dataStart; r < max; r++) {
      previewRows.push(keep.map((colIdx) => (parsed[r][colIdx] == null ? "" : parsed[r][colIdx])));
    }
    let preview = previewRows.map((line) => line.map(escapeCell).join(delim)).join("\n");
    const remaining = parsed.length - max;
    if (remaining > 0) preview += "\n… " + remaining + " more row(s)";
    previewBox.textContent = preview;
  }

  applyBtn.addEventListener("click", apply);
  hasHeader.addEventListener("change", () => { if (parsed.length) apply(); });
  trimCheck.addEventListener("change", () => { if (parsed.length) apply(); });

  copyBtn.addEventListener("click", () => {
    if (!outputText) {
      window.OmniTools.showToast("Apply column edits first.", "error");
      return;
    }
    window.OmniTools.copyText(outputText)
      .then(() => window.OmniTools.showToast("CSV copied to clipboard.", "success"))
      .catch(() => window.OmniTools.showToast("Copy failed.", "error"));
  });

  downloadBtn.addEventListener("click", () => {
    if (!outputText) {
      window.OmniTools.showToast("Apply column edits first.", "error");
      return;
    }
    const blob = new Blob([outputText], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "renamed.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 500);
    window.OmniTools.showToast("CSV downloaded.", "success");
  });
})();