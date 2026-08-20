(function () {
  "use strict";
  var distEl = document.getElementById("fuelDist");
  var mpgEl = document.getElementById("fuelMpg");
  var priceEl = document.getElementById("fuelPrice");
  var calcBtn = document.getElementById("calcFuelBtn");
  var resultBox = document.getElementById("fuelResult");
  var gallonsEl = document.getElementById("fuelGallons");
  var costEl = document.getElementById("fuelCost");
  var perMileEl = document.getElementById("fuelPerMile");

  function fmt(n) { return "$" + n.toFixed(2); }

  function calculate() {
    var dist = parseFloat(distEl.value);
    var mpg = parseFloat(mpgEl.value);
    var price = parseFloat(priceEl.value);
    if (isNaN(dist) || isNaN(mpg) || isNaN(price) || dist <= 0 || mpg <= 0 || price < 0) {
      window.OmniTools.showToast("Please enter valid values.", "error");
      return;
    }
    var gallons = dist / mpg;
    var cost = gallons * price;
    var perMile = cost / dist;

    gallonsEl.textContent = gallons.toFixed(2) + " gallons";
    costEl.textContent = fmt(cost);
    perMileEl.textContent = fmt(perMile);
    resultBox.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [distEl, mpgEl, priceEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
})();
