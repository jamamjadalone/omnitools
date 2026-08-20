(function () {
  "use strict";
  var input = document.getElementById("repeatInput");
  var countEl = document.getElementById("repeatCount");
  var sepEl = document.getElementById("repeatSep");
  var output = document.getElementById("repeatOutput");
  var repeatBtn = document.getElementById("repeatBtn");
  var copyBtn = document.getElementById("copyBtn");
  var sepButtons = document.querySelectorAll("[data-sep]");

  function doRepeat() {
    var text = input.value;
    if (!text) {
      window.OmniTools.showToast("Enter some text first.", "error");
      return;
    }
    var count = parseInt(countEl.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 10000) count = 10000;
    var sep = sepEl.value === "\\n" ? "\n" : sepEl.value;
    var result = [];
    for (var i = 0; i < count; i++) result.push(text);
    output.textContent = result.join(sep);
  }

  repeatBtn.addEventListener("click", doRepeat);

  sepButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      sepEl.value = btn.dataset.sep;
      doRepeat();
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Repeated text will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
