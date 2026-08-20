(function () {
  "use strict";
  const diceCount = document.getElementById("diceCount");
  const diceSides = document.getElementById("diceSides");
  const rollBtn = document.getElementById("rollBtn");
  const copyBtn = document.getElementById("copyBtn");
  const diceTotal = document.getElementById("diceTotal");
  const diceBreakdown = document.getElementById("diceBreakdown");
  const rollHistory = document.getElementById("rollHistory");
  const quickRolls = document.getElementById("quickRolls");

  var history = [];

  function secureRandomInt(max) {
    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return (arr[0] % max) + 1;
  }

  function roll(count, sides) {
    var results = [];
    var total = 0;
    for (var i = 0; i < count; i++) {
      var val = secureRandomInt(sides);
      results.push(val);
      total += val;
    }
    return { results: results, total: total, count: count, sides: sides };
  }

  function render(result) {
    diceTotal.textContent = result.total;
    var html = "";
    result.results.forEach(function (v) {
      html += '<span class="die-chip">' + v + '</span>';
    });
    diceBreakdown.innerHTML = html;

    history.unshift(result);
    if (history.length > 20) history.pop();
    var histHtml = "";
    history.forEach(function (h) {
      histHtml += '<div class="roll-history-item">' + h.count + 'd' + h.sides + ': ' + h.total + ' (' + h.results.join(", ") + ')</div>';
    });
    rollHistory.innerHTML = histHtml;
  }

  function doRoll() {
    var count = parseInt(diceCount.value, 10) || 1;
    var sides = parseInt(diceSides.value, 10) || 6;
    if (count < 1) count = 1;
    if (count > 100) count = 100;
    if (sides < 2) sides = 2;
    if (sides > 1000) sides = 1000;
    render(roll(count, sides));
  }

  rollBtn.addEventListener("click", doRoll);

  copyBtn.addEventListener("click", function () {
    if (!history.length) return;
    var lines = history.map(function (h) { return h.count + "d" + h.sides + ": " + h.total + " (" + h.results.join(", ") + ")"; });
    window.OmniTools.copyText(lines.join("\n")).then(function () { window.OmniTools.showToast("Roll history copied.", "success"); });
  });

  quickRolls.querySelectorAll(".dice-quick").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parts = btn.dataset.dice.split("d");
      diceCount.value = parseInt(parts[0], 10);
      diceSides.value = parseInt(parts[1], 10);
      doRoll();
    });
  });
})();
