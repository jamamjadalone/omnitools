(function () {
  "use strict";
  const hoursInput = document.getElementById("hoursInput");
  const minutesInput = document.getElementById("minutesInput");
  const secondsInput = document.getElementById("secondsInput");
  const display = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const soundEnabled = document.getElementById("soundEnabled");
  const output = document.getElementById("timerOutput");

  let totalSeconds = 0;
  let remaining = 0;
  let intervalId = null;
  let endTime = 0;

  function pad(n) { return String(n).padStart(2, "0"); }

  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? pad(h) + ":" + pad(m) + ":" + pad(s) : pad(m) + ":" + pad(s);
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    display.classList.toggle("warning", remaining <= 10 && remaining > 0);
    display.classList.toggle("done", remaining === 0);
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  function tick() {
    const now = Date.now();
    remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      output.textContent = "Time's up!";
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      if (soundEnabled.checked) playBeep();
    }
  }

  function start() {
    if (intervalId) return;
    const h = parseInt(hoursInput.value, 10) || 0;
    const m = parseInt(minutesInput.value, 10) || 0;
    const s = parseInt(secondsInput.value, 10) || 0;
    totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) {
      output.textContent = "Please set a time greater than zero.";
      return;
    }
    if (remaining <= 0) remaining = totalSeconds;
    endTime = Date.now() + remaining * 1000;
    intervalId = setInterval(tick, 200);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    output.textContent = "Counting down...";
  }

  function pause() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
    remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    output.textContent = "Paused.";
  }

  function reset() {
    clearInterval(intervalId);
    intervalId = null;
    remaining = 0;
    display.classList.remove("warning", "done");
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    const h = parseInt(hoursInput.value, 10) || 0;
    const m = parseInt(minutesInput.value, 10) || 0;
    const s = parseInt(secondsInput.value, 10) || 0;
    totalSeconds = h * 3600 + m * 60 + s;
    updateDisplay();
    output.textContent = "Set your time and press Start.";
  }

  [hoursInput, minutesInput, secondsInput].forEach(function (el) {
    el.addEventListener("input", function () {
      if (!intervalId) {
        remaining = 0;
        display.classList.remove("warning", "done");
        const h = parseInt(hoursInput.value, 10) || 0;
        const m = parseInt(minutesInput.value, 10) || 0;
        const s = parseInt(secondsInput.value, 10) || 0;
        totalSeconds = h * 3600 + m * 60 + s;
        updateDisplay();
      }
    });
  });

  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);
})();
