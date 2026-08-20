(function () {
  "use strict";
  var input = document.getElementById("reverseInput");
  var output = document.getElementById("reverseOutput");
  var genBtn = document.getElementById("reverseBtn");
  var copyBtn = document.getElementById("copyBtn");
  var modeBtns = document.querySelectorAll("[data-rmode]");
  var currentMode = "chars";

  function reverseChars(text) {
    var result = "";
    for (var i = text.length - 1; i >= 0; i--) result += text[i];
    return result;
  }

  function reverseWords(text) {
    return text.split(/\s+/).reverse().join(" ");
  }

  function reverseLines(text) {
    return text.split("\n").reverse().join("\n");
  }

  function doReverse() {
    var text = input.value;
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    if (currentMode === "chars") output.textContent = reverseChars(text);
    else if (currentMode === "words") output.textContent = reverseWords(text);
    else output.textContent = reverseLines(text);
  }

  genBtn.addEventListener("click", doReverse);

  modeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      modeBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentMode = btn.dataset.rmode;
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Reversed text will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
