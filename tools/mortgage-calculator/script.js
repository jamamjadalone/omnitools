(function () {
  "use strict";
  var priceEl = document.getElementById("mortPrice");
  var downEl = document.getElementById("mortDown");
  var rateEl = document.getElementById("mortRate");
  var termEl = document.getElementById("mortTerm");
  var calcBtn = document.getElementById("calcMortBtn");
  var resultBox = document.getElementById("mortResult");
  var monthlyEl = document.getElementById("mortMonthly");
  var loanEl = document.getElementById("mortLoan");
  var interestEl = document.getElementById("mortInterest");
  var totalEl = document.getElementById("mortTotal");
  var amortWrap = document.getElementById("mortAmortWrap");
  var amortBody = document.getElementById("mortAmortBody");
  var emptyEl = document.getElementById("mortEmpty");

  function fmt(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function calculate() {
    var price = parseFloat(priceEl.value);
    var down = parseFloat(downEl.value);
    var rate = parseFloat(rateEl.value);
    var years = parseInt(termEl.value, 10);
    if (isNaN(price) || isNaN(down) || isNaN(rate) || price <= 0 || down < 0) {
      window.OmniTools.showToast("Please enter valid values.", "error");
      return;
    }
    var P = price - down;
    var r = rate / 100 / 12;
    var n = years * 12;
    var monthly;
    if (r === 0) { monthly = P / n; }
    else { monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); }
    var totalCost = monthly * n;
    var totalInterest = totalCost - P;

    monthlyEl.textContent = fmt(monthly);
    loanEl.textContent = fmt(P);
    interestEl.textContent = fmt(totalInterest);
    totalEl.textContent = fmt(totalCost);
    resultBox.hidden = false;
    emptyEl.hidden = true;

    amortBody.innerHTML = "";
    var balance = P;
    var yearlyR = rate / 100;
    for (var y = 1; y <= years; y++) {
      var yearPrincipal = 0, yearInterest = 0;
      for (var m = 0; m < 12; m++) {
        var intPmt = balance * r;
        var princPmt = monthly - intPmt;
        yearPrincipal += princPmt;
        yearInterest += intPmt;
        balance -= princPmt;
      }
      if (balance < 0) balance = 0;
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + y + "</td><td>" + fmt(yearPrincipal) + "</td><td>" + fmt(yearInterest) + "</td><td>" + fmt(balance) + "</td>";
      amortBody.appendChild(tr);
    }
    amortWrap.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [priceEl, downEl, rateEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
})();
