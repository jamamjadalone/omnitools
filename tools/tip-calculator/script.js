(function () {
  "use strict";
  const billInput = document.getElementById("billAmount");
  const tipSlider = document.getElementById("tipPercent");
  const tipValue = document.getElementById("tipValue");
  const splitInput = document.getElementById("splitCount");
  const tipAmount = document.getElementById("tipAmount");
  const totalAmount = document.getElementById("totalAmount");
  const perPersonRow = document.getElementById("perPersonRow");
  const perPersonAmount = document.getElementById("perPersonAmount");
  const presets = document.querySelectorAll(".tip-preset");

  function calc() {
    var bill = parseFloat(billInput.value) || 0;
    var tip = parseInt(tipSlider.value, 10);
    var split = parseInt(splitInput.value, 10) || 1;
    if (split < 1) split = 1;

    var tipVal = bill * (tip / 100);
    var total = bill + tipVal;

    tipAmount.textContent = "$" + tipVal.toFixed(2);
    totalAmount.textContent = "$" + total.toFixed(2);

    if (split > 1) {
      perPersonRow.style.display = "";
      perPersonAmount.textContent = "$" + (total / split).toFixed(2);
    } else {
      perPersonRow.style.display = "none";
    }
  }

  tipSlider.addEventListener("input", function () {
    tipValue.textContent = tipSlider.value;
    presets.forEach(function (p) {
      p.classList.toggle("active", parseInt(p.dataset.tip, 10) === parseInt(tipSlider.value, 10));
    });
    calc();
  });

  billInput.addEventListener("input", calc);
  splitInput.addEventListener("input", calc);

  presets.forEach(function (p) {
    p.addEventListener("click", function () {
      tipSlider.value = p.dataset.tip;
      tipValue.textContent = p.dataset.tip;
      presets.forEach(function (x) { x.classList.remove("active"); });
      p.classList.add("active");
      calc();
    });
  });

  calc();
})();
