(function () {
  "use strict";
  var lmpInput = document.getElementById("lmpDate");
  var calcBtn = document.getElementById("calcBtn");
  var resultEl = document.getElementById("dueResult");

  lmpInput.valueAsDate = new Date(Date.now() - 14 * 86400000);

  function formatDate(d) {
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function calculate() {
    var lmp = lmpInput.valueAsDate;
    if (!lmp) { window.OmniTools.showToast("Select a date.", "error"); return; }
    var dueDate = new Date(lmp.getTime() + 280 * 86400000);
    var today = new Date();
    var daysPreg = Math.floor((today - lmp) / 86400000);
    var weeks = Math.floor(daysPreg / 7);
    var days = daysPreg % 7;
    var trimester = weeks < 13 ? "First" : weeks < 27 ? "Second" : "Third";
    var progress = Math.min(100, Math.round((daysPreg / 280) * 100));
    var daysLeft = Math.max(0, 280 - daysPreg);

    var html = '<div style="font-size:1.8rem;font-weight:700;margin-bottom:8px;">' + formatDate(dueDate) + '</div>';
    html += '<div style="color:var(--text-dim);margin-bottom:16px;">Estimated Due Date</div>';
    html += '<div class="preg-progress"><div class="preg-progress-bar" style="width:' + progress + '%;"></div></div>';
    html += '<div style="text-align:center;font-size:0.85rem;color:var(--text-dim);margin-bottom:16px;">' + progress + '% through pregnancy</div>';
    html += '<div class="preg-info-row"><span class="preg-info-label">Weeks pregnant</span><span class="preg-info-value">' + weeks + ' weeks, ' + days + ' days</span></div>';
    html += '<div class="preg-info-row"><span class="preg-info-label">Trimester</span><span class="preg-info-value">' + trimester + '</span></div>';
    html += '<div class="preg-info-row"><span class="preg-info-label">Days remaining</span><span class="preg-info-value">' + daysLeft + '</span></div>';
    html += '<div class="preg-info-row"><span class="preg-info-label">LMP</span><span class="preg-info-value">' + formatDate(lmp) + '</span></div>';
    resultEl.innerHTML = html;
  }

  calcBtn.addEventListener("click", calculate);
  calculate();
})();
