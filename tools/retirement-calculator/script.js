(function () {
  "use strict";
  var ageEl = document.getElementById("retAge");
  var retireAgeEl = document.getElementById("retRetireAge");
  var savingsEl = document.getElementById("retSavings");
  var monthlyEl = document.getElementById("retMonthly");
  var rateEl = document.getElementById("retRate");
  var calcBtn = document.getElementById("calcRetBtn");
  var resultBox = document.getElementById("retResult");
  var projectedEl = document.getElementById("retProjected");
  var contribEl = document.getElementById("retContrib");
  var interestEl = document.getElementById("retInterest");
  var growthWrap = document.getElementById("retGrowthWrap");
  var growthBody = document.getElementById("retGrowthBody");
  var emptyEl = document.getElementById("retEmpty");

  function fmt(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function calculate() {
    var age = parseInt(ageEl.value, 10);
    var retireAge = parseInt(retireAgeEl.value, 10);
    var savings = parseFloat(savingsEl.value);
    var monthly = parseFloat(monthlyEl.value);
    var rate = parseFloat(rateEl.value);
    if (isNaN(age) || isNaN(retireAge) || isNaN(savings) || isNaN(monthly) || isNaN(rate)) {
      window.OmniTools.showToast("Please enter valid values.", "error");
      return;
    }
    if (retireAge <= age) { window.OmniTools.showToast("Retirement age must be greater than current age.", "error"); return; }

    var years = retireAge - age;
    var r = rate / 100 / 12;
    var n = years * 12;
    var futureSavings = savings * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
    var totalContributions = savings + monthly * n;
    var totalInterest = futureSavings - totalContributions;

    projectedEl.textContent = fmt(futureSavings);
    contribEl.textContent = fmt(totalContributions);
    interestEl.textContent = fmt(totalInterest);
    resultBox.hidden = false;
    emptyEl.hidden = true;

    growthBody.innerHTML = "";
    var balance = savings;
    var totalContrib = savings;
    for (var y = 1; y <= years; y++) {
      for (var m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthly;
        totalContrib += monthly;
      }
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + (age + y) + "</td><td>" + fmt(balance) + "</td><td>" + fmt(totalContrib) + "</td>";
      growthBody.appendChild(tr);
    }
    growthWrap.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [ageEl, retireAgeEl, savingsEl, monthlyEl, rateEl].forEach(function (el) {
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); });
  });
})();
