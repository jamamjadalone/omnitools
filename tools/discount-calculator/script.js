(function () {
  "use strict";
  var originalEl = document.getElementById("discOriginal");
  var percentEl = document.getElementById("discPercent");
  var calcBtn = document.getElementById("calcDiscBtn");
  var resultBox = document.getElementById("discResult");
  var saleEl = document.getElementById("discSale");
  var savingsEl = document.getElementById("discSavings");
  var finalEl = document.getElementById("discFinal");

  function fmt(n) { return "$" + n.toFixed(2); }

  function calculate() {
    var original = parseFloat(originalEl.value);
    var percent = parseFloat(percentEl.value);
    if (isNaN(original) || isNaN(percent) || original < 0 || percent < 0 || percent > 100) {
      window.OmniTools.showToast("Please enter valid values.", "error");
      return;
    }
    var savings = original * (percent / 100);
    var salePrice = original - savings;
    saleEl.textContent = fmt(salePrice);
    savingsEl.textContent = fmt(savings);
    finalEl.textContent = fmt(salePrice);
    resultBox.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [originalEl, percentEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
  [originalEl, percentEl].forEach(function (el) { el.addEventListener("input", calculate); });
})();
