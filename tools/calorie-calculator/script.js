(function () {
  "use strict";
  var genderEl = document.getElementById("calGender");
  var ageEl = document.getElementById("calAge");
  var weightEl = document.getElementById("calWeight");
  var heightEl = document.getElementById("calHeight");
  var activityEl = document.getElementById("calActivity");
  var calcBtn = document.getElementById("calcCalBtn");
  var resultBox = document.getElementById("calResult");
  var bmrEl = document.getElementById("calBMR");
  var tdeeEl = document.getElementById("calTDEE");
  var lossEl = document.getElementById("calLoss");
  var gainEl = document.getElementById("calGain");

  function fmt(n) { return Math.round(n).toLocaleString() + " cal/day"; }

  function calculate() {
    var gender = genderEl.value;
    var age = parseInt(ageEl.value, 10);
    var weight = parseFloat(weightEl.value);
    var height = parseFloat(heightEl.value);
    var activity = parseFloat(activityEl.value);
    if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
      window.OmniTools.showToast("Please enter valid positive values.", "error");
      return;
    }
    var bmr;
    if (gender === "male") { bmr = 10 * weight + 6.25 * height - 5 * age + 5; }
    else { bmr = 10 * weight + 6.25 * height - 5 * age - 161; }
    var tdee = bmr * activity;

    bmrEl.textContent = fmt(bmr);
    tdeeEl.textContent = fmt(tdee);
    lossEl.textContent = fmt(tdee - 500);
    gainEl.textContent = fmt(tdee + 500);
    resultBox.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  [genderEl, ageEl, weightEl, heightEl, activityEl].forEach(function (el) {
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); });
  });
})();
