(function () {
  "use strict";
  const workMins = document.getElementById("workMins");
  const breakMins = document.getElementById("breakMins");
  const display = document.getElementById("timerDisplay");
  const phase = document.getElementById("pomoPhase");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const skipBtn = document.getElementById("skipBtn");
  const sessionEl = document.getElementById("pomoSession");
  const statusEl = document.getElementById("pomoStatus");

  let isWork = true;
  let remaining = 0;
  let intervalId = null;
  let endTime = 0;
  let session = 1;

  function pad(n) { return String(n).padStart(2, "0"); }

  function formatTime(sec) {
    return pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    if (remaining === 0) display.classList.add("done");
    else display.classList.remove("done");
  }

  function playBeep(freq, dur) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.value = 0.25;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }

  function setPhase(work) {
    isWork = work;
    const mins = work ? (parseInt(workMins.value, 10) || 25) : (parseInt(breakMins.value, 10) || 5);
    remaining = mins * 60;
    phase.textContent = work ? "WORK" : "BREAK";
    phase.classList.toggle("break-phase", !work);
    statusEl.textContent = work ? "Focus time!" : "Take a break.";
    updateDisplay();
  }

  function tick() {
    const now = Date.now();
    remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      if (isWork) {
        playBeep(600, 0.4);
        setTimeout(function () { playBeep(800, 0.4); }, 500);
        setPhase(false);
      } else {
        playBeep(500, 0.3);
        session++;
        sessionEl.textContent = "Session: " + session;
        setPhase(true);
      }
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }

  function start() {
    if (intervalId) return;
    if (remaining <= 0) setPhase(isWork);
    endTime = Date.now() + remaining * 1000;
    intervalId = setInterval(tick, 200);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    statusEl.textContent = isWork ? "Focusing..." : "On break...";
  }

  function pause() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
    remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    statusEl.textContent = "Paused.";
  }

  function reset() {
    clearInterval(intervalId);
    intervalId = null;
    session = 1;
    sessionEl.textContent = "Session: 1";
    setPhase(true);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    statusEl.textContent = "Ready to start.";
  }

  function skip() {
    clearInterval(intervalId);
    intervalId = null;
    if (isWork) {
      session++;
      sessionEl.textContent = "Session: " + session;
      setPhase(false);
    } else {
      setPhase(true);
    }
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  [workMins, breakMins].forEach(function (el) {
    el.addEventListener("change", function () {
      if (!intervalId && remaining <= 0) setPhase(isWork);
    });
  });

  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);
  skipBtn.addEventListener("click", skip);

  setPhase(true);
})();
