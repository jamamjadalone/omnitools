(function () {
  "use strict";
  const coin = document.getElementById("coin");
  const flipBtn = document.getElementById("flipBtn");
  const coinResult = document.getElementById("coinResult");
  const totalFlips = document.getElementById("totalFlips");
  const headsCount = document.getElementById("headsCount");
  const tailsCount = document.getElementById("tailsCount");
  const headsPct = document.getElementById("headsPct");
  const resetBtn = document.getElementById("resetBtn");

  var stats = { heads: 0, tails: 0, total: 0 };
  var flipping = false;

  function flipCoin() {
    if (flipping) return;
    flipping = true;
    flipBtn.disabled = true;

    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    var isHeads = (arr[0] % 2) === 0;

    coin.classList.remove("show-heads", "show-tails", "flipping");
    void coin.offsetWidth; /* force reflow */

    coin.style.setProperty("--final-rotation", isHeads ? "1440deg" : "1620deg");
    coin.classList.add("flipping");

    setTimeout(function () {
      coin.classList.remove("flipping");
      coin.classList.add(isHeads ? "show-heads" : "show-tails");

      stats.total++;
      if (isHeads) { stats.heads++; coinResult.textContent = "Heads!"; }
      else { stats.tails++; coinResult.textContent = "Tails!"; }

      totalFlips.textContent = stats.total;
      headsCount.textContent = stats.heads;
      tailsCount.textContent = stats.tails;
      headsPct.textContent = stats.total > 0 ? Math.round(stats.heads / stats.total * 100) + "%" : "0%";

      flipping = false;
      flipBtn.disabled = false;
    }, 800);
  }

  flipBtn.addEventListener("click", flipCoin);

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !e.repeat) { e.preventDefault(); flipCoin(); }
  });

  resetBtn.addEventListener("click", function () {
    stats = { heads: 0, tails: 0, total: 0 };
    totalFlips.textContent = "0";
    headsCount.textContent = "0";
    tailsCount.textContent = "0";
    headsPct.textContent = "0%";
    coinResult.innerHTML = "&mdash;";
    coin.classList.remove("show-heads", "show-tails");
  });
})();
