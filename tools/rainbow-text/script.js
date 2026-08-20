(function () {
  "use strict";
  var input = document.getElementById("rainbowInput");
  var output = document.getElementById("rainbowOutput");
  var genBtn = document.getElementById("rainbowBtn");
  var copyBtn = document.getElementById("copyBtn");
  var styleBtns = document.querySelectorAll("[data-rstyle]");
  var currentStyle = "circled";

  var CIRCLED = "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ";
  var SQUARED = "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆅🆆🆇🆈🆉";
  var SERIF_UPPER = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙";

  function getCircled(ch) {
    var idx = ch.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < 26) return CIRCLED[idx];
    return ch;
  }

  function getSquared(ch) {
    var idx = ch.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < 26) return SQUARED[idx];
    return ch;
  }

  function getSerif(ch) {
    var idx = ch.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < 26) return SERIF_UPPER[idx];
    return ch;
  }

  function generate() {
    var text = input.value;
    if (!text.trim()) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var result = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " " || ch === "\n" || ch === "\t") { result += ch; continue; }
      if (currentStyle === "circled") result += getCircled(ch);
      else if (currentStyle === "squared") result += getSquared(ch);
      else result += getSerif(ch);
    }
    output.textContent = result;
  }

  genBtn.addEventListener("click", generate);

  styleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      styleBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentStyle = btn.dataset.rstyle;
      if (output.textContent !== "Rainbow text will appear here.") generate();
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Rainbow text will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
