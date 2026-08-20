(function () {
  "use strict";
  var input = document.getElementById("jsonInput");
  var convertBtn = document.getElementById("convertBtn");
  var downloadBtn = document.getElementById("downloadBtn");
  var errorBox = document.getElementById("jsonError");
  var output = document.getElementById("csvOutput");
  var copyBtn = document.getElementById("copyBtn");
  var csvResult = "";

  function flatten(obj, prefix) {
    var result = {};
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      var newKey = prefix ? prefix + "." + key : key;
      if (obj[key] !== null && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        var nested = flatten(obj[key], newKey);
        for (var k in nested) result[k] = nested[k];
      } else if (Array.isArray(obj[key])) {
        result[newKey] = JSON.stringify(obj[key]);
      } else {
        result[newKey] = obj[key];
      }
    }
    return result;
  }

  function escapeCSV(val) {
    var str = val === null || val === undefined ? "" : String(val);
    if (str.indexOf(",") !== -1 || str.indexOf('"') !== -1 || str.indexOf("\n") !== -1) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function convert() {
    errorBox.style.display = "none";
    csvResult = "";
    var data;
    try {
      data = JSON.parse(input.value);
    } catch (e) {
      errorBox.textContent = "Invalid JSON: " + e.message;
      errorBox.style.display = "flex";
      return;
    }
    if (!Array.isArray(data) || data.length === 0) {
      errorBox.textContent = "Input must be a non-empty JSON array of objects.";
      errorBox.style.display = "flex";
      return;
    }
    var flatRows = data.map(function (row) { return flatten(row); });
    var keys = [];
    var keySet = {};
    flatRows.forEach(function (row) {
      for (var k in row) {
        if (!keySet[k]) { keySet[k] = true; keys.push(k); }
      }
    });
    var lines = [keys.map(escapeCSV).join(",")];
    flatRows.forEach(function (row) {
      lines.push(keys.map(function (k) { return escapeCSV(row[k]); }).join(","));
    });
    csvResult = lines.join("\n");
    output.textContent = csvResult;
  }

  convertBtn.addEventListener("click", convert);

  copyBtn.addEventListener("click", function () {
    if (!csvResult) return;
    window.OmniTools.copyText(csvResult).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });

  downloadBtn.addEventListener("click", function () {
    if (!csvResult) { window.OmniTools.showToast("Convert first.", "error"); return; }
    var blob = new Blob([csvResult], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "data.csv"; a.click();
    URL.revokeObjectURL(url);
  });
})();
