(function () {
  "use strict";

  const monthInput = document.getElementById("monthInput");
  const platformSelect = document.getElementById("platformSelect");
  const themeInput = document.getElementById("themeInput");
  const generateBtn = document.getElementById("generateBtn");
  const previewBox = document.getElementById("previewBox");
  const copyBtn = document.getElementById("copyBtn");

  let lastCsv = "";

  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function csvField(field) {
    field = String(field == null ? "" : field);
    if (/[",\n]/.test(field)) return '"' + field.replace(/"/g, '""') + '"';
    return field;
  }

  function build() {
    const month = monthInput.value;
    const platform = platformSelect.value;
    const theme = themeInput.value.trim() || "general content";

    if (!month) {
      window.OmniTools.showToast("Pick a month first.", "error");
      return "";
    }

    const parts = month.split("-");
    const year = parseInt(parts[0], 10);
    const monthNum = parseInt(parts[1], 10);
    const days = new Date(year, monthNum, 0).getDate();

    const rows = ["Date,Weekday,Platform,Theme,Topic,Caption,Media,Status,Notes"];
    for (let d = 1; d <= days; d++) {
      const date = year + "-" + pad(monthNum) + "-" + pad(d);
      const weekday = WEEKDAYS[new Date(year, monthNum - 1, d).getDay()];
      rows.push([date, weekday, platform, theme, "Topic idea for " + theme, "", "", "Draft", ""].map(csvField).join(","));
    }
    return rows.join("\n");
  }

  function download(name) {
    const blob = new Blob([lastCsv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  }

  generateBtn.addEventListener("click", function () {
    const csv = build();
    if (!csv) return;
    lastCsv = csv;
    previewBox.textContent = csv;
    const name = (monthInput.value || "calendar") + "-content-calendar.csv";
    download(name);
    window.OmniTools.showToast("Calendar generated and downloaded.", "success");
  });

  copyBtn.addEventListener("click", function () {
    if (!lastCsv) {
      window.OmniTools.showToast("Generate a calendar first.", "error");
      return;
    }
    window.OmniTools.copyText(lastCsv).then(function () {
      window.OmniTools.showToast("CSV copied to clipboard.", "success");
    });
  });

  const now = new Date();
  monthInput.value = now.getFullYear() + "-" + pad(now.getMonth() + 1);
})();