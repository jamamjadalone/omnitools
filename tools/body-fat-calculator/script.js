(function () {
  "use strict";
  var genderEl = document.getElementById("bfGender");
  var unitEl = document.getElementById("bfUnit");
  var waistEl = document.getElementById("bfWaist");
  var neckEl = document.getElementById("bfNeck");
  var heightEl = document.getElementById("bfHeight");
  var hipEl = document.getElementById("bfHip");
  var hipField = document.getElementById("bfHipField");
  var heightField = document.getElementById("bfHeightField");
  var calcBtn = document.getElementById("calcBfBtn");
  var resultBox = document.getElementById("bfResult");
  var percentEl = document.getElementById("bfPercent");
  var classEl = document.getElementById("bfClass");

  function switchGender() {
    var g = genderEl.value;
    hipField.hidden = g === "male";
  }

  function classify(gender, pct) {
    if (gender === "male") {
      if (pct < 6) return "Essential Fat";
      if (pct < 14) return "Athletic";
      if (pct < 18) return "Fitness";
      if (pct < 25) return "Average";
      return "Above Average";
    } else {
      if (pct < 14) return "Essential Fat";
      if (pct < 21) return "Athletic";
      if (pct < 25) return "Fitness";
      if (pct < 32) return "Average";
      return "Above Average";
    }
  }

  function calculate() {
    var gender = genderEl.value;
    var waist = parseFloat(waistEl.value);
    var neck = parseFloat(neckEl.value);
    var height = parseFloat(heightEl.value);
    var hip = parseFloat(hipEl.value);
    var isCm = unitEl.value === "cm";

    if (isNaN(waist) || isNaN(neck) || isNaN(height) || waist <= 0 || neck <= 0 || height <= 0) {
      window.OmniTools.showToast("Please enter valid measurements.", "error");
      return;
    }

    var bf;
    if (gender === "male") {
      bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
      if (isNaN(hip) || hip <= 0) { window.OmniTools.showToast("Please enter hip circumference.", "error"); return; }
      bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }

    if (isCm) {
      if (gender === "male") {
        bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
      } else {
        bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
      }
    }

    bf = Math.max(0, Math.min(60, bf));
    percentEl.textContent = bf.toFixed(1) + "%";
    classEl.textContent = classify(gender, bf);
    resultBox.hidden = false;
  }

  genderEl.addEventListener("change", switchGender);
  calcBtn.addEventListener("click", calculate);
  [waistEl, neckEl, heightEl, hipEl].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); }); });
  switchGender();
})();
