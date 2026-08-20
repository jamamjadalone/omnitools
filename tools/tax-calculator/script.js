(function () {
  "use strict";
  var incomeEl = document.getElementById("taxIncome");
  var filingEl = document.getElementById("taxFiling");
  var calcBtn = document.getElementById("calcTaxBtn");
  var resultBox = document.getElementById("taxResult");
  var totalEl = document.getElementById("taxTotal");
  var effRateEl = document.getElementById("taxEffRate");
  var afterEl = document.getElementById("taxAfter");
  var breakdownWrap = document.getElementById("taxBreakdown");
  var breakdownBody = document.getElementById("taxBreakdownBody");
  var emptyEl = document.getElementById("taxEmpty");

  var brackets = {
    single: [
      [11600, 0.10], [47150, 0.12], [100525, 0.22],
      [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
    ],
    married: [
      [23200, 0.10], [94300, 0.12], [201050, 0.22],
      [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]
    ],
    head: [
      [16550, 0.10], [63100, 0.12], [100500, 0.22],
      [191950, 0.24], [243700, 0.32], [609350, 0.35], [Infinity, 0.37]
    ]
  };

  function fmt(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function calculate() {
    var income = parseFloat(incomeEl.value);
    var filing = filingEl.value;
    if (isNaN(income) || income < 0) { window.OmniTools.showToast("Please enter a valid income.", "error"); return; }

    var br = brackets[filing];
    var tax = 0, prev = 0;
    var rows = [];
    for (var i = 0; i < br.length; i++) {
      var limit = br[i][0];
      var rate = br[i][1];
      var taxable = Math.min(income, limit) - prev;
      if (taxable <= 0) break;
      var taxInBracket = taxable * rate;
      tax += taxInBracket;
      rows.push([
        "$" + prev.toLocaleString() + " \u2013 $" + Math.min(income, limit).toLocaleString(),
        (rate * 100).toFixed(0) + "%",
        fmt(taxInBracket)
      ]);
      prev = limit;
    }

    var effRate = income > 0 ? (tax / income) * 100 : 0;
    totalEl.textContent = fmt(tax);
    effRateEl.textContent = effRate.toFixed(2) + "%";
    afterEl.textContent = fmt(income - tax);
    resultBox.hidden = false;
    emptyEl.hidden = true;

    breakdownBody.innerHTML = "";
    rows.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td>";
      breakdownBody.appendChild(tr);
    });
    breakdownWrap.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [incomeEl, filingEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
})();
