(function () {
  "use strict";
  var dobEl = document.getElementById("dobInput");
  var refEl = document.getElementById("ageRefDate");
  var calcBtn = document.getElementById("calcAgeBtn");
  var resultBox = document.getElementById("ageResult");
  var yearsEl = document.getElementById("ageYears");
  var monthsEl = document.getElementById("ageMonths");
  var daysEl = document.getElementById("ageDays");
  var totalDaysEl = document.getElementById("ageTotalDays");
  var weeksEl = document.getElementById("ageWeeks");
  var hoursEl = document.getElementById("ageHours");
  var extraWrap = document.getElementById("ageExtra");
  var nextBdayEl = document.getElementById("ageNextBday");
  var zodiacEl = document.getElementById("ageZodiac");
  var emptyEl = document.getElementById("ageEmpty");

  var zodiacSigns = [
    { name: "Capricorn", end: [1, 19] }, { name: "Aquarius", end: [2, 18] },
    { name: "Pisces", end: [3, 20] }, { name: "Aries", end: [4, 19] },
    { name: "Taurus", end: [5, 20] }, { name: "Gemini", end: [6, 20] },
    { name: "Cancer", end: [7, 22] }, { name: "Leo", end: [8, 22] },
    { name: "Virgo", end: [9, 22] }, { name: "Libra", end: [10, 22] },
    { name: "Scorpio", end: [11, 21] }, { name: "Sagittarius", end: [12, 21] },
    { name: "Capricorn", end: [12, 31] }
  ];

  function getZodiac(m, d) {
    for (var i = 0; i < zodiacSigns.length; i++) {
      if (m < zodiacSigns[i].end[0] || (m === zodiacSigns[i].end[0] && d <= zodiacSigns[i].end[1])) {
        return zodiacSigns[i].name;
      }
    }
    return "Capricorn";
  }

  function calculate() {
    var dob = new Date(dobEl.value);
    if (isNaN(dob.getTime())) { window.OmniTools.showToast("Please select a valid date of birth.", "error"); return; }
    var ref = refEl.value ? new Date(refEl.value) : new Date();
    if (ref < dob) { window.OmniTools.showToast("Reference date must be after date of birth.", "error"); return; }

    var years = ref.getFullYear() - dob.getFullYear();
    var months = ref.getMonth() - dob.getMonth();
    var days = ref.getDate() - dob.getDate();
    if (days < 0) { months--; var prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0); days += prevMonth.getDate(); }
    if (months < 0) { years--; months += 12; }

    var totalMs = ref.getTime() - dob.getTime();
    var totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    var totalWeeks = Math.floor(totalDays / 7);
    var totalHours = Math.floor(totalMs / (1000 * 60 * 60));

    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    totalDaysEl.textContent = totalDays.toLocaleString();
    weeksEl.textContent = totalWeeks.toLocaleString();
    hoursEl.textContent = totalHours.toLocaleString();
    resultBox.hidden = false;
    emptyEl.hidden = true;

    var nextBday = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday <= ref) nextBday.setFullYear(nextBday.getFullYear() + 1);
    var daysUntil = Math.ceil((nextBday - ref) / (1000 * 60 * 60 * 24));
    nextBdayEl.textContent = daysUntil === 0 ? "Today!" : daysUntil + " days";

    zodiacEl.textContent = getZodiac(dob.getMonth() + 1, dob.getDate());
    extraWrap.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  dobEl.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); });
  refEl.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); });
})();
