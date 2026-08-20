(function () {
  "use strict";
  var lmpEl = document.getElementById("pregLMP");
  var calcBtn = document.getElementById("calcPregBtn");
  var resultBox = document.getElementById("pregResult");
  var dueEl = document.getElementById("pregDue");
  var weekEl = document.getElementById("pregWeek");
  var daysEl = document.getElementById("pregDays");
  var trimesterEl = document.getElementById("pregTrimester");
  var remainingEl = document.getElementById("pregRemaining");
  var conceptionEl = document.getElementById("pregConception");
  var emptyEl = document.getElementById("pregEmpty");
  var timeline = document.getElementById("pregTimeline");

  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function fmtDate(d) { return daysOfWeek[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); }

  function calculate() {
    var lmp = new Date(lmpEl.value);
    if (isNaN(lmp.getTime())) { window.OmniTools.showToast("Please select a valid date.", "error"); return; }

    var today = new Date();
    var dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280);

    var daysPreg = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
    var weeksPreg = Math.floor(daysPreg / 7);
    var remaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    if (remaining < 0) remaining = 0;

    var trimester;
    if (weeksPreg < 13) trimester = "First Trimester (Weeks 1-12)";
    else if (weeksPreg < 28) trimester = "Second Trimester (Weeks 13-27)";
    else if (weeksPreg < 40) trimester = "Third Trimester (Weeks 28-40)";
    else trimester = "Due / Past Due";

    var conception = new Date(lmp);
    conception.setDate(conception.getDate() + 14);

    dueEl.textContent = fmtDate(dueDate);
    weekEl.textContent = "Week " + weeksPreg + ", Day " + (daysPreg % 7);
    daysEl.textContent = daysPreg + " days";
    trimesterEl.textContent = trimester;
    remainingEl.textContent = remaining > 0 ? remaining + " days" : "Due date reached!";
    conceptionEl.textContent = fmtDate(conception);
    resultBox.hidden = false;
    emptyEl.hidden = true;

    var t1Start = new Date(lmp);
    var t1End = new Date(lmp); t1End.setDate(t1End.getDate() + 84);
    var t2Start = new Date(t1End); t2Start.setDate(t2Start.getDate() + 1);
    var t2End = new Date(lmp); t2End.setDate(t2End.getDate() + 189);
    var t3Start = new Date(t2End); t3Start.setDate(t3Start.getDate() + 1);

    document.getElementById("tlRange1").textContent = fmtDate(t1Start) + " \u2013 " + fmtDate(t1End);
    document.getElementById("tlRange2").textContent = fmtDate(t2Start) + " \u2013 " + fmtDate(t2End);
    document.getElementById("tlRange3").textContent = fmtDate(t3Start) + " \u2013 " + fmtDate(dueDate);

    var dots = [document.getElementById("tlDot1"), document.getElementById("tlDot2"), document.getElementById("tlDot3")];
    var colors = ["#22c55e", "#3b82f6", "#a855f7"];
    dots.forEach(function (dot, i) {
      dot.style.background = colors[i];
      dot.style.opacity = weeksPreg >= (i * 13) ? "1" : "0.3";
    });

    timeline.hidden = false;
  }

  calcBtn.addEventListener("click", calculate);
  lmpEl.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); });
})();
