(function () {
  "use strict";
  var dateFrom = document.getElementById("dateFrom");
  var dateTo = document.getElementById("dateTo");
  var diffResult = document.getElementById("dateDiffResult");
  var dateBase = document.getElementById("dateBase");
  var dateOp = document.getElementById("dateOp");
  var dateDays = document.getElementById("dateDays");
  var addResult = document.getElementById("dateAddResult");

  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function fmtDate(d) { return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " (" + daysOfWeek[d.getDay()] + ")"; }

  function calcDiff() {
    var a = new Date(dateFrom.value);
    var b = new Date(dateTo.value);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) { diffResult.textContent = "\u2014"; return; }
    var diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    diffResult.textContent = diff.toLocaleString() + " day" + (Math.abs(diff) !== 1 ? "s" : "");
  }

  function calcAdd() {
    var base = new Date(dateBase.value);
    if (isNaN(base.getTime())) { addResult.textContent = "\u2014"; return; }
    var days = parseInt(dateDays.value, 10) || 0;
    var result = new Date(base);
    if (dateOp.value === "add") { result.setDate(result.getDate() + days); }
    else { result.setDate(result.getDate() - days); }
    addResult.textContent = fmtDate(result);
  }

  [dateFrom, dateTo].forEach(function (el) { el.addEventListener("change", calcDiff); });
  [dateBase, dateOp, dateDays].forEach(function (el) { el.addEventListener("change", calcAdd); el.addEventListener("input", calcAdd); });

  var today = new Date().toISOString().slice(0, 10);
  dateFrom.value = today;
  dateTo.value = today;
  dateBase.value = today;
  calcDiff(); calcAdd();
})();
