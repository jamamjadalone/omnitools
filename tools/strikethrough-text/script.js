(function () {
  "use strict";
  var input = document.getElementById("strikeInput");
  var output = document.getElementById("strikeOutput");
  var genBtn = document.getElementById("strikeBtn");
  var copyBtn = document.getElementById("copyBtn");
  var COMBINING = "\u0336";

  function toMarkdown(text) {
    return "~" + text + "~";
  }

  function toUnicode(text) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
      if (text[i] === " " || text[i] === "\n" || text[i] === "\t") {
        result += text[i];
      } else {
        result += text[i] + COMBINING;
      }
    }
    return result;
  }

  function generate() {
    var text = input.value;
    if (!text.trim()) {
      window.OmniTools.showToast("Enter some text first.", "error");
      return;
    }
    var md = toMarkdown(text);
    var uni = toUnicode(text);
    output.innerHTML =
      '<div class="strike-tabs">' +
        '<div class="strike-tab active" data-tab="md">~markdown~<span class="strike-tab-label">Discord / Telegram</span></div>' +
        '<div class="strike-tab" data-tab="uni">Unicode<span class="strike-tab-label">Works everywhere</span></div>' +
      '</div>' +
      '<div class="output-box" id="strikeResult">' + md + '</div>';

    output.querySelectorAll("[data-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        output.querySelectorAll("[data-tab]").forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        document.getElementById("strikeResult").textContent = tab.dataset.tab === "md" ? md : uni;
      });
    });
  }

  genBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", function () {
    var el = document.getElementById("strikeResult");
    if (!el) return;
    window.OmniTools.copyText(el.textContent).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
