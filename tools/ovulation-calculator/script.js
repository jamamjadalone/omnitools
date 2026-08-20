(function () {
  "use strict";
  var lmpInput = document.getElementById("ovLastPeriod");
  var cycleRange = document.getElementById("ovCycleLength");
  var cycleVal = document.getElementById("cycleLenVal");
  var calcBtn = document.getElementById("ovCalcBtn");
  var resultEl = document.getElementById("ovResult");

  lmpInput.valueAsDate = new Date(Date.now() - 14 * 86400000);

  function fmtDate(d) {
    var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return m[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function addDays(d, n) { return new Date(d.getTime() + n * 86400000); }

  function calculate() {
    var lmp = lmpInput.valueAsDate;
    if (!lmp) { window.OmniTools.showToast("Select a date.", "error"); return; }
    var cycleLen = parseInt(cycleRange.value, 10);
    var ovDay = cycleLen - 14;
    var ovDate = addDays(lmp, ovDay);
    var fertileStart = addDays(ovDate, -5);
    var fertileEnd = addDays(ovDate, 1);
    var nextPeriod = addDays(lmp, cycleLen);

    var html = '<div style="font-size:1.3rem;font-weight:700;margin-bottom:12px;">Ovulation: ' + fmtDate(ovDate) + '</div>';
    html += '<div class="ov-date-row ov-highlight"><span class="ov-date-label">Fertile window</span><span class="ov-date-value">' + fmtDate(fertileStart) + ' – ' + fmtDate(fertileEnd) + '</span></div>';
    html += '<div class="ov-date-row"><span class="ov-date-label">Ovulation day</span><span class="ov-date-value">' + fmtDate(ovDate) + ' (day ' + ovDay + ')</span></div>';
    html += '<div class="ov-date-row"><span class="ov-date-label">Most fertile days</span><span class="ov-date-value">' + fmtDate(addDays(ovDate, -2)) + ' – ' + fmtDate(addDays(ovDate, 1)) + '</span></div>';
    html += '<div class="ov-date-row"><span class="ov-date-label">Next period (est.)</span><span class="ov-date-value">' + fmtDate(nextPeriod) + '</span></div>';
    html += '<div class="ov-date-row"><span class="ov-date-label">Cycle length</span><span class="ov-date-value">' + cycleLen + ' days</span></div>';
    resultEl.innerHTML = html;
  }

  cycleRange.addEventListener("input", function () { cycleVal.textContent = cycleRange.value; });
  calcBtn.addEventListener("click", calculate);
  calculate();
})();
