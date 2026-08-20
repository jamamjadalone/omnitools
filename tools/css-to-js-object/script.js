(function () {
  "use strict";
  var input = document.getElementById("cssJsInput");
  var output = document.getElementById("cssJsOutput");
  var convertBtn = document.getElementById("convertBtn");
  var copyBtn = document.getElementById("copyBtn");
  var fmtBtns = document.querySelectorAll("[data-fmt]");
  var currentFmt = "object";

  fmtBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      fmtBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentFmt = btn.dataset.fmt;
    });
  });

  function toCamelCase(prop) {
    return prop.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); });
  }

  function convert() {
    var css = input.value.trim();
    if (!css) { window.OmniTools.showToast("Enter CSS properties.", "error"); return; }
    var lines = css.split("\n");
    var props = {};
    lines.forEach(function (line) {
      line = line.replace(/\/\*[\s\S]*?\*\//g, "").trim();
      if (!line || line.indexOf("{") !== -1 || line.indexOf("}") !== -1) return;
      var match = line.match(/^([a-zA-Z-]+)\s*:\s*(.+?)\s*;?\s*$/);
      if (match) {
        var key = toCamelCase(match[1].trim());
        var val = match[2].trim().replace(/;$/, "");
        props[key] = val;
      }
    });
    if (Object.keys(props).length === 0) { window.OmniTools.showToast("No valid CSS properties found.", "error"); return; }
    var result;
    if (currentFmt === "object") {
      result = "const styles = {\n";
      Object.keys(props).forEach(function (k) {
        result += "  " + (/^[a-zA-Z_$]/.test(k) ? k : '"' + k + '"') + ': "' + props[k] + '",\n';
      });
      result += "};";
    } else {
      var parts = [];
      Object.keys(props).forEach(function (k) {
        parts.push(k + ': "' + props[k] + '"');
      });
      result = 'style={{ ' + parts.join(", ") + " }}";
    }
    output.textContent = result;
  }

  convertBtn.addEventListener("click", convert);
  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("JS output") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
