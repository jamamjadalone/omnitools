(function () {
  "use strict";
  var pctOfX = document.getElementById("pctOfX");
  var pctOfY = document.getElementById("pctOfY");
  var pctOfResult = document.getElementById("pctOfResult");
  var pctChgFrom = document.getElementById("pctChgFrom");
  var pctChgTo = document.getElementById("pctChgTo");
  var pctChgResult = document.getElementById("pctChgResult");
  var pctWhatX = document.getElementById("pctWhatX");
  var pctWhatY = document.getElementById("pctWhatY");
  var pctWhatResult = document.getElementById("pctWhatResult");

  function fmt(n) { return n.toLocaleString("en-US", { maximumFractionDigits: 4 }); }

  function calcOf() {
    var pct = parseFloat(pctOfX.value);
    var num = parseFloat(pctOfY.value);
    if (isNaN(pct) || isNaN(num)) { pctOfResult.textContent = "\u2014"; return; }
    pctOfResult.textContent = fmt(pct / 100 * num);
  }

  function calcChange() {
    var from = parseFloat(pctChgFrom.value);
    var to = parseFloat(pctChgTo.value);
    if (isNaN(from) || isNaN(to) || from === 0) { pctChgResult.textContent = "\u2014"; return; }
    var change = ((to - from) / Math.abs(from)) * 100;
    pctChgResult.textContent = fmt(change) + "%";
  }

  function calcWhat() {
    var x = parseFloat(pctWhatX.value);
    var y = parseFloat(pctWhatY.value);
    if (isNaN(x) || isNaN(y) || y === 0) { pctWhatResult.textContent = "\u2014"; return; }
    pctWhatResult.textContent = fmt((x / y) * 100) + "%";
  }

  [pctOfX, pctOfY].forEach(function (el) { el.addEventListener("input", calcOf); });
  [pctChgFrom, pctChgTo].forEach(function (el) { el.addEventListener("input", calcChange); });
  [pctWhatX, pctWhatY].forEach(function (el) { el.addEventListener("input", calcWhat); });

  calcOf(); calcChange(); calcWhat();
})();
