(function () {
  "use strict";
  const amountEl = document.getElementById("loanAmount");
  const rateEl = document.getElementById("loanRate");
  const termEl = document.getElementById("loanTerm");
  const calcBtn = document.getElementById("calcLoanBtn");
  const resultBox = document.getElementById("loanResult");
  const monthlyEl = document.getElementById("loanMonthly");
  const interestEl = document.getElementById("loanInterest");
  const totalEl = document.getElementById("loanTotal");
  const amortWrap = document.getElementById("amortWrap");
  const amortBody = document.getElementById("amortBody");
  const loanEmpty = document.getElementById("loanEmpty");

  function fmt(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function calculate() {
    const P = parseFloat(amountEl.value);
    const annualRate = parseFloat(rateEl.value);
    const years = parseInt(termEl.value, 10);
    if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || years <= 0) {
      window.OmniTools.showToast("Please enter valid positive values.", "error");
      return;
    }
    const r = annualRate / 100 / 12;
    const n = years * 12;
    let monthly;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalCost = monthly * n;
    const totalInterest = totalCost - P;

    monthlyEl.textContent = fmt(monthly);
    interestEl.textContent = fmt(totalInterest);
    totalEl.textContent = fmt(totalCost);
    resultBox.hidden = false;
    loanEmpty.hidden = true;

    amortBody.innerHTML = "";
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = monthly - interestPayment;
      balance -= principalPayment;
      if (balance < 0) balance = 0;
      const tr = document.createElement("tr");
      tr.innerHTML = "<td>" + i + "</td><td>" + fmt(monthly) + "</td><td>" + fmt(principalPayment) + "</td><td>" + fmt(interestPayment) + "</td><td>" + fmt(balance) + "</td>";
      amortBody.appendChild(tr);
    }
    amortWrap.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [amountEl, rateEl, termEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
})();
