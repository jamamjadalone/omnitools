(function () {
  "use strict";
  const display = document.getElementById("swDisplay");
  const startBtn = document.getElementById("startBtn");
  const lapBtn = document.getElementById("lapBtn");
  const resetBtn = document.getElementById("resetBtn");
  const copyBtn = document.getElementById("copyBtn");
  const lapLog = document.getElementById("lapLog");

  var running = false;
  var startTime = 0;
  var elapsed = 0;
  var lastLapTime = 0;
  var laps = [];
  var rafId = null;

  function formatTime(ms) {
    var totalSec = Math.floor(ms / 1000);
    var min = Math.floor(totalSec / 60);
    var sec = totalSec % 60;
    var milli = ms % 1000;
    var mm = String(min).padStart(2, "0");
    var ss = String(sec).padStart(2, "0");
    var mmm = String(milli).padStart(3, "0");
    return mm + ":" + ss + "." + mmm;
  }

  function update() {
    var now = performance.now();
    elapsed = Math.floor(now - startTime);
    display.textContent = formatTime(elapsed);
    if (running) rafId = requestAnimationFrame(update);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now() - elapsed;
    rafId = requestAnimationFrame(update);
    startBtn.textContent = "Stop";
    startBtn.classList.remove("btn-primary");
    startBtn.classList.add("btn-secondary");
    lapBtn.disabled = false;
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    startBtn.textContent = "Start";
    startBtn.classList.remove("btn-secondary");
    startBtn.classList.add("btn-primary");
    lapBtn.disabled = true;
  }

  function lap() {
    if (!running) return;
    var split = elapsed - lastLapTime;
    lastLapTime = elapsed;
    laps.push({ num: laps.length + 1, split: split, total: elapsed });
    renderLaps();
  }

  function reset() {
    stop();
    elapsed = 0;
    lastLapTime = 0;
    laps = [];
    display.textContent = "00:00.000";
    lapLog.innerHTML = "";
  }

  function renderLaps() {
    var html = "";
    for (var i = laps.length - 1; i >= 0; i--) {
      var l = laps[i];
      html += '<div class="lap-item">' +
        '<span class="lap-num">Lap ' + l.num + '</span>' +
        '<span class="lap-split">' + formatTime(l.split) + '</span>' +
        '<span class="lap-total">' + formatTime(l.total) + '</span></div>';
    }
    lapLog.innerHTML = html;
  }

  startBtn.addEventListener("click", function () { running ? stop() : start(); });
  lapBtn.addEventListener("click", lap);
  resetBtn.addEventListener("click", reset);

  copyBtn.addEventListener("click", function () {
    if (!laps.length) return;
    var lines = laps.map(function (l) { return "Lap " + l.num + ": " + formatTime(l.split) + " (total: " + formatTime(l.total) + ")"; });
    window.OmniTools.copyText(lines.join("\n")).then(function () { window.OmniTools.showToast("Lap times copied.", "success"); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !e.repeat) { e.preventDefault(); running ? stop() : start(); }
    if (e.code === "KeyL" && !e.repeat) lap();
    if (e.code === "KeyR" && !e.repeat) reset();
  });
})();
