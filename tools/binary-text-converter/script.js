(function () {
  "use strict";
  var input = document.getElementById("binaryInput");
  var output = document.getElementById("binaryOutput");
  var toBinaryBtn = document.getElementById("toBinaryBtn");
  var toTextBtn = document.getElementById("toTextBtn");
  var copyBtn = document.getElementById("copyBtn");
  var sepButtons = document.querySelectorAll("[data-separator]");
  var currentSep = "space";

  function textToBinary(text, sep) {
    var result = [];
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      var binary = code.toString(2);
      while (binary.length < 8) binary = "0" + binary;
      result.push(binary);
    }
    return sep === "space" ? result.join(" ") : result.join("");
  }

  function binaryToText(binary) {
    var clean = binary.replace(/[^01]/g, "");
    if (clean.length === 0 || clean.length % 8 !== 0) return null;
    var result = "";
    for (var i = 0; i < clean.length; i += 8) {
      var byte = clean.substring(i, i + 8);
      var code = parseInt(byte, 2);
      if (code >= 32 && code <= 126) {
        result += String.fromCharCode(code);
      } else if (code === 10) {
        result += "\n";
      } else if (code === 13) {
        result += "\r";
      } else if (code === 9) {
        result += "\t";
      } else {
        result += String.fromCharCode(code);
      }
    }
    return result;
  }

  toBinaryBtn.addEventListener("click", function () {
    var text = input.value;
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    output.textContent = textToBinary(text, currentSep);
  });

  toTextBtn.addEventListener("click", function () {
    var text = input.value;
    if (!text) { window.OmniTools.showToast("Enter binary code first.", "error"); return; }
    var result = binaryToText(text);
    if (result === null) {
      window.OmniTools.showToast("Invalid binary input. Make sure it contains only 0s and 1s in multiples of 8.", "error");
      return;
    }
    output.textContent = result;
  });

  sepButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      sepButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentSep = btn.dataset.separator;
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Conversion will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
