(function () {
  "use strict";
  var input = document.getElementById("csvInput");
  var convertBtn = document.getElementById("convertBtn");
  var downloadBtn = document.getElementById("downloadBtn");
  var errorBox = document.getElementById("csvError");
  var output = document.getElementById("jsonOutput");
  var copyBtn = document.getElementById("copyBtn");
  var jsonResult = "";

  function parseCSVRow(line) {
    var fields = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            field += '"'; i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          fields.push(field); field = "";
        } else {
          field += ch;
        }
      }
    }
    fields.push(field);
    return fields;
  }

  function convert() {
    errorBox.style.display = "none";
    jsonResult = "";
    var text = input.value.trim();
    if (!text) { errorBox.textContent = "Please paste some CSV data."; errorBox.style.display = "flex"; return; }
    var lines = text.split(/\r?\n/);
    if (lines.length < 2) { errorBox.textContent = "CSV needs at least a header row and one data row."; errorBox.style.display = "flex"; return; }
    var headers = parseCSVRow(lines[0]);
    var result = [];
    for (var i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;
      var vals = parseCSVRow(lines[i]);
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = vals[j] !== undefined ? vals[j].trim() : "";
      }
      result.push(obj);
    }
    jsonResult = JSON.stringify(result, null, 2);
    output.textContent = jsonResult;
  }

  convertBtn.addEventListener("click", convert);

  copyBtn.addEventListener("click", function () {
    if (!jsonResult) return;
    window.OmniTools.copyText(jsonResult).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });

  downloadBtn.addEventListener("click", function () {
    if (!jsonResult) { window.OmniTools.showToast("Convert first.", "error"); return; }
    var blob = new Blob([jsonResult], { type: "application/json;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "data.json"; a.click();
    URL.revokeObjectURL(url);
  });
})();
