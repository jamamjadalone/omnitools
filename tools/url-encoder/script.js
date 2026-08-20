(function () {
  "use strict";
  var input = document.getElementById("urlInput");
  var encodeBtn = document.getElementById("encodeBtn");
  var decodeBtn = document.getElementById("decodeBtn");
  var errorBox = document.getElementById("urlError");
  var output = document.getElementById("urlOutput");
  var copyBtn = document.getElementById("copyBtn");

  encodeBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value;
    if (!val) { errorBox.textContent = "Enter a string first."; errorBox.style.display = "flex"; return; }
    try {
      output.textContent = encodeURIComponent(val);
    } catch (e) {
      errorBox.textContent = "Encoding failed: " + e.message;
      errorBox.style.display = "flex";
    }
  });

  decodeBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value;
    if (!val) { errorBox.textContent = "Enter a string first."; errorBox.style.display = "flex"; return; }
    try {
      output.textContent = decodeURIComponent(val);
    } catch (e) {
      errorBox.textContent = "Decoding failed: " + e.message;
      errorBox.style.display = "flex";
    }
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Result will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
