(function () {
  "use strict";
  var input = document.getElementById("yamlInput");
  var convertBtn = document.getElementById("convertBtn");
  var errorBox = document.getElementById("yamlError");
  var output = document.getElementById("jsonOutput");
  var copyBtn = document.getElementById("copyBtn");

  function parseYAML(text) {
    var lines = text.split("\n");
    var root = {};
    var stack = [{ indent: -1, obj: root }];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.trim() === "" || line.trim().charAt(0) === "#") continue;
      var indent = line.search(/\S/);
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      var parent = stack[stack.length - 1].obj;
      var trimmed = line.trim();
      if (trimmed.indexOf("- ") === 0) {
        var arrKey = null;
        if (typeof parent === "object" && !Array.isArray(parent)) {
          var keys = Object.keys(parent);
          arrKey = keys.length > 0 ? keys[keys.length - 1] : null;
        }
        if (arrKey && Array.isArray(parent[arrKey])) {
          var itemVal = parseYAMLValue(trimmed.substring(2));
          parent[arrKey].push(itemVal);
        } else if (Array.isArray(parent)) {
          parent.push(parseYAMLValue(trimmed.substring(2)));
        }
        continue;
      }
      var colonIdx = trimmed.indexOf(":");
      if (colonIdx === -1) continue;
      var key = trimmed.substring(0, colonIdx).trim();
      var valStr = trimmed.substring(colonIdx + 1).trim();
      if (valStr === "") {
        parent[key] = {};
        stack.push({ indent: indent, obj: parent[key] });
      } else if (valStr.charAt(0) === "-" && valStr.charAt(1) === " ") {
        parent[key] = [parseYAMLValue(valStr.substring(2))];
        stack.push({ indent: indent, obj: parent[key] });
      } else {
        parent[key] = parseYAMLValue(valStr);
      }
    }
    return root;
  }

  function parseYAMLValue(s) {
    if (s === "true") return true;
    if (s === "false") return false;
    if (s === "null" || s === "~") return null;
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
    if ((s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') ||
        (s.charAt(0) === "'" && s.charAt(s.length - 1) === "'")) {
      return s.slice(1, -1);
    }
    if (s.charAt(0) === "[" && s.charAt(s.length - 1) === "]") {
      try { return JSON.parse(s); } catch (e) { /* fall through */ }
    }
    return s;
  }

  function convert() {
    errorBox.style.display = "none";
    var text = input.value.trim();
    if (!text) { errorBox.textContent = "Please paste some YAML."; errorBox.style.display = "flex"; return; }
    try {
      var result = parseYAML(text);
      output.textContent = JSON.stringify(result, null, 2);
    } catch (e) {
      errorBox.textContent = "YAML parse error: " + e.message;
      errorBox.style.display = "flex";
    }
  }

  convertBtn.addEventListener("click", convert);

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Your JSON output will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
