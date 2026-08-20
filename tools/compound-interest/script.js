(function () {
  "use strict";
  var principalEl = document.getElementById("ciPrincipal");
  var rateEl = document.getElementById("ciRate");
  var yearsEl = document.getElementById("ciYears");
  var freqEl = document.getElementById("ciFreq");
  var calcBtn = document.getElementById("calcCiBtn");
  var resultBox = document.getElementById("ciResult");
  var futureEl = document.getElementById("ciFuture");
  var interestEl = document.getElementById("ciInterest");
  var contribEl = document.getElementById("ciContrib");
  var growthWrap = document.getElementById("ciGrowthWrap");
  var growthBody = document.getElementById("ciGrowthBody");
  var emptyEl = document.getElementById("ciEmpty");

  function fmt(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function calculate() {
    var P = parseFloat(principalEl.value);
    var rate = parseFloat(rateEl.value);
    var years = parseInt(yearsEl.value, 10);
    var n = parseInt(freqEl.value, 10);
    if (isNaN(P) || isNaN(rate) || isNaN(years) || P <= 0 || years <= 0) {
      window.OmniTools.showToast("Please enter valid positive values.", "error");
      return;
    }
    var r = rate / 100;
    var futureValue = P * Math.pow(1 + r / n, n * years);
    var totalInterest = futureValue - P;

    futureEl.textContent = fmt(futureValue);
    interestEl.textContent = fmt(totalInterest);
    contribEl.textContent = fmt(P);
    resultBox.hidden = false;
    emptyEl.hidden = true;

    growthBody.innerHTML = "";
    var balance = P;
    for (var y = 1; y <= years; y++) {
      var prevBalance = balance;
      balance = P * Math.pow(1 + r / n, n * y);
      var yearInterest = balance - prevBalance;
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + y + "</td><td>" + fmt(balance) + "</td><td>" + fmt(yearInterest) + "</td>";
      growthBody.appendChild(tr);
    }
    growthWrap.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [principalEl, rateEl, yearsEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
})();
