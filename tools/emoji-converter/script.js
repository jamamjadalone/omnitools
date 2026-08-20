(function () {
  "use strict";
  var input = document.getElementById("emojiInput");
  var toCharBtn = document.getElementById("toCharBtn");
  var toEntityBtn = document.getElementById("toEntityBtn");
  var toCodePointBtn = document.getElementById("toCodePointBtn");
  var fromCodePointBtn = document.getElementById("fromCodePointBtn");
  var errorBox = document.getElementById("emojiError");
  var output = document.getElementById("emojiOutput");
  var copyBtn = document.getElementById("copyBtn");

  function getChars(str) {
    var chars = [];
    var i = 0;
    while (i < str.length) {
      var cp = str.codePointAt(i);
      chars.push(String.fromCodePoint(cp));
      i += cp > 0xFFFF ? 2 : 1;
    }
    return chars;
  }

  toCharBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value.trim();
    if (!val) { errorBox.textContent = "Enter some text first."; errorBox.style.display = "flex"; return; }
    try {
      var txt = document.createElement("textarea");
      txt.innerHTML = val;
      output.textContent = txt.value;
    } catch (e) {
      errorBox.textContent = "Conversion failed.";
      errorBox.style.display = "flex";
    }
  });

  toEntityBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value;
    if (!val) { errorBox.textContent = "Enter some text first."; errorBox.style.display = "flex"; return; }
    var chars = getChars(val);
    output.textContent = chars.map(function (ch) {
      var cp = ch.codePointAt(0);
      return "&#" + cp + ";";
    }).join("");
  });

  toCodePointBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value;
    if (!val) { errorBox.textContent = "Enter some text first."; errorBox.style.display = "flex"; return; }
    var chars = getChars(val);
    output.textContent = chars.map(function (ch) {
      var cp = ch.codePointAt(0);
      return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
    }).join(" ");
  });

  fromCodePointBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value.trim();
    if (!val) { errorBox.textContent = "Enter code points first."; errorBox.style.display = "flex"; return; }
    var parts = val.split(/[\s,]+/);
    var result = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].replace(/^U\+/i, "").replace(/^0x/i, "").replace(/^\\u/i, "");
      var cp = parseInt(p, 16);
      if (isNaN(cp)) { errorBox.textContent = "Invalid code point: " + parts[i]; errorBox.style.display = "flex"; return; }
      result += String.fromCodePoint(cp);
    }
    output.textContent = result;
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Result will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
