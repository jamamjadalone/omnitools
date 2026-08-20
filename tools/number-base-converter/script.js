(function () {
  "use strict";
  var input = document.getElementById("numInput");
  var baseSelect = document.getElementById("baseSelect");
  var convertBtn = document.getElementById("convertBtn");
  var errorBox = document.getElementById("baseError");
  var binOut = document.getElementById("binOut");
  var octOut = document.getElementById("octOut");
  var decOut = document.getElementById("decOut");
  var hexOut = document.getElementById("hexOut");
  var copyBtn = document.getElementById("copyBtn");

  var validChars = { "2": "01", "8": "01234567", "10": "0123456789", "16": "0123456789abcdef" };

  function convert() {
    errorBox.style.display = "none";
    var val = input.value.trim().toLowerCase();
    if (!val) { errorBox.textContent = "Enter a number first."; errorBox.style.display = "flex"; return; }
    var base = parseInt(baseSelect.value);
    var valid = validChars[base];
    for (var i = 0; i < val.length; i++) {
      if (valid.indexOf(val[i]) === -1) {
        errorBox.textContent = "Invalid character '" + val[i] + "' for base " + base + ".";
        errorBox.style.display = "flex";
        return;
      }
    }
    var dec = parseInt(val, base);
    if (isNaN(dec)) { errorBox.textContent = "Could not parse the number."; errorBox.style.display = "flex"; return; }
    binOut.innerHTML = "<strong>Binary:</strong> " + dec.toString(2);
    octOut.innerHTML = "<strong>Octal:</strong> " + dec.toString(8);
    decOut.innerHTML = "<strong>Decimal:</strong> " + dec.toString(10);
    hexOut.innerHTML = "<strong>Hex:</strong> " + dec.toString(16).toUpperCase();
  }

  convertBtn.addEventListener("click", convert);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") convert(); });

  copyBtn.addEventListener("click", function () {
    var text = "Binary: " + binOut.textContent.replace("Binary: ", "") + "\n" +
               "Octal: " + octOut.textContent.replace("Octal: ", "") + "\n" +
               "Decimal: " + decOut.textContent.replace("Decimal: ", "") + "\n" +
               "Hex: " + hexOut.textContent.replace("Hex: ", "");
    if (binOut.textContent.indexOf("—") !== -1) return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
