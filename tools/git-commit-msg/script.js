(function () {
  "use strict";
  var typeEl = document.getElementById("commitType");
  var scopeEl = document.getElementById("commitScope");
  var descEl = document.getElementById("commitDesc");
  var bodyEl = document.getElementById("commitBody");
  var breakingEl = document.getElementById("commitBreaking");
  var generateBtn = document.getElementById("generateBtn");
  var output = document.getElementById("commitOutput");
  var copyBtn = document.getElementById("copyBtn");

  function generate() {
    var type = typeEl.value;
    var scope = scopeEl.value.trim();
    var desc = descEl.value.trim();
    var body = bodyEl.value.trim();
    var breaking = breakingEl.checked;

    if (!desc) { window.OmniTools.showToast("Enter a description.", "error"); return; }

    var header = type;
    if (scope) header += "(" + scope + ")";
    if (breaking) header += "!";
    header += ": " + desc;

    var msg = header;
    if (body) msg += "\n\n" + body;
    if (breaking) msg += "\n\nBREAKING CHANGE: " + desc;

    output.textContent = msg;
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("Commit message") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
